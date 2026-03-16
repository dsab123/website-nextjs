// import dynamic from 'next/dynamic';
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import SpriteText from 'three-spritetext';

// const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

// type BlogPost = { tags: string[] };
// type Node = {
//   id: string;
//   x?: number; y?: number; z?: number;
//   vx?: number; vy?: number; vz?: number;
//   fx?: number | null; fy?: number | null; fz?: number | null;
// };
// type Link = { source: any; target: any; value: number };

// const WIDTH = 740;
// const HEIGHT = 680;

// function idOf(n: any): string {
//   return typeof n === 'string' ? n : n?.id;
// }
// function linkKey(a: string, b: string) {
//   return a < b ? `${a}|||${b}` : `${b}|||${a}`;
// }

// export default function TagForceGraph3D({ posts }: { posts: BlogPost[] }) {
//   const fgRef = useRef<any>(null);

//   // Avoid SSR/hydration issues
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   // UI state
//   const [labelsOn, setLabelsOn] = useState(true);
//   const [query, setQuery] = useState('');

//   // Hover/highlight state
//   const [hoverNode, setHoverNode] = useState<Node | null>(null);
//   const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
//   const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());

//   // “Jiggle” control
//   const jiggleTimer = useRef<number | null>(null);

//   const graph = useMemo(() => {
//     const edgeCounts = new Map<string, number>();
//     const nodeSet = new Set<string>();

//     for (const p of posts) {
//       const tags = (p.tags ?? []).map(t => t.trim()).filter(Boolean);
//       tags.forEach(t => nodeSet.add(t));

//       for (let i = 0; i < tags.length; i++) {
//         for (let j = i + 1; j < tags.length; j++) {
//           const a = tags[i], b = tags[j];
//           const key = linkKey(a, b);
//           edgeCounts.set(key, (edgeCounts.get(key) ?? 0) + 1);
//         }
//       }
//     }

//     const nodes: Node[] = Array.from(nodeSet).map(id => ({ id }));
//     const links: Link[] = Array.from(edgeCounts.entries()).map(([key, value]) => {
//       const [source, target] = key.split('|||');
//       return { source, target, value };
//     });

//     // adjacency map
//     const neighbors = new Map<string, Set<string>>();
//     for (const n of nodes) neighbors.set(n.id, new Set());

//     for (const l of links) {
//       const a = idOf(l.source);
//       const b = idOf(l.target);
//       neighbors.get(a)?.add(b);
//       neighbors.get(b)?.add(a);
//     }

//     return { nodes, links, neighbors };
//   }, [posts]);

//   // Keyboard shortcut: L toggles labels
//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key.toLowerCase() === 'l') setLabelsOn(v => !v);
//     };
//     window.addEventListener('keydown', onKeyDown);
//     return () => window.removeEventListener('keydown', onKeyDown);
//   }, []);

//   const focusNode = useCallback((node: Node) => {
//     const fg = fgRef.current;
//     if (!fg) return;

//     // Ensure node has coordinates (may be undefined very early)
//     const x = node.x ?? 0;
//     const y = node.y ?? 0;
//     const z = node.z ?? 0;

//     const distance = 160;
//     const distRatio = 1 + distance / Math.hypot(x, y, z);

//     fg.cameraPosition(
//       { x: x * distRatio, y: y * distRatio, z: z * distRatio },
//       node,
//       900
//     );
//   }, []);

//   const stopJiggle = useCallback(() => {
//     if (jiggleTimer.current) {
//       window.clearInterval(jiggleTimer.current);
//       jiggleTimer.current = null;
//     }
//   }, []);

//   const startJiggle = useCallback(() => {
//     if (jiggleTimer.current) return; // already running
//     jiggleTimer.current = window.setInterval(() => {
//       // Give every node a tiny random velocity nudge (the “bounce”)
//       // Keep it subtle or it gets chaotic fast.
//       const nudge = 0.18;

//       for (const n of graph.nodes) {
//         // Don’t nudge pinned nodes
//         const pinned = n.fx != null || n.fy != null || n.fz != null;
//         if (pinned) continue;

//         n.vx = (n.vx ?? 0) + (Math.random() - 0.5) * nudge;
//         n.vy = (n.vy ?? 0) + (Math.random() - 0.5) * nudge;
//         n.vz = (n.vz ?? 0) + (Math.random() - 0.5) * nudge;
//       }

//       // Reheat a bit so the forces keep evolving
//       fgRef.current?.d3ReheatSimulation?.();
//     }, 60); // ~16fps jiggle injections
//   }, [graph.nodes]);

//   const handleHover = useCallback((node: Node | null) => {
//     if (!node) {
//       setHoverNode(null);
//       setHighlightNodes(new Set());
//       setHighlightLinks(new Set());
//       stopJiggle();
//       return;
//     }

//     const id = node.id;
//     const hn = new Set<string>([id]);
//     const hl = new Set<string>();

