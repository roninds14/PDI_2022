let buttonImg = document.getElementById("btn-img")
let buttonProcessa = document.getElementById("btn-processa")
let buttonCinza = document.getElementById("btn-tons-cinza")
let buttonUp = document.getElementById("btn-up")
let buttonSave = document.getElementById("btn-save")
let buttonSalPimenta = document.getElementById("btn-tons-sal-pimenta")
let buttonSepararTons = document.getElementById("btn-separar-tons")
let buttonHistograma = document.getElementById("btn-histograma")
let buttonHistogramaColor = document.getElementById("btn-histograma-color")
let buttonSoma = document.getElementById("btn-soma")
let buttonMedia = document.getElementById("btn-media")
let buttonMediana = document.getElementById("btn-mediana")
let buttonLaplaciano = document.getElementById("btn-laplaciano")
let buttonRealceLaplaciano = document.getElementById("btn-realce-laplaciano")
let buttonSobel = document.getElementById("btn-sobel")
let inputFile = document.getElementById("input-file")
let canvasOriginal = document.getElementById("img_00")
let canvasProcessado = document.getElementById("img_01")

let inImg
const SOMA = 10

let buttonEqLena = document.getElementById("btn-eqlena")
let buttonPseudo = document.getElementById("btn-pseudo")
let buttonLoG = document.getElementById("btn-log")
let buttonDCT = document.getElementById("btn-dct")
let buttonDCTAlta = document.getElementById("btn-dct-alta")
let buttonDCTBaixa = document.getElementById("btn-dct-baixa")
let buttonDCTRuido = document.getElementById("btn-dct-ruido")
let buttonIDCT = document.getElementById("btn-idct")
let buttonMax = document.getElementById("btn-max")
let buttonMin = document.getElementById("btn-min")
let buttonMed = document.getElementById("btn-med")

let cores = [
    { r: 0, g: 0, b: 0 },     //preto
    { r: 255, g: 0, b: 255 }, //magenta
    { r: 0, g: 0, b: 255 },   //azul
    { r: 0, g: 255, b: 255 }, //ciano
    { r: 0, g: 255, b: 0 },   //verde
    { r: 255, g: 255, b: 0 }, //amarelo 
    { r: 255, g: 0, b: 0 },   //vermelho
];
let addRuidoDCT = false
let matrixDCT = null
let maxDCT

const PI = 3.142857



/*********************************
 * CONTEUDO DO PRIMEIRO BIMESTRE *
 *********************************/

canvasOriginal.addEventListener("mousemove", (e) => {
    const POSITION = canvasOriginal.getBoundingClientRect();
    const xWindow = e.clientX
    const yWindow = e.clientY

    const xCanvas = parseInt(xWindow - POSITION.x)
    const yCanvas = parseInt(yWindow - POSITION.y)

    const src = new Uint32Array(inImg.data.buffer)

    const position = xCanvas + canvasOriginal.width * yCanvas

    const r = src[position] & 0xFF
    const g = (src[position] >> 8) & 0xFF
    const b = (src[position] >> 16) & 0xFF

    document.getElementById("x").innerHTML = xCanvas
    document.getElementById("y").innerHTML = yCanvas

    document.getElementById("red").innerHTML = r
    document.getElementById("green").innerHTML = g
    document.getElementById("blue").innerHTML = b

    const HLV = converteHLV(new Array(r, g, b))

    document.getElementById("lum").innerHTML = HLV[0]
    document.getElementById("sat").innerHTML = HLV[1]
    document.getElementById("hue").innerHTML = HLV[2]
})

canvasOriginal.addEventListener("click", (e) => {
    const POSITION = canvasOriginal.getBoundingClientRect();
    const xWindow = e.clientX
    const yWindow = e.clientY

    const xCanvas = parseInt(xWindow - POSITION.x)
    const yCanvas = parseInt(yWindow - POSITION.y)

    const src = new Uint32Array(inImg.data.buffer)

    const position = xCanvas + canvasOriginal.width * yCanvas

    const r = src[position] & 0xFF
    const g = (src[position] >> 8) & 0xFF
    const b = (src[position] >> 16) & 0xFF

    document.getElementById("x_click").innerHTML = xCanvas
    document.getElementById("y_click").innerHTML = yCanvas

    document.getElementById("red_click").innerHTML = r
    document.getElementById("green_click").innerHTML = g
    document.getElementById("blue_click").innerHTML = b

    const HLV = converteHLV(new Array(r, g, b))

    document.getElementById("lum_click").innerHTML = HLV[0]
    document.getElementById("sat_click").innerHTML = HLV[1]
    document.getElementById("hue_click").innerHTML = HLV[2]

    document.getElementById("canvas-click").style.display = "flex"
})

document.getElementById("canvas-processado").addEventListener("click", (e) => {
    if (!addRuidoDCT) return

    const { width, height } = inImg

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    const POSITION = canvasProcessado.getBoundingClientRect();
    const xWindow = e.clientX
    const yWindow = e.clientY

    const xCanvas = parseInt(xWindow - POSITION.x)
    const yCanvas = parseInt(yWindow - POSITION.y)

    matrixDCT[xCanvas][yCanvas] = maxDCT

    let arange = {
        max: Number.MIN_SAFE_INTEGER,
        min: Number.MAX_SAFE_INTEGER
    };

    let matrix = iDctTransform(matrixDCT, arange)

    matrix = equalizacao(matrix, arange)

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.fillStyle = rgbToHex(matrix[i][j], matrix[i][j], matrix[i][j])
            ctx.fillRect(i, j, 1, 1)
        }
    }

    let buttons = document.getElementsByTagName("button")

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false
    }

    addRuidoDCT = false
    matrixDCT = null
})

buttonImg.addEventListener("click", () => {
    addCanvas()
    inputFile.click()
})

