// Define a global variable board
let board = [];

//Player 1 starts
let turn;

//start game
resetGame();

/**
 * @description refresh the screen - create a 6x7 table and populate cells with players (1 or 2) or empty (0)
 * @event click listens to when the mouse is clicked and makes sure it is on the table itself
 */
function render() 
{
    // Find the element corresponding to the <div>
    const container = document.querySelector('#game');

    // Empty the element
    container.innerHTML = '';

    // Create a <table> node
    const table = document.createElement('table');

    // Add the <table> node to the <div> element
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

    table.addEventListener('click', function(event) //event listener for mouse click on a cell
    {
        if (event.target.tagName === "TD") //check if player clicked a cell
        {
            play(event.target.dataset.column); //call play function with cell clicked as a parameter
            render(); //refresh the screen
        }
    });
}

/**
 * @description create the initial game board and set the current turn to player 1, then render the board
 */
function resetGame() 
{
    // Set the dimensions of the board
    const numRows = 6;
    const numCols = 7;

    // Initialize the board as a 6x7 array filled with zeros
    board = [];
    
    for (let i = 0; i < numRows; i++) 
    {
        board[i] = []; //set each column to a new array

        for (let j = 0; j < numCols; j++) //for each cell in the array, set value to 0 i.e. clear the board
        {
            board[i][j] = 0;
        }
    }

    // Player 1's turn to start the game
    turn = 1;

    // Render the initial board
    render();
}

/**
 * 
 * @param {*} column the column that the current player clicked on 
 * @description places a token on the lowest open cell in the given column 
 */

//called when a cell is clicked - populates cell with current player based on column and then changes player turn
function play(column) {
    for (let row = 5; row >= 0; row--) 
    {
        if (board[row][column] === 0) 
        {
            board[row][column] = turn;

            const currentPosition = [row, column];

            // Check for a win condition in all directions
            if (checkWin(currentPosition)) 
            {
                render(); // Refresh the screen to display the winning move
                return; // Stop the game if there's a win
            }

            console.log("Position: " + currentPosition + " \nTurn: " + turn + "\n"); //debug

            // Change turn
            if (turn === 1) turn = 2;
            else turn = 1;
            
            render(); // Refresh the screen for the next player's turn
            return;
        }
    }
    return false; // column is full
}

/**
 * @param currentPosition the position of the current token
 * @returns if a player has won or not
 */

function checkWin(currentPosition)
{
    const directions = 
    [
        [0, 1], 
        [0, -1], 
        [1, 0], 
        [-1, 0], 
        [1, 1], 
        [1, -1], 
        [-1, 1],
        [-1,-1]
    ];

    for (const [dirX, dirY] of directions) //for each direction (dirX and dirY) in the available directions
    {
        //set the number of consecutive tokens to the result of the countConsecutiveTokens method.
        let consecutiveTokens = countConsecutiveTokens(currentPosition[0], //x location of current token
                                                        currentPosition[1], //y location of current token
                                                        dirX, //direction of X to check
                                                        dirY, //direction of Y to check
                                                        board[currentPosition[0]][currentPosition[1]]); //token to check
        
        if (consecutiveTokens >= 4) //if the countConsecutiveTokens function returns 4 or more, end the game using the handleWin function
        {
            handleWin(turn);
            return true; //break the current function
        }
    }
    return false;
}

/**
 * @param x current x location of token
 * @param y current y location of token
 * @param dx direction to check along the x-axis
 * @param dy direction to check along the y-axis
 * @param token which player token to check
 * @description count the number of consecutive tokens that the player has next to the input token
 * @returns the number of tokens next to each other (consecutive) from the given player token
 */
function countConsecutiveTokens(x, y, dx, dy, token) {
    let consecutive = 1; // Start with 1 to account for the current cell

    // Check in one direction (positive)
    for (let i = 1; i <= 3; i++) {
        const newRow = x + i * dx;
        const newCol = y + i * dy;

        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === token) {
            consecutive++;
        } else {
            break; // Stop counting if a non-matching token is encountered
        }
    }

    // Check in the opposite direction (negative)
    for (let i = 1; i <= 3; i++) {
        const newRow = x - i * dx;
        const newCol = y - i * dy;

        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === token) {
            consecutive++;
        } else {
            break; // Stop counting if a non-matching token is encountered
        }
    }

    console.log("Consecutive: " + consecutive); // Log the consecutive value

    return consecutive;
}

/**
 * 
 * @param currentPosition the position of the current token
 * @returns {Array} a list of valid cells that can be checked
 */

function checkValidCells(currentPosition)
{
    const validCells = []; //instantiate a new array of valid cells

    for (const dx of [-1, 0, 1]) //instantiate dx as the direction of x, checking negative, then 0, then positive
    {
        for (const dy of [-1, 0, 1]) //same for dy, negative, 0, positive
        {
            const newRow = currentPosition[0] + dx; //instantiate newRow as the current row plus the direction of x we want to check
            const newCol = currentPosition[1] + dy; //instantiate newCol as the current column plus the direction of y we want to check
            if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7) //if on the board
            {
                validCells.push([dx, dy]); //add the cells to the new array
            }
        }
    }
    console.log("Valid Cells: " + validCells);
    return validCells; //return the array of valid cells
}

/**
 * 
 * @param {token} player the winning player.
 * @description shows a popup of the winner and resets the game. 
 */
function handleWin(player) {
    setTimeout(function () {
        window.alert(`Player ${player} wins!`); // Show who wins as a popup after a short delay
        resetGame(); // Restart the game after a win
    }, 100); // Adjust the delay time as needed (e.g., 100 milliseconds)
}