/* global AppDispatcher, React, ReactDOM */

var LBTutorOscillators = React.createClass({
    getInitialState: function() {
        return {
            players:[],
            userid:null,
            player:0
        }
    },
    componentDidMount: function() {
        socket.off('connect').on('connect', function (data) {
            var config = getConfig();
            config.mode = 'tutor';
            config.app = 'ai';
            socket.emit('register', config);
        });
        socket.off('groupmembership').on('groupmembership', function (data) {
            if (!this.state.running) {
                this.setState({players:mergePlayers(this.state.players,data)});
            }
        }.bind(this));
        socket.off('gamemove').on('gamemove', function (data) {
            this.state.players.map(function(p) {
                if (p.id == data.socketid) {
                    if (p.id == this.state.userid) {
                        if (data.action == "sendcode") {
                            this.scriptelement = $("lbscript");
                            if (this.element) {
                                this.element.parentNode.removeChild(this.element);
                            }
                            this.element = document.createElement("SCRIPT");
                            this.element.type = "text/javascript";
                            this.element.id = "lbscript";
                            this.element.innerHTML = data.code;
                            document.getElementsByTagName("HEAD")[0].appendChild(this.element);
                            mySong();
                        }
                    } else {
                        lbMsg("Not Yet",p.userdata.username + ", it is not yet your turn");
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
        mySong()
    },
    onStop: function() {
        useCharacter('test')
    },
    render: function() {
        var showPlayer = function (player) {
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
            return (
                <div key={player.id} style={userStyle} onClick={()=>this.selectUser(player)}>
                    {player.userdata.username}
                    <SmallFace id="{player.userdata.id}" face={player.userdata.avatar}/>
                </div>
            )
        }.bind(this);

        return (
            <div className="fullheight" style={{color:'white'}}>
                <center>
                    <h2>Oscillators</h2>
                    <hr noshade="true" />
                    <button className="btn btn-success" onClick={this.onStart}>1</button>
                    <button className="btn btn-success" onClick={this.onStop}>2</button>
                </center>
                <div class="col-xs-12">
                    <h4 id="msgtitle">&nbsp;</h4>
                    <p style={{fontSize:12,color:'#ddd'}} id="msgbody">&nbsp;</p>
                </div>
                {this.state.players.map(showPlayer)}

            </div>
        );
    }
});