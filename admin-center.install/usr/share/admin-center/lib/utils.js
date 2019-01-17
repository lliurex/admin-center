// Common Utility Functions

const MSG_INFO=0;
const MSG_ERROR=1;
const MSG_SUCCESS=2;

function UtilsClass(){
	// Utilities collection
	this.activeWebSockets=[];
	this.logfilesadded=0;
	this.maxlogfilesadded=50;
	this.formFactory=new formFactory();
	this.crypt=new JSEncrypt(); // Class to encrypt and decrypt keys
	//this.crypt.default_key_size=8192;
	this.crypt.default_key_size=2048;
	
	this.showMarkDown=new showdown.Converter();
}

UtilsClass.prototype._=function _(text){
  return ( i18n.gettext("main", text));
};


UtilsClass.prototype.msg=function msg(message, type){

	//msnackBar.setBackgroundColor(Color.parseColor("#009688"));
	var bg;
	var divloginicontype;

	if (type==MSG_SUCCESS){
		  icon="msg_success.png";
		  divloginicontype="url(css/img/icon-check.png)";
		  bg="#4caf50";
	} else if (type==MSG_ERROR){
			icon="msg_error.png";
			divloginicontype="url(css/img/icon-error.png)";
			bg="#f44336";
	} else if (type==MSG_INFO){
			icon="msg_info.png";
			bg="#2196f3";
			divloginicontype="url(css/img/info.png)";
			}
		else{
			icon="default.png";
		}

		
		// Prepare snackbar
		var snackbarmsg="<div class='snackContainer'>"+
		"<div class='snackicon' style='background-image:url(icones/"+
						icon+")'></div><div class='snack_msg'>"+message+"</div></div>";
		
		// Prepare bottom log line (module, date, icon and message)
		var dt = new Date();
		var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
		
		var currentmodulediv = $('.moduleWindow').filter(function () { 
			return this.style.display == 'block';
		});
		
		var currentmodule="[ AdminCenter ]";
		if (currentmodulediv.length===1) currentmodule="[ "+ $(currentmodulediv).attr("id") +" ]";
		
		
		var divlog=$(document.createElement("div")).addClass("divlogline divloglineactive");
		var divlogmodule=$(document.createElement("span")).addClass("divloglinemodule");
		var divlogtime=$(document.createElement("span")).addClass("divloglinetime");
		var divlogicon=$(document.createElement("span")).addClass("divloglineicon");
		var divlogmsg=$(document.createElement("span")).addClass("divloglinemsg");
		
		divlogtime.html("["+time+"]");
		divlogmodule.html(currentmodule);
		divlogmsg.html(message);
		//divlogicon.css("background-image", "url(css/img/delete.png)");
		
		divlogicon.css("background-image", divloginicontype);
		divlog.append(divlogmodule, divlogtime, divlogicon, divlogmsg);
		
		$("#AdminCenterFooter").prepend(divlog);
		
		$("#snack").attr("data-content", snackbarmsg);
		$("#snack").snackbar("show").css("background",bg);

};


UtilsClass.prototype.n4dCall=function n4dCall(credentials, n4dclass, n4dmethod, arglist, callback){
	/*
	Alert: Unrecommended function!
	Performs an XMLRPC call to a remote n4d method.
	This function needs to accept n4d certificates into browser
	To avoid it, is recommended to use Utils.n4d instead of this
	*/
   var self=this;
  // Build n4d arglist with class name
	var n4dargs=[credentials];
	n4dargs=n4dargs.concat(n4dclass);
	if (arglist.length>0) n4dargs=n4dargs.concat(arglist);
	$.xmlrpc({
		url: 'https://'+sessionStorage.server+':9779',
		methodName: n4dmethod,
		params: n4dargs,
		success: function(response,status,jqXHR){
			callback(response,status,jqXHR);
		},
		error: function(jqXHR, status, error) {
			 self.msg(i18n.gettext("main", "N4d.Error.Connection"));
		}
	});
};

