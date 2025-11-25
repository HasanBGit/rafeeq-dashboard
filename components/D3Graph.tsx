import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { DependencyGraphData, DependencyNode } from '../types';
import { X, ShieldAlert, GitCommit, Layers, Activity } from 'lucide-react';

interface D3GraphProps {
  data: DependencyGraphData;
}

export const D3Graph: React.FC<D3GraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);

  // Helper to get connected nodes for the selected node
  const getConnectedNodes = (nodeId: string) => {
    const targets = data.links
      .filter((l: any) => l.source.id === nodeId)
      .map((l: any) => l.target.id || l.target); // Handle d3 object replacement
    
    const sources = data.links
      .filter((l: any) => l.target.id === nodeId)
      .map((l: any) => l.source.id || l.source);

    return [...new Set([...targets, ...sources])];
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data.nodes.length) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    // Simulation setup
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.size + 10));

    // Define arrow markers for directed edges
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#94a3b8")
      .attr("d", "M0,-5L10,0L0,5");

    // Draw links
    const link = svg.append("g")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d: any) => Math.sqrt(d.value))
      .attr("marker-end", "url(#arrow)");

    // Color scale based on "Group" (Architecture Layer)
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation) as any)
      .on("click", (event, d) => {
        event.stopPropagation(); // Prevent drag/other events interfering
        setSelectedNode(d as DependencyNode);
      });

    // Node circles (Radius based on size/complexity)
    node.append("circle")
      .attr("r", (d: any) => Math.max(8, d.size / 2))
      .attr("fill", (d: any) => {
        // Red for high risk, fallback to group color
        return d.risk > 70 ? "#ef4444" : color(String(d.group));
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2.5)
      .attr("class", "cursor-pointer transition-all duration-200 hover:opacity-80");

    // Node labels
    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 14)
      .attr("y", 4)
      .style("font-size", "11px")
      .style("font-weight", "600")
      .style("font-family", "sans-serif")
      .style("fill", "#1e293b")
      .style("stroke", "none")
      .style("pointer-events", "none")
      .style("text-shadow", "1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white");

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  // Drag behavior definition
  const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative">
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm backdrop-blur-sm z-10 border border-slate-100">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></span>
            <span className="text-xs text-slate-600">High Risk Module</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1f77b4] border border-white shadow-sm"></span>
            <span className="text-xs text-slate-600">UI Component</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff7f0e] border border-white shadow-sm"></span>
            <span className="text-xs text-slate-600">Core Logic</span>
          </div>
        </div>
      </div>

      {/* Selected Node Metrics Card */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-20 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="p-4 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900">{selectedNode.name}</h3>
              <span className="text-xs font-mono text-slate-500">ID: {selectedNode.id}</span>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            
            {/* Risk Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldAlert size={16} />
                <span className="text-sm font-medium">Risk Score</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-sm font-bold ${
                selectedNode.risk > 70 ? 'bg-red-100 text-red-700' : 
                selectedNode.risk > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {selectedNode.risk}/100
              </span>
            </div>

            {/* Complexity / Size */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Activity size={16} />
                <span className="text-sm font-medium">Complexity</span>
              </div>
              <span className="text-sm font-mono text-slate-900">{selectedNode.size} LOC</span>
            </div>

             {/* Layer Group */}
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Layers size={16} />
                <span className="text-sm font-medium">Layer</span>
              </div>
              <span className="text-sm text-slate-900">
                {selectedNode.group === 1 ? 'Presentation (UI)' : 
                 selectedNode.group === 2 ? 'Application Logic' : 
                 selectedNode.group === 3 ? 'Data / Infra' : 'Utilities'}
              </span>
            </div>

            {/* Connected Files */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <GitCommit size={14} />
                <span className="text-xs font-semibold uppercase">Connected Modules</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {getConnectedNodes(selectedNode.id).map(nodeId => (
                  <span key={nodeId} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                    {nodeId}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};