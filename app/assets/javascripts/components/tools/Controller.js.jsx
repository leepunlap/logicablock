/* global AppDispatcher, React, ReactDOM */

var Controller = React.createClass({
  getInitialState: function() {
    return {inputs:[
        {n:'i1'},
        {n:'i2'},
        {n:'i3'},
        {n:'i4'},
        {n:'i5'},
        {n:'i6'},
        {n:'i7'},
        {n:'i8'},
      ],
      outputs:[
        {n:'o1'},
        {n:'o2'},
        {n:'o3'},
        {n:'o4'},
      ]
    };
  },
  onEditCode: function() {
    $('#showcode').modal('show');
  },
  render: function() {
    var that = this;
    var objid = this.props.objid;
    var inputConnectorProps = function(i) {
      return(
        <LBDragSource key={i.n} name={i.n} id={objid+"|input|"+i.n}></LBDragSource>
      );
    };
    var outputConnectorProps = function(i) {
      return(
        <LBDragSource key={i.n} name={i.n} id={objid+"|output|"+i.n}></LBDragSource>
      );
    };
    if(this.props.isEditing) {
      var propPage = (
        <div>
          <h4>Inputs</h4>
          {this.state.inputs.map(inputConnectorProps)}
          <h4>Outputs</h4>
          {this.state.outputs.map(outputConnectorProps)}
          <h4>Code</h4>
          <button className="btn btn-default" onClick={this.onEditCode}>Edit</button>
        </div>
      )
    }

    var gamemessage = null;
    if (this.props.conf) {
      if (this.props.conf.action == 'start') {
        gamemessage = (
          <div>
            {this.props.conf.game} Start
          </div>
        )        
      }
      if (this.props.conf.action == 'simonsays' || this.props.conf.action == 'yousay') {
        gamemessage = (
          <div>
            <h3>
              Simon Says <font color="red">{this.props.conf.data}</font>
              <br />
              You Say <font color="green">{this.props.conf.yousay}</font>
            </h3>
          </div>
        )
      }
    }

    return (
      <LBComponent toolName="Controller" objid={this.props.objid} isInToolbox={this.props.isInToolbox} isEditing={this.props.isEditing}>
        <div className="lb-controller">
          <img className="controlImage" src="/images/brain.jpg" />
          {gamemessage}
          {propPage}
        </div>
      </LBComponent>
    );


  }
});