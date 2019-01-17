<!--h1 class="topBanner" i18n>Server Info</h1-->

<!--div class="AdminCenterHeader"></div-->


<div class="AdminCenterGlobalInfo col-md-12">
  <div class="col-md-8 panel panel-default" style="background: #ffffff;">
    <h1 i18n>Available.Modules</h1>
    <div id="AdminCenterGlobalPanelMenu" class="panel-body"></div>
  </div>
  <div class="col-md-4">
<div class="panel panel-default" style="padding: 0px; margin:2px;">
  <div class="panel-heading">
    <h3 class="panel-title" i18n>Server Info</h3>
  </div>
  <div class="panel-body">
    <table class="ServerInfoTable">
      <tr><td class="ServerInfo_Param" i18n>Server IP</td> <td id="serverInfo_SRV_IP"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Hostname</td> <td id="serverInfo_HOSTNAME"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Internal Domain</td> <td id="serverInfo_INTERNAL_DOMAIN"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Internal Interface</td> <td id="serverInfo_INTERNAL_INTERFACE"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>External Interface</td> <td id="serverInfo_EXTERNAL_INTERFACE"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Internal Mask</td> <td id="serverInfo_INTERNAL_MASK"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Internal Network</td> <td id="serverInfo_INTERNAL_NETWORK"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Primary DNS Server</td> <td id="serverInfo_DNS1"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Secondary DNS Server</td> <td id="serverInfo_DNS2"></td></tr>
    </table>
  </div>
</div>


<div class="panel" style="padding: 0px;margin:2px;">
  <div class="panel-heading">
    <h3 class="panel-title">DHCP</h3>
  </div>
  <div class="panel-body">
    <table class="ServerInfoTable">
      <tr><td class="ServerInfo_Param" i18n>Service Status</td> <td id="serverInfo_DHCP_ENABLE"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Address range</td> <td id="serverInfo_IP_RANGE"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Max. Hosts</td><td id="serverInfo_DHCP_HOST_MAX"></td></tr>
    </table>
  </div>
</div>


<div class="panel" style="padding: 0px;margin:2px;">
  <div class="panel-heading">
    <h3 class="panel-title" i18n>LliureX Mirror</h3>
  </div>
  <div class="panel-body">
    <table class="ServerInfoTable">
      <tr><td class="ServerInfo_Param" i18n>Last update</td> <td id="serverInfo_LAST_MIRROR_DATE"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Mirror size</td> <td id="serverInfo_MIRROR_SIZE"></td></tr>
    </table>
  </div>
</div>

<div class="panel" style="padding: 0px;margin:2px;">
  <div class="panel-heading">
    <h3 class="panel-title" i18n>Proxy</h3>
  </div>
  <div class="panel-body">
    <table class="ServerInfoTable">
      <tr><td class="ServerInfo_Param" i18n>Proxy status</td> <td id="serverInfo_PROXY_ENABLED"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Proxy name</td> <td id="serverInfo_PROXY_HOST"></td></tr>
      <tr><td class="ServerInfo_Param" i18n>Proxy port</td><td id="serverInfo_PROXY_HTTPORT"></td></tr>
    </table>
  </div>
</div>

</div>

<!--/div-->

<!--console.log(ServerConfig["SRV_IP"]["value"]);

console.log(ServerConfig["HOSTNAME"]["value"]);
console.log(ServerConfig["SRV_IP"]["value"]);
console.log(ServerConfig["INTERNAL_DOMAIN"]["value"]);
console.log(ServerConfig["INTERNAL_INTERFACE"]["value"]);
console.log(ServerConfig["EXTERNAL_INTERFACE"]["value"]);
console.log(ServerConfig["INTERNAL_MASK"]["value"]);
console.log(ServerConfig["INTERNAL_NETWORK"]["value"]);

console.log(ServerConfig["DNS_EXTERNAL"]["value"][0]);
console.log(ServerConfig["DNS_EXTERNAL"]["value"][1]);

console.log(ServerConfig["DHCP_ENABLE"]["value"]);
console.log(ServerConfig["DHCP_FIRST_IP"]["value"]);
console.log(ServerConfig["DHCP_LAST_IP"]["value"]);
console.log(ServerConfig["DHCP_HOST_MAX"]["value"]);

console.log(ServerConfig["LLIUREXMIRROR"]["value"]["llx16"]["last_mirror_date"]);
console.log(ServerConfig["LLIUREXMIRROR"]["value"]["llx16"]["mirror_size"]);

console.log(ServerConfig["PROXY_ENABLED"]["value"]);
console.log(ServerConfig["PROXY_HOST"]["value"]);
console.log(ServerConfig["PROXY_HTTPORT"]["value"]);-->
