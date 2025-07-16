# Flow Builder

A powerful and extensible flow builder application built with React, TypeScript, and React Flow. This application allows users to create, edit, and manage message flows with an intuitive drag-and-drop interface.

## Features

### Core Functionality
- **Text Message Nodes**: Create and edit text message nodes with custom content
- **Drag & Drop**: Intuitive drag-and-drop interface for adding nodes to the canvas
- **Node Connections**: Connect nodes with edges following specific rules:
  - Source handles can only have **one outgoing edge**
  - Target handles can accept **multiple incoming edges**
- **Settings Panel**: Edit selected nodes with a dedicated settings panel
- **Save/Load**: Persist flows to localStorage with validation
- **Auto-save**: Automatic saving every 30 seconds

### User Experience
- **Keyboard Shortcuts**:
  - `Ctrl+S`: Save flow
  - `Ctrl+L`: Load saved flow
  - `Ctrl+Delete`: Clear entire flow
  - `Delete`: Delete selected node
  - `Escape`: Deselect nodes
- **Validation**: Comprehensive validation for nodes, edges, and flow integrity
- **Error Handling**: Robust error handling with user-friendly messages
- **Responsive Design**: Works on desktop and tablet devices

### Technical Features
- **Extensible Architecture**: Easy to add new node types
- **TypeScript**: Full type safety throughout the application
- **React Flow Integration**: Built on top of the powerful React Flow library
- **Modern React**: Uses hooks and functional components
- **CSS Modules**: Scoped styling for components

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Flow
1. **Add Nodes**: Drag the "Message" node from the Nodes Panel to the canvas
2. **Edit Content**: Click on a node to select it and edit its text in the Settings Panel
3. **Connect Nodes**: Drag from a source handle (bottom of node) to a target handle (top of node)
4. **Save**: Click "Save Changes" or use `Ctrl+S` to save your flow

### Node Types
Currently supported node types:
- **Text Message**: Send a text message with customizable content

### Connection Rules
- Each source handle can only connect to **one** target
- Each target handle can accept **multiple** connections
- Self-connections are not allowed
- Duplicate connections are prevented

## Architecture

### Project Structure
```
src/
├── components/
│   ├── FlowBuilder.tsx          # Main flow builder component
│   ├── nodes/
│   │   └── TextMessageNode.tsx  # Text message node component
│   └── panels/
│       ├── NodesPanel.tsx       # Sidebar for available nodes
│       └── SettingsPanel.tsx    # Settings panel for editing nodes
├── types/
│   └── index.ts                 # TypeScript type definitions
├── utils/
│   └── validation.ts            # Validation utilities
└── styles/                      # CSS files
```

### Key Components

#### FlowBuilder
The main component that orchestrates the entire flow building experience. Handles:
- Node and edge state management
- Drag and drop functionality
- Validation and saving
- Keyboard shortcuts

#### TextMessageNode
A custom React Flow node component for text messages. Features:
- Editable text content
- Visual styling matching the design
- Proper handle positioning

#### NodesPanel
Extensible sidebar panel that displays available node types for dragging.

#### SettingsPanel
Context-sensitive panel that appears when a node is selected, allowing property editing.

### Extensibility

Adding new node types is straightforward:

1. **Define the node type** in `src/types/index.ts`:
```typescript
export enum NodeTypes {
  TEXT_MESSAGE = 'textMessage',
  EMAIL = 'email', // New node type
}
```

2. **Create the node component** in `src/components/nodes/`:
```typescript
const EmailNode: React.FC<NodeProps<EmailNodeData>> = ({ data }) => {
  // Component implementation
};
```

3. **Register the node type** in `FlowBuilder.tsx`:
```typescript
const nodeTypes = {
  [NodeTypes.TEXT_MESSAGE]: TextMessageNode,
  [NodeTypes.EMAIL]: EmailNode, // Register new node
};
```

4. **Add to NodesPanel** in `src/components/panels/NodesPanel.tsx`

## Validation

The application includes comprehensive validation:
- **Node validation**: Ensures nodes have required properties and valid data
- **Edge validation**: Validates connections and prevents invalid relationships
- **Flow validation**: Checks overall flow integrity and connectivity
- **Save validation**: Validates before saving to prevent corrupted data

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Acknowledgments

- Built with [React Flow](https://reactflow.dev/)
- Styled with modern CSS
- TypeScript for type safety
- Vite for fast development