//     const neigh = graph.neighbors.get(id) ?? new Set<string>();
//     for (const other of neigh) {
//       hn.add(other);
//       hl.add(linkKey(id, other));
//     }

//     setHoverNode(node);
//     setHighlightNodes(hn);
//     setHighlightLinks(hl);

//     // start the bounce/jiggle while hovering any node
//     startJiggle();
//   }, [graph.neighbors, startJiggle, stopJiggle]);

//   const togglePinNode = useCallback((node: any) => {
//     const pinned = node.fx != null || node.fy != null || node.fz != null;
//     if (pinned) {
//       node.fx = null; node.fy = null; node.fz = null;
//     } else {
//       node.fx = node.x; node.fy = node.y; node.fz = node.z;
//     }
//     fgRef.current?.d3ReheatSimulation?.();
//   }, []);

//   const clearAllPins = useCallback(() => {
//     for (const n of graph.nodes) {
//       n.fx = null; n.fy = null; n.fz = null;
//     }
//     fgRef.current?.d3ReheatSimulation?.();
//   }, [graph.nodes]);

//   const findNodeByName = useCallback((name: string) => {
//     const target = name.trim().toLowerCase();
//     if (!target) return null;
//     return graph.nodes.find(n => n.id.toLowerCase() === target) ?? null;
//   }, [graph.nodes]);

//   const handleSearch = useCallback(() => {
//     const n = findNodeByName(query);
//     if (!n) return;
//     focusNode(n);
//   }, [findNodeByName, focusNode, query]);

//   if (!mounted) return null;

//   return (
//     <div style={{ width: WIDTH }}>
//       {/* Controls */}
//       <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
//           placeholder="Search tag (exact match) and press Enter…"
//           style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #333' }}
//         />
//         <button
//           onClick={handleSearch}
//           style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #333' }}
//         >
//           Focus
//         </button>
//         <button
//           onClick={() => setLabelsOn(v => !v)}
//           style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #333' }}
//           title="Toggle labels (L)"
//         >
//           Labels: {labelsOn ? 'On' : 'Off'} (L)
//         </button>
//         <button
//           onClick={() => { handleHover(null); clearAllPins(); }}
//           style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #333' }}
//         >
//           Reset
//         </button>
//       </div>

//       <div style={{ width: WIDTH, height: HEIGHT }}>
//         <ForceGraph3D
//           ref={fgRef}
//           width={WIDTH}
//           height={HEIGHT}
//           graphData={{ nodes: graph.nodes, links: graph.links }}

//           // Physics feel
//           cooldownTicks={220}
//           d3VelocityDecay={0.25}

//           // Labels/tooltip
//           nodeLabel={(n: any) => n.id}

//           // Curved links
//           linkCurvature={0.18}
//           linkCurveRotation={0.0}

//           // Hover highlighting effects (brightness/dimming)
//           nodeColor={(node: any) => {
//             if (highlightNodes.size === 0) return '#cccccc';
//             return highlightNodes.has(node.id) ? '#ffffff' : '#666666';
//           }}
//           linkOpacity={(link: any) => {
//             const a = idOf(link.source);
//             const b = idOf(link.target);
//             const key = linkKey(a, b);
//             if (highlightLinks.size === 0) return 0.25;
//             return highlightLinks.has(key) ? 0.85 : 0.05;
//           }}
//           linkWidth={(link: any) => {
//             const a = idOf(link.source);
//             const b = idOf(link.target);
//             const key = linkKey(a, b);
//             const base = 0.6 + Math.min(5, link.value);
//             return highlightLinks.has(key) ? base * 1.8 : base;
//           }}
//           nodeRelSize={5}

//           // Always-visible labels (SpriteText) + “pop” on hover
//           nodeThreeObject={(node: any) => {
//             if (!labelsOn) return null;

//             const sprite = new SpriteText(node.id);
//             const isHover = hoverNode?.id === node.id;

//             sprite.textHeight = isHover ? 11 : 7; // pop on hover
//             sprite.position.set(0, 8, 0);
//             sprite.material.depthWrite = false;
//             return sprite;
//           }}
//           nodeThreeObjectExtend={true}

//           // Interactions
//           onNodeHover={(node: any) => handleHover(node ?? null)}
//           onNodeClick={(node: any) => {
//             // click toggles pin and focuses camera
//             togglePinNode(node);
//             focusNode(node);
//           }}
//           onNodeDragEnd={(node: any) => {
//             // dragging pins automatically (nice UX)
//             node.fx = node.x;
//             node.fy = node.y;
//             node.fz = node.z;
//             fgRef.current?.d3ReheatSimulation?.();
//           }}
//           onBackgroundClick={() => {
//             handleHover(null);
//             clearAllPins();
//           }}
//         />
//       </div>

//       <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
//         <div><b>Tips:</b> Hover a node to highlight neighbors + jiggle the whole graph. Click to pin/unpin + focus camera. Drag to pin. Press <b>L</b> to toggle labels.</div>
//       </div>
//     </div>
//   );
// }
