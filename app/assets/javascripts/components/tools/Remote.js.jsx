/* global AppDispatcher, React, ReactDOM */

var Remote = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <LBComponent toolName="Remote" objid={this.props.objid} isInToolbox={this.props.isInToolbox}>
        <div>
          Remote
        </div>
      </LBComponent>
    );
  }
});