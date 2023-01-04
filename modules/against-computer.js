import { bestMove } from './minimax.js'
import getLevel from './get-level.js'
import { 
    board,
    calculateWin,
    levelDisplay,
} from './game.js'

const levelNum = [
    'easy',
    'medium',
    'hard'
]

const level = levelNum[getLevel()]

const levelDisplayAnchor = document.createElement('a')

levelDisplayAnchor.href='./'

levelDisplayAnchor.innerText = (`LEVEL: ${level.toUpperCase()}`)

levelDisplay.append(levelDisplayAnchor)

const playSquare = (b,e = {}) => {
        
    // if its o's turn, make sure the a specific square was clicked
    // make sure the game isn't over    
    if (!b.isX && (e.currentTarget === e.target) || b.gameOver) return

    const index = b.isX ? bestMove(b, level) : e?.target?.getAttribute('data-index')
    const squareDiv = b.isX ? board.querySelector(`[data-index="${index}"]`) : e.target
    const square = b.squares[index]

    if (square.mark) return
    
    squareDiv.classList.remove(b.isX ? 'O' : 'X')
    squareDiv.classList.add(b.isX ? 'X' : 'O')
    square.setMark(b.isX)
    squareDiv.innerText = square.mark
    squareDiv.classList.add('selected')

    b.changeState(index,b.isX)

    calculateWin(b)

    b.isX = !b.isX
    board.isClickable = !b.isX

    playSquare(b)

}

export {
    playSquare
}