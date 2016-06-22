
var LBWorldPlayer= React.createClass({
  getInitialState: function() {
    return {
      playing: false,
      building:null,
      data: null
    }
  },
  sendBuilding: function(d) {
    var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    var material = new THREE.MeshNormalMaterial( { overdraw: 0.5 } );
    var createLayer = function(str) {
      var row=d.x;
      while (str.length >= 2) {
        var nibble = str.substring(0, 2);
        var byte = parseInt(nibble, 16);
        var bytearray = [];
        var col=d.z;
        for (var b=7;b>=0;b--) {
          var mask = 1 << b;
          var bit = byte & mask;
          if (bit > 0) {
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = row*25;
            mesh.position.z = col*25;
            mesh.position.y = layer*25;
            mesh.rotation.x = d.rx;
            mesh.rotation.y = d.ry;
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            this.state.building.add( mesh );
          }
          col++;
        }
        row++;
        str = str.substring(2, str.length);
      }
      layer++;
    }.bind(this);
    this.setState({data:d});
    if (this.state.building != null) {
      window.scene.remove(this.state.building);
      this.state.building = null;
    }
    this.state.building = new THREE.Group();
    var layer = d.z;
    d.data.map(createLayer)
    window.scene.add( this.state.building );
  },
  componentWillReceiveProps: function(newProps) {
    if(typeof(newProps.player.userdata.data) !== 'undefined') {
      var buildingdata = newProps.player.userdata.data;
      var a = JSON.stringify(buildingdata);
      var b = JSON.stringify(this.state.data);
      if (a !== b) {
        this.state.data = buildingdata;
        if (this.state.playing) {
          this.sendBuilding(buildingdata)
        }
      }
    }
  },
  togglePlaying: function() {

    if (this.state.playing) {
      if (this.state.building != null) {
        window.scene.remove(this.state.building);
        this.state.building = null;
      }
    } else {
      if (this.state.data) {
        this.sendBuilding(this.state.data);
      }
    }
    this.state.playing = !this.state.playing;
    this.setState({playing:this.state.playing})
  },
  render: function () {
    if (this.state.playing) {
      var playingStyle = {
        border:'2px green solid'
      }
    } else {
      playingStyle = {
        border:'2px transparent solid'
      }
    }
    return (
      <div onClick={this.togglePlaying} style={playingStyle}>
        {this.props.player.userdata.username} <strong>{this.props.player.userdata.yousay}</strong>
        <SmallFace position="interhit" face={this.props.player.userdata.avatar} />
      </div>
    )
  }
});

var LBTutorWorld = React.createClass({
  getInitialState: function() {
    return {running:false,players:[]};
  },
  componentDidMount: function() {
    socket.off('connect').on('connect', function (data) {
      var config = getConfig();
      config.mode = 'tutor';
      config.app = 'world';
      socket.emit('register', config);
    });
    socket.off('groupmembership').on('groupmembership', function (data) {
      if (!this.state.running) {
        this.setState({players:data});
      }
    }.bind(this));
    socket.off('gamemove').on('gamemove', function (data) {
      this.state.players.map(function(p) {
        if (p.id == data.socketid) {
          p.userdata.data = data.data;
        }
      })
      this.setState({players:this.state.players});
    }.bind(this));
    this.init();
    this.animate();
  },
  init: function() {
    this.container = document.getElementById('threejscanvas');
    this.camera = new THREE.CombinedCamera(window.innerWidth / 2, window.innerHeight / 2, 70, 1, 1000, -500, 1000);
    this.camera.position.x = 200;
    this.camera.position.y = 100;
    this.camera.position.z = 200;
    window.scene = new THREE.Scene();
    // Grid
    var size = 500, step = 25;
    var geometry = new THREE.Geometry();
    for (var i = -size; i <= size; i += step) {
      geometry.vertices.push(new THREE.Vector3(-size, 0, i));
      geometry.vertices.push(new THREE.Vector3(size, 0, i));
      geometry.vertices.push(new THREE.Vector3(i, 0, -size));
      geometry.vertices.push(new THREE.Vector3(i, 0, size));
    }
    var material = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2});

    var line = new THREE.LineSegments(geometry, material);
    window.scene.add(line);
    // Lights
    var ambientLight = new THREE.AmbientLight(0x40);
    window.scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0x00ff00);
    directionalLight.position.x = 0.5;
    directionalLight.position.y = 0.5;
    directionalLight.position.z = -0.5;
    directionalLight.position.normalize();
    window.scene.add(directionalLight);
    var directionalLight = new THREE.DirectionalLight(0x0000ff);
    directionalLight.position.x = 0.5;
    directionalLight.position.y = -0.5;
    directionalLight.position.z = 0.5;
    directionalLight.position.normalize();
    window.scene.add(directionalLight);
    var directionalLight = new THREE.DirectionalLight(0xdddddd);
    directionalLight.position.x = -0.5;
    directionalLight.position.y = 0.5;
    directionalLight.position.z = 0.5;
    directionalLight.position.normalize();
    window.scene.add(directionalLight);
    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setClearColor(0xf0f0f0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
      if (typeof(this.camera) !== 'undefined') {
        this.camera.setSize(window.innerWidth, window.innerHeight);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }
    this.camera.toOrthographic();
    //camera.setLens(24);
    this.camera.setFov(100);
  },
  animate: function() {
    requestAnimationFrame(this.animate);
    this.stats.begin();
    this.add3DCanvas();
    this.stats.end();
  },
  add3DCanvas: function () {
    var lookAtScene = true;
    var timer = Date.now() * 0.0001;
    this.camera.position.x = Math.cos(timer) * 200;
    this.camera.position.z = Math.sin(timer) * 200;
    if (lookAtScene) this.camera.lookAt(window.scene.position);
    this.renderer.render(window.scene, this.camera);
  },
  render: function () {
    var showPlayer = function (player) {
      return (
        <LBWorldPlayer id={player.id} key={player.id} player={player}></LBWorldPlayer>
      );
    }.bind(this);
    return (
      <div>
        <div id="threejscanvas"></div>
        <div style={{position:'absolute',top:50,left:5}}>
          {this.state.players.map(showPlayer)}
        </div>
      </div>
    )
  }
});
