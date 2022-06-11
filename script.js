let buttonImg = document.getElementById("btn-img")
let buttonProcessa = document.getElementById("btn-processa")
let buttonCinza = document.getElementById("btn-tons-cinza")
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

canvasOriginal.addEventListener("click",(e)=>{
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

    document.getElementById("red").innerHTML = r
    document.getElementById("green").innerHTML = g
    document.getElementById("blue").innerHTML = b

    const HLV = converteHLV(new Array(r,g,b))

    document.getElementById("lum").innerHTML = HLV[0]
    document.getElementById("sat").innerHTML = HLV[1]
    document.getElementById("hue").innerHTML = HLV[2]
})

function converteHLV( vetor ){
	let L, S, H;
	let cMax = Math.max( Math.max(vetor[0], vetor[1] ), vetor[2]);
	let cMin = Math.min( Math.min(vetor[0], vetor[1] ), vetor[2]);
	
	L = ( ( (cMax + cMin) * 240 )+255) / (2*255);
	
	if (cMax == cMin) {           
		S = 0;
		H = '';
	}
	else{
		if( L <= (240/2) ){
			S = ( ( ( cMax-cMin ) * 240 ) + ( (cMax+cMin) / 2 ) );
			S /= (cMax+cMin);
		}
		else{
			S = ( ((cMax-cMin)*240) + ((2*255-cMax-cMin)/2) );			
			S /=  ( 2 * 255 - cMax - cMin);
		}
		
		let cont = (cMax-cMin)/2;
		
		let Rdelta, Gdelta, Bdelta;
		
		Rdelta = ( ((cMax - vetor[0])*(239/6)) + cont );
		Rdelta /= (cMax-cMin);
      	
		Gdelta = ( ((cMax- vetor[1])*(239/6)) + cont );
		Gdelta /= (cMax-cMin);
      	
		Bdelta = ( ((cMax- vetor[2])*(239/6)) + cont );
		Bdelta /= (cMax-cMin);

        if ( vetor[0] == cMax)
            H = Bdelta - Gdelta;
        else if (vetor[1] == cMax)
            H = (240/3) + Rdelta - Bdelta;
        else 
            H = ((2*240)/3) + Gdelta - Rdelta;

         if (H < 0)
            H += 239;
         if (H > 239)
            H -= 239;			
	}

    return new Array(Math.round(L),Math.round(S),Math.round(H))
}

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
    let ctxProcessado = canvasProcessado.getContext('2d')
    inImg  = ctxProcessado.getImageData(0, 0, inImg.width, inImg.height)
})

buttonSalPimenta.addEventListener("click", () => {
    const canvas = ruidoSalPimenta()
    const {width, height} = canvas
    canvasProcessado.width = width
    canvasProcessado.height = height
    let ctx = canvasProcessado.getContext('2d')
    ctx.drawImage(canvas,0,0)
})

buttonSepararTons.addEventListener("click",  () =>{
    separarTons()
})

buttonHistograma.addEventListener("click", () =>{
    equalizacaoHistograma(true)
})

buttonHistogramaColor.addEventListener("click", () =>{
    equalizacaoHistograma(false)
})

buttonSoma.addEventListener("click", () =>{
    soma()
})

buttonMedia.addEventListener("click", () =>{
    media()
})

buttonMediana.addEventListener("click", () =>{
    mediana()
})

buttonLaplaciano.addEventListener("click", () =>{
    laplaciano(8,8)
})

buttonRealceLaplaciano.addEventListener("click", () =>{
    laplaciano(9,2)
})

buttonSobel.addEventListener("click", () =>{
    sobel()
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
    const percent = parseInt(width*height*0.01)
    const total = width*height
    
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

        if(i && !(i % width)){
            row++
            colunm = 0
        }

        if(Math.random() * (total - 0) + 0 < percent){
            let rgb = "#FFFFFF"
            
            if(Math.random() < 0.5){
                rgb = "#000000"                
            }

            ctx.fillStyle = rgb
        }
        else{
            ctx.fillStyle = rgbToHex(r,g,b);
        }
        
        ctx.fillRect(colunm,row,1,1);
        colunm++
    }

    return canvas
}

