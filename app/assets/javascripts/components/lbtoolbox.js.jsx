/* global AppDispatcher, React, ReactDOM */

var LBToolbox = React.createClass({
  getInitialState: function() {
    var config = getConfig();
    return {
      config: config,
      avatar: faceDataToArray(config.avatar)
    };
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
  itemClick: function (r, c) {
    if (this.state.avatar[r][c] == 0) {
      this.state.avatar[r][c] = 1;
    } else {
      this.state.avatar[r][c] = 0;
    }
    this.setState({avatar: this.state.avatar});
  },
  handleEvents: function(e) {
    if (e.action === 'selecttool') {
      this.setState({objid: e.objid, editclassname:e.className, data:e.data, conf:e.conf})
    } else if (e.action === 'unselecttool' || e.action === 'deletetool') {
      this.setState({objid: null, editclassname:null, editid: null})
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
  onRun: function(e){
    if (typeof(lbRun) == 'undefined') {
      lbMsg("Runtime Error","Must define fuction lbRun()")
    } else {
      lbRun();
    }
  },
  onStop: function(e){
    if (typeof(lbStop) == 'undefined') {
      lbMsg("Runtime Error","Must define fuction lbStop()")
    } else {
      lbStop();
    }
  },
  onEditID: function(e){
    this.setState({editplayer: true})
  },
  onEditIDCancel: function(e){
    this.setState({editplayer: false})
  },
  onEditIDSave: function(e){
    var config = {
      group:$('#lb_groupname')[0].value,
      username:$('#lb_username')[0].value,
      avatar:faceArrayToData(this.state.avatar)
    };
    this.setState({editplayer: false, config:config});
    config.mode = 'student';
    socket.emit('register', config);
    storeConfig(config);
  },
  render: function() {

    if (this.state.editplayer) {
      var r = -1;
      var c = -1;
      var ledEditCol = function (col) {
        if (col > 0) {
          var ledStyle = {
            backgroundColor: 'red',
            border: '1px solid red'
          };
        } else {
          var ledStyle = {
            border: 'solid 1px #ddd',
            backgroundColor: '#fff',
            boxShadow: '1px 1px 1px #ddd'
          };
        }
        return (
          <div className="lb-led-edit" style={ledStyle} key={c++} onClick={this.itemClick.bind(this,r,c)}></div>
        );
      }.bind(this);
      var ledEditRow = function (row) {
        c = -1;
        return (
          <div className="lb-ledrow" key={r++}>
            {row.map(ledEditCol)}
          </div>
        );
      };
      return (
        <div className="toolContainer">
          <h2>Player Config</h2>
          <h4>Avatar</h4>
          <div>
            {this.state.avatar.map(ledEditRow)}
          </div>
          <h4>Group Name</h4>
          <input id="lb_groupname" type="text" className="form-control" placeholder="Group Name" defaultValue={this.state.config.group} />
          <h4>PlayerName</h4>
          <input id="lb_username" type="text" className="form-control" placeholder="Player Name" defaultValue={this.state.config.username} />
          <button className="btn btn-danger" onClick={this.onEditIDCancel}>Cancel</button>
          <button className="btn btn-success" onClick={this.onEditIDSave}>Save</button>
        </div>
      )
    } else if (this.state.objid) {
      if (this.state.editclassname == 'lb-face') {
        var toolscontrol = <Face isEditing={true} objid={this.state.objid} data={this.state.data} conf={this.state.conf} />
      } else if (this.state.editclassname == 'lb-controller') {
        var toolscontrol = <Controller isEditing={true} objid={this.state.objid} />
      } else if (this.state.editclassname == 'lb-ledarray') {
        var toolscontrol = <EightByEight isEditing={true} objid={this.state.objid} data={this.state.data} conf={this.state.conf} />
      } else if (this.state.editclassname == 'lb-remote') {
        var toolscontrol = <Remote siohost={this.props.siohost} isEditing={true} objid={this.state.objid} />
      }else {
        var toolscontrol = <p>Coming Soon</p>
      }
      return (
        <div className="toolContainer">
          <h2>{this.state.editclassname}</h2>
          {toolscontrol}
          <button className="btn btn-danger" onClick={this.onDelete}>Delete</button>
          <button className="btn btn-success" onClick={this.onClose}>Close</button>
        </div>
      )
    } else {
      return (
        <div className="toolContainer">
          <table className="toolTable">
            <tbody>
            <tr>
              <td><EightByEight isInToolbox={true} /></td>
              <td><Controller isInToolbox={true} /></td>
            </tr>
            <tr>
              <td><Face isInToolbox={true} /></td>
              <td><Wheels isInToolbox={true} /></td>
            </tr>
            <tr>
              <td><Remote isInToolbox={true} /></td>
              <td><Hex isInToolbox={true} /></td>
            </tr>
            </tbody>
          </table>
          <button className="btn btn-default" onClick={this.onEditID}>
            <span className="glyphicon glyphicon-user" aria-hidden="true"></span> ID
          </button>
          <button className="btn btn-default" onClick={this.onClear}>>
            <span className="glyphicon glyphicon-erase" aria-hidden="true"></span> Clear
          </button>
          <button className="btn btn-default" onClick={this.onRun}>
            <span className="glyphicon glyphicon-play" aria-hidden="true"></span> Run
          </button>
          <button className="btn btn-default" onClick={this.onStop}>
            <span className="glyphicon glyphicon-stop" aria-hidden="true"></span> Stop
          </button>
        </div>
      )
    }


  }
});
