import fs from 'fs'
import path from 'path'

export default async function handler (req, res) {

    if (req.method === 'POST') {
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
                })

            fs.writeFileSync(path.join(__dirname,'../tmp/data.json'), body)

            res.end(JSON.stringify({status: 'success'}))
            })
    } 
    else if(req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Transfer-Encoding': 'chunked',
        })

        let data = JSON.parse(fs.readFileSync(path.join(__dirname,'../tmp/data.json')).toString())     

        res.end(JSON.stringify(data))
    }
}