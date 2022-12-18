// const http = require('http')
// function get(){

// const socket = new WebSocket('ws://0.0.0.0:443')

// socket.onopen(()=>{
//    socket.send('I\'m open!!!!!')
// })

// }
// export {get}

console.log('there')

export default () => {
        fetch('ws://0.0.0.0:443')
            .then(res=>console.log(res))
            .catch((err)=>console.log(err))
        }
    // }
