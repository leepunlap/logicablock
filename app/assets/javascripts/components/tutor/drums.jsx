/* global AppDispatcher, React, ReactDOM */

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
    console.log("start")
    var audio = new Audio('/audio/crash.wav');
    audio.play();
  },
  onReset: function() {
    var audio = new Audio('/audio/snare.wav');
    audio.play();
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
