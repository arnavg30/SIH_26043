const fetch = require("node-fetch");
const fs = require('fs');
const FormData = require('form-data');

(async () => {
  try {
    // 1. Test Transcribe
    // Create a dummy audio file
    fs.writeFileSync('dummy.wav', 'dummy audio content');
    
    // We can't hit /api/transcribe easily without a token, so we'll hit the AI service directly first 
    // to verify the AI service endpoint exists.
    
    const form = new FormData();
    form.append('file', fs.createReadStream('dummy.wav'));
    
    console.log("Testing AI Service /transcribe...");
    const r1 = await fetch("http://127.0.0.1:8000/transcribe", { method: "POST", body: form });
    console.log("AI /transcribe status:", r1.status);
    
    // 2. Test Find Similar Ideas
    console.log("Testing AI Service /find-similar-ideas...");
    const r2 = await fetch("http://127.0.0.1:8000/find-similar-ideas", { 
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ ideas: [{text: "Water leakage", location: "Delhi"}] })
    });
    console.log("AI /find-similar-ideas status:", r2.status);
    
  } catch(e) {
    console.error(e);
  }
})();