/*
UtilsClass.prototype.showWSListener=function showWSListener(port, sport, srv_job_id=-1, target_id=null){
	var self=this;
	// 1st Preparing log window
	
	//var logJobId="job1";
	var logJobId="job_port"+sport; // logJobId is job_port+server_port. srv_job_id is job id on server.
	
	var modaldiv=$(document.createElement("div")).attr("id", logJobId).addClass("modal");
	var modaldlg=$(document.createElement("div")).addClass("modal-dialog");
	var modalcnt=$(document.createElement("div")).addClass("modal-content");
	
	var modaltitle=$(document.createElement("h4")).addClass("modal-title").html("WIP");
	var modalheader=$(document.createElement("div")).addClass("modal-header");
	$(modalheader).append(modaltitle);
	
	var modalbody=$(document.createElement("div")).addClass("modal-body");
	var modallog=$(document.createElement("div")).addClass("modal-content-log").attr("id", "job1").html("Server log...");
	$(modalbody).append(modallog);
	
	var modalfooter=$(document.createElement("div")).addClass("modal-footer");
	var bt1=$(document.createElement("button")).addClass("btn btn-primary").attr("id", "logviewer_bt1").attr("targetjob", logJobId).html(("Close log"));
	var bt2=$(document.createElement("button")).addClass("btn btn-primary").attr("id", "logviewer_bt2");
	$(bt2).attr("targetjob", logJobId).attr("srv_job_id", srv_job_id).html(("Cancel task"));
	$(bt2).attr("target_id", logJobId).attr("target_id",target_id);

	$(modalfooter).append(bt1).append(bt2);
	
	$(modalcnt).append(modalheader);
	$(modalcnt).append(modalbody);
	$(modalcnt).append(modalfooter);
	
	$(modaldlg).append(modalcnt);
	$(modaldiv).append(modaldlg);
	
	$("body").prepend(modaldiv);
	
	$(".modal").hide();
	$(modaldiv).show();
	
	// 1.1. Preparing buttons for cancel and close
	
	$(bt1).on("click", function(event){
		var jobid=$(event.target).attr("targetjob");
			$("#"+jobid).fadeOut();
			for (var i in self.activeWebSockets) {
				//console.log(self.activeWebSockets);
				//console.log(self.activeWebSockets[i].job);
				//console.log(self.activeWebSockets[i].jobid);
                if (self.activeWebSockets[i].job===jobid) {
					var port_to_close=self.activeWebSockets[i].ws.url.split(":")[2].split("/")[0];
					
					self.n4d([sessionStorage.username , sessionStorage.password],
							 "LogManager",
							 "closeConnection",
							 [port_to_close],
							 //null
							 function finish_close_socket(){
								//self.activeWebSockets[i].ws.close();
								//self.activeWebSockets.splice(i,1);						
								});
					
                    
					//console.log(self.activeWebSockets);
					break;
                }
            }
		});
	
	$(bt2).on("click", function(event){
			
			var text=self._("main_confirm_cancel_task");
			var srv_job_id=$(event.target).attr("srv_job_id");
			var targetid=$(event.target).attr("target_id");
			alert("cancel "+srv_job_id+ "target: "+targetid);
			
			bootbox.confirm(text, function(res){
            if (res) {
				var jobid=$(event.target).attr("targetjob");
				var srv_port=jobid.substring(8, jobid.length);
				var srv_job_id=$(event.target).attr("srv_job_id");
				
				
			
				var credentials=[sessionStorage.username , sessionStorage.password];
				var n4dclass="LogManager";
				var n4dmethod="cancelJob";
				var arglist=[srv_port, srv_job_id];
				try {
					Utils.n4d(credentials, n4dclass, n4dmethod, arglist, function(response){
						self.msg(self._("main_task_cancelled"), MSG_SUCCESS);
						console.log(targetid);
						var div_to_remove=$("#llx-ltsp-imagelist").find("[target_id='"+targetid+"']");
						console.log(div_to_remove);
						$(div_to_remove).remove();
						console.log(response);
						});
				}catch(error){
					self.msg("Error: "+error, MSG_ERROR);
				}
				
				$("#logviewer_bt1").trigger("click");
               }
            });
		});
	
	// 2nd Prepare Listener through websocket
	 var wsUri = "ws://"+sessionStorage.server +":"+port;
     websocket = new WebSocket(wsUri);        
     websocket.onopen = function() { // connection is open 
        $(modallog).append("<div>"+self._("main_log_connected_message")+"</div>"); //notify user
     };
	 
	  websocket.onmessage = function(ev) {
				//console.log(ev);
				//console.log(ev.data);
				
				var data_string=ev.data;
				
				// Removing ip from ev.data --> ja no cal!!
				//var n = data_string.indexOf("{");
				//var sub=data_string.substring(n, data_string.length);
				var sub=data_string;
				
                var msg = JSON.parse(sub); //PHP sends Json data
				//  /^\[[^]*%$/
				//console.log("!!!!!!!!!·$$$$$ª!!!!!!!!!!!!!!!");
				msgtext=atob(msg.msg);
				// WIP FOR PROGRESS BAR
				//console.log(msgtext);
				//console.log(/^\[[^]*%$/.test(msgtext) );
				//if ( /^\[[^]*%$/.test(msgtext) )  console.log("MATCHES *****");
				//console.log("#################################");
				
				$(modallog).append("<div>"+atob(msg.msg)+"</div>");
				
				if (typeof(msg.type)!="undefined" && msg.type==="end_signal") {
					websocket.close();
                }
        };
		
		// Adding job/socket to active websockets
		self.activeWebSockets.push({job:logJobId, ws:websocket});
        
        websocket.onerror       = function(ev){self.msg("log_connection_error", MSG_ERROR);}
        websocket.onclose       = function(ev){self.msg("log_connection_closed", MSG_INFO);}

	
};
*/


