const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLogic = `
          // Step 0: Transcription
          if (audioFile && !textToAnalyze) {
            setStep(0);
            const formData = new FormData();
            formData.append("file", audioFile);
            formData.append("language", "hindi"); 
            const res = await fetch("http://localhost:8000/transcribe", { method: "POST", body: formData });
            const data = await res.json();
            if (data.transcription && typeof data.transcription === "string") {
              textToAnalyze = data.transcription;
              if (active) setReport(current => ({ ...current, description: textToAnalyze }));
            }
          }
`;

const newLogic = `
          // Step 0: Transcription
          if (audioFile && !textToAnalyze) {
            setStep(0);
            const formData = new FormData();
            formData.append("file", audioFile);
            formData.append("language", "hindi"); 
            const res = await fetch("http://localhost:8000/transcribe", { method: "POST", body: formData });
            const data = await res.json();
            if (data.transcription && typeof data.transcription === "string") {
              if (data.transcription.startsWith("Error:")) {
                 if (active) setErrorMsg(data.transcription + " Please try again.");
                 return;
              }
              textToAnalyze = data.transcription;
              if (active) setReport(current => ({ ...current, description: textToAnalyze }));
            } else {
              if (active) setErrorMsg("Transcription failed (invalid response). Please try again.");
              return;
            }
          }
`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed transcription error handling');
