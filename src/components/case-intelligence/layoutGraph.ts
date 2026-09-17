import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";

// Matches .intel-flow-node geometry in globals.css (metric 284px wide, note 238px, map 260px).
const CARD_SIZE = {
  metric: { width: 284, height: 150 },
  note: { width: 238, height: 110 },
  map: { width: 260, height: 210 },
};

export function layoutGraph<NodeType extends Node>(nodes: NodeType[], edges: Edge[]): NodeType[] {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: "LR", ranksep: 160, nodesep: 90, marginx: 40, marginy: 40 });
  graph.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    const variant =
      node.data?.variant === "note" || node.data?.variant === "map" ? node.data.variant : "metric";
    graph.setNode(node.id, { ...CARD_SIZE[variant] });
  }
  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target);
  }

  dagre.layout(graph);

  return nodes.map((node) => {
    const placed = graph.node(node.id);
    return {
      ...node,
      position: { x: placed.x - placed.width / 2, y: placed.y - placed.height / 2 },
    };
  });
}
