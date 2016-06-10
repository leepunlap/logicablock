//
//  This is a sample program for Logica Block
//
function lbRun() {

  var speed = 125;
  var drumNotes = {};

  drumNotes.snare = ["0800","0800","0808","2222"];
  drumNotes.rim = ["8080","8080","8000","8888"];
  drumNotes.perc1 = ["0008","000A","0A0A","2222"];

  lbSendDrums(speed, drumNotes);

}
