/* global AppDispatcher, React, ReactDOM */

var LBTutorFingerrace = React.createClass({

  getInitialState: function() {
    return {
      round:0,
      status:'stopped',
      running:false,
      simon:'',
      players: []
    }
  },
  sendSimon: function() {
    var config = getConfig();
    var genSimonSays = function() {
      var text = "";
      var possible = "ABCDEF";
      for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }
    var simon = genSimonSays();
    this.state.round++;
    this.setState({round:this.state.round, simon:simon, status:'round ' + this.state.round, simontime:new Date().getTime()})
    socket.emit('game',{
      action:'simonsays',
      data:simon,
      yousay:"",
      group:config.group,
      game:'fingerrace',
    });
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
      this.setState({players:data});
    }.bind(this));
    socket.off('gamemove').on('gamemove', function (data) {
      this.state.players.map(function(p) {
        if (p.id == data.socketid) {
          p.userdata.yousay = data.yousay
          if (data.yousay == this.state.simon) {
            p.userdata.yousay += " YES!!!"
            var timediff = new Date().getTime() - this.state.simontime;
            var score = (10000 - timediff) / 200
            if (typeof(p.percent) == 'undefined') {
              p.percent = 0;
            }
            p.percent += score;
            if (p.percent >= 100) {
              p.percent = 100;
              this.setState({status:p.userdata.username + " won",running:false});
              var config = getConfig();
              socket.emit('game',{
                action:'stop',
                group:config.group,
                game:'fingerrace',
              });
            }
          } else {
            p.userdata.yousay += " Bummer..."
          }
        }
      }.bind(this))
      this.setState({players:this.state.players});
    }.bind(this));
    this.token = AppDispatcher.register(this.handleEvents);
  },
  componentWillUnmount: function() {
    socket.off('connect');
    socket.off('groupmembership')
    AppDispatcher.unregister(this.token)
  },
  onStart: function() {
    this.setState({round:0,status:'started',running:true});
  },
  onReset: function() {
    var resetPercent = function(player) {
      player.percent = 0;
    };
    this.state.players.map(resetPercent)
    this.setState({round:0,status:'stopped',players:this.state.players,running:false});
    var config = getConfig();
    socket.emit('game',{
      action:'stop',
      group:config.group,
      game:'fingerrace',
    });
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
            <h2>Finger Race</h2>
            <img src="/images/games/fingerrace.jpg"/>
            <hr noshade />
            <Clock running={this.state.running} />
            <button className="btn btn-success" onClick={this.onStart}>Start</button>
            <button className="btn btn-danger" onClick={this.onReset}>Reset</button>
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
