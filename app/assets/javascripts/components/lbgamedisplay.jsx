/* global AppDispatcher, React, ReactDOM */

var LBGameDisplay = React.createClass({
  getInitialState: function() {
    return {debugmsg:"OK",sprites:[]};
  },
  handleEvents: function(e) {
    if (e.action === 'addsprite') {
      this.state.sprites.push({
        name:e.name,
        key:e.key
      })
      this.setState({sprites:this.state.sprites})
    }
    if (e.action === 'setspritepos') {
      this.state.sprites.map(function(s) {
        if (s.key === e.key) {
          s.x = e.x;
          s.y = e.y;
          this.setState({sprites:this.state.sprites})
        }
      }.bind(this))
    }
    if (e.action === 'setspritevelocity') {
      this.state.sprites.map(function(s) {
        if (s.key === e.key) {
          s.vx = e.vx;
          s.vy = e.vy;
          this.setState({sprites:this.state.sprites})
        }
      }.bind(this))
    }
    if (e.action === 'setspriteelasticity') {
      this.state.sprites.map(function(s) {
        if (s.key === e.key) {
          s.el = e.el;
          this.setState({sprites:this.state.sprites})
        }
      }.bind(this))
    }
    if (e.action === 'movesprites') {
      if (lbGameCanvasHeight() < 100 || lbGameCanvasWidth() < 100 ) {
        return;
      }
      this.state.sprites.map(function(s) {
        el = 1;
        if (typeof (s.el) !== 'undefined') {
          el = s.el;
        }
        s.x += s.vx;
        s.y += s.vy;
        if (s.x > lbGameCanvasWidth() - 100) {
          s.x = lbGameCanvasWidth() - 100;
          s.vx = - (s.vx * el);
        } else if (s.y > lbGameCanvasHeight() - 100) {
          s.y = lbGameCanvasHeight() - 100;
          s.vy = -(s.vy * el);
        } else if (s.x < 0) {
          s.x = 0;
          s.vx = - (s.vx * el);
        } else if (s.y < 0) {
          s.y = 0;
          s.vy = - (s.vy * el);
        }
      }.bind(this))
      this.setState({sprites:this.state.sprites});
    }
    if (e.action === 'clearsprites') {
      this.setState({sprites:[]})
    }
  },
  componentDidMount: function() {
    this.token = AppDispatcher.register(this.handleEvents);
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  render: function() {
    var closeBtn = (
      <span style={{float:'right'}}>
        <button className="btn btn-xs btn-primary" id="confirm-dialog-button-right" onClick={onLbStop} type="button">Stop</button>
        <button className="btn btn-xs btn-primary" id="confirm-dialog-button-right" onClick={lbHideGameDisplay} type="button">X</button>
      </span>
    );

    var drawSprites = function(s) {
      var spriteStyle = {
        position:'absolute',
        width:100,
        height:100,
        lineHeight:'100px',
        textAlign:'center',
        fontSize:24,
        border:'solid 1px green',
        borderRadius:50,
        top:s.y,
        left:s.x
      };
      return (
        <div key={s.key} style={spriteStyle}>{s.name}</div>
      )
    }
    var sprites = this.state.sprites.map(drawSprites);
    return (
      <div className="modal fade" id="gamedisplay" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal_wrapper">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  Game Display -&nbsp;
                  {this.state.debugmsg}
                  {closeBtn}
                </h4>
              </div>
              <div className="modal-body" id="gamecanvas" style={{overflow:'hidden'}}>
                {sprites}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
