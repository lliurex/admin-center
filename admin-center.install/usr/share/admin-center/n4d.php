<?php
include("./libphp/cryptojs-aes.php");

//require_once("logServer.php"); -> No s'usa!
//require_once('php_lib/wsclient/vendor/autoload.php'); -> No s'usa !
//use WebSocket\Client; -> No s'usa!


// require_once('php_lib/logListener.php');  -> S'utilitza?
// use logListener;  -> S'utilitza?


// Class for make n4d calls asyncronous
/*class n4dAsync extends Thread {
    public function run($method, $args) {
        n4d($method, $args);
    }
}*/
// End async


if(!session_id()) session_start();
//$logServer = new logServer();


function writeHeader(){
  header('Content-type: application/json');
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");
}


function n4dRSADecrypt($crypttext){
  $priv_key = openssl_pkey_get_private("file:///etc/admin-center/private_key.pem");
  openssl_private_decrypt(base64_decode($crypttext), $newsource, $priv_key );
  
  return $newsource;
}

function AESEncrypt($plain){  
  if (isset($_POST['pass'])) $pass=$_POST['pass'];
  else $pass="";  
  return cryptoJsAesEncrypt($pass, $plain);
}

function n4d($method, $args, $timeout){
  try{
    writeHeader();
    
    $url='https://127.0.0.1:9779';
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
      if( $request_error > 0 ){
        echo(AESEncrypt(json_encode(array('status'=> False, 'msg' => 'Curl error ' . strval($request_error))))); 
      }
      else{
        if ( (gettype($ch)!="unknown type") && $request_error ) {
          $xml_snippet=simplexml_load_string($data);
          $json=json_encode($xml_snippet);
          echo (AESEncrypt($json));
        } 
        else {
            $xmlobj=xmlrpc_decode($data);
            if (gettype($xmlobj)=="string") error_log($xmlobj);
            
            $json=json_encode($xmlobj);
            if ($json=="") {
              $json=$xmlobj;}
              # Store in session user groups
              if ($method=="validate_user"){
                $_SESSION['groups']=$xmlobj[1];
              }
            echo (AESEncrypt($json));
        }
      }
  } catch (Exception $e){
    error_log("$e->getMessage()");
    echo(AESEncrypt(json_encode(array('status'=> False, 'msg' => $e->getMessage()))));
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
  $enctype=$_POST["enctype"];
  $timeout=$_POST["timeout"];
  
  //error_log($_POST["args"]);
  //error_log($_POST["args"]);
  
  if ($enctype=="complete"){
    $args_coded=n4dRSADecrypt($_POST["args"]);
    $args=json_decode($args_coded);
    if (gettype($args)=="NULL") $args=array();
  } else {  // enctype=partial
      $args=json_decode($_POST["args"]);
      //error_log(n4dRSADecrypt($args[0]));
      if (gettype($args)=="NULL") $args=array();
      else $args[0]=json_decode(n4dRSADecrypt($args[0]));
  }
  
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
