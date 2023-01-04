let i = 0

class Square {
    constructor() {
        this.id = ++i
        this.mark = ''
    }

    setMark(isX) {
        this.mark = isX ? 'x' : 'o'
    }

    cloneSquare(square) {
        const s = new Square
        s.id = square.id
        s.mark = square.mark
        s.setMark = square.setMark
        return s
    }

}

class Board {
    constructor() {
        i = 0 // resets ids
        this.gameOver = false
        this.squares = Array(9)
        for (let i = 0; i < 9; i++) {
            this.squares[i] = new Square
        }
        this.xState = Array(9).fill(0)
        this.oState = Array(9).fill(0)
    }

    setGameOver() {
        this.gameOver = true
    }

    changeState(index,isX=true) {
        isX ? this.xState[index] = 1 : this.oState[index] = 1
    }

    cloneBoard(board) {
        const b = new Board
        b.gameOver = board.gameOver
        b.squares = Array(9)
        for (let i = 0; i < 9; i++) {
            b.squares[i] = cloneSquare(board.squares[i])
        }
        b.xState = board.xState
        b.oState = board.oState
        b.setGameOver = board.setGameOver
        b.changeState = board.changeState
        return b
    }

}

// console.log(clone({}, 'Board'))

export {
    Board
}