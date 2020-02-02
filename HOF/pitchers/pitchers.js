function errorHandler(evt){
    if (evt.target.error.name == "NotReadableError"){
        alert("Cannot read file!");
    }
}


function handleFiles(files){
    if (window.FileReader){
        getAsText(files[0]);
    } else{
        alert('filereader are not supported in this browser');
    }
}

function getAsText(filetoRead){
    var reader = new FileReader();
    reader.readAsText(filetoRead);
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function grabPlayer(players){
     var rand = Math.floor(Math.random()*players.length)+1;
     return players[rand];
}

function randomStat(player){
    var rand = Math.floor(Math.random() * player.length) + 1;
    return rand;
}

function loadHandler(event){
    var csv = event.target.result;
    processData(csv);
}

function play(players){
    var hof1 = grabPlayer(players);
    var hof2 = grabPlayer(players);
    var player1 = document.getElementById("p1");
    player1.innerHTML = hof1[0];
    var player2 = document.getElementById("p2");
    player2.innerHTML = hof2[0];
    var index = randomStat(hof1);
    var stat = players[0][index];
    if (index === 14 ) {
        document.getElementById("s").innerHTML = "a higher career " + stat;
    } else if (index === 15){
        document.getElementById("s").innerHTML = "a lower career " + stat;
    } else {
        document.getElementById("s").innerHTML = "more career " + stat;
    }
    if(hof1[index] > hof2[index]){
        document.getElementById("p1").onclick = function(){
            alert("Correct! " + hof1[0] + " has " + hof1[index] + " " + stat);
            play(players);
        }
        document.getElementById("p2").onclick = function(){
            alert("Wrong!");
            play(players);
        }
    } else if (hof1[index] < hof2[index]){
        document.getElementById("p2").onclick = function(){
            alert("Correct!");
            play(players);
        }
        document.getElementById("p1").onclick = function(){
            alert("Wrong!");
            play(players);
        }
    } else{
        document.getElementById("p2").onclick = function(){
            alert("Trick Question! It's a Tie!");
            play(players);
        }
        document.getElementById("p1").onclick = function(){
            alert("Trick Question! It's a Tie!");
            play(players);
        }
    }
}

function processData(csv){
    var allPlayers = csv.split("\n");
    var players = [];
    for (let i = 0; i < allPlayers.length; i++){
        var stats = allPlayers[i].split(',');
        var player = [];
        for (let j = 0; j < stats.length; j++){
            if (i !== 0){
                if(j == 0){
                    player.push(stats[j]);
                } else {
                    player.push(parseFloat(stats[j]));
                }
            } else {
                player.push(stats[j]);
            }
        }
        players.push(player);
    }
    while(true){
        play(players);
    }
}
