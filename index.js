const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let windowSizeCoefficient = 1;

const rects = [];

const lines = [];

const line = {
    topX: 0,
    topY: 0,
    botX: 0,
    botY: 0
};

const rect = {
    topX: 0,
    topY: 0,
    botX: 0,
    botY: 0
};

// animatoin, im not using this right now, but will be later
window.RAF = (function(){ 
    return  (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function( callback ){ 
            window.setTimeout(callback, 1000 / 60); 
        }
    ) 
})();

// width and height user window
const {
    clientWidth: width,
    offsetHeight: height
} = document.body;

canvas.width = width;
canvas.height = height;

// canvas clicked and line start drawing
let clicked = false;

const log = text => console.log(text);

canvas.addEventListener("mousedown", drawRect);
canvas.addEventListener("mouseup", cancelDrawRect);
document.body.addEventListener("keyup", log);
canvas.addEventListener("dblclick", startLine);

function startLine(event) {
    const { clientX: x, clientY: y, type } = event;
    canvas.addEventListener("mousemove", drawLine);
    if (clicked) {
        clicked = false;
        line.botX = x;
        line.botY = y;
        lines.push({...line});
    } else {
        clicked = true;
        line.topX = x;
        line.topY = y;
    }
}

function drawLine(event) {
    const { clientX: x, clientY: y, type } = event;
    if (clicked) {
        // reset field each time and draw again
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);

        drawCachedLines();
        drawCachedRects();

        // each time start draw line for current position
        drawSingleLine(line.topX, line.topY, x, y);
    }
    // 
}

function drawRect(event) {
    const { clientX: x, clientY: y, type } = event;
    if (type === "mousemove") {
        context.fillStyle = "white";
        context.fillRect(rect.topX, rect.topY, rect.botX - rect.topX, rect.botY - rect.topY);
        context.fill();

        context.fillStyle = "black";
        context.fillRect(rect.topX, rect.topY, x - rect.topX, y - rect.topY);
        context.fill();

        rect.botX = x;
        rect.botY = y;
    } else {
        rect.topX = x;
        rect.topY = y;
        rect.botY = y;
        rect.botX = x;
    }
    canvas.addEventListener("mousemove", drawRect);
}

function cancelDrawRect(event) {
    rects.push({...rect});
    drawCachedRects();
    drawCachedLines();
    canvas.removeEventListener("mousemove", drawRect);
}

function drawSingleLine(topX, topY, botX, botY) {
    context.beginPath();
    context.moveTo(topX, topY);
    context.lineTo(botX, botY);
    context.stroke();
    context.closePath();
}

function drawCachedLines() {
    // draw each cached line
    lines.forEach(_line => {
      context.beginPath();
      context.moveTo(_line.topX, _line.topY);
      context.lineTo(_line.botX, _line.botY);
      context.stroke();
      context.closePath();  
    });
    return;
}

function drawCachedRects() {
    rects.forEach(_rect => {
        const { topX, topY, botX, botY } = _rect;
        context.fillStyle = 'black';
        context.fillRect(topX, topY, botX - topX, botY - topY);
        context.fill();
    })
}