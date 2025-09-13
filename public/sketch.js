/*  Sympoietic Kaleidoscope – versión PROC-GEN
    • Cada nuevo texto => randomSeed() distinto (basado en su hash)
    • Par [ shardCount, rotSpeed, rotDir, bgFade, accentColor ] se recalcula
    • Canvas reacciona en tiempo real
*/

let pg;                      // buffer con el texto
let gaiaText = " ";          // texto actual
let P = {};                  // parámetros generados



// ── Partículas de fondo (polvo/niebla) ───────────────────
let particles = [];
let PARTICLE_COUNT = 240;  // ajusta si necesitas más/menos

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    // posiciones relativas al centro para permitir "wrap" suave
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.r = random(1.2, 3.0);            // tamaño del punto
    this.sp = random(0.25, 0.8);          // velocidad
    this.no = random(1000);               // offset de ruido
    this.alpha = random(35, 90);           // opacidad baja
  }
  update() {
    // flujo con Perlin noise
    const ang = noise(this.x * 0.001, this.y * 0.001, frameCount * 0.003 + this.no) * TWO_PI * 2;
    this.x += cos(ang) * this.sp;
    this.y += sin(ang) * this.sp;

    // envolver bordes
    if (this.x < -width || this.x > width || this.y < -height || this.y > height) this.reset();
  }
  draw() {
    // toma colores desde P (si existen) o usa grises por defecto
    const c1 = color(P?.accentFrom || "#696969ff");
    const c2 = color(P?.accentTo   || "#c3c3c3ff");
    const t  = noise(this.no);                   // mezcla suave por partícula
    const c  = lerpColor(c1, c2, t);
    c.setAlpha(this.alpha);
    noStroke();
    fill(c);
    // compensar porque x/y están centrados
    circle(this.x + width/2, this.y + height/2, this.r);
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}

function drawParticles() {
  // modo aditivo para brillos suaves
  blendMode(ADD);
  for (const p of particles) { p.update(); p.draw(); }
  blendMode(BLEND);
}


// ====================  API pública ====================
window.receiveGaiaText = (txt) => {
  gaiaText = txt;
  regenParams(txt);
  renderToBuffer();
};

// ====================  Setup  ====================
function setup() {
  createCanvas(windowWidth, 400);
  textFont("Arial");
  textAlign(CENTER, CENTER);
  noStroke();
  regenParams(gaiaText);
  renderToBuffer();
  initParticles();
  
}

// ====================  Loop  ====================
function draw() {

  drawParticles();   // fondo sutil

  const bgAlpha = constrain((P.bgFade ?? 40) - 20, 5, 60); // ↓ menos alpha = más rastro
background(0, bgAlpha);
drawParticles();
  // dibuja partículas en capa aparte para más control
  

  // fondo con leve alfa => estela / fading
  background(0, P.bgFade);


  const R = height * 0.45;           // radio de los shards
  const angleStep = TWO_PI / P.shardCount;

  translate(width / 2, height / 2);

  for (let i = 0; i < P.shardCount; i++) {
    push();
    const dynamicRot = P.rotSpeed * frameCount;
    rotate(i * angleStep + dynamicRot);

    // máscara triangular
    beginShape();
    vertex(0, 0);
    vertex(R, -R / 6);
    vertex(R, R / 6);
    endShape(CLOSE);

    tint(P.accentColor);
    image(pg, 0, -R / 2, R, R);
    pop();
  }
}

// ====================  Glow sprite  ====================
//function buildGlowSprite(d = 96) {
  //glowSprite = createGraphics(d, d);
  //glowSprite.noStroke();
  //for (let r = d/2; r > 0; r--) {
 //   const a = map(r, d/2, 0, 0, 220);        // curva de alpha
  //  glowSprite.fill(255, a * 0.06);          // suave
  //  glowSprite.circle(d/2, d/2, r*2);
 // }
//}

// ====================  Helpers  ====================
function regenParams(str) {
  /* Hash simple → número reproducible */
  const seed = Array.from(str).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  randomSeed(seed);

  P.shardCount  = int(random(8, 18));            // 8-17 copias
  P.rotSpeed    = random(0.003, 0.012) * random([-1, 1]); // velocidad y dirección
  P.bgFade      = random(20, 90);                // estela larga ↔ corta
  P.accentColor = random(["#EB0045", "#AB63F2", "#11d1eeff", "#FFB400", "#07F285", "#05DBF2"]); // colores vibrantes
}

function renderToBuffer() {
  if (!pg) pg = createGraphics(width * 2, height * 2); // *2 = nitidez
  pg.clear();
  pg.textFont("Arial");
  pg.textAlign(CENTER, CENTER);
  pg.textWrap(WORD);
  pg.fill(P.accentColor);
  pg.textSize(28);
  pg.text(gaiaText, pg.width / 2, pg.height / 2, pg.width * 0.85);
}

function windowResized() {
  resizeCanvas(windowWidth, 400);
 // fogLayer = createGraphics(width, height);
  buildGlowSprite(96);
  initParticles();
  renderToBuffer();
}


