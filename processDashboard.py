# Copyright (c) 2019, Bosch Engineering Center Cluj and BFMC orginazers
# All rights reserved.

# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:

# 1. Redistributions of source code must retain the above copyright notice, this
#    list of conditions and the following disclaimer.

# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.

# 3. Neither the name of the copyright holder nor the names of its
#    contributors may be used to endorse or promote products derived from
#    this software without specific prior written permission.

# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
# import eventlet
# eventlet.monkey_patch()

if __name__ == "__main__":
    import sys
    sys.path.insert(0, "../../..")

from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import logging, inspect
from enum import Enum
from flask_cors import CORS
import psutil  
import src.utils.messages.allMessages as allMessages
from src.utils.messages.messageHandlerSubscriber import messageHandlerSubscriber
from src.utils.messages.messageHandlerSender import messageHandlerSender
from src.templates.workerprocess import WorkerProcess
from src.dashboard.threads.threadStartFrontend import ThreadStartFrontend  

class processDashboard(WorkerProcess):
    """This process handles the dashboard interactions, updating the UI based on the system's state.
    Args:
        queueList (dictionary of multiprocessing.queues.Queue): Dictionary of queues where the ID is the type of messages.
        logging (logging object): Made for debugging.
        deviceID (int): The identifier for the specific device.
    """

    # ====================================== INIT ==========================================
    def __init__(self, queueList, logging):
        self.app = Flask(__name__)
        self.socketio = SocketIO(self.app, cors_allowed_origins="*",async_mode='eventlet' )
        CORS(self.app, supports_credentials=True)
        self.running = True
        self.queueList = queueList
        self.logger = logging
        self.messages = {}
        self.messagesAndVals = self.getNamesAndVals()
        self.subscribe()
        self.namesAndVals = self.getNamesAndVals()
        # Define routes
        self.app.add_url_rule('/', view_func=self.index)

        # Define WebSocket event handlers
        self.socketio.on_event('connect', self.test_connect)
        self.socketio.on_event('disconnect', self.test_disconnect)
        self.socketio.on_event('message', self.handle_message)

        self.socketio.start_background_task(self.send_continuous_messages)
        super(processDashboard, self).__init__(self.queueList)

    # ===================================== STOP ==========================================
    def stop(self):
        super(processDashboard, self).stop()

    # ===================================== RUN ==========================================
    def run(self):
        """Apply the initializing methods and start the threads."""
        self._init_threads()
        for th in self.threads:
            th.daemon = self.daemon
            th.start()
        self.socketio.run(self.app, host='0.0.0.0', port=5005)

    def index(self):
        return jsonify({"message": "Welcome to the Flask-SocketIO server!"})

    def subscribe(self):
        """Subscribe function. In this function we make all the required subscribe to process gateway"""
        for name, enum in self.messagesAndVals.items():
            subscriber = messageHandlerSubscriber(self.queueList, enum["enum"], "lastOnly", True)
            self.messages[name] = {"obj": subscriber, "type": enum["type"]}

    def getNamesAndVals(self):
        messages = {}
        classes = inspect.getmembers(allMessages, inspect.isclass)
        for name, cls in classes:
            if name != "Enum" and issubclass(cls, Enum):
                messages[name] = {"enum": cls, "type": cls.msgType.value}
        return messages

    def test_connect(self):
        print("Client connected")
        emit('after connect', {'data': 'Connected to server.'})

    def handle_message(self, data):
        print('received message: ' + str(data))
        emit('response', {'data': 'Message received: ' + str(data)})

    def test_disconnect(self):
        print('Client disconnected')

    def send_continuous_messages(self):   
        while self.running == True:
            for msg in self.messages:
                resp = self.messages[msg]["obj"].receive()
                if resp is not None:
                    self.socketio.emit(msg, {self.messages[msg]["type"]: resp})
            memory_usage = psutil.virtual_memory().percent
            cpu_core_usage = psutil.cpu_percent(interval=1, percpu=True)
            disk_usage = psutil.disk_usage('/').percent
            self.socketio.emit('memory_channel', {'data': memory_usage})
            self.socketio.emit('cpu_channel', {'data': cpu_core_usage})
            self.socketio.emit('disk_channel', {'data': disk_usage})
            self.socketio.sleep(1)
        
    # ===================================== INIT TH ======================================
    def _init_threads(self):
        """Create the Dashboard thread and add to the list of threads."""
        # dashboardThreadFrontend = ThreadStartFrontend(self.logger)
        # self.threads.append(dashboardThreadFrontend)


