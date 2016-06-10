/* global AppDispatcher, React, ReactDOM */

var Hex = React.createClass({
  getInitialState: function() {
    return {
      hexVal:0,
      val:Array.apply(0, Array(16)).map(function() { return false; })
    };
  },
  buttonClick: function(e){
    this.state.val[e.target.id] = !this.state.val[e.target.id];
    this.setState({val:this.state.val});
    var hexVal = 0;
    for (var i=0;i<16;i++) {
      if (this.state.val[i]) {
        hexVal += Math.pow(2,i);
      }
    }
    this.setState({hexVal:hexVal})
  },
  render: function() {
    if (this.props.isInToolbox) {
      return (
        <LBComponent toolName="Hexadecimal" objid={this.props.objid} isInToolbox={this.props.isInToolbox}>
          <div className="lb-hex">
            <img className="toolImage" src="/images/hex.png"/>
          </div>
        </LBComponent>
      );

    }
    var pow=15;
    var BtnArray = Array.apply(0, Array(16)).map(function() { return pow--; });

    var makeButton = function(e) {
      var hexBtnStyle = {
        height:40,
        width:40,
        backgroundColor:this.state.val[e] ? 'yellow' : 'white'
      };
      if (e > 0 && (e % 4) == 0) {
        var spacer = (
          <span style={{width:10}}>---</span>
        )
      }
      return (
        <span key={e}>
          <button id={e} style={hexBtnStyle}>{this.state.val[e] ? "1" : "0"}</button>
          {spacer}
        </span>
      )
    }.bind(this);

    return (
      <LBComponent toolName="Hexadecimal" objid={this.props.objid} isGadget={true} isInToolbox={this.props.isInToolbox}>
        <div className="lb-hex" onTouchStart={this.buttonClick} onMouseDown={this.buttonClick}>
          <h1>Hex Calc - [{this.state.hexVal.toString(16)}]</h1>
          {BtnArray.map(makeButton)}
        </div>
      </LBComponent>
    );
  }
});