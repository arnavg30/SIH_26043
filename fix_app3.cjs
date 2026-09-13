const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The file has a broken import:
// import {
//
// import React from 'react';
// class ErrorBoundary ...

code = code.replace(/import \{\r?\n\r?\nimport React from 'react';/, "import React from 'react';");
code = code.replace(/import \{\n\nimport React from 'react';/, "import React from 'react';");

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed broken import');
