document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("EditNodeModal").innerHTML = editNodeModalContent
    document.getElementById("CreateNodeModal").innerHTML = CreateNodeModalContent

    

  });

  const editNodeModalContent = `
  <h2 id="modalTitle">Edit Node</h2>
    <form id="EditNodeForm">
      <div class="row">
        <div class="large-12 columns">
          <label>Node name
            <input type="text" class="inputName" id='RenameNodeName' placeholder="node name" />
          </label>
        </div>
      </div>
      <div class="row">
        <div class="large-12 columns">
          <p>Node color</p>
          <input type="radio" id="color1" name="color" value="1">
          <label for="color1" style="background-color:rgb(200, 200, 200); padding: 4px 12px 4px 12px; border-radius: 4px">basic</label>
          <input type="radio" id="color2" name="color" value="2">
          <label for="color2" style="background-color:rgb(227, 253, 78); padding: 4px 12px 4px 12px; border-radius: 4px" >yellow</label>
          <input type="radio" id="color3" name="color" value="3">
          <label for="color3" style="background-color:rgb(7, 255, 172); padding: 4px 12px 4px 12px; border-radius: 4px">green</label>
          <input type="radio" id="color4"  name="color" value="4">
          <label for="color4" style="background-color:rgb(89, 131, 252); padding: 4px 12px 4px 12px; border-radius: 4px">blue</label>
        </div>
      </div>
      <div class="row">
        <div class="large-8 columns">
          &nbsp;
        </div>
        <div class="large-4 columns">
          <a href="#" class="button info" onclick="close_edit_node_modal()">Cancel</a>
          <a href="#" class="button success" onclick="edit_node()">Save</a>
        </div>
      </div>
    </form>
    <a class="close-reveal-modal" aria-label="Close">&#215;</a>`

    const CreateNodeModalContent = `
    <h2 id="modalTitle">Create Node</h2>
    <form id="CreateNodeForm">
      <div class="row">
        <div class="large-12 columns">
          <label>Node name
            <input type="text" class="inputName" id='CreateNodeName' placeholder="node name" />
          </label>
        </div>
      </div>
      <div class="row">
        <div class="large-12 columns">
          <p>Node color</p>
          <input type="radio" id="color1" name="color" value="1">
          <label for="color1" style="background-color:rgb(200, 200, 200); padding: 4px 12px 4px 12px; border-radius: 4px">basic</label>
          <input type="radio" id="color2" name="color" value="2">
          <label for="color2" style="background-color:rgb(227, 253, 78); padding: 4px 12px 4px 12px; border-radius: 4px" >yellow</label>
          <input type="radio" id="color3" name="color" value="3">
          <label for="color3" style="background-color:rgb(7, 255, 172); padding: 4px 12px 4px 12px; border-radius: 4px">green</label>
          <input type="radio" id="color4"  name="color" value="4">
          <label for="color4" style="background-color:rgb(89, 131, 252); padding: 4px 12px 4px 12px; border-radius: 4px">blue</label>
        </div>
      </div>
      <div class="row">
        <div class="large-8 columns">
          &nbsp;
        </div>
        <div class="large-4 columns">
          <a href="#" class="button info" onclick="close_create_node_modal()">Cancel</a>
          <a href="#" class="button success" onclick="create_node()">Create</a>
        </div>
      </div>
    </form>
    <a class="close-reveal-modal" aria-label="Close">&#215;</a>
    `