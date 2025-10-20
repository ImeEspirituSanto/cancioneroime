document.addEventListener("DOMContentLoaded", function () {
  // ====== BÚSQUEDA ======
  var searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", function () {
      var query = this.value.toLowerCase();
      var songs = document.querySelectorAll(".song");
      for (var i = 0; i < songs.length; i++) {
        var song = songs[i];
        var title = song.querySelector("h3").textContent.toLowerCase();
        var lyrics = song.querySelector(".lyrics").textContent.toLowerCase();
        if (title.indexOf(query) !== -1 || lyrics.indexOf(query) !== -1) {
          song.style.display = "block";
        } else {
          song.style.display = "none";
        }
      }
    });
  }

  // ====== BOTÓN SUBIR ======
  var floatingButton = document.createElement("button");
  floatingButton.id = "scrollToTop";
  floatingButton.className = "floating-button";
  floatingButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  floatingButton.onclick = scrollToTop;
  document.body.appendChild(floatingButton);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
      floatingButton.style.display = "block";
    } else {
      floatingButton.style.display = "none";
    }
  });

  function scrollToTop() {
    var nav = document.querySelector("header");
    if (nav) {
      var navTop = nav.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo(0, navTop);
    }
  }

  // ====== AUTO SCROLL ======
  var scrollBtn = document.createElement("button");
  scrollBtn.classList.add("no-dark");
  scrollBtn.id = "autoScrollBtn";
  scrollBtn.title = "Activar desplazamiento automático";
  scrollBtn.innerHTML = "&#x25BC;";
  scrollBtn.style.position = "fixed";
  scrollBtn.style.top = "80px";
  scrollBtn.style.right = "20px";
  scrollBtn.style.backgroundColor = "#c0392b";
  scrollBtn.style.color = "white";
  scrollBtn.style.border = "none";
  scrollBtn.style.borderRadius = "50%";
  scrollBtn.style.width = "45px";
  scrollBtn.style.height = "45px";
  scrollBtn.style.fontSize = "22px";
  scrollBtn.style.cursor = "pointer";
  scrollBtn.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
  scrollBtn.style.transition = "background-color 0.3s ease, transform 0.2s ease";
  scrollBtn.style.zIndex = "1000";
  

  scrollBtn.addEventListener("mouseenter", function () {
    scrollBtn.style.transform = "scale(1.1)";
  });
  scrollBtn.addEventListener("mouseleave", function () {
    scrollBtn.style.transform = "scale(1)";
  });

  document.body.appendChild(scrollBtn);

  var autoScrollInterval = null;
  scrollBtn.addEventListener("click", () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
    scrollBtn.style.backgroundColor = "#c0392b"; // rojo inactivo
    scrollBtn.title = "Activar desplazamiento automático";
  } else {
    autoScrollInterval = setInterval(() => {
      window.scrollBy({
        top: 120,
        behavior: "smooth"
      });
    }, 18000);
    scrollBtn.style.backgroundColor = "#27ae60"; // verde activo
    scrollBtn.title = "Desactivar desplazamiento automático";
  }
});


  // ====== FAVORITOS ======
  var deidad = "otros";
  var url = window.location.href;
  if (url.indexOf("jesus") !== -1) deidad = "jesus";
  else if (url.indexOf("diospadre") !== -1) deidad = "diospadre";
  else if (url.indexOf("espiritusanto") !== -1) deidad = "espiritusanto";

  var favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  function estaEnFavoritos(id) {
    for (var i = 0; i < favoritos.length; i++) {
      if (favoritos[i].id === id) return true;
    }
    return false;
  }

  var canciones = document.querySelectorAll("article.song");
  for (var i = 0; i < canciones.length; i++) {
    (function () {
      var article = canciones[i];
      var numero = article.id;
      var titulo = article.querySelector("h3").innerText;
      var idUnico = deidad + "-" + numero;
      var audioElem = article.querySelector("audio");
      var audio_src = audioElem ? audioElem.src : "";

      var heartBtn = document.createElement("button");
      heartBtn.className = "heart-btn";
      heartBtn.innerHTML = "&#10084;";
      heartBtn.style.cursor = "pointer";
      heartBtn.style.fontSize = "25px";
      heartBtn.style.border = "none";
      heartBtn.style.background = "none";
      heartBtn.style.marginLeft = "10px";
      heartBtn.style.color = estaEnFavoritos(idUnico) ? "red" : "grey";
      article.appendChild(heartBtn);

      heartBtn.addEventListener("click", function () {
        if (estaEnFavoritos(idUnico)) {
          favoritos = favoritos.filter(function (fav) {
            return fav.id !== idUnico;
          });
          heartBtn.style.color = "grey";
        } else {
          var letraElem = article.querySelector(".lyrics");
          var letra = letraElem ? letraElem.innerHTML : "";
          favoritos.push({
            id: idUnico,
            titulo: titulo,
            deidad: deidad,
            letra: letra,
            audio_src: audio_src
          });
          heartBtn.style.color = "red";
        }
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
      });
    })();
  }

  // ====== SECCIÓN FAVORITOS ======
  if (window.location.pathname.indexOf("favoritos.html") !== -1) {
    var contenedor = document.getElementById("favoritosContainer");
    var favoritosGuardados = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritosGuardados.length === 0) {
      contenedor.innerHTML =
        '<p class="favoritos-vacio">No hay canciones favoritas aún... 🕊️</p>';
    } else {
      contenedor.innerHTML = "";
      for (var j = 0; j < favoritosGuardados.length; j++) {
        var fav = favoritosGuardados[j];
        var article = document.createElement("article");
        article.className = "song";
        article.setAttribute("data-id", fav.id);

        article.innerHTML =
          '<button class="remove-fav" title="Eliminar de favoritos">✖</button>' +
          "<h3>" +
          fav.titulo +
          "</h3>" +
          '<div class="lyrics">' +
          fav.letra +
          "</div>" +
          (fav.audio_src
            ? '<audio class="song-link" controls src="' + fav.audio_src + '"></audio>'
            : "");

        contenedor.appendChild(article);
      }

      contenedor.addEventListener("click", function (e) {
        var target = e.target;
        if (target.classList.contains("remove-fav")) {
          var article = target.closest("article");
          var id = article.getAttribute("data-id");
          article.parentNode.removeChild(article);

          favoritosGuardados = favoritosGuardados.filter(function (fav) {
            return fav.id !== id;
          });
          localStorage.setItem("favoritos", JSON.stringify(favoritosGuardados));

          if (favoritosGuardados.length === 0) {
            contenedor.innerHTML =
              '<p class="favoritos-vacio">No hay canciones favoritas aún... 🕊️</p>';
          }
        }
      });
    }
  }

  // ====== MENÚ HAMBURGUESA ======
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
      } else {
        navMenu.classList.add("active");
      }
    });

    var dropdowns = document.querySelectorAll(".dropdown > a");
    for (var k = 0; k < dropdowns.length; k++) {
      dropdowns[k].addEventListener("click", function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          var parent = this.parentElement;
          if (parent.classList.contains("active")) {
            parent.classList.remove("active");
          } else {
            parent.classList.add("active");
          }
        }
      });
    }
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav") || document.querySelector("header");
  if (!nav) return;

  // Crear el botón de modo oscuro
  const darkModeBtn = document.createElement("button");
  darkModeBtn.id = "darkModeBtn";
  darkModeBtn.title = "Modo nocturno";
  darkModeBtn.innerHTML = "🌙";

  // Estilos base del botón
  Object.assign(darkModeBtn.style, {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    marginLeft: "auto",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
  });

  // Insertar el botón al final del nav (alineado a la derecha)
  nav.style.display = "flex";
  nav.style.alignItems = "center";
  nav.style.justifyContent = "space-between";
  nav.appendChild(darkModeBtn);

  // Verificar modo guardado
  const body = document.body;
  const modoGuardado = localStorage.getItem("modo");
  if (modoGuardado === "oscuro") {
    body.classList.add("dark-mode");
    darkModeBtn.innerHTML = "☀️";
  }

  // Evento de cambio de modo
  darkModeBtn.addEventListener("click", function () {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("modo", "oscuro");
      darkModeBtn.innerHTML = "☀️";
    } else {
      localStorage.setItem("modo", "claro");
      darkModeBtn.innerHTML = "🌙";
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Crear el botón para ir al h3 más cercano
  var scrollToH3Btn = document.createElement("button");
  scrollToH3Btn.id = "scrollToH3Btn";
  scrollToH3Btn.title = "Ir al inicio de la canción";
  scrollToH3Btn.innerHTML = "🎵"; // icono musical

  // Estilos básicos del botón
  scrollToH3Btn.style.position = "fixed";
  scrollToH3Btn.style.bottom = "90px";
  scrollToH3Btn.style.right = "20px";
  scrollToH3Btn.style.backgroundColor = "#2980b9";
  scrollToH3Btn.style.color = "#fff";
  scrollToH3Btn.style.border = "none";
  scrollToH3Btn.style.borderRadius = "50%";
  scrollToH3Btn.style.width = "45px";
  scrollToH3Btn.style.height = "45px";
  scrollToH3Btn.style.fontSize = "22px";
  scrollToH3Btn.style.cursor = "pointer";
  scrollToH3Btn.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
  scrollToH3Btn.style.transition = "transform 0.2s ease";
  scrollToH3Btn.style.zIndex = "1000";
  scrollToH3Btn.style.display = "none";

  // Animación al pasar el mouse
  scrollToH3Btn.addEventListener("mouseenter", function () {
    scrollToH3Btn.style.transform = "scale(1.1)";
  });
  scrollToH3Btn.addEventListener("mouseleave", function () {
    scrollToH3Btn.style.transform = "scale(1)";
  });

  // Agregar el botón al body
  document.body.appendChild(scrollToH3Btn);

  // Mostrar/ocultar el botón según el scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      scrollToH3Btn.style.display = "block";
    } else {
      scrollToH3Btn.style.display = "none";
    }
  });

  // Función auxiliar para mover el scroll
  function scrollTo(y) {
    window.scrollTo(0, y);
  }

  // Al hacer clic, ir al <h3> más cercano hacia arriba
  scrollToH3Btn.addEventListener("click", function () {
    var headings = document.getElementsByTagName("h3");
    var target = null;

    for (var i = headings.length - 1; i >= 0; i--) {
      var rect = headings[i].getBoundingClientRect();
      var top = rect.top + window.pageYOffset;
      if (top < window.scrollY - 10) { // el más cercano hacia arriba
        target = headings[i];
        break;
      }
    }

    // Si no hay uno más arriba, usar el primero
    if (!target && headings.length > 0) {
      target = headings[0];
    }

    if (target) {
      var offset = target.getBoundingClientRect().top + window.pageYOffset;
      scrollTo(offset);
    }
  });
});






