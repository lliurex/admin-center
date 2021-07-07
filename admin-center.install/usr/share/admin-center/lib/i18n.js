function I18n(){
  this.modules=[];
  this.locale = navigator.language || navigator.userLanguage;
  
  // if lang is ca, transform to ca_ES@valencia
  if (this.locale==="ca" || this.locale==="ca-valencia" || this.locale==="ca-ES") this.locale="ca-ES@valencia";
  else if (this.locale==="es" || this.locale==="es-ES") this.locale="es-ES";
  else if (this.locale==="en") this.locale="en-US";
  
  this.modulecount=0;
}

I18n.prototype.getLocale=function getLocale(){
  return this.locale;
}

I18n.prototype.getLength=function getLength(){
  var obj=this.modules;

  var size = 0, key;
   for (key in obj) {
       if (obj.hasOwnProperty(key)) size++;
   }
   return size;
};

I18n.prototype.moduleReady=function moduleReady(module){
  var obj=this.modules;

  //var size = 0, key;
  var key;
   for (key in obj) {
       if (obj.hasOwnProperty(module)) return true;
   }
   return false;
};

I18n.prototype.addModule=function addModule(module, data){
  console.log("Adding lang for module: "+module);
  var self=this;
  var moduledata=new Jed({locale_data: data});
  self.modules[module]=moduledata;
}

I18n.prototype.translateHtml=function translateHtml(module, element){
  var self=this;

  try{
    if (self.moduleReady(module)){
      element.innerHTML=self.modules[module].gettext(element.innerHTML);
    }

  // If module is not ready yet, do nothing.

  }catch (err){
    console.error(err);
  }


};

I18n.prototype.gettext=function gettext(module, text) {
	var self=this;
  try{
    return self.modules[module].gettext(text);
  } catch (except){
    return text;
  }
};



I18n.prototype.performCallback=function performCallback(callback){
  var self=this;
  self.modulecount--;
  if (self.modulecount==0) callback();
  return -1;
}


I18n.prototype.loadLocales=function loadLocales(callback){
  var self=this;

  $.post('moduleManager.php', {action: "getModuleList"},
   function(modulelist){

     // Count modules
     var size = 0, key;
      for (key in modulelist)
          if (modulelist.hasOwnProperty(key)) size++;
     self.modulecount=size+1;

     self.loadLocale("", "main", callback);
     for (i in modulelist){
         var modulepath="modules/"+modulelist[i]+"/src/";
         var modulefile=modulelist[i];
         //self.loadLocale(modulepath, modulefile, self.performCallback(callback));
         self.loadLocale(modulepath, modulefile, callback);
       }


   });


}

I18n.prototype.loadLocale=function loadLocale(module, id, callback){
  var self=this;
  var domSelector;

  $.getJSON(module+"i18n/"+i18n.getLocale()+"/messages.json")
  .done(function(data, textStatus, jqXHR){
    self.addModule(id, data);
    self.performCallback(callback);

  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    //i18n.addModule(id, data);
    console.log("fail captured");
    self.performCallback(callback);
   });

}

i18n=new I18n();


$(document).ready(function() {
  $.ajaxSetup({ cache: false });
});
