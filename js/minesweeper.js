//Game variables
var time = 0;
var difficulty;
var bombTotal;
var flags_planted;
var rows;
var columns;
var firstClick;
var firstP = [0, 0]
var timeInterval;
var dummy;
var tilesLeft; 

function buildGrid() {

    // Create new grid
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";
	
	flags_planted=0
	firstClick = true;
	
	//Set difficulty parameters
	if(difficulty == "1"){
		columns = 16;
		rows = 16;
		bombTotal = 40;
	}
	else if(difficulty == "2"){
		columns = 30;
		rows = 16;
		bombTotal = 99;
	}
	else {
		columns = 6;
		rows = 6; 
		bombTotal = 10;
	}
	//Calculate how many tiles to uncover until victory
	tilesLeft = rows * columns;
	tilesLeft -= bombTotal; 
	updateFlagCount();
	
    // Build grid
    var tile;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
			tile.y = y; //row
			tile.x = x; //column
			tile.bomb = false;
			tile.lvl = 0;			
        }
    }
    
    var style = window.getComputedStyle(tile);
    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";
}

//Create individual tiles
function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
	tile.addEventListener("mousedown", limbo );
	tile.addEventListener("mouseup", unlimbo );
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks

    return tile;
}

//Functions for mouse down state
function limbo(){
	var smiley = document.getElementById("smiley");
    smiley.classList.add("face_limbo");
	
}
function unlimbo(){
	var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_limbo");
	
}

//Initialize game
function startGame() {
    buildGrid();
	window.clearInterval(timeInterval);
}

//Functions for smiley interaction
function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
	smiley.classList.remove("face_lose");
	smiley.classList.remove("face_win");
}

function handleTileClick(event) {
    // Left Click
    if (event.which === 1) {
        //Reveal the tile
		if(!this.classList.contains("flag")) {
			updateTileImage(this);
			if(firstClick){
				//Place bombs and update neighbouring hidden tiles
				startTimer();
				firstClick = false;
				firstP[0] = this.y;
				firstP[1] = this.x;
				this.classList.remove("hidden");
				tilesLeft--;
				placeBombs();
				revSurrounding(this);
				
			}
			else{
				if(this.bomb == true){
					this.classList.add("mine_hit")
					endGame(false);
				}
				else{
					updateTileImage(this);
					tilesLeft--;
					if(this.lvl==0){
						revSurrounding(this);
					}
					if(!tilesLeft>0){endGame(true);}
				}
			}
				
		}
		
    }
    // Middle Click
    else if (event.which === 2) {
        //Reveal adjacent tiles in an area
		var r;
		var c;
		var index;
		var mainTile;
		var flags = 0;
		if(!this.classList.contains("flag")){
			if(!this.classList.contains("hidden")){
				if(!this.lvl==0){
					//Calculate flag count
					for(var y=-1; y <=1; y++){
						for(var x=-1; x<=1; x++){

							if(!y && !x){
								continue;
							}
							
							r = this.y + y;
							c = this.x + x;
							
							if(r < 0 || r >= rows || c < 0 || c >= columns){
								
								continue;
							}
							index = r*columns + c;
							mainTile = document.getElementById("minefield").childNodes[index];
							if(mainTile.classList.contains("flag")){
								flags++;
							}	
						}
					}
					if(flags==this.lvl){
						for(var y=-1; y <=1; y++){
							for(var x=-1; x<=1; x++){

								if(!y && !x){
									continue;
								}
								
								r = this.y + y;
								c = this.x + x;
								
								if(r < 0 || r >= rows || c < 0 || c >= columns){
									
									continue;
								}
								index = r*columns + c;
								mainTile = document.getElementById("minefield").childNodes[index];
								if(mainTile.classList.contains("flag")){
									continue;
								}
								if(!mainTile.classList.contains("hidden")){
									continue;
								}
								updateTileImage(mainTile);
								tilesLeft--;
								if(mainTile.bomb){
									endGame(false);
								}
								if(mainTile.lvl==0){
									revSurrounding(mainTile);
								}								
							}
						}
					}
				}
			}
		}
    }
    // Right Click
    else if (event.which === 3) {
        //Toggle flag, which makes tile untargetable 
		if(this.classList.contains("flag")){
			this.classList.remove("flag");
			flags_planted--;
		}
		else{
			if(this.classList.contains("hidden")){
				this.classList.add("flag");
				flags_planted++;
			}
			
		}
		
		
    }
	updateFlagCount();
}

