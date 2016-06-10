/* global AppDispatcher, React, ReactDOM */

var LBCodeEditor = React.createClass({
  getInitialState: function() {
    return {visible:true};
  },
  handleEvents: function(e) {
    if (e.action === 'showcode') {
      this.setState({visible:true,code:e.code})
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
    $.get("/template-lbcontroller.js", function (data) {
      editor.getSession().setValue(data)
    });
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  loadFile: function(f) {
    var path = "/templates/" + f;
    console.log(path)
    console.log(this.editor)
    $.get(path, function (data) {
      this.editor.getSession().setValue(data)
    }.bind(this));
  },
  onClose: function(e){
    AppDispatcher.dispatch({
      action:'unselecttool',
      objid:this.state.objid
    });
    this.setState({visible:false,code:null})
  },
  render: function() {
    var fileOpenMenu = (
      <span style={{float:'right'}}>
        <div className="dropdown">
          <button className="btn btn-xs btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            Load
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a onClick={()=>this.loadFile("faces.js")} href="#">Faces</a></li>
            <li><a onClick={()=>this.loadFile("rockpaperscissors.js")} href="#">Rock Paper Scissors</a></li>
            <li><a onClick={()=>this.loadFile("fingerrace.js")} href="#">Finger Race</a></li>
            <li><a onClick={()=>this.loadFile("drums.js")} href="#">Drums</a></li>
          </ul>
        </div>
      </span>
    );
    var closeBtn = (
      <span style={{float:'right'}}>
        <button className="btn btn-xs btn-primary" id="confirm-dialog-button-right" onClick={savelbcode} type="button">Save and Close</button>
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
                  <h4 className="modal-title">
                    Source Code
                    {closeBtn}
                    {fileOpenMenu}
                  </h4>
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
    );;
  }
});
