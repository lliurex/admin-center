import socket
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import threading

import base64

import time
import json
import re


class WSLog(WebSocket):
    listeners = []
    #def __init__(self):
    def __init__(self, server, sock, address):
        WebSocket.__init__(self, server, sock, address)
        pass
    
    def handleMessage(self):
        '''
        triggers when websocket receives a new message. Data is in self.data
        it runs through all listeners for the job and send data to them
        
        i si en lloc de tindre un array general de listeners tenim els listeners per cada tasca ???????????????
        
        '''
        #print " [LOG] Received message: "+str(self.data)
        #print self.listeners

        for listener in self.listeners:   
            #if listener != self:
            
                #print " [LOG] Sending "+str(self.data)+" to "+str(listener[0])
                
                try:
                    taskid=int(json.loads(self.data.replace("'", "\"").replace("\n", ""))["id"])
                    
                    #print "checking "+str(listener[1])+" with "+str(taskid)
                    
                    if ((taskid)==listener[1] or listener[1]==0):
                        #print "FOUND LISTENER: "+str(listener[1])
                        msgtype="text"
                        #print (str(self.data))
                        if((str(self.data).find("<b>Finished with status:"))>=0): # Found finished signal
                            msgtype="end_signal"
                            
                        # WTF! msg_data=content=json.loads((str(self.data)).replace("'", "\"").replace("\\n",""));
                        msg_data=json.loads((str(self.data)).replace("'", "\"").replace("\\n",""));
                        #print "***"
                        #print msg_data["line"]
                        #print "!!!!"
                        ##listener[0].sendMessage(u'{"msg":"'+ base64.b64encode(msg_data["line"])+'", "type":"'+msgtype+'"}')  ## Igual es este el que posava el 127.0.0.1 - davant!!
                        #listener[0].sendMessage(u'{"msg":"'+msg_data["line"]+'", "type":"'+msgtype+'"}')  ## Igual es este el que posava el 127.0.0.1 - davant!!
                        
                        listener[0].sendMessage(u'{"msg":"'+ self.encodeb64(msg_data["line"])+'", "type":"'+msgtype+'"}')  ## Igual es este el que posava el 127.0.0.1 - davant!!
                        
                        #print "???"
                        #listener[0].sendMessage(u'{"msg":"'+ base64.b64encode(self.data)+'", "type":"'+msgtype+'"}')  ## Igual es este el que posava el 127.0.0.1 - davant!!
                        
                        
                except Exception as e:
                    print(e)
                    
                 
                
                #listener.sendMessage(self.address[0] + u' - ' + self.data)  ## Igual es este el que posava el 127.0.0.1 - davant!!
                
        pass

    def encodeb64(self,string):
        bstring = None
        if isinstance(string,bytes):
            bstring = string
        if isinstance(string,str):
            bstring = string.encode('utf8')
        res = base64.b64encode(bstring)
        return res.decode('utf8')
    
    def handleConnected(self): ## Podriem rebre tambe l'id del treball ??????????????????????
        '''
        Triggers when websocket receives a connection request
        '''
        
        #print ("Connection request from:"+self.address[0]);
        job=self.getJobFromRequest(self.headerbuffer.decode("utf-8"));        
        #print "ADDING NEW LISTENER"
        self.listeners.append([self, job])
        #self.listeners.append(self)
        self.sendMessage(u'{"msg":"'+self.encodeb64("Listening server...")+'", "type":"text"}');
        #self.sendMessage(u'{"msg":"Listening server..."}');
            
        '''if (self.address[0]=='127.0.0.1'):
            #print "\t\t", self.address, 'connected...'
            pass
            #for listener in self.listeners:   
            #    if listener != self:
            #        listener.sendMessage(u'{"msg":"- Connected server"}');
        else:
            # print self.address, 'connected and added to listeners'
            print "ADDING NEW LISTENER"
            self.listeners.append(self)
            self.sendMessage(u'{"msg":"'+base64.b64encode("Listening server...")+'"}');
        '''
    def handleClose(self):
       
       jobid=self.getJobFromRequest(self.headerbuffer.decode("utf-8"));
       print("{} {} {}".format(self.address,'closed and removed for job: ',jobid))
       #self.listeners.remove(self)
       self.listeners.remove([self, job])
       
       
    def getJobFromRequest(self, request):
        '''
        job is told in ws connection: ws://IP:port/jobid
        '''

        lines=request.split("\n");
        ret=((lines[0].split("/")[1]).replace(" HTTP",""))
        if ret=="":
            return 0
        else:
            return int(ret)
        pass




class WSManager:
    def __init__(self):
        #self.statPort=4224;
        #self.wsport=self.__getFreePort();
        self.wsServer=self.prepareWebSocketServer();
        
        # Per tancar-lo mentre s'esta executant
        # self.wsServer["wsserver"].close();
        
        pass
    
    def getWs(self):
        #print self.wsServer;
        return self.wsServer;
            
    
    def serveforever(self, server):
        try:
            # print "serving"
            server.serveforever()
        except Exception as e:
            print("[Serverforever] Exception: "+str(e)+" Exit from thread...")
            exit()
        pass
    

    def prepareWebSocketServer(self):
        
        # Prepare Websocket connection
        server = SimpleWebSocketServer('', 0, WSLog)
        port=server.serversocket.getsockname()[1]
        #print port;
        #self.serveforever(server);
        wsthread = threading.Thread(target=self.serveforever, args=([server]))
        wsthread.daemon = True
        wsthread.start()
        #print ("Create connection to 127.0.0.1:"+str(port))
        #self.serveforever(server);
        
        #self.servers.append({"wsserver":server, "wsclient":None, "wsport":port, "socksrv":srv_socket, "sport":srv_port});
            
        return {"wsserver":server, "wsport":port}
            
        pass
    
    #def getWSPort(self):
    #    return self.wsport;
   

    

    #    pass

