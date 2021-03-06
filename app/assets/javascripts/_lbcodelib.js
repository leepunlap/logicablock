var lbcontroller = null;
var lbinternaltimer = null;
var lbspritesarray = [];

function lbInit3DObject() {
  var lb3DObj = {
    x:1,
    y:1,
    z:1,
    rx:0,
    ry:0,
    data:[]
  };
  return lb3DObj;
}
function lbAdd8x8Layer(o,d) {
  o.data.push(d)
}

function lbSetPosition(o,x,y,z) {
  o.x = x;
  o.y = y;
  o.z = z;
}

function lbSetRotation(o,rx,ry) {
  o.rx = rx;
  o.ry = ry;
}

function lbSend8x8Object(o) {
  var config = getConfig();
  socket.emit('gamemove',{
    action:'send3dobj',
    username:config.username,
    group:config.group,
    data:o,
    game:'world',
  });
}

function lbGameCanvasWidth() {
  return document.getElementById('gamecanvas').offsetWidth
}
function lbGameCanvasHeight() {
  return document.getElementById('gamecanvas').offsetHeight
}

function makeid(len)
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < len; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function lbSprite(name) {
  var key = makeid(8);
  AppDispatcher.dispatch({
    action:'addsprite',
    key:key,
    name:name
  });
  return key;
}
function lbClearSprites() {
  AppDispatcher.dispatch({
    action:'clearsprites'
  });
}
function lbSetSpritePos(key,x,y) {
  AppDispatcher.dispatch({
    action:'setspritepos',
    key:key,
    x:x,
    y:y
  });
}
function lbSetSpriteVelocity(key,x,y) {
  AppDispatcher.dispatch({
    action:'setspritevelocity',
    key:key,
    vx:x,
    vy:y
  });
}
function lbSetSpriteElasticity(key,el) {
  AppDispatcher.dispatch({
    action:'setspriteelasticity',
    key:key,
    el:el
  });
}
function lbMoveSprites() {
  AppDispatcher.dispatch({
    action:'movesprites',
  });
}

function lbSetGravity(gx,gy) {
  AppDispatcher.dispatch({
    action:'setgravity',
    gx:gx,
    gy:gy
  });
}

function onLbRun() {
  if (typeof(lbRun) == 'undefined') {
    lbMsg("Runtime Error","Must define fuction lbRun()")
  } else {
    lbRun();
  }
}

function onLbStop() {
  if (typeof(lbStop) == 'undefined') {
    lbMsg("Runtime Error","Must define fuction lbStop()")
  } else {
    lbStop();
  }
}

function savelbcode() {
  this.scriptelement = $("lbscript");
  if (this.element) {
    this.element.parentNode.removeChild(this.element);
  }
  this.element = document.createElement("SCRIPT");
  this.element.type = "text/javascript";
  this.element.id = "lbscript";
  this.element.innerHTML = document.getElementById("view").innerText;
  document.getElementsByTagName("HEAD")[0].appendChild(this.element);
  $('#showcode').modal('hide');
  $('#maincanvas').show();
}

function lbMsg(title,msg) {
  document.getElementById("msgtitle").innerText = title;
  document.getElementById("msgbody").innerText = msg;
  if($('#showmsg')) {
    $('#showmsg').modal('show');
  }
}

function lbRemoteButtonPressed (oid, button) {
  if (!lbcontroller) {
    lbMsg("No Controller","Drag controller onto canvas to create one");
    return;
  }
  if (typeof(lbOnRemote) == 'undefined') {
    lbMsg("Runtime Error","Must define fuction lbOnRemote()")
  } else {
    lbOnRemote(oid,button);
  }
}

function lbGameDataReceived (data) {
  if (typeof(lbOnGameData) !== 'undefined') {
    setTimeout(function() {
      lbOnGameData(data);
    }.bind(data),250)
  }
}

function lbSetController (o) {
  function setIO (io) {
    lbcontroller[io.n] = io.objid;
  }
  lbcontroller = o;
  if (typeof(lbcontroller.input) !== 'undefined') {
    lbcontroller.input.map(setIO)
  }
  if (typeof(lbcontroller.output) !== 'undefined') {
    lbcontroller.output.map(setIO)
  }
}

