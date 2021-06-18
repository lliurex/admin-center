<?php
if(!session_id()) session_start();
// List of modules
$moduleList=array_diff(scandir("modules"), array('..', '.'));
$modules=readComponents($moduleList); // Global

$_SESSION['modules']=$modules;

echo ("<html>");
writeHeaders($moduleList);

/* Setting layout */
echo ("<body>");
//writeTop();           //  Drawing layout header
WriteMenu($modules);  //  Drawing menus

writeModulesContainers($modules);

// Writing snacknbar
echo ("<div id='snack' data-toggle='snackbar' data-html-allowed='true' data-content=''></div>	");


importCommonLibraries();
importCommonScripts();

echo ("<div id='AdminCenterTopBack'></div>");
echo ("<div id='AdminCenterFooter'><div>");
echo ("</body>");
echo ("</html>");



/*  Main Functions  */

function writeModulesContainers($modules){
  echo ('<div id="moduleContainer">'); /* Main Space for modules content */

  /* Display Server Info */
  echo "<div class='moduleWindow' id='info' style='display: block'>";
    require("info.php");
  echo "</div>";

  /*foreach($modules as $key=>$value){
    $module=$key;
    // Drawing main module div
    echo "<div class='moduleWindow' id='$module' content='".$value['main']."' iscomponent='false'></div>";

    // Drawing divs for module components
    if (count($value["components"]>0)){
      foreach($value["components"] as $component){
        echo "<div class='moduleWindow' module='".$module."' id='".$component['id'].
             "' content='".$component['main']."' iscomponent='true'></div>";
      }
    } // end if
  } // End for each*/


  echo ("</div>"); /* End div for main space for modules */
}



  /*foreach ($modules as $module){
    echo "<div class='moduleWindow' id='$module' content='modules/$module/src/main.html' iscomponent='false'>";
      //require("modules/$module/src/main.html");
      // LOADMODULE
    echo "</div>";
    // Loading  components in module
    }

    foreach ($components as $component){
      //echo($component[1]);
      echo "<div class='moduleWindow' id='$component[0]' content=$component[1] iscomponent='true'>";
        //require($component['1']);

      echo "</div>";
    }*/


function importCommonScripts(){
  /* Common Scripts */
  echo('<script type="text/javascript" src="js/main.js"></script>');
  echo('<script type="text/javascript" src="js/sidebar_menu.js"></script>');
  echo('<script type="text/javascript" src="lib/node_modules/jed/jed.js"></script>');
  echo('<script type="text/javascript" src="lib/i18n.js"></script>');
};

function importCommonLibraries(){
  echo ('<!-- Common Libraries -->');
  echo ('<script type="text/javascript" src="lib/jquery/jquery.js"></script>');
  //echo ('<script type="text/javascript" src="lib/jquery.xmlrpc.js"></script>');
  echo('<script type="text/javascript"  src="lib/bower_components/moment/min/moment.min.js"></script>');
  echo ('<script type="text/javascript" src="lib/bootstrap/js/bootstrap.min.js"></script>');
  echo('<script type="text/javascript" src="lib/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>');
  echo ('<script type="text/javascript" src="lib/bootstrap-material-design/js/ripples.min.js"></script>');
  echo ('<script type="text/javascript" src="lib/bootstrap-material-design/js/material.min.js"></script>');
  echo ('<script type="text/javascript" src="lib/snackbar/snackbar.min.js"></script>');
  echo ('<script type="text/javascript" src="lib/bootbox.min.js"></script>');
  
  echo ('<script type="text/javascript" src="lib/jquery-ui/jquery-ui.js"></script>');
  
  echo ('<script type="text/javascript" src="lib/jsencrypt/jsencrypt.js"></script>');
  echo ('<script type="text/javascript" src="lib/waitwin.js"></script>');
  echo ('<script type="text/javascript" src="lib/formFactory.js"></script>');
  echo ('<script type="text/javascript" src="lib/markdown/showdown.min.js"></script>');
  echo ('<script type="text/javascript" src="lib/utils.js"></script>');
  echo ('<script type="text/javascript" src="lib/nouislider/nouislider.min.js"></script>');
  echo ('<script type="text/javascript" src="lib/progressbarjs/progressbar.min.js"></script>');
  echo ('<script type="text/javascript" src="lib/cryptojs-aes/aes.js"></script>');
  echo ('<script type="text/javascript" src="lib/cryptojs-aes/aes-json-format.js"></script>');
  
  
  
};

function readComponents($modules){
  $modulefilelist=array();

  foreach($modules as $moduleName){
    $moduleManifestString = file_get_contents("modules/".$moduleName."/module.json");
    $module = json_decode($moduleManifestString, true);

    # If user is admin, let's add module
    if ((in_array("sudo", $_SESSION['groups']) or in_array("admins", $_SESSION['groups'])) or ($module["roles"]=="teachers"))
      $modulefilelist[$moduleName]=$module;
    
  }
  return $modulefilelist;
}

function write($content){
  echo "<pre>";
  print_r($content);
  echo "/<pre>";
}

function writeTop(){

  echo('<div id="topBar" class="default-primary-color">');
    echo ("<span i18n id='bt_logout'>logout</span>");
  echo('</div>');
}

