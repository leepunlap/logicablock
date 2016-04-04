/* global AppDispatcher, React, ReactDOM */

var LBCanvas = React.createClass({
  getInitialState: function() {
    return {tooldragging:false,items:[]};
  },
  deviceOrientationChanged: function(e) {
    this.setState({alpha: e.alpha});
  },
  findToolByObjectId: function(objid) {
    for (var i in this.state.items) {
      if (this.state.items[i].uuid === objid) {
        return this.state.items[i];
      }
    }
    return null;
  },
  selectTool: function(objid,className) {
    if (this.state.selectedTool === objid) {
      this.setState({selectedTool:null})
      _.delay(function(e) {
        AppDispatcher.dispatch({
          action:'unselecttool',
          objid:objid
        })
      },20,objid)
    } else {
      this.setState(({selectedTool:objid}))
      _.delay(function(e) {
        AppDispatcher.dispatch({
          action:'selecttool',
          className:className,
          objid:objid
        })
      },20,objid)
    }
  },
  handleEvents: function(e) {
    var pos = $('#lbcanvas').offset();
    var canvas = $('#lbcanvas');
    if (e.action === 'tooldragstart') {
      this.setState({tooldragging: true, tool: e.props, rx:e.rx, ry:e.ry, x:e.x, y:e.y})
    } else if (e.action === 'tooldragstop') {
      var tool = {
        uuid:Math.uuid(),
        className:this.state.tool.className,
        x: this.state.x-pos.left-this.state.rx+canvas.scrollLeft(),
        y: this.state.y-pos.top-this.state.ry+canvas.scrollTop()
      }
      this.state.items.push(tool);
      this.setState({tooldragging: false, tool:null, items:this.state.items})
    } else  if (e.action === 'tooldragging') {
      this.setState({x: e.x, y: e.y})  
    } else  if (e.action === 'clearproject') {
      this.setState({items:[]})
    } else if (e.action === 'toolstartmove') {
      var tool = this.state.items[e.objid]
      var x = e.x-e.rx-pos.left
      var y = e.y-e.ry-pos.top
      this.setState({rx:e.rx, ry:e.ry, ox:x, oy:y, x:x, y:y})
    } else if (e.action === 'toolstopmove') {
      var vx = this.state.ox - this.state.x
      var vy = this.state.oy - this.state.y
      if (Math.abs(vy) < 10 && Math.abs(vx) < 10) {
        this.selectTool(e.objid,e.className);
      }
    } else if (e.action === 'moveexistingtool') {
      var tool = this.findToolByObjectId(e.objid)
      tool.x = e.x-this.state.rx-pos.left+canvas.scrollLeft();
      tool.y = e.y-this.state.ry-pos.top+canvas.scrollTop();
      this.setState({items:this.state.items, x:tool.x, y:tool.y})
    } else if (e.action === 'dragstart') {
      this.setState({dragstartid:e.objid})
    } else if (e.action === 'drop') {
      console.log('drop ' + this.state.dragstartid + " to " +  e.objid)
    }
  },
  componentDidMount: function() {
    this.token = AppDispatcher.register(this.handleEvents);
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  makeElementFromClassname: function(className,i,x,y) {
    if (className == 'lb-flowstart') {
      return (<FlowStart className={className} objid={i} x={x} y={y} />)
    } else if (className == 'lb-ledarray') {
      return (<EightByEight className={className} objid={i} x={x} y={y} />)
    } else if (className == 'lb-flowend') {
      return (<FlowEnd className={className} objid={i} x={x} y={y} />)
    } else if (className == 'lb-controller') {
      return (<Controller className={className} objid={i} x={x} y={y} />)
    } else if (className == 'lb-wheels') {
      return (<Wheels className={className} objid={i} x={x} y={y} />)
    } else if (className == 'lb-face') {
      return (<Face className={className} objid={i} x={x} y={y} />)
    } else if (className == 'lb-face2') {
      return (<Face2 className={className} objid={i} x={x} y={y} />)
    }
  },
  render: function() {
    
    //
    //  Highlight canvas on drag entry
    //
    var canvasStyle = {
      position:'relative',
      height:'100%',
      borderBottomLeftRadius:10,
      borderBottomRightRadius:10,
      textAlign:'center'
    }
    var overlayStyle = {
      position:'absolute',
      width:'100%',
      height:'100%',
      backgroundColor:'rgba(128,128,128,0.4)',
      borderBottomLeftRadius:10,
      borderBottomRightRadius:10,
    }
    var pos = $('#lbcanvas').offset();
    var x = this.state.x - pos.left - this.state.rx
    var y = this.state.y - pos.top - this.state.ry
    if (x > 0 && y > 0) {
      overlayStyle.backgroundColor = 'rgba(128,255,128,0.4)'
    }

    //
    //  Display item being dragged from toolbox
    //
    if (this.state.tool) {
      //
      //  Display loader while drag is in progress
      //
      var loaderElem = (
        <div style={overlayStyle}></div>
      )
      //
      //  Display dragged element
      //
      var draggingElemStyle = {
        position:'fixed',
        border: '1px solid red',
        top: this.state.y - this.state.ry,
        left: this.state.x - this.state.rx
      };
      var draggingTool = this.makeElementFromClassname(this.state.tool.className,0,0,0);
      var draggingElem = (
        <div style={draggingElemStyle}>
          {draggingTool}
        </div>
      )
    }
    //
    //  Now draw all items on canvas
    //
    var createItem = function(i) {
      var elem = this.makeElementFromClassname(i.className,i.uuid,i.x,i.y);
      var placedToolStyle = {
        position:'absolute',
        top:i.y,
        left:i.x
      }
      if (i.uuid === this.state.selectedTool) {
        placedToolStyle.border = '1px solid blue'
      }
      return (
        <div style={placedToolStyle} key={i.uuid}>
          {elem}
        </div>
      )
    }.bind(this);
    var createdItems = (<div>{this.state.items.map(createItem)}</div>)
    return (
      <div style={canvasStyle}>
        {createdItems}
        {loaderElem}
        {draggingElem}
      </div>
    );
  }
});