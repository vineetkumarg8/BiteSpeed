import React from 'react';
import './NodesPanel.css';

interface NodesPanelProps {
  onAddNode: (type: string) => void;
}

// Define available node types for extensibility
const nodeTypes = [
  {
    id: 'textMessage',
    name: 'Message',
    description: 'Send a text message',
    icon: '💬',
    color: '#3b82f6',
    category: 'Communication'
  },
  // Future node types can be easily added here
  // {
  //   id: 'email',
  //   name: 'Email',
  //   description: 'Send an email',
  //   icon: '📧',
  //   color: '#10b981',
  //   category: 'Communication'
  // },
  // {
  //   id: 'delay',
  //   name: 'Delay',
  //   description: 'Add a time delay',
  //   icon: '⏱️',
  //   color: '#f59e0b',
  //   category: 'Logic'
  // }
];

const NodesPanel: React.FC<NodesPanelProps> = ({ onAddNode }) => {
  /**
   * Handle adding a new node
   */
  const handleAddNode = (nodeType: string) => {
    onAddNode(nodeType);
  };

  return (
    <div className="nodes-panel">
      {/* Panel Header */}
      <div className="nodes-panel__header">
        <h3 className="nodes-panel__title">Nodes Panel</h3>
        <div className="nodes-panel__subtitle">
          Drag and drop to add nodes
        </div>
      </div>

      {/* Nodes List */}
      <div className="nodes-panel__content">
        {/* Search Bar */}
        <div className="nodes-panel__search">
          <input
            type="text"
            placeholder="Search nodes..."
            className="nodes-panel__search-input"
          />
        </div>

        {/* Node Categories */}
        <div className="nodes-panel__category">
          <h4 className="nodes-panel__category-title">Communication</h4>

          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.id}
              className="nodes-panel__item"
              onClick={() => handleAddNode(nodeType.id)}
              title={`Add ${nodeType.name} node`}
            >
              {/* Node Icon */}
              <div
                className="nodes-panel__icon"
                style={{ backgroundColor: `${nodeType.color}20`, color: nodeType.color }}
              >
                <span className="nodes-panel__icon-emoji">{nodeType.icon}</span>
              </div>

              {/* Node Info */}
              <div className="nodes-panel__info">
                <div className="nodes-panel__name">{nodeType.name}</div>
                <div className="nodes-panel__description">{nodeType.description}</div>
              </div>

              {/* Add Button */}
              <div className="nodes-panel__add-btn">+</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Help Text */}
      <div className="nodes-panel__footer">
        <p className="nodes-panel__help-text">
          Click on a node type above to add it to your flow
        </p>
        <div className="nodes-panel__stats">
          {nodeTypes.length} node type{nodeTypes.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
};

export default NodesPanel;
