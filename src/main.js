  import { getGaiaNarrative } from "./gaiaPrompt.js";

  // === PRUEBA RÁPIDA ===
  (async () => {
    const texto = await getGaiaNarrative(
      "La primera vez que vi nevar sobre los tejados de Bogotá…",
      "temp=25°C, CO2=450ppm, PM25=10µg/m³, humedad=40%",
      "Los árboles de sílice cantan cuando el tiempo se fractura.",
      "bosque_de_cristal"
    );
    console.log(texto);            // lo verás en la consola del navegador
    document.body.insertAdjacentHTML("beforeend",
      `<p style=\"color:var(--artcore-pink);max-width:600px\">${texto}</p>`);
  })();
