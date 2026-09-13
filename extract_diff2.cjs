const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n');
for (const line of lines) {
  if (!line) continue;
  const obj = JSON.parse(line);
  
  if (obj.content && obj.content.includes('git diff src/App.tsx')) {
     // Usually output is in a subsequent step, or it's a SYSTEM tool response
  }
  
  if (obj.source === 'SYSTEM' && obj.content && obj.content.includes('@@ -')) {
     if (obj.content.includes('warning: in the working copy')) {
         const match = obj.content.match(/warning: in the working copy[\s\S]*/);
         if (match) {
             let diff = match[0];
             // clean up system message wrappers
             diff = diff.replace(/^The command exited with code 0\.\nOutput:\n/, '');
             fs.writeFileSync('app_diff.patch', diff);
             console.log('Saved diff to app_diff.patch, length: ' + diff.length);
             return;
         }
     }
  }
}
console.log('Not found');
