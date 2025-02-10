(function (window, document) {
    CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {
        let textSize = parseInt(this.font.replace(/\D/gi, ''));
        let textParts = [];
        let textPartsNo = 0;
        let words = [];
        let currLine = '';
        let testLine = '';
        str = str || '';
        x = x || 0;
        y = y || 0;
        w = w || this.canvas.width;
        lh = lh || 1;
        method = method || 'fill';

        textParts = str.split('\n');
        textPartsNo = textParts.length;

        for (let i = 0; i < textParts.length; i++) {
            words[i] = textParts[i].split(' ');
        }

        textParts = [];

        for (let i = 0; i < textPartsNo; i++) {
            currLine = '';
            for (let j = 0; j < words[i].length; j++) {
                testLine = currLine + words[i][j] + ' ';
                if (this.measureText(testLine).width > w && j > 0) {
                    textParts.push(currLine);
                    currLine = words[i][j] + ' ';
                } else {
                    currLine = testLine;
                }
            }
            textParts.push(currLine);
        }

        for (let i = 0; i < textParts.length; i++) {
            if (method === 'fill') {
                this.fillText(textParts[i].trim(), x, y + (textSize * lh * i));
            } else if (method === 'stroke') {
                this.strokeText(textParts[i].trim(), x, y + (textSize * lh * i));
            } else if (method === 'none') {
                return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
            } else {
                console.warn('drawBreakingText: ' + method + 'Text() does not exist');
                return false;
            }
        }

        return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
    };
})(window, document);

let canvas = document.createElement('canvas');
let canvasWrapper = document.getElementById('canvasWrapper');
canvasWrapper.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
let ctx = canvas.getContext('2d');
let padding = 15;
let textTop = 'I use coding torque to learn';
let textBottom = 'web development by creating projects';
let textSizeTop = 10;
let textSizeBottom = 10;
let image = new Image();

// Setting the crossOrigin attribute
image.crossOrigin = "Anonymous";

image.onload = function () {
    resetCanvas();
    draw();
};

document.getElementById('imgURL').oninput = function () {
    image.src = this.value;
};

document.getElementById('imgFile').onchange = function () {
    let reader = new FileReader();
    reader.onload = function () {
        image.src = reader.result;
    };
    reader.readAsDataURL(this.files[0]);
};

document.getElementById('textTop').oninput = function () {
    textTop = this.value;
    draw();
};

document.getElementById('textBottom').oninput = function () {
    textBottom = this.value;
    draw();
};

document.getElementById('textSizeTop').oninput = function () {
    textSizeTop = parseInt(this.value);
    draw();
    document.getElementById('textSizeTopOut').textContent = this.value;
};

document.getElementById('textSizeBottom').oninput = function () {
    textSizeBottom = parseInt(this.value);
    draw();
    document.getElementById('textSizeBottomOut').textContent = this.value;
};

document.getElementById('trueSize').onchange = function () {
    if (this.checked) {
        canvas.classList.remove('fullwidth');
    } else {
        canvas.classList.add('fullwidth');
    }
};

document.getElementById('export').onclick = function () {
    try {
        let img = canvas.toDataURL('image/png');
        let link = document.createElement("a");
        link.download = 'My_Meme.png';
        link.href = img;
        link.click();

        let win = window.open('', '_blank');
        win.document.write('<img style="box-shadow: 0 0 1em 0 dimgrey;" src="' + img + '"/>');
        win.document.write('<h1 style="font-family: Helvetica; font-weight: 300">Right Click > Save As<h1>');
        win.document.body.style.padding = '1em';
    } catch (error) {
        console.error("Failed to export image: ", error);
    }
};

function resetCanvas() {
    canvas.outerHTML = '';
    canvas = document.createElement('canvas');
    canvasWrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    draw();
}

function style(font, size, align, base) {
    ctx.font = size + 'px ' + font;
    ctx.textAlign = align;
    ctx.textBaseline = base;
}

function draw() {
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    style('Impact', textSizeTop, 'center', 'top');
    ctx.lineWidth = textSizeTop / 12;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.drawBreakingText(textTop, canvas.width / 2, padding, canvas.width - (padding * 2), 1.1, 'stroke');
    ctx.drawBreakingText(textTop, canvas.width / 2, padding, canvas.width - (padding * 2), 1.1, 'fill');

    style('Impact', textSizeBottom, 'center', 'bottom');
    ctx.lineWidth = textSizeBottom / 12;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.drawBreakingText(textBottom, canvas.width / 2, canvas.height - padding, canvas.width - (padding * 2), 1.1, 'stroke');
    ctx.drawBreakingText(textBottom, canvas.width / 2, canvas.height - padding, canvas.width - (padding * 2), 1.1, 'fill');
}