function lbOutput(c,data) {
  if (!lbcontroller) {
    lbMsg("No Controller","Drag controller onto canvas to create one");
    return;
  }
  if (typeof(lbcontroller[c]) == 'undefined') {
    lbMsg("No Connection",c+" is not connected")
  } else {
    AppDispatcher.dispatch({
      action:'lboutput',
      objid:lbcontroller[c],
      data:data
    })
  }
}

function lbCopy(input,output) {
  if (!lbcontroller) {
    lbMsg("No Controller","Drag controller onto canvas to create one");
    return;
  }
  if (typeof(lbcontroller[input]) == 'undefined') {
    lbMsg("No Connection",input+" is not connected")
  } else if (typeof(lbcontroller[output]) == 'undefined') {
    lbMsg("No Connection",output+" is not connected")
  } else {
    AppDispatcher.dispatch({
      action:'lbcopy',
      fromobjid:lbcontroller[input],
      toobjid:lbcontroller[output],
    })
  }
}

function lbClear(output) {
  if (!lbcontroller) {
    lbMsg("No Controller","Drag controller onto canvas to create one");
    return;
  }
  if (typeof(lbcontroller[output]) == 'undefined') {
    lbMsg("No Connection",output+" is not connected")
  } else {
    AppDispatcher.dispatch({
      action:'lbclear',
      objid:lbcontroller[output],
    })
  }
}

function lbSend(output,data) {
  if (!lbcontroller) {
    lbMsg("No Controller","Drag controller onto canvas to create one");
    return;
  }
  if (typeof(lbcontroller[output]) == 'undefined') {
    lbMsg("No Connection",output+" is not connected")
  } else {
    AppDispatcher.dispatch({
      action:'lbsend',
      objid:lbcontroller[output],
      data:data
    })
  }
}


function lbStartTimer(ms) {
  if (!ms) {
    ms = 1000;
  }
  if (lbinternaltimer == null) {
    lbinternaltimer = setInterval(function() {
      if (typeof(lbTimer) !== 'undefined') {
        lbTimer()
      }
    },ms)
  }
}

function lbStopTimer() {
  clearInterval(lbinternaltimer)
  lbinternaltimer = null;
}

var lb_yousay = "";
function lbYouSayReset() {
  lb_yousay = "";
  lbYouSay("");
}

function lbOnGameMessage(msg) {
  if (!lbcontroller) {
    lbMsg("No Controller","Drag controller onto canvas to create one");
    return;
  }
  if (msg.action == "simonsays") {
    lbYouSayReset();
  }
  AppDispatcher.dispatch({
    action:'lbgamemessage',
    objid:lbcontroller.uuid,
    message:msg
  })
}

function lbSendGameMove(move) {
  console.log('move' + move)
  var config = getConfig();
  socket.emit('gamemove',{
    action:'yousay',
    yousay:move,
    username:config.username,
    group:config.group,
    game:'fingerrace',
  });
}

function lbSendDrums(speed,beats) {
  var config = getConfig();
  socket.emit('gamemove',{
    action:'beats',
    speed:speed,
    beats:beats,
    username:config.username,
    group:config.group,
    game:'drums',
  });
}


function lbYouSay(char) {
  lb_yousay = lb_yousay + char;
  AppDispatcher.dispatch({
    action:'lbgamemessage',
    objid:lbcontroller.uuid,
    message:{
      action:"yousay",
      yousay:lb_yousay
    }
  })
  return lb_yousay;
}

function lbShowGameDisplay() {
  $('#gamedisplay').modal('show');
}

function lbHideGameDisplay() {
  $('#gamedisplay').modal('hide');
}

function mergePlayers(arr,inarr) {
  var outarr = inarr;
  for (i=0;i<arr.length;i++) {
    for(j=0;j<outarr.length;j++) {
      to_p = outarr[j];
      from_p = arr[i];
      if (to_p.id == from_p.id) {
        to_p.userdata = from_p.userdata;
      }
    }
  }
  return outarr;
}

function lbSendCode(code) {
    if (typeof(code) !== 'function') {
        lbMsg("lbSendCode","You send a function to your teacher with lbSendCode");
        return;
    }
    var config = getConfig();
    socket.emit('gamemove',{
        action:'sendcode',
        username:config.username,
        group:config.group,
        code:code.toString()
    });
}

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  lbMsg("Error occured at line " + lineNumber + " : ", errorMsg);//or any message
  return false;
}