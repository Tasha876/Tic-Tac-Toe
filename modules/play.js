import { startGame, playBtn } from "./game.js";
import { playSquare, playSquareOpp, getBoard } from "./against-human.js";

navigator.serviceWorker.onmessage = async (e) => {
    console.log(e.data)
    const b = await getBoard()
    const methods = {setGameOver: b.setGameOver, changeState: b.changeState}
    methods.changeState = new Function(methods.changeState)
    methods.setGameOver = new Function(methods.setGameOver)
    Object.assign(b, methods)

    console.log(b)

    playSquareOpp(b)

    playBtn.onclick = () => {
        playBtn.classList.remove('animate')
        startGame(playSquare(b))
    }
}

startGame(playSquare)

playBtn.onclick = () => {
    playBtn.classList.remove('animate')
    startGame(playSquare)
}

