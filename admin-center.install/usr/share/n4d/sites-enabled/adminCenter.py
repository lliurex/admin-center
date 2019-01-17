import lliurex.net


def get_server_ip(client_ip):

		

		if client_ip=="127.0.0.1":
			return "127.0.1.1"


		found=None

		for eth in lliurex.net.get_devices_info():
			if "ip" in eth and "netmask" in eth and "bitmask" in eth:
				ip,netmask,bitmask=eth["ip"],eth["netmask"],eth["bitmask"]
				network_ip=lliurex.net.get_network_ip(ip,netmask)
				if lliurex.net.is_ip_in_range(client_ip,network_ip+"/"+str(bitmask)):
					return ip

		gateway=lliurex.net.get_default_gateway()[1]
		for eth in lliurex.net.get_devices_info():
			if "ip" in eth and "netmask" in eth and "bitmask" in eth:
				ip,netmask,bitmask=eth["ip"],eth["netmask"],eth["bitmask"]
				network_ip=lliurex.net.get_network_ip(ip,netmask)
				if lliurex.net.is_ip_in_range(gateway,network_ip+"/"+str(bitmask)):
					return ip

class adminCenter:

	
	def get_response(self,info):
		client_ip=info["client_ip"]
		client_url=info["client_url"].split(":")[0]
		ip=get_server_ip(client_ip)
		if client_url=="admin-center":
			#eturn '<html><meta http-equiv="refresh" content="0; url=http://'+client_url+'/login.html" /></html>'
                        return '<html><meta http-equiv="refresh" content="0; url=http://'+client_url+'/login.php" /></html>'
			#return '<html><meta http-equiv="refresh" content="0; url=http://'+client_url+':3000/login.html" /></html>'

		else:
	                return '<html><meta http-equiv="refresh" content="0; url=http://'+client_url+'/admin-center/login.php" /></html>'
			#eturn '<html><meta http-equiv="refresh" content="0; url=http://'+client_url+'/admin-center/login.html" /></html>'
		        #return '<html><meta http-equiv="refresh" content="0; url=http://'+client_url+':3000/admin-center/login.html" /></html>'

