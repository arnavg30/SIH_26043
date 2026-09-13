const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Inject import transcribeAudio
if (!code.includes('transcribeAudio')) {
  code = code.replace('submitSolutionAI, markSolved', 'submitSolutionAI, markSolved, transcribeAudio');
}

let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function ReportStep1Screen(')) {
    // Inject state for transcribing
    for(let j=i; j<i+30; j++) {
       if (lines[j] && lines[j].includes('const [isCameraOpen, setIsCameraOpen] = useState(false);')) {
           lines.splice(j+1, 0, '    const [isTranscribing, setIsTranscribing] = useState(false);');
           break;
       }
    }
    
    // Inject transcribe button next to the audio player
    for(let j=i; j<i+200; j++) {
       if (lines[j] && lines[j].includes('<audio src={report.previews[idx]} controls className="h-8" />')) {
           lines.splice(j+1, 0, `                  <Btn variant="secondary" size="sm" className="ml-2 py-1 px-2 text-[10px]" disabled={isTranscribing} onClick={async () => {
                    setIsTranscribing(true);
                    try {
                      const data = await transcribeAudio(file);
                      if (data.text) setDesc(desc ? desc + " " + data.text : data.text);
                    } catch(e) { console.error(e); }
                    setIsTranscribing(false);
                  }}>
                    {isTranscribing ? "Wait..." : "Transcribe"}
                  </Btn>`);
           break;
       }
    }
    break;
  }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Added Transcribe button');
