let score = 0;
function getScore(){
    return score;
}

function addScore(puntos){
    score += puntos;
}

function resetScore(){
    score = 0;
}

module.exports = { getScore, addScore, resetScore }