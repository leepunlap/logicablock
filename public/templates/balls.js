//
//  This is a sample program for Logica Block
//

function lbTimer() {
  lbMoveSprites();
}

function lbStop() {
  lbClearSprites();
  lbHideGameDisplay();
  lbStopTimer();
}

function lbRun() {
  lbShowGameDisplay();
  var t = lbSprite("Tom");
  var m = lbSprite("Mary");
  var e = lbSprite("Edmond");
  lbSetSpritePos(t,100,20);
  lbSetSpritePos(m,300,20);
  lbSetSpritePos(e,500,20);
  lbSetSpriteVelocity(t,0,30);
  lbSetSpriteVelocity(m,0,60);
  lbSetSpriteVelocity(e,0,90);
  lbSetSpriteElasticity(t,0.8);
  lbSetSpriteElasticity(m,0.6);
  lbSetSpriteElasticity(e,0.4);
  lbSetGravity(0,1);
  lbStartTimer(25);
}

