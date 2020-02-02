var canvas = document.getElementById('jump');
var context = canvas.getContext('2d');

controller = {
    left:false,
    right:false,
    up:false,
    keyListener:function(event){
        var keyState = (event.type == "keydown")?true:false;

        switch(event.keyCode){
            case 37:
                controller.left = keyState;
                break;
            case 38:
                controller.up = keyState;
                break;
            case 39:
                controller.right = keyState;
                break;
        }
    }
}

function createLevel(w, h) {
    const matrix = [];
    let index = h;
    while (index--){
        matrix.push(new Array(w).fill(0));
    }  
    for (let r = 0; r < h; r++){
        for (let c = 0; c < w; c++){
            if (r >= h - h/3) {
                if (c >= 0 && c <= w/3){
                    matrix[r][c] = 1;
                } else if (c >= w - w/3){
                    matrix[r][c] = 1;
                }
            } 
        }
    }
    return matrix;
}

function drawLevel(matrix) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
        if (value != 0) {
            context.fillStyle = 'green';
            context.fillRect(x, y, 1, 1);
        }
        });
    });
}

const rectangle = {
    pos: {x:5, y:0},
    dimensions: {height: 20, width: 20},
    velocity: {x: 0, y:0},
    jumping: true,
}

const level = createLevel(320, 180);

loop = function() {
    if (controller.up && rectangle.jumping == false){
        rectangle.velocity.y -=20;
        rectangle.jumping = true;
    }
    if (controller.left){
        rectangle.velocity.x -= 0.5;
    }
    if (controller.right){
        rectangle.velocity.x += 0.5;
    }
    rectangle.velocity.y += 1.5;
    rectangle.pos.x += rectangle.velocity.x;
    rectangle.pos.y += rectangle.velocity.y;
    rectangle.velocity.x *= 0.9;
    rectangle.velocity.y *= 0.9;


    if (rectangle.pos.y > 180 - 20 - 180/3) {
        if (rectangle.pos.x >= 0 && rectangle.pos.x <= 320/3){
            rectangle.jumping = false;
            rectangle.pos.y = 180 - 20 -180/3;
            rectangle.velocity.y = 0;
        } else if (rectangle.pos.x >= 320 - 320/3 - 20){
            rectangle.jumping = false;
            rectangle.pos.y = 180 - 20 -180/3;
            rectangle.velocity.y = 0;
        }
    }
    if (rectangle.pos.x >= 320/3 && rectangle.pos.x < 320 - 20 - 320/3){
        rectangle.jumping = true;
        if (rectangle.pos.y >= 180+20){
            rectangle.pos.x = 5;
            rectangle.pos.y = 0;
        }
    }

    if (rectangle.pos.x <= 0){
        rectangle.pos.x = 320;
    } else if (rectangle.pos.x >= 320){
        rectangle.pos.x = 0;
    }


    context.fillStyle = "skyblue";
    context.fillRect(0,0,320,180);
    drawLevel(level);
    context.fillStyle = "blue";// hex for red
    context.beginPath();
    context.rect(rectangle.pos.x, rectangle.pos.y, rectangle.dimensions.width, rectangle.dimensions.height);
    context.fill();

    window.requestAnimationFrame(loop);
}


document.addEventListener('keydown', controller.keyListener);
document.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
