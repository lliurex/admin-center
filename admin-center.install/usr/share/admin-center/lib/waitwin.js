const WAITWIN_LOADING=0;
const WAITWIN_WAITING=1;


function WaitWin(){
	// Utilities collection
}

WaitWin.prototype.getStatusDiv=function getStatusDiv(status){
  switch (status) {
    case WAITWIN_LOADING:
      //return ('<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div>');
	  /*return '<div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div>'+
	  '<div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div>'+
	  '<div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div>'+
	  '<div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div>'+
	  '<div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div>'+
	  '<div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div>'+
	  '<div class="sk-circle12 sk-circle"></div></div>';*/
		return '<div class="loader-box"><div class="lable"></div>'+
	'<div class="loader"><div class="element-animation">'+
        '<img src="css/img/animated_waitwin.png" width="780" height="70";>'+
				'</div></div></div>';
    break;
    case WAITWIN_WAITING:
      /*return '<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div>'+
      '<div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div>'+
      '<div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div>'+
      '<div class="sk-cube sk-cube9"></div></div>';*/
			return '<div class="loader-box"><div class="lable"></div>'+
	'<div class="loader"><div class="element-animation">'+
        '<img src="css/img/animated_waitwin.png" width="1180" height="70";>'+
				'</div></div></div>';
      break;
    default:
      return null;


  }
}

WaitWin.prototype.ShowModalInfo=function ShowModalInfo(title, message, status){
  var self=this;
  var modaldiv=$(document.createElement("div")).attr("id","modalDiv").addClass("modalDivBack");
  var container=$(document.createElement("div")).addClass("utilsTextBox").attr("id", "modalDivContainer");
  var titlediv=$(document.createElement("div")).addClass("utilsText").html(title);
  var statusdiv=self.getStatusDiv(status);
  var textdiv=$(document.createElement("div")).addClass("utilsText").html(message);

  $(container).append(titlediv, statusdiv, textdiv);
  $(modaldiv).append(container);
  $(modaldiv).css("display", "none");
  $("body").append(modaldiv);
  $(modaldiv).fadeIn(500);

}

WaitWin.prototype.SetStatus=function SetStatus(title, message, status){
  var self=this;
  $("#modalDivContainer").empty();

  var titlediv=$(document.createElement("div")).addClass("utilsText").html(title);
  var statusdiv=self.getStatusDiv(status);
  var textdiv=$(document.createElement("div")).addClass("utilsText").html(message);
  $("#modalDivContainer").append(titlediv, statusdiv, textdiv);


}


WaitWin.prototype.RemoveModalInfo=function RemoveModalInfo(){
	$("#modalDiv").fadeOut(2000, function(){
    $("#modalDiv").remove();
  })

}
