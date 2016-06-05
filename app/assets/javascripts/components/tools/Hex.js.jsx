/* global AppDispatcher, React, ReactDOM */

var Hex = React.createClass({
  getInitialState: function() {
    return {};
  },
  buttonClick: function(e){
    console.log("click")
    console.log(e)
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
      return (
        <button onclick={this.ButtonClick} c>{e}</button>
      )
    };
    return (
      <LBComponent toolName="Hexadecimal" objid={this.props.objid} isGadget={true} isInToolbox={this.props.isInToolbox}>
        <div className="lb-hex" onMouseDown={this.buttonClick}>
          <h1>Hex Calc</h1>
          {BtnArray.map(makeButton)}
        </div>
      </LBComponent>
    );
  }
});