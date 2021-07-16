import os
import subprocess
import socket
from time import sleep
import psutil
import n4d.responses

class RemoteWebGui:
	
	def __init__(self):
		self.dbg=False		
	#def init
	
	def _debug(self,msg):
		if self.dbg:
			print("[RemoteWebGui] %s"%msg)
	#def _debug

	# Perhaps a get_first_xpra_port_free is needed...
	def get_first_display_free(self):
		'''
		Returns first Display free from 42
		'''
		display=42
		try:
			while(os.path.isfile('/tmp/.X'+str(display)+'-lock')):
				display+=1
			return ":"+str(display)
		except Exception as e:
			print("Captured: "+str(e))
			return {'status': False, 'msg':'[RemoteGuiManager] '+str(e)}
	#def get_first_display
	
	def get_first_free_port(self):
		'''
		Returns first opened port, starting by 10013
		'''
		retval=-1
		port=10013
		sock=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		
		while (port<99999):
			status=sock.connect_ex(('127.0.0.1', port))
			self._debug("checking port "+str(port)+" is "+str(status))
			if status!=0:
				retval=port
				break
			port=port+1
		return retval
	#def get_first_free_port

	def create_connection(self,  username, xephyr_options=" -ac -screen 1024x768 -dpi 96 "):
		# Username is needed as parameter and return value must be the port
		os.environ["HOME"]="/home/"+username
		os.environ["XAUTHORITY"]="/home/"+username+"/.Xauthority"

		display=self.get_first_display_free()
		port=self.get_first_free_port()
		
		self._debug("PORT: %s DISPLAY: %s"%(port,display))

		xephyr_cmd="Xephyr "+xephyr_options+" "+display
		xpra_cmd="xpra start --bind-tcp=0.0.0.0:"+str(port)
		xpra_cmd=xpra_cmd+" --html=on --no-pulseaudio --systemd-run=no --exit-with-children --start-via-proxy=no  --start-child='"+xephyr_cmd+"'"

		self._debug("Exec: "+xpra_cmd)
		try:
			p=subprocess.call([xpra_cmd], shell=True);			
		except Exception as e:
			print("[RemoteWebGui] create_connection Exception: {}".format(e))
			return n4d.responses.build_failed_call_response(ret_msg=str(e))
			# return {'status':False, 'msg': str(e)}
		
		# wait until port is listening
		sock=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		status=111
		while (status!=0):
			status=sock.connect_ex(('127.0.0.1', port))
		
		self._debug("port "+str(port)+" is available with status: "+str(status))
		return n4d.responses.build_successful_call_response({"port":str(port), "display":display})
		# return {"status":True, "msg":{"port":str(port), "display":display}}
	#def remote_execute
	
	def create_connection_vnc(self, id, options):
		try:
			startup='/etc/X11/Xsession'
			if options and isinstance(options,str):
				if options == 'terminal':
					startup='/usr/bin/xterm'
				elif options == 'minimal':
					startup='/usr/bin/jwm'
			port=self.get_first_free_port()
			self._debug("PORT: %s DISPLAY: %s"%(port,id))
			chroot = "/opt/ltsp/{}".format(id)
			self.machineid=id
			self.nspawn=subprocess.Popen("/usr/bin/systemd-nspawn -E SHELL=/bin/bash -E LANG=es_ES.utf8 --private-users=0 --private-users-chown -M {} -D{} tigervncserver -SecurityTypes None -depth 24 -geometry 1024x768 -fg -xstartup {}".format(id,chroot,startup),shell=True)
			retry = 3
			while retry>0:
				try:
					p=subprocess.check_output('pgrep tigervncserver',shell=True)
					p=p.strip()
					retry=0
				except Exception as e:
					sleep(1)
					retry-=1
					pass
			self.tiger=int(p)
		except Exception as e:
			print("[RemoteWebGui] create_connection Exception: {}".format(e))
			return n4d.responses.build_failed_call_response(ret_msg=str(e))
			# return {"status":False,"msg":e}
		return n4d.responses.build_successful_call_response({"port": str(port), "process": self.nspawn.pid})
		# return {"status":True, "msg":{"port": str(port), "process": self.nspawn.pid}}
	
	def close_connection(self, port):
		retval=0
		try:
			cmd='xpra stop tcp:0.0.0.0:'+str(port)
			subprocess.call([cmd], shell=True)
		except Exception as e:
			print("close_connection: %s"%e)
			retval=-1
		return n4d.responses.build_successful_call_response(retval)
		# return retval
	#def close_connection

	def close_connection_vnc(self, port):
		retval=0
		try:
			import os
			try:
				os.kill(self.tiger,15)
				sleep(1)
				os.kill(self.websockify.pid,15)
				sleep(1)
				os.system('machinectl kill {}'.format(self.machineid))
				os.system('machinectl kill {}'.format(self.machineid))
				os.system('machinectl kill {}'.format(self.machineid))
			except:
				pass
		except Exception as e:
			print("close_connection: %s"%e)
			retval=-1
		return n4d.responses.build_successful_call_response(retval)
		# return retval
	#def close_connection

	def run_into_connection(self, command, display):
		self._debug("Sleeping...\n")
		#There's a race condition and sometimes DISPLAY is not set... wait a moment for it
		sleep(7)
		self._debug("Wake up...\n")
		cmd='export DISPLAY='+display+";"+command
		self._debug(cmd)
		try:
			#//p=subprocess.call([cmd], shell=True)
			p=subprocess.Popen([cmd], shell=True)
		except Exception as e:
			print("Run_into_connection: %s"%e)
			p=-1
		return n4d.responses.build_successful_call_response(p)
		# return p
	#def run_into_connection

	def run_into_connection_vnc(self, command, port):
		cmd = "/usr/bin/websockify --web /usr/share/novnc {} localhost:5901".format(port)
		try:
			p=subprocess.Popen([cmd], shell=True)
			self.websockify = p
		except Exception as e:
			print("Run_into_connection: %s"%e)
			p=-1
		return n4d.responses.build_successful_call_response(p)
		# return p
	#def run_into_connection

	def getXpraConnections(self, identifier):
		bind_arr=[]
		display_arr=[]
		ret=[]
		for p in psutil.process_iter(attrs=['cmdline']):
			if len(p.info['cmdline'])>2:
				if (('DISPLAY' in p.info['cmdline'][-1]) and (identifier in p.info['cmdline'][-1])):
					for disp in p.info['cmdline'][-1].split():
						if 'DISPLAY' in disp:
							display_arr.append(disp.split(';')[0].split('=')[-1])
				elif ((len(p.info['cmdline'])>3) and ('bind-tcp' in p.info['cmdline'][3])):
					bind_arr.append(' '.join(p.info['cmdline']))

		for display in display_arr:
			for bind in bind_arr:
				if bind.endswith(display):
					port=bind.split(' ')[3].split(':')[-1]
					ret.append([port, display])
		return n4d.responses.build_successful_call_response(ret)
		# return ret
	#def getXpraConnections

#class RemoteWebGui
