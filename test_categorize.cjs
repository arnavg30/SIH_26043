const http = require('http');

const data = JSON.stringify({
  text: "pani nahi aa raha hamara gaon me",
  coordinates: "23.34,85.30"
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 8000,
  path: '/categorize',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});
req.write(data);
req.end();
