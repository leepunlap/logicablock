/* global AppDispatcher, React, ReactDOM */

var LBTutorAIWebkit= React.createClass({
  getInitialState: function() {
    return {
      voices:[],
      players:[],
      userid:null,
      dialogue:"",
      response:"",
      listening:false,
      selectedvoice:0
    }
  },
  componentDidMount: function() {
    ACCESS_TOKEN = '9bec61fd097b470fb8d1c36b0ae11296';

    this.baseUrl = "https://api.api.ai/v1/";

    var storage = window.localStorage;
    if (!storage.getItem("apiaitoken")) storage.setItem("apiaitoken",ACCESS_TOKEN);
    var token = storage.getItem("apiaitoken");
    if (!storage.getItem("apiailang")) storage.setItem("apiailang","en-US");
    var apiailang = storage.getItem("apiailang");
    this.setState({defaultapiaitoken:ACCESS_TOKEN,apiaitoken:token,lang:apiailang});

    window.speechSynthesis.onvoiceschanged = function(e) {
      var voicesAvailable = voices = window.speechSynthesis.getVoices();
      this.setState({voices:voicesAvailable})
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

  sendTextCmd: function(cmd) {
    var storage = window.localStorage;
    var apiailang = storage.getItem("apiailang");

  },
  updateToken: function(token,lang) {
    var storage = window.localStorage;
    if (token.length == this.state.defaultapiaitoken.length) {
      storage.setItem("apiaitoken",token);
      storage.setItem("apiailang",lang);
    } else {
      storage.setItem("apiaitoken",this.state.defaultapiaitoken);
      storage.setItem("apiailang",'en');
    }
    location.reload(true);
  },
  onSpeakBtn: function() {
    if (this.recognition) {
      this.stopRecognition();

    } else {
      this.startRecognition();

    }

  },
  setInput: function(text) {
    $("#text").val(text);
    this.send();
  },
  send: function() {
    var text = $("#text").val();
    var that = this;
    that.setState({dialogue:this.state.dialogue + "You : " + text + "\n"});
    $.ajax({
      type: "POST",
      url: this.baseUrl + "query/",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + this.state.apiaitoken
      },
      data: JSON.stringify({q: text, lang: that.state.lang}),
      success: function (data) {
        that.setState({response:JSON.stringify(data, undefined, 2),
        dialogue:that.state.dialogue + "AI  : " + data.result.speech + "\n"});

        var utterance = new SpeechSynthesisUtterance();
        utterance.voice = voices[that.state.selectedvoice]; // Note: some voices don't support altering params
        utterance.volume = 1; // 0 to 1
        utterance.rate = 1; // 0.1 to 10
        utterance.pitch = 1; //0 to 2
        utterance.text = data.result.speech;
        utterance.lang = that.state.lang;

        console.log(utterance)

        utterance.onend = function(e) {
          console.log('Finished in ' + event.elapsedTime + ' seconds.');
        };

        window.speechSynthesis.speak(utterance);

      },
      error: function () {
        that.setState({response:"Internal Server Error"});
      }
    });
    this.setState({response:"Loading..."});
  },
  startRecognition: function() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onstart = function (event) {
      this.setState({"listening":true});
    }.bind(this);
    this.recognition.onresult = function (event) {
      var text = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }
      this.setInput(text);
      this.stopRecognition();
    }.bind(this);
    this.recognition.onend = function () {
      this.stopRecognition();
    }.bind(this);
    this.recognition.lang = "zh-HK";
    this.recognition.start();
  },
  stopRecognition: function() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.setState({"listening":false});
  },
  setLang: function(id) {
    this.setState({selectedvoice:id})
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

    if (this.state.listening) {
      var speaking = "Stop Speaking";
    } else {
      speaking = "Start Speaking";
    }

    if (this.state.defaultapiaitoken === this.state.apiaitoken) {
      var currenttoken = "default";
    } else {
      currenttoken = this.state.apiaitoken;
      $('#newapiaitoken').val(currenttoken)
    }

    var voiceindex = 0;

    var showVoice = function(v) {
      var key = voiceindex++;
      var corelang = v.lang.substring(0,2);

      if (key == this.state.selectedvoice) {
        var selectedStyle= {
          color:'red',
          fontSize:11,lineHeight:1,fontFamily:'monospace',cursor:'pointer'
        }
      } else {
        selectedStyle= {
          color:'blue',
          fontSize:11,lineHeight:1,fontFamily:'monospace',cursor:'pointer'
        }
      }
      if (corelang === 'zh' || (v.localService == true && (corelang === 'en' || corelang === 'zh'))) {
        return (
          <div onClick={()=>this.setLang(key)} key={key} style={selectedStyle}>
            {key}&nbsp;
            {v.name},
            {v.lang}
          </div>
        )
      }

    }.bind(this)

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
            <button onClick={this.onSpeakBtn}className="btn btn-default">{speaking}</button>
            <input className="form-control" id="text" type="text"/>
            <button className="btn btn-default" onClick={this.send}>Send Command</button>
          </center>
          <span>api.ai token
            <a style={{float:'right'}} onClick={()=>this.updateToken($('#newapiaitoken').val(),'en-US')}>SetEN</a>
            <span style={{float:'right'}}>&nbsp;</span>
            <a style={{float:'right'}} onClick={()=>this.updateToken($('#newapiaitoken').val(),'zh-HK')}>SetHK</a>
          </span>
          <input className="form-control" style={{fontSize:10,height:'auto',padding:0}} id="newapiaitoken"></input>
          <p style={{fontSize:12,color:'#ddd'}}>{currenttoken} : {this.state.lang}</p>

          <h4 id="msgtitle">&nbsp;</h4>
          <p style={{fontSize:12,color:'#ddd'}} id="msgbody">&nbsp;</p>
        </div>
        <div className="col-md-2">
          <h4>Voices</h4>
          {this.state.voices.map(showVoice)}
        </div>
        <div className="col-md-2">
          <h4>Dialogue</h4>
          <pre id="dialogue">{this.state.dialogue}</pre>
        </div>
        <div className="col-md-5">
          <h4>Response</h4>
          <pre id="response">{this.state.response}</pre>
        </div>
      </div>
    );
  }
});