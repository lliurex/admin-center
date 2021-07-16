
function AdminCenter(){
  this.ServerConfig=null;
  this.loadedModules=[];
	this.history=["info"];
	this.lastScrollTop=0;


  // class vars to keep syncronous calls by module
  this.componentsLoaded=0;
  this.scriptsLoaded=0;
}
AdminCenter.prototype.checkVariableExists = function checkVariableExists(variable,patharray){

	let auxparent = variable,
	    imax = patharray.length,
	    i;
	for ( i = 0 ; i < imax; i++){
		if ( ! auxparent.hasOwnProperty(patharray[i])){return false};
		auxparent = auxparent[patharray[i]];
		if (auxparent === null && (i + 1 < imax)){return false};
	}
	return true;
}
AdminCenter.prototype.getServerInfo = function getServerInfo(){
  var self=this;
  credentials=null;
  //n4dclass='VariablesManager';
  n4dclass=null;
  n4dmethod='get_variables';
  arglist="";
  Utils.n4d(credentials, n4dclass, n4dmethod, arglist, function(args){

    var ServerConfig=args;
    self.ServerConfig=ServerConfig;
    if ( self.checkVariableExists(ServerConfig,['SRV_IP']) ) $("#serverInfo_SRV_IP").html(ServerConfig["SRV_IP"]);
    if ( self.checkVariableExists(ServerConfig,['HOSTNAME']) ) $("#serverInfo_HOSTNAME").html(ServerConfig["HOSTNAME"]);
    if ( self.checkVariableExists(ServerConfig,['INTERNAL_DOMAIN']) )$("#serverInfo_INTERNAL_DOMAIN").html(ServerConfig["INTERNAL_DOMAIN"]);
    if ( self.checkVariableExists(ServerConfig,['INTERNAL_INTERFACE']) ) $("#serverInfo_INTERNAL_INTERFACE").html(ServerConfig["INTERNAL_INTERFACE"]);
    if ( self.checkVariableExists(ServerConfig,['EXTERNAL_INTERFACE']) ) $("#serverInfo_EXTERNAL_INTERFACE").html(ServerConfig["EXTERNAL_INTERFACE"]);
    if ( self.checkVariableExists(ServerConfig,['INTERNAL_MASK']) ) $("#serverInfo_INTERNAL_MASK").html(ServerConfig["INTERNAL_MASK"]);
    if ( self.checkVariableExists(ServerConfig,['INTERNAL_NETWORK']) ) $("#serverInfo_INTERNAL_NETWORK").html(ServerConfig["INTERNAL_NETWORK"]);
    if ( self.checkVariableExists(ServerConfig,['DNS_EXTERNAL',0]) ) { $("#serverInfo_DNS1").html(ServerConfig["DNS_EXTERNAL"][0]);} 
    if ( self.checkVariableExists(ServerConfig,['DNS_EXTERNAL',1]) ) { $("#serverInfo_DNS2").html(ServerConfig["DNS_EXTERNAL"][1]);}

    if ( self.checkVariableExists(ServerConfig,['DHCP_ENABLE']) ) $("#serverInfo_DHCP_ENABLE").html(ServerConfig["DHCP_ENABLE"]);
    if ( self.checkVariableExists(ServerConfig,['DHCP_FIRST_IP']) & self.checkVariableExists(ServerConfig,['DHCP_LAST_IP'])  ) $("#serverInfo_IP_RANGE").html(ServerConfig["DHCP_FIRST_IP"]+"<br/>"+ServerConfig["DHCP_LAST_IP"]);
    if ( self.checkVariableExists(ServerConfig,['DHCP_HOST_MAX']) ) $("#serverInfo_DHCP_HOST_MAX").html(ServerConfig["DHCP_HOST_MAX"]);

    if ( self.checkVariableExists(ServerConfig,['LLIUREXMIRROR','llx21','last_mirror_date']) ) $("#serverInfo_LAST_MIRROR_DATE").html(ServerConfig["LLIUREXMIRROR"]["llx21"]["last_mirror_date"]);
    if ( self.checkVariableExists(ServerConfig,['LLIUREXMIRROR','llx21','mirror_size']) ) $("#serverInfo_MIRROR_SIZE").html(Number.parseFloat(ServerConfig["LLIUREXMIRROR"]["llx21"]["mirror_size"]).toFixed(2));

    if ( self.checkVariableExists(ServerConfig,['PROXY_ENABLED']) ) $("#serverInfo_PROXY_ENABLED").html(ServerConfig["PROXY_ENABLED"]);
    if ( self.checkVariableExists(ServerConfig,['PROXY_HOST']) ) $("#serverInfo_PROXY_HOST").html(ServerConfig["PROXY_HOST"]);
    if ( self.checkVariableExists(ServerConfig,['PROXY_HTTP_PORT']) ) $("#serverInfo_PROXY_HTTPORT").html(ServerConfig["PROXY_HTTP_PORT"]);

  });

  n4dclass="LliurexVersion";
  n4dmethod='lliurex_version';
  arglist="";
  Utils.n4d(credentials, n4dclass, n4dmethod, arglist, function(args){

    $("#serverInfo_LLIUREX_VERSION").html(args);

  });
}


