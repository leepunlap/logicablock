/* global AppDispatcher, React, ReactDOM */

var LBTutorBattleship = React.createClass({
  getInitialState: function() {
    return {
      players:[],
      running:false,
      status:'stopped',
      userid:null,
      player:0
    }
  },
  componentDidMount: function() {

    var onResults = function (data) {

      if (this.state.userid) {
        var config = getConfig();
        socket.emit('game',{
          id:this.state.userid,
          action:'boom',
          group:config.group,
          game:'battleship',
        });
      }
    }.bind(this);


    socket.off('connect').on('connect', function (data) {
      var config = getConfig();
      config.mode = 'tutor';
      config.app = 'ai';
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
          if (data.action == "setbattlefield") {
            p.userdata.battlefield = faceDataToArray(data.battlefield);
          }
          if (data.action == "yousay") {
            if (this.state.running) {

              // if (data.socketid !== this.state.userid) {
              //   lbMsg("Stop it, " + p.userdata.username, "Not Your Turn");
              //   return;
              // }

              var row = data.yousay.substr(0,1).charCodeAt(0) - 'A'.charCodeAt(0);
              var col = data.yousay.substr(1,1).charCodeAt(0) - 'A'.charCodeAt(0);

              if (row > 7 || col > 7) {
                lbMsg("Wrong move, " + p.userdata.username, "Rows and columns are A to H only");
                return;
              }

              var bomblog = "";

              //
              //  Go Bomb
              //
              this.state.players.map(function(p){
                if (p.id == this.state.userid) {
                  return;
                }
                console.log(p)
                if (p.userdata.battlefield[row][col] >= 2) {
                  bomblog += bomblog + p.userdata.username + " already bombed\n";
                } else {
                  bomblog += bomblog + p.userdata.username + " hit\n";
                  bomblog += bomblog + p.userdata.username + " hit\n";
                  bomblog += bomblog + p.userdata.username + " hit\n";
                  p.userdata.battlefield[row][col] = 2;
                }
              }.bind(this))

              lbMsg(this.state.players[this.state.player].userdata.username + " move " + row + ", " + col,bomblog);

              //
              //  Next Player
              //
              this.state.player++;
              if (this.state.player >= this.state.players.length) {
                this.state.player = 0;
              }
              this.setState({players:this.state.players,player:this.state.player, userid:this.state.players[this.state.player].id});
            } else {
              lbMsg("Stop it, " + p.userdata.username, "Game is not yet started");
            }
          }
        }
      }.bind(this));
      this.setState({players:this.state.players});
    }.bind(this));
    this.token = AppDispatcher.register(this.handleEvents);
  },
  selectUser: function(player) {
    if (this.state.userid == player.id) {
      this.setState({userid:null})
    } else {
      this.setState({userid:player.id})
    }

  },
  componentWillUnmount: function() {
    socket.off('connect');
    socket.off('groupmembership');
    AppDispatcher.unregister(this.token);
  },

  onStart: function() {
    this.setState({status:'started',running:true,userid:this.state.players[this.state.player].id});

    var config = getConfig();
    socket.emit('game',{
      action:'start',
      yousay:"",
      group:config.group,
      game:'battleship',
    });
  },
  onReset: function() {
    this.setState({status:'stopped',running:false,userid:null,player:0});
    var config = getConfig();
    socket.emit('game',{
      action:'stop',
      group:config.group,
      game:'battleship',
    });
  },

  render: function() {
    var showPlayer = function (player) {
      var colno=0, rowno=0;

      if (typeof(player.userdata.battlefield) == 'undefined') {
        player.userdata.battlefield = faceDataToArray("0000000000000000")
      }
      var userStyle = {
        padding:5,
        border: '1px solid white',
        float:'left'
      };
      if (this.state.userid === player.id) {
        userStyle = {
          padding:5,
          background:'rgba(0,255,0,0.4)',
          border: '1px solid red',
          float:'left'
        }
      }

      var aCol = function(col) {
        var blockStyle = {
          float:'left',
          width:10,
          height:10,
          backgroundColor:'white',
          border: '1px solid gray'
        };
        if (col == 1) {
          blockStyle.backgroundColor = 'green'
        }
        if (col == 2) {
          blockStyle.backgroundColor = 'red'
        }
        return (
          <span key={colno++} style={blockStyle} />
        )
      };
      var aRow = function(row) {
        colno=0;
        return (
          <div key={rowno++}>
            {row.map(aCol)}
          </div>
        )
      };
      return (
        <div key={player.id} style={userStyle} onClick={()=>this.selectUser(player)}>
          {player.userdata.username}
          <SmallFace id="{player.userdata.id}" face={player.userdata.avatar}/>
          <div style={{height:5}}>&nbsp;</div>
          {player.userdata.battlefield.map(aRow)}
        </div>
      )
    }.bind(this);

    var usersStyle= {
      padding:0
    };



    return (
      <div className="row fullheight" style={{color:'white'}}>
        <div className="col-md-3">
          <center>
            <h2>Battleship</h2>
            <h4>{this.state.status}</h4>
            <img src="/images/games/battleship.jpg"/>
            <hr noshade="true" />
            <button className="btn btn-success" onClick={this.onStart}>Start</button>
            <button className="btn btn-danger" onClick={this.onReset}>Reset</button>
          </center>
          <h4 id="msgtitle">&nbsp;</h4>
          <p style={{fontSize:12,color:'#ddd'}} id="msgbody">&nbsp;</p>
        </div>
        <div className="col-md-9">
          {this.state.players.map(showPlayer)}
        </div>

      </div>
    );
  }
});