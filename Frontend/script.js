console.log("Patitas Felices cargado 🐾");

const botones = document.querySelectorAll(".filter-btn");
const tarjetas = document.querySelectorAll(".animal-card");

botones.forEach(boton => {
  boton.addEventListener("click", () => {
    const filtro = boton.getAttribute("data-animal");


    tarjetas.forEach(card => {
      if (filtro === "all" || card.getAttribute("data-animal") === filtro) {
        card.style.display = "block"; // Mostrar
      } else {
        card.style.display = "none";  // Ocultar
      }
    });
  });
});
