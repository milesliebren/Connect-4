// Define a global variable board
let board = [];

// Initialize the board as a 6x7 array filled with zeros
for (let i = 0; i < 6; i++) {
    board[i] = [];
    for (let j = 0; j < 7; j++) {
        board[i][j] = 0;
    }
}

function set(row, col, player) {
    board[row][col] = player;
}

function render() {
    // Find the DOM element corresponding to the <div>
    const container = document.querySelector('#game');

    // Empty the element
    container.innerHTML = '';

    // Create a <table> DOM node
    const table = document.createElement('table');

    // Add the <table> to the <div>
    container.appendChild(table);

    // Create a 6x7 table using nested for loops
    for (let i = 0; i < 6; i++) {
        // Create a table row (<tr>)
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            // Create a table cell (<td>)
            const cell = document.createElement('td');

            // Set the class based on the value in the board array
            if (board[i][j] === 1) {
                cell.classList.add('player1');
            } else if (board[i][j] === 2) {
                cell.classList.add('player2');
            }

            // Set the data-column attribute
            cell.dataset.column = j;

            // Append the cell to the row
            row.appendChild(cell);
        }

        // Append the row to the table
        table.appendChild(row);
    }

    table.addEventListener('click', function(event) {
        if (event.target.tagName === "TD")
        {
            play(event.target.dataset.column);
            render();
        }
    });
}

// Call the render() function to create the initial game board
render();

let turn = 1;

function play(column) {
    for (let i = 5; i >= 0; i--) { // Start from the bottom row and go up
        if (board[i][column] === 0) {
            board[i][column] = turn;
            if (turn === 1) turn = 2;
            else turn = 1;
            return i;
        }
    }
    return false; // Column is full
}