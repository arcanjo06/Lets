// script.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// configuração do canvas responsivo
const dpr = window.devicePixelRatio || 1;
console.log(window.innerHeight + 'x' + window.innerWidth);
let width = 700;
let height = 600;
if (window.innerWidth < 700) width = 380;
if (window.innerHeight < 500) height = 660;

// canvas real em pixels
canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
ctx.scale(dpr, dpr);

// configurações do jogo
const gravidade = 0.2;
const velocidade = 5;
const tamanhoPajaro = width < 420 ? 30 : 40;
const tamanhoObstaculo = width < 420 ? 100 : 120;

// imagens
const imgLivro = new Image();
imgLivro.src = '../src/book.png';
const imgBalde = new Image();
imgBalde.src = '../src/water_bucket.png';

// lista de livros
const livros = [
  "Dom Casmurro – Machado de Assis",
  "1984 – George Orwell",
  "O Sol é Para Todos – Harper Lee",
  "Orgulho e Preconceito – Jane Austen",
  "O Pequeno Príncipe – Antoine de Saint-Exupéry",
  "Mulheres que Correm com os Lobos – Clarissa Pinkola Estés",
  "A Revolução dos Bichos – George Orwell",
  "A Menina que Roubava Livros – Markus Zusak",
  "Sapiens – Yuval Noah Harari",
  "A Guerra dos Tronos – George R. R. Martin",
  "Os Homens que Não Amavam as Mulheres – Stieg Larsson",
  "A Garota no Trem – Paula Hawkins",
  "Mistério na Biblioteca – Enid Blyton",
  "Garota Exemplar – Gillian Flynn",
  "O Silêncio dos Inocentes – Thomas Harris",
  "Rebecca – Daphne du Maurier",
  "Um Dia – David Nicholls",
  "As 220 mortes de Laura Lins - Rafael Weschenfelder",
  "Cem Anos de Solidão – Gabriel García Márquez"
];

// variáveis do jogo
let pajaroX = width / 2 - tamanhoPajaro / 2;
let pajaroY = height / 2 - tamanhoPajaro / 2;
let velocidadePajaro = 0;
let velocidadeMaxPajaro = 10;
let obstaculoX = width;
let obstaculoY = Math.random() * (height - tamanhoObstaculo);
let pontuacao = 0;
let gameOver = false;
let ultimoLivro = "";
let imagensCarregadas = 0;

// aguardar imagens carregarem
imgLivro.onload = () => { imagensCarregadas++; if(imagensCarregadas === 2) atualizar(); };
imgBalde.onload = () => { imagensCarregadas++; if(imagensCarregadas === 2) atualizar(); };

// escolher livro aleatório
function mostrarLivro(){
    const indice = Math.floor(Math.random() * livros.length);
    ultimoLivro = livros[indice];
}

// quebrar texto em várias linhas
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + (i * lineHeight));
  }
}

// desenhar o pássaro
function desenharPajaro() {
  ctx.drawImage(imgLivro, pajaroX, pajaroY, tamanhoPajaro, tamanhoPajaro);
}

// desenhar o obstáculo
function desenharObstaculo() {
  ctx.drawImage(imgBalde, obstaculoX, obstaculoY, tamanhoObstaculo, tamanhoObstaculo);
}

// reiniciar o jogo
function reiniciarJogo(){
  pajaroX = width / 2 - tamanhoPajaro / 2;
  pajaroY = height / 2 - tamanhoPajaro / 2;
  velocidadePajaro = 0;
  velocidadeMaxPajaro = 12;
  obstaculoX = width;
  obstaculoY = Math.random() * (height - tamanhoObstaculo);
  pontuacao = 0;
  ultimoLivro = "";
  gameOver = false;
  atualizar();
}