buttonSave.addEventListener("click", () => {
    addCanvas()
    const a = document.createElement('a')
    a.download = 'img-alterada.png';
    a.href = canvasOriginal.toDataURL();
    a.click()
})

buttonProcessa.addEventListener("click", () => {
    addCanvas()
    processaImage()
})

buttonCinza.addEventListener("click", () => {
    addCanvas()
    converterParaCinza()
})

buttonUp.addEventListener("click", () => {
    let ctx = canvasOriginal.getContext('2d')
    ctx.drawImage(canvasProcessado, 0, 0)
    let ctxProcessado = canvasProcessado.getContext('2d')
    inImg = ctxProcessado.getImageData(0, 0, inImg.width, inImg.height)
})

buttonSalPimenta.addEventListener("click", () => {
    addCanvas()
    const canvas = ruidoSalPimenta()
    const { width, height } = canvas
    canvasProcessado.width = width
    canvasProcessado.height = height
    let ctx = canvasProcessado.getContext('2d')
    ctx.drawImage(canvas, 0, 0)
})

buttonSepararTons.addEventListener("click", () => {
    addCanvas()
    separarTons()
})

buttonHistograma.addEventListener("click", () => {
    addCanvas()
    equalizacaoHistograma(true)
})

buttonHistogramaColor.addEventListener("click", () => {
    addCanvas()
    equalizacaoHistograma(false)
})

buttonSoma.addEventListener("click", () => {
    addCanvas()
    soma()
})

buttonMedia.addEventListener("click", () => {
    addCanvas()
    media()
})

buttonMediana.addEventListener("click", () => {
    addCanvas()
    mediana()
})

buttonLaplaciano.addEventListener("click", () => {
    addCanvas()
    laplaciano(8, 8)
})

buttonRealceLaplaciano.addEventListener("click", () => {
    addCanvas()
    laplaciano(9, 2)
})

buttonSobel.addEventListener("click", () => {
    addCanvas()
    sobel()
})

window.addEventListener('DOMContentLoaded', () => {
    inputFile.addEventListener("change", () => {
        let file = inputFile.files.item(0)
        photoName = file.name;

        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (event) {
            image = new Image()
            image.src = event.target.result
            image.onload = () => {
                const context = canvasOriginal.getContext('2d')

                canvasOriginal.width = image.width
                canvasOriginal.height = image.height
                context.drawImage(image, 0, 0)

                inImg = context.getImageData(0, 0, image.width, image.height)

                let tons = document.getElementById("tons")
                tons.style.display = "block"

                const POSITION = canvasOriginal.getBoundingClientRect();

                let top = POSITION.y + 10
                let left = POSITION.x + inImg.width + 50

                tons.style.top = top + "px"
                tons.style.left = left + "px"
            }
        }

        document.getElementById("canvas-click").style.display = "none"
    })
})

function processaImage() {
    const width = inImg.width
    const height = inImg.height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let row = 0
    let colunm = 0

    for (let i = 0; i < src.length; i++) {
        let r = src[i] & 0xFF
        let g = (src[i] >> 8) & 0xFF
        let b = (src[i] >> 16) & 0xFF

        if (i && !(i % width)) {
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r, g, b);
        ctx.fillRect(colunm, row, 1, 1);
        colunm++
    }
}

function converterParaCinza() {
    const width = inImg.width
    const height = inImg.height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let row = 0
    let colunm = 0

    for (let i = 0; i < src.length; i++) {
        let r = src[i] & 0xFF
        let g = (src[i] >> 8) & 0xFF
        let b = (src[i] >> 16) & 0xFF

        let itsd = parseInt(0.299 * r + 0.587 * g + 0.114 * b)

        if (i && !(i % width)) {
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(itsd, itsd, itsd);
        ctx.fillRect(colunm, row, 1, 1);
        colunm++
    }
}

function ruidoSalPimenta() {
    const { width, height } = inImg
    const percent = parseInt(width * height * 0.01)
    const total = width * height

    const src = new Uint32Array(inImg.data.buffer)

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    let row = 0
    let colunm = 0

    for (let i = 0; i < src.length; i++) {
        let r = src[i] & 0xFF
        let g = (src[i] >> 8) & 0xFF
        let b = (src[i] >> 16) & 0xFF

        if (i && !(i % width)) {
            row++
            colunm = 0
        }

        if (Math.random() * (total - 0) + 0 < percent) {
            let rgb = "#FFFFFF"

            if (Math.random() < 0.5) {
                rgb = "#000000"
            }

            ctx.fillStyle = rgb
        }
        else {
            ctx.fillStyle = rgbToHex(r, g, b);
        }

        ctx.fillRect(colunm, row, 1, 1);
        colunm++
    }

    return canvas
}

function separarTons() {
    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const canvasRed = document.createElement("canvas")
    const ctxRed = canvasRed.getContext('2d')
    canvasRed.width = width
    canvasRed.height = height

    const canvasGreen = document.createElement("canvas")
    const ctxGreen = canvasGreen.getContext('2d')
    canvasGreen.width = width
    canvasGreen.height = height

    const canvasBlue = document.createElement("canvas")
    const ctxBlue = canvasBlue.getContext('2d')
    canvasBlue.width = width
    canvasBlue.height = height

    let row = 0
    let colunm = 0

    for (let i = 0; i < src.length; i++) {
        let r = src[i] & 0xFF
        let g = (src[i] >> 8) & 0xFF
        let b = (src[i] >> 16) & 0xFF

        if (i && !(i % width)) {
            row++
            colunm = 0
        }

        ctxRed.fillStyle = rgbToHex(r, 0, 0)
        ctxRed.fillRect(colunm, row, 1, 1)

        ctxGreen.fillStyle = rgbToHex(0, g, 0)
        ctxGreen.fillRect(colunm, row, 1, 1)

        ctxBlue.fillStyle = rgbToHex(0, 0, b)
        ctxBlue.fillRect(colunm, row, 1, 1)
        colunm++
    }

    let elemento = document.getElementById("canvas-processado");
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }

    document.getElementById("canvas-processado").appendChild(canvasRed)
    document.getElementById("canvas-processado").appendChild(canvasGreen)
    document.getElementById("canvas-processado").appendChild(canvasBlue)
}

