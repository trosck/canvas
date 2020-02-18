const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
import "./style.scss";
import { Drawing } from "./draw.js"; // i dont know why, but that doesnt imported,
//                                         and im just import this above in html
let windowSizeCoefficient = 1;

const rects = [];

const lines = [];

const buttons = [{
    topX: 10,
    topY: 10,
    botX: 110,
    botY: 40
},{
    topX: 150,
    topY: 10,
    botX: 260,
    botY: 40
}];

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


const drawButton =  {
    // create button
    create(fillInner = "white", fillBorder = "black", fillText = "black") {
        context.fillStyle = fillBorder;
        context.fillRect(10, 10, 110, 40);
        
        context.fillStyle = fillInner;
        context.fillRect(12, 12, 106, 36);

        context.fillStyle = fillText;
        context.font = "20px serif";
        context.fillText("Create rect", 20, 35);
    },

    // one more button
    oneMore(fillInner = "white", fillBorder = "black", fillText = "black") {
        context.fillStyle = fillBorder;
        context.fillRect(150, 10, 110, 40);

        context.fillStyle = fillInner;
        context.fillRect(152, 12, 106, 36);

        context.fillStyle = fillText;
        context.font = "20px serif";
        context.fillText("Create rect", 160, 35);
    }
}

// animatoin, im not using this right now, but will be later
window.RAF = (function(){ 
    return  (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     || 
        function(callback){ 
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

drawButton.create();
drawButton.oneMore();

// canvas clicked and line start drawing
let clicked = false;

const log = (...text) => console.log(...text);

// events
canvas.addEventListener("mouseover", handleMouseOver);
canvas.addEventListener("mousedown", drawRect);
canvas.addEventListener("mouseup", cancelDrawRect);
document.body.addEventListener("keyup", log);
canvas.addEventListener("dblclick", startLine);

function handleMouseOver(event) {
    const { clientX: x, clientY: y } = event;
    buttons.forEach((button, index) => {
        const { topX, topY, botX, botY } = button;
        console.log(button, x, y)
        if (topX < x < (botX - topX) && topY < y < (botY - topY)) {
            index === 0 ? drawButton.create("yellow") : 
            index === 1 ? drawButton.oneMore("yellow") : null;
        }
    })
}

function startLine(event) {
    const { clientX: x, clientY: y, type } = event;
    checkClickedRect(x, y)
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

        context.fillStyle = "black";
        context.fillRect(rect.topX, rect.topY, x - rect.topX, y - rect.topY);

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
    // context.clearRect(0, 0, width, height);
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
        Drawing.DrawRect(_rect, context);
        // const { topX, topY, botX, botY } = _rect;
        // context.fillStyle = 'black';
        // context.fillRect(topX, topY, botX - topX, botY - topY);
        // context.fill();
    })
}

function checkClickedRect(x, y) {
    console.log(rects, x, y)
    for (let i = 0; i < rects.length; i++) {
        const { topX, topY, botY, botX } = rects[i];
        if (topX < x < (botX - topX) && topY < y < (botY - topY)) return i;
    }
    return -1;
}
