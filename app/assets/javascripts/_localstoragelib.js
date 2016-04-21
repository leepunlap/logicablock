function getFaces() {
  var storage = window.localStorage;
  if (!storage.getItem("faces")) storage.setItem("faces",JSON.stringify([]));
  return JSON.parse(storage.getItem("faces"));
}

function storeFace(face) {
  var storage = window.localStorage;
  var faces = getFaces();
  faces.push(face);
  storage.setItem("faces",JSON.stringify(faces));
  return faces;
}

function deleteFace(index) {
  var storage = window.localStorage;
  var faces = getFaces();
  faces.splice(index,1);
  storage.setItem("faces",JSON.stringify(faces));
  return faces;
}

function faceDataToArray(str) {
  var result = [];
  while (str.length >= 2) {
    var byte = parseInt(str.substring(0, 2), 16)
    var bytearray = []
    for (var b=0;b<8;b++) {
      var bit = byte & 0x01;
      byte = byte >>> 1;
      bytearray.push(bit);
    }
    result.push(bytearray);
    str = str.substring(2, str.length);
  }
  return result;
}

function faceArrayToData (arr) {
  var hs = "";
  var data = arr.map(function (row) {
    var b = 0x00;
    for (var i in row) {
      var v = row[i];
      b = b << 1;
      b += v;
      //console.log("i:" + v + ", b:" + b);
    }
    var h = b.toString(16);
    hs = hs + ("00" + h).slice(-2);
    //console.log(hs)
    return b
  });
  return hs;
}

var leds_blank = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

var leds_smiley = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];