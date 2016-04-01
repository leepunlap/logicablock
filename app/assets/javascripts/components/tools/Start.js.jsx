/* global AppDispatcher, React, ReactDOM */

var FlowStart = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <LBComponent toolName="Start" objid={this.props.objid} isInToolbox={this.props.isInToolbox}>
        <div className="lb-flowstart">
          <span className="centerspan">START</span>
        </div>
      </LBComponent>
    );
  }
});