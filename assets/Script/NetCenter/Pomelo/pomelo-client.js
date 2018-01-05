let EventEmitter = require('lib_eventEmitter');
let Protocol = require('lib_protocol');

let obj_io = require('socket-io');

let Ntest = 9987;
module.exports = Ntest;

(function() {
  //if (typeof Object.create !== 'function') {
  //  Object.create = function (o) {
  //    function F() {}
  //    F.prototype = o;
  //    return new F();
  //  };
  //}

  var root = window;
  //var pomelo = Object.create(EventEmitter.prototype); // object extend from object
    let F = function () {};
    F.prototype = EventEmitter.prototype;
    var pomelo = new F();
  root.pomelo = pomelo;
  var socket = null;
  var id = 1;
  var callbacks = {};
  var encode = null;
  var decode = null;

  pomelo.init = function(params, cb) {
    pomelo.params = params;
    params.debug = true;
    var host = params.host;
    var port = params.port;
    encode = params.encode || defaultEncode;
    decode = params.decode || defaultDecode;

    var url = 'ws://' + host;
    if(port) {
      url +=  ':' + port;
    }

    console.log('connecto to ' + url);

    socket = obj_io.connect(url, {'force new connection': true, reconnect: true});

    socket.on('connect', function(){
      console.log('[pomeloclient.init] websocket connected!');
      if (cb) {
        cb(socket);
      }
    });

    socket.on('reconnect', function() {
      console.log('reconnect');
    });

    socket.on('message', function(data){
      if(decode) {
        data = decode(data);
      }

      if(data instanceof Array) {
        processMessageBatch(pomelo, data);
      } else {
        processMessage(pomelo, data);
      }
    });

    socket.on('error', function(err) {
      console.log(err);
    });

    socket.on('disconnect', function(reason) {
      pomelo.emit('disconnect', reason);
    });
  };

  pomelo.disconnect = function() {
    if(socket) {
      socket.disconnect();
      socket = null;
    }
  };

  var defaultEncode = pomelo.encode = function(reqId, route, msg) {
    return Protocol.encode(id, route, msg);
  };

  var defaultDecode = pomelo.decode = function(data) {
    if(typeof data === 'string') {
      data = JSON.parse(data);
    }
    return data;
  };

  pomelo.request = function(route) {
    if(!route) {
      return;
    }
    var msg = {};
    var cb;
    let args = Array.prototype.slice.apply(arguments);
    if(args.length === 2){
      if(typeof args[1] === 'function'){
        cb = args[1];
      } else if(typeof args[1] === 'object'){
        msg = args[1];
      }
    } else if(args.length === 3){
      msg = args[1];
      cb = args[2];
    }

    id++;
    callbacks[id] = cb;

    sendMessage(id, route, msg);
  };

  pomelo.notify = function(route, msg) {
    msg = msg || {};
    sendMessage(0, route, msg);
  };

  var sendMessage = function(reqId, route, msg) {
    if(encode) {
      msg = encode(reqId, route, msg);
    }
    socket.send(msg);
  };

  var processMessage = function(pomelo, msg) {
    var route;
    if(msg.id) {
      //if have a id then find the callback function with the request
      var cb = callbacks[msg.id];

      delete callbacks[msg.id];
      if(typeof cb !== 'function') {
        console.log('[pomeloclient.processMessage] cb is not a function for request ' + msg.id);
        return;
      }

      cb(msg.body);
      return;
    }

    // server push message or old format message
    processCall(msg);

    //if no id then it should be a server push message
    function processCall(msg) {
      var route = msg.route;
      if(!!route) {
        if (!!msg.body) {
          var body = msg.body.body;
          if (!body) {body = msg.body;}
          pomelo.emit(route, body);
        } else {
          pomelo.emit(route,msg);
        }
      } else {
          pomelo.emit(msg.body.route,msg.body);
      }
    }
  };

  var processMessageBatch = function(pomelo, msgs) {
    for(var i=0, l=msgs.length; i<l; i++) {
      processMessage(pomelo, msgs[i]);
    }
  };

  module.exports = pomelo;
})();