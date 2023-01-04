let data = {}

export default (req, res) => {
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
}