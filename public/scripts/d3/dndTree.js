function close_modal() {
  $(document).foundation("reveal", "close");
}

var tree_root;
var create_node_modal_active = false;
var edit_node_modal_active = false;
var create_node_parent = null;
var node_to_edit = null;
var rectNode = { width: 120, height: 45, textMargin: 5 };

function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function create_node() {
  if (create_node_parent && create_node_modal_active) {
    if (create_node_parent._children != null) {
      create_node_parent.children = create_node_parent._children;
      create_node_parent._children = null;
    }
    if (create_node_parent.children == null) {
      create_node_parent.children = [];
    }
    id = generateUUID();
    name = $("#CreateNodeName").val();
    type = document.querySelector('input[name="color"]:checked').value;
    new_node = {
      name: name,
      type: type,
      id: id,
      depth: create_node_parent.depth + 1,
      children: [],
      _children: null,
    };
    console.log("Create Node name: " + name);
    console.log(type);
    create_node_parent.children.push(new_node);
    create_node_modal_active = false;
    $("#CreateNodeName").val("");
  }
  close_modal();
  outer_update(create_node_parent);
}

function edit_node() {
  if (node_to_edit && edit_node_modal_active) {
    name = $("#RenameNodeName").val();
    type = document.querySelector('input[name="color"]:checked').value;
    console.log("New Node name: " + name);
    node_to_edit.name = name;
    node_to_edit.type = type;
    edit_node_modal_active = false;
    $("#RenameNodeName").val("");
    $("input[name=color]").attr("checked", false);
  }
  close_modal();
  outer_update(root);
}

// outer_update = null;