// atualizar o jogo
function atualizar() {
  try {
    // atualizar posição do pássaro
    pajaroY += velocidadePajaro;
    velocidadePajaro += gravidade;

    // limitar velocidade
    if (velocidadePajaro > velocidadeMaxPajaro) velocidadePajaro = velocidadeMaxPajaro;

    // atualizar obstáculo
    obstaculoX -= velocidade;

    // colisão
    if (pajaroX + tamanhoPajaro > obstaculoX &&
        pajaroX < obstaculoX + tamanhoObstaculo &&
        pajaroY + tamanhoPajaro > obstaculoY &&
        pajaroY < obstaculoY + tamanhoObstaculo) {
      gameOver = true;
    }

    // sair da tela
    if (pajaroY + tamanhoPajaro > height) gameOver = true;

    // obstáculo saiu da tela
    if (obstaculoX + tamanhoObstaculo < 0) {
      obstaculoX = width;
      obstaculoY = Math.random() * (height - tamanhoObstaculo);
      pontuacao++;
      mostrarLivro();
    }

    // desenhar
    ctx.clearRect(0, 0, width, height);
    desenharPajaro();
    desenharObstaculo();

    // pontuação
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = width < 420 ? "24px 'Trebuchet MS'" : "36px 'Trebuchet MS'";
    ctx.fillText(`Pontuação: ${pontuacao}`, 10, 10);

    // livro atual
    ctx.font = width < 420 ? "16px 'Trebuchet MS'" : "24px 'Trebuchet MS'";
    const textoMaxWidth = width - 40;
    wrapText(ctx, `Livro: ${ultimoLivro}`, 20, 50, textoMaxWidth, 28);

    // game over
    if (gameOver) {
      ctx.fillStyle = 'black';
      ctx.font = width < 420 ? "32px 'Trebuchet MS'" : "48px 'Trebuchet MS'";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Game Over!', width / 2, height / 2);

      ctx.font = width < 420 ? "16px Arial" : "32px Arial";
      ctx.fillText('Clique para reiniciar', width / 2, (height / 2) + 50);

      canvas.addEventListener('click', reiniciarJogo, { once: true });
      return;
    }

    // próxima atualização
    requestAnimationFrame(atualizar);

  } catch (error) {
    console.error('Erro ao atualizar o jogo:', error);
  }
}

// iniciar o jogo (será chamado após carregar as imagens)
if (imagensCarregadas === 2) atualizar();

// clicar para pássaro pular
canvas.addEventListener('click', () => {
  if (!gameOver) velocidadePajaro = -7;
});


const textoCarta= 'Primeiramente bom dia/tarde/noite n sei quanto tu vai ver isso KKKK, mas me deu vontade de fazer esse presentinho pra tu, espero que tenha gostado, desculpa a falta de criatividade KKKK, minha cabeça tava meia vazia mas enfim. Parabéns guria tu é o tipo de pessoa que o mundo precisa mais, nem me conhecia direito e me ajudou a fazer aquela tentativa de jogoKKKK, foi mt bom, gosto de tu bem genuinamente por mais que perturbe muito e continue sendo essa pessoa dedicada, linda e engraçada que sempre fosse, acho que nunca te disse isso mas super ficaria ctg pela pessoa que tu é, enfim, aproveita teu dia e os livros que coloquei ali eu nunca li na minha vida, depois me fala se é bom KKKKKKKKKKK, beijos😘.'

const animation = lottie.loadAnimation({
        container: document.getElementById("envelope-animation"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "../src/envelope.json",
      });

      animation.addEventListener("DOMLoaded", () => {
        animation.goToAndStop(animation.totalFrames - 1, true);
      });

      let animacaoTocando = false;

      function escreverTexto(element, texto, delay = 50, callback) {
        let i = 0;
        element.innerHTML = ""; // aqui tudo bem apagar, pois é só o texto

        function digitar() {
          if (i < texto.length) {
            element.innerHTML +=
              texto.charAt(i) === "\n" ? "<br>" : texto.charAt(i);
            i++;
            setTimeout(digitar, delay);
          } else if (callback) {
            callback();
          }
        }

        digitar();
      }
      const envelopeAnimation = document.getElementById("envelope-animation");
      if (envelopeAnimation) {
        envelopeAnimation.addEventListener("click", () => {
          if (!animacaoTocando) {
            animacaoTocando = true;
            animation.setDirection(-1);
            animation.play();
          }
        });

        animation.addEventListener("complete", () => {
          animacaoTocando = false;

          // Esconder animação
          if (envelopeAnimation) {
            envelopeAnimation.style.opacity = 0;
            setTimeout(() => {
              envelopeAnimation.style.display = "none";

              const textoArea = document.getElementById("texto-digitado");
              const cartaTexto = document.getElementById("carta-texto");
              if (cartaTexto) {
                cartaTexto.style.display = "block";
                setTimeout(() => {
                  cartaTexto.style.opacity = 1;
                  if (textoArea && textoCarta) {
                    escreverTexto(textoArea, textoCarta, 40);
                  }
                }, 100);
              }
            }, 500);
          }
        });
      }

