let bolaImagem;
let raqueteImagemJogador;
let raqueteImagemComputador;
let campoImagem;
let quicarSom;
let golSom;
let pontuacaoJogador = 0;
let pontuacaoComputador = 0;
let falando = false;

function preload() {
    bolaImagem = loadImage('./Sprites/bola.png');
    raqueteImagemJogador = loadImage('./Sprites/barra01.png');
    raqueteImagemComputador = loadImage('./Sprites/barra02.png');
    campoImagem = loadImage('./Sprites/fundo.png');
    quicarSom = loadSound('./Sounds/bounce.wav');
    golSom = loadSound('./Sounds/gol.wav');
}

class Raquete {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 60;
    }

    update() {
        // se a raquete é o jogador
        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
            // se a bola está em cima vai pra cima
            if (bola.y < this.y + this.h / 2) {
                this.y -= 3;
            }
            // se a bola está em baixo vai pra baixo
            if (bola.y > this.y + this.h / 2) {
                this.y += 3;
            }
        }
        // limitar dentro da tela
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > height - this.h) {
            this.y = height - this.h;
        }
    }

    draw() {
        // se a raquete é o jogador
        if (this.x < width / 2) {
            //desenha a imagem da raquete do jogador
            image(raqueteImagemJogador, this.x, this.y, this.w, this.h);
        } else {
            //desenha a imagem da raquete do computador
            image(raqueteImagemComputador, this.x, this.y, this.w, this.h);
        }
    }
}

class Bola {
    constructor(x, y, raio) {
        this.x = width / 2;
        this.y = height / 2;
        this.raio = 15;
        this.vx = Math.random() * 10 - 5;
        this.vy = Math.random() * 10 - 5;
        
        //angulo de rotacao atual
        this.angulo = 0;
    }
    
    update() {
        this.y += this.vy;
        this.x += this.vx;
        
        if (falando) return; // Pausa a atualização enquanto a fala está ocorrendo
        
        //rotaciona de acordo com a velocidade x e y
        this.angulo += this.vx / 20;

        // se tocar na borda vertical, reseta no meio da tela
        if (this.x < this.raio || this.x > width - this.raio) {
            if (this.x < this.raio) {
                pontuacaoComputador++;
            } else {
                pontuacaoJogador++;
            }
            golSom.play();
            falaPontos();
        }
        
        // se tocar na borda horizontal, inverte a velocidade
        if (this.y < this.raio || this.y > height - this.raio) {
            this.vy *= -1;
        }
        
        // colisão com as raquetes
        this.checkCollision(raqueteJogador);
        this.checkCollision(raqueteComputador);
        
    }
    
    draw() {
        //rotaciona antes de desenhar
        push();
        translate(this.x, this.y);
        rotate(this.angulo);
        image(bolaImagem, -this.raio, -this.raio, this.raio * 2, this.raio * 2);
        pop();
    }
    
    reset() {
        this.x = width / 2;
        this.y = height / 2;
        const velocidadeMaxima = 5;
        this.vx = (Math.random() > 0.5 ? 1 : -1) * random(3, velocidadeMaxima);
        this.vy = (Math.random() > 0.5 ? 1 : -1) * random(3, velocidadeMaxima);
        this.angulo = 0;
    }
    
    checkCollision(raquete) {
        if (this.x - this.raio < raquete.x + raquete.w &&
            this.x + this.raio > raquete.x &&
            this.y - this.raio < raquete.y + raquete.h &&
            this.y + this.raio > raquete.y) {
                this.vx *= -1;
                this.vx *= 1.1;
                this.vy *= 1.1;
                quicarSom.play();
            }
        }
    }
    
let bola;
let raqueteJogador;
let raqueteComputador;

function falaPontos() {
    let fala = new SpeechSynthesisUtterance();
    fala.text = "Pontuação: Jogador " + pontuacaoJogador + " Computador " + pontuacaoComputador;
    fala.onend = function() {
        falando = false;
        bola.reset();
    };
    falando = true;
    speechSynthesis.speak(fala);
}

// funcao setup do p5.js
function setup() {
    createCanvas(800, 400);
    bola = new Bola(200, 200, 25);
    raqueteJogador = new Raquete(30, height / 2);
    raqueteComputador = new Raquete(width - 40, height / 2);
}

//funcao de desenho do p5.js
function draw() {
    //desenha centralizada o campoImagem no fundo, com o aspectRatio do canvas, e zoomOut máximo possível
    let aspectRatio = campoImagem.width / campoImagem.height;
    let canvasAspectRatio = width / height;
    let zoomOut = (canvasAspectRatio > aspectRatio) ? width / campoImagem.width : height / campoImagem.height;
    let x = (width - campoImagem.width * zoomOut) / 2;
    let y = (height - campoImagem.height * zoomOut) / 2;
    image(campoImagem, x, y, campoImagem.width * zoomOut, campoImagem.height * zoomOut);

    bola.update();
    bola.draw();
    raqueteJogador.update();
    raqueteJogador.draw();
    raqueteComputador.update();
    raqueteComputador.draw();
}