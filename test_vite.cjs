(async () => {
  const res = await fetch('http://localhost:8443/src/App.tsx');
  const text = await res.text();
  console.log("File length:", text.length);
  console.log("Includes Forgot Password?", text.includes('Forgot Password'));
  console.log("Includes problems.length?", text.includes('problems.length'));
})();
