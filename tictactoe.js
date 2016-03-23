// // // // // // // // //
// TIC TAC TOE (by HE)  //
// // // // // // // // //

// TicTacToe GAME PROTOTYPE
function TicTacToe(difficulty, userStarts, userWeapon, display) {
	this.userWeapon = userWeapon;
	this.computerWeapon = (userWeapon === "X") ? "O" : "X";
	this.userStarts = userStarts;
	this.difficulty = difficulty; // normal / invincible
	this.board = ["", "", "", "", "" ,"" ,"" ,"", ""]; // Positions from 0 to 8
	this.numPlays = 0;
	this.display = display;
	this.enabled = true;
}

// START GAME
// // // // //

TicTacToe.prototype.start = function() {
	if (this.userStarts)
		this.userPlay();
	else {
		var that = this;
		setTimeout(function() {
			that.computerPlay();
		}, 200);
	}
}

TicTacToe.prototype.restart = function() {
	this.board = ["", "", "", "", "" ,"" ,"" ,"", ""];
	this.numPlays = 0;
	this.enabled = true;
	this.generateBoard(this.board, this.display);
	this.start();
};

// SET SETTINGS
// // // // //

TicTacToe.prototype.setDifficulty = function(difficulty) {
	this.difficulty = difficulty;
	this.restart();
};

TicTacToe.prototype.setUserWeapon = function(userWeapon) {
	this.userWeapon = userWeapon;
	this.computerWeapon = (userWeapon === "X") ? "O" : "X";
	this.restart();
};

TicTacToe.prototype.doesUserStart = function(userStarts) {
	this.userStarts = userStarts;
	this.restart();
};

// GAME PLAY
// // // //

TicTacToe.prototype.userPlay = function(position) {
	var that = this;
	this.display.children(".spot").click(function() {
		if (that.enabled) {
			// Get the number in the end of spot id
			var position = Number(this.id.replace(/^\D+/g, ""));

			// Play, set board and check results
			if (that.board[position] === "") {
				that.board[position] = that.userWeapon;
				that.numPlays++;
				that.generateBoard(that.board, that.display);
				var done = that.checkResults(that.board, that.numPlays, that.userWeapon)[0];

				// Done
				if (done) {
					that.enabled = false;
					setTimeout(function() {
						that.restart();
					}, 1500);
				}
				else {
					setTimeout(function() {
						that.computerPlay();
					}, 150);
				}

			} // <<< IF board[position]
		} // <<< IF enabled
	}); // <<< click
};

TicTacToe.prototype.computerPlay = function() {
	// Computer play
	var that = this;

	// NORMAL COMPUTER PLAY
	function normalComputerPlay() {
		var normalMove;

		// 5% possibility of chosing random (making a mistake)
		if (Math.random() < 0.05) {
			do {
				normalMove = Math.floor(Math.random() * that.board.length);
			} while (that.board[normalMove] !== "");
			return normalMove;
		}

		// First Move
		if (that.numPlays === 0)
			return [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];

		// Second Move
		if (that.numPlays === 1)
			if (that.board[4] === "")
				return 4;
			else
				return [0, 2, 6, 8][Math.floor(Math.random() * 4)];

		// Find the empty spot
		function searchEmpty(i, j, k) {
			if (that.board[i] === "")
				return i;
			else if (that.board[j] === "")
				return j;
			else if (that.board[k] === "")
				return k;
		}

		// Find move against any two identical spots
		function findMove(testSequence) {
			// Rows
			for (var i = 0; i < 7; i += 3)
				if ((that.board[i] + that.board[i + 1] + that.board[i + 2]) === testSequence)
					return searchEmpty(i, i + 1, i + 2);

			// Columns
			for (var i = 0; i < 3; i++)
				if ((that.board[i] + that.board[i + 3] + that.board[i + 6]) === testSequence)
					return searchEmpty(i, i + 3, i + 6);

			// Diagonal
			if ((that.board[0] + that.board[4] + that.board[8]) === testSequence)
				return searchEmpty(0, 4, 8);

			// Reverse diagonal
			if ((that.board[2] + that.board[4] + that.board[6]) === testSequence)
				return searchEmpty(2, 4, 6);

			return -1;
		}

		// Search for attacking move
		normalMove = findMove(that.computerWeapon.repeat(2));
		if (normalMove !== -1)
			return normalMove;

		// Search for defending move
		normalMove = findMove(that.userWeapon.repeat(2));
		if (normalMove !== -1)
			return normalMove;

		// Random otherwise
		do {
			normalMove = Math.floor(Math.random() * that.board.length);
		} while (that.board[normalMove] !== "");
		return normalMove;

	}

	// PERFECT COMPUTER PLAY
	function perfectComputerPlay() {
		// Use the Minimax algorithm
		var perfectMove;

		// Calculate score of board
		function scoreGames(board, numPlays) {
			if (that.checkResults(board, numPlays, that.computerWeapon)[1])
				return 10 - numPlays;
			else if (that.checkResults(board, numPlays, that.userWeapon)[1])
				return numPlays - 10;
			else
				return 0;
		}

		// Run minimax
		function minimax(board, numPlays, weapon) {
			if (that.checkResults(board, numPlays, that.computerWeapon)[0] || that.checkResults(board, numPlays, that.userWeapon)[0])
				return scoreGames(board, numPlays);

			// Scores and Moves arrays
			var movesArr = [];
			var scoresArr = [];
			// Switch Weapon
			var switchWeapon = (weapon === that.userWeapon) ? that.computerWeapon : that.userWeapon;

			for (var i = 0; i < board.length; i++)
				if (board[i] === "") {
					var possibleBoard = board.slice();
					var possiblePlays = numPlays + 1;
					possibleBoard[i] = weapon;
					movesArr.push(i);
					scoresArr.push(minimax(possibleBoard, possiblePlays, switchWeapon));
				}

			// Calculate (Max for computer) and (Min for player)
			if (weapon === that.computerWeapon) {
				var maxScoreIndex = scoresArr.indexOf(Math.max.apply(null, scoresArr));
				perfectMove = movesArr[maxScoreIndex];
				return scoresArr[maxScoreIndex];
			}
			else {
				var minScoreIndex = scoresArr.indexOf(Math.min.apply(null, scoresArr));
				perfectMove = movesArr[minScoreIndex];
				return scoresArr[minScoreIndex];
			}

		}

		// First Move
		if (that.numPlays === 0)
			return [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];

		// Other Moves
		minimax(that.board, that.numPlays, that.computerWeapon);
		return perfectMove;
	}

	// Find move for chosen difficulty
	var move;
	if (this.difficulty === "normal") {
		move = normalComputerPlay();
	}
	else if (this.difficulty === "invincible") {
		move = perfectComputerPlay();
	}

	// Set board and check results
	this.board[move] = this.computerWeapon;
	this.numPlays++;
	this.generateBoard(this.board, this.display);
	var done = this.checkResults(this.board, this.numPlays, this.computerWeapon)[0];

	if (done) {
		this.enabled = false;
		setTimeout(function() {
			that.restart();
		}, 1500);
	}
	else {
		this.userPlay();
	}

};

// RESULTS SETTINGS
// // // // // // //

TicTacToe.prototype.generateBoard = function(board, display) {
	for (var i = 0; i < board.length; i++) {
		var spot = display.children("#spot" + i);
		spot.children(".content").html(board[i]);
	}
};

// Check the result of board and return an array [game done? ,weapon user win?]
TicTacToe.prototype.checkResults = function(board, numPlays, weapon) {
	var winTest = weapon.repeat(3);
	var done = false;
	var didWin = false;
	var that = this;

	// Blink the win sequence
	function blinkWinSequence(x, y, z) {
		var target = that.display.children("#spot" + x + ", #spot" + y + ", #spot" + z).children(".content");
		for (var i = 0; i < 2; i++) {
			target.delay(100).hide(0);
			target.delay(100).show(0);
		}
	}

	// Check rows
	for (var i = 0; i < 7; i += 3)
		if (board[i] + board[i + 1] + board[i + 2] === winTest) {
			if (board === this.board)
				blinkWinSequence(i, i+1, i+2);
			done = true;
			didWin = true;
		}

	// Check columns
	if (!done)
		for (var i = 0; i < 3; i++)
			if (board[i] + board[i + 3] + board[i + 6] === winTest) {
				if (board === this.board)
					blinkWinSequence(i, i+3, i+6);
				done = true;
				didWin = true;
			}

	// Check diagonal
	if (!done)
		if (board[0] + board[4] + board[8] === winTest) {
			if (board === this.board)
				blinkWinSequence(0, 4, 8);
			done = true;
			didWin = true;
		}

	// Chack reverse diagonal
	if (!done)
		if (board[2] + board[4] + board[6] === winTest) {
			if (board === this.board)
				blinkWinSequence(2, 4, 6);
			done = true;
			didWin = true;
		}

	// Print result message
	if (board === this.board) {
		if (this.difficulty === "normal") {
			if (didWin && weapon === this.userWeapon)
				this.printMessage("YOU WIN <i class='fa fa-thumbs-up'></i>", 1500);
			else if (didWin && weapon === this.computerWeapon)
				this.printMessage("I WIN <i class='fa fa-hand-peace-o'></i>", 1500);
		}
		else if (this.difficulty === "invincible", 1500) {
			if (didWin) {
				var random = Math.random();
				if (random < 0.25)
					this.printMessage("You won't beat me", 1500);
				else if (random > 0.25 && random < 0.4)
					this.printMessage("I AM INVINCIBLE", 1500);
				else if (random > 0.4 && random < 0.5)
					this.printMessage("I NEVER LOSE", 1500);
				else
					this.printMessage("I WIN <i class='fa fa-hand-peace-o'></i>", 1500);
			}
		}
	}

	// Draw case
	if (!didWin && numPlays === board.length) {
		if (board === this.board)
			this.printMessage("It's a DRAW <i class='fa fa-meh-o'></i>", 1500);
		done = true;
	}

	return [done, didWin];

};

TicTacToe.prototype.printMessage = function(message, duration) {
	$("#resultMessage").html(message);
	setTimeout(function() {
		$("#resultMessage").html("");
	}, duration);
}

// END TICTACTOE OBJECT


// WHEN DOCUMENT IS READY
// // // // // // // // //
$(document).ready(function() {
	// Layout

	// Margin Top
	var wrapperMarginTop = ($(window).height() - $("#game").height()) / 2;
	if (wrapperMarginTop > 10) {
		$("#game").css("margin-top", wrapperMarginTop);
		$("#game").css("margin-bottom", wrapperMarginTop);
	}

	// TIC TAC TOE Logic
	// // // // // // //

	// Menu

	// Oponnent

	function invincibleOponnent() {
		$("#normalOponnent").removeClass("active");
		$("#invincibleOponnent").addClass("active");
		game.setDifficulty("invincible");

		// Enable click to the other part of the switch
		$("#normalOponnent").one('click', normalOponnent);

	}

	function normalOponnent() {
		$("#invincibleOponnent").removeClass("active");
		$("#normalOponnent").addClass("active");
		game.setDifficulty("normal");

		// Enable click to the other part of the switch
		$("#invincibleOponnent").one('click', invincibleOponnent);

	}

	$("#invincibleOponnent").one('click', invincibleOponnent);

	// Who starts

	function startWithComputer() {
		$("#userStarts").removeClass("active");
		$("#computerStarts").addClass("active");
		game.doesUserStart(false);

		// Enable click to the other part of the switch
		$("#userStarts").one('click', startWithUser);
	}

	function startWithUser() {
		$("#computerStarts").removeClass("active");
		$("#userStarts").addClass("active");
		game.doesUserStart(true);

		// Enable click to the other part of the switch
		$("#computerStarts").one('click', startWithComputer);
	}

	$("#computerStarts").one('click', startWithComputer);

	// Weapon X/O

	function useO() {
		$("#useX").removeClass("active");
		$("#useO").addClass("active");
		game.setUserWeapon("O");

		// Enable click to the other part of the switch
		$("#useX").one('click', useX);
	}

	function useX() {
		$("#useO").removeClass("active");
		$("#useX").addClass("active");
		game.setUserWeapon("X");

		// Enable click to the other part of the switch
		$("#useO").one('click', useO);
	}

	$("#useO").one('click', useO);

	// GAME :
	// // //

	// Set the game
	var game = new TicTacToe("normal", true, "X", $("#board"));

	game.start();

}); // <<< ready
