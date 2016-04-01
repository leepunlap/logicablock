/* global AppDispatcher, React, ReactDOM */

var Controller = React.createClass({
  getInitialState: function() {
    return {inputs:[
        {n:'i1',x:5,y:10},
        {n:'i2',x:5,y:30},
        {n:'i3',x:5,y:50},
        {n:'i4',x:5,y:70},
      ],
      outputs:[
        {n:'o1',x:5,y:10},
        {n:'o2',x:5,y:30},
        {n:'o3',x:5,y:50},
        {n:'o4',x:5,y:70},
      ]
    };
  },
  render: function() {
    var inputConnectors = function(i) {
      var connectorStyle = {
        left:i.x,
        top:i.y
      }
      return(
        <div className="lb-connector" style={connectorStyle} key={i.n}>
        {i.n}
        </div>
      );
    };
    var inputConnectors = function(i) {
      var connectorStyle = {
        left:i.x,
        top:i.y
      }
      return(
        <div className="lb-connector" style={connectorStyle} key={i.n}>
        {i.n}
        </div>
      );
    };
    return (
      <LBComponent toolName="Controller" objid={this.props.objid} isInToolbox={this.props.isInToolbox}>
        <div className="lb-controller">
          <img className="toolImage" src="/images/brain.jpg" />
          {this.state.inputs.map(inputConnectors)}
          {this.state.inputs.map(outputConnectors)}
        </div>
      </LBComponent>
    );
  }
});