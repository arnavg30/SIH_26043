const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const errorBoundaryCode = `
import React from 'react';
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

code = code.replace(/import \{ auth \} from "\.\/firebase\/config";/g, 'import { auth } from "./firebase/config";\n' + errorBoundaryCode);

code = code.replace(/export default function App\(\) \{/g, 'function InnerApp() {');

code += `\n\nexport default function App() { return <ErrorBoundary><InnerApp /></ErrorBoundary>; }\n`;

fs.writeFileSync('src/App.tsx', code);
console.log('Added ErrorBoundary');
