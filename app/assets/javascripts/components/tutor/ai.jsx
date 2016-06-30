/* global AppDispatcher, React, ReactDOM */

var LBTutorAI= React.createClass({
  getInitialState: function() {
    return {
      players:[],
      userid:null,
      dialogue:"",
      response:""
    }
  },
  componentDidMount: function() {
    var app, start, stop;
    var SERVER_PROTO, SERVER_DOMAIN, SERVER_PORT, ACCESS_TOKEN;

    SERVER_PROTO = 'wss';
    SERVER_DOMAIN = 'api.api.ai';
    SERVER_PORT = '4435';
    ACCESS_TOKEN = '9bec61fd097b470fb8d1c36b0ae11296';
    var config = {
      server: SERVER_PROTO + '://' + SERVER_DOMAIN + ':' + SERVER_PORT + '/api/ws/query',
      token: ACCESS_TOKEN,// Use Client access token there (see agent keys).
      sessionId: this.sessionId,
      lang: 'en',
      onInit: function () {
        lbMsg("> ON INIT use config",this.sessionId);
        apiAi.open();
      }
    };
    apiAi = new ApiAi(config);
    this.apiAi = apiAi;


    var isListening = false;
    this.sessionId = this._generateId(32);

    /**
     * Also you can set properties and handlers directly.
     */
    //apiAi.sessionId = '1234';

    // apiAi.onInit = function () {
    //   lbMsg("> ON INIT use direct assignment property",this.sessionId);
    //   apiAi.open();
    // };

    apiAi.onStartListening = function () {
      lbMsg("> ON START LISTENING",this.sessionId);
    };

    apiAi.onStopListening = function () {
      lbMsg("> ON STOP LISTENING",this.sessionId);
    };

    apiAi.onOpen = function () {
      lbMsg("> ON OPEN SESSION",this.sessionId);

      /**
       * You can send json through websocet.
       * For example to initialise dialog if you have appropriate intent.
       */
      apiAi.sendJson({
        "v": "20150512",
        "query": "hello",
        "timezone": "GMT+8",
        "lang": "en",
        //"contexts" : ["weather", "local"],
        "sessionId": this.sessionId
      });

    }.bind(this);

    apiAi.onClose = function () {
      lbMsg("> ON CLOSE",this.sessionId);
      apiAi.close();
    };

    /**
     * Reuslt handler
     */
    apiAi.onResults = function (data) {
      lbMsg("> ON RESULT","");

      var status = data.status,
        code,
        speech;

      if (!(status && (code = status.code) && isFinite(parseFloat(code)) && code < 300 && code > 199)) {
        this.setState({dialogue:JSON.stringify(status, null, 2)});
        return;
      }

      //speech = data.result.speech;
      // Use Text To Speech service to play text.
      //apiAiTts.tts(speech, undefined, 'en-US');

      this.state.dialogue += ('user : ' + data.result.resolvedQuery + '\napi  : ' + data.result.speech + '\n\n');
      this.setState({dialogue:this.state.dialogue})
      this.setState({response:JSON.stringify(data, null, 2)});
      $('#text').val('');
      if (this.state.userid) {
        var config = getConfig();
        socket.emit('game',{
          id:this.state.userid,
          action:'aiaction',
          data:data.result,
          yousay:"",
          group:config.group,
          game:'ai',
        });
      }
    }.bind(this);

    apiAi.onError = function (code, data) {
      apiAi.close();
      lbMsg("> ON ERROR", code);
      this.setState({response:JSON.stringify(data, null, 2)});
      //if (data && data.indexOf('No live audio input in this browser') >= 0) {}
    }.bind(this);

    apiAi.onEvent = function (code, data) {
      lbMsg("> ON EVENT", code);
      this.setState({response:JSON.stringify(data, null, 2)});
    }.bind(this);

    /**
     * You have to invoke init() method explicitly to decide when ask permission to use microphone.
     */
    apiAi.init();
    /**
     * Initialise Text To Speech service for playing text.
     */
    apiAiTts = new TTS(SERVER_DOMAIN, ACCESS_TOKEN, undefined, 'en-US');
    this.apiAiTts = apiAiTts;

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
          p.userdata.speed = data.speed;
          p.userdata.beats = data.beats;
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
  onStartAIAPI: function() {

  },
  onStopAIAPI: function() {

  },
  sendTextCmd: function(cmd) {
    var queryJson = {
      "v": "20150910",
      "query": cmd,
      "timezone": "GMT+8",
      "lang": "en",
      "sessionId": this.sessionId
    };
    lbMsg('sendJson', queryJson);
    apiAi.sendJson(queryJson);
  },
  _generateId: function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
  render: function() {

    var showPlayer = function (player) {
      var userStyle = {
        padding:5,
        border: '1px solid gray',
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

    var usersStyle= {
      padding:0
    };

    var speaking = "Start Speaking";

    return (
      <div className="row fullheight" style={{color:'white'}}>
        <div className="row" style={usersStyle}>
          {this.state.players.map(showPlayer)}
        </div>
        <div className="col-md-3">
          <center>
            <h2>AI</h2>
            <img src="/images/games/ai.jpg"/>
            <hr noshade="true" />
            <button className="btn btn-default">{speaking}</button>
            <input className="form-control" id="text" type="text"/>
            <button className="btn btn-default" onClick={()=>this.sendTextCmd($('#text').val())}>Send Command</button>
          </center>
          <h4 id="msgtitle">&nbsp;</h4>
          <p style={{fontSize:12,color:'#ddd'}} id="msgbody">&nbsp;</p>
        </div>
        <div className="col-md-3">
          <h4>Dialogue</h4>
          <pre id="dialogue">{this.state.dialogue}</pre>
        </div>
        <div className="col-md-6">
          <h4>Response</h4>
          <pre id="response">{this.state.response}</pre>
        </div>
      </div>
    );
  }
});