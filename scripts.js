const gameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];
    //create 2d board array
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
    //display board array
    const getBoard = () => board;
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };
    return {getBoard, printBoard};            
})

function Cell() {
    let value = "-";
    const placeMarker = (marker) => {
        if (value != '-') {
            console.log("Invalid move");
            return;
        } else {
        value = marker;
        }
    }
    const getValue = () => value;
    return {placeMarker, getValue};
    }

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = gameBoard();
    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ]

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;

    let round = 0;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const flattenBoard = () => {
        let flatBoard = []
        board.getBoard().flat().forEach((el) => flatBoard.push(el.getValue()));
        return flatBoard.join('');
    }

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() != "-") {
            return
        } else {
            board.getBoard()[row][column].placeMarker(activePlayer.token);
            round++            
            const winState = ['OOO', 'XXX'];
            const downwardDiagonal = flattenBoard().charAt(0) + flattenBoard().charAt(4) + flattenBoard().charAt(8);
            const upwardDiagonal = flattenBoard().charAt(2) + flattenBoard().charAt(4) + flattenBoard().charAt(6);
            const columnOne = flattenBoard().charAt(0) + flattenBoard().charAt(3) + flattenBoard().charAt(6);
            const columnTwo = flattenBoard().charAt(1) + flattenBoard().charAt(4) + flattenBoard().charAt(7);
            const columnThree = flattenBoard().charAt(2) + flattenBoard().charAt(5) + flattenBoard().charAt(8);
           
            if (winState.includes(flattenBoard().slice(0,3))
                || winState.includes(flattenBoard().slice(3,6))
                || winState.includes(flattenBoard().slice(6))
                || winState.includes(downwardDiagonal)
                || winState.includes(upwardDiagonal)
                || winState.includes(columnOne)
                || winState.includes(columnTwo)
                || winState.includes(columnThree)) {
                    console.log(`${getActivePlayer().name} wins`);
                    console.log(flattenBoard());
                    console.log(downwardDiagonal);
                    console.log(upwardDiagonal);
                    console.log(columnOne);
                    console.log(columnTwo);
                    console.log(columnThree);
                    const winner = document.querySelector('.winner');
                    winner.textContent = `${getActivePlayer().name} wins`;
                    return;
            } if (round === 9) {
                console.log('Tie game');
                return;
            } 
            else {
                switchPlayerTurn();
                printNewRound();
            }
        }    
    };
    printNewRound();
    return{playRound, getActivePlayer, getBoard: board.getBoard};
}

function ScreenController() {
    const game = GameController();
    const playerDiv = document.querySelector('.current-player')
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";        
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        playerDiv.textContent = `${activePlayer.name}'s turn`;
        board.forEach((row, i) => {            
            row.forEach((cell, index) => {
                const cellButton = document.createElement('button');                
                cellButton.dataset.row = i;                
                cellButton.classList.add("cell");
                cellButton.dataset.column = index;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        if (!selectedColumn) return;
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);
    updateScreen()
}

ScreenController();