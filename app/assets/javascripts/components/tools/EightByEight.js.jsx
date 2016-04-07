/* global AppDispatcher, React, ReactDOM */

var EightByEight = React.createClass({
  getInitialState: function() {
    return {leds:[
      [1,0,0,0,0,0,0,0],
      [0,2,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0],
      [0,0,0,4,0,0,0,0],
      [0,0,0,0,5,0,0,0],
      [0,0,0,0,0,6,0,0],
      [0,0,0,0,0,0,7,0],
      [0,0,0,0,0,0,0,8],
    ]};
  },

  render: function() {
    var id=0;
    var ledCol = function(col) {
      return(
        <div className="lb-led" key={id++}></div>
      );
    }
    var ledRow = function(row) {
      return(
        <div className="lb-ledrow" key={id++}>
          {row.map(ledCol)}
        </div>
      );
    }
    return (
      <LBComponent toolName="8x8 Display" objid={this.props.objid} isInToolbox={this.props.isInToolbox} isEditing={this.props.isEditing}>
        <div className="lb-ledarray">
          {this.state.leds.map(ledRow)}
          <LBDropTarget id={this.props.objid} accepts={["output"]}></LBDropTarget>
        </div>
      </LBComponent>
    );
  }
});