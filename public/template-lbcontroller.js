////  This is a sample program for Logica Block//function lbOnRemote(id,button) {  if (button == 'A') {    lbCopy('i1','o1');  } else if (button == 'B') {    lbCopy('i2','o1');  } else if(button == 'C') {    lbCopy('i3','o1');  } else {    lbClear('o1');  }}