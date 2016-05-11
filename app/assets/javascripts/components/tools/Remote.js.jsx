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
      return qr.createImgTag();
    };

    if (this.props.isEditing) {

      var remoteURL = this.props.siohost + "?o=" + this.props.objid;

      return (
        <div>
          <h4>Scan QR Code for Remote</h4>
          <a target="_new" href={remoteURL}><img className="qrImage" src={create_qrcode(remoteURL, 5)}/></a>
          <input class="input" />
          <input class="input" />

          <button className="btn btn-success" onClick={this.onClear}>Clear</button>
          <button className="btn btn-success" onClick={this.onSave}>Save</button>

        </div>
      );
    }

    return (
      <LBComponent toolName="Remote" objid={this.props.objid} isInToolbox={this.props.isInToolbox} isEditing={this.props.isEditing}>
        <div className="lb-remote">
          <img className="remoteImage" src="/images/remote_control.png" />
          <LBDropTarget id={this.props.objid} accepts={["input"]}></LBDropTarget>
        </div>
    </LBComponent>
    );
  }
});