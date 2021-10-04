import React, { useState, useEffect } from "react";

export default function CreateNodeModal() {
  useEffect(() => addClick(), []);

  function addClick() {
    document
      .getElementById("createNode")
      .addEventListener("click", function () {
        window.create_node();
      });
  }
  return (
    <div
      id='CreateNodeModal'
      className='reveal-modal'
      data-reveal
      aria-labelledby='modalTitle'
      aria-hidden='true'
      role='dialog'>
      <h2 id='modalTitle'>Create Node</h2>
      <form id='CreateNodeForm'>
        <div className='row'>
          <div className='large-12 columns'>
            <label>Node name</label>
            <input
              type='text'
              className='inputName'
              id='CreateNodeName'
              placeholder='node name'></input>
          </div>
        </div>
        <div className='row'>
          <div className='large-12 columns'>
            <p style={{
                fontSize: "0.875rem",
                color: "#4d4d4d",
                marginBottom: "0",
              }}>Node color</p>
            <input type='radio' id='color1' name='color' value='1'></input>
            <label
              for='color1'
              style={{
                backgroundColor: "rgb(200, 200, 200)",
                padding: "4px 12px 4px 12px",
                borderRadius: "4px",
              }}>
              basic
            </label>
            <input type='radio' id='color2' name='color' value='2'></input>
            <label
              for='color2'
              style={{
                backgroundColor: "rgb(227, 253, 78)",
                padding: "4px 12px 4px 12px",
                borderRadius: "4px",
              }}>
              yellow
            </label>
            <input type='radio' id='color3' name='color' value='3'></input>
            <label
              for='color3'
              style={{
                backgroundColor: "rgb(7, 255, 172)",
                padding: "4px 12px 4px 12px",
                borderRadius: "4px",
              }}>
              green
            </label>
            <input type='radio' id='color4' name='color' value='4'></input>
            <label
              for='color4'
              style={{
                backgroundColor: "rgb(89, 131, 252)",
                padding: "4px 12px 4px 12px",
                borderRadius: "4px",
              }}>
              blue
            </label>
          </div>
        </div>
        <div className='row'>
          <div className='large-8 columns'>&nbsp;</div>
          <div className='large-4 columns'>
            <a
              href='#'
              className='button info close-reveal-modal'
             >
              Cancel
            </a>
            <a href='#' id='createNode' className='button success'>
              Create
            </a>
          </div>
        </div>
      </form>
      <a className='close-reveal-modal' aria-label='Close' style={{ fontSize: "1.5rem" }}>
        &#215;
      </a>
    </div>
  );
}
