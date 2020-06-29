const { createServer } = require('http');

const reamls = {
  test: {
    username: 'admin',
    password: '123456',
  },
};

const server = createServer((req, res) => {
  const authorization = req.headers['authorization'];

  if (authorization) {
    const [username, password] = Buffer.from(
      authorization.split(' ')[1],
      'base64'
    )
      .toString('utf-8')
      .split(':');

    if (
      reamls['test'].username === username ||
      reamls['test'].password === password
    ) {
      res.write('200 hello world');
      res.end();
      return;
    }
  }

  res.writeHead(401, {
    'WWW-Authenticate': `Basic realm="test2"`,
  });
  res.write('401 Authorization Required');
  res.end();
});

server.listen('5000', () => {
  console.log('> listen on http://localhost:5000');
});
