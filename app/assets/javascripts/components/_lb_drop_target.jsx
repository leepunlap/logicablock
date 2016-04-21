/* global AppDispatcher, React, ReactDOM */

var LBDropTarget = React.createClass({
  getInitialState: function() {
    return {};
  },
  dragOver: function(e){
    if (_.indexOf(this.props.accepts, this.state.dragstarttype) >= 0) {
      this.setState({overed:true,allowed:true});
      e.preventDefault();e.stopPropagation();
      return false;
    } else {
      this.setState({overed:true,allowed:false});
    }
  },
  dragLeave: function(e){
    e.preventDefault();e.stopPropagation();
    this.setState({overed:false});
    return false;
  },
  onDrop: function(e,elem){
    var objid = e.dataTransfer.getData("text/html")
    this.setState({overed:false});
    AppDispatcher.dispatch({
      action:'drop',
      objid:e.target.id
    })
  },
  handleEvents: function(e) {
    var pos = $('#lbcanvas').offset();
    var canvas = $('#lbcanvas');
    var node = ReactDOM.findDOMNode(this);
    var nodepos = $(node).offset();
    if (e.action === 'dragstart') {
      var toks = e.objid.split('|');
      this.setState({dragstartoid:toks[0], dragstarttype:toks[1], dragstartid:toks[2]})
    } else if (e.action === 'connectormove') {
      var toks = e.objid.split('|');
      this.setState({dragstartoid:toks[0], dragstarttype:toks[1], dragstartid:toks[2]})
      var x = nodepos.left
      var y = nodepos.top
      var w = $(node).width()
      var h = $(node).height()
      if (e.x > x && e.y > y && e.x < x+w && e.y < y+h) {
        this.setState({overed:true});
        if (_.indexOf(this.props.accepts, this.state.dragstarttype) >= 0) {
          this.setState({overed:true,allowed:true});
        } else {
          this.setState({overed:true,allowed:false});
        }
      } else {
        this.setState({overed:false});
      }
    } else if (e.action === 'connectordrop') {
      if (this.state.overed && this.state.allowed) {
        _.delay(function(oid) {
          AppDispatcher.dispatch({
            action:'drop',
            objid:oid
          })
        }, 100, this.props.id);
      }
      this.setState({overed:false});
    }
  },
  componentDidMount: function() {
    this.token = AppDispatcher.register(this.handleEvents);
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  render: function() {
    var dropTarget = {
      position:'absolute',
      top:0,
      left:0,
      height:'100%',
      width:'100%',
      textAlign:'center'
    }
    if (this.state.overed) {
      if (this.state.allowed) {
        dropTarget.border='2px solid green'
      } else {
        dropTarget.border='2px solid red'
      }

    }
    return (
      <div style={dropTarget} id={this.props.id} onDrop={this.onDrop} onDragOver={this.dragOver} onDragEnter={this.dragOver} onDragLeave={this.dragLeave}></div>
    );
  }
})