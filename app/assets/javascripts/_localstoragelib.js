function getConfig() {
  var storage = window.localStorage;
  if (!storage.getItem("config")) storage.setItem("config",JSON.stringify({group:"perdoco",username:"guest",avatar:data_smiley}));
  return JSON.parse(storage.getItem("config"));
}
function storeConfig(config) {
  var storage = window.localStorage;
  storage.setItem("config",JSON.stringify(config));
}

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

function saveLbUserFile(f) {
  var storage = window.localStorage;
  if (!storage.getItem("files")) storage.setItem("files",JSON.stringify({}));
  var files = JSON.parse(storage.getItem("files"));
  files[f] = document.getElementById("view").innerText;
  storage.setItem("files",JSON.stringify(files));
}

function loadLbUserFile(f) {
  var storage = window.localStorage;
  if (!storage.getItem("files")) storage.setItem("files",JSON.stringify({}));
  var files = JSON.parse(storage.getItem("files"));
  var file = files[f];
  if (typeof(file) === 'undefined') {
    return "";
  }
  return file;
}

function loadProjects() {
  var storage = window.localStorage;
  if (!storage.getItem("projects")) storage.setItem("projects",JSON.stringify({}));
  var projects = JSON.parse(storage.getItem("projects"));
  return projects;
}

function saveProject (name,obj) {
  var storage = window.localStorage;
  var projects = loadProjects();
  projects[name] = obj;
  storage.setItem("projects",JSON.stringify(projects));
}

var autoSaveProject = _.debounce(saveProject,500);


function faceDataToArray(str) {
  if(typeof(str) == 'undefined') {
    str = data_smiley;
  }
  var result = [];
  while (str.length >= 2) {
    var byte = parseInt(str.substring(0, 2), 16)
    var bytearray = []
    for (var b=7;b>=0;b--) {
      var mask = 1 << b;
      var bit = byte & mask;
      if (bit > 1) bit = 1;
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

var data_smiley = '0066660081423c00';