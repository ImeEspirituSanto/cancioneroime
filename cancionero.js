document.getElementById("searchBar").addEventListener("input", function () {
  let query = this.value.toLowerCase();
  let songs = document.querySelectorAll(".song");
 

  songs.forEach((song) => {
    let title = song.querySelector("h3").textContent.toLowerCase();
    let lyrics = song.querySelector(".lyrics").textContent.toLowerCase();

    if (title.includes(query) || lyrics.includes(query)) {
      song.style.display = "block";
    } else {
      song.style.display = "none";
    }
  });
});
// Añade el botón flotante al final del body
document.addEventListener("DOMContentLoaded", () => {
  const floatingButton = document.createElement("button");
  floatingButton.id = "scrollToTop";
  floatingButton.className = "floating-button";
  floatingButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  floatingButton.onclick = scrollToTop;

  // Inserta el botón en el body
  document.body.appendChild(floatingButton);

  // Control de visibilidad del botón según el scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      floatingButton.style.display = "block";
    } else {
      floatingButton.style.display = "none";
    }
  });
});

// Función para hacer scroll hasta el nav principal
function scrollToTop() {
  const nav = document.querySelector("header");
  if (nav) {
    nav.scrollIntoView({ behavior: "auto" });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  // Crear el botón dinámicamente
  const scrollBtn = document.createElement("button");
  scrollBtn.id = "autoScrollBtn";
  scrollBtn.title = "Activar desplazamiento automático";
  scrollBtn.innerHTML = "&#x25BC;"; // Flecha hacia abajo

  // Estilos del botón
  Object.assign(scrollBtn.style, {
    position: "fixed",
    top: "80px",
    right: "20px",
    backgroundColor: "#c0392b", // rojo inactivo
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "45px",
    height: "45px",
    fontSize: "22px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    zIndex: "1000",
  });

  // Animación de hover
  scrollBtn.addEventListener("mouseenter", () => {
    scrollBtn.style.transform = "scale(1.1)";
  });
  scrollBtn.addEventListener("mouseleave", () => {
    scrollBtn.style.transform = "scale(1)";
  });

  // Agregar el botón al body
  document.body.appendChild(scrollBtn);

  // --- Lógica del autoscroll ---
  let autoScrollInterval = null;

  scrollBtn.addEventListener("click", () => {
    if (autoScrollInterval) {
      // Si ya está activo, lo detenemos
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
      scrollBtn.style.backgroundColor = "#c0392b"; // rojo inactivo
      scrollBtn.title = "Activar desplazamiento automático";
    } else {
      // Si está inactivo, lo activamos
      scrollBtn.style.backgroundColor = "#27ae60"; // verde activo
      scrollBtn.title = "Desactivar desplazamiento automático";
      autoScrollInterval = setInterval(() => {
        window.scrollBy({
          top: 150, // cantidad de píxeles que baja cada vez
          behavior: "smooth"
        });
      }, 25000); // cada 10 segundos
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Identificá la deidad según el archivo actual
  // Por ejemplo, si estás en jesus.html:
  const deidad = window.location.pathname.includes("jesus") ? "jesus" :
                 window.location.pathname.includes("diospadre") ? "diospadre" :
                 window.location.pathname.includes("espiritusanto") ? "espiritusanto" :
                 "otros";

  // Obtenemos favoritos actuales del localStorage
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  // Función para chequear si una canción ya está en favoritos
  const estaEnFavoritos = (id) => favoritos.some(fav => fav.id === id);

  // Recorrer todas las canciones
  document.querySelectorAll("article.song").forEach(article => {
    const numero = article.id; // Usamos el id del article
    const titulo = article.querySelector("h3").innerText;
    const idUnico = `${deidad}-${numero}`;

    // Crear el botón corazón
    const heartBtn = document.createElement("button");
    heartBtn.className = "heart-btn";
    heartBtn.innerHTML = "&#10084;"; // corazón
    heartBtn.style.cursor = "pointer";
    heartBtn.style.fontSize = "20px";
    heartBtn.style.border = "none";
    heartBtn.style.background = "none";
    heartBtn.style.marginLeft = "10px";

    // Pintar según esté en favoritos
    heartBtn.style.color = estaEnFavoritos(idUnico) ? "red" : "grey";

    // Agregar al final del artículo
    article.appendChild(heartBtn);

    // Evento click
    heartBtn.addEventListener("click", () => {
      if (estaEnFavoritos(idUnico)) {
        // Quitar de favoritos
        favoritos = favoritos.filter(fav => fav.id !== idUnico);
        heartBtn.style.color = "grey";
      } else {
        // Agregar a favoritos
        favoritos.push({ id: idUnico, titulo, deidad });
        heartBtn.style.color = "red";
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });
  });
});



