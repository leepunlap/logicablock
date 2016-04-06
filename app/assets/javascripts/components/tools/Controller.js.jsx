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
        {n:'o1',x:155,y:10},
        {n:'o2',x:155,y:30},
        {n:'o3',x:155,y:50},
        {n:'o4',x:155,y:70},
      ]
    };
  },
  onDragStart: function(e){
    e.dataTransfer.setData("text/html", e.target.id)
    AppDispatcher.dispatch({
      action:'dragstart',
      objid:e.target.id
    })
  },
  render: function() {
    var that = this;
    var objid = this.props.objid;
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
    var outputConnectors = function(i) {
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
    var inputConnectorProps = function(i) {
      return(
        <LBDragSource key={i.n} id={objid+"|input|"+i.n}>fff</LBDragSource>
      );
    };
    var outputConnectorProps = function(i) {
      return(
        <div key={i.n} className="lb-draggable" draggable="true" onDragStart={that.onDragStart} id={objid+"|output|"+i.n}>
          <div>{i.n}</div>
        </div>
      );
    };
    if(this.props.isEditing) {
      var className="lb-face-edit";
      var propPage = (
        <div>
          <h4>Inputs</h4>
          {this.state.inputs.map(inputConnectorProps)}
          <h4>Outputs</h4>
          {this.state.outputs.map(outputConnectorProps)}
        </div>
      )
    }
    return (
      <LBComponent toolName="Controller" objid={this.props.objid} isInToolbox={this.props.isInToolbox} isEditing={this.props.isEditing}>
        <div className="lb-controller">
          <img className="toolImage" src="/images/brain.jpg" />
          {this.state.inputs.map(inputConnectors)}
          {this.state.outputs.map(outputConnectors)}
          {propPage}
        </div>
      </LBComponent>
    );


  }
});