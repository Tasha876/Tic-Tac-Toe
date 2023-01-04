const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return
    try {
         await navigator.serviceWorker.register('worker.js',{
            scope: '/'
        })
    }

    catch (err) {
        console.log('registration failed', err)
    }
}

registerServiceWorker()

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

const bitArrayToJSON = async (s) => {
    if (s.locked === true) return
    return s.getReader().read()
    .then((data) => {
        const {value, done} = data
        if (done) return
        return JSON.parse(new TextDecoder().decode(value.subarray()))
    })
}


self.addEventListener('fetch', async (e)=>{
    const selfId = e.clientId
    if (!e.request.method === 'POST' || !e.request.body) return
    const clients = await self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
    })
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i]
        if (client.id === selfId) continue
        const board = await bitArrayToJSON(e.request.body)
        console.log(board, clients, client)
        client.postMessage({
                turn: board.isX
        })
    }
})