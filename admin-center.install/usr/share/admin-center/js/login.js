function loginManager(){
    this.waiting_for_response=false;
}

loginManager.prototype.getCertificates = function getCertificates(){
    $.get({url:"/public_key.pem",dataType:"text",mimeType:"text/plain charset=x-user-defined",success: function( data ) {
        sessionStorage.serverKey=data;
    }});  
};

loginManager.prototype.BindLoginEventHandlers = function BindLoginEventHandlers(){
    
    let self=this;

	$("#LoginButton").bind('click', function(){
        // Even managing click on login button
		// gets username, password and server, checks it
		// and stores in session.
        
        if (self.waiting_for_response) return false; // To avoid double click
        
        $('#LoginButton').prop("disabled", true);
        self.waiting_for_response=true;
        
        let username=$("#input_username").val();
		let password=$("#input_password").val();
		let server=location.host;
        //sessionStorage.server = server;
        sessionStorage.username = username;
		sessionStorage.password = password;
		sessionStorage.server = server;
        sessionStorage.groups=[];
        
        // Going to main window
        self.login();
	});
		
	$("#input_password").bind('keydown',function (e) {
		if (e.which==13) {
			e.preventDefault();
            if (self.waiting_for_response) return false; // To avoid double enter press
            $('#LoginButton').prop("disabled", true);
            self.waiting_for_response=true;
            
			let username=$("#input_username").val();
			let password=$("#input_password").val();
			let server=location.host;
			sessionStorage.username = username;
			sessionStorage.password = password;
            //alert(server);
			sessionStorage.server = server;

			self.login();
		}
    });		
};

loginManager.prototype.login = function login(){
    let self=this
    $("body").addClass("CursorWaiting")
    let credentials = ""
    let n4dclass = ""
    let n4dmethod = "validate_user"
    let arglist = [sessionStorage.username , sessionStorage.password]
  
    Utils.n4d(credentials, n4dclass, n4dmethod, arglist, function(response){
    
        // When gets a response, reenable login button
        $('#LoginButton').prop("disabled", false);
        self.waiting_for_response=false;
    
        try{
            let groups=response[1];
            sessionStorage.groups=groups;
            //alert(typeof(groups));
            if ((groups.indexOf('adm')!=-1)||(groups.indexOf('admins')!=-1)||(groups.indexOf('teachers')!=-1)) {
                window.location="main.php";
            } else{
                $("#input_password").addClass("wrong_pass");
                $("#input_username").addClass("wrong_pass");

                // Remove Session Storage
                if(sessionStorage.hasOwnProperty('server')){
                    sessionStorage.removeItem('server');
                }
                if(sessionStorage.hasOwnProperty('password')){
                    sessionStorage.removeItem('password');
                }
                if(sessionStorage.hasOwnProperty('username')){
                    sessionStorage.removeItem('username');
                }
                sessionStorage.clear();
                self.getCertificates(); // getting certificates into session
                //alert("Username or password error!");
            }
        }catch (e){
            let error_msg="Usuari o contrasenya no reconegut";
            if (navigator.language.substring(0,2)=="en"){
                error_msg="User or password unknown";
            }else{
                if (navigator.language.substring(0,2)=="es") error_msg="Usuario o contraseña no válidos";
            } 
            
            Utils.msg(error_msg, MSG_ERROR );

            // Remove Session Storage
            if(sessionStorage.hasOwnProperty('server')){
                sessionStorage.removeItem('server');
            }
            if(sessionStorage.hasOwnProperty('password')){
                sessionStorage.removeItem('password');
            }
            if(sessionStorage.hasOwnProperty('username')){
                sessionStorage.removeItem('username');
            }
            sessionStorage.clear();
            self.getCertificates(); // getting certificates into session
        }
    });
}

$(document).ready(function() {
	let lm = new loginManager();
	
    lm.getCertificates();
    lm.BindLoginEventHandlers();

	//$("#LoginButton").append("Login");
	
    $.material.init();

});
