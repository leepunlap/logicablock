/* global AppDispatcher, React, ReactDOM */

var FlowEnd = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <LBComponent toolName="End" objid={this.props.objid} isInToolbox={this.props.isInToolbox}>
        <div className="lb-flowend">
          <span className="centerspan">END</span>
        </div>
      </LBComponent>
    );
  }
});