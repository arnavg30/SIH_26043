const axios = require('axios');
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
    let res1 = await axios.post('http://localhost:5000/api/problems', payload);
    console.log(res1.data);

    console.log("Submitting 2nd complaint (should be duplicate)...");
    let res2 = await axios.post('http://localhost:5000/api/problems', payload);
    console.log(res2.data);
  } catch (err) {
    console.log(err.response ? err.response.data : err.message);
  }
})();
