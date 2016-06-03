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
  selectTool: function(objid,className,data,conf) {
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
          objid:objid,
          data:data,
          conf:conf
        })
      },20,objid,data,conf)
    }
  },
  handleEvents: function(e) {
    this.pos = $('#lbcanvas').offset();
    this.canvas = $('#lbcanvas');
    var fn = lbcanvaslib[e.action]
    if (typeof (fn) === "function") fn.bind(this)(e);
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
