const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n');

function findDiff(obj) {
    if (typeof obj === 'string') {
        if (obj.includes('warning: in the working copy') && obj.includes('@@ -')) {
            return obj;
        }
        return null;
    }
    if (Array.isArray(obj)) {
        for (const item of obj) {
            const res = findDiff(item);
            if (res) return res;
        }
    }
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            const res = findDiff(obj[key]);
            if (res) return res;
        }
    }
    return null;
}

let largestDiff = "";
for (const line of lines) {
  if (!line) continue;
  const obj = JSON.parse(line);
  const diff = findDiff(obj);
  if (diff && diff.length > largestDiff.length) {
      largestDiff = diff;
  }
}
if (largestDiff) {
    // extract just the patch
    let text = largestDiff;
    const startIdx = text.indexOf("warning: in the working copy");
    if (startIdx !== -1) {
        text = text.substring(startIdx);
    }
    const endIdx = text.indexOf("\n\nThe command exited with");
    if (endIdx !== -1) {
        text = text.substring(0, endIdx);
    }
    fs.writeFileSync('app_diff.patch', text);
    console.log('Saved diff! Length: ' + text.length);
} else {
    console.log('Not found');
}