AdminCenter.prototype.resetSyncCounters = function resetSyncCounters(){
  var self=this;
  self.componentsLoaded=0;
  self.scriptsLoaded=0;
}

AdminCenter.prototype.loadModuleFiles=function loadModuleFiles(target, componentsToLoad, moduleStyles, moduleScripts){
  var self=this;
  self.componentsLoaded++;
  console.log("Increaseing self.componentsloaded to "+self.componentsLoaded);
  if(self.componentsLoaded<componentsToLoad) return;

  // All components are loaded.
  // Loading Styles now

  for (i in moduleStyles)  {
    var date=new Date;
    var textlink="<link rel='stylesheet' type='text/css' href='"+moduleStyles[i]+"?date="+date+"'>";
    var cssLink = $(textlink);
   $("head").append(cssLink);
  }

  // And finally scripts
  for (i in moduleScripts)  {
    $.ajax({
            url: moduleScripts[i],
            dataType: 'script',
            success: function(){
              self.initModule(target, Object.keys(moduleScripts).length); // Call to initialize module scripts if it is needed
            },
            async: true
        });
  }
}

AdminCenter.prototype.initModule=function initModule(target, moduleScriptsLength){
  // Initializes loaded module. When all elements of module has been loaded,
  // triggers event "moduleLoaded", and {"moduleName":target} as parameter.
  var self=this;
  self.scriptsLoaded++;
  console.log("Increaseing self.scriptsloaded to "+self.scriptsLoaded);
  
  //if(self.componentsLoaded<=moduleScriptsLength) return;
  if(self.scriptsLoaded<moduleScriptsLength) return;
  
  // Send Event moduleLoaded
  console.log("Triggering moduleLoaded to: "+target);
  $(document).trigger("moduleLoaded", {"moduleName":target});
  $(".moduleWindow").hide();
  $("#"+target).show();
  //alert("Loading: "+target);
	
	// Bind scroll event
	$(".moduleWindow").on("scroll", function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		
		var st = $(this).scrollTop();
   if (st > self.lastScrollTop){
		if ($(this).scrollTop()>0) 
				{
					$("#AdminCenterTopBack").css("height", 50);
					$("body").css("padding-top", 30);
					$("#AdminCenterTopBack").css("filter", "opacity(0%)");
					$(".container").css("margin-bottom", 150);
				}
   } else {
		if (($(this).scrollTop()<=50)) {
				$("#AdminCenterTopBack").css("height", 175);
				$("body").css("padding-top", 150);
				$("#AdminCenterTopBack").css("filter", "opacity(100%)");
				$(".container").css("margin-bottom", 15);
			}
   }
	 self.lastScrollTop= st;
		
			 
				/*console.log($(this).scrollTop());
				console.log($(this).innerHeight());
				console.log($(this)[0].scrollHeight);
				console.log(ev);*/
	});
	
  $.material.init();

}



