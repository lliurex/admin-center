import os
import subprocess
import socket
from time import sleep

class RemoteWebGui:
	
	def __init__(self):
		
		pass
		
	#def init
	
	# CAl un get_first_xpra_port_free
	
	def get_first_display_free(self):
		'''
		Returns first Display free from 42
		'''
		
		try:
			display=42
			while(os.path.isfile('/tmp/.X'+str(display)+'-lock')):
				display+=1
				
			return ":"+str(display)
		except Exception as e:
			print "Captured: "+str(e)
			return {'status': False, 'msg':'[RemoteGuiManager] '+str(e)}
		return ":42"
		
	#def get_first_display
	
	def get_first_free_port(self):
		'''
		Returns first opened port, starting by 10013
		'''
		port=10013;
		sock=socket.socket(socket.AF_INET, socket.SOCK_STREAM);
		
		while (port<99999):
			status=sock.connect_ex(('127.0.0.1', port));
			print "chechking port "+str(port)+" is "+str(status);
			if status!=0:
				return port;
			port=port+1;
			
		return -1
		
		

	#def create_connection(self,  username, xephyr_options=" -ac -terminate -screen 1024x768 -dpi 96 "):
        def create_connection(self,  username, xephyr_options=" -ac -screen 1024x768 -dpi 96 "):

		# Cal afegir com a parametre el username i que retorne el port....
		try:
			os.environ["HOME"]="/home/"+username;
			os.environ["XAUTHORITY"]="/home/"+username+"/.Xauthority";

			display=self.get_first_display_free()
			port=self.get_first_free_port();
			
			print "PORT: ",port," DISPLAY: ",display

			xephyr_cmd="Xephyr "+xephyr_options+" "+display;
			#xephyr_cmd="Xnest -ac -geometry 800x600+24 "+display;
			xpra_cmd="xpra start --bind-tcp=0.0.0.0:"+str(port);
			#xpra_cmd=xpra_cmd+" --html=on --no-pulseaudio --exit-with-children --start-child='"+xephyr_cmd+"'";
                        xpra_cmd=xpra_cmd+" --html=on --no-pulseaudio --start-child='"+xephyr_cmd+"'";

			print "Exec: "+xpra_cmd;
			p=subprocess.call([xpra_cmd], shell=True);			
			
			# PROVAR ASO EN ALTRE LLOC O MIRAR X Q NO VA
			#  https://xpra.org/trac/wiki/Usage
			#xpra_cmd2="xpra attach tcp:0.0.0.0:"+str(port)+" --border=black,0 --window-close=ignore --desktop-scaling=auto";
			#print "bbbbbbbbbb"
			#p2=subprocess.call([xpra_cmd2], shell=True);
			#print "cccccccccccccc"
			
			
			# wait for port is listening
						
			sock=socket.socket(socket.AF_INET, socket.SOCK_STREAM);
			status=111;
			while (status!=0):
				status=sock.connect_ex(('127.0.0.1', port));
			
			print "port "+str(port)+" is available with status: "+str(status);
			#sleep (2)
			return {"status":True, "msg":{"port":str(port), "display":display}};
			
		except Exception as e:
			print "[RemoteWebGui] create_connection Exception: ",e
			return {'status':False, 'msg': str(e)}
		
		return {'status':False, 'msg': 'unknown'}
		
	#def remote_execute
	
	def close_connection(self, port):
		try:
			cmd='xpra stop tcp:0.0.0.0:'+str(port);
			subprocess.call([cmd], shell=True);
		except Exception as e:
			print e
			return -1
		
		return 0


	def run_into_connection(self, command, display):
		try:
			cmd='export DISPLAY='+display+";"+command;
			#//p=subprocess.call([cmd], shell=True);
			p=subprocess.Popen([cmd], shell=True);
			return p
		except Exception as e:
			print e
			return -1

		return 0

	def getXpraConnections(self, identifier):
		######### This function ALWAYS throw an exception
		#This return is my port of this function to native python	
		return([])
		try:
			from plumbum.cmd import grep, cut, ps
			ret=list();
			display_str=''
			pipeline = ps['ef'] | grep[identifier] | grep['DISPLAY'] | cut['-d', ';', '-f', '1'] | cut['-d', '=', '-f', '2']
			display_str = pipeline().rstrip('\n') # execute
			display_arr=display_str.split();

			for display in display_arr:

				pipeline = ps['aux'] | grep[display] | grep['bind-tcp'] | cut['-d', '=', '-f', '2'] | cut['-d', ' ', '-f', '1'] | cut['-d', ':', '-f', '2']
				port = pipeline().rstrip('\n') # execute
				
				ret.append([port, display]);
			return ret;
		except Exception as e:
			print("Exception: %s"%e)
			return []

#class RemoteWebGui
