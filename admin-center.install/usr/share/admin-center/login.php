<html>
<head>
	<title>Admin Center</title>
     <link rel="icon" href="icones/default.png">
	<link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
	
	<!--link rel="stylesheet" href="lib/bootstrap-design/css/material.min.css"-->
	<link rel="stylesheet" href="lib/bootstrap-material-design/css/bootstrap-material-design.min.css">
	<link rel="stylesheet" href="lib/bootstrap-material-design/css/ripples.min.css">
	<!--link rel="stylesheet" href="lib/bootstrap-material-design/css/material-fullpalette.min.css"-->
	<link rel="stylesheet" href="lib/snackbar/snackbar.css">
	<!--link rel="stylesheet" href="lib/bootstrap-design/css/ripples.min.css"-->
	<!--link rel="stylesheet" href="lib/material/css/ripples.min.css"-->
	<!--link rel="stylesheet" href="lib/bootstrap-design/css/roboto.min.css"-->
	<link rel="stylesheet" href="lib/bootstrap-material-design/css/material-custom.css">
	<link rel="stylesheet" href="css/main.css">

	
	<!--jquery -->
	<script type="text/javascript" src="lib/jquery/jquery.js"></script>
	<script type="text/javascript" src="lib/jsencrypt/jsencrypt.js"></script>
	<!--script type="text/javascript" src="lib/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script-->
	<!--script type="text/javascript" src="lib/jquery.xmlrpc.js"></script-->
	
	<!--Utilities -->
	<script type="text/javascript" src="lib/waitwin.js"></script>
	<script type="text/javascript" src="lib/formFactory.js"></script>
	<script type="text/javascript" src="lib/markdown/showdown.min.js"></script>
	<script type="text/javascript" src="lib/utils.js"></script>


	<script type="text/javascript" src="lib/bootstrap/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="lib/snackbar/snackbar.min.js"></script>

	<!-- Material Design -->
	<!--script type="text/javascript" src="lib/bootstrap-design/js/ripples.min.js"></script-->
	<script type="text/javascript" src="lib/bootstrap-material-design/js/ripples.min.js"></script>
	<!--script type="text/javascript" src="lib/bootstrap-design/js/material.min.js"></script-->
	<script type="text/javascript" src="lib/bootstrap-material-design/js/material.min.js"></script>
	
	<script type="text/javascript" src="lib/cryptojs-aes/aes.js"></script>
    <script type="text/javascript" src="lib/cryptojs-aes/aes-json-format.js"></script>


	<!--OWNER-->
	<script type="text/javascript" src="lib/i18n.js"></script>
	<script type="text/javascript" src="js/login.js"></script>




</head>
<body>
	
<?php
function gt($text){
	$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
	switch ($lang){
    case "en":
        if ($text=="Authentication") return "Authentication";
		else if ($text=="Username") return "Username";
		else if ($text=="login") return "Login";
		else return "Password";
        break;
	case "es":
        if ($text=="Authentication") return "Autenticación";
		else if ($text=="Username") return "Usuario";
		else if ($text=="login") return "Entrar";
		else return "Contraseña";
        break;
	default:
        if ($text=="Authentication") return "Autenticació";
		else if ($text=="Username") return "Usuari";
		else if ($text=="login") return "Entra";
		else return "Contrasenya";
        break;
	}
}
?>

<!--div id="login" class="jumbotron col-lg-4 col-lg-offset-4" style="padding: 0px"-->
<!-- Mirar en: http://stackoverflow.com/questions/20547819/vertical-align-with-bootstrap-3 -->
<div class="container-fluid"><div class="row">
	<div id="login" class="container panel col-xs-12 col-md-4 col-md-offset-4" style="padding: 0px;display: inline-block; vertical-align: middle;float: none ">
	<div class="login_header"></div>

	
		<!--h3 style="text-align:center;"><?php echo (gt("Authentication")); ?></h3-->
	<div id="loginform" style="padding: 30px;">

		<label for="input_username" class="control-label"><?php echo (gt("Username")); ?></label>
		<input type="text" id="input_username" class="form-control"></input>
		<label for="input_username" class="control-label"><?php echo (gt("Password")); ?></label>
		<input type="password" id="input_password" class="form-control"></input>


		<!--div style="margin-top: 10px; margin-left: 100px;"-->
		<div style="float:right;">
			<button id="LoginButton" class="btn btn-primary btn-lg"><?php echo(gt("login"));?></button>
		</div>
	</div></div>
	<div id="msg_err"></div>
</div>

</div> <!--row-->
</div> <!--container-->

<div id='snack' data-toggle='snackbar' data-html-allowed='true' data-content=''></div>
</body>
</html>
