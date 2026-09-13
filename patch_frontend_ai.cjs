const fs = require('fs');
let code = fs.readFileSync('src/api.ts', 'utf8');

const apiFuncs = `
export async function transcribeAudio(audioFile: File) {
  const formData = new FormData();
  formData.append("audio", audioFile);
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch("/api/transcribe", {
    method: "POST",
    headers: { Authorization: \`Bearer \${token}\` },
    body: formData
  });
  if (!res.ok) throw new Error("Transcription failed");
  return res.json();
}

export async function findSimilarIdeas(ideas?: {text: string, location: string}[]) {
  return apiFetch("/api/problems/find-similar-ideas", {
    method: "POST",
    body: JSON.stringify({ ideas })
  });
}
`;

code += apiFuncs;
fs.writeFileSync('src/api.ts', code);
console.log('Added missing endpoints to api.ts');
