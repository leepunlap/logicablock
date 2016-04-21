/* global AppDispatcher, React, ReactDOM */

var Wheels = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <LBComponent toolName="Wheels" objid={this.props.objid} isInToolbox={this.props.isInToolbox}>
        <div className="lb-wheels">
          <img className="toolImage" src="/images/robowheels.gif" />
          <LBDropTarget id={this.props.objid} accepts={["output"]}></LBDropTarget>
        </div>
      </LBComponent>
    );
  }
});