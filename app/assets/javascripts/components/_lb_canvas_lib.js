//
//  lbcanvas messages handling
//
//  Cater for expansion to multiple games
//

var lbcanvaslib = {

  tooldragstart: function(e) {
    this.setState({tooldragging: true, tool: e.props, rx:e.rx, ry:e.ry, x:e.x, y:e.y})
  },

  toolstartmove: function(e) {
    var tool = this.state.items[e.objid]
    var x = e.x-e.rx-this.pos.left
    var y = e.y-e.ry-this.pos.top
    this.setState({rx:e.rx, ry:e.ry, ox:x, oy:y, x:x, y:y})
  },

  tooldragstop: function(e) {
    if(this.state.droppable) {
      var toolx = this.state.x-this.pos.left-this.state.rx+this.canvas.scrollLeft();
      var tooly = this.state.y-this.pos.top-this.state.ry+this.canvas.scrollTop();
      if (toolx > 0 && tooly > 0) {
        var tool = {
          uuid:Math.uuid(),
          className:this.state.tool.className,
          data:null,
          conf:null,
          isGadget:e.isGadget,
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
  },

  tooldragging: function(e) {
    this.setState({x: e.x, y: e.y})
  },

  clearproject: function(e) {
    this.state.items=[]
    this.setState({items:this.state.items})
  },

  toolstopmove: function(e) {
    var vx = this.state.ox - this.state.x
    var vy = this.state.oy - this.state.y

    if (Math.abs(vy) < 10 && Math.abs(vx) < 10) {
      if (!e.isGadget) {
        this.selectTool(e.objid,e.className,e.data,e.conf);
      }
    }
  },

  moveexistingtool: function(e) {
    var tool = this.findToolByObjectId(e.objid)
    var x = e.x-this.state.rx-this.pos.left+this.canvas.scrollLeft();
    var y = e.y-this.state.ry-this.pos.top+this.canvas.scrollTop();
    tool.x = x > 0 ? x : 0;
    tool.y = y > 0 ? y : 0;
    this.setState({items:this.state.items, x:tool.x, y:tool.y})
  },

  dragstart: function(e) {
    var toks = e.objid.split('|');
    this.setState({dragstartoid:toks[0], dragstarttype:toks[1], dragstartid:toks[2]})
  },

  drop: function(e) {
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
  },

  deletetool: function(e) {
    for (var i in this.state.items) {
      if (this.state.items[i].uuid === e.objid) {
        this.state.items.splice(i,1);
        this.setState({items:this.state.items})
      }
    }
  },

  unselecttool: function(e) {
    this.setState({selectedTool:null})
  },

  sendface: function(e) {
    var tool = this.findToolByObjectId(e.objid)
    tool.data = e.face;
    this.setState({items:this.state.items})
  },

  connectormove: function(e) {
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
  },

  connectordrop: function(e) {
    this.setState({connectordragging:false})
  },

  lboutput: function(e) {
    var outputobj = this.findToolByObjectId(e.objid);
    outputobj.data = e.data;
    this.setState({items:this.state.items})
  },

  lbcopy: function(e) {
    var inputobj = this.findToolByObjectId(e.fromobjid);
    var outputobj = this.findToolByObjectId(e.toobjid);
    outputobj.data = inputobj.data;
    if (outputobj.conf) {
      var url = "http://"+outputobj.conf.ipaddr+":8080/api.php?cmd=8x8&data=" + outputobj.data;
      console.log(url)
      $.get(url, function (data) {
      });
    }
    this.setState({items:this.state.items});
  },

  lbclear: function(e) {
    var outputobj = this.findToolByObjectId(e.objid);
    outputobj.data = "0000000000000000"
    this.setState({items:this.state.items});
    if (outputobj.conf) {
      var url = "http://"+outputobj.conf.ipaddr+":8080/api.php?cmd=8x8&data=" + outputobj.data;
      console.log(url)
      $.get(url, function (data) {
      });
    }
  },

  sendconfig: function(e) {
    var outputobj = this.findToolByObjectId(e.objid);
    outputobj.conf = e.config;
    this.setState({items:this.state.items})
  },

  lbgamemessage: function(e) {
    var outputobj = this.findToolByObjectId(e.objid);
    outputobj.conf = $.extend(outputobj.conf, e.message);
    this.setState({items:this.state.items})
  },

  remote: function(e) {
    var remotetool = null;
    for (var i in this.state.items) {
      var tool = this.state.items[i]
      if (tool.className === 'lb-remote' && tool.uuid == e.objid) {
        remotetool = tool;
      }
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

};

  
  


