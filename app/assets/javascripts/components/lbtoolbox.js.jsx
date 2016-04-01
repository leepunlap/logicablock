/* global AppDispatcher, React, ReactDOM */

var LBToolbox = React.createClass({
  getInitialState: function() {
    return {};
  },
  deviceOrientationChanged: function(e) {
    this.setState({alpha: e.alpha});
  },
  componentDidMount: function() {
    window.addEventListener("deviceorientation", this.deviceOrientationChanged, true);
  },
  componentWillUnmount: function() {
    window.removeEventListener("deviceorientation", this.deviceOrientationChanged, true);
  },
  onClear: function() {
    AppDispatcher.dispatch({
      action:'clearproject'
    })
  },
  handleEvents: function(e) {
    if (e.action === 'selecttool') {
      this.setState({objid: e.objid, editclassname:e.className})
    } else if (e.action === 'unselecttool') {
      this.setState({objid: null, editclassname:null})
    }
  },
  componentDidMount: function() {
    this.token = AppDispatcher.register(this.handleEvents);
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  render: function() {
    if (this.state.objid) {
      if (this.state.editclassname == 'lb-face') {
        var toolscontrol = <Face isEditing={true} objid={this.state.objid} />
      } else if (this.state.editclassname == 'lb-face2') {
        var toolscontrol = <Face2 isEditing={true} objid={this.state.objid} />
      } else {
        var toolscontrol = <p>Coming Soon</p>
      }
      
      var tools = (
        <div>
          <h2>{this.state.editclassname}</h2>
            {toolscontrol}
        </div>
      )
    } else {
      var tools = (
        <div>
          <FlowStart isInToolbox={true} />
          <EightByEight isInToolbox={true} />
          <Face isInToolbox={true} />
          <Face2 isInToolbox={true} />
          <Controller isInToolbox={true} />
          <Wheels isInToolbox={true} />
          <FlowEnd isInToolbox={true} />
          
          <button className="btn btn-success" onClick={this.onClear}>Clear</button>
          <button className="btn btn-success" onClick={this.onLoad}>Load</button>
          <button className="btn btn-success" onClick={this.onSave}>Save</button>
        </div>
      )
    }
    return (
      <div>
        {tools}
      </div>
    );
  }
});