function separarTons(){
    const {width, height} = inImg
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

        if(i && !(i % width)){
            row++
            colunm = 0
        }

        ctxRed.fillStyle = rgbToHex(r,0,0)
        ctxRed.fillRect(colunm,row,1,1)
        
        ctxGreen.fillStyle = rgbToHex(0,g,0)
        ctxGreen.fillRect(colunm,row,1,1)

        ctxBlue.fillStyle = rgbToHex(0,0,b)
        ctxBlue.fillRect(colunm,row,1,1)
        colunm++
    }

    document.getElementById("canvas-processado").appendChild(canvasRed)
    document.getElementById("canvas-processado").appendChild(canvasBlue)
    document.getElementById("canvas-processado").appendChild(canvasGreen)
}

function rgbToHex(r,g,b){
    const red = r.toString(16).length == 1? "0" + r.toString(16): r.toString(16)
    const green = g.toString(16).length == 1? "0" + g.toString(16): g.toString(16)
    const blue = b.toString(16).length == 1? "0" + b.toString(16): b.toString(16)

    return "#" + red + green + blue
}

function equalizacaoHistograma(isValueHistogram) {
    const {width, height} = inImg;
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

function soma(){
    const size = inImg.width * inImg.height

    let red = (new Array(size)).fill(0)
    let green = (new Array(size)).fill(0)
    let blue = (new Array(size)).fill(0)

    for(let j = 0; j < SOMA; j++){
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
        let r = parseInt(red[i]/SOMA)
        let g = parseInt(green[i]/SOMA)
        let b = parseInt(blue[i]/SOMA)

        if(i && !(i % inImg.width)){
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r,g,b);
        ctx.fillRect(colunm,row,1,1);
        colunm++
    }
}

function media(){
    const {width, height} = inImg
    const size = width*height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = inImg.width
    canvasProcessado.height = inImg.height

    let row = 0
    let colunm = 0 
    
    for (let i = 0; i < size; i++) {
        let r,g,b
        if(!colunm || colunm == width-1 || !row || row == height-1){
            r = src[i] & 0xFF
            g = (src[i] >> 8) & 0xFF
            b = (src[i] >> 16) & 0xFF
        }else{
            r = parseInt((( src[i-width-1] & 0xFF)+        (src[i-width] & 0xFF)+        (src[i-width+1] & 0xFF)+        (src[i-1] & 0xFF)+        (src[i] & 0xFF)+        (src[i+1] & 0xFF)+        (src[i+width-1] & 0xFF)+        (src[i+width] & 0xFF)+        (src[i+width+1] & 0xFF))/9)
            g = parseInt((((src[i-width-1] >> 8) & 0xFF)+( (src[i-width] >> 8) & 0xFF)+ ((src[i-width+1] >> 8) & 0xFF)+ ((src[i-1] >> 8) & 0xFF)+ ((src[i] >> 8) & 0xFF)+ ((src[i+1] >> 8) & 0xFF)+ ((src[i+width-1] >> 8) & 0xFF)+ ((src[i+width] >> 8) & 0xFF)+ ((src[i+width+1] >> 8) & 0xFF))/9)
            b = parseInt((((src[i-width-1] >> 16) & 0xFF)+((src[i-width] >> 16) & 0xFF)+((src[i-width+1] >> 16) & 0xFF)+((src[i-1] >> 16) & 0xFF)+((src[i] >> 16) & 0xFF)+((src[i+1] >> 16) & 0xFF)+((src[i+width-1] >> 16) & 0xFF)+((src[i+width] >> 16) & 0xFF)+((src[i+width+1] >> 16) & 0xFF))/9)
        }

        if(i && !(i % width)){
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r,g,b);
        ctx.fillRect(colunm,row,1,1);
        colunm++
    }
}

function mediana(){
    const {width, height} = inImg
    const size = width*height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = inImg.width
    canvasProcessado.height = inImg.height

    let row = 0
    let colunm = 0 
    
    for (let i = 0; i < size; i++) {
        let r,g,b
        if(!colunm || colunm == width-1 || !row || row == height-1){
            r = src[i] & 0xFF
            g = (src[i] >> 8) & 0xFF
            b = (src[i] >> 16) & 0xFF
        }else{
            r = calculaMediana([( src[i-width-1] & 0xFF),(src[i-width] & 0xFF),(src[i-width+1] & 0xFF),(src[i-1] & 0xFF),(src[i] & 0xFF),(src[i+1] & 0xFF),(src[i+width-1] & 0xFF),(src[i+width] & 0xFF),(src[i+width+1] & 0xFF)])
            g = calculaMediana([((src[i-width-1] >> 8) & 0xFF),((src[i-width] >> 8) & 0xFF),((src[i-width+1] >> 8) & 0xFF),((src[i-1] >> 8) & 0xFF),((src[i] >> 8) & 0xFF),((src[i+1] >> 8) & 0xFF),((src[i+width-1] >> 8) & 0xFF),((src[i+width] >> 8) & 0xFF), ((src[i+width+1] >> 8) & 0xFF)])
            b = calculaMediana([((src[i-width-1] >> 16) & 0xFF),((src[i-width] >> 16) & 0xFF),((src[i-width+1] >> 16) & 0xFF),((src[i-1] >> 16) & 0xFF),((src[i] >> 16) & 0xFF),((src[i+1] >> 16) & 0xFF),((src[i+width-1] >> 16) & 0xFF),((src[i+width] >> 16) & 0xFF),((src[i+width+1] >> 16) & 0xFF)])
        }

        if(i && !(i % width)){
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r,g,b);
        ctx.fillRect(colunm,row,1,1);
        colunm++
    }
}

function calculaMediana(numbers){
    numbers.sort(function(a, b){return a-b})
    return numbers[4]
}

function laplaciano(mult, div){
    const {width, height} = inImg
    const size = width*height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = inImg.width
    canvasProcessado.height = inImg.height

    let row = 0
    let colunm = 0 
    
    for (let i = 0; i < size; i++) {
        let r,g,b
        if(!colunm || colunm == width-1 || !row || row == height-1){
            r = src[i] & 0xFF
            g = (src[i] >> 8) & 0xFF
            b = (src[i] >> 16) & 0xFF
        }else{
            r = Math.abs(parseInt((( src[i-width-1] & 0xFF)*(-1)+        (src[i-width] & 0xFF)*(-1)+         (src[i-width+1] & 0xFF)*(-1)+           (src[i-1] & 0xFF)*(-1)+         (src[i] & 0xFF)*(mult)+            (src[i+1] & 0xFF)*(-1)+         (src[i+width-1] & 0xFF)*(-1)+           (src[i+width] & 0xFF)*(-1)+         (src[i+width+1] & 0xFF)*(-1))/div))
            g = Math.abs(parseInt((((src[i-width-1] >> 8) & 0xFF)*(-1)+  ((src[i-width] >> 8) & 0xFF)*(-1)+ ((src[i-width+1] >> 8) & 0xFF)*(-1)+     ((src[i-1] >> 8) & 0xFF)*(-1)+  ((src[i] >> 8) & 0xFF)*(mult)+     ((src[i+1] >> 8) & 0xFF)*(-1)+  ((src[i+width-1] >> 8) & 0xFF)*(-1)+    ((src[i+width] >> 8) & 0xFF)*(-1)+  ((src[i+width+1] >> 8) & 0xFF)*(-1))/div))
            b = Math.abs(parseInt((((src[i-width-1] >> 16) & 0xFF)*(-1)+ ((src[i-width] >> 16) & 0xFF)*(-1)+ ((src[i-width+1] >> 16) & 0xFF)*(-1)+   ((src[i-1] >> 16) & 0xFF)*(-1)+ ((src[i] >> 16) & 0xFF)*(mult)+    ((src[i+1] >> 16) & 0xFF)*(-1)+ ((src[i+width-1] >> 16) & 0xFF)*(-1)+   ((src[i+width] >> 16) & 0xFF)*(-1)+ ((src[i+width+1] >> 16) & 0xFF)*(-1))/div))
        }

        if(i && !(i % width)){
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r,g,b);
        ctx.fillRect(colunm,row,1,1);
        colunm++
    }
}

function sobel(){
    const {width, height} = inImg
    const size = width*height
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let row = 0
    let colunm = 0 
    
    for (let i = 0; i < size; i++) {
        let r,g,b
        if(!colunm || colunm == width-1 || !row || row == height-1){
            r = src[i] & 0xFF
            g = (src[i] >> 8) & 0xFF
            b = (src[i] >> 16) & 0xFF
        }else{
            r = parseInt(Math.sqrt(
                Math.pow(
                    ( src[i-width-1] & 0xFF)*(-1)+        (src[i-width+1] & 0xFF)+           (src[i-1] & 0xFF)*(-2)+            (src[i+1] & 0xFF)*(2)+         (src[i+width-1] & 0xFF)*(-1)+         (src[i+width+1] & 0xFF)
                ,2) + 
                Math.pow(
                    ( src[i-width-1] & 0xFF)*(-1)+        (src[i-width] & 0xFF)*(-2)+         (src[i-width+1] & 0xFF)*(-1)+     (src[i+width-1] & 0xFF)+           (src[i+width] & 0xFF)*(2)+         (src[i+width+1] & 0xFF)
                ,2)
            ))
            g = parseInt(Math.sqrt(
                Math.pow(
                    ((src[i-width-1] >> 8) & 0xFF)*(-1)+  ((src[i-width+1] >> 8) & 0xFF)+     ((src[i-1] >> 8) & 0xFF)*(-2)+    ((src[i+1] >> 8) & 0xFF)*(2)+  ((src[i+width-1] >> 8) & 0xFF)*(-1)+    ((src[i+width+1] >> 8) & 0xFF)
                ,2)+
                Math.pow(
                    ((src[i-width-1] >> 8) & 0xFF)*(-1)+  ((src[i-width] >> 8) & 0xFF)*(-2)+ ((src[i-width+1] >> 8) & 0xFF)*(-1)+     ((src[i+width-1] >> 8) & 0xFF)+    ((src[i+width] >> 8) & 0xFF)*(2)+  ((src[i+width+1] >> 8) & 0xFF)
                ,2)
            ))
            b = parseInt(Math.sqrt(
                Math.pow(
                    ((src[i-width-1] >> 16) & 0xFF)*(-1)+ ((src[i-width+1] >> 16) & 0xFF)+   ((src[i-1] >> 16) & 0xFF)*(-2)+    ((src[i+1] >> 16) & 0xFF)*(2)+ ((src[i+width-1] >> 16) & 0xFF)*(-1)+   ((src[i+width+1] >> 16) & 0xFF)
                ,2)+
                Math.pow(
                    ((src[i-width-1] >> 16) & 0xFF)*(-1)+ ((src[i-width] >> 16) & 0xFF)*(-2)+ ((src[i-width+1] >> 16) & 0xFF)*(-1)+   ((src[i+width-1] >> 16) & 0xFF)+   ((src[i+width] >> 16) & 0xFF)*(2)+ ((src[i+width+1] >> 16) & 0xFF)
                ,2)
            ))
        }

        if(i && !(i % width)){
            row++
            colunm = 0
        }

        ctx.fillStyle = rgbToHex(r,g,b);
        ctx.fillRect(colunm,row,1,1);
        colunm++
    }
}