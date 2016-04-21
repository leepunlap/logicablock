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
  onEditCode: function() {
    $('#showcode').modal('show');
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
        <LBDragSource key={i.n} name={i.n} id={objid+"|input|"+i.n}></LBDragSource>
      );
    };
    var outputConnectorProps = function(i) {
      return(
        <LBDragSource key={i.n} name={i.n} id={objid+"|output|"+i.n}></LBDragSource>
      );
    };
    if(this.props.isEditing) {
      var propPage = (
        <div>
          <h4>Inputs</h4>
          {this.state.inputs.map(inputConnectorProps)}
          <h4>Outputs</h4>
          {this.state.outputs.map(outputConnectorProps)}
          <h4>Code</h4>
          <button className="btn btn-default" onClick={this.onEditCode}>Edit</button>
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