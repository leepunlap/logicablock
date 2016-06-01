/* global AppDispatcher, React, ReactDOM */

var LBTutorFingerrace = React.createClass({

  getInitialState: function() {
    return {
      players: []
    }
  },
  handleEvents: function(e) {
    if (e.action === 'selecttool') {
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
      console.log("GoupMembership")
      console.log(data)
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
    this.timer = setInterval(function() {
      var setPercent = function(player) {
        if (typeof(player.percent) == 'undefined') {
          player.percent = 0;
        }
        player.percent += Math.random() * 3;
        if (player.percent >= 100) {
          console.log("DONE")
          player.percent = 100;
          clearInterval(this.timer)
        }
      }.bind(this);
      this.state.players.map(setPercent)
      this.setState({players:this.state.players});
    }.bind(this),100)
  },
  onReset: function() {
    clearInterval(this.timer)
    var resetPercent = function(player) {
      player.percent = 0;
    };
    this.state.players.map(resetPercent)
    this.setState({players:this.state.players});
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
            {player.userdata.username}
          </div>
          <div className="panel-body panel-body-race">
            <div style={racePosStyle}>
              <SmallFace face={player.userdata.avatar} />
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="row fullheight">
        <div className="col-md-2">
          <button className="btn btn-success" onClick={this.onStart}>Start</button>
          <button className="btn btn-danger" onClick={this.onReset}>Reset</button>
        </div>
        <div className="col-md-10">
          {this.state.players.map(showPlayer)}
        </div>
      </div>
    );
  }
});
