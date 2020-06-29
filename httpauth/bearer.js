const { createServer } = require('http');

const server = createServer((req, res) => {
  const authorization = req.headers['authorization'];

  res.writeHead(401, {
    'WWW-Authenticate': `Bearer realm="test"`,
  });
  res.write('401 Authorization Required');
  res.end();
});

server.listen('5000', () => {
  console.log('> listen on http://localhost:5000');
});
