const http = require('http');
const fs = require('fs');
const { url } = require('inspector');
const { URL } = require('url');

const hostname = 'localhost';
const port = 3000;

const type = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'json': 'text/json',
    'webmanifest': 'text/manifest'
}

const server = http.createServer((req, res) => {

    const urlString = req.url
    const reqURL = new URL('https://localhost:3000' + urlString)
    const path = reqURL.pathname

    const pass = path.match(/(?<=\.)html|css|js|png|json|webmanifest$/)

    if (!fs.existsSync(__dirname + path) && !fs.existsSync(__dirname + path + '.html')) {
        res.statusCode = 404
        res.end('404')
    }
    else if (pass) {
        res.setHeader('Content-Type', type[pass[0]]);
        fs.readFile(__dirname + req.url, (err, data) => {
            if (err) console.error(err)
            else {
                res.statusCode = 200
                res.end(data)
            }
        })
    }
    else if (req.url === '/'){
        fs.readFile(__dirname + '/index.html', function (err, data) {
            if (err) console.error(err)
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(data)
            }
        });
      }
    else {
        fs.readFile(__dirname + `${path}.html`, function (err, data) {
            if (err) console.error(err)
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(data)
            }
        });
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});