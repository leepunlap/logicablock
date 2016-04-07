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