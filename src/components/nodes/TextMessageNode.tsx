import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import './TextMessageNode.css';

// Define the data structure for the text message node
// Using Record<string, unknown> to satisfy React Flow's constraint
type TextMessageNodeData = {
  text: string;
} & Record<string, unknown>;

// Define the complete node type that extends the base Node type
export type TextMessageNode = Node<TextMessageNodeData, 'textMessage'>;

const TextMessageNode: React.FC<NodeProps<TextMessageNode>> = ({
  data,
  selected
}) => {
  return (
    <div className={`text-message-node ${selected ? 'selected' : ''}`}>
      {/* Target Handle - Top (allows multiple incoming connections) */}
      <Handle
        type="target"
        position={Position.Top}
        className="text-message-node__handle"
      />

      {/* Node Header - Green background with icon */}
      <div className="text-message-node__header">
        {/* Message Icon */}
        <svg className="text-message-node__icon" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
            fill="currentColor"
          />
        </svg>
        Send Message
      </div>

      {/* Node Content - Message text */}
      <div className={`text-message-node__content ${!data.text ? 'text-message-node__content--empty' : ''}`}>
        {data.text || 'Click to edit message'}
      </div>

      {/* Source Handle - Bottom (allows one outgoing connection) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="text-message-node__handle"
      />
    </div>
  );
};

export default TextMessageNode;
