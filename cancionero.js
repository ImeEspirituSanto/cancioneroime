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
  scrollBtn.addEventListener("click", function () {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
      scrollBtn.style.backgroundColor = "#c0392b";
      scrollBtn.title = "Activar desplazamiento automático";
    } else {
      scrollBtn.style.backgroundColor = "#27ae60";
      scrollBtn.title = "Desactivar desplazamiento automático";
      autoScrollInterval = setInterval(function () {
        window.scrollBy(0, 150);
      }, 25000);
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




