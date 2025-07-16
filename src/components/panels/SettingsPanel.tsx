import React, { useState, useEffect } from 'react';
import type { Node } from '@xyflow/react';
import './SettingsPanel.css';

interface SettingsPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: any) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedNode,
  onNodeUpdate,
  onClose
}) => {
  // Local state for form inputs
  const [text, setText] = useState('');
  const [nodeLabel, setNodeLabel] = useState('');
  const [isValid, setIsValid] = useState(true);

  /**
   * Update local state when selected node changes
   */
  useEffect(() => {
    if (selectedNode && selectedNode.data) {
      setText(String(selectedNode.data.text || ''));
      setNodeLabel(String(selectedNode.data.label || ''));
      validateInput(String(selectedNode.data.text || ''));
    }
  }, [selectedNode]);

  /**
   * Validate input text
   */
  const validateInput = (inputText: string) => {
    const valid = inputText.trim().length > 0 && inputText.length <= 500;
    setIsValid(valid);
    return valid;
  };

  /**
   * Handle text change and update node data
   */
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);

    // Validate input
    const valid = validateInput(newText);

    // Update node data in real-time if valid
    if (selectedNode && valid) {
      onNodeUpdate(selectedNode.id, {
        ...(selectedNode.data as any),
        text: newText
      });
    }
  };

  /**
   * Handle label change
   */
  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = event.target.value;
    setNodeLabel(newLabel);

    if (selectedNode) {
      onNodeUpdate(selectedNode.id, {
        ...(selectedNode.data as any),
        label: newLabel
      });
    }
  };

  /**
   * Reset node to default values
   */
  const handleReset = () => {
    if (selectedNode) {
      const defaultText = 'New message';
      setText(defaultText);
      setNodeLabel('');
      onNodeUpdate(selectedNode.id, {
        ...(selectedNode.data as any),
        text: defaultText,
        label: ''
      });
    }
  };

  /**
   * Get node type info
   */
  const getNodeTypeInfo = () => {
    switch (selectedNode?.type) {
      case 'textMessage':
        return {
          name: 'Message Node',
          icon: '💬',
          color: '#3b82f6',
          description: 'Sends a text message to the user'
        };
      default:
        return {
          name: 'Unknown Node',
          icon: '❓',
          color: '#6b7280',
          description: 'Unknown node type'
        };
    }
  };

  // Return null if no node is selected
  if (!selectedNode) {
    return null;
  }

  const nodeTypeInfo = getNodeTypeInfo();

  return (
    <div className="settings-panel">
      {/* Panel Header */}
      <div className="settings-panel__header">
        <div className="settings-panel__header-content">
          <h3 className="settings-panel__title">Settings Panel</h3>
          <div className="settings-panel__subtitle">
            Configure node properties
          </div>
        </div>

        {/* Header Actions */}
        <div className="settings-panel__actions">
          <button
            onClick={handleReset}
            className="settings-panel__action-btn settings-panel__reset-btn"
            title="Reset to defaults"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 3v5h-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 21v-5h5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={onClose}
            className="settings-panel__action-btn settings-panel__close-btn"
            title="Close settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="settings-panel__content">
        {/* Node Type Badge */}
        <div
          className="settings-panel__badge"
          style={{ backgroundColor: `${nodeTypeInfo.color}20`, color: nodeTypeInfo.color }}
        >
          <span className="settings-panel__badge-icon">{nodeTypeInfo.icon}</span>
          <span className="settings-panel__badge-text">{nodeTypeInfo.name}</span>
        </div>

        {/* Node Info */}
        <div className="settings-panel__node-info">
          <div className="settings-panel__info-item">
            <span className="settings-panel__info-label">Node ID:</span>
            <span className="settings-panel__info-value">{selectedNode.id}</span>
          </div>
          <div className="settings-panel__info-item">
            <span className="settings-panel__info-label">Type:</span>
            <span className="settings-panel__info-value">{selectedNode.type}</span>
          </div>
          <div className="settings-panel__info-description">
            {nodeTypeInfo.description}
          </div>
        </div>

        {/* Form Fields */}
        <div className="settings-panel__form">
          {/* Node Label */}
          <div className="settings-panel__field">
            <label className="settings-panel__label">
              Node Label
              <span className="settings-panel__label-optional">(optional)</span>
            </label>
            <input
              type="text"
              value={nodeLabel}
              onChange={handleLabelChange}
              placeholder="Enter a label for this node..."
              className="settings-panel__input"
            />
            <div className="settings-panel__help">
              A custom label to identify this node in the flow.
            </div>
          </div>

          {/* Text Content */}
          <div className="settings-panel__field">
            <label className="settings-panel__label">
              Message Text
              <span className="settings-panel__label-required">*</span>
            </label>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your message here..."
              className={`settings-panel__textarea ${!isValid ? 'settings-panel__textarea--error' : ''}`}
              maxLength={500}
            />

            {/* Character Count */}
            <div className="settings-panel__char-count">
              <span className={text.length > 450 ? 'settings-panel__char-count--warning' : ''}>
                {text.length}/500 characters
              </span>
            </div>

            {/* Validation Message */}
            {!isValid && (
              <div className="settings-panel__error">
                Message text is required and must be less than 500 characters.
              </div>
            )}

            <div className="settings-panel__help">
              This text will be displayed in the message node and sent to users.
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="settings-panel__preview">
          <h4 className="settings-panel__preview-title">Preview</h4>
          <div className="settings-panel__preview-content">
            <div className="settings-panel__preview-node">
              <div className="settings-panel__preview-header">
                {nodeTypeInfo.icon} Send Message
              </div>
              <div className="settings-panel__preview-text">
                {text || 'Enter your message...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