AdminCenter.prototype.loadModuleLayout=function loadModuleLayout(moduleInfo, moduleStyles, moduleScripts){
  /* Loads module Layout (html) from server, syncronous
    When it finishes, loads styles and scripts
  */
  var self=this;
  // Reset counters
  self.resetSyncCounters();

  // Loading Components syncronous:
  var components=moduleInfo['components'].length+1;

  var layoutFile="modules/"+moduleInfo['id']+"/src/"+moduleInfo['main'];
  
  
  // Setting banner if exists
  var bannerPath="css/img/AdminCenterTopBanner.png";
  if (moduleInfo.banner) bannerPath="modules/"+moduleInfo['id']+"/src/icons/"+moduleInfo.banner;
  self.setHeaderBanner(bannerPath); // Loads Module Banner
     
  // Getting module layout (main html)
  $.post('moduleManager.php', {action: "getModuleLayout", filename:layoutFile, id:moduleInfo['id'], help:moduleInfo['help'],iscomponentof:"", banner:bannerPath},
   function(moduleDiv){
     
     
     // Loading and applying locales
     $("#moduleContainer").append(moduleDiv);
     //i18n.loadLocale("modules/"+moduleInfo['id']+"/src/", moduleInfo['id'],  // After load locales, execute other stuff
      //function(){
        [].forEach.call( document.querySelectorAll("*[i18n]"), function(element) {
          i18n.translateHtml(moduleInfo['id'], element);
        });
        // Loadin css and scripts for module if everything is loaded
        self.loadModuleFiles(moduleInfo['id'], components, moduleStyles, moduleScripts);
      //});
    }); // End $post

   for (i in moduleInfo['components']){
    layoutFile="modules/"+moduleInfo['id']+"/src/"+moduleInfo['components'][i]['main'];
    console.log("loading "+layoutFile);

    // Getting layout for each component
    var div_id=moduleInfo['components'][i]['id'];
     
    $.post('moduleManager.php', {
      action: "getModuleLayout",
      filename: layoutFile,
      id:div_id,
      help:moduleInfo['components'][i]['help'],
      iscomponentof:moduleInfo['id'],
      banner:bannerPath
      },
      function(moduleDiv){
        $("#moduleContainer").append(moduleDiv);
   
        // Applying translations
        var id=$(moduleDiv).attr("id");
        var item_list=$("#"+id).find("[i18n]");
        $.each(item_list, function(index, item){
          i18n.translateHtml(moduleInfo['id'], item);
        });
        
        // Link helper button...
        $(".adminCenterHelper").off("click");
        $(".adminCenterHelper").on("click", function(event){
          event.stopPropagation();
          var help=$(event.currentTarget).attr("help");
          var module=$(event.currentTarget).attr("module");
          var parent=$(event.currentTarget).attr("parent");
          var moduledir;
          if (parent=="") moduledir=module;
          else moduledir=parent;
          Utils.showHelp(moduledir, help);
          //alert();
        });
   
        /*
        // Els locales ja estan carregats, açò no cal!
        i18n.loadLocales("modules/"+moduleInfo['id']+"/src/", moduleInfo['id'],  // After load locales, execute other stuff
         function(){
           self.loadModuleFiles(moduleInfo['id'],components, moduleStyles, moduleScripts);
         });*/
   
          self.loadModuleFiles(moduleInfo['id'],components, moduleStyles, moduleScripts);


    })

  }

}

AdminCenter.prototype.setHeaderBanner=function setHeaderBanner(url){
  var path="css/img/AdminCenterTopBanner.png";
  if (url!=null) path=url;
  $("#AdminCenterTopBack").css("background-image", "url("+path+")");
  $("#AdminCenterTopBack").css("background-size", "auto");
  $("#AdminCenterTopBack").css("background-position", "50% 15%");
}

