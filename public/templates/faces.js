//
//  This is a sample program for Logica Block
//

var i = 0;

function lbTimer() {
  if (i == 0) {
    lbCopy('i1','o1');
    i = i + 1;
  } else {
    lbCopy('i2','o1')
    i = 0;
  }
}

function lbStop() {
  lbMsg("Goodbye","Goodbye World");
  lbStopTimer();
}

function lbRun() {
  i = 0;
  lbMsg("Hello","Hello World");
  // lbOutput('o1',"006666000045aa10");
  lbStartTimer();
}