UtilsClass.prototype.listenJob=function listenJob(jobid=0){
   var self=this;
   // 1srt... call to acquire a websocket on
   //console.log("***-"+jobid);
    self.n4d("", "TaskMan", "getWS", [], function(response){
			//console.log(response);
			/* getWS is the server websocket  */
			if (response.status) {
				var ws=response.ws; //response.ws is server websocket
				// A little hack of my friends...
				ws=ws.replace("127.0.0.1", location.host);
				self.showWSListener(ws, jobid);
				
			}	
    });	
};

UtilsClass.prototype.showWSListener=function showWSListener(ws, jobid=0){
	var self=this;
	
	// 1st Preparing log window
	
	var logJobId="logjob"+jobid;
		
	var modaldiv=$(document.createElement("div")).attr("id", logJobId).addClass("modal");
	var modaldlg=$(document.createElement("div")).addClass("modal-dialog");
	var modalcnt=$(document.createElement("div")).addClass("modal-content");
	
	var modaltitle=$(document.createElement("h4")).addClass("modal-title").html(self._("WIP"));
	var modalheader=$(document.createElement("div")).addClass("modal-header");
	$(modalheader).append(modaltitle);
	
	var modalbody=$(document.createElement("div")).addClass("modal-body");
	var modallog=$(document.createElement("div")).addClass("modal-content-log").attr("id", "job1").html(self._("Server log..."));
	$(modalbody).append(modallog);
	
	var modalProgressContainer=$(document.createElement("div")).addClass("progress-container progress progress-striped active").attr("id", "progress-container").css({"height":"32px", "background":"rgba(0,0,0,0)"});
	var modalProgress=$(document.createElement("div")).addClass("progress-bar progress-bar-info").attr("id", "modal-progress-bar").css({"width":"0%", "height":"24px"});
	$(modalProgressContainer).append(modalProgress);
	
	$(modalbody).append(modalProgressContainer);
	
	var modalfooter=$(document.createElement("div")).addClass("modal-footer");
	
	var btClose=$(document.createElement("button")).addClass("btn btn-primary").attr("id", "logviewer_btClose").attr("targetjob", logJobId).html(i18n.gettext("main", "Close_log"));
	var btStop=$(document.createElement("button")).addClass("btn btn-primary").attr("id", "logviewer_btStop");
	// logjob id will be: "logjobXXXX"
	// where xXX is jobid.
	// and any container will have a logjob attribute tu know where tasks are cancelled...
	$(btStop).attr("targetjob", logJobId).html(("Cancel task"));
	//$(btStop).attr("target_id", logJobId).attr("target_id",target_id);

	$(modalfooter).append(btClose).append(btStop);
	
	$(modalcnt).append(modalheader);
	$(modalcnt).append(modalbody);
	$(modalcnt).append(modalfooter);
	
	$(modaldlg).append(modalcnt);
	$(modaldiv).append(modaldlg);
	
	$("body").prepend(modaldiv);
	
	$(".modal").hide();
	$(modaldiv).show();
	
	// 1.1. Preparing buttons for cancel and close
	
	$(btClose).on("click", function(event){
		var jobid=$(event.target).attr("targetjob");
			$("#"+jobid).fadeOut();
			for (var i in self.activeWebSockets) {
	            if (self.activeWebSockets[i].job===jobid) {
					self.activeWebSockets[i].ws.close();
					self.activeWebSockets.splice(i,1);
					break;
                }
            }
		});
	
	$(btStop).on("click", function(event){
			
			var text=self._("main_confirm_cancel_task");
			var srv_job_id=$(event.target).attr("targetjob");
			//alert("cancel "+srv_job_id);
			
			bootbox.confirm(text, function(res){
            if (res) {
				var jobid=srv_job_id.substring(6, srv_job_id.length);
										
				var credentials=[sessionStorage.username , sessionStorage.password];
				var n4dclass="TaskMan";
				var n4dmethod="cancelTask";
				var arglist=[jobid];
				try {
					Utils.n4d(credentials, n4dclass, n4dmethod, arglist, function(response){
						if (response.status)
							self.msg(self._("main_task_cancelled"), MSG_SUCCESS);
						else
							self.msg("Error cancelling task: "+(response.msg), MSG_ERROR);
							
							// Faig un trigger per a que s'enteren que s'ha cancelat??
							
						
						//console.log(response);
						});
				}catch(error){
					self.msg("Error: "+error, MSG_ERROR);
				}
				
				$("#logviewer_logviewer_btClose").trigger("click");
               }
            });
		});
	
	// 2nd Prepare Listener through websocket
	 //var wsUri = "ws://"+sessionStorage.server +":"+port;
	 ///console.log("KKKKKKKKKKKKKKK "+jobid);
     websocket = new WebSocket(ws+"/"+jobid);
	 ///console.log("QQQQQQQQQQQQQQQQQQ "+jobid);
	 //console.log(websocket);
     websocket.onopen = function() { // connection is open
		self.logfilesadded=0;
        $(modallog).append("<div>"+self._("main_log_connected_message")+"</div>"); //notify user
     };
	 
	  websocket.onmessage = function(ev) {
			//console.log(ev.data);
			var data_string=ev.data;
			var sub=data_string;
               var msg = JSON.parse(sub); //PHP sends Json data				
			msgtext=atob(msg.msg);
			
			
			
			/* Update progress bar  */
			var msgtxt=msgtext.replace(" ", "").replace("\t", "").replace("\n", "");
			msgtxt=msgtext.replace(new RegExp(String.fromCharCode(13), 'g'), '');
			if (msgtxt[0]=="[" && msgtxt[msgtxt.length-1]=="%"){
			//if (/^\[[^]*%$/.test(msgtext)){
				progress_text=msgtext.replace(/\s\s+/g, ' ');
				progress_array=progress_text.split(" ");
				percent=progress_array[progress_array.length-1];
				$("#modal-progress-bar").css("width", percent).html(percent);
			} 
			else {
				// Or add text to log
				$(modallog).append("<div>"+msgtext+"</div>");
				self.logfilesadded++;
				if (msgtext.indexOf("[TASKMANAGER] process finished")!=-1) {
					$("#progress-container").removeClass("active");
					$("#logviewer_btStop").removeClass("btn-primary");
					$("#logviewer_btStop").off("click");
					$("#modal-progress-bar").removeClass("progress-bar-info").addClass("progress-bar-success");
				}
				
			}
			
			// Avoid to grow log content divs more than "maxlogfilesadded"
			if (self.logfilesadded>=self.maxlogfilesadded)
				$(modallog).children().first().remove();
				
			//console.log(typeof(msg.type));
			if (typeof(msg.type)!="undefined" && msg.type==="end_signal") {
				//console.log("CLOSING...");
				websocket.close();
            }
        };
		
		// Adding job/socket to active websockets
		self.activeWebSockets.push({job:logJobId, ws:websocket});
        
        websocket.onerror       = function(ev){self.msg("log_connection_error", MSG_ERROR);}
        websocket.onclose       = function(ev){self.msg("log_connection_closed", MSG_INFO);}

	
};





