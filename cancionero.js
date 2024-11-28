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
    nav.scrollIntoView({ behavior: "smooth" });
  }
}