function draw_tree(error, treeData) {
  // console.log(treeData);

  // Calculate total nodes, max label length
  var totalNodes = 0;
  var maxLabelLength = 0;
  // variables for drag/drop
  var selectedNode = null;
  var draggingNode = null;
  // panning variables
  var panSpeed = 200;
  var panBoundary = 40; // Within 20px from edges will pan when dragging.
  // Misc. variables
  var i = 0;
  var duration = 750;
  var root;

  // size of the diagram
  var viewerWidth = $(document).width();
  var viewerHeight = $(document).height();

  var tree = d3.layout.tree().size([viewerHeight, viewerWidth]);

  //   // define a d3 diagonal projection for use by the node paths later on.
  //   var diagonal = d3.svg.diagonal().projection(function (d) {
  //     return [d.y, d.x];
  //   });

  var menu = [
    {
      title: "Edit node",
      action: function (elm, d, i) {
        console.log("Edit node");
        $("#RenameNodeName").val(d.name);
        var radios = document.querySelector('#EditNodeModal').querySelectorAll('input[name="color"]');
        for (var i = 0; i < radios.length; i++) {if (radios[i].value == d.type) {radios[i].checked = true}}
        edit_node_modal_active = true;
        node_to_edit = d;
        $("#EditNodeName").focus();
        $("#EditNodeModal").foundation("reveal", "open");
      },
    },
    {
      title: "Delete node",
      action: function (elm, d, i) {
        console.log("Delete node");
        delete_node(d);
      },
    },
    {
      title: "Create child node",
      action: function (elm, d, i) {
        console.log("Create child node");
        create_node_parent = d;
        create_node_modal_active = true;
        $("#CreateNodeModal").foundation("reveal", "open");
        $("#CreateNodeName").focus();
      },
    },
  ];

  // A recursive helper function for performing some setup by walking through all nodes

  function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        visit(children[i], visitFn, childrenFn);
      }
    }
  }

  // Call visit function to establish maxLabelLength
  visit(
    treeData,
    function (d) {
      totalNodes++;
      maxLabelLength = Math.max(d.name.length, maxLabelLength);
    },
    function (d) {
      return d.children && d.children.length > 0 ? d.children : null;
    }
  );

  function delete_node(node) {
    visit(
      treeData,
      function (d) {
        if (d.children) {
          for (var child of d.children) {
            if (child == node) {
              d.children = _.without(d.children, child);
              update(root);
              break;
            }
          }
        }
      },
      function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
      }
    );
  }

  // sort the tree according to the node names

  function sortTree() {
    tree.sort(function (a, b) {
      return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
  }
  // Sort the tree initially incase the JSON isn't in a sorted order.
  sortTree();

  // TODO: Pan function, can be better implemented.

  function pan(domNode, direction) {
    var speed = panSpeed;
    if (panTimer) {
      clearTimeout(panTimer);
      translateCoords = d3.transform(svgGroup.attr("transform"));
      if (direction == "left" || direction == "right") {
        translateX =
          direction == "left"
            ? translateCoords.translate[0] + speed
            : translateCoords.translate[0] - speed;
        translateY = translateCoords.translate[1];
      } else if (direction == "up" || direction == "down") {
        translateX = translateCoords.translate[0];
        translateY =
          direction == "up"
            ? translateCoords.translate[1] + speed
            : translateCoords.translate[1] - speed;
      }
      scaleX = translateCoords.scale[0];
      scaleY = translateCoords.scale[1];
      scale = zoomListener.scale();
      svgGroup
        .transition()
        .attr(
          "transform",
          "translate(" + translateX + "," + translateY + ")scale(" + scale + ")"
        );
      d3.select(domNode)
        .select("g.node")
        .attr("transform", "translate(" + translateX + "," + translateY + ")");
      zoomListener.scale(zoomListener.scale());
      zoomListener.translate([translateX, translateY]);
      panTimer = setTimeout(function () {
        pan(domNode, speed, direction);
      }, 50);
    }
  }

  // Define the zoom function for the zoomable tree

  function zoom() {
    svgGroup.attr(
      "transform",
      "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
    );
  }

  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  function initiateDrag(d, domNode) {
    draggingNode = d;
    d3.select(domNode).select(".ghostCircle").attr("pointer-events", "none");
    d3.selectAll(".ghostCircle").attr("class", "ghostCircle show");
    d3.select(domNode).attr("class", "node activeDrag");

    svgGroup.selectAll("g.node").sort(function (a, b) {
      // select the parent and sort the path's
      if (a.id != draggingNode.id) return 1;
      // a is not the hovered element, send "a" to the back
      else return -1; // a is the hovered element, bring "a" to the front
    });
    // if nodes has children, remove the links and nodes
    if (nodes.length > 1) {
      // remove link paths
      links = tree.links(nodes);
      nodePaths = svgGroup
        .selectAll("path.link")
        .data(links, function (d) {
          return d.target.id;
        })
        .remove();
      // remove child nodes
      nodesExit = svgGroup
        .selectAll("g.node")
        .data(nodes, function (d) {
          return d.id;
        })
        .filter(function (d, i) {
          if (d.id == draggingNode.id) {
            return false;
          }
          return true;
        })
        .remove();
    }

    // remove parent link
    parentLink = tree.links(tree.nodes(draggingNode.parent));
    svgGroup
      .selectAll("path.link")
      .filter(function (d, i) {
        if (d.target.id == draggingNode.id) {
          return true;
        }
        return false;
      })
      .remove();

    dragStarted = null;
  }

  // define the baseSvg, attaching a class for styling and the zoomListener
  var baseSvg = d3
    .select("#tree-container")
    .append("svg")
    .attr("width", viewerWidth)
    .attr("height", viewerHeight);

  baseSvg
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#f5f5f2");

  baseSvg.call(zoomListener);

  // Define the drag listeners for drag/drop behaviour of nodes.
  dragListener = d3.behavior
    .drag()
    .on("dragstart", function (d) {
      if (d == root) {
        return;
      }
      dragStarted = true;
      nodes = tree.nodes(d);
      d3.event.sourceEvent.stopPropagation();
      // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
    })
    .on("drag", function (d) {
      if (d == root) {
        return;
      }
      if (dragStarted) {
        domNode = this;
        initiateDrag(d, domNode);
      }

      // get coords of mouseEvent relative to svg container to allow for panning
      relCoords = d3.mouse($("svg").get(0));
      if (relCoords[0] < panBoundary) {
        panTimer = true;
        pan(this, "left");
      } else if (relCoords[0] > $("svg").width() - panBoundary) {
        panTimer = true;
        pan(this, "right");
      } else if (relCoords[1] < panBoundary) {
        panTimer = true;
        pan(this, "up");
      } else if (relCoords[1] > $("svg").height() - panBoundary) {
        panTimer = true;
        pan(this, "down");
      } else {
        try {
          clearTimeout(panTimer);
        } catch (e) {}
      }

      d.x0 += d3.event.dy;
      d.y0 += d3.event.dx;
      var node = d3.select(this);
      node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
      updateTempConnector();
    })
    .on("dragend", function (d) {
      if (d == root) {
        return;
      }
      domNode = this;
      if (selectedNode) {
        // now remove the element from the parent, and insert it into the new elements children
        var index = draggingNode.parent.children.indexOf(draggingNode);
        if (index > -1) {
          draggingNode.parent.children.splice(index, 1);
        }
        if (
          typeof selectedNode.children !== "undefined" ||
          typeof selectedNode._children !== "undefined"
        ) {
          if (typeof selectedNode.children !== "undefined") {
            selectedNode.children.push(draggingNode);
          } else {
            selectedNode._children.push(draggingNode);
          }
        } else {
          selectedNode.children = [];
          selectedNode.children.push(draggingNode);
        }
        // Make sure that the node being added to is expanded so user can see added node is correctly moved
        expand(selectedNode);
        sortTree();
        endDrag();
      } else {
        endDrag();
      }
    });

  function endDrag() {
    selectedNode = null;
    d3.selectAll(".ghostCircle").attr("class", "ghostCircle");
    d3.select(domNode).attr("class", "node");
    // now restore the mouseover event or we won't be able to drag a 2nd time
    d3.select(domNode).select(".ghostCircle").attr("pointer-events", "");
    updateTempConnector();
    if (draggingNode !== null) {
      update(root);
      centerNode(draggingNode);
      draggingNode = null;
    }
  }

  // Helper functions for collapsing and expanding nodes.

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function expand(d) {
    if (d._children) {
      d.children = d._children;
      d.children.forEach(expand);
      d._children = null;
    }
  }

  var overCircle = function (d) {
    selectedNode = d;
    updateTempConnector();
  };
  var outCircle = function (d) {
    selectedNode = null;
    updateTempConnector();
  };

  // color a node properly
  function colorNode(d) {
    const colorBasic = "rgb(200, 200, 200)";
    const colorBasicLight = "rgb(240, 240, 240)";
    const colorPrimary = "rgb(227, 253, 78)";
    const colorPrimaryLight = "rgb(237, 253, 143)";
    const colorSecondary = "rgb(7, 255, 172)";
    const colorSecondaryLight = "rgb(161, 253, 222)";
    const colorTertialy = "rgb(89, 131, 252)";
    const colorTertialyLight = "rgb(165, 187, 253)";
    result = "#fff";
    if (d.synthetic == true) {
      result = d._children || d.children ? "darkgray" : "lightgray";
    } else {
      if (d.type == "1") {
        result = d._children || d.children ? colorBasic : colorBasicLight;
      } else if (d.type == "2") {
        result = d._children || d.children ? colorPrimary : colorPrimaryLight;
      } else if (d.type == "3") {
        result =
          d._children || d.children ? colorSecondary : colorSecondaryLight;
      } else if (d.type == "4") {
        result = d._children || d.children ? colorTertialy : colorTertialyLight;
      } else {
        result = "rgb(251, 252, 170)";
      }
    }
    return result;
  }

  // Function to update the temporary connector indicating dragging affiliation
  var updateTempConnector = function () {
    var data = [];
    if (draggingNode !== null && selectedNode !== null) {
      // have to flip the source coordinates since we did this for the existing connectors on the original tree
      data = [
        {
          source: {
            x: selectedNode.y0,
            y: selectedNode.x0,
          },
          target: {
            x: draggingNode.y0,
            y: draggingNode.x0,
          },
        },
      ];
    }
    var link = svgGroup.selectAll(".templink").data(data);

    link
      .enter()
      .append("path")
      .attr("class", "templink")
      .attr("d", d3.svg.diagonal())
      .attr("pointer-events", "none");

    link.attr("d", d3.svg.diagonal());

    link.exit().remove();
  };

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

  function centerNode(source) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + viewerWidth / 4;
    y = y * scale + viewerHeight / 2;
    d3.select("g")
      .transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }

  // Toggle children function

  function toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  }

  // Toggle children on click.

  function click(d) {
    if (d3.event.defaultPrevented) return; // click suppressed
    d = toggleChildren(d);
    update(d);
    centerNode(d);
  }

  function update(source) {
    console.log(source);
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [1];
    var childCount = function (level, n) {
      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function (d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
    tree = tree.size([newHeight, viewerWidth]);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Check if two nodes are in collision on the ordinates axe and move them
    var rectNode = { width: 120, height: 45, textMargin: 5 };
    breadthFirstTraversal(tree.nodes(root), collision);
    // Normalize for fixed-depth
    nodes.forEach(function (d) {
      d.y = d.depth * (rectNode.width * 2.5);
    });

    // // Set widths between levels based on maxLabelLength.
    // nodes.forEach(function (d) {
    //   //d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
    //   // alternatively to keep a fixed scale one can set a fixed depth per level
    //   // Normalize for fixed-depth by commenting out below line
    //   d.y = d.depth * 300; //500px per level.
    // });

    // Update the nodes…
    node = svgGroup.selectAll("g.node").data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    // Update the nodes…
    node = svgGroup.selectAll("g.node").data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append("g")
      .call(dragListener)
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click);

    var rectNode = { width: 120, height: 45, textMargin: 5 };

    nodeEnter
      .append("g")
      .append("rect")
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("width", rectNode.width)
      .attr("height", rectNode.height)
      .attr("class", "nodeCircle")
      .style("fill", colorNode)
      .attr("filter", "url(#drop-shadow)");

    nodeEnter
      .append("foreignObject")
      .attr("x", rectNode.textMargin)
      .attr("y", rectNode.textMargin)
      .attr("width", function () {
        return rectNode.width - rectNode.textMargin * 2 < 0
          ? 0
          : rectNode.width - rectNode.textMargin * 2;
      })
      .attr("height", function () {
        return rectNode.height - rectNode.textMargin * 2 < 0
          ? 0
          : rectNode.height - rectNode.textMargin * 2;
      })
      .append("xhtml")
      .html(function (d) {
        return (
          '<div style="width: ' +
          (rectNode.width - rectNode.textMargin * 2) +
          "px; height: " +
          (rectNode.height - rectNode.textMargin * 2) +
          'px;" class="node-text wordwrap">' +
          d.name +
          "</div>"
        );
      });

    // phantom node to give us mouseover in a radius around it
    nodeEnter
      .append("circle")
      .attr("class", "ghostCircle")
      .attr("r", 40)
      .attr("opacity", 0.2) // change this to zero to hide the target area
      .style("fill", "rgb(89, 131, 252)")
      .attr("pointer-events", "mouseover")
      .on("mouseover", function (node) {
        overCircle(node);
      })
      .on("mouseout", function (node) {
        outCircle(node);
      });

    // Update the text to reflect whether node has children or not.
    node
      .select("text")
      .attr("x", function (d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.name;
      });

    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle").attr("r", 4.5).style("fill", colorNode);

    // Add a context menu
    node.on("contextmenu", d3.contextMenu(menu));

    // Transition nodes to their new position.
    var nodeUpdate = node
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Fade the text in
    nodeUpdate.select("text").style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle").attr("r", 0);

    nodeExit.select("text").style("fill-opacity", 0);

    // Update the links…
    var link = svgGroup.selectAll("path.link").data(links, function (d) {
      return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {
        var o = {
          x: source.x0,
          y: source.y0,
        };
        return diagonal({
          source: o,
          target: o,
        });
      });

    // Transition links to their new position.
    link.transition().duration(duration).attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        var o = {
          x: source.x,
          y: source.y,
        };
        return diagonal({
          source: o,
          target: o,
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  outer_update = update;

  // Append a group which holds all nodes and which the zoom Listener can act upon.
  var svgGroup = baseSvg.append("g");

  // Define the root
  root = treeData;
  root.x0 = viewerHeight / 2;
  root.y0 = 0;

  // Layout the tree initially and center on the root node.
  defs = baseSvg.append("defs");
  initDropShadow();
  initGradient();
  update(root);
  centerNode(root);
  tree_root = root;
}

// document
//   .getElementById("submit")
//   .addEventListener("click", () => updateChartInDb(tree_root));

// Breadth-first traversal of the tree
// func function is processed on every node of a same level
// return the max level
function breadthFirstTraversal(tree, func) {
  var max = 0;
  if (tree && tree.length > 0) {
    var currentDepth = tree[0].depth;
    var fifo = [];
    var currentLevel = [];

    fifo.push(tree[0]);
    while (fifo.length > 0) {
      var node = fifo.shift();
      if (node.depth > currentDepth) {
        func(currentLevel);
        currentDepth++;
        max = Math.max(max, currentLevel.length);
        currentLevel = [];
      }
      currentLevel.push(node);
      if (node.children) {
        for (var j = 0; j < node.children.length; j++) {
          fifo.push(node.children[j]);
        }
      }
    }
    func(currentLevel);
    return Math.max(max, currentLevel.length);
  }
  return 0;
}

// x = ordoninates and y = abscissas
function collision(siblings) {
  var minPadding = 5;
  if (siblings) {
    for (var i = 0; i < siblings.length - 1; i++) {
      if (siblings[i + 1].x - (siblings[i].x + rectNode.height) < minPadding)
        siblings[i + 1].x = siblings[i].x + rectNode.height + minPadding;
    }
  }
}

function diagonal(d) {
  var p0 = {
      x: d.source.x + rectNode.height / 2,
      y: d.source.y + rectNode.width,
    },
    p3 = {
      x: d.target.x + rectNode.height / 2,
      y: d.target.y,
    },
    m = (p0.y + p3.y) / 2,
    p = [
      p0,
      {
        x: p0.x,
        y: m,
      },
      {
        x: p3.x,
        y: m,
      },
      p3,
    ];
  p = p.map(function (d) {
    return [d.y, d.x];
  });

  return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
}

function initDropShadow() {
  var filter = defs
    .append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%")
    .attr("color-interpolation-filters", "sRGB");

  filter
    .append("feOffset")
    .attr("result", "offOut")
    .attr("in", "SourceGraphic")
    .attr("dx", 0)
    .attr("dy", 0);

  filter
    .append("feGaussianBlur")
    .attr("stdDeviation", 1)
    .attr("in", "SourceAlpha")
    .attr("result", "blur");

  filter
    .append("feOffset")
    .attr("dx", 0)
    .attr("dy", 0.5)
    .attr("in", "blur")
    .attr("result", "offsetBlur");

  filter
    .append("feComposite")
    .attr("in", "offOut")
    .attr("in2", "shadow")
    .attr("operator", "over");

  filter.append("feBlend").attr("in2", "blurOut").attr("mode", "normal");

  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("type", "linear")
    .attr("slope", 0.5);
}

function initGradient() {
  var gradient = defs
    .append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "100%");

  gradient
    .append("stop")
    .attr("class", "start")
    .attr("offset", "0%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 1);

  gradient
    .append("stop")
    .attr("class", "end")
    .attr("offset", "100%")
    .attr("stop-color", "blue")
    .attr("stop-opacity", 1);
}
