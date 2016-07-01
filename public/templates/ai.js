var e;
var mode = 'face';

function lbTimer() {
  lbMoveSprites();
}

function lbStop() {
  lbClearSprites();
  lbHideGameDisplay();
  lbStopTimer();
}

function lbRun() {
  lbClear('o1');
}

function lbOnGameData(data) {
  var mood = data.parameters.lbmood;
  var name = data.parameters.myname;
  var action = data.action;

  if (action === 'newname') {
    mode = 'balls';
    lbClearSprites();
    lbShowGameDisplay();
    e = lbSprite(name);
    lbSetSpritePos(e,100,20);
    lbStartTimer(25);
  }

  if (mode === 'face') {
    if (mood === '') {
      lbCopy('i1','o1');
    } else if (mood === 'happy') {
      lbCopy('i2','o1');
    } else if (mood === 'sad') {
      lbCopy('i3','o1');
    } else if (mood === 'angry') {
      lbCopy('i4','o1');
    }
  }

  if (mode === 'balls') {
    if (mood === 'happy') {
      lbSetSpriteVelocity(e,30,-50);
      lbSetSpriteElasticity(e,0.9);
      lbSetGravity(0,0);
    } else if (mood === 'sad') {
      lbSetGravity(0,1);
      lbSetSpriteElasticity(e,0.2);
    }
  }

}