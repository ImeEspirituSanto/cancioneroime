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
    const navTop = nav.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: navTop, // posición exacta del nav
      behavior: "auto" // desplazamiento suave
    });
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
  const deidad = window.location.href.includes("jesus") ? "jesus" :
                 window.location.href.includes("diospadre") ? "diospadre" :
                 window.location.href.includes("espiritusanto") ? "espiritusanto" :
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
    const audio_src = article.querySelector("audio").src;


    // Crear el botón corazón
    const heartBtn = document.createElement("button");
    heartBtn.className = "heart-btn";
    heartBtn.innerHTML = "&#10084;"; // corazón
    heartBtn.style.cursor = "pointer";
    heartBtn.style.fontSize = "25px";
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
        const letra = article.querySelector(".lyrics")?.innerHTML || "";
        favoritos.push({ id: idUnico, titulo, deidad, letra, audio_src });
        heartBtn.style.color = "red";
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("favoritos.html")) {
    const contenedor = document.getElementById("favoritosContainer");
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritos.length === 0) {
      contenedor.innerHTML = '<p class="favoritos-vacio">No hay canciones favoritas aún... 🕊️</p>';
      return;
    }

    contenedor.innerHTML = "";

    favoritos.forEach(fav => {
      const article = document.createElement("article");
      article.className = "song";
      article.dataset.id = fav.id;

      article.innerHTML = `
        <button class="remove-fav" title="Eliminar de favoritos">✖</button>
        <h3>${fav.titulo}</h3>
        <div class="lyrics">${fav.letra}</div>
        ${fav.audio_src ? `<audio class="song-link" controls src="${fav.audio_src}"></audio>` : ""}
      `;

      contenedor.appendChild(article);
    });

    // 🎯 Escuchar clics en las X (botones de eliminar)
    contenedor.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-fav")) {
        const article = e.target.closest("article");
        const id = article.dataset.id;

        // Eliminar visualmente
        article.remove();

        // Eliminar del localStorage
        favoritos = favoritos.filter(fav => fav.id !== id);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));

        // Si ya no quedan favoritos, mostrar mensaje
        if (favoritos.length === 0) {
          contenedor.innerHTML = '<p class="favoritos-vacio">No hay canciones favoritas aún... 🕊️</p>';
        }
      }
    });
  } // <-- cierre del primer if

  // Aquí va el navToggle sin abrir otro DOMContentLoaded
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if(navToggle && navMenu){
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    // Para dropdowns en móvil
    document.querySelectorAll(".dropdown > a").forEach(link => {
      link.addEventListener("click", (e) => {
        if(window.innerWidth <= 768){
          e.preventDefault();
          link.parentElement.classList.toggle("active");
        }
      });
    });
  }
}); // <-- cierre correcto del DOMContentLoaded
// --- Menú hamburguesa para móviles (funciona aunque no haya canciones) ---
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    // Evita que los dropdowns se abran por hover en móvil
    document.querySelectorAll(".dropdown > a").forEach(link => {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          link.parentElement.classList.toggle("active");
        }
      });
    });
  }
});




