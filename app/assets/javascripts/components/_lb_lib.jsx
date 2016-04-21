/* global AppDispatcher, React, ReactDOM */

//
//  Classname Concatenation Utility
//
var hasOwn = {}.hasOwnProperty;
var classNames = function () {
	var classes = [];
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		if (!arg) continue;
		var argType = typeof arg;
		if (argType === 'string' || argType === 'number') {
			classes.push(arg);
		} else if (Array.isArray(arg)) {
			classes.push(classNames.apply(null, arg));
		} else if (argType === 'object') {
			for (var key in arg) {
				if (hasOwn.call(arg, key) && arg[key]) {
					classes.push(key);
				}
			}
		}
	}
	return classes.join(' ');
}

//
//  LBSubComponent - define Draggable (without component label)
//
var LBSubComponent = React.createClass({
  getInitialState: function() {
    return {dragging:false, isInToolbox:this.props.isInToolbox};
  },
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
      document.addEventListener('touchmove', this.onMouseMove)
      document.addEventListener('touchend', this.onMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
      document.removeEventListener('touchmove', this.onMouseMove)
      document.removeEventListener('touchend', this.onMouseUp)
    }
  },
  onMouseDown: function(e) {
    var node = ReactDOM.findDOMNode(this);
    var pos = $(node).offset();
    var x,y;
    if (typeof(e.touches) !== 'undefined') {
      x = Math.floor(e.touches[0].pageX);
      y = Math.floor(e.touches[0].pageY);
    } else {
      x = Math.floor(e.clientX);
      y = Math.floor(e.clientY); 
    }
    this.setState({dragging: true});
    //
    //  If in toobox, create new copy by sending message to canvas
    //
    if (this.props.isInToolbox) {
      AppDispatcher.dispatch({
        action:'tooldragstart',
        rx: x - pos.left,
        ry: y - pos.top,
        x:x,
        y:y,
        props:this.props.children.props
      })
    } else {
      AppDispatcher.dispatch({
        action:'toolstartmove',
        objid:this.props.objid,
        rx: x - pos.left,
        ry: y - pos.top,
        x:x,
        y:y,
      })
    }
    e.stopPropagation();
    e.preventDefault();
  },
  onMouseUp: function(e) {
    this.setState({dragging: false});
    //
    //  If in toobox, notify for drop by sending message to canvas
    //
    if (this.props.isInToolbox) {
      AppDispatcher.dispatch({
        action:'tooldragstop',
      })
    } else {
      AppDispatcher.dispatch({
        action:'toolstopmove',
        objid:this.props.objid,
        className:this.props.children.props.className
      }) 
    }
    e.stopPropagation();
    e.preventDefault();
  },
  onMouseMove: function(e) {
    var node = ReactDOM.findDOMNode(this);
    var pos = $(node).offset();
    var x,y;
    if (typeof(e.touches) !== 'undefined') {
      x = Math.floor(e.touches[0].pageX);
      y = Math.floor(e.touches[0].pageY);
    } else {
      x = Math.floor(e.clientX);
      y = Math.floor(e.clientY); 
    }
    //
    //  If in toobox, move new copy by sending message to canvas
    //
    if (this.props.isInToolbox) {
      AppDispatcher.dispatch({
        action:'tooldragging',
        x:x,
        y:y,
      })
    } else {
      AppDispatcher.dispatch({
        action:'moveexistingtool',
        objid:this.props.objid,
        x:x,
        y:y,
      })
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render: function() {
    //
    // Don't allow drag and drop if editing  
    //
    if (this.props.isEditing) {
      return (
        <div className={classes}>
          {this.props.children}
        </div>
      );
    } else {
      var classes = classNames( 'react-draggable', { //this.props.children.props.className ||
        'react-draggable-dragging': this.state.dragging,
        'react-draggable-dragged': this.state.dragged
      });
      return (
        <div className={classes}  onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}>
          {this.props.children}
        </div>
      );
    };

  }
})

//
//  LBSubComponent - define tool wrapper for toolbox
//
var LBComponent = React.createClass({
  render: function() {
    //
    //  Display header only if tool is inside toolbox, otherwise just display the tool itself
    //
    if (this.props.isInToolbox) {
      var headerPart = (
        <h4 className="toollabel">{this.props.toolName}</h4>
      )
    }
    return (
      <div className="lbtoolwrapper">
        {headerPart}
        <LBSubComponent objid={this.props.objid} children={this.props.children} isInToolbox={this.props.isInToolbox} isEditing={this.props.isEditing}/>
      </div>
    );
  }
})