<?php 
class N4D{

    function __construct($server){
        $this->server = $server;
    }

    public function execute( $method, $args, $timeout = 0 ){
        $url = "https://".$this->server . ":9779";
        $request = xmlrpc_encode_request($method, $args);

        $this->curl = curl_init();
        $header[] = "Content-type: text/xml";
        $header[] = "Content-length: ".strlen($request);

        curl_setopt($this->curl, CURLOPT_URL, $url);
        curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($this->curl, CURLOPT_TIMEOUT, 10000);
        curl_setopt($this->curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($this->curl, CURLOPT_POSTFIELDS, $request);

        if ($timeout!="0"){
            curl_setopt($this->curl, CURLOPT_FRESH_CONNECT, true);  // async
            curl_setopt($this->curl, CURLOPT_TIMEOUT, $timeout);       // async
        }

        curl_setopt($this->curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($this->curl, CURLOPT_SSL_VERIFYHOST, 0);
        //curl_setopt($this->curl, CURLOPT_CAINFO, getcwd() . "/n4dcert.pem");

        $resultrequest = curl_exec($this->curl);
        $request_error = curl_errno($this->curl);
        curl_close($this->curl);

        // Request fail.
        if ($request_error > 0 ){
            throw new Exception('Curl exception ' . strval($request_error));
        }


        // This code is needed ????
        // if ( gettype($)!="unknown type" && $request_error ) {
        //     $xml_snippet = simplexml_load_string($data);
        //     $json = json_encode($xml_snippet);
        //     return $json;
        // }

        $result = xmlrpc_decode($resultrequest);
        return $result;
    }
}
?>
