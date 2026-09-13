const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const errScript = `
<script>
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    document.body.innerHTML += '<div style="position:fixed;top:0;left:0;width:100%;background:red;color:white;z-index:999999;padding:20px;font-family:monospace;"><b>Global Error:</b><br>' + msg + '<br>Line: ' + lineNo + '<br>Url: ' + url + '<br>' + (error && error.stack ? error.stack.replace(/\\n/g, '<br>') : '') + '</div>';
    return false;
  };
  window.addEventListener('unhandledrejection', function(event) {
    document.body.innerHTML += '<div style="position:fixed;top:0;left:0;width:100%;background:red;color:white;z-index:999999;padding:20px;font-family:monospace;"><b>Unhandled Promise Rejection:</b><br>' + (event.reason && event.reason.stack ? event.reason.stack.replace(/\\n/g, '<br>') : event.reason) + '</div>';
  });
</script>
`;

if (!html.includes('window.onerror')) {
  html = html.replace('<head>', '<head>' + errScript);
  fs.writeFileSync('index.html', html);
  console.log('Injected global error handler into index.html');
}
