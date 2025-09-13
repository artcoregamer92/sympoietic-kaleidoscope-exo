import { getGaiaNarrative } from "./gaiaPrompt.js";

// Eco-citas de ejemplo (luego las leeremos de un JSON)
const ECO_QUOTES = {
  bosque_de_cristal: [
    "Los árboles de sílice cantan cuando el tiempo se fractura.",
    "Las raíces de cristal almacenan horas derrotadas.",
    "Cada crujido bajo tus botas es un aviso: la vida se quiebra cuando olvidamos su fragilidad.",
    "Los troncos de cristal reflejan el futuro que tememos y el pasado que rompimos.",
    "Aquí los árboles son espejos; mírate antes de dar el siguiente paso.",
    "Cuando el silencio suena a vidrios rotos, la naturaleza está pidiendo un susurro, no un rugido.",
    "La luz atraviesa las ramas como la esperanza: solo florece si no la astillas.",
    "No colecciones fragmentos; reconstrúyelos.",
    "En este bosque ningún cristal vuelve a soldar si la empatía no es el pegamento.",
    "Cada destello es un recuerdo del brillo perdido en los bosques que talamos.",
    "Camina lento; los ecos aquí tardan siglos en sanar",
    "Las hojas se hicieron vidrio para que al fin pudiéramos ver nuestro impacto",
    "El bosque de cristal no es un lugar, es un espejo de nuestra propia fragilidad.",
    "Cada paso en este bosque es un eco de lo que hemos roto y lo que aún podemos sanar.",
    "Un suspiro demasiado fuerte puede derribar un siglo de vida",
    "Los pájaros cantan en octavas agudas para no romper el aire con su canto.",
    "Bajo cada astilla yace una semilla aguardando un futuro menos cortante",
    "La transparencia de los árboles revela la opacidad de nuestras acciones.",
    "Si todo lo que tocas tiembla, aprende a acariciar con ideas, no con motosierras.",
    "El rocío se vuelve prisma: multiplica la belleza o la dispersa en lágrimas.",
    "Aquí hasta la sombra reluce; no dejes que tu huella la opaque.",
    "Romper es tan fácil como ignorar; preservar es escuchar el crujido antes del estruendo.",
    "Cada reflejo muestra un camino: uno hacia la ruina, otro hacia la restauración.",
    "Los árboles de cristal no lloran, pero sus raíces sí sienten el dolor de nuestra indiferencia.",
    "Que tus pasos sean promesas y no cicatrices en el cristal del bosque",

  ],
  claro_grietas_toxicas: [
    "Los vapores verdes escriben profecías sobre el polvo.",
    "Los suelos agrietados exhalan futuros ácidos.",
    "Cada grieta es un grito de advertencia: la tierra no olvida.",
    "El suelo exhala venenos que nosotros sembramos con descuidos.",
    "Donde el vapor arde, florece la lección de la negligencia.",
    "Cada grieta cuenta la historia de una fractura en nuestra ética ecológica.",
    "No hay máscara que purifique la culpa del aire contaminado.",
    "La tierra herida supura verdades que evitamos respirar",
    "Las grietas son cicatrices de un planeta que aún puede sanar.",
    "Si el humo quema, recuerda: el planeta también tiene pulmones.",
    "Caminar aquí es firmar un contrato: reparar o perecer.",
    "Entre las fisuras brota una advertencia más verde que el veneno.",
    "Las luciérnagas se han ido; solo queda el resplandor tóxico de nuestras decisiones.",
    "Detén tus pasos; escucha cómo burbujea la responsabilidad bajo tus pies.",
    "La curación empieza donde comienza el remordimiento.",
    "Cada respiración es un voto por la vida o por la letal indiferencia.",
    "Las grietas hablan en susurros ácidos, pero nosotros preferimos el silencio ensordecedor.",
    "Los vapores son fantasmas de árboles talados.",
    "Si el viento trae amargura, siembra un bosque para endulzarlo.",
    "Las grietas no se cierran con cemento, sino con consciencia colectiva.",
    "En el corazón del veneno late aún una chispa de clorofila.",
    "El claro pide menos excusas y más soluciones.",
    "Los colores neón del suelo no son arte, son alarma.",
    "Respira hondo la lección; exhala compromiso.",
    "Cada paso aquí es un eco de nuestra huella tóxica.", 
    "Las grietas son las cicatrices de un planeta que aún puede sanar.",
    "Si el suelo habla, escucha: sus grietas son susurros de advertencia.",

  ],
  valle_e_waste: [
    "Los circuitos rotos todavía sueñan con datos olvidados.",
    "Las montañas de silicio oxidan recuerdos eléctricos.",
    "Cada cable cortado es un hilo de historia que aún podemos tejer.",
    "Los residuos electrónicos son las reliquias de un futuro que aún podemos redimir.",
    "Los circuitos oxidados aún llevan impulsos de nuestra avaricia.",
    "Cada chip roto es un eco de la innovación que olvidamos cuidar.",
    "Entre montañas de chips late un silbido: el lamento del silicio.",
    "Cada pantalla rota proyecta el desperdicio de un futuro cancelado.",
    "Los metales pesados pesan menos que nuestra ligereza al desecharlos.",
    "En el valle, los ecos de la obsolescencia resuenan más fuerte que los de la innovación.",
    "Los residuos electrónicos son las cicatrices de un progreso que olvidó su huella.",
    "Aquí las aves anidan en teclados; no aprietes ‘delete’ a su esperanza.",
    "El cobre se corroe, pero la lección permanece intacta.",
    "Todo pixel caducado guarda un recuerdo de la naturaleza desinstalada.",
    "Los ventiladores muertos ya no enfrían la culpa encendida.",
    "Reprograma tu consumo antes de que el valle se actualice en cenizas.",
    "Las chispas que saltan son estrellas caídas del cielo digital que sobrecargamos.",
    "En la corriente fantasma de baterías vacías aún palpita un pulso de redención.",
    "Cada torre de placas base es una torre de Babel que nadie escucha.",
    "Si el silicio pudiera hablar, pediría raíces, no cables.",
    "No hay ‘trash bin’ infinito en el sistema operativo del planeta.",
    "Las luces LED apagadas cuentan noches enteras de consumo insomne.",
    "Las alarmas del mañana ya suenan en estos montones oxidados.",
    "Reusar es escribir código para el renacimiento.",
    "El zumbido eléctrico se disipa; el eco de la naturaleza reclama su frecuencia.",
    "Actualiza tu conciencia antes de actualizar tu dispositivo.",
    "Haz ‘backup’ de la Tierra: no existe un segundo servidor."

  ]
};

