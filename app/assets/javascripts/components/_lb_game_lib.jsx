var lbcontrollergamelib = {

  gameMessageStyle: {
    position:'absolute',
    top:100,
    left:-100,
    width:300
  },

  fingerrace: {
    render: function () {
      gamemessage = null;
      if (this.props.conf) {
        if (this.props.conf.action == 'simonsays' || this.props.conf.action == 'yousay') {
          gamemessage = (
            <div style={lbcontrollergamelib.gameMessageStyle}>
              <h3><font color="white" style={{backgroundColor:'#8a6d3b',padding:5}}>Finger Race</font></h3>
              <h3 style={{margin:0}}>
                Kimi Says <font color="red">{this.props.conf.data}</font>
                <br />
                You Say <font color="green">{this.props.conf.yousay}</font>
              </h3>
            </div>
          )
        }
      }
      return gamemessage;
    }
  },

  getGameControllerDisplay: function() {
    if (this.props.conf && this.props.conf.game) {
      var game = lbcontrollergamelib[this.props.conf.game];
      if (typeof (game) === "object") {
        var fn = game['render'];
        if (typeof (fn) === "function") {
          return fn.bind(this)();
        }
      }
    }
  }

};