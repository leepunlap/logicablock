//
//  This is a sample program for Logica Block
//

function r() {
  return Math.floor(Math.random()*20 - 10);
}

function lbOnRemote(id,button) {
  if (button == 'A') {
    var o = lbInit3DObject();
    lbAdd8x8Layer(o, "000000000e0c0a01");
    lbSetPosition(o, r(), r(), 0);
    lbSend8x8Object(o);
  } else if (button == 'B') {
    o = lbInit3DObject();
    lbAdd8x8Layer(o,"8100000000000081");
    lbAdd8x8Layer(o,"0000000000000000");
    lbAdd8x8Layer(o,"0000000000000000");
    lbAdd8x8Layer(o,"0000000000000000");
    lbAdd8x8Layer(o,"0000000000000000");
    lbAdd8x8Layer(o,"0000000000000000");
    lbAdd8x8Layer(o,"0000000000000000");
    lbAdd8x8Layer(o,"8100000000000081");
    lbSetPosition(o,r(),r(),0);
    lbSend8x8Object(o);
  } else if (button == 'C') {
    o = lbInit3DObject();
    lbAdd8x8Layer(o,"80c0e0f0f8fcfeff");
    lbSetPosition(o,r(),r(),5);
    lbSend8x8Object(o);
  } else if (button == 'D') {
    o = lbInit3DObject();
    lbAdd8x8Layer(o,"a8a8a8f885858678");
    lbSetPosition(o,r(),r(),5);
    lbSend8x8Object(o);
  } else if (button == 'E') {
    o = lbInit3DObject();
    lbAdd8x8Layer(o,"a850a850a8000000");
    lbAdd8x8Layer(o,"50a850a850000000");
    lbAdd8x8Layer(o,"a850a850a8000000");
    lbAdd8x8Layer(o,"50a850a850000000");
    lbAdd8x8Layer(o,"a850a850a8000000");
    lbSetPosition(o,r(),r(),5);
    lbSend8x8Object(o);
  } else if(button == 'F') {
    o = lbInit3DObject();
    lbAdd8x8Layer(o,"8040201008040201");
    lbAdd8x8Layer(o,"c0e070381c0e0703");
    lbAdd8x8Layer(o,"e0f0f87c3e1f0f07");
    lbAdd8x8Layer(o,"f0f8fcfe7f3f1f0f");
    lbAdd8x8Layer(o,"f8fcfeffff7f3f1f");
    lbAdd8x8Layer(o,"fcfeffffffff7f3f");
    lbAdd8x8Layer(o,"feffffffffffff7f");
    lbAdd8x8Layer(o,"ffffffffffffffff");
    lbSetPosition(o,r(),r(),10);
    lbSend8x8Object(o);
  }
}
