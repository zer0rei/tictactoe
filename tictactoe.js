// // // // // // // // //
// TIC TAC TOE (by HE)  //
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

	var userWeapon = "X";
	var computerWeapon = "O";
	// Menu

	// Oponent
	$("#normalOponent").click(function() {
		$("#invincibleOponent").removeClass("active");
		$(this).addClass("active");
	});

	$("#invincibleOponent").click(function() {
		$("#normalOponent").removeClass("active");
		$(this).addClass("active");
	});

	// Who starts
	$("#computerStarts").click(function() {
		$("#userStarts").removeClass("active");
		$(this).addClass("active");
	});

	$("#userStarts").click(function() {
		$("#computerStarts").removeClass("active");
		$(this).addClass("active");
	});

	// Weapon X/O
	$("#useX").click(function() {
		$("#useO").removeClass("active");
		$(this).addClass("active");
		userWeapon = "X";
		computerWeapon = "O";
	});

	$("#useO").click(function() {
		$("#useX").removeClass("active");
		$(this).addClass("active");
		userWeapon = "O";
		computerWeapon = "X";
	});

	// Board

	var fullSpots = [];
	var numberFullSpots = 0;
	// Click a spot
	$(".spot").click(function() {
		$(this).unbind();
		$(this).children(".content").html(userWeapon);
		fullSpots[this.id] = true;
		numberFullSpots++;

		// Fill Random Spot
		if (numberFullSpots < 9) {
		var spot;
		do
			spot = "spot" + (Math.floor(Math.random() * 9) + 1);
		while (fullSpots[spot]);

		$("#" + spot).children(".content").html(computerWeapon);
		fullSpots[spot] = true;
		numberFullSpots++;
		}

	});


}); // <<< ready
