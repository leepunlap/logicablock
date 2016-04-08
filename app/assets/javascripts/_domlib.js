function createNavLineElement(x, y, length, angle, display) {
  return {
    position: 'absolute',
    backgroundColor: 'orange',
    width: length,
    height: 2,
    WebkitTransform: 'rotate(' + angle + 'rad)',
    MozTransform: 'rotate(' + angle + 'rad)',
    OTransform: 'rotate(' + angle + 'rad)',
    MsTransform: 'rotate(' + angle + 'rad)',
    top: y,
    left: x,
    display: display
  };
}

function createNavLine(x1, y1, x2, y2, display) {
  var a = x1 - x2,
    b = y1 - y2,
    c = Math.sqrt(a * a + b * b);
  if (isNaN(c)) {
    return;
  }
  var sx = (x1 + x2) / 2,
    sy = (y1 + y2) / 2;
  var x = sx - c / 2,
    y = sy;
  var alpha = Math.PI - Math.atan2(-b, a);
  return createNavLineElement(x, y, c, alpha, display);
}


function closestConnectorStyle(x,y,srcobjid,dx,dy,destobjid) {
  var srcobj = $('#' + srcobjid)[0];
  var sw = srcobj.clientWidth;
  var sh = srcobj.clientHeight;
  var destobj = $('#' + destobjid)[0];
  var dw = destobj.clientWidth;
  var dh = destobj.clientHeight;
  var srcconns = [];
  srcconns.push({x: x, y: y + sh / 2});
  srcconns.push({x: x + sw, y: y + sh / 2});
  srcconns.push({x: x + sw / 2, y: y});
  srcconns.push({x: x + sw / 2, y: y + sh});
  var destconns = [];
  destconns.push({x: dx, y: dy + dh / 2});
  destconns.push({x: dx + dw, y: dy + dh / 2});
  destconns.push({x: dx + dw / 2, y: dy});
  destconns.push({x: dx + dw / 2, y: dy + dh});

  var srcside = 0;
  var destside = 0;
  var mindist = 9999;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var s = srcconns[i];
      var d = destconns[j];
      var a = s.x - d.x;
      var b = s.y - d.y;
      var l = Math.sqrt(a * a + b * b);
      if (l < mindist) {
        mindist = l;
        srcside = i;
        destside = j;
      }
    }
  }
  return {
    srcStyle: {
      position: 'absolute',
      border: '1px solid red',
      top: srcconns[srcside].y,
      left: srcconns[srcside].x,
      marginTop: -5,
      marginLeft: -5,
      width: 10,
      height: 10,
      borderRadius: 5
    },
    destStyle: {
      position: 'absolute',
      border: '1px solid red',
      top: destconns[destside].y,
      left: destconns[destside].x,
      marginTop: -5,
      marginLeft: -5,
      width: 10,
      height: 10,
      borderRadius: 5
    }
  }
};
