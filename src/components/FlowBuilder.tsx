import React, { useState, useCallback } from 'react';
import {
  ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge,
  ReactFlowProvider, Background, Controls, MiniMap
} from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './FlowBuilder.css';

import TextMessageNode from './nodes/TextMessageNode';
import NodesPanel from './panels/NodesPanel';
import SettingsPanel from './panels/SettingsPanel';

const nodeTypes = { textMessage: TextMessageNode };

const initialNodes: Node[] = [
  { id: '1', type: 'textMessage', position: { x: 100, y: 100 }, data: { text: 'test message 1' } },
  { id: '2', type: 'textMessage', position: { x: 300, y: 200 }, data: { text: 'test message 2' } },
  { id: '3', type: 'textMessage', position: { x: 500, y: 300 }, data: { text: 'textNode' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'default' },
];

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showError, setShowError] = useState(false);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    const selectChange = changes.find(change => change.type === 'select');
    if (selectChange && 'selected' in selectChange) {
      if (selectChange.selected) {
        const selectedNodeData = nodes.find(node => node.id === selectChange.id);
        setSelectedNode(selectedNodeData || null);
      } else {
        setSelectedNode(null);
      }
    }
  }, [nodes]);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params: Connection) => {
    const existingSourceEdge = edges.find(edge => edge.source === params.source);
    if (existingSourceEdge) {
      setEdges((eds) => eds.filter(edge => edge.source !== params.source));
    }
    setEdges((eds) => addEdge(params, eds));
  }, [edges]);

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'textMessage',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { text: 'New message' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, []);

  const handleSave = useCallback(() => {
    if (nodes.length > 1) {
      const targetNodeIds = new Set(edges.map(edge => edge.target));
      const nodesWithEmptyTargets = nodes.filter(node => !targetNodeIds.has(node.id));
      if (nodesWithEmptyTargets.length > 1) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
    }
    const flowData = { nodes, edges, timestamp: new Date().toISOString() };
    localStorage.setItem('flowBuilder', JSON.stringify(flowData));
    alert('Flow saved successfully!');
  }, [nodes, edges]);

  const closeSettings = useCallback(() => {
    setSelectedNode(null);
    setNodes((nds) => nds.map(node => ({ ...node, selected: false })));
  }, []);

  return (
    <div className="flow-builder">
      <div className="flow-builder__toolbar">
        <h1 className="flow-builder__title">Flow Builder</h1>
        {showError && (
          <div className="flow-builder__error">Cannot save Flow</div>
        )}
        <button onClick={handleSave} className="flow-builder__save-button">
          Save Changes
        </button>
      </div>

      <div className="flow-builder__content">
        <div className="flow-builder__canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        <div className="flow-builder__sidebar">
          {selectedNode ? (
            <SettingsPanel
              selectedNode={selectedNode}
              onNodeUpdate={updateNodeData}
              onClose={closeSettings}
            />
          ) : (
            <NodesPanel onAddNode={addNode} />
          )}
        </div>
      </div>
    </div>
  );
};

const FlowBuilderWithProvider: React.FC = () => (
  <ReactFlowProvider>
    <FlowBuilder />
  </ReactFlowProvider>
);

export default FlowBuilderWithProvider;
