/* global AppDispatcher, React, ReactDOM */

var LBCanvas = React.createClass({
  getInitialState: function() {
    var projects = loadProjects();
    var items = [];
    if (projects['autosave']) {
      items = projects["autosave"];
      //
      //  Redraw to trigger drawing lines after objects are created
      //
      setTimeout(function() {
        this.setState({items:this.state.items})
      }.bind(this),50);
    }
    return {tooldragging:false,connectordragging:false,items:items};
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
      if(this.state.droppable) {
        var toolx = this.state.x-pos.left-this.state.rx+canvas.scrollLeft();
        var tooly = this.state.y-pos.top-this.state.ry+canvas.scrollTop();
        if (toolx > 0 && tooly > 0) {
          var tool = {
            uuid:Math.uuid(),
            className:this.state.tool.className,
            data:null,
            conf:null,
            x: toolx,
            y: tooly
          };
          this.state.items.push(tool);
          this.setState({tooldragging: false, tool:null, items:this.state.items})
        } else {
          this.setState({tooldragging: false, tool:null})
        }
      } else {
        this.setState({tooldragging: false, tool:null})
      }

    } else  if (e.action === 'tooldragging') {
      this.setState({x: e.x, y: e.y})
    } else  if (e.action === 'clearproject') {
      this.state.items=[]
      this.setState({items:this.state.items})
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
      var toks = e.objid.split('|');
      this.setState({dragstartoid:toks[0], dragstarttype:toks[1], dragstartid:toks[2]})
    } else if (e.action === 'drop') {
      var startobj = this.findToolByObjectId(this.state.dragstartoid);
      if (typeof(startobj[this.state.dragstarttype]) == 'undefined') {
        startobj[this.state.dragstarttype] = []
      }
      if (typeof(startobj.input) !== 'undefined') {
        for(var i = startobj.input.length - 1; i >= 0; i--) {
          if(startobj.input[i].n == this.state.dragstartid || startobj.input[i].objid == e.objid) {
            startobj.input.splice(i, 1);
          }
        }
      }
      if (typeof(startobj.output) !== 'undefined') {
        for(var i = startobj.output.length - 1; i >= 0; i--) {
          if(startobj.output[i].n == this.state.dragstartid || startobj.output[i].objid == e.objid) {
            startobj.output.splice(i, 1);
          }
        }
      }
      startobj[this.state.dragstarttype].push({ 'n': this.state.dragstartid, 'objid': e.objid });
      this.setState({items: this.state.items})
    } else if (e.action === 'deletetool') {
      for (var i in this.state.items) {
        if (this.state.items[i].uuid === e.objid) {
          this.state.items.splice(i,1);
          this.setState({items:this.state.items})
        }
      }
    } else if (e.action === 'unselecttool') {
      this.setState({selectedTool:null})
    } else if (e.action === 'sendface') {
      var tool = this.findToolByObjectId(e.objid)
      tool.data = e.face;
      this.setState({items:this.state.items})
    } else if (e.action === 'connectormove') {
      var toks = e.objid.split('|');
      this.setState(
        {
          connectordragging:true,
          connectorx:e.x,
          connectory:e.y,
          connectoroid:toks[0],
          connectortype:toks[1],
          connectorid:toks[2]
        }
      )
    } else if (e.action === 'connectordrop') {
      this.setState({connectordragging:false})
    } else  if (e.action === 'lboutput') {
      var outputobj = this.findToolByObjectId(e.objid);
      outputobj.data = e.data;
      this.setState({items:this.state.items})
    } else  if (e.action === 'lbcopy') {
      var inputobj = this.findToolByObjectId(e.fromobjid);
      var outputobj = this.findToolByObjectId(e.toobjid);
      outputobj.data = inputobj.data;

      $.get("http://192.168.3.1/api/api.php?cmd=8x8&data=" + outputobj.data, function (data) {
      });

      this.setState({items:this.state.items});
    } else  if (e.action === 'lbclear') {
      var outputobj = this.findToolByObjectId(e.objid);
      outputobj.data = "0000000000000000"
      this.setState({items:this.state.items});
      $.get("http://192.168.3.1/api/api.php?cmd=8x8&data=" + outputobj.data, function (data) {
      });
    } else if (e.action === 'remote') {
      var remotetool = null;
      for (var i in this.state.items) {
        var tool = this.state.items[i]
        if (tool.className === 'lb-remote' && tool.uuid == e.objid) {
          remotetool = tool;
        }
        if (remotetool) {
          if (this.state.selectedTool) {
            var selectedTool = this.state.selectedTool;
            this.setState({selectedTool:null})
            _.delay(function() {
              AppDispatcher.dispatch({
                action:'unselecttool',
                objid:selectedTool
              })
            },20)
          }
          remotetool.data = 1;
          this.setState({items:this.state.items})
          setTimeout(function() {
            remotetool.data = 0;
            this.setState({items:this.state.items})
          }.bind(this),250)
          _.delay(function() {
            lbRemoteButtonPressed (remotetool.uuid, e.button)
          },20)
        }
      }
    }
    autoSaveProject('autosave',this.state.items);
  },
  componentDidMount: function() {
    this.token = AppDispatcher.register(this.handleEvents);
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  makeElementFromClassname: function(className,data,conf,i,x,y) {
    if (className == 'lb-flowstart') {
      return (<FlowStart max={1} className={className} data={data} conf={conf} objid={i} x={x} y={y} />)
    } else if (className == 'lb-ledarray') {
      return (<EightByEight max={2}  className={className} data={data} conf={conf} objid={i} x={x} y={y} />)
    } else if (className == 'lb-flowend') {
      return (<FlowEnd max={1} className={className} data={data} conf={conf} objid={i} x={x} y={y} />)
    } else if (className == 'lb-controller') {
      return (<Controller max={1} className={className} data={data} conf={conf} objid={i} x={x} y={y} />)
    } else if (className == 'lb-wheels') {
      return (<Wheels max={1} className={className} data={data} conf={conf} objid={i} x={x} y={y} />)
    } else if (className == 'lb-face') {
      return (<Face max={4} className={className} data={data} conf={conf} objid={i} x={x} y={y} />)
    } else if (className == 'lb-remote') {
      return (<Remote max={4} className={className} data={data} conf={conf} objid={i} x={x} y={y} />)
    }
  },
  render: function() {

    //
    //  Check unique items and only drop once
    //
    var unique = {};

    //
    //  Draw all items on canvas
    //
    var createItem = function(i) {
      var elem = this.makeElementFromClassname(i.className,i.data,i.conf,i.uuid,i.x,i.y);
      var placedToolStyle = {
        position:'absolute',
        top:i.y,
        left:i.x
      }
      if (typeof(unique[i.className]) == 'undefined') {
        unique[i.className] = 0;
      }
      unique[i.className]++;
      if (i.uuid === this.state.selectedTool) {
        placedToolStyle.border = '1px solid blue'
      }
      return (
        <div id={i.uuid} style={placedToolStyle} key={i.uuid}>
          {elem}
        </div>
      )
    }.bind(this);
    var createConnection = function(lbobject) {
      var drawLine = function(l) {
        var dest = this.findToolByObjectId(l.objid);
        if (!dest) {
          if (typeof(lbobject.input) !== 'undefined') {
            for(var i = lbobject.input.length - 1; i >= 0; i--) {
              if(lbobject.input[i] == l) {
                lbobject.input.splice(i, 1);
              }
            }
          }
          if (typeof(lbobject.output) !== 'undefined') {
            for(var i = lbobject.output.length - 1; i >= 0; i--) {
              if(lbobject.output[i] == l) {
                lbobject.output.splice(i, 1);
              }
            }
          }
          return;
        }
        var closestConn = closestConnectorStyle(lbobject.x,lbobject.y,lbobject.uuid,dest.x,dest.y,l.objid);
        if(!closestConn) return;
        var lineStyle = createNavLine(closestConn.srcStyle.left,closestConn.srcStyle.top,closestConn.destStyle.left,closestConn.destStyle.top)
        return (
          <div key={l.n+"-"+l.objid}>
            <div style={lineStyle}>
              {l.n}
            </div>
            <div style={closestConn.srcStyle} />
            <div style={closestConn.destStyle} />
          </div>
        )
      }.bind(this)
      if (lbobject.className == 'lb-controller') {
        lbSetController(lbobject);
      }
      if ((typeof(lbobject.input) !== 'undefined') || (typeof(lbobject.output) !== 'undefined')) {
        if (typeof(lbobject.input) !== 'undefined') {
          var inputs =  lbobject.input.map(drawLine)
        }
        if (typeof(lbobject.output) !== 'undefined') {
          var outputs = lbobject.output.map(drawLine)
        }
        return (
          <div key={'line-'+lbobject.uuid}>
            {inputs}
            {outputs}
          </div>
        )
      }

    }.bind(this);
    var createdItems = (<div>{this.state.items.map(createItem)}</div>);
    var createdConnections = (<div>{this.state.items.map(createConnection)}</div>);

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



      var draggingTool = this.makeElementFromClassname(this.state.tool.className,null,0,0,0);
      var draggingElem = (
        <div style={draggingElemStyle}>
          {draggingTool}
        </div>
      )

      var pos = $('#lbcanvas').offset();
      var x = this.state.x - pos.left - this.state.rx
      var y = this.state.y - pos.top - this.state.ry

      if (x > 0 && y > 0) {
        if (unique[this.state.tool.className] >= draggingTool.props.max) {
          this.state.droppable=false;
          overlayStyle.backgroundColor = 'rgba(255,128,128,0.4)'
        } else {
          this.state.droppable=true;
          overlayStyle.backgroundColor = 'rgba(128,255,128,0.4)'
        }
      }
    }
    draggingConnectorElem = null;
    if (this.state.connectordragging) {
      var dragConnectorStyle = {
        position:'fixed',
        top:this.state.connectory,
        left:this.state.connectorx,
        backgroundColor: 'rgba(128,128,255,0.4)',
        border: '1px solid blue',
        borderRadius:15,
        borderTopLeftRadius:0,
        width:30,
        height:30,
        fontSize:22
      };
      draggingConnectorElem = (<div style={dragConnectorStyle}>{this.state.connectorid}</div>)
    }

    var logoElem = (
      <img className="logoStyle" src="/images/perdoco.png">
      </img>
    )
    
    return (
      <div style={canvasStyle}>
        {createdConnections}
        {createdItems}
        {loaderElem}
        {draggingElem}
        {draggingConnectorElem}
        {logoElem}
      </div>
    );
  }
});