function addCanvas() {
    let elemento = document.getElementById("canvas-processado");
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }

    let canvas = document.createElement("canvas")
    canvas.id = 'img_01'

    canvasProcessado = canvas

    elemento.appendChild(canvas)
}

function rgbToHex(r, g, b) {
    const red = r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16)
    const green = g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16)
    const blue = b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16)

    return "#" + red + green + blue
}

function equalizacaoHistograma(isValueHistogram) {
    const { width, height } = inImg;
    const src = new Uint32Array(inImg.data.buffer);

    let histBrightness = (new Array(256)).fill(0);
    let histR = (new Array(256)).fill(0);
    let histG = (new Array(256)).fill(0);
    let histB = (new Array(256)).fill(0);
    for (let i = 0; i < src.length; i++) {
        let r = src[i] & 0xFF;
        let g = (src[i] >> 8) & 0xFF;
        let b = (src[i] >> 16) & 0xFF;
        histBrightness[r]++;
        histBrightness[g]++;
        histBrightness[b]++;
        histR[r]++;
        histG[g]++;
        histB[b]++;
    }

    let maxBrightness = 0;
    if (isValueHistogram) {
        for (let i = 1; i < 256; i++) {
            if (maxBrightness < histBrightness[i]) {
                maxBrightness = histBrightness[i]
            }
        }
    } else {
        for (let i = 0; i < 256; i++) {
            if (maxBrightness < histR[i]) {
                maxBrightness = histR[i]
            } else if (maxBrightness < histG[i]) {
                maxBrightness = histG[i]
            } else if (maxBrightness < histB[i]) {
                maxBrightness = histB[i]
            }
        }
    }

    const canvas = document.getElementById('img_01');
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d');
    let guideHeight = 8;
    let startY = (canvas.height - guideHeight);
    let dx = canvas.width / 256;
    let dy = startY / maxBrightness;
    ctx.lineWidth = dx;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 256; i++) {
        let x = i * dx;
        if (isValueHistogram) {
            // Value
            ctx.strokeStyle = "#000000";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - histBrightness[i] * dy);
            ctx.closePath();
            ctx.stroke();
        } else {
            // Red
            ctx.strokeStyle = "rgba(220,0,0,0.5)";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - histR[i] * dy);
            ctx.closePath();
            ctx.stroke();
            // Green
            ctx.strokeStyle = "rgba(0,210,0,0.5)";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - histG[i] * dy);
            ctx.closePath();
            ctx.stroke();
            // Blue
            ctx.strokeStyle = "rgba(0,0,255,0.5)";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - histB[i] * dy);
            ctx.closePath();
            ctx.stroke();
        }
        // Guide
        ctx.strokeStyle = 'rgb(' + i + ', ' + i + ', ' + i + ')';
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, canvas.height);
        ctx.closePath();
        ctx.stroke();
    }
}

function soma() {
    const size = inImg.width * inImg.height

    let red = (new Array(size)).fill(0)
    let green = (new Array(size)).fill(0)
    let blue = (new Array(size)).fill(0)

    for (let j = 0; j < SOMA; j++) {
        let canvas = ruidoSalPimenta()
        let context = canvas.getContext('2d')

        let somaImg = context.getImageData(0, 0, inImg.width, inImg.height)

        const src = new Uint32Array(somaImg.data.buffer)

        for (let i = 0; i < src.length; i++) {
            red[i] += src[i] & 0xFF
            green[i] += (src[i] >> 8) & 0xFF
            blue[i] += (src[i] >> 16) & 0xFF
        }
    }

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = inImg.width
    canvasProcessado.height = inImg.height

    let row = 0
    let colunm = 0

    for (let i = 0; i < size; i++) {
        let r = parseInt(red[i] / SOMA)
        let g = parseInt(green[i] / SOMA)
        let b = parseInt(blue[i] / SOMA)

        if (i && !(i % inImg.width)) {
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r, g, b);
        ctx.fillRect(colunm, row, 1, 1);
        colunm++
    }
}

function media() {
    const { width, height } = inImg
    const size = width * height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = inImg.width
    canvasProcessado.height = inImg.height

    let row = 0
    let colunm = 0

    for (let i = 0; i < size; i++) {
        let r, g, b
        if (!colunm || colunm == width - 1 || !row || row == height - 1) {
            r = src[i] & 0xFF
            g = (src[i] >> 8) & 0xFF
            b = (src[i] >> 16) & 0xFF
        } else {
            r = parseInt(((src[i - width - 1] & 0xFF) + (src[i - width] & 0xFF) + (src[i - width + 1] & 0xFF) + (src[i - 1] & 0xFF) + (src[i] & 0xFF) + (src[i + 1] & 0xFF) + (src[i + width - 1] & 0xFF) + (src[i + width] & 0xFF) + (src[i + width + 1] & 0xFF)) / 9)
            g = parseInt((((src[i - width - 1] >> 8) & 0xFF) + ((src[i - width] >> 8) & 0xFF) + ((src[i - width + 1] >> 8) & 0xFF) + ((src[i - 1] >> 8) & 0xFF) + ((src[i] >> 8) & 0xFF) + ((src[i + 1] >> 8) & 0xFF) + ((src[i + width - 1] >> 8) & 0xFF) + ((src[i + width] >> 8) & 0xFF) + ((src[i + width + 1] >> 8) & 0xFF)) / 9)
            b = parseInt((((src[i - width - 1] >> 16) & 0xFF) + ((src[i - width] >> 16) & 0xFF) + ((src[i - width + 1] >> 16) & 0xFF) + ((src[i - 1] >> 16) & 0xFF) + ((src[i] >> 16) & 0xFF) + ((src[i + 1] >> 16) & 0xFF) + ((src[i + width - 1] >> 16) & 0xFF) + ((src[i + width] >> 16) & 0xFF) + ((src[i + width + 1] >> 16) & 0xFF)) / 9)
        }

        if (i && !(i % width)) {
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r, g, b);
        ctx.fillRect(colunm, row, 1, 1);
        colunm++
    }
}

function mediana() {
    const { width, height } = inImg
    const size = width * height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = inImg.width
    canvasProcessado.height = inImg.height

    let row = 0
    let colunm = 0

    for (let i = 0; i < size; i++) {
        let r, g, b
        if (!colunm || colunm == width - 1 || !row || row == height - 1) {
            r = src[i] & 0xFF
            g = (src[i] >> 8) & 0xFF
            b = (src[i] >> 16) & 0xFF
        } else {
            r = calculaMediana([(src[i - width - 1] & 0xFF), (src[i - width] & 0xFF), (src[i - width + 1] & 0xFF), (src[i - 1] & 0xFF), (src[i] & 0xFF), (src[i + 1] & 0xFF), (src[i + width - 1] & 0xFF), (src[i + width] & 0xFF), (src[i + width + 1] & 0xFF)])
            g = calculaMediana([((src[i - width - 1] >> 8) & 0xFF), ((src[i - width] >> 8) & 0xFF), ((src[i - width + 1] >> 8) & 0xFF), ((src[i - 1] >> 8) & 0xFF), ((src[i] >> 8) & 0xFF), ((src[i + 1] >> 8) & 0xFF), ((src[i + width - 1] >> 8) & 0xFF), ((src[i + width] >> 8) & 0xFF), ((src[i + width + 1] >> 8) & 0xFF)])
            b = calculaMediana([((src[i - width - 1] >> 16) & 0xFF), ((src[i - width] >> 16) & 0xFF), ((src[i - width + 1] >> 16) & 0xFF), ((src[i - 1] >> 16) & 0xFF), ((src[i] >> 16) & 0xFF), ((src[i + 1] >> 16) & 0xFF), ((src[i + width - 1] >> 16) & 0xFF), ((src[i + width] >> 16) & 0xFF), ((src[i + width + 1] >> 16) & 0xFF)])
        }

        if (i && !(i % width)) {
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r, g, b);
        ctx.fillRect(colunm, row, 1, 1);
        colunm++
    }
}

function calculaMediana(numbers) {
    numbers.sort(function (a, b) { return a - b })
    return numbers[4]
}

function laplaciano(mult, div) {
    const { width, height } = inImg
    const size = width * height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = inImg.width
    canvasProcessado.height = inImg.height

    let row = 0
    let colunm = 0

    for (let i = 0; i < size; i++) {
        let r, g, b
        if (!colunm || colunm == width - 1 || !row || row == height - 1) {
            r = src[i] & 0xFF
            g = (src[i] >> 8) & 0xFF
            b = (src[i] >> 16) & 0xFF
        } else {
            r = Math.abs(parseInt(((src[i - width - 1] & 0xFF) * (-1) + (src[i - width] & 0xFF) * (-1) + (src[i - width + 1] & 0xFF) * (-1) + (src[i - 1] & 0xFF) * (-1) + (src[i] & 0xFF) * (mult) + (src[i + 1] & 0xFF) * (-1) + (src[i + width - 1] & 0xFF) * (-1) + (src[i + width] & 0xFF) * (-1) + (src[i + width + 1] & 0xFF) * (-1)) / div))
            g = Math.abs(parseInt((((src[i - width - 1] >> 8) & 0xFF) * (-1) + ((src[i - width] >> 8) & 0xFF) * (-1) + ((src[i - width + 1] >> 8) & 0xFF) * (-1) + ((src[i - 1] >> 8) & 0xFF) * (-1) + ((src[i] >> 8) & 0xFF) * (mult) + ((src[i + 1] >> 8) & 0xFF) * (-1) + ((src[i + width - 1] >> 8) & 0xFF) * (-1) + ((src[i + width] >> 8) & 0xFF) * (-1) + ((src[i + width + 1] >> 8) & 0xFF) * (-1)) / div))
            b = Math.abs(parseInt((((src[i - width - 1] >> 16) & 0xFF) * (-1) + ((src[i - width] >> 16) & 0xFF) * (-1) + ((src[i - width + 1] >> 16) & 0xFF) * (-1) + ((src[i - 1] >> 16) & 0xFF) * (-1) + ((src[i] >> 16) & 0xFF) * (mult) + ((src[i + 1] >> 16) & 0xFF) * (-1) + ((src[i + width - 1] >> 16) & 0xFF) * (-1) + ((src[i + width] >> 16) & 0xFF) * (-1) + ((src[i + width + 1] >> 16) & 0xFF) * (-1)) / div))
        }

        if (i && !(i % width)) {
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r, g, b);
        ctx.fillRect(colunm, row, 1, 1);
        colunm++
    }
}

function sobel() {
    const { width, height } = inImg
    const size = width * height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let row = 0
    let colunm = 0

    for (let i = 0; i < size; i++) {
        let r, g, b
        if (!colunm || colunm == width - 1 || !row || row == height - 1) {
            r = src[i] & 0xFF
            g = (src[i] >> 8) & 0xFF
            b = (src[i] >> 16) & 0xFF
        } else {
            r = parseInt(Math.sqrt(
                Math.pow(
                    (src[i - width - 1] & 0xFF) * (-1) + (src[i - width + 1] & 0xFF) + (src[i - 1] & 0xFF) * (-2) + (src[i + 1] & 0xFF) * (2) + (src[i + width - 1] & 0xFF) * (-1) + (src[i + width + 1] & 0xFF)
                    , 2) +
                Math.pow(
                    (src[i - width - 1] & 0xFF) * (-1) + (src[i - width] & 0xFF) * (-2) + (src[i - width + 1] & 0xFF) * (-1) + (src[i + width - 1] & 0xFF) + (src[i + width] & 0xFF) * (2) + (src[i + width + 1] & 0xFF)
                    , 2)
            ))
            g = parseInt(Math.sqrt(
                Math.pow(
                    ((src[i - width - 1] >> 8) & 0xFF) * (-1) + ((src[i - width + 1] >> 8) & 0xFF) + ((src[i - 1] >> 8) & 0xFF) * (-2) + ((src[i + 1] >> 8) & 0xFF) * (2) + ((src[i + width - 1] >> 8) & 0xFF) * (-1) + ((src[i + width + 1] >> 8) & 0xFF)
                    , 2) +
                Math.pow(
                    ((src[i - width - 1] >> 8) & 0xFF) * (-1) + ((src[i - width] >> 8) & 0xFF) * (-2) + ((src[i - width + 1] >> 8) & 0xFF) * (-1) + ((src[i + width - 1] >> 8) & 0xFF) + ((src[i + width] >> 8) & 0xFF) * (2) + ((src[i + width + 1] >> 8) & 0xFF)
                    , 2)
            ))
            b = parseInt(Math.sqrt(
                Math.pow(
                    ((src[i - width - 1] >> 16) & 0xFF) * (-1) + ((src[i - width + 1] >> 16) & 0xFF) + ((src[i - 1] >> 16) & 0xFF) * (-2) + ((src[i + 1] >> 16) & 0xFF) * (2) + ((src[i + width - 1] >> 16) & 0xFF) * (-1) + ((src[i + width + 1] >> 16) & 0xFF)
                    , 2) +
                Math.pow(
                    ((src[i - width - 1] >> 16) & 0xFF) * (-1) + ((src[i - width] >> 16) & 0xFF) * (-2) + ((src[i - width + 1] >> 16) & 0xFF) * (-1) + ((src[i + width - 1] >> 16) & 0xFF) + ((src[i + width] >> 16) & 0xFF) * (2) + ((src[i + width + 1] >> 16) & 0xFF)
                    , 2)
            ))
        }

        if (i && !(i % width)) {
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r, g, b);
        ctx.fillRect(colunm, row, 1, 1);
        colunm++
    }
}

function converteHLV(vetor) {
    let L, S, H;
    let cMax = Math.max(Math.max(vetor[0], vetor[1]), vetor[2]);
    let cMin = Math.min(Math.min(vetor[0], vetor[1]), vetor[2]);

    L = (((cMax + cMin) * 240) + 255) / (2 * 255);

    if (cMax == cMin) {
        S = 0;
        H = '';
    }
    else {
        if (L <= (240 / 2)) {
            S = (((cMax - cMin) * 240) + ((cMax + cMin) / 2));
            S /= (cMax + cMin);
        }
        else {
            S = (((cMax - cMin) * 240) + ((2 * 255 - cMax - cMin) / 2));
            S /= (2 * 255 - cMax - cMin);
        }

        let cont = (cMax - cMin) / 2;

        let Rdelta, Gdelta, Bdelta;

        Rdelta = (((cMax - vetor[0]) * (239 / 6)) + cont);
        Rdelta /= (cMax - cMin);

        Gdelta = (((cMax - vetor[1]) * (239 / 6)) + cont);
        Gdelta /= (cMax - cMin);

        Bdelta = (((cMax - vetor[2]) * (239 / 6)) + cont);
        Bdelta /= (cMax - cMin);

        if (vetor[0] == cMax)
            H = Bdelta - Gdelta;
        else if (vetor[1] == cMax)
            H = (240 / 3) + Rdelta - Bdelta;
        else
            H = ((2 * 240) / 3) + Gdelta - Rdelta;

        if (H < 0)
            H += 239;
        if (H > 239)
            H -= 239;
    }

    return new Array(Math.round(L), Math.round(S), Math.round(H))
}

/*****************************
 * CONTEUDO SEGUNDO BIMESTRE *
 *****************************/
buttonEqLena.addEventListener("click", () => {
    addCanvas()

    const { width, height } = inImg

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let clampedArray = eqlena();

    let newImageData = ctx.createImageData(width, height);

    newImageData.data.set(new Uint8ClampedArray(clampedArray));

    ctx.putImageData(newImageData, 0, 0);

})

buttonPseudo.addEventListener("click", () => {
    addCanvas()

    const { width, height } = inImg

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let clampedArray = pseudocores();

    let colorData = ctx.createImageData(width, height);

    colorData.data.set(new Uint8ClampedArray(clampedArray));

    ctx.putImageData(colorData, 0, 0);

})

buttonLoG.addEventListener("click", () => {
    addCanvas()

    laplaciano(8,8)

    const { width, height } = inImg
    const src = new Uint8ClampedArray(inImg.data.buffer)

    const canvas = document.createElement("canvas")

    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    let matriz = []

    for (i = 0; i < width; i++) {
        matriz[i] = [];
        for (j = 0; j < height; j++) {
            matriz[i][j] = 0
        }
    }

    let r, g, b

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        matriz[i % width][parseInt(i / width)] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    let arange = {
        max: Number.MIN_SAFE_INTEGER,
        min: Number.MAX_SAFE_INTEGER
    };


    matrix = laplacianodaGaussiana(matriz, arange)

    matrix = equalizacao(matrix, arange)

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.fillStyle = rgbToHex(matrix[i][j], matrix[i][j], matrix[i][j])
            ctx.fillRect(i, j, 1, 1)
        }
    }

    document.getElementById("canvas-processado").appendChild(canvas)
})

