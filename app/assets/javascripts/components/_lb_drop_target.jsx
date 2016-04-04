/* global AppDispatcher, React, ReactDOM */

var LBDropTarget = React.createClass({
  getInitialState: function() {
    return {};
  },
  dragOver: function(e){
     e.preventDefault();e.stopPropagation();
     return false;
  },
  dragEnter: function(e){
    e.preventDefault();e.stopPropagation();
    this.setState({overed:true});
    return false;
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
      dropTarget.border='2px solid green'
    }
    return (
      <div style={dropTarget} id={this.props.id} onDrop={this.onDrop} onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave}></div>
    );
  }
})