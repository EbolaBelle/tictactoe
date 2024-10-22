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
    let value = " ";
    const placeMarker = (marker) => {
        if (value != ' ') {
            alert("Invalid move");
            return;
        } else {
        value = marker;
        }
    }
    const getValue = () => value;
    return {placeMarker, getValue};
    }

function GameController(
    playerOneName = "Player One:",
    playerTwoName = "Player Two:"
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
    let isGameOver = false;
    const gameOver = () => isGameOver;
    const switchGameOver = () => isGameOver = true;

    const flattenBoard = () => {
        let flatBoard = []
        board.getBoard().flat().forEach((el) => flatBoard.push(el.getValue()));
        return flatBoard.join('');
    }

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() != " ") {
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
            const winner = document.querySelector('.winner');
            if (winState.includes(flattenBoard().slice(0,3))
                || winState.includes(flattenBoard().slice(3,6))
                || winState.includes(flattenBoard().slice(6))
                || winState.includes(downwardDiagonal)
                || winState.includes(upwardDiagonal)
                || winState.includes(columnOne)
                || winState.includes(columnTwo)
                || winState.includes(columnThree)) {                    
                    winner.textContent = `${getActivePlayer().name} wins.`;
                    switchGameOver()
                    return;
            } if (round === 9) {
                switchGameOver();
                winner.textContent = "Tie game";
                return;
            } 
            else {
                switchPlayerTurn();
            }
        }    
    }
    return{playRound, getActivePlayer, getBoard: board.getBoard, gameOver};
}

function ScreenController(P1, P2) {
    const game = GameController(P1.value, P2.value);
    P1.value = "";
    P2.value = "";
    const playerDiv = document.querySelector('.current-player')
    const boardDiv = document.querySelector('.board');
    const winner = document.querySelector('.winner');  
    winner.textContent = "";

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
        if (game.gameOver()) return;   
        game.playRound(selectedRow, selectedColumn);
            updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);
    updateScreen()
}

const startBtn = document.querySelector('.start');
const submitBtn = document.querySelector('.submit');
const dialog = document.querySelector('dialog');

submitBtn.addEventListener('click', () => {
    const P1 = document.getElementById('P1');
    const P2 = document.getElementById('P2');
    if (P1.value === "") {
        P1.value = "Player One"
    } if (P2.value === "") {
        P2.value = "Player Two"
    }
    ScreenController(P1, P2);
    dialog.close();    
})

startBtn.addEventListener('click', () => dialog.showModal())