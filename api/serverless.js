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
}