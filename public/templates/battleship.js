//
//  This is a sample program for Logica Block
//
//  lbYouSayReset() and lbSendGameMove() are in sequence for a reason.  Reverse it and try
//
//  To find out how lbYouSay() works, add lbMsg('yousay_message',yousay_message); on every button pressed
//
//

function lbStop() {
  lbClear("o1")
}

function lbRun() {
  var battlefield = "809e808087202000"
  lbSend("o1",battlefield)
  var config = getConfig();
  socket.emit('gamemove',{
    action:'setbattlefield',
    battlefield:battlefield,
    username:config.username,
    group:config.group,
    game:'battleship',
  });
}


var debouncedReset = _.debounce(lbYouSayReset, 1000);

function lbOnRemote(id,button) {
  if (lb_yousay.length < 2) {
    lbYouSay(button);
    if (lb_yousay.length == 2) {
      lbSendGameMove(lb_yousay);
    }
  }
  debouncedReset()
}


function lbOnGameData(data) {

}