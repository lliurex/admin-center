<?php
if(!session_id()) session_start();

$action=$_POST["action"];

switch ($action) {
  case 'getModuleInfo':
    getModuleInfo($_POST["module"]);
    break;
  case 'getModuleLayout':
    $params = array();
    foreach (array("id","filename","help","iscomponentof","banner") as $key){
      if (array_key_exists($key,$_POST)){
        array_push($params,$_POST[$key]);
      }else{
        array_push($params,null);
      }
    }
    getModuleLayout(...$params);
    break;

  case 'getModuleList':
    getModuleList();
    break;

  default:
    # code...
    break;
}

function getModuleList(){
  header('Content-type: application/json');
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  $modules=array_diff(scandir("modules"), array('..', '.'));
  echo(json_encode($modules));
}

function getModuleInfo($module){
  header('Content-type: application/json');
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  $moduleInfo=array();
  $moduleInfo['info']=$_SESSION['modules'][$module];

  // Reading css files list
  $styles_tmp=array_diff(scandir("modules/$module/src/css"), array('..', '.'));
  $styles = array();
  foreach ($styles_tmp as $key=>$value){
    $ext=pathinfo($value,PATHINFO_EXTENSION);
    if (strtolower($ext) == "css"){
        $styles[$key]="modules/$module/src/css/$value";
    }
  }
  $moduleInfo['styles']=$styles;
  // Reading js files list
  $scripts_tmp=array_diff(scandir("modules/$module/src/js"), array('..', '.'));
  $scripts = array();
  foreach ($scripts_tmp as $key=>$value){
    $ext=pathinfo($value,PATHINFO_EXTENSION);
    if (strtolower($ext) == "js"){
	$scripts[$key]="modules/$module/src/js/$value";
    }
  }
  $moduleInfo['scripts']=$scripts;

  echo(json_encode($moduleInfo));
}

function getModuleLayout($id, $filename, $help, $iscomopnentof, $banner){
  header('Content-type: text/html');
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");
  

  echo "<div class='moduleWindow' id='$id' banner='$banner'>";
  if ($help) echo "<div class='adminCenterHelper' help='$help' module='$id' parent='$iscomopnentof' title='Help'>
              <div class='adminCenterHelperQuestion'>?</div>
              <div i18n class='adminCenterHelperDescription'>Help</div>
                </div>";
    require($filename);
  echo "</div>";
};


//require("modules/$module/src/main.html");
// Adding submodules



/*
function importModuleContent($modules, $components){

  echo "<div class='moduleWindow' id='info' style='display: block'>";
    require("info.php");
  echo "</div>";

  foreach ($modules as $module){
    echo "<div class='moduleWindow' id='$module'>";
      //require("modules/$module/src/main.html");
      // LOADMODULE
    echo "</div>";
    // Loading  components in module
    }

    foreach ($components as $component){
      echo "<div class='moduleWindow' id='$component[0]'>";
        //require($component['1']);

      echo "</div>";
    }
}
*/
?>
