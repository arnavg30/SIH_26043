const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const resetScript = `
<script>
  if (!sessionStorage.getItem("has_reset_once")) {
    localStorage.removeItem("jsic_screen");
    localStorage.removeItem("jsic_role");
    sessionStorage.setItem("has_reset_once", "true");
    console.log("Reset local storage for this session.");
  }
</script>
`;

if (!html.includes('has_reset_once')) {
  html = html.replace('</head>', resetScript + '</head>');
  fs.writeFileSync('index.html', html);
  console.log('Injected reset script into index.html');
}
