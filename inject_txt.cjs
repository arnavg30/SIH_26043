const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const uniText = fs.readFileSync('uni_dash.txt', 'utf8');
const indText = fs.readFileSync('ind_dash.txt', 'utf8');

function replaceScreen(screenName, newCode, codeText) {
    const startIdx = codeText.indexOf(`function ${screenName}(`);
    if (startIdx === -1) {
        console.error("Could not find " + screenName);
        return codeText;
    }
    let endIdx = codeText.indexOf('function ', startIdx + 10);
    if (endIdx === -1) endIdx = codeText.length;
    
    return codeText.substring(0, startIdx) + newCode + "\n\n" + codeText.substring(endIdx);
}

code = replaceScreen('UniDashboardScreen', uniText, code);
code = replaceScreen('IndustryDashboardScreen', indText, code);

fs.writeFileSync('src/App.tsx', code);
console.log('Injected text files');
