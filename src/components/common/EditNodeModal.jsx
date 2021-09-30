import React, { useState, useEffect } from "react";


export default function EditNodeModal() {

  const wrapEditNode = () => {
    window.edit_node()
  }

  return (
      
    <div id="EditNodeModal" className="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">
       <h2 id="modalTitle">Edit Node</h2>
       <form id="EditNodeForm">

       <div className="row">
        <div className="large-12 columns">
          <label>Node name
            <input type="text" className="inputName" id='RenameNodeName' placeholder="node name" ></input>
          </label>
        </div>
      </div>
      <div className="row">
        <div className="large-12 columns">
          <p>Node color</p>
          <input type="radio" id="color1" name="color" value="1"></input>
          <label htmlFor ="color1" style={{backgroundColor:'rgb(200, 200, 200)', padding: '4px 12px 4px 12px', borderRadius: '4px'}}>basic</label>
          <input type="radio" id="color2" name="color" value="2"></input>
          <label htmlFor ="color2" style={{backgroundColor:'rgb(227, 253, 78)', padding: '4px 12px 4px 12px', borderRadius: '4px'}} >yellow</label>
          <input type="radio" id="color3" name="color" value="3"></input>
          <label htmlFor ="color3" style={{backgroundColor:'rgb(7, 255, 172)', padding: '4px 12px 4px 12px', borderRadius: '4px'}}>green</label>
          <input type="radio" id="color4"  name="color" value="4"></input>
          <label htmlFor ="color4" style={{backgroundColor:'rgb(89, 131, 252)', padding: '4px 12px 4px 12px', borderRadius: '4px'}}>blue</label>
        </div>
      </div>
      <div className="row">
        <div className="large-8 columns">s
          &nbsp;
        </div>
        <div className="large-4 columns">
          <a href="#" className="button info" onClick={()=>window.close_edit_node_modal()}>Cancel</a>
          <a href="#" className="button success" onClick={wrapEditNode}>Save</a>
        </div>
      </div>
       </form>
       <a className="close-reveal-modal" aria-label="Close">&#215;</a>
    </div>
  );
        
}