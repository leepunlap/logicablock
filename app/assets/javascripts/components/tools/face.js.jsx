/* global AppDispatcher, React, ReactDOM */

var Face = React.createClass({
  getInitialState: function() {
    return {leds:[
      [0,0,0,0,0,0,0,0],
      [0,1,1,0,0,1,1,0],
      [0,1,1,0,0,1,1,0],
      [0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,1],
      [0,1,0,0,0,0,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0],
      ]};
  },
  onClear: function() {
    console.log("Clear");

    $.get( "http://192.168.3.1/api/api.php?cmd=8x8&data=0000000000000000", function( data ) {});
  },
  onSend: function() {
    console.log("Send");
    var hs = ""
    var data = this.state.leds.map(function(row) {
      var b = 0x00;
      for (var i in row) {
        var v = row[i];
        b = b << 1;
        b += v;
        console.log("i:" + v + ", b:" + b);
      }
      var h = b.toString(16)
      hs = hs + ("00" + h).slice(-2);
      console.log(hs)
    })
    $.get( "http://192.168.3.1/api/api.php?cmd=8x8&data="+hs, function( data ) {});
  },
  render: function() {
    var id=0;
      
    var ledCol = function(col) {
      
      if (col > 0) {
        var ledStyle = {
          backgroundColor:'red',
          border: '1px solid red'
        };
      } else {
        var ledStyle = {
          border:'solid 1px #ddd',
          backgroundColor:'#fff',
          boxShadow:'1px 1px 1px #ddd'
        };
      }      

      return(
        <div className="lb-led" style={ledStyle} key={id++}></div>
      );
    }
    var ledRow = function(row) {
      return(
        <div className="lb-ledrow" key={id++}>
        {row.map(ledCol)}
        </div>
      );
    }

    var className="lb-face";
    
    if(this.props.isEditing) {
      var className="lb-face-edit";
      var propPage = (
        <div>
          <button className="btn btn-success" onClick={this.onClear}>Clear</button>
          <button className="btn btn-success" onClick={this.onSend}>Send</button>
        </div>
      )
    }
    
    return (
      <LBComponent toolName="Face" objid={this.props.objid} isInToolbox={this.props.isInToolbox} isEditing={this.props.isEditing}>
        <div className={className}>
          {this.state.leds.map(ledRow)}
          {propPage}
        </div>
      </LBComponent>
    );
  }
});
