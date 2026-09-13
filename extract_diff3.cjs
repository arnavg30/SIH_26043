const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n');
for (const line of lines) {
  if (!line) continue;
  const obj = JSON.parse(line);
  if (obj.tool_responses) {
      for (const res of obj.tool_responses) {
          if (res.response && res.response.output && res.response.output.includes('@@ -')) {
              fs.writeFileSync('app_diff.patch', res.response.output);
              console.log('Found in tool_responses! Length: ' + res.response.output.length);
              return;
          }
      }
  }
}
console.log('Not found');
