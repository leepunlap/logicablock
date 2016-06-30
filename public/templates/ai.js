lbClear('o1');

function lbTimer() {
  lbMoveSprites();
}

function lbOnGameData(data) {
  var mood = data.parameters.lbmood;
  var name = data.parameters.myname;
  var action = data.action;
  var mode = 'face';

  if (action === 'newname') {
    mode = 'balls';
    lbClearSprites();
    lbShowGameDisplay();
    var e = lbSprite(name);
    lbSetSpritePos(e,100,20);
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
      lbSetSpriteVelocity(t,30,-50);
      lbSetSpriteElasticity(t,0.9);
      lbSetGravity(0,0);
    } else if (mood === 'sad') {
      lbSetGravity(0,1);
      lbSetSpriteElasticity(t,0.2);
    }
  }

}