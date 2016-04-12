//
/* KONFIGURATION */
//

// Arrays af id'er og navne på ressourcer der bruges i spillet
var tileSoundsArray = ['01_sound', '02_sound', '03_sound', '04_sound', '05_sound', '06_sound', '07_sound', '08_sound', '09_sound', '10_sound', '11_sound', '12_sound', '13_sound', '14_sound', '15_sound', 'flip_card'];
var tileImageArray = ['01_img','02_img','03_img','04_img','05_img','06_img','07_img','08_img','09_img','10_img','11_img','12_img','13_img','14_img','15_img'];
var tileTextArray = ['01_txt','02_txt','03_txt','04_txt','05_txt','06_txt','07_txt','08_txt','09_txt','10_txt','11_txt','12_txt','13_txt','14_txt','15_txt'];

var nrTilesUnturned = tileTextArray.length; // correction

// Stier til ressourcer
var imagePath = "images/";
var soundPath = "sounds/";

// Misc.
var time = undefined;
var tileClass = "memory-game-board_tile";
var tileHiddenClass = tileClass + " memory-game-board_tile-hidden";
var tileBackImage = "card_back.png";

//
/* FUNKTIONER */
//

// Initialiser spillet
function initGame() {
    loadSounds();
    renderTiles();
    startTime();
}

// Pre-load lyde, så de er klar til brug, når spillet er indlæst
function loadSounds() {
    for(var i = 0; i < tileSoundsArray.length; i++) {
        createjs.Sound.registerSound(soundPath + tileSoundsArray[i] + ".mp3", tileSoundsArray[i]);
    }
}

// Start tiden og opdater den indtil spillet er afsluttet
function startTime () {
    var sec = 0;
    time = setInterval(function() {
        sec++;
        var minutes = parseInt(sec/60);
        var displayTime = (minutes === 0 ? "00" : minutes > 9 ? minutes :  "0" + minutes) + ":" + (sec%60 > 9 ? sec%60 :  "0" + sec%60);
        document.getElementById("time").innerHTML = displayTime;
    }, 1000);
}

// Stop og returner tiden
function stopTime () {
    clearInterval(time);
    return document.getElementById("time").innerHTML;
}

// Rendér spillepladen
function renderTiles () {
    var mixedTiles = mixTiles(tileImageArray.concat(tileTextArray));
    var gameboard = document.getElementById("game");

    gameboard.innerHTML = '';
    nrTilesCorrect = 0;

    for(var i = 0; i < mixedTiles.length; i++) {
        gameboard.appendChild(renderTile(mixedTiles[i]));
    }
}

// Rendér en enkelt brik
function renderTile (tileId) {
    var tile = document.createElement("div");

    tile.className = tileClass;
    tile.style.background = 'url("' + imagePath + tileBackImage + '")';
    tile.id = tileId;
//    tile.innerHTML = tileId; // correction

    if(tile.addEventListener) {
        tile.addEventListener("click", turnTile);
    } else if (tileElement.attachEvent) { // IE8 support
        tile.attachEvent("click", turnTile);
    }
    return tile;
}

// Bland brikkerne, så de ligger tilfældigt på spillepladen
function mixTiles (tiles) {
    var counter = tiles.length;
    while (counter > 0) {
        var index = Math.floor(Math.random() * counter);
        counter--;
        var temp = tiles[counter];
        tiles[counter] = tiles[index];
        tiles[index] = temp;
    }
    return tiles;
}

// Vis indholdssiden af en brik og afspil brikkens lyd
function turnTile (e) {
    e.target.style.background = 'url("' + imagePath +  e.target.id + '.png")';
    var playback = playSound(e.target.id.split('_')[0] + '_sound');
    playback.on('complete', function() {
        checkTilesChosen(e.target);
    });
}

// Luk brikker der er blevet vendt
function resetTiles (parentElement, firstTileElement, secondTileElement) {
    var newFirstTileElement = renderTile(firstTileElement.id);
    var newSecondTileElement = renderTile(secondTileElement.id);
    parentElement.replaceChild(newFirstTileElement, firstTileElement);
    parentElement.replaceChild(newSecondTileElement, secondTileElement);
}

// Post brugerns score/tid til serveren
function saveUserScore (userScore) {
    $.post("/user",
        {
            time: userScore
        },
        function(data, status) {
            console.log('Bruger score sendt til DB!');
        }
    );
}

// Afspil en lyd
function playSound (soundId) {
    return createjs.Sound.play(soundId);
}

// Hent sejrs besked
function getVictoryMessage (userScore) {
    return 'Du klarede det i tiden: ' + userScore + '\n\nSkal vi tage et spil mere?';
}

// Tjek om en eller flere brikker er blevet vendt og om de matcher. Hvis de matcher, tjek om spillet er slut.
function checkTilesChosen (tileElement) {
    var activeTiles = document.getElementsByClassName('active');
    if(activeTiles.length > 0) {
        if(activeTiles[0].id.split('_')[0] === tileElement.id.split('_')[0]) {

            var playback = playSound('flip_card');
            playback.on('complete', function() {
                activeTiles[0].className = tileHiddenClass;
                tileElement.className = tileHiddenClass;
            });

            nrTilesUnturned--; // correction
            if(nrTilesUnturned === 0) { // correction
                var userScore = stopTime();
                saveUserScore(userScore);

                if (confirm(getVictoryMessage(userScore))) {
                    initGame();
                }
            }
        } else {
            resetTiles(document.getElementById("game"), activeTiles[0], tileElement);
        }
    } else {
        if (tileElement.removeEventListener) {
            tileElement.removeEventListener("click", turnTile);
        } else if (tileElement.detachEvent) { // IE8 support
            tileElement.detachEvent("click", turnTile);
        }
        tileElement.className = tileElement.className + " active";
    }
}