// ↓ NUEVO: referencias a los elementos del DOM
const form      = document.getElementById("exoForm");
const memoryEl  = document.getElementById("memoryInput");
const chapterEl = document.getElementById("chapterSelect");
// (opcional) inputs para temperatura / CO₂ si los añades
const tempEl    = document.getElementById("tempInput");   // <input type="number">
const co2El     = document.getElementById("co2Input");    // idem

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const memory  = memoryEl.value.trim();
  const chapter = chapterEl.value;
  // datos ambientales manuales o simulados
  const envData = getRandomEnvData();   // ← ahora se genera cada envío


  // eco-cita aleatoria según capítulo
  const quotes   = ECO_QUOTES[chapter];
  const ecoQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const text = await getGaiaNarrative(memory, envData, ecoQuote, chapter);

  document.getElementById("gaiaOutput").innerHTML =
    `<p style="color:var(--artcore-pink)">${text}</p>`;

  // avisamos al sketch
  if (window.receiveGaiaText) window.receiveGaiaText(text);
});

// ───── helpers ──────────────────────────────────────────
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEnvData() {
  const t   = randomInt(-20, 80);       // temperatura °C
  const co2 = randomInt(350, 1200);   // ppm CO₂
  const pm  = randomInt(5, 75);       // µg/m³ de PM2.5
  const h   = randomInt(0, 100);      // humedad %
  return `temp=${t}°C, CO2=${co2}ppm, PM25=${pm}µg/m³, humedad=${h}%`;
}
// ────────────────────────────────────────────────────────
document.getElementById("exoForm").addEventListener("submit", () => {
  const audio = document.getElementById("bgAudio");
  if (audio.paused) audio.play();
});

// ────────────────────────────────────────────────────────
// 1. referencia al elemento <audio> y al botón
const audioElem   = document.getElementById("bgAudio");
const audioToggle = document.getElementById("audioToggle");

// 2. si el usuario nunca interactuó, habilita audio al primer clic en el botón
audioToggle.addEventListener("click", () => {
  if (audioElem.paused) {
    audioElem.play();
    audioToggle.textContent = "🔇 Pausar música";
  } else {
    audioElem.pause();
    audioToggle.textContent = "🔊 Reanudar música";
  }
});
