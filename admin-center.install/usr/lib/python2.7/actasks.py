import time
import threading
import tempfile

import subprocess
import os
import signal
import datetime
import shutil
#import pexpect

from wsmanager import WSManager
## Crea un swmanager unic, al que li enviaran tots els missatges, etiquetats per l'id del treball


#import signal
#import shutil


class Task:
    def __init__(self, taskid, command, cancelcommand=''):
        '''
        It is a task in server, with certain taskid and performing certain command
        When is created, its status will be "PREPARED"
        And waits to be run
        It prepares command and log file in /run
        '''
        
        self.taskid=taskid
        self.process=None
        self.status='PREPARED'
        self.command=command
        self.cancelcommand = cancelcommand
        self.logfolder="/run/taskmanager"
        self.filepipe=''
        self.locks = {}
        self.seek=0
        
        # Clean log folder and create
        if (os.path.exists(self.logfolder)):
            shutil.rmtree(self.logfolder)
        os.mkdir(self.logfolder)
    
        '''
        'msg':None,
        'target': target,
        'command':command,
        started_by':str(ip),
        listeners': [],
        filepipe': '',
        seek' : 0,
        method':call_info['method'],
        class': call_info['class']
        '''

        pass

    def get(self):
        '''
        Returns this task
        '''
        
        return str({"taskid":self.taskid,
                "process":self.process,
                "status":self.status,
                "command": self.command,
                "logfolder":self.logfolder,
                "filepipe": self.filepipe});
        
    def getFilePipe(self):
        '''
        Returns this task filepipe
        '''
        return self.filepipe

    def getStatus(self):
        '''
        Returns this task status
        '''
        return self.status

    def run(self):
        '''
        Runs current task
        
        it prepares process and temporally log file and runs it
        
        '''
        # locking thread
        lock = threading.Lock()
        self.locks[self.taskid]={}
        self.locks[self.taskid]['lock'] = lock        
        self.locks[self.taskid]['lock'].acquire()
        
        # Create temp logfile
        temp = tempfile.NamedTemporaryFile(prefix='pipe_', dir=self.logfolder, delete=False)
        proc = subprocess.Popen([self.command+"; sleep 5"],  shell=True, stdout=temp, preexec_fn=os.setsid)

        # Adding process
        self.process = proc
        self.status = "RUNNING"
        self.filepipe = temp.name

        # Getting process output
        ret=self.process.poll()
        while ret is None:
            time.sleep(1)
            ret=self.process.poll()

        if (str(ret)=='0'):
            self.status="DONE"
        else:
            self.runCancel()
            if (str(ret)=='-9'):
                self.status="CANCELLED"
            else: # return code 1 when install fails
                self.status="BROKEN"


        print "[TASKMANAGER] END WAIT AT "+str(datetime.datetime.now())
        print "[TASKMANAGER] FINISHING!!!, return code: "+str(ret)
        
        ## Millora: Abans d'enviar que ha acabat que espere a tindre els buffers buits...
        
        
        # Sending last line to log for all listeners
        line="<b>Finished with status:"+self.status+"</b>\n"
        aux = open(self.filepipe,'a')
        aux.writelines(line)
        aux.close()


        # Append result of job and release mutex. Now all inform_me return finish
        self.locks[self.taskid]['result'] = str(ret)
        self.locks[self.taskid]['lock'].release()
                
        pass
        
    def runTask(self):
        '''
        runs task in an independent thread
        '''
        # Prepare thread        
        taskthread = threading.Thread(target=self.run, args=())
        taskthread.daemon = True
        taskthread.start()
        
        return True

    def runCancel(self):
        '''
            Sync method to run cancel command
        '''
        temp = open(self.filepipe,'a+b')
        proc = subprocess.Popen([self.cancelcommand],  shell=True, stdout=temp, preexec_fn=os.setsid).communicate()
        #close the pipe
        temp.close()


    def stop(self):
        try:
            #print "Killing me softly"
            #msg=self.process.killpg();
            msg=os.killpg(self.process.pid, signal.SIGTERM)
            
            #print "Killing me with this song: ",msg
            return {"status": True, "msg": str(msg)}
        except Exception as e:
            #print "with this song: ", str(e)
            return {"status": False, "msg": str(e)}
    
    
    
