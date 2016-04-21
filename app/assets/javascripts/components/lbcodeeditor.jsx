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
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().on('change', function () {
      document.getElementById("view").innerText = editor.getSession().getValue();
      console.log(document.getElementById("view").innerText)
    });
    editor.setOptions({
      fontSize: "18pt"
    });
    $.get("/template-lbcontroller.js", function (data) {
      editor.getSession().setValue(data)
    });
  },
  componentWillUnmount: function() {
    AppDispatcher.unregister(this.token)
  },
  onClose: function(e){
    AppDispatcher.dispatch({
      action:'unselecttool',
      objid:this.state.objid
    })
    this.setState({visible:false,code:null})
  },
  render: function() {
    if (this.state.visible) {
      return (
        <div>
          <pre id="editor">
          </pre>
          <pre id="view">
          </pre>
        </div>
      );
    }
    return (
      <div>
        Closed
      </div>
    );;
  }
});
