import Board from './board.js'
import { bestMove } from './minimax.js'
import getLevel from './get-level.js'

const board = document.querySelector('#board')
const levelDisplay = document.querySelector('#level')
const status = document.querySelector('#status')
const playBtn = document.querySelector('#play')
const xScore = document.querySelector('.score .x-score')
const oScore = document.querySelector('.score .o-score')
const body = document.body

const DRAW = 'it\'s a draw :('
const WIN = '%% won!'
const TURN = '%%\'s turn'

const squareDivs = Array(9)

const score = {
    x: 0,
    o: 0
}

const levelNum = [
    'easy',
    'medium',
    'hard'
]

const level = levelNum[getLevel()]

levelDisplay.innerText = (`LEVEL: ${level.toUpperCase()}`)

const winCombos = [
    '0b111000000',
    '0b000111000',
    '0b000000111',
    '0b100100100',
    '0b010010010',
    '0b001001001',
    '0b100010001',
    '0b001010100'
]

let isXFirst = !!Math.round(Math.random())

let r = -1

const startGame = () => {

    const b = new Board

    b.gameOver = false

    board.innerHTML = ''
    board.classList.remove('finishedBoard')
    isXFirst = !isXFirst
    let isX = isXFirst

    board.isClickable = !isX

    status.textContent = (isX ? 'X\'s' : 'O\'s') + ' turn'

    const fragment = document.createDocumentFragment()

    for (let i=0; i < squareDivs.length; i++) {
        squareDivs[i] = document.createElement('div')
        squareDivs[i].setAttribute('data-index',i)
    }

    board.onclick = (e) => {
        if (e.currentTarget === e.target || !board.isClickable) return

        const squareDiv = e.target
        const index = squareDiv.getAttribute('data-index')
        const square = b.squares[index]

        if (square.mark || b.gameOver) return
        
        squareDiv.classList.remove(isX ? 'O' : 'X')
        squareDiv.classList.add(isX ? 'X' : 'O')
        square.setMark(isX)
        squareDiv.innerText = square.mark
        squareDiv.classList.add('selected')

        b.changeState(index,isX)

        isX = !isX
        board.isClickable = !isX

        status.textContent = TURN.replace('%%', isX ? 'X' : 'O')

        const isWinLine = testForWin(b.xState, true,b) || testForWin(b.oState, false,b)

        if (isX && !b.gameOver) {
            r = bestMove(b, level)
            board.isClickable = true
            squareDivs[r].click()
        }

        if (isWinLine) {
            isWinLine.forEach(i=>{
                squareDivs[i].classList.add('winSquare')
            })
            drawLine(squareDivs[isWinLine[0]],squareDivs[isWinLine[2]])
        }
        if (b.gameOver) {
            board.classList.add('finishedBoard')
            playBtn.classList.add('animate')
        }
    }

    board.onmouseover = (e) => {
        if (e.currentTarget === e.target) return
        const squareDiv = e.target

        if (b.gameOver || squareDiv.classList.contains('selected')) return
        squareDiv.classList.remove(isX ? 'O' : 'X')
        squareDiv.classList.add(isX ? 'X' : 'O')
    
    }

    board.onmouseout = (e) => {
        if (e.currentTarget === e.target) return
        const squareDiv = e.target

        if (b.gameOver || squareDiv.classList.contains('selected')) return
        squareDiv.classList.remove('X','O')
    }
    
    fragment.append(...squareDivs)
    board.append(fragment)

    if (isX) {
        r = bestMove(b, level)
        board.isClickable = true
        squareDivs[r].click()
    }
}

const getPoints = (el) => {
    return [el.offsetLeft + el.offsetWidth / 2, el.offsetTop + el.offsetHeight / 2]
}

const drawLine = (el1,el2) => {
    const scale = 1.25
    const thickness = 5
    const [x1,y1] = getPoints(el1)
    const [x2,y2] = getPoints(el2)
    const [xc,yc] = [(x1 + x2) / 2,(y1 + y2) / 2]

    const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * scale
    const degree = Math.atan((x1 - x2)/(y2 - y1)) * (180 / Math.PI)
    const d = { // scales by scale amount
        x: (x1 - xc) * scale + xc,
        y: (y1 - yc) * scale + yc
    }
    const line = document.createElement('hr')
    line.classList.add('line')
    line.style.transform = `rotate(${degree}deg)`
    line.style.top = d.y + thickness + 'px'
    line.style.left = d.x - thickness / 2 + 'px'
    board.appendChild(line).focus() // focus, so it will actually draw the line (-_-)
    line.style.height = length + 'px'
}

const findWinLine = (str) => {
    const re = /1/g
    const line = []
    let match;
    while ((match = re.exec(str)) != null) {
        line.push(match.index - 2);
    }
    return line
}

const updateScore = (isX) => {
    if (isX) {
        score.x++
        xScore.innerText = score.x < 1000 ? `000${score.x}`.slice(-3) : score.x
    }
    else {
        score.o++
        oScore.innerText = score.o < 1000 ? `000${score.o}`.slice(-3) : score.o
    }
}

const testForWin = (state,isX,b) => {

    const bi = `0b${state.join('')}`
    // decided to use binary for this, figured its faster than using a loop
    // I got the idea from here: https://stackoverflow.com/a/33456912
    for (let combo of winCombos) {
        if (!(~(~combo | bi))) { // ~x | y is the same as if x then y (but bitwise) i.e. square in model implies square must be in board to win || (double negation makes boolean)
            status.textContent = WIN.replace('%%', isX ? 'X' :'O')
            const winLine = findWinLine(combo)
            updateScore(isX)
            b.gameOver = true
            return winLine
        }
    }
    if ((bi.match(/1/g) || []).length >= 5) {
        status.textContent = DRAW
        b.gameOver = true
        return false
    }
    return null

}

playBtn.onclick = () => {
    playBtn.classList.remove('animate')
    startGame()
}

body.onkeyup = (e) => {
    if (e.key.match(/[1-9]/)) {
        squareDivs[e.key - 1].click()
    }
    else if ((/ ||enter/i).test(e.key) && playBtn.className === 'animate') {
        playBtn.click()
    }
}

startGame()