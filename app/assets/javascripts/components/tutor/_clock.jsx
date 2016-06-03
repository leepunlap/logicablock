function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var Clock = React.createClass({
  getInitialState: function() {
    return {h: 0, m:0, s:0};
  },
  componentDidMount: function() {
    this.timer = null;
  },
  componentWillUnmount: function() {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.running == true) {
      if (this.timer == null) {
        this.timer = setInterval(this.tick, 80);
      }
    } else {
      if (this.timer != null) {
        clearInterval(this.timer);
        this.timer = null;
        this.resetClock();
      }
    }
  },
  tick: function() {
    if (this.isMounted()) {
      if (this.state.m == 0 && this.state.s == 0) {
        AppDispatcher.dispatch({
          action: 'round',
          h: this.state.h
        })
      }
    }
    this.state.s += 30   ;
    if (this.state.s > 59) {
      this.state.s = 0;
      this.state.m +=1;
    }
    if (this.state.m > 59) {
      this.state.m = 0;
      this.state.h +=1;
    }
    if (this.state.h > 23) {
      this.state.h = 0;
    }
    if (this.isMounted()) {
      this.setState({h: this.state.h, m: this.state.m, s: this.state.s});
    }
  },
  resetClock: function() {
    if (this.isMounted()) {
      this.setState({h: 0, m: 0, s: 0});
    }
  },
  fGetHour:     function() {
    var iHours = this.state.h;
    if (iHours > 11) {
      iHours -= 12
    }
    return Math.round((iHours * 30) + (this.state.m / 2) + (this.state.s / 120));
  },
  fGetMinute:     function() {
    return Math.round((this.state.m * 6) + (this.state.s / 10));
  },
  fRotate:        function(iDeg) {
    var sCSS = ("rotate(" + iDeg + "deg)");
    return { MozTransform: sCSS, OTransform: sCSS, WebkitTransform: sCSS }
  },
  render: function() {


    var hRotateStyle = this.fRotate(this.fGetHour());
    var mRotateStyle = this.fRotate(this.fGetMinute());
    var txtStyle = { fontSize: 32 };
    return (
      <div id="cssclock">
        <div id="clockanalog">
          <img src="/images/clock/analogminutes.png" id="analogminute" style={mRotateStyle} />
          <img src="/images/clock/analoghours.png" id="analoghour" style={hRotateStyle} />
        </div>
      </div>
    );
  }
});
