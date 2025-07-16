import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Handle, Position } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import './components/FlowBuilder.css';
import './components/nodes/TextMessageNode.css';

// Custom Text Message Node (using CSS classes)
const TextMessageNode = ({ data, selected }: any) => {
  return (
    <div className={`text-message-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="text-message-node__handle" />

      <div className="text-message-node__header">
        <svg className="text-message-node__icon" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
        </svg>
        Send Message
      </div>

      <div className={`text-message-node__content ${!data.text ? 'text-message-node__content--empty' : ''}`}>
        {data.text || 'Click to edit message'}
      </div>

      <Handle type="source" position={Position.Bottom} className="text-message-node__handle" />
    </div>
  );
};

// Node types
const nodeTypes = {
  textMessage: TextMessageNode,
};

// Test with custom nodes
const initialNodes: Node[] = [
  { id: '1', type: 'textMessage', position: { x: 100, y: 100 }, data: { text: 'test message 1' } },
  { id: '2', type: 'textMessage', position: { x: 300, y: 200 }, data: { text: 'test message 2' } },
  { id: '3', type: 'textMessage', position: { x: 500, y: 300 }, data: { text: 'textNode' } },
];
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

function App() {
  console.log('App component rendering with React Flow');

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showError, setShowError] = useState(false);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));

      // Handle node selection
      const selectChange = changes.find(change => change.type === 'select');
      if (selectChange && 'selected' in selectChange) {
        if (selectChange.selected) {
          const selectedNodeData = nodes.find(node => node.id === selectChange.id);
          setSelectedNode(selectedNodeData || null);
        } else {
          setSelectedNode(null);
        }
      }
    },
    [nodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  // Save function with validation
  const handleSave = () => {
    // Validation: More than one node AND more than one node has empty target handles
    if (nodes.length > 1) {
      const targetNodeIds = new Set(edges.map(edge => edge.target));
      const nodesWithEmptyTargets = nodes.filter(node => !targetNodeIds.has(node.id));

      if (nodesWithEmptyTargets.length > 1) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
    }

    // Save to localStorage
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('flowBuilder', JSON.stringify(flowData));
    alert('Flow saved successfully!');
  };

  return (
    <div className="flow-builder">
      {/* Top Toolbar */}
      <div className="flow-builder__toolbar">
        <h1 className="flow-builder__title">Flow Builder</h1>

        {/* Error Message */}
        {showError && (
          <div className="flow-builder__error">
            Cannot save Flow
          </div>
        )}

        <button onClick={handleSave} className="flow-builder__save-button">
          Save Changes
        </button>
      </div>

      {/* Main Content */}
      <div className="flow-builder__content">
        {/* Debug info */}
        <div className="flow-builder__debug">
          Nodes: {nodes.length}, Selected: {selectedNode?.id || 'none'}
        </div>

        {/* React Flow Canvas */}
        <div className="flow-builder__canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          />
        </div>

        {/* Right Sidebar */}
        <div className="flow-builder__sidebar">
          {selectedNode ? (
            // Settings Panel
            <div className="panel">
              <div className="settings-panel__header">
                <h3 className="panel__title">Settings Panel</h3>
                <button
                  className="settings-panel__close"
                  onClick={() => {
                    setSelectedNode(null);
                    setNodes((nds: any) => nds.map((node: any) => ({ ...node, selected: false })));
                  }}
                >
                  ←
                </button>
              </div>

              <div className="panel__content">
                <div className="settings-panel__badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
                  </svg>
                  Message Node
                </div>

                <div className="settings-panel__node-info">
                  <strong>Selected Node:</strong> {(selectedNode as any)?.id}
                </div>

                <div className="settings-panel__field">
                  <label className="settings-panel__label">Text</label>
                  <textarea
                    className="settings-panel__textarea"
                    value={(selectedNode as any)?.data?.text || ''}
                    onChange={(e) => {
                      const nodeId = (selectedNode as any).id;
                      // Update node text
                      setNodes((nds: any) =>
                        nds.map((node: any) =>
                          node.id === nodeId
                            ? { ...node, data: { ...node.data, text: e.target.value } }
                            : node
                        )
                      );
                      // Update selected node
                      setSelectedNode({
                        ...(selectedNode as any),
                        data: { ...(selectedNode as any).data, text: e.target.value }
                      });
                    }}
                    placeholder="Enter your message here..."
                  />
                  <div className="settings-panel__help">
                    This text will be displayed in the message node.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Nodes Panel
            <div className="panel">
              <div className="panel__header">
                <h3 className="panel__title">Nodes Panel</h3>
              </div>

              <div className="panel__content">
                <div
                  className="nodes-panel__item"
                  onClick={() => {
                    const newNode = {
                      id: `node_${Date.now()}`,
                      type: 'textMessage',
                      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
                      data: { text: 'New message' },
                    };
                    setNodes((nds: any) => [...nds, newNode]);
                  }}
                >
                  <div className="nodes-panel__icon">💬</div>
                  <div className="nodes-panel__info">
                    <div className="nodes-panel__name">Message</div>
                    <div className="nodes-panel__description">Send a text message</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
