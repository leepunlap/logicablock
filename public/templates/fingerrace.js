//
//  This is a sample program for Logica Block
//
//  lbYouSayReset() and lbSendGameMove() are in sequence for a reason.  Reverse it and try
//
//  To find out how lbYouSay() works, add lbMsg('yousay_message',yousay_message); on every button pressed
//
//

var debouncedReset = _.debounce(lbYouSayReset, 1000)

function lbOnRemote(id,button) {
  yousay_message = lbYouSay(button);
  if (yousay_message.length >= 4) {
    lbYouSayReset();
    lbSendGameMove(yousay_message);
  }
  debouncedReset()
}
