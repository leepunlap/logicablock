var lbcontroller = null;
var lbinternaltimer = null;

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
}

function lbMsg(title,msg) {
  document.getElementById("msgtitle").innerText = title;
  document.getElementById("msgbody").innerText = msg;
  $('#showmsg').modal('show');
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

function lbStartTimer(ms) {
  if (!ms) {
    ms = 1000;
  }
  lbinternaltimer = setInterval(function() {
    if (typeof(lbTimer) !== 'undefined') {
      lbTimer()
    }
  },ms)
}

function lbStopTimer() {
  clearInterval(lbinternaltimer)
  lbinternaltimer = null;
}

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  lbMsg("Error occured: ", errorMsg);//or any message
  return false;
}