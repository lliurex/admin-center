import time

from actasks import Task
from wsmanager import WSManager
import websocket

import threading
import tempfile

import os
#import signal
import shutil
import ntpath

import n4d.responses


class TaskMan():
    '''
    Server Task Manager
    
    Manages all tasks in server and its communication via web sockets
    
    '''

    ERROR_SERVER_BUSY = -50


    def __init__(self):
        self.tasks={}                              # Task Dictionary
        self.wsManager=WSManager()                 # Websocket manager (server)
        self.ws=websocket.WebSocket()                  # websocket client (for write)
        self.port=self.wsManager.getWs()["wsport"]     # Getting websocket port
        self.ws.connect("ws://127.0.0.1:"+str(self.port))   #  "One websocket to dominate all" (Lord of the WebSockets)

    def getWS(self):
        try:
            if(self.port):
                return n4d.responses.build_successful_call_response({"status":True,'ws':'ws://127.0.0.1:'+str(self.port)})
                # return {'status':True, 'ws':'ws://127.0.0.1:'+str(self.port)}
            else:
                return n4d.responses.build_failed_call_response(ret_msg='self.port does not exists')
                # return {'status':False, 'msg':'self.port does not exists'}
            
        except Exception as e:
                return n4d.responses.build_failed_call_response(ret_msg=str(e))
                # return {'status':False, 'msg':str(e)}
            
    

    def newTask(self, command, cancelCommand=''):
        '''
        creates a new task, identified by an id got from current time, and runs it
        '''
        try:
            # Checking if there is any task running            
            for task in self.tasks:
                status=self.getTaskStatus(task)["result"]["taskStatus"]
                if status=="RUNNING":
                    return n4d.responses.build_failed_call_response(TaskMan.ERROR_SERVER_BUSY)
            
            # If there is not any task running, let's continue
            
            id = int(round(time.time()*10))%32000               # generating new id from sys time
            newtask = Task(id, command, cancelCommand)    # Create new task object (frow library actasks)            
            self.tasks[str(id)] = newtask                 # Adding to task dictionary            
            newtask.runTask()                           # running Task

            # Prepare thread (for multicasting, it will reads task log and redirects to websocket)
            multicast_thread = threading.Thread(target=self.multicast, name="Taskman admin-center thread", args=([newtask]))
            multicast_thread.daemon = True
            multicast_thread.start()

            return n4d.responses.build_successful_call_response(str(id))            
            # return {"status": True, "msg":str(id)}
        except Exception as e:
            return n4d.responses.build_failed_call_response(ret_msg=str(e))
            # return {"status": False, "msg":str(e)}
    
    def getTasks(self):
        '''
        Gets info for all tasks
        '''
        try:
            return n4d.responses.build_successful_call_response(str(self.tasks))
            # return {"status":True, "msg":str(self.tasks)}
        except Exception as e:
            return n4d.responses.build_failed_call_response(ret_msg=str(e))
            # return {"status": False, "msg":str(e)}
        
    
    def getTask(self, taskid):
        '''
        Gets info for current task
        '''
        try:
            return n4d.responses.build_successful_call_response(self.tasks[taskid].get())
            # return {"status":True, "msg":self.tasks[taskid].get()}
        except Exception as e:
            return n4d.responses.build_failed_call_response(ret_msg=str(e))
            # return {"status": False, "msg":str(e)}
        
    def getTaskStatus(self, taskid):
        '''
        Gets status for current task
        '''
        try:
            return n4d.responses.build_successful_call_response({"taskStatus":self.tasks[taskid].getStatus()})
            # return {"status":True, "taskStatus":self.tasks[taskid].getStatus()}
        except Exception as e:
            return n4d.responses.build_failed_call_response(ret_msg=str(e))
            # return {"status": False, "msg":str(e)}
        

    def prepareLogForDownload(self, taskid):
        '''
        Copies task status from /run/taskmanager/pipe_XXX corresponding to taskid to admincenter/logs
        '''
        try:
            pipe=self.tasks[taskid].getFilePipe()
            if not os.path.exists("/tmp/taskslog"):
                os.makedirs("/tmp/taskslog")
            shutil.copy(pipe, "/tmp/taskslog/")
            return n4d.responses.build_successful_call_response({"file":ntpath.basename(pipe)})
            # return {"status":True, "file":ntpath.basename(pipe)}
        
        except Exception as e:
            return n4d.responses.build_failed_call_response(ret_msg=str(e))
            # return {"status": False, "msg":str(e)}

    def cancelTask(self, taskid):
        print("REMOVING {}".format(str(taskid)))
        if not isinstance(taskid,str):
            taskid=str(taskid)
        return n4d.responses.build_successful_call_response(self.tasks[taskid].stop())
        # return self.tasks[taskid].stop()

    def listenTask(self, taskid):
        '''
        adds a new listener to tasks listener
        '''
        try:
            print("listening for task {}".format(taskid))
            print("{}".format(self.tasks[taskid].get()))
            return n4d.responses.build_successful_call_response()
            # #return {"status": True, "msg":self.tasks[taskid].get()}
        except Exception as e:
            return n4d.responses.build_failed_call_response(ret_msg=str(e))
            # return {"status": False, "msg":str(e)}        

    def multicast(self, task):
        try:
            while True:
                while (str(task.filepipe)==""): # Waitint to have task ready
                    time.sleep(0.5)
                
                print(str(task.filepipe))
                if not os.path.exists(task.filepipe):
                    time.sleep(1)
                else:
                    break
                    #return False
            pipe = open(task.filepipe,'r')
            pipe.seek(task.seek,0)
            try:
                line = pipe.readline()
                if line:
                    self.ws.send(str({"id": str(task.taskid), "line":line}))
                while task.status=="RUNNING" or line:
                    line = pipe.readline()
                    while (line):
                        self.ws.send(str({"id": str(task.taskid), "line":line}))
                        line=pipe.readline()
                        task.seek = pipe.tell()
            except Exception as e:
                print("[TASKMANAGER] Exception while reading pipe "+str(e))
        except Exception as e:
            print("[TASKMANAGER] Exception while reading pipe "+str(e))
        self.ws.send(str({"id": str(task.taskid), "line":"[TASKMANAGER] process finished"}))
        
