// DECLARACAO DE ELEMENTS USANDO DOM(DOCUMENT OBJECT MODEL)

const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//FUNCAO QUE VAI HABILITAR A CÂMERA 

async function configurarCamera(){
    try {
        const midia = await navigator.mediaDevices.getUserMedia({
            video:{facingMode: "environment"},
            audio: false
        })
        videoElemento.srcObject = midia;
        videoElemento.play();
    }catch(erro){
        resultado.innerText="Erro ao acessar a camera",erro;

    }
}
configurarCamera();

//FUNCAO PARA LER O TEXTO DA IMAGEM E MOSTRAR NA TELA

botaoScanear.onclick = async()=>{
    botaoScanear.disable= true;
    resultado.innerText= "Fazendo a leitura...aguarde";
    //CHAMA A ESTRUTURA DO CANVA
    const context = canvas.getContext("2d");

    //AJUSTA O TAMANHO DA TELA
    canvas.width = videoElemento.videoWidth; //ALTURA
    canvas.height = videoElemento.videoHeight; // LARGURA

    // RESET DE QQ TRANSFORMAÇÃO PARA GARANTIR QUE A FOTO NAO 
    // FIQUE INVERTIDA
    context.setTransform(1, 0, 1 ,0 ,0);
    
    //APLICA O FILTRO DE CONTRASTE
    context.filter = 'contrast(1.2) grayscale(1)';
    //CONSTRUINDO A TELA PARA TIRAR A FOTO
    context.drawImage(videoElemento, 0, 0, canvas.width, canvas.height);
    try{
        const {data:{ text }} = await Tesseract.recognize(
            canvas,
            'por'

        );
    //REMOVE ESPAÇOS EXCSSSIVOS E CARACTERS ESPECIAIS
    const textoFinal = text.trim();

    resultado.innerText = textoFinal.lenght >0 ? textoFinal : "Nao foi possivel identificar o texto" 
    }catch(erro){
        console.error(erro);
        resultado.innerText="erro ao processar",erro;

    }finally{
        //DESABILITAR BOTAO
        botaoScanear.disable=false;

    }
}
