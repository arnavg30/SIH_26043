(async () => {
  try {
    const payload = {
      description: "Water logging in main street",
      latitude: 23.3441,
      longitude: 85.3096,
      category: "Water",
      user_id: "test_user_duplicate"
    };
    console.log("Submitting 1st complaint...");
    let res1 = await fetch('http://localhost:5000/api/problems', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    console.log(await res1.json());

    console.log("Submitting 2nd complaint (should be duplicate)...");
    let res2 = await fetch('http://localhost:5000/api/problems', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    console.log(await res2.json());
  } catch (err) {
    console.log(err.message);
  }
})();
