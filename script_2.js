let buttonZhangSuen = document.getElementById("btn-suen")
let buttonEroDil = document.getElementById("btn-er-di")

buttonEroDil.addEventListener("click",  () => {
    addCanvas()

    buttonZhangSuen.click()

    erosao()

    dilatacao()
})

function erosao(){
    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    let masc = [
        [0,1,0],
        [1,1,1],
        [0,1,0]
    ]

    let cor
    let remove
    let pp = []
    
    for (let i = 0; i < src.length; i++) {
        pp[i] = 0;        
    }   

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        cor = parseInt(0.299 * r + 0.587 * g + 0.114 * b)

        if(cor > 0){
            remove = false
            for(let j = -1; j <= 1; j++){
                for(let k = -1; k <= 1; k++){
                    let desloc = 0;

                    desloc += j == -1? -width: 0
                    desloc += j == 1? width: 0

                    desloc += k == -1? -1: 0
                    desloc += k == 1? 1: 0

                    r = src[i+desloc] & 0xFF
                    g = (src[i+desloc] >> 8) & 0xFF
                    b = (src[i+desloc] >> 16) & 0xFF
                    
                    let cor_2 = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
                    
                    if(masc[j+1][k+1] == 1 && cor_2 == 0){
                        remove = true
                    }

                    if(remove){
                        pp[i] = 0
                    }
                    else{
                        pp[i] = 255
                    }
                }
            }
        }
    }

    for(i=0; i<src.length;i++){
        ctx.fillStyle = rgbToHex(pp[i], pp[i], pp[i])
        ctx.fillRect(i % width, parseInt(i / width), 1, 1)
    }

    document.getElementById("canvas-processado").appendChild(canvas)
}

function dilatacao(){
    alert("dilatacao")
}

buttonZhangSuen.addEventListener("click", () => {
    const { width, height } = inImg
    const src = new Uint32Array(inImg.data.buffer)

    const ctx = canvasProcessado.getContext('2d')
    canvasProcessado.width = width
    canvasProcessado.height = height

    let len = width * height
    pp = []

    for (let i = 0; i < src.length; i++) {
        r = src[i] & 0xFF
        g = (src[i] >> 8) & 0xFF
        b = (src[i] >> 16) & 0xFF

        pp[i] = parseInt(0.299 * r + 0.587 * g + 0.114 * b)
    }

    for (x = 0; x < 5; x++) {
        for (n = 0; n < 2; n++) {
            id = [];
            for (i = 0; i < len;) {
                p1 = pp[i] > 200? 1:0 
                p2 = pp[i - width] > 200? 1:0 
                p3 = pp[i - width + 1] > 200? 1:0
                p8 = pp[i - 1] > 200? 1:0 
                p9 = pp[i - width - 1] > 200? 1:0 
                p4 = pp[i + 1] > 200? 1:0
                p7 = pp[i + width - 1] > 200? 1:0 
                p6 = pp[i + width] > 200? 1:0 
                p5 = pp[i + width + 1] > 200? 1:0
                
                zn = 0;
                b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
                if (p2 < p3) { zn++; }
                if (p3 < p4) { zn++; }
                if (p4 < p5) { zn++; }
                if (p5 < p6) { zn++; }
                if (p6 < p7) { zn++; }
                if (p7 < p8) { zn++; }
                if (p8 < p9) { zn++; }
                if (p9 < p2) { zn++; }
                if (b >= 2 && b <= 6 && zn == 1 && p2 * p4 * p6 == 0 && p4 * p6 * p8 == 0 && n == 0) { id.push(i); }
                if (b >= 2 && b <= 6 && zn == 1 && p2 * p4 * p8 == 0 && p2 * p6 * p8 == 0 && n == 1) { id.push(i); }
                i++;
            }
            for (i = 0; i < id.length; i++) { pp[id[i]] = -1; } 
        }
    }

    for(i=0; i<len;i++){
        if(pp[i]==-1) ctx.fillStyle = rgbToHex(255, 255, 255)
        else ctx.fillStyle = rgbToHex(0, 0, 0)
        
        ctx.fillRect(i % width, parseInt(i / width), 1, 1)
    }
})