/* global AppDispatcher, React, ReactDOM */

var Face;
Face = React.createClass({
  getInitialState: function () {
    var leds = leds_blank
    if (this.props.isInToolbox) {
      leds = leds_smiley;;
    }
    return {
      leds: leds,
      faces: getFaces()
    };
  },
  itemClick: function (r, c) {
    if (this.state.leds[r][c] == 0) {
      this.state.leds[r][c] = 1;
    } else {
      this.state.leds[r][c] = 0;
    }
    this.setState({led: this.state.leds});
  },
  onClear: function () {
    //$.get( "http://192.168.3.1/api/api.php?cmd=8x8&data=0000000000000000", function( data ) {});
    this.setState({
      leds: leds_blank
    })
  },
  onSave: function () {
    var hs = faceArrayToData(this.state.leds);
    this.setState({faces:storeFace(hs)});
  },
  onLoadSavedFace: function(e) {
    this.setState({leds:faceDataToArray(this.state.faces[e.target.id])});
  },
  onUseSavedFace: function(e) {
    AppDispatcher.dispatch({
      action:'sendface',
      objid:this.props.objid,
      face:this.state.faces[e.target.id]
    })
    $.get("http://192.168.3.1/api/api.php?cmd=8x8&data=" + this.state.faces[e.target.id], function (data) {
    });
  },
  onDeleteSavedFace: function(e) {
    this.setState({faces:deleteFace(e.target.id)})
  },
  render: function () {
    var r = -1;
    var c = -1;
    var ledCol = function (col) {
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
        <div className="lb-led-sm" style={ledStyle} key={c++}></div>
      );
    };
    var ledEditCol = function (col) {
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
        <div className="lb-led-edit" style={ledStyle} key={c++} onClick={this.itemClick.bind(this,r,c)}></div>
      );
    }.bind(this);
    var ledRow = function (row) {
      c = -1;
      return (
        <div className="lb-ledrow" key={r++}>
          {row.map(ledCol)}
        </div>
      );
    };
    var ledEditRow = function (row) {
      c = -1;
      return (
        <div className="lb-ledrow" key={r++}>
          {row.map(ledEditCol)}
        </div>
      );
    };
    var f=-1;
    var selectFace = function (facedata) {
      return (
        <div className="row" key={f++}>
          <div className="col-xs-6">
            {faceDataToArray(facedata).map(ledRow)}
          </div>
          <div className="col-xs-6">
            <button className="btn btn-default btn-xs" id={f} onClick={this.onLoadSavedFace}>Load</button>
            <button className="btn btn-default btn-xs" id={f} onClick={this.onUseSavedFace}>Use</button>
            <button className="btn btn-default btn-xs" id={f} onClick={this.onDeleteSavedFace}>Delete</button>
          </div>
        </div>
      );
    }.bind(this);
    var className = "lb-face";
    if (this.props.isEditing) {
      return (
        <div>
          <h4>Create New Face</h4>
          <div>
            {this.state.leds.map(ledEditRow)}
          </div>
          <button className="btn btn-success" onClick={this.onClear}>Clear</button>
          <button className="btn btn-success" onClick={this.onSave}>Save</button>
          <h4>Saved Faces</h4>
          {this.state.faces.map(selectFace)}
        </div>
      );
    }
    var leds = this.state.leds;
    if (this.props.data && typeof (this.props.data) !== 'undefined') {
      leds = faceDataToArray(this.props.data);
    }
    return (
      <LBComponent toolName="Face" objid={this.props.objid} isInToolbox={this.props.isInToolbox}
                   isEditing={this.props.isEditing}>
        <div className={className}>
          {leds.map(ledRow)}
          <LBDropTarget id={this.props.objid} accepts={["input"]}></LBDropTarget>
        </div>
      </LBComponent>
    );
  }
});