AdminCenter.prototype.addMeToHistory=function addMeToHistory(item){
	var self=this;
	self.history.push($(item).attr("target"));
	
	if(self.history.length>10) self.history.shift();
  console.log('History:'+JSON.stringify(self.history))
}

AdminCenter.prototype.bindMenus=function bindMenus(){
  var self=this;

  $(".menuitem").bind("click", function(event){
		self.addMeToHistory(this);
			
		var target=$(this).attr("target");
		
		// Colorize menu option selected
		$(".submenuitemselected").removeClass("submenuitemselected");
		if ($(this).hasClass("menuitem")&&!($(this).hasClass("submenuitem"))){
			$(".menuitem").removeClass
			("menuitemselected");
			$(this).addClass("menuitemselected");
		} else if ($(this).hasClass("menuitem")&&($(this).hasClass("submenuitem"))){
			//$(".menuitem.submenuitem").removeClass("submenuitemselected");
			$(this).addClass("submenuitemselected");
		}
    
    var parentModule=$(this).attr("module");
    
    // Send hiden event to any module different than target
    $(".moduleWindow:not(#"+target+")").trigger("componentHidden");
    
    // Checking if is info...
    if (target=="info") {
        $("#info").show();
        self.setHeaderBanner(null); // Loads Default Banner
        $(".adminCenterHelper").hide();
        return 1;
    } else $(".adminCenterHelper").show();

    // 1st: Is a component or a module?

    if(typeof(parentModule)==="undefined"){
      // Clicked on a module.
      
      // 2nd: Is module loaded?

      if (self.loadedModules.indexOf(target)!=-1){
        // Module is already loaded. Show it.
        $(".moduleWindow").hide();
        $("#"+target).trigger("componentClicked", {"component":target});
        $("#"+target).show();

        self.setHeaderBanner($("#"+target).attr("banner")); // Loads Module Banner                     
        

      } else{ // Module is not loaded
        $.post('moduleManager.php', {action: "getModuleInfo", module: target},
          function (data){
            // data received contains:
            // data[info]: With the module.json description
            // data[styles]: with the list of files into css folder
            // data[scripts]: with the list of files into js folder

            var moduleInfo=data['info'];
            var moduleStyles=data['styles'];
            var moduleScripts=data['scripts'];


            // Begins the party
            self.loadModuleLayout(moduleInfo, moduleStyles, moduleScripts);
            // How did it work?
            // 1. Loading syncronous module layout,
            // 2. When finished, load Module CSS and Scripts

            // Marquem el mòdul com a carregat
            self.loadedModules.push(target);
            //$("#"+target).append(data);
          });

      }
    } else{ // It is a component, let's show it
      $(".moduleWindow").hide();
      $("#"+target).trigger("componentShown");
      self.setHeaderBanner($("#"+target).attr("banner")); // Loads Module Banner
      
      $("#"+target).show();
    }
		
		
		// Setting scroll to default values
		$("#AdminCenterTopBack").css("height", 175);
		$("body").css("padding-top", 150);
		$("#AdminCenterTopBack").css("filter", "opacity(100%)");
		$(".container").css("margin-bottom", 15);
		
  });

}

AdminCenter.prototype.cleanSession = function cleanSession(){
	if(sessionStorage.hasOwnProperty('server')){
      sessionStorage.removeItem('server');
    }
    if(sessionStorage.hasOwnProperty('password')){
      sessionStorage.removeItem('password');
    }
    if(sessionStorage.hasOwnProperty('username')){
      sessionStorage.removeItem('username');
    }
}

AdminCenter.prototype.sessionIsCorrectly = function sessionIsCorrectly(){
	if (!sessionStorage.hasOwnProperty('server') || !sessionStorage.hasOwnProperty('password') || !sessionStorage.hasOwnProperty('username')){
		return false;
	}
	else{
		return true;
	}
}


$(document).ready(function() {
  admin_center=new AdminCenter();
  if (!admin_center.sessionIsCorrectly()){
  	window.location="login.php";
  }
  
	$("#bt_logout").off("click");
  $("#bt_logout").on("click", function(){
    admin_center.cleanSession();
    window.location="login.php";
  });
	
	$("#menu-back").off("click");
	$("#menu-back").on("click", function(){
			admin_center.history.pop();	// Remove current position
			var target=admin_center.history.pop();	// Perform click on next position
			if (typeof(target)=="undefined") target="info";			
			var itemToClick=$("#menu").find(".menuitem[target='"+target+"']");
			$(itemToClick).trigger("click");
  });
	
  i18n.loadLocales(
    // Applying Locales for main gui
    function(){
      [].forEach.call( document.querySelectorAll("*[i18n]"), function(element) {
          i18n.translateHtml("main", element);
      });

      // Applying locales for menus
			[].forEach.call(document.querySelectorAll("a.menuitem[title]"), function(element) {
				var domain=$(element).attr('target');
				var title=i18n.gettext(domain, $(element).attr("title"));
				$(element).attr("title", title);
			});

      [].forEach.call(document.querySelectorAll("span.translateable[menuentry]"), function(element) {
          var domain=$(element).attr('domain');
          var entry=$(element).attr('menuentry');
          $(element).html(i18n.gettext(domain, entry));
					
      });


      admin_center.bindMenus();
      admin_center.getServerInfo();
      $.material.init();
      $("#moduleContainer").show();
    
		//});

		
			var menuitems=$("#menu").find(".menuitem").not("[module]");
	    //console.log(menuitems);
			for (var i=0; i<menuitems.length; i++){
				var target=($(menuitems[i]).attr("target"));
	      var name=($(menuitems[i]).text());
				var description=i18n.gettext(target, ($(menuitems[i]).attr("title")));
				//var description=i18n.gettext(tartget, ($(menuitems[i]).attr("title")));
												
				//var iconstyle=(($(menuitems[i]).find(".moduleIcon").attr("style"))).split("url(")[1].slice(0,-1);
	      var iconstyle=(($(menuitems[i]).find(".moduleIcon").attr("style"))).split(":")[1];
		
			//alert(iconstyle);
	  
				var item=$(document.createElement("div")).addClass("AdminCenterGlobalPanelMenuItemContainer").attr("target", target);
	      var div1=$(document.createElement("div")).addClass("AdminCenterGlobalPanelMenuItemImage").css("background-image", iconstyle).attr("target", target);
				var div2=$(document.createElement("div")).addClass("AdminCenterGlobalPanelMenuItemText").html(name).attr("target", target);
				var div3=$(document.createElement("div")).addClass("AdminCenterGlobalPanelMenuItemTextHelper").html(description).attr("target", target);
				
	      
				
	      $(item).append(div1,div2,div3);
				
	      /*var item="<div class='AdminCenterGlobalPanelMenuItemContainer' target='"+target+"'>
				<div class='AdminCenterGlobalPanelMenuItemImage' style='"+iconstyle+"'></div>";
	      item+="<div class=''>"+name+"</div></div>";*/
				
	      $(item).click(function(event){
					event.preventDefault();
	        event.stopPropagation();
					//alert($(event.target).attr("target"));
	        $("#menu").find(".menuitem[target='"+$(event.target).attr("target")+"']").click();
					});
				$("#AdminCenterGlobalPanelMenu").append(item);
	      
			}
	    
		}); // End for i18n.loadlocales callback
		
    // Binding log
    $("#AdminCenterFooter").off("click");
    $("#AdminCenterFooter").on("click", function(event){
      
      $("#AdminCenterFooter>div.divloglineactive").removeClass("divloglineactive");
      
      h=$(event.target).css("height");
        if (Number.parseInt(h)<50)
          $("#AdminCenterFooter").css("height", 150);
          else
          $("#AdminCenterFooter").css("height", 25);
      });
		
});
