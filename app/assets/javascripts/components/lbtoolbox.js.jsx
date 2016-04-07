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
    } else if (e.action === 'unselecttool' || e.action === 'deletetool') {
      this.setState({objid: null, editclassname:null})
    }
  },
  componentDidMount: function() {
    this.token = AppDispatcher.register(this.handleEvents);
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  onDelete: function(e){
    AppDispatcher.dispatch({
      action:'deletetool',
      objid:this.state.objid
    })
  },
  onClose: function(e){
    AppDispatcher.dispatch({
      action:'unselecttool',
      objid:this.state.objid
    })
  },
  render: function() {
    if (this.state.objid) {
      if (this.state.editclassname == 'lb-face') {
        var toolscontrol = <Face isEditing={true} objid={this.state.objid} />
      } else if (this.state.editclassname == 'lb-face2') {
        var toolscontrol = <Face2 isEditing={true} objid={this.state.objid} />
      } else if (this.state.editclassname == 'lb-controller') {
        var toolscontrol = <Controller isEditing={true} objid={this.state.objid} />
      } else if (this.state.editclassname == 'lb-ledarray') {
        var toolscontrol = <EightByEight isEditing={true} objid={this.state.objid} />
      } else {
        var toolscontrol = <p>Coming Soon</p>
      }
      var tools = (
        <div>
          <h2>{this.state.editclassname}</h2>
          {toolscontrol}
          <button className="btn btn-danger" onClick={this.onDelete}>Delete</button>
          <button className="btn btn-success" onClick={this.onClose}>Close</button>
        </div>
      )
    } else {
      var tools = (
        <div>
          <EightByEight isInToolbox={true} />
          <Controller isInToolbox={true} />
          <Face isInToolbox={true} />
          <Face2 isInToolbox={true} />
          <Wheels isInToolbox={true} />
          
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
