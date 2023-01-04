import { Board } from './board.js'

const playBtn = document.querySelector('#play')
const xScore = document.querySelector('.score .x-score')
const oScore = document.querySelector('.score .o-score')
const body = document.body
const board = document.querySelector('#board')
const status = document.querySelector('#status')
const levelDisplay = document.querySelector('#level')
const squareDivs2 = document.querySelectorAll('#board > div')

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

const DRAW = 'it\'s a draw :('
const WIN = '%% won!'
const TURN = '%%\'s turn'

const squareDivs = Array(9)

const score = {
    x: 0,
    o: 0
}

let isXFirst = !!Math.round(Math.random())


const calculateWin = (b) => {

    status.textContent = TURN.replace('%%', b.isX ? 'X' : 'O')

    const isWinLine = testForWin(true,b) || testForWin(false,b)

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

const testForWin = (isX,b) => {

    const bi = isX ? `0b${b.xState.join('')}` :  `0b${b.oState.join('')}`
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

body.onkeyup = (e) => {
    if (e.key.match(/[1-9]/)) {
        squareDivs[e.key - 1].click()
    }
    else if ((/ ||enter/i).test(e.key) && playBtn.className === 'animate') {
        playBtn.click()
    }
}

const newBoard = new Board

const startGame = (playSquare=()=>{}, b = newBoard) => {

    b.gameOver = false

    board.innerHTML = ''
    board.classList.remove('finishedBoard')
    isXFirst = !isXFirst
    b.isX = isXFirst

    board.isClickable = !b.isX

    status.textContent = (b.isX ? 'X\'s' : 'O\'s') + ' turn'

    const fragment = document.createDocumentFragment()

    for (let i=0; i < squareDivs.length; i++) {
        squareDivs[i] = document.createElement('div')
        squareDivs[i].setAttribute('data-index',i)
    }


    board.onmouseover = (e) => {
        if (e.currentTarget === e.target) return
        const squareDiv = e.target

        if (b.gameOver || squareDiv.classList.contains('selected')) return
        squareDiv.classList.remove(b.isX ? 'O' : 'X')
        squareDiv.classList.add(b.isX ? 'X' : 'O')
    
    }

    board.onmouseout = (e) => {
        if (e.currentTarget === e.target) return
        const squareDiv = e.target

        if (b.gameOver || squareDiv.classList.contains('selected')) return
        squareDiv.classList.remove('X','O')
    }
    
    fragment.append(...squareDivs)
    board.append(fragment)

    // // first move is computer
    if (b.isX) playSquare(b)

    // // on human play
    board.onclick = (e) => playSquare(undefined,e)
    
}

export {
    status,
    board,
    squareDivs,
    calculateWin,
    levelDisplay,
    startGame,
    playBtn,
    squareDivs2,
    newBoard
}