var updateTileImage = function(tile){
	//Update tile image according to state 
	if(!tile.bomb){
		if(tile.lvl==0){
			tile.classList.remove("hidden");
		}
		if(tile.lvl==1){
			tile.classList.remove("hidden");
			tile.classList.add("tile_1");
			
		}
		if(tile.lvl==2){
			tile.classList.remove("hidden");
			tile.classList.add("tile_2");
		}
		if(tile.lvl==3){
			tile.classList.remove("hidden");
			tile.classList.add("tile_3");
		}
		if(tile.lvl==4){
			tile.classList.remove("hidden");
			tile.classList.add("tile_4");
		}
		if(tile.lvl==5){
			tile.classList.remove("hidden");
			tile.classList.add("tile_5");
		}
		if(tile.lvl==6){
			tile.classList.remove("hidden");
			tile.classList.add("tile_6");
		}
		if(tile.lvl==7){
			tile.classList.remove("hidden");
			tile.classList.add("tile_7");
		}
		if(tile.lvl==8){
			tile.classList.remove("hidden");
			tile.classList.add("tile_8");
		}
	}
	else{
		tile.classList.remove("hidden");
		tile.classList.add("mine");
	}
}
	
function revSurrounding(tile){
	//Recursively reveal surrounding tiles
	var r;
	var c;
	var mainTile; 
	var index = 0;
	for(var y=-1; y <=1; y++){
		for(var x=-1; x<=1; x++){
			if(!y && !x){
				continue;
			}
			
			r = tile.y + y;
			c = tile.x + x;
			
			if(r < 0 || r >= rows || c < 0 || c >= columns){
				
				continue;
			}
			index = r*columns + c;
			mainTile = document.getElementById("minefield").childNodes[index];
			if(mainTile.classList.contains("flag")){
				continue;
			}
			if(!mainTile.classList.contains("hidden")){
				continue;
			}
			updateTileImage(mainTile);
			tilesLeft--;
			if(mainTile.lvl==0){
				revSurrounding(mainTile);	
			}
		}
	}
}
	
var placeBombs = function (x,y){
	//Place bombs across board randomly, excluding first clicked tile and its neighbours 
	var tile = randomTile();
	var tileArray = [];
	for(var i=0; i<bombTotal; i++){
		while(tile.bomb == true){
			tile = randomTile();
			while((tile.y <= firstP[0] +1) && (tile.y >= firstP[0] - 1) && (tile.x <= firstP[1]+1) &&(tile.x >= firstP[1]-1)){
				tile = randomTile();
			}
		}
		tile.bomb=true;
		tile.lvl = 0;
		tileArray.push(tile);
	}
	for(var i=0; i<tileArray.length; i++){
		updateTiles(tileArray[i]);
	}
}

var randomTile = function (){
	//Select random tile from grid
	var index = 0;

	index = Math.floor(Math.random()*rows*columns);
	
	var tile = document.getElementById("minefield").childNodes[index];
	return tile;
	
}

function endGame(bool){
	//Displays alert to player according to victory or defeat conditions
	window.clearInterval(timeInterval);
	if(bool){
		document.getElementById("smiley").classList.add("face_win");
		window.alert("Congratulations! \nYou completed the sweep in " + timeValue + " seconds.  \nPress the smiley to play again");
	}
	else{
		
		revealBoard();
		document.getElementById("smiley").classList.add("face_lose");
		window.alert("Game Over! \nPress the smiley to play again");
		
	}
}
function revealBoard(){
	//Reveals all other mines on board
	var field = document.getElementById("minefield");
	for(var i = 0; i < field.childElementCount;i++){
		if(field.childNodes[i].bomb == true){
			
			field.childNodes[i].classList.remove("hidden");
			field.childNodes[i].classList.add("mine");
			
		}
	}
		
}
//Full reveal function used for testing
/* function revealFullBoard(){
	
	var field = document.getElementById("minefield");
	for(var i = 0; i < field.childElementCount;i++){
		field.childNodes[i].classList.remove("hidden");
		if(field.childNodes[i].bomb == true){
			field.childNodes[i].classList.add("mine"); 
		}
		updateTileImage(field.childNodes[i]);
	}
		
} */

var updateTiles = function(tile){
	//Place number of surrounding mine values in tiles
	var r;
	var c;
	var mainTile; 
	for(var y=-1; y <=1; y++){
		for(var x=-1; x<=1; x++){
			if(!y && !x){
				continue;
			}
			
			r = tile.y + y;
			c = tile.x + x;
			
			if(r < 0 || r >= rows || c < 0 || c >= columns){
				
				continue;
			}
			
			var index = 0;
			index = r*columns + c;
			mainTile = document.getElementById("minefield").childNodes[index];
			if(mainTile.bomb){
				mainTile.lvl = 0;
				continue;
			}
			mainTile.lvl= mainTile.lvl + 1;
		}
	}
	
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    difficulty = difficultySelector.selectedIndex;
}

//Functions for time value
function startTimer() {
    timeValue = 0;
    timeInterval=window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue + " s";
}

function updateFlagCount() {
	//Updates remaining mines section
	var score = -1;
	score = bombTotal - flags_planted;
    document.getElementById("flagCount").innerHTML = score;
}