UtilsClass.prototype.n4dSecure=function n4dSecure(credentials, n4dclass, n4dmethod, arglist, callback, timeout=10){
   var self=this;

	var n4dargs=[];

	// Building credentials
	if(credentials===null || credentials===""){
		//alert("credentials is: "+credentials);
		n4dargs.push("");}
	else if (n4dmethod!="validate_user") n4dargs[0]=credentials;
			else n4dargs=credentials;

	// Adding Class
	n4dargs.push(n4dclass);
	//console.log(n4dargs);
	//alert(typeof(n4dargs));
	
	// Adding argument list

	for (var i in arglist) n4dargs.push(arglist[i]);

	//console.log(n4dargs);
	
	// Calling method
	//console.log("-----------------------------1");
	//console.log(JSON.stringify(n4dargs));
	//console.log("-----------------------------2");
	// Set public key for this connection with serverKey
	Utils.crypt.setPublicKey(sessionStorage.serverKey);
	$("body").css("cursor", "wait");
	//$.post('n4d.php',
	$.ajax(
		{url:'n4d.php',
		method: 'POST',
		async: true,
		data: {
			method: n4dmethod,
			enctype: "complete",
			args: Utils.crypt.encrypt(JSON.stringify(n4dargs)),
			pass: sessionStorage.password,
			timeout: timeout},
		//args: n4dargs},
		success: function(ret_coded){
			try{
				/*console.log("Method was:" + n4dmethod);
				console.log("RET:");
				console.log(ret_coded+" is "+typeof(ret_coded));
				console.log("RET2:");
				console.log(JSON.stringify(ret_coded)+" is "+typeof(JSON.stringify(ret_coded)));*/
				
				$("body").css("cursor", "default");
				//console.log(ret_coded);
				
				ret_str_1=(CryptoJS.AES.decrypt(JSON.stringify(ret_coded), sessionStorage.password,{format: CryptoJSAesJson}));
				//console.log(ret_str_1 + " is "+typeof(ret_str_1));
				
				ret_str=(CryptoJS.AES.decrypt(JSON.stringify(ret_coded), sessionStorage.password,{format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
				
				var ret=JSON.parse(JSON.parse(ret_str));
				
				
				callback(ret);
				} catch(err){
					alert(err);
					callback("Error!");
				}
		},error(){
			$("body").css("cursor", "default");
			msg=_("N4d.Error.Connection");
			self.msg(msg, MSG_ERROR);
		}
    }); // End $post

};



UtilsClass.prototype.n4d=function n4d(credentials, n4dclass, n4dmethod, arglist, callback, timeout=10){
   var self=this;

	var n4dargs=[];

	// Building credentials
	Utils.crypt.setPublicKey(sessionStorage.serverKey);
	if(credentials===null || credentials===""){
		//alert("credentials empty");
		n4dargs.push("");}
    else {
		//alert(credentials);
		n4dargs.push(Utils.crypt.encrypt(JSON.stringify(credentials)));
	}
	//else if (n4dmethod!="validate_user") n4dargs[0]=Utils.crypt.encrypt(credentials);
	//		else n4dargs=Utils.crypt.encrypt(credentials);

	// Adding Class
	n4dargs.push(n4dclass);
	//console.log(n4dargs);
	//alert(typeof(n4dargs));
	
	// Adding argument list

	for (var i in arglist) n4dargs.push(arglist[i]);
	
	// Calling method
	//console.log("-----------------------------1");
	//console.log(JSON.stringify(n4dargs));
	//console.log("-----------------------------2");
	// Set public key for this connection with serverKey
	
	$("body").css("cursor", "wait");
	//$.post('n4d.php',
	$.ajax(
		{url:'n4d.php',
		method: 'POST',
		async: true,
		data: {
			method: n4dmethod,
			/*args: Utils.crypt.encrypt(JSON.stringify(n4dargs)),*/
			enctype: "partial",
			args: JSON.stringify(n4dargs),
			pass: sessionStorage.password,
			timeout: timeout},
		//args: n4dargs},
		success: function(ret_coded){
			try{
				/*console.log("Method was:" + n4dmethod);
				console.log("RET:");
				console.log(ret_coded+" is "+typeof(ret_coded));
				console.log("RET2:");
				console.log(JSON.stringify(ret_coded)+" is "+typeof(JSON.stringify(ret_coded)));*/
				
				$("body").css("cursor", "default");
				//console.log(ret_coded);
				
				ret_str_1=(CryptoJS.AES.decrypt(JSON.stringify(ret_coded), sessionStorage.password,{format: CryptoJSAesJson}));
				//console.log(ret_str_1 + " is "+typeof(ret_str_1));
				
				ret_str=(CryptoJS.AES.decrypt(JSON.stringify(ret_coded), sessionStorage.password,{format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
				
				var ret=JSON.parse(JSON.parse(ret_str));
				
				
				callback(ret);
				} catch(err){
					alert(err);
					callback("Error!");
				}
		},error(){
			$("body").css("cursor", "default");
			msg=_("N4d.Error.Connection");
			self.msg(msg, MSG_ERROR);
		}
    }); // End $post

};




UtilsClass.prototype.n4dWithExtraParams=function n4dWithExtraParams(credentials, n4dclass, n4dmethod, ip, port, arglist, callback){
	var self=this;

	var n4dargs=[];

	// Building credentials
	if(credentials===null || credentials===""){
		//alert("credentials is: "+credentials);
		n4dargs.push("");}
	else if (n4dmethod!="validate_user") n4dargs[0]=credentials;
			else n4dargs=credentials;

	// Adding Class
	n4dargs.push(n4dclass);

	// Add Extra info: info + port
	n4dargs.push(ip);
	n4dargs.push(port);


	for (var i in arglist) n4dargs.push(arglist[i]);
	
	// Set public key for this connection with serverKey
	Utils.crypt.setPublicKey(sessionStorage.serverKey);
	
	$.ajax(
		   {url: 'n4d.php',
		   method: 'POST',
		   async: true,
		   data:{ method: n4dmethod,
				  //args: JSON.stringify(n4dargs)},
				  args: Utils.crypt.encrypt(JSON.stringify(n4dargs))},
		   success: function(args){
			             callback(args);
					},
			error: function(jqXHR, status, error) {
			 self.msg(i18n.gettext("main", "N4d.Error.Connection"));
		    }
		});
	
};


UtilsClass.prototype.n4dWithLog=function n4dWithLog(credentials, n4dclass, n4dmethod, arglist, drawItemFunc){
   var self=this;
   // 1srt... call to acquire a websocket on
		//(credentials, n4dclass, n4dmethod, arglist, callback){
    self.n4d("", "TaskMan", "getWS", [], function(response){
			/* getWS is the server websocket  */
			if (response.status) {
				// var ws=response.ws; //response.ws is server websocket
				// Hacking it...
				 var ws=response.ws; //response.ws is server websocket
				 ws=ws.replace("127.0.0.1", location.host);
				//console.log(response.ws);
				self.n4d([sessionStorage.username , sessionStorage.password],
					n4dclass,
					n4dmethod,
					arglist,
					function (resp){
						if (resp.status){
							var taskid=resp.msg;
							self.showWSListener(ws, taskid);
						} else {
							self.msg(resp.msg, MSG_ERROR);
							ws.close();
						}
					});
			}				
    });

};

/*
Posar les finestres modals en altra subclasse dins de utils, amb els metodes
SetTitle
SetContent
SetStatus (Loading, Waiting for user interaction, etc...)

*/

/*UtilsClass.prototype.loadHelpFile=function loadHelpFile(fullpath){
	var ret;
	var self=this; 
	try{
		$.ajax({
		url: fullpath,
		success: function(message){
			bootbox.alert(self.showMarkDown.makeHtml(message));
			self.return(true);
			},
		error: function (){
			alert("Failed loading "+fullpath);
			self.return(true);
			}
		});
	}
	catch(err){
		self.return(false);
		}
		
	
}*/

UtilsClass.prototype.showHelp=function showHelp(path, file, get_default_lang=false){
	var self=this;

	var fullpath="modules/"+path+"/src/help/"+navigator.language+"/"+file;
	if (get_default_lang) fullpath="modules/"+path+"/src/help/ca-ES@valencia/"+file;
	
	//var fullpath="modules/"+path+"/src/help/es-ES/"+file;
	//var success=self.loadHelpFile(fullpath);
	
	$.ajax({
		url: fullpath,
		success: function(msg){
			bootbox.alert({size: "large", message: self.showMarkDown.makeHtml(msg)});
			},
		error: function (){
			if (get_default_lang)
				bootbox.alert("No help file found!");
			else self.showHelp(path, file, true);

			}
		});
	
		
	/*if (!success) {alert("111::");return 0;} // if help file does noet exists for current lang, check other languages
	/*else if (self.loadHelpFile("modules/"+path+"/src/help/ca-ES/"+file))  {alert("2222222");return 0;} 
	else if (self.loadHelpFile("modules/"+path+"/src/help/es-ES/"+file))  {alert("3333333");return 0;} 
	else {self.loadHelpFile("modules/"+path+"/src/help/en-US/"+file); alert("4444444");}
	return 0;*/
}

UtilsClass.prototype.waitwin=new WaitWin();
Utils=new UtilsClass();
