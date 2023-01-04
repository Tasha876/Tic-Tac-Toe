const http = require('http');
const fs = require('fs');
const { URL } = require('url');

const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;

const type = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'json': 'text/json',
    'webmanifest': 'text/manifest'
}

let data = {}

const server = http.createServer((req, res) => {

    const urlString = req.url
    const reqURL = new URL(`https://${hostname}:${port}` + urlString)
    const path = reqURL.pathname

    const pass = path.match(/(?<=\.)html|css|js|png|json|ico$/)

    if(req.method === 'GET' && req.url == '/api') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Transfer-Encoding': 'chunked',
            'enable-underscores-in-headers': "true",

        })
        res.end(JSON.stringify(data))
    }
    else if (req.url == '/api' && req.method === 'POST') {
            let body = ''
            req.on('error',(err)=> {
                    console.log('error',err)
                })
            req.on('data', (chunk)=>{
                if (req.method === 'POST') {
                    body += chunk
                }
            })
            
            req.on('end',()=>{
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Transfer-Encoding': 'chunked',
                        'enable-underscores-in-headers': "true",
                        'Connection': 'keep-alive',
                })
                data = JSON.parse(body)
                res.end(JSON.stringify({status: 'success'}))

            })
    } 

    else if (req.url === '/api') {
        console.log('get')
        const makeRequest = ()=> {
            console.log('get2')
            return new Promise((resolve, reject)=>{
                console.log('get3')
                const req = http.request({
                    hostname: '0.0.0.0',
                    port: 8080,
                    path: '/api',
                    method: 'POST'
                }, (resp = req) => {
                    body = []
                    resp.on('data', (chunk)=> {
                        console.log('get4')
                        body.push(chunk)
                    })
                    resp.on('end',()=> {
                        console.log('get5')
                        try {
                            body = JSON.parse(Buffer.concat(body).toString())
                            console.log(body)
                        } catch (err) {
                            console.log(err)
                            reject(err)
                        }
                        resolve(body)
                    })
                }) 
                req.on('error',(err)=> {
                    reject(err.message)
                })
                req.end()
            })
        }
        makeRequest()
        .then((data)=> {
            res.writeHead(200,{ 
                'Content-Type': 'application/json',
                'Transfer-Encoding': 'chunked',
                'enable-underscores-in-headers': "true",
                'Connection': 'keep-alive',
            })
            res.end(JSON.stringify(data))
        })
    }

    else if (!fs.existsSync(__dirname + path) && !fs.existsSync(__dirname + path + '.html')) {
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
        fs.readFile(__dirname + '/index.html', (err, data) => {
            if (err) console.error(err)
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(data)
            }
        });
      }
    else {
        fs.readFile(__dirname + `${path}.html`, (err, data) => {
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