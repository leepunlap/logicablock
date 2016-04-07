/* global AppDispatcher, React, ReactDOM */

var LBDragSource = React.createClass({
  getInitialState: function() {
    return {};
  },
  onDragStart: function(e){
    e.dataTransfer.setData("text/html", e.target.id)
    AppDispatcher.dispatch({
      action:'dragstart',
      objid:e.target.id
    })
  },
  render: function() {
    return (
      <div className="lb-draggable" draggable="true" onDragStart={this.onDragStart} id={this.props.id}>{this.props.name}</div>
    );
  }
})