function writeHeaders($mod){
  ?>
  <head>
    <!-- Common Styles -->
     <meta charset="UTF-8">
     <title>Admin Center</title>
     <link rel="icon" href="icones/default.png">
     
     
    <link rel="stylesheet" href="css/sidebar-menu.css">
    <link rel="stylesheet" href="lib/material-icons/material_icons.css">
    <!--link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css"-->
    <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="lib/bootstrap-material-design/css/bootstrap-material-design.min.css">
    <!--link rel="stylesheet" href="lib/bootstrap-design/css/ripples.min.css"-->
    <link rel="stylesheet" href="lib/bootstrap-material-design/css/ripples.min.css">
    <!--link rel="stylesheet" href="lib/bootstrap-design/css/material.min.css"-->
    <link rel="stylesheet" href="lib/snackbar/snackbar.css">
    
    <link rel="stylesheet" href="lib/jquery-ui/jquery-ui.css">
    <!--link rel="stylesheet" href="lib/nouislider/nouislider.min.css"-->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/waitwin.css">
    <link rel="stylesheet" href="lib/bootstrap-material-design/css/material-custom.css">
    <link rel="stylesheet" href="lib/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />   


  </head>
<?php }

function WriteMenu($modules){
  ?>
    <div id="leftMenu">
    <div id="wrapper" class="toggled-2">
      <div id="menu-toggle-2" class="AdminCenterFloatButton"></div>
      <div id="menu-back" class="AdminCenterFloatButton"></div>
      <div id="bt_logout" class="AdminCenterFloatButton"></div>
      
        <!-- Sidebar -->
        <div id="sidebar-wrapper" class="default-primary-color">
		  <div id="sidebar_header"></div>
      <div id="sidebar_menu_container">
      <ul class="sidebar-nav nav-pills nav-stacked" id="menu">
              <!--  Main page link  -->
              <!--li><a class='menuitem' onclick="window.location.reload();"-->
              <!-- Take a look here... -->
              <!--http://stackoverflow.com/questions/90178/make-a-div-fill-the-height-of-the-remaining-screen-space -->
              
              <li><a class='menuitem' target='info'>
                <span class='fa-stack fa-lg pull-left'><div class='moduleIcon' style='background-image:url("icones/defaultColor.svg")'></div>
                </span>Home
               <!--span style="float:left; display:block; margin-top:-1.5em; font-size: 0.9em;">pajarito</span-->
              </a>
              
              
              <?php
                  foreach($modules as $key=>$value){
                    $module=$key;
                      //error_log($value["icon"]);
                      if (array_key_exists("icon", $value) && file_exists("modules/$module/src/icons/".$value["icon"]))  $icon="modules/$module/src/icons/".$value["icon"];
                      else $icon="icones/default.png";

                      
                      echo ("<li><a class='menuitem' target='$module' title='".$value["description"]."'>".
                      "<span class='fa-stack fa-lg pull-left'><div class='moduleIcon' style='background-image:url($icon)'></div>".
                      "</span>".$value["name"]."</a>");


                        if (in_array('components',$value) && is_array($value['components']) && count($value["components"]>0)){
                          echo ('<ul class="nav-pills nav-stacked" style="list-style-type:none; margin-left: -40px;">');
                          foreach($value["components"] as $component){

                            if (array_key_exists("icon", $component) && file_exists("modules/$module/src/icons/".$component["icon"]))  $icon="modules/$module/src/icons/".$component["icon"];
                            else $icon="icones/default.png";

                            echo('<li><a class="menuitem submenuitem" module="'.$module.
                            '" target="'.$component['id'].'"><span class="fa-stack fa-lg pull-left">
                            <div class="moduleIcon" style="background-image:url('.$icon.')"></div></span>'.
                            '<span i18n class="translateable" domain="'.$module.'" menuEntry="'.$component["menuEntry"].'"></span>'.
                            '</a></li>');
                            //$component["menuEntry"].'</a></li>');

                            /*echo('<li><a class="menuitem" module="'.$module.
                            '" target="'.$component['id'].'"><span class="fa-stack fa-lg pull-left">
                            <div class="moduleIcon" style="background-image:url('.$icon.')"></div></span>'.
                            $component["menuEntry"].'</a></li>');*/
                          }
                          echo ('</ul>');
                        }
                        echo ("</li>");
                  }
              ?>
            </ul>
        </div>
        <!--div id="bt_logout_container">
        <span i18n id='bt_logout'>
        <span style="display: inline"><i title="Logout" class="material-icons moduleIcon" style="display:inline;">power_settings_new</i></span>
        </span>
        </div-->
        
        <!--div class="menuitem" id="bt_hide_menu_container">
        <span style="display: inline"><i title="Back" class="material-icons moduleIcon" style="display:inline;"> << </i></span>
        </div-->
              
            
        <!--div id="sidebar_module_description_div" class="menuitem">
		  <span id="sidebar_module_description_image" class="fa-stack fa-lg pull-left"><div class="moduleIcon" style="background-image:url(modules/lliurex-guard/src/icons/guard_flat.png)"></div></span>
		  <!--span >Pajaritos tralari... esto es la descvripción del modulo...</span-- >
		  <span id="sidebar_module_description_text">Pajaritos tralari... esto es la descvripción del modulo...</span>
		  </span>  
		</div-->
		</div>
    </div>
  </div>


<?php
}
?>
