// * gets canvas from index.html file using id
const canvas = document.getElementById('tetris');
// * sets the depth of the canvas
const context = canvas.getContext('2d');

//* sets the dimensions of the canvas
context.scale(20, 20);

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length -1; y > 0; --y){
    for (let x = 0; x < arena[y].length; ++x){
      if (arena[y][x] === 0){
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
    
    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

//* check for collision
function collide(arena, player){
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      //* checks matrix and continues if not 0 and then checks to see if row and column exist
      if (m[y][x] !== 0 && 
        (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true; 
      }
    }
  }
  return false;
}

//* creates the board so we know where there are fixed blocks
function createMatrix(w, h) {
  const matrix = [];
  while (h--){
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

//* self explanantory
function createPiece(type){
  if (type === 'T'){
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
      ];
  } else if (type == 'O'){
    return [
      [2,2],
      [2,2]
    ];
  } else if (type === 'L'){
    return [
      [0,3,0],
      [0,3,0],
      [0,3,3]
    ];
  } else if (type === 'J'){
    return [
      [0,4,0],
      [0,4,0],
      [4,4,0]
    ];
  } else if (type === 'I') {
    return [
      [0,5,0,0],
      [0,5,0,0],
      [0,5,0,0],
      [0,5,0,0]
    ];
  } else if (type === 'S') {
    return [
      [0,0,0],
      [0,6,6],
      [6,6,0],
    ];
  } else if (type === 'Z'){
    return [
      [0,0,0],
      [7,7,0],
      [0,7,7]
    ];
  }
}

//* draw the full board
function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
}

//* draw the block on the canvas
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player){
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0){
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    })
  })
}

//* called when the player presses down, sets drop counter to zero so the block does not double drop
function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)){
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

//* moves the player in the x direction and checks for collisions
function playerMove(dir){
  player.pos.x += dir;
  if (collide(arena, player)){
    player.pos.x -= dir;
  }
}

//* gives player new piece and sends them to the top
function playerReset(){
  const pieces = 'ILOSZTJ';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) -
                (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)){
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

//* rotates piece
function playerRotate(dir){
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1))
    if (offset > player.matrix[0].length) {
      rotate(plater.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

//* rotates pieces
function rotate(matrix, dir){
  for (let y = 0; y < matrix.length; ++y){
    for (let x = 0; x < y; ++x){
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ];
    }
  }
  if (dir > 0){
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }

}

//* makes the piece drop
let dropCounter = 0; 
let dropInterval = 1000;

let lastTime = 0;


function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval){
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);

}

function updateScore(){
  document.getElementById('score').innerText = player.score;
}

const colors = [
  null,
  'purple',
  'yellow',
  'orange',
  'blue',
  'aqua',
  'green',
  'red'
];


//* creates the array matrix containing all the pieces
const arena = createMatrix(12, 20);

const player = {
  pos: {x:0, y:0},
  matrix: null,
  score: 0,
}

//* checks to see what key has been pressed and acts accordingly
document.addEventListener('keydown', event => {
  switch(event.keyCode){
    case 37:
      playerMove(-1);
      break;
    case 39:
      playerMove(1);
      break; 
    case 40:
      playerDrop();
      break;
    case 81:
      playerRotate(-1);
      break;
    case 87:
      playerRotate(1);
  }
})

playerReset();
update();
updateScore();