buttonDCT.addEventListener("click", () => {
    addCanvas()

    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let matriz = []

    let arange = {
        max: Number.MIN_SAFE_INTEGER,
        min: Number.MAX_SAFE_INTEGER
    };

    for (i = 0; i < width; i++) {
        matriz[i] = [];
        for (j = 0; j < height; j++) {
            matriz[i][j] = 0
        }
    }

    let r, g, b

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        matriz[i % width][parseInt(i / width)] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    matriz = dctTransform(matriz, arange)

    if (addRuidoDCT) {
        matrixDCT = []
        for (i = 0; i < width; i++) {
            matrixDCT[i] = [];
            for (j = 0; j < height; j++) {
                matrixDCT[i][j] = matriz[i][j]
            }
        }
        maxDCT = arange.max
    }

    matriz = equalizacao(matriz, arange)

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.fillStyle = rgbToHex(matriz[i][j], matriz[i][j], matriz[i][j])
            ctx.fillRect(i, j, 1, 1)
        }
    }

})

buttonIDCT.addEventListener("click", () => {
    addCanvas()

    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let matriz = []

    let arange = {
        max: Number.MIN_SAFE_INTEGER,
        min: Number.MAX_SAFE_INTEGER
    };

    for (i = 0; i < width; i++) {
        matriz[i] = [];
        for (j = 0; j < height; j++) {
            matriz[i][j] = 0
        }
    }

    let r, g, b

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        matriz[i % width][parseInt(i / width)] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    matriz = dctTransform(matriz, arange)

    arange.max = Number.MIN_SAFE_INTEGER,
        arange.min = Number.MAX_SAFE_INTEGER

    matriz = iDctTransform(matriz, arange)

    matriz = equalizacao(matriz, arange)

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.fillStyle = rgbToHex(matriz[i][j], matriz[i][j], matriz[i][j])
            ctx.fillRect(i, j, 1, 1)
        }
    }

})

buttonDCTRuido.addEventListener("click", () => {
    addCanvas()

    addRuidoDCT = true

    buttonDCT.click()

    alert("Clique na imagem formada para adicionar o ruído!")

    let buttons = document.getElementsByTagName("button")

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true
    }
})

buttonDCTAlta.addEventListener("click", () => {
    addCanvas()

    let corte = parseInt(prompt("Digite um número inteiro:"))

    if (isNaN(corte)) {
        alert("Valor inserido inválido")
        return
    }

    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let matriz = []

    let arange = {
        max: Number.MIN_SAFE_INTEGER,
        min: Number.MAX_SAFE_INTEGER
    };

    for (i = 0; i < width; i++) {
        matriz[i] = [];
        for (j = 0; j < height; j++) {
            matriz[i][j] = 0
        }
    }

    let r, g, b

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        matriz[i % width][parseInt(i / width)] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    matriz = dctTransform(matriz, arange, corte, "baixa")

    arange.max = Number.MIN_SAFE_INTEGER,
        arange.min = Number.MAX_SAFE_INTEGER

    matriz = iDctTransform(matriz, arange)

    matriz = equalizacao(matriz, arange)

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.fillStyle = rgbToHex(matriz[i][j], matriz[i][j], matriz[i][j])
            ctx.fillRect(i, j, 1, 1)
        }
    }
})

buttonDCTBaixa.addEventListener("click", () => {
    addCanvas()

    let corte = parseInt(prompt("Digite um número inteiro:"))

    if (isNaN(corte)) {
        alert("Valor inserido inválido")
        return
    }

    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let matriz = []

    let arange = {
        max: Number.MIN_SAFE_INTEGER,
        min: Number.MAX_SAFE_INTEGER
    };

    for (i = 0; i < width; i++) {
        matriz[i] = [];
        for (j = 0; j < height; j++) {
            matriz[i][j] = 0
        }
    }

    let r, g, b

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        matriz[i % width][parseInt(i / width)] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    matriz = dctTransform(matriz, arange, corte, "alta")

    arange.max = Number.MIN_SAFE_INTEGER,
        arange.min = Number.MAX_SAFE_INTEGER

    matriz = iDctTransform(matriz, arange)

    matriz = equalizacao(matriz, arange)

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.fillStyle = rgbToHex(matriz[i][j], matriz[i][j], matriz[i][j])
            ctx.fillRect(i, j, 1, 1)
        }
    }
})

buttonMax.addEventListener("click", () => {
    addCanvas()

    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let ints = []

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        ints[i] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    let max

    for (let i = 0; i < src.length; i++) {
        if (
            ints[i - width - 1] > 0 &&
            ints[i - width] > 0 &&
            ints[i - width + 1] > 0 &&
            ints[i - 1] > 0 &&
            ints[i + 1] < src.length &&
            ints[i + width - 1] < src.length &&
            ints[i + width] < src.length &&
            ints[i + width + 1] < src.length
        ) {
            max = Math.max(
                ints[i - width - 1],
                ints[i - width],
                ints[i - width + 1],
                ints[i - 1],
                ints[i],
                ints[i + 1],
                ints[i + width - 1],
                ints[i + width],
                ints[i + width + 1]
            )
        }
        else {
            max = ints[i]
        }

        ctx.fillStyle = rgbToHex(max, max, max)
        ctx.fillRect(i % width, parseInt(i / width), 1, 1)
    }
})

