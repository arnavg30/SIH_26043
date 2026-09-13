const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import React from 'react';\r?\nclass ErrorBoundary extends React\.Component \{[\s\S]*?return this\.props\.children;\r?\n  \}\r?\n\}\r?\n/g, '');

code = code.replace(/syncAuth, getProfileMe,/g, 'import {\n  syncAuth, getProfileMe,');

const eb = `import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: 'red', color: 'white', minHeight: '100vh', zIndex: 999999, position: 'relative' }}>
          <h2>React Render Error</h2>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

// Now insert eb AFTER the api import!
code = code.replace(/} from "\.\/api";/g, '} from "./api";\n\n' + eb);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed imports properly');
