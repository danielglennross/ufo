import go from "gojs";
import { pick } from "lodash";

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
        logAttr.messageRegex.test(hit._source.message)
      );
    });
    const renderAttr = n.render;

    const meta = (() => {
      if (matchHit) {
        return {
          id: matchHit._id,
          type: matchHit._type,
          index: matchHit._index
        };
      }
      return null;
    })();

    return {
      meta,
      key: renderAttr.key,
      displayName: renderAttr.displayName,
      color: matchHit ? "lightsalmon" : "lightblue",
      fig: renderAttr.fig,
      flowKind: renderAttr.flowKind,
      tooltip: matchHit
        ? JSON.stringify(
            pick(matchHit._source, ["duration", "category", "message"]),
            null,
            2
          )
        : "Event not found"
    };
  });
}

export function buildsGoDiagramFromNodes() {
  const $ = go.GraphObject.make;

  const diagram = $(go.Diagram, {
    layout: $(go.LayeredDigraphLayout),
    "undoManager.isEnabled": true,
    initialScale: 0.65,
    allowHorizontalScroll: true,
    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key"
    })
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
        if (!obj.part.data.meta) {
          return e.event.preventDefault();
        }
        const { index, type, id } = obj.part.data.meta;
        window.open(
          `https://kibana.bedegaming.net/?#/doc/log-bde_qa02-*/${index}/${type}/?id=${id}`
        );
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
        switch (n.data.flowKind) {
          case "success":
            return "green";
          case "failure":
            return "red";
          case "async-success":
            return "green";
          case "async-fail":
            return "red";
          default:
            return "lightblue";
        }
      }).ofObject(),
      new go.Binding("strokeDashArray", "toNode", function(n) {
        switch (n.data.flowKind) {
          case "async-success":
          case "async-fail":
            return [10, 10];
          default:
            return [];
        }
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

  return diagram;
}
