/* global AppDispatcher, React, ReactDOM */

var Remote = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    
    var draw_qrcode = function(text, typeNumber, errorCorrectLevel) {
      document.write(create_qrcode(text, typeNumber, errorCorrectLevel) );
    };

    var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {
      var qr = qrcode(typeNumber || 4, errorCorrectLevel || 'M');
      qr.addData(text);
      qr.make();
      return qr.createImgTag(4);
    };

    if (this.props.isEditing) {

      var remoteURL = window.location.protocol + "//" + this.props.siohost + "/#/remote?o=" + this.props.objid;

      return (
        <div>
          <h4>Scan QR Code for Remote</h4>
          <center>
          <a target="_new" href={remoteURL}><img className="qrImage" src={create_qrcode(remoteURL, 5)}/></a>
          </center>
          <button className="btn btn-success" onClick={this.onClear}>Clear</button>
          <button className="btn btn-success" onClick={this.onSave}>Save</button>

        </div>
      );
    }

    if (this.props.data > 0) {
      var selectedStyle = {
        border: 'solid 2px red',
      };
    }

    return (
      <LBComponent toolName="Remote" objid={this.props.objid} isInToolbox={this.props.isInToolbox} isEditing={this.props.isEditing}>
        <div className="lb-remote" style={selectedStyle}>
          <img className="remoteImage" src="/images/remote_control.png" />
          <LBDropTarget id={this.props.objid} accepts={["input"]}></LBDropTarget>
        </div>
    </LBComponent>
    );
  }
});