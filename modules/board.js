let i = 0

class Square {
    constructor() {
        this.id = ++i
        this.mark = ''
    }

    setMark(isX) {
        this.mark = isX ? 'x' : 'o'
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

}

export default Board