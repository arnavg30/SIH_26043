const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n');
for (const line of lines) {
  if (!line) continue;
  const obj = JSON.parse(line);
  if (obj.tool_calls) {
    for (const res of obj.tool_calls) {
      if (res.call.function === 'run_command' && res.call.arguments && res.call.arguments.CommandLine && res.call.arguments.CommandLine.includes('git diff src/App.tsx')) {
        if (res.response && res.response.output) {
          fs.writeFileSync('app_diff.patch', res.response.output);
          console.log('Saved diff to app_diff.patch, length: ' + res.response.output.length);
          return;
        }
      }
    }
  }
}
console.log('Not found');
