const getScore = (board, depth) => {
    // console.log(depth)
    if (testForWin(board.xState) === null && testForWin(board.oState) === null) return null
    board.gameOver = true
    if (testForWin(board.xState)) return  1 + depth
    if (testForWin(board.oState)) return -1 - depth
    return 0
}

const minimax = (board, isMaximizingPlayer = true, depth = 8, alpha = -Infinity, beta = Infinity) => {

    const score = getScore(board, depth)

    if (board.gameOver || !depth) {
        return score
    }
    
    if (isMaximizingPlayer) {
        let max = -Infinity

        for (let i = 0; i < 9; i++) {
            const computer = [...board.xState]
            const human = [...board.oState]

            if (computer[i] || human[i]) continue

            // made temp game, so it doesn't mess with the actual one
            const tempBoard = {xState: [...computer.slice(0,i),1,...computer.slice(i+1)], oState: human}
            let curr = minimax(tempBoard, false, depth - 1, alpha, beta)

            max = Math.max(curr, max)

            // disregards irrelevant branches
            // overexplained for only my benefit
            // i.e. if the max of the mins is less than or equal to the min if the maxs, break out of loop
            // e.g. if isMaximizingPlayer === true and the previous maximizing level looked like this:
            //          [   1    1    1   ] [   -1    0    0   ] [   -1   0    0   ]

            // instead of evaluating all of the tree like this:
            //                                    [   1   ]
            //               [   1                   -1                 -1   ]
            //          [   1    1    1   ] [   -1    0    0   ] [   -1   0    0   ]
            // it would be 'pruned' to:
            //                                    [   1   ]  
            //               [   1                  <= -1             <= -1  ]
            //          [   1    1    1   ] [   -1    ?    ?   ] [   -1   ?    ?   ] 
            // because we'd know at the prior level, there was a point where "O" could NOT avoid defeat (i.e. the minimum score was equal to the max score)
            // "X" would have definitely picked this move, so there's no point in evaluating the others
            alpha = Math.max(alpha,curr)
            if (beta <= alpha) break
        }

        return max
    }
    else {
        let min = Infinity

        for (let i = 0; i < 9; i++) {

            const computer = [...board.xState]
            const human = [...board.oState]

            if (computer[i] || human[i]) continue

            const tempBoard = {xState: computer, oState: [...human.slice(0,i),1,...human.slice(i+1)]}
            let curr = minimax(tempBoard, true, depth - 1, alpha, beta)

            min = Math.min(curr, min)

            beta = Math.min(beta,curr)
            if (beta <= alpha) break
        }

        return min
    }
}

// decided to use binary for this, figured its faster than using a loop
// I got the idea from here: https://stackoverflow.com/a/33456912

const winCombos = [
    '0b111000000',
    '0b000111000',
    '0b000000111',
    '0b100100100',
    '0b010010010',
    '0b001001001',
    '0b100010001',
    '0b001010100',
]

const testForWin = (b) => {

    const state = '0b'+b.join('')
        for (let combo of winCombos) {
            if (!(~(~combo | state))) { // ~x | y is the same as if x then y (but bitwise) i.e. square in model implies square must be in board to win || (double negation makes boolean)
                return true
            }
        }

        if ((state.match(/1/g) || []).length >= 5) {
            return false
        }
        return null
}

const levels = {
    hard: 8,
    medium: 4,
    easy: 1, 
}

// keeps track of first pass through, so it can skip minimax that one time (it was slow)

const bestMove = (game, level = 'hard') => {

    // if there are no Os on the board its the first time the computer is playing
    let firstPass = game.oState.every(entry=>!entry)

    if (game.gameOver) return

    const curr = [...game.xState]
    const opp = [...game.oState]

    // list of best first moves,
    // speeds up the process a lot
    // array will hold list of next best moves, so that the game is a little bit more "fun" and random
    let nextMoves = [0,2,6,8]

    let bestScore = -Infinity

    let closeLoses = 0

    for (let i = 0; i < 9; i++) {
    
        // makes it so the computer does not do stupid things on first pass (i.e. go in a random spot because it figures that every move ends in a draw)
        // also speeds up first move a bunch; took a while just to go in the first square before
        if (firstPass) break

        if (curr[i] || opp[i]) continue

        // added so the computer plays more like a human 
        // i.e. if there are two ways the opponent could win, 
        // it doesn't just pick the first avail square, but tries to block one win path
        if (testForWin([...opp.slice(0,i),1,...opp.slice(i + 1)])) closeLoses = 0.5

        let score = minimax({xState: [...curr.slice(0,i),1, ...curr.slice(i + 1)], oState: opp}, false, levels[level]) + closeLoses
        closeLoses = 0

        if (score > bestScore) {
            bestScore = score
            nextMoves = [i]
        }
        else if (score === bestScore) {
            nextMoves.push(i)
        }

    }
    // picks a random (but equal) move
    return nextMoves[Math.floor(Math.random() * nextMoves.length)]
}

export {
    bestMove,
}