//
//  This is a sample program for Logica Block
//
function lbRun() {

  var speed = 125;
  var drumNotes = {};

  drumNotes.snare = ["0808","0808","0808","2222"];
  drumNotes.rim = ["8080","8080","8080","8888"];
  drumNotes.perc1 = ["000a","000a","00aa","2222"];

  lbSendDrums(speed, drumNotes);

}
