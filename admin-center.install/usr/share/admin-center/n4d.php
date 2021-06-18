<?php
include("./libphp/cryptojs-aes.php");

if(!session_id()){
    session_start();
} 

function writeHeader(){
    header('Content-type: application/json');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
}

function n4dRSADecrypt($crypttext){
    $priv_key = openssl_pkey_get_private("file:///etc/admin-center/private_key.pem");
    openssl_private_decrypt(base64_decode($crypttext), $newsource, $priv_key);
    return $newsource;
}

// function AESEncrypt($plain){  
//   if (isset($_POST['pass'])) $pass=$_POST['pass'];
//   else $pass="";  
//   return cryptoJsAesEncrypt($pass, $plain);
// }

function n4dRSAEncrypt($plain){
    $max_size=117; // keybits = 1024
    if (isset($_POST['pass'])){
        $pass=$_POST['pass'];
    }else{
        $pass="";
    }
    $res = array();
    $input = str_split($plain,$max_size);
    for ($i=0;$i<count($input);$i++){
        $part = $input[$i];
        if (strlen($part) < $max_size){
            $part = str_pad($part,$max_size);
        }
        $part_res = '';
        openssl_public_encrypt($part,$part_res,$pass);
        $res[$i] = base64_encode($part_res);
    }
    $res = json_encode($res);
    return $res;
}

$core_functions = array('get_variable','get_variables');


function n4d($method, $args, $timeout){
    $DEBUG=false;
    try{
        writeHeader();
        $args = json_decode($args);
        if ($DEBUG){
            error_log("N4d call ".$method." with arguments1:".var_export($args,true));
        }
        for ($i=0;$i<count($args);$i++){
            $tmp1 = n4dRSADecrypt($args[$i]);
            $tmp2 = json_decode($tmp1);
            if (json_last_error()==JSON_ERROR_NONE){
                $args[$i] = $tmp2;
            }else{
                $args[$i] = $tmp1;
            }
        }
        $url='https://127.0.0.1:9779';
        if ($DEBUG){
            error_log("N4d call ".$method." with arguments2:".var_export($args,true));
        }
        $request=xmlrpc_encode_request($method, $args);
        //error_log($request);
        $header[] = "Content-type: text/xml";
        $header[] = "Content-length: ".strlen($request);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10000);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
      
        if ($timeout!="0"){
            curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);  // async
            curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);       // async
        }
    
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_CAINFO, getcwd() . "/n4dcert.pem");
        
        $data = curl_exec($ch);      
        $request_error = curl_errno($ch);
        curl_close($ch);
        $msg="";
        $noerror=true;
        $xmlobj=array();
        if( $request_error > 0 ){
            $noerror=false;
            $msg='Curl error '.strval($request_error); 
            error_log($msg);
        }
        if ( (gettype($ch)!="unknown type") && $request_error ) {
            $xml_snippet=simplexml_load_string($data);
            $msg=json_encode( $xml_snippet );
            $noerror=false;
            error_log($xml_snippet);
        }
        if ($noerror){
            $xmlobj=xmlrpc_decode($data);
         
            if (gettype($xmlobj)=="string"){
                error_log($xmlobj);
                $msg=$xmlobj;
                $noerror=false;
            }
            if (! array_key_exists("status",$xmlobj)){
                $msgerr = "Unknown response from n4d server, response without status";
                $msg .= $msgerr;
                error_log($msgerr);
                $noerror=false;
            }
            if ($xmlobj['status'] != 0){
                $msgerr = "N4d call seems failed!";
                if (array_key_exists('msg',$xmlobj)){
                    $msgerr .= ",".$xmlobj['msg'];
                }
                $msg .= $msgerr;
                error_log($msgerr);
                $noerror=false;
            }else{
                if (! array_key_exists("return",$xmlobj)){
                    $msgerr = "Unknown response from n4d server, successful request response without return";
                    $msg .= $msgerr;
                    error_log($msgerr);
                    $noerror=false;
                }
            }
        }
        if ($msg != ""){
            $xmlobj['return'] = $msg;
        }
        if ($DEBUG){
            error_log('N4d call successful');
        }
        $json = json_encode(array('status'=>$noerror,'return'=>$xmlobj['return']));
        if ($json == ""){
            $json = json_encode(array('status'=>$noerror,'return'=>json_decode($xmlobj['return'])));
        }
        # Store in session user groups
        if ($method=="validate_user"){
            $_SESSION['groups']=json_decode($json,true)['return'][1];
        }
        if ($DEBUG){
            error_log("N4d.PHP returns (before crypt) ".var_export($json,true));
        }
        $ret = n4dRSAEncrypt($json);
        if ($DEBUG){
            error_log("N4d.PHP returns ".var_export($ret,true));
        }
        echo $ret;
    } catch (Exception $e){
        error_log($e->getMessage());
        echo(n4dRSAEncrypt(json_encode(array('status'=> False, 'msg' => $e->getMessage()))));
    }  
}


function var_error_log( $object=null ){
    ob_start();                    // start buffer capture
    var_dump( $object );           // dump the values
    $contents = ob_get_contents(); // put the buffer into a variable
    ob_end_clean();                // end capture
    error_log( $contents );        // log contents of the result of var_dump( $object )
}



try{
    // Getting $_POST parameters
    $method=$_POST["method"];  
  //$enctype=$_POST["enctype"];
    $timeout=$_POST["timeout"];
    $args = $_POST["args"];
    
    //error_log("n4d.php data received:".var_export($_POST,true));
  
  // if ($enctype=="complete"){
  //   $args_coded=n4dRSADecrypt($_POST["args"]);
  //   $args=json_decode($args_coded);
  //   if (gettype($args)=="NULL") $args=array();
  // } else if ($enctype=="partial") {  // enctype=partial
  //     $args=json_decode($_POST["args"]);
  //     error_log("POST ARGS ".var_export($args,true)." with type ".var_export(gettype($args),true));
  //     //error_log(n4dRSADecrypt($args[0]));
  //     if (! in_array($method,$core_functions)){
  //       if (gettype($args)=="NULL"){
  //         $args=array();
  //       }else{
  //         if (gettype($args)=="array"){
  //           error_log("ARRAY BEFORE ".var_export($args,true)." with type ".var_export(gettype($args),true));
  //           for ($i = 0; $i < count($args); $i++){
  //             $args[$i]=json_decode(n4dRSADecrypt($args[$i]));
  //           } 
  //           error_log("ARRAY AFTER ".var_export($args,true)." with type ".var_export(gettype($args),true));
  //         }
  //         else{
  //           $args=array(json_decode(n4dRSADecrypt($args)));
  //         }
  //       }
  //     }
  // }
  //error_log("FINAL POSSST ".var_export($args,true));
  /*
   $myfile = fopen("/tmp/n4dlog","a");
  fwrite($myfile,"\nMETHOD:\n");
  fwrite($myfile,$method);
  fwrite($myfile,"\nARGS IN POST:\n");
  fwrite($myfile,$_POST["args"]);
  
  fwrite($myfile,"\nTYPE ARGS IN POST:\n");
  fwrite($myfile, gettype($_POST["args"]));
  
  fwrite($myfile,"\nARGS CODED:\n");
  fwrite($myfile, $args_coded);
  
  fwrite($myfile,"\nTYPE ARGS CODED:\n");
  fwrite($myfile, gettype($args_coded));
  
  fwrite($myfile,"\nARGS DECODED:\n");
  fwrite($myfile, print_r($args, true));
  //fwrite($myfile, $args);
  fwrite($myfile,"\nARGS DECODED TYPE:\n");
  fwrite($myfile, gettype($args));
  
  fwrite($myfile,"******\n\n");
  fclose($myfile);
  error_log($method);
   */
  
  if (isset($_POST['log'])) $log=$_POST["log"];
    else $log="false";
    
  n4d($method, $args, $timeout);
  //$n4d_async = new n4dAsync();
  //$n4d_async ->start($method, $args);
 
} catch(Exception $e){
    error_log("Exception in n4d.php: ".$e);
}
?>
