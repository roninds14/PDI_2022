let buttonImg = document.getElementById("btn-img")
let buttonProcessa = document.getElementById("btn-processa")
let buttonCinza = document.getElementById("btn-tons-cinza")
let buttonSave = document.getElementById("btn-save")
let buttonSalPimenta = document.getElementById("btn-tons-sal-pimenta")
let inputFile = document.getElementById("input-file")
let canvasOriginal = document.getElementById("img_00")
let canvasProcessado = document.getElementById("img_01")
let inImg

buttonImg.addEventListener("click", () => {
    inputFile.click()
})

buttonProcessa.addEventListener("click", () => {
    processaImage()
})

buttonCinza.addEventListener("click", () => {
    converterParaCinza()
})

buttonSave.addEventListener("click", () => {
    let ctx = canvasOriginal.getContext('2d')
    ctx.drawImage(canvasProcessado,0,0)
})

buttonSalPimenta.addEventListener("click", () => {
    ruidoSalPimenta()
})

window.addEventListener('DOMContentLoaded', () =>{
    inputFile.addEventListener("change", () => {
        let file = inputFile.files.item(0)
        photoName = file.name;
        
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(event) {
            image = new Image()
            image.src = event.target.result
            image.onload = () =>{
                const context = canvasOriginal.getContext('2d')

                canvasOriginal.width = image.width
                canvasOriginal.height = image.height
                context.drawImage(image, 0, 0)

                inImg  = context.getImageData(0, 0, image.width, image.height) 
            }            
        }
    })    
})

function processaImage(){
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

        if(i && !(i % width)){
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r,g,b);
        ctx.fillRect(colunm,row,1,1);
        colunm++
    }
}

function converterParaCinza(){
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

        if(i && !(i % width)){
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(itsd,itsd,itsd);
        ctx.fillRect(colunm,row,1,1);
        colunm++
    }
}

function ruidoSalPimenta(){
    const {width, height} = inImg

    for()
}

function rgbToHex(r,g,b){
    const red = r.toString(16)
    const green = g.toString(16)
    const blue = b.toString(16)

    return "#" + red + green + blue
}