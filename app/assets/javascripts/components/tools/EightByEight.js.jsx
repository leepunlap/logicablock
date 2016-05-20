/* global AppDispatcher, React, ReactDOM */

var EightByEight = React.createClass({
  getInitialState: function() {
    return {leds:faceDataToArray("0000000000000000")};
  },
  onSaved: function(e) {
    var ipaddr = $("#lb_ipaddress")[0].value;
    AppDispatcher.dispatch({
      action:'sendconfig',
      objid:this.props.objid,
      config:{
        ipaddr:ipaddr
      }
    })
  },
  render: function() {
    var r = -1;
    var c = -1;
    var ledCol = function(col) {

      if (col > 0) {
        var ledStyle = {
          backgroundColor: 'red',
          border: '1px solid red'
        };
      } else {
        var ledStyle = {
          border: 'solid 1px #ddd',
          backgroundColor: '#fff',
          boxShadow: '1px 1px 1px #ddd'
        };
      }
      return (
        <div className="lb-led" style={ledStyle} key={c++}></div>
      );
    }
    var ledRow = function(row) {
      c = -1;
      return(
        <div className="lb-ledrow" key={r++}>
          {row.map(ledCol)}
        </div>
      );
    };
    var leds = this.state.leds;
    if (this.props.data && typeof (this.props.data) !== 'undefined') {
      leds = faceDataToArray(this.props.data);
    }

    if (this.props.isEditing) {
      var ip = this.props.conf ? this.props.conf.ipaddr : ""
      $("#lb_ipaddress").val(ip);
      return (
        <div>
          <div>
            {leds.map(ledRow)}
          </div>
          <h4>IP Address</h4>
          <input id="lb_ipaddress" onChange={this.onTextChange} type="text" className="form-control" placeholder="IP Address" defaultValue={ip} />
          <button className="btn btn-default btn-xs" onClick={this.onSaved}>Save</button>
        </div>
      );
    }
    return (
      <LBComponent toolName="8x8 Display" objid={this.props.objid} conf={this.props.conf} data={this.props.data} isInToolbox={this.props.isInToolbox} isEditing={this.props.isEditing}>
        <div className="lb-ledarray">
          {leds.map(ledRow)}
          <span className="ledLabelStyle">{this.props.conf ? this.props.conf.ipaddr : ""}</span>
          <LBDropTarget id={this.props.objid} accepts={["output"]}></LBDropTarget>
        </div>
      </LBComponent>
    );
  }
});