const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  console.log(new Date(), 'Requset reached', req.url);
  if (req.url.startsWith('/index.js')) {
    res.setHeader('Content-Type', 'application/javascript');

    /** Vary */
    // res.setHeader('Vary', '*');

    /** cache-control */
    res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Pragma', 'no-cache');
    // res.write(fs.readFileSync('index.js'));

    /** Last-Modified */
    const mtime = fs.statSync('index.js').mtime.toUTCString();
    res.setHeader('Last-Modified', mtime);
    if (req.headers['if-modified-since'] === mtime) {
      res.statusCode = 304;
    } else {
      res.write(fs.readFileSync('index.js'));
    }

    /** Etag */
    // const hash = 'aaaaaaaaaaaaaa';
    // res.setHeader('Etag', hash);
    // if (req.headers['if-none-match'] === hash) {
    //   res.statusCode = 304;
    // } else {
    //   res.write(fs.readFileSync('index.js'));
    // }
    
  } else if (req.url === '/') {
    res.write(fs.readFileSync('index.html'));
  } else {
    res.statusCode = 404;
  }

  res.end();
});

server.listen('8088', () => {
  console.log('Listen on http://localhost:8088');
});
