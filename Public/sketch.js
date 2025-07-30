/*  Sympoietic Kaleidoscope – versión avanzada
    · Convierte el texto en puntos (textToPoints) usando p5.Font
    · Dibuja 24 shards que giran suavemente creando estelas
    · Paleta dual Artcore: fucsia #EB0045 y cian #00FFD7 (blend ADD)
    · Cada vez que llega un nuevo relato se recalculan los puntos
*/

let font;                       // fuente p5.Font
let points = [];                // puntos del texto
let pg;                          // buffer para trail
let gaiaText = "";
const shardCount = 24;
const trailAlpha = 20;           // 0 (sin estela) – 255 (sin trail)

/* Recibe texto desde main.js */
window.receiveGaiaText = (txt) => {
  gaiaText = txt;
  calcPoints();
};

function preload() {
  // Inter Regular desde jsDelivr (TTF, CORS friendly)
  font = loadFont("https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.ttf");
}


function setup() {
  createCanvas(windowWidth, 400);
  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.translate(pg.width / 2, pg.height / 2);
  pg.colorMode(RGB, 255, 255, 255, 255);
  calcPoints();
}

function draw() {
  // Estela suave
  push();
  fill(0, trailAlpha);
  rect(0, 0, width, height);
  pop();

  translate(width / 2, height / 2);
  const radius = height * 0.4;
  const angleStep = TWO_PI / shardCount;
  const rot = millis() * 0.0005;

  for (let i = 0; i < shardCount; i++) {
    push();
    rotate(i * angleStep + rot);
    // Clip triángulo (sector estrecho)
    beginShape();
    vertex(0, 0);
    vertex(radius, -radius * 0.1);
    vertex(radius, radius * 0.1);
    endShape(CLOSE);

    // Dibuja puntos
    const hueToggle = i % 2 === 0 ? "#EB0045" : "#00FFD7";
    fill(hueToggle);
    noStroke();
    for (const p of points) {
      circle(p.x, p.y, 2.5);
    }
    pop();
  }
}

/* --- Helpers --- */
function calcPoints() {
  function calcPoints() {
  if (!font) {
    /* fallback simple: usa buffer renderToBuffer() de la versión básica */
    points = [];
    return;
  }
  // ... resto del código
}

  if (!font) return;
  points = font.textToPoints(gaiaText, 0, 0, 22, {
    sampleFactor: 0.25,
    simplifyThreshold: 0
  });
  // Normaliza al centro
  let bounds = font.textBounds(gaiaText, 0, 0, 22);
  let offsetX = -bounds.w / 2;
  let offsetY = bounds.h / 2;
  points = points.map(pt => createVector(pt.x + offsetX, pt.y + offsetY));
}

function windowResized() {
  resizeCanvas(windowWidth, 400);
}
function setup() {
  createCanvas(windowWidth, 400);
  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.translate(pg.width / 2, pg.height / 2);

  // Si por alguna razón font no cargó, usa método buffer
  if (!font) {
    console.warn("⚠️ Fuente no cargada, uso método buffer.");
    textMode(CENTER);
  }

  calcPoints();
}


