/* global AppDispatcher, React, ReactDOM */

try {
  var ac = new AudioContext() || WebkitAudioContext() || MozAudioContext(),
    recorderNode = ac.createGain();
  recorderNode.gain.value = 0.7;
}

catch (e) {
  alert("This app doesn't seem to be availible for your browser. Sorry about that. We recommend Firefox or Chrome")
}

function Sound(path) {
  var drum = this;
  drum.buffer = null;
  drum.path = path;
  var request = new XMLHttpRequest();
  request.open('GET', drum.path, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    ac.decodeAudioData(request.response, function(buffer) {
      drum.buffer = buffer;
    });
  };
  request.send();
}

Sound.prototype.play = function() {
  var gain = ac.createGain();
  gain.gain.value = 1;
  var playSound = ac.createBufferSource();
  playSound.playbackRate.value = 1;
  playSound.buffer = this.buffer;
  playSound.connect(gain);
  gain.connect(recorderNode);
  gain.connect(ac.destination);
  playSound.start(0);
};

var audio = {
  clap: new Sound("/audio/clap.wav"),
  closed: new Sound("/audio/closed.wav"),
  crash: new Sound("/audio/crash.wav"),
  high: new Sound("/audio/high.wav"),
  kick: new Sound("/audio/kick.wav"),
  low: new Sound("/audio/low.wav"),
  mid: new Sound("/audio/mid.wav"),
  open: new Sound("/audio/open.wav"),
  perc1: new Sound("/audio/perc1.wav"),
  perc2: new Sound("/audio/perc2.wav"),
  rim: new Sound("/audio/rim.wav"),
  shake: new Sound("/audio/shake.wav"),
  snare: new Sound("/audio/snare.wav"),
};

var LBTutorDrumsPlayer= React.createClass({
  getInitialState: function() {
    return {
      playing: false,
      bar:1,
      wholenote:1,
      quarternote:0
    }
  },
  componentDidMount: function() {
    this.timer = null;
  },
  playDrums: function(e) {
    var node = ReactDOM.findDOMNode(this);
    var speed = this.props.player.userdata.speed;
    var beats = this.props.player.userdata.beats;
    if (typeof(beats) !== 'undefined') {
      this.setState({playing:true});
      if (this.timer == null) {
        this.timer=setInterval(function() {
          this.state.quarternote++;
          if (this.state.quarternote > 4) {
            this.state.quarternote = 1;
            this.state.wholenote++;
            if (this.state.wholenote > 4) {
              this.state.wholenote = 1;
              this.state.bar++;
              if (this.state.bar > 4) {
                this.state.bar = 1;
              }
            }
          }
          this.setState({bar:this.state.bar,wholenote:this.state.wholenote,quarternote:this.state.quarternote})
          for (var inst in beats) {
            var bar = beats[inst][this.state.bar-1];
            var whole = parseInt(bar[this.state.wholenote-1]);
            var quarter = whole & Math.pow(2,4 - this.state.quarternote);
            if (quarter > 0) {
              audio[inst].play();
            }
          }

        }.bind(this),speed)
      } else {
        this.setState({playing:false,bar:1,wholenote:1,quarternote:0});
        clearInterval(this.timer);
        this.timer = null;
      }
    }


  },
  render: function() {
    var player = this.props.player;
    if (player.userdata.beats) {
      var i=[];
      for(var key in player.userdata.beats) {
        v = {
          beats:player.userdata.beats[key],
          instrument:key
        }
        i.push(v);
      }
      var beatsbar=0;
      var beats = function(b) {
        var barStyle = null;
        if (this.state.playing && this.state.bar == beatsbar + 1) {
          barStyle = {
            color:'white',
            backgroundColor:'green'
          }
        }
        return (
          <span key={++beatsbar}>
            <span style={barStyle}>{b}</span>&nbsp;
          </span>
        )
      }.bind(this);
      var instruments = i.map(function(ii) {
        beatsbar=0;
        return (
          <td key={ii.instrument} style={{color:'black', padding:2}}>
            <strong><font color="red">{ii.instrument}&nbsp;</font></strong>
            {ii.beats.map(beats)}
          </td>
        )
      })
    }
    var winnerClass = "panel-heading-race";
    if (this.state.playing) {
      winnerClass = "panel-heading-race-win";
    }
    if (typeof (this.props.player.userdata.speed) !== 'undefined') {
      if (this.state.playing) {
        var speed = (
          <strong>
            {this.state.bar}:
            {this.state.wholenote}:
            {this.state.quarternote}
          </strong>
        );
      } else {
        speed = (
          <spsn>
            Speed : {this.props.player.userdata.speed}
          </spsn>
        )
      }
    }
    return (
      <div className="panel panel-logica panel-race" onMouseDown={this.playDrums} >
        <div className={winnerClass}>
          {player.userdata.username}&nbsp;&nbsp;
          {speed}
        </div>
        <div className="panel-body panel-body-race">
          <div>
            <table>
              <tbody>
              <tr>
                <td>
                  <SmallFace id="{player.userdata.id}" face={player.userdata.avatar}/>
                </td>
                <td>&nbsp;&nbsp;</td>
                {instruments}
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});

var LBTutorDrums= React.createClass({

  getInitialState: function() {
    return {
      players: []
    }
  },
  handleEvents: function(e) {
    if (e.action === 'round') {
      this.sendSimon();
    }
  },
  componentDidMount: function() {
    socket.off('connect').on('connect', function (data) {
      var config = getConfig();
      config.mode = 'tutor';
      config.app = 'fingerrace';
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
          p.userdata.speed = data.speed,
          p.userdata.beats = data.beats
        }
      }.bind(this))
      this.setState({players:this.state.players});
    }.bind(this));
    this.token = AppDispatcher.register(this.handleEvents);
  },
  onPlay: function(inst) {
    audio[inst].play();
  },
  render: function() {

    var showPlayer = function (player) {
      return (
        <LBTutorDrumsPlayer id={player.id} key={player.id} player={player}></LBTutorDrumsPlayer>
      )
    }.bind(this);

    return (
      <div className="row fullheight" style={{color:'white'}}>
        <div className="col-md-3">
          <center>
            <h2>Drums</h2>
            <img src="/images/games/drums.jpg"/>
            <hr noshade />
            <button className="btn btn-default" onClick={() => this.onPlay("clap")}>clap</button>
            <button className="btn btn-default" onClick={() => this.onPlay("closed")}>closed</button>
            <button className="btn btn-default" onClick={() => this.onPlay("crash")}>crash</button>
            <button className="btn btn-default" onClick={() => this.onPlay("high")}>high</button>
            <button className="btn btn-default" onClick={() => this.onPlay("kick")}>kick</button>
            <button className="btn btn-default" onClick={() => this.onPlay("low")}>low</button>
            <button className="btn btn-default" onClick={() => this.onPlay("mid")}>mid</button>
            <button className="btn btn-default" onClick={() => this.onPlay("open")}>open</button>
            <button className="btn btn-default" onClick={() => this.onPlay("perc1")}>perc1</button>
            <button className="btn btn-default" onClick={() => this.onPlay("perc2")}>perc2</button>
            <button className="btn btn-default" onClick={() => this.onPlay("rim")}>rim</button>
            <button className="btn btn-default" onClick={() => this.onPlay("shake")}>shake</button>
            <button className="btn btn-default" onClick={() => this.onPlay("snare")}>snare</button>
          </center>
        </div>
        <div className="col-md-9">
          {this.state.players.map(showPlayer)}
        </div>
      </div>
    );
  }
});
