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
    this.timer = null;
    socket.off('connect').on('connect', function (data) {
      var config = getConfig();
      config.mode = 'tutor';
      config.app = 'fingerrace';
      socket.emit('register', config);
    });
    socket.off('groupmembership').on('groupmembership', function (data) {
      this.setState({players:data});
    }.bind(this));
    this.token = AppDispatcher.register(this.handleEvents);
  },
  componentWillUnmount: function() {
    socket.off('connect');
    socket.off('groupmembership')
    AppDispatcher.unregister(this.token)
  },
  onStart: function() {

    audio.snare.play();

  },
  onReset: function() {

    audio.clap.play();
  },
  render: function() {
    var winner = -1;
    var max = 0;
    var findWinner = function(player) {
      if (player.percent > max) {
        max = player.percent;
        winner = player;
      }
    };
    this.state.players.map(findWinner);

    var showPlayer = function (player) {
      var racePosStyle = {
        marginLeft: 'calc((100% - 50px)*'+player.percent / 100 + ')'
      };
      var winnerClass = "panel-heading-race";
      if (player == winner) {
        winnerClass = "panel-heading-race-win";
      }
      return (
        <div className="panel panel-logica panel-race"key={player.id}>
          <div className={winnerClass}>
            {player.userdata.username} <strong>{player.userdata.yousay}</strong>
          </div>
          <div className="panel-body panel-body-race">
            <div style={racePosStyle}>
              <SmallFace position="absolute" face={player.userdata.avatar} />
            </div>
          </div>
        </div>
      );
    };

    if (typeof(winner) !== 'undefined' && winner != -1 && !this.state.running) {
      var winneravatar = (
        <SmallFace face={winner.userdata.avatar} />
      )
    }
    return (
      <div className="row fullheight" style={{color:'white'}}>
        <div className="col-md-3">
          <center>
            <h2>Drums</h2>
            <img src="/images/games/drums.jpg"/>
            <hr noshade />
            <button className="btn btn-success" onClick={this.onStart}>Crash</button>
            <button className="btn btn-danger" onClick={this.onReset}>Snare</button>
            <h2>{this.state.status}</h2>
            <div style={{zoom:'200%'}}>
              {winneravatar}
            </div>
          </center>
        </div>
        <div className="col-md-9">
          {this.state.players.map(showPlayer)}
        </div>
      </div>
    );
  }
});