buttonMin.addEventListener("click", () => {
    addCanvas()

    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let ints = []

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        ints[i] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    let min

    for (let i = 0; i < src.length; i++) {
        if (
            ints[i - width - 1] > 0 &&
            ints[i - width] > 0 &&
            ints[i - width + 1] > 0 &&
            ints[i - 1] > 0 &&
            ints[i + 1] < src.length &&
            ints[i + width - 1] < src.length &&
            ints[i + width] < src.length &&
            ints[i + width + 1] < src.length
        ) {
            min = Math.min(
                ints[i - width - 1],
                ints[i - width],
                ints[i - width + 1],
                ints[i - 1],
                ints[i],
                ints[i + 1],
                ints[i + width - 1],
                ints[i + width],
                ints[i + width + 1]
            )
        }
        else {
            min = ints[i]
        }

        ctx.fillStyle = rgbToHex(min, min, min)
        ctx.fillRect(i % width, parseInt(i / width), 1, 1)
    }
})

buttonMed.addEventListener("click", () => {
    addCanvas()
    
    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let ints = []

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        ints[i] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    let min, max, med

    for (let i = 0; i < src.length; i++) {
        if (
            ints[i - width - 1] > 0 &&
            ints[i - width] > 0 &&
            ints[i - width + 1] > 0 &&
            ints[i - 1] > 0 &&
            ints[i + 1] < src.length &&
            ints[i + width - 1] < src.length &&
            ints[i + width] < src.length &&
            ints[i + width + 1] < src.length
        ) {
            min = Math.min(
                ints[i - width - 1],
                ints[i - width],
                ints[i - width + 1],
                ints[i - 1],
                ints[i],
                ints[i + 1],
                ints[i + width - 1],
                ints[i + width],
                ints[i + width + 1]
            )

            max = Math.max(
                ints[i - width - 1],
                ints[i - width],
                ints[i - width + 1],
                ints[i - 1],
                ints[i],
                ints[i + 1],
                ints[i + width - 1],
                ints[i + width],
                ints[i + width + 1]
            )

            med = parseInt((max + min) / 2)
        }
        else {
            med = ints[i]
        }

        ctx.fillStyle = rgbToHex(med, med, med)
        ctx.fillRect(i % width, parseInt(i / width), 1, 1)
    }
})

function eqlena() {
    const { width, height } = inImg;

    let hslImageData = []
    let histograma = []
    let eqHistograma = []

    for (let i = 0; i < 100; i++) histograma[i] = 0;

    for (let x = 0; x < inImg.data.length; x += 4) {
        let hsl = rgbToHsl(
            inImg.data[x],
            inImg.data[x + 1],
            inImg.data[x + 2]
        );

        hslImageData.push(hsl[0], hsl[1], hsl[2]);

        histograma[hsl[2]] += 1;
    }

    let acumulador = 0;

    for (let x = 0; x < histograma.length; x++) {
        acumulador += histograma[x];

        let eq = Math.max(
            0,
            Math.round(
                (100 * acumulador) / (width * height)
            ) - 1
        );

        eqHistograma.push(eq);
    }

    let clampedArray = [];

    for (let x = 0; x < hslImageData.length; x += 3) {
        let rgb = hslToRgb(
            hslImageData[x],
            hslImageData[x + 1],
            eqHistograma[hslImageData[x + 2]]
        );

        clampedArray.push(rgb[0], rgb[1], rgb[2], 255);
    }

    return clampedArray;
}

function pseudocores() {
    const { width, height } = inImg;

    let clampedArray = [];
    let vetorHSL = [];

    for (let i = 0; i < cores.length - 1; i++) {
        let corAtual = cores[i];
        let proxCor = cores[i + 1];
        for (let j = 0; j < 256; j++) {
            let r, g, b;
            if (corAtual.r < proxCor.r) {
                r = corAtual.r + j;
            } else if (corAtual.r == proxCor.r) {
                r = corAtual.r;
            } else {
                r = corAtual.r - j;
            }
            if (corAtual.g < proxCor.g) {
                g = corAtual.g + j;
            } else if (corAtual.g == proxCor.g) {
                g = corAtual.g;
            } else {
                g = corAtual.g - j;
            }

            if (corAtual.b < proxCor.b) {
                b = corAtual.b + j;
            } else if (corAtual.b == proxCor.b) {
                b = corAtual.b;
            } else {
                b = corAtual.b - j;
            }

            vetorHSL.push({ r: r, g: g, b: b });
        }
    }

    for (let x = 0; x < width * height; x++) {
        let indice = Math.round(
            ((vetorHSL.length - 1) * inImg.data[x * 4]) / 255
        );

        if (vetorHSL[indice] !== undefined) {
            let r = vetorHSL[indice].r;
            let g = vetorHSL[indice].g;
            let b = vetorHSL[indice].b;

            clampedArray.push(r, g, b, 255);
        }
    }

    return clampedArray;
}

// Retorna vetor com as conversões de RGB para HSL
function rgbToHsl(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return [
        Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
        Math.round(
            100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)
        ),
        Math.round((100 * (2 * l - s)) / 2),
    ];
}

// Retorna vetor com as conversões de HSL para RGB
function hslToRgb(h, s, l){
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4)),
    ];
}

