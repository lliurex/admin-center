

function formFactory(){
}

formFactory.prototype.createSelect=function createSelect(item, expanded_columns=false){
  
  var disabled="";
  if (item.disabled==="true") disabled=' disabled="disabled" ';
  
  var left_col_size="col-md-2";
  var right_col_size="col-md-10";
  if (expanded_columns) {
      left_col_size="col-md-4";
      right_col_size="col-md-6";
    }
  
  var sel='<div class="form-group col-md-12" title="'+item.help+'"  style="margin-top:30;">';
    sel+='<label for="'+item.id+'" class="'+left_col_size+' control-label">'+item.label+'</label>';
    sel+='<div class="'+right_col_size+'">';
    sel+='<select id="'+item.id+'" class="form-control" '+disabled+'>';
    item.default=item.default.replace("\n", "");
    for (var i in item.options){
        var selected="";
        //alert("123");        
        //alert(item.options[i].value +typeof(item.options[i].value)+ "==="+item.default +typeof(item.default)+"->"+(item.options[i].value===item.default));
        if (item.options[i].value===item.default) selected=' selected ';
        sel+="<option "+selected+" value="+item.options[i].value+">"+item.options[i].label+"</option>";
    }
    sel+="</select></div></div>";
    
    return sel;
};

formFactory.prototype.createCheckbox=function createCheckbox(item, expanded_columns=false){
    var left_col_size="col-md-2";
    var right_col_size="col-md-10";
    if (expanded_columns) {
        left_col_size="col-md-4";
        right_col_size="col-md-6";
      }
  
    var checked="";
    var disabled="";
    //if (item.default=="checked") checked=" checked ";
    if (item.default=="checked" || item.default=="true") checked=" checked ";
    if (item.disabled=="true") disabled=" disabled ";
    var content='<div class="form-group col-md-12" title="'+item.help+'">';
    content+='<label class="'+left_col_size+' control-label">';
    content+=item.label+'</label>';
    content+='<div class="'+right_col_size+'">';
    content+='<div class="checkbox"><label>';
    content+='<input type="checkbox" '+checked+' '+disabled+' name="'+item.id+'" id="'+item.id+'"/></label></div>';
    content+="</div></div>";
    return content;
}


formFactory.prototype.createText=function createText(item, expanded_columns=false){
    var left_col_size="col-md-2";
    var right_col_size="col-md-10";
    if (expanded_columns) {
        left_col_size="col-md-4";
        right_col_size="col-md-6";
      }

  
  var disabled="";
  if (item.disabled==="true") disabled=' disabled="disabled" ';
  
  var sel='<div class="form-group col-md-12" title="'+item.help+'"  style="margin-top:30;" controlid="'+item.id+'">';
    sel+='<label for="'+item.id+'" class="'+left_col_size+' control-label">'+item.label+'</label>';
    sel+='<div class="'+right_col_size+'">';
    sel+='<input id="'+item.id+'" class="form-control" type="text" value="'+item.value+'" '+disabled+'>';
    sel+="</input></div></div>";
    return sel;
};

formFactory.prototype.createTextArea=function createTextArea(item, expanded_columns=false){
  var left_col_size="col-md-2";
  var right_col_size="col-md-10";
  if (expanded_columns) {
       left_col_size="col-md-4";
       right_col_size="col-md-6";
  }

  var disabled="";
  if (item.disabled==="true") disabled=' disabled="disabled" ';
  
  var sel='<div class="form-group col-md-12" title="'+item.help+'"  style="margin-top:30;">';
    sel+='<label for="'+item.id+'" class="'+left_col_size+' control-label">'+item.label+'</label>';
    sel+='<div class="'+right_col_size+'">';
    sel+='<textarea id="'+item.id+'" class="form-control" type="text" '+disabled+'>'+item.value;
    sel+="</textarea></div></div>";
    return sel;
};
