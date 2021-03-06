/* global AppDispatcher, React, ReactDOM */

var LBCodeEditor = React.createClass({
  getInitialState: function() {
    return {visible:true};
  },
  handleEvents: function(e) {
    if (e.action === 'showcode') {
      this.setState({visible:true,code:e.code})
    }
    if (e.action === 'centerselection') {
      $("#popkeyboard").focus();
      this.debouncedFocusAndEnableEditor();
    }
  },
  componentDidMount: function() {
    this.token = AppDispatcher.register(this.handleEvents);

    var view=$('#view');
    var editor = ace.edit("editor");
    this.editor = editor;
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().on('change', function () {
      document.getElementById("view").innerText = editor.getSession().getValue();
      //console.log(document.getElementById("view").innerText)
    });
    editor.setOptions({
      fontSize: "14pt"
    });
    $(window).trigger('resize');
    this.debouncedFocusAndEnableEditor = _.debounce(this.focusAndEnableEditor,250);
    $.get("/template-lbcontroller.js", function (data) {
      data += "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n";
      editor.getSession().setValue(data)
    });
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  loadFile: function(f) {
    var path = "/templates/" + f;
    $.get(path, function (data) {
      this.editor.getSession().setValue(data)
    }.bind(this));
  },
  loadUserFile: function(f) {
    this.editor.getSession().setValue(loadLbUserFile(f))
  },
  saveUserFile: function(f) {
    saveLbUserFile(f)
  },
  onClose: function(e){
    AppDispatcher.dispatch({
      action:'unselecttool',
      objid:this.state.objid
    });
    this.setState({visible:false,code:null})
  },
  focusAndEnableEditor: function() {
    if (this.editor) {
      this.editor.manualfocus();
      //this.editor.centerSelection();
      this.editor.setReadOnly(false);
      // setTimeout(function() {
      //   var cursortop = $(".ace_cursor").position().top;
      //   alert(" " + window.innerHeight + ":" + cursortop)
      //   if (window.innerHeight < cursortop) {
      //     window.scrollTo(0,cursortop);
      //   }
      // },500)
    }
  },
  onLeftArrow: function(e) {
    this.editor.navigateLeft(1);
  },
  onRightArrow: function(e) {
    this.editor.navigateRight(1);
  },
  onUpArrow: function(e) {
    this.editor.navigateUp(1);
  },
  onDownArrow: function(e) {
    this.editor.navigateDown(1);
  },
  onShowKeyboard: function() {
    AppDispatcher.dispatch({
      action:'centerselection'
    });
  },
  render: function() {
    var saveManu = (
      <span style={{float:'right'}}>
        <div className="dropdown">
          <button className="btn btn-sm btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            Save
            <span className="caret"/>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
            <li><a onClick={()=>this.saveUserFile("slot1")} href="javascript:void(0);"><span className="glyphicon glyphicon-user"/> Slot 1</a></li>
            <li><a onClick={()=>this.saveUserFile("slot2")} href="javascript:void(0);"><span className="glyphicon glyphicon-user"/> Slot 2</a></li>
            <li><a onClick={()=>this.saveUserFile("slot3")} href="javascript:void(0);"><span className="glyphicon glyphicon-user"/> Slot 3</a></li>
            <li><a onClick={()=>this.saveUserFile("slot4")} href="javascript:void(0);"><span className="glyphicon glyphicon-user"/> Slot 4</a></li>
          </ul>
        </div>
      </span>
    )
    var fileOpenMenu = (
      <span style={{float:'right'}}>
        <div className="dropdown">
          <button className="btn btn-sm btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            Load
            <span className="caret"/>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a onClick={()=>this.loadUserFile("slot1")} href="javascript:void(0);"><span className="glyphicon glyphicon-user"/> Slot 1</a></li>
            <li><a onClick={()=>this.loadUserFile("slot2")} href="javascript:void(0);"><span className="glyphicon glyphicon-user"/> Slot 2</a></li>
            <li><a onClick={()=>this.loadUserFile("slot3")} href="javascript:void(0);"><span className="glyphicon glyphicon-user"/> Slot 3</a></li>
            <li><a onClick={()=>this.loadUserFile("slot4")} href="javascript:void(0);"><span className="glyphicon glyphicon-user"/> Slot 4</a></li>

            <li><a onClick={()=>this.loadFile("faces.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> Faces</a></li>
            <li><a onClick={()=>this.loadFile("rockpaperscissors.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> Rock Paper Scissors</a></li>
            <li><a onClick={()=>this.loadFile("fingerrace.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> Finger Race</a></li>
            <li><a onClick={()=>this.loadFile("drums.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> Drums</a></li>
            <li><a onClick={()=>this.loadFile("balls.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> Balls</a></li>
            <li><a onClick={()=>this.loadFile("world.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> World</a></li>
            <li><a onClick={()=>this.loadFile("ai.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> AI</a></li>
            <li><a onClick={()=>this.loadFile("battleship.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> Battleship</a></li>
            <li><a onClick={()=>this.loadFile("oscillators.js")} href="javascript:void(0);"><span className="glyphicon glyphicon-cloud"/> Oscillators</a></li>
          </ul>
        </div>
      </span>
    );
    var closeBtn = (
      <span style={{float:'right'}}>
        <span style={{position:'absolute',top:-100}}>
        <input id="popkeyboard" />
        </span>
        <button className="btn btn-sm btn-primary" id="confirm-dialog-button-right" onClick={savelbcode} type="button">Close</button>
      </span>
    );
    var cursorButtons = (
      <span style={{float:'left'}}>
        <button className="btn btn-sm btn-warning" style={{color:'black'}} onClick={this.onShowKeyboard} type="button">Edit</button>
        <button className="btn btn-sm btn-default" onClick={this.onLeftArrow} type="button"><span className="glyphicon glyphicon-arrow-left"/></button>
        <button className="btn btn-sm btn-default" onClick={this.onDownArrow} type="button"><span className="glyphicon glyphicon-arrow-down"/></button>
        <button className="btn btn-sm btn-default" onClick={this.onUpArrow} type="button"><span className="glyphicon glyphicon-arrow-up"/></button>
        <button className="btn btn-sm btn-default" onClick={this.onRightArrow} type="button"><span className="glyphicon glyphicon-arrow-right"/></button>
      </span>
    );
    var hiddenStyle = {
      display:'none'
    };
    if (this.state.visible) {
      return (
        <div className="modal fade" id="showcode" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal_wrapper">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {closeBtn}
                  {saveManu}
                  {fileOpenMenu}
                  {cursorButtons}
                </div>
                <div className="modal-body">
                  <pre id="editor">
                  </pre>
                  <pre style={hiddenStyle} id="view">
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <pre style={hiddenStyle} id="view">
        </pre>
        Closed
      </div>
    );
  }
});
