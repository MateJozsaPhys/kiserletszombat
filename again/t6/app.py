from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, join_room
import os
import uuid

app = Flask(__name__)
# app.secret_key = 'your_secret_key_here'
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'default_secret_key_for_development')
socketio = SocketIO(app)

connected_clients = {}

admin_public_sid = None
list_r_values = []

#------------------------------------------------------------------------------
class Client(object):
    def __init__(self, name, sid):
        self.name = name
        self.sid = sid
        
    def clients2array(clients):
        names = []
        sids = []
        for client in clients:
            names.append(client.name)
            sids.append(client.sid)
        return names
    
#------------------------------------------------------------------------------
@app.route("/")
def index():
        return render_template("index.html")


#------------------------------------------------------------------------------
@app.route("/admin_public")
def admin():
    return render_template("admin_public.html", names=Client.clients2array(connected_clients.values()))

#------------------------------------------------------------------------------
def emit_connected_clients(sid):
    pass
    #socketio.emit('connected_clients_info', {'sid':sid,  'clients': list(connected_clients.difference({sid}))})


#------------------------------------------------------------------------------
@socketio.on('after_connect_client', namespace='/')
def handle_after_connect_client(data):
    # if in a @socketio.on('connect')
    #sid = request.sid
    #name = request.args.get('name')
    sid = data.get('sid', '')
    name = data.get('name', '')
    #sid = request.sid
    print("sid:", sid, " name:", name)
    if 'user_id' not in session:
        session['user_id'] = sid
        connected_clients.update({sid:Client(name, sid)})
        print(f'Client connected: {sid}. Total connected clients: {len(connected_clients)}')
        
    else:
        if session['user_id'] not in connected_clients.keys():
            connected_clients.update({session['user_id']:Client(name, session['user_id'])})
        print(f'Client already connected: {session["user_id"]}. Total connected clients: {len(connected_clients)}')

    # Emit the sid_info event with the sid as data
    #socketio.emit('sid_info', {'sid': sid, 'client_count':len(connected_clients)})
    emit_connected_clients(session['user_id'])


#------------------------------------------------------------------------------
@socketio.on('after_connect_admin_public', namespace='/admin_public')
def handle_after_connect_admin_public(data):
    global admin_public_sid
    admin_public_sid = data.get('sid', '')
    #sid = request.sid
    print("admin_public_sid:", admin_public_sid)


#------------------------------------------------------------------------------
@socketio.on("r_changed", namespace='/')
def handle_r_changed(data):
    sid  = data.get('sid'    , '')
    name = data.get('name'   , '')
    r    = data.get('r_val', '')
    print("sid%s, name:%s, r:%f" % (sid, name, r))
    if r in list_r_values:
        print('r-value', r, 'already used')
    else:
        list_r_values.append(r)
        res = {'r':r,  'name':name, 'sid':sid, 'y':logistic_map(r)}
        #print(res)
        socketio.emit('put_pixels', res, namespace='/admin_public')

#------------------------------------------------------------------------------
def logistic_map(r):
    x = 0.5
    res = []
    for i in range(500):
        x =r*x*(1 - x)
        if i > 250:
            res.append(x)
    return res

#------------------------------------------------------------------------------
@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    print("Disconnect request from sid:", sid)
    print("Admin_public sid is: ", admin_public_sid)
    if sid == admin_public_sid:
        print(f'Public admin is disconnected')
    else:
        del(connected_clients[session['user_id']])
        print(f'Client disconnected: {session["user_id"]}. Total connected clients: {len(connected_clients)}')
        emit_connected_clients(session['user_id'])

if __name__ == '__main__':
    socketio.run(app)
