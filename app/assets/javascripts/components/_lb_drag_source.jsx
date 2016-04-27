/* global AppDispatcher, React, ReactDOM */

var LBDragSource = React.createClass({
  getInitialState: function() {
    return {dragging:false};
  },
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('touchmove', this.onTouchMove)
      document.addEventListener('touchend', this.onTouchEnd)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('touchmove', this.onTouchMove)
      document.removeEventListener('touchend', this.onTouchEnd)
    }
  },
  onTouchStart: function(e) {
    e.preventDefault();e.stopPropagation();
    var node = ReactDOM.findDOMNode(this);
    var pos = $(node).offset();
    var x,y;
    if (typeof(e.touches) !== 'undefined') {
      x = Math.floor(e.touches[0].pageX);
      y = Math.floor(e.touches[0].pageY);
    }
    AppDispatcher.dispatch({
      action:'dragstart',
      objid:e.target.id
    })
    this.setState({dragging: true,x: x, y: y});
  },
  onTouchMove:function(e) {
    e.preventDefault();e.stopPropagation();
    var node = ReactDOM.findDOMNode(this);
    var pos = $(node).offset();
    var x,y;
    if (typeof(e.touches) !== 'undefined') {
      x = Math.floor(e.touches[0].pageX);
      y = Math.floor(e.touches[0].pageY);
    }
    AppDispatcher.dispatch({
      action:'connectormove',
      objid:e.target.id,
      x:x,
      y:y
    })
    this.setState({x: x, y: y});
  },
  onTouchEnd:function(e) {
    e.preventDefault();e.stopPropagation();
    AppDispatcher.dispatch({
      action:'connectordrop',
      objid:e.target.id
    })
    this.setState({dragging: false});
  },
  onDragStart: function(e){
    AppDispatcher.dispatch({
      action:'dragstart',
      objid:e.target.id
    })
  },
  render: function() {
    return (
      <div className="lb-draggable col-xs-3" draggable="true"  onTouchStart={this.onTouchStart} onDragStart={this.onDragStart} id={this.props.id}>{this.props.name}</div>
    );
  }
})