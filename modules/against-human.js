import { 
    board,
    calculateWin,
    newBoard
} from './game.js'

const postTurn = async (b) => {
     updateBoard(b)
}

const updateBoard = async (board) => {

    const methods = {
        setGameOver: board.setGameOver,
        changeState: board.changeState
    }
    Object.assign(board, methods)

    const response = await fetch('/api',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        mode: 'no-cors',
        body: JSON.stringify(board)
    })
    const data = await response.json()
    return data 
}

const getBoard = async () => {
    const data = await fetch('/api',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        mode: 'cors',
    })
    .then((data)=>{
        return data.json()
    })
    .then(newboard=>{
        return newboard
    })
    console.log(data)
    return data
}

const playSquareOpp = (b) => {

    console.log('here4',b)

    if (b.gameOver) return

    const squareDivs = board.querySelectorAll('div')

    b.squares.forEach((square,i)=> {
        console.log(board.querySelectorAll('div'))
        const squareDiv = squareDivs[i]
        if (square.mark === 'x') {
            squareDiv.classList.add('selected','X')
            squareDiv.innerText = 'X'
            b.changeState(i,b.isX)
        }
        else if (square.mark === 'o') {
            squareDiv.classList.add('selected','O')
            squareDiv.innerText = 'O'
            b.changeState(i,b.isX)
        }
            calculateWin(b)
    })


    b.isX = !b.isX

}

const playSquare = (b = newBoard,e = {}) => {

    console.log(b)

        if (e.currentTarget === e.target || b.gameOver) return

        const index = e.target.getAttribute('data-index')
        const squareDiv = e.target
        const square = b.squares[index]
    
        if (square.mark) return
        
        squareDiv.classList.remove(b.isX ? 'O' : 'X')
        squareDiv.classList.add(b.isX ? 'X' : 'O')
        square.setMark(b.isX)
        squareDiv.innerText = square.mark
        squareDiv.classList.add('selected')

        console.log(b)
    
        b.changeState(index,b.isX)
    
        calculateWin(b)
    
        b.isX = !b.isX

        postTurn(b)


}

export {
    playSquare,
    playSquareOpp,
    getBoard
}