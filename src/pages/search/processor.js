import go from "gojs";

export function buildNodesFromLogHits(token, nodes, hits) {
  const matchingLogHits = hits.filter(
    h => (h._source.correlationtoken || "") === token
  );
  if (!matchingLogHits) {
    return {
      result: "error",
      message: "no matching log entries found"
    };
  }

  return nodes.map(n => {
    const logAttr = n.log;
    const matchHit = hits.find(hit => {
      return (
        hit._source.level === logAttr.level &&
        hit._type === logAttr.type &&
        new RegExp(logAttr.messageRegex).test(hit._source.message)
      );
    });
    const renderAttr = n.render;
    return {
      key: renderAttr.key,
      displayName: renderAttr.displayName,
      color: matchHit ? "lightsalmon" : "lightblue",
      fig: "RoundedRectangle",
      flowKind: renderAttr.flowKind,
      tooltip: matchHit ? JSON.stringify(matchHit._source) : "no-log-found"
    };
  });
}

export function buildsGoDiagramFromNodes() {
  const $ = go.GraphObject.make;

  const diagram = $(go.Diagram, {
    layout: $(go.LayeredDigraphLayout),
    "undoManager.isEnabled": true
  });

  // diagram.toolTip = $(
  //   "ToolTip",
  //   $(
  //     go.TextBlock,
  //     { margin: 4 },
  //     // use a converter to display information about the diagram model
  //     new go.Binding("text", "", () => "hello World")
  //   )
  // );

  diagram.nodeTemplate = $(
    go.Node,
    go.Panel.Auto,
    { locationSpot: go.Spot.Center },
    {
      cursor: "pointer",
      click: function(e, obj) {
        //window.open("http://" + encodeURIComponent(obj.part.data.url));
      }
    },
    $(
      go.Shape,
      "RoundedRectangle",
      { strokeWidth: 2 },
      new go.Binding("figure", "fig"),
      new go.Binding("fill", "color")
    ),
    $(
      go.TextBlock,
      {
        margin: 10
      },
      new go.Binding("text", "displayName")
    ),
    {
      // define a tooltip for each node that displays the color as text
      toolTip: $(
        "ToolTip",
        $(go.TextBlock, { margin: 4 }, new go.Binding("text", "tooltip"))
      )
    }
  );

  diagram.linkTemplate = $(
    go.Link,
    { routing: go.Link.AvoidsNodes, curve: go.Link.JumpOver },
    $(
      go.Shape,
      {
        //strokeWidth: 2
      },
      new go.Binding("stroke", "toNode", function(n) {
        return n.data.flowKind === "success" ? "green" : "red";
      }).ofObject(),
      new go.Binding("strokeWidth", "toNode", function(n) {
        return n.data.flowKind === "success" ? 3 : 1;
      }).ofObject()
    ),
    $(
      go.Shape,
      { toArrow: "Standard", stroke: null },
      new go.Binding("fill", "color")
    )
  );

  //diagram.model.nodeDataArray = nodes;
  //diagram.model.linkDataArray = edges;

  return diagram;
}