// Laplaciano da Gaussiana utilizado para detecção de bordas e suavização da imagem resultante
function laplacianodaGaussiana(matriz, arange) {
    const { width, height } = inImg
    for (let i = 1; i < width; i++) {
        for (let j = 1; j < height; j++) {
            matriz[i][j] =
                - inImg.data[((inImg.width * (j + 3)) + i) * 4]
                - inImg.data[((inImg.width * (j + 2)) + (i + 1)) * 4]
                - (2 * inImg.data[((inImg.width * (j + 3)) + (i + 1)) * 4])
                - inImg.data[((inImg.width * (j + 4)) + (i + 1)) * 4]
                - inImg.data[((inImg.width * (j)) + (i + 3)) * 4]
                - (2 * inImg.data[((inImg.width * (j + 2)) + (i + 3)) * 4])

                + (16 * inImg.data[((inImg.width * (j + 3)) + (i + 3)) * 4])

                - (2 * inImg.data[((inImg.width * (j + 4)) + (i + 3)) * 4])
                - inImg.data[((inImg.width * (j + 5)) + (i + 3)) * 4]
                - inImg.data[((inImg.width * (j + 2)) + (i + 4)) * 4]
                - (2 * inImg.data[((inImg.width * (j + 3)) + (i + 4)) * 4])
                - inImg.data[((inImg.width * (j + 4)) + (i + 4)) * 4]
                - inImg.data[((inImg.width * (j + 3)) + (i + 5)) * 4]

            arange.max = arange.max < matriz[i][j] ? matriz[i][j] : arange.max
            arange.min = arange.min > matriz[i][j] ? matriz[i][j] : arange.min
        }
    }
    return matriz
}

function equalizacao(matriz, arange) {
    const { width, height } = inImg

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            matriz[i][j] = parseInt(((matriz[i][j] - arange.min) * 255) / (arange.max - arange.min))
        }
    }

    return matriz
}

function dctTransform(matrix, arange, corte = NaN, tipo = "") {
    const { width, height } = inImg;

    let i, j, k, l;
    let ci, cj, dct1, sum;

    let dct = []

    for (i = 0; i < width; i++) {
        dct[i] = [];
        for (j = 0; j < height; j++) {
            dct[i][j] = 0
        }
    }

    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            if (isNaN(corte)) {
                if (i == 0) {
                    ci = 1 / Math.sqrt(width)
                }
                else {
                    ci = Math.sqrt(2) / Math.sqrt(width)
                }

                if (j == 0) {
                    cj = 1 / Math.sqrt(height)
                }
                else {
                    cj = Math.sqrt(2) / Math.sqrt(height)
                }

                sum = 0;
                for (k = 0; k < width; k++) {
                    for (l = 0; l < height; l++) {
                        dct1 = matrix[k][l] *
                            Math.cos((2 * k + 1) * i * PI / (2 * width)) *
                            Math.cos((2 * l + 1) * j * PI / (2 * height));

                        sum += dct1
                    }
                }
                dct[i][j] = ci * cj * sum

                arange.max = arange.max > dct[i][j] ? arange.max : dct[i][j]
                arange.min = arange.min < dct[i][j] ? arange.min : dct[i][j]
            }
            else if (tipo === "alta") {
                if (corte < Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2))) {
                    dct[i][j] = 0
                }
                else {
                    if (i == 0) {
                        ci = 1 / Math.sqrt(width)
                    }
                    else {
                        ci = Math.sqrt(2) / Math.sqrt(width)
                    }

                    if (j == 0) {
                        cj = 1 / Math.sqrt(height)
                    }
                    else {
                        cj = Math.sqrt(2) / Math.sqrt(height)
                    }

                    sum = 0;
                    for (k = 0; k < width; k++) {
                        for (l = 0; l < height; l++) {
                            dct1 = matrix[k][l] *
                                Math.cos((2 * k + 1) * i * PI / (2 * width)) *
                                Math.cos((2 * l + 1) * j * PI / (2 * height));

                            sum += dct1
                        }
                    }
                    dct[i][j] = ci * cj * sum

                    arange.max = arange.max > dct[i][j] ? arange.max : dct[i][j]
                    arange.min = arange.min < dct[i][j] ? arange.min : dct[i][j]
                }
            }
            else if (tipo === "baixa") {
                if (corte > Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2))) {
                    dct[i][j] = 0
                }
                else {
                    if (i == 0) {
                        ci = 1 / Math.sqrt(width)
                    }
                    else {
                        ci = Math.sqrt(2) / Math.sqrt(width)
                    }

                    if (j == 0) {
                        cj = 1 / Math.sqrt(height)
                    }
                    else {
                        cj = Math.sqrt(2) / Math.sqrt(height)
                    }

                    sum = 0;
                    for (k = 0; k < width; k++) {
                        for (l = 0; l < height; l++) {
                            dct1 = matrix[k][l] *
                                Math.cos((2 * k + 1) * i * PI / (2 * width)) *
                                Math.cos((2 * l + 1) * j * PI / (2 * height));

                            sum += dct1
                        }
                    }
                    dct[i][j] = ci * cj * sum

                    arange.max = arange.max > dct[i][j] ? arange.max : dct[i][j]
                    arange.min = arange.min < dct[i][j] ? arange.min : dct[i][j]
                }
            }
        }
    }

    return dct
}

function iDctTransform(matrix, arange) {
    const { width, height } = inImg;

    let i, j, k, l;
    let ci, cj, dct1, sum;

    let dct = []

    for (i = 0; i < width; i++) {
        dct[i] = [];
        for (j = 0; j < height; j++) {
            dct[i][j] = 0
        }
    }

    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            if (i == 0) {
                ci = 1 / Math.sqrt(width)
            }
            else {
                ci = Math.sqrt(2) / Math.sqrt(width)
            }

            if (j == 0) {
                cj = 1 / Math.sqrt(height)
            }
            else {
                cj = Math.sqrt(2) / Math.sqrt(height)
            }

            sum = 0;
            for (k = 0; k < width; k++) {
                for (l = 0; l < height; l++) {
                    dct1 = matrix[k][l] * ci * cj *
                        Math.cos((2 * k + 1) * i * PI / (2 * width)) *
                        Math.cos((2 * l + 1) * j * PI / (2 * height));

                    sum += dct1
                }
            }
            dct[i][j] = sum

            arange.max = arange.max < sum ? sum : arange.max
            arange.min = arange.min > sum ? sum : arange.min
        }
    }
    return dct
}