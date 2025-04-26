// Este archivo se cargará en ambas páginas para manejar la música
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay música guardada en localStorage
  const savedMusicTime = localStorage.getItem("musicTime")
  const savedMusicPlaying = localStorage.getItem("musicPlaying")
  const music = document.getElementById("background-music")

  // Determinar si estamos en index.html
  const isIndexPage =
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/") ||
    window.location.pathname === ""

  if (music) {
    // En index.html, verificar si es la primera visita
    if (isIndexPage) {
      const isFirstVisit = sessionStorage.getItem("visitedBefore") === null

      // Si es la primera visita, reiniciar la música
      if (isFirstVisit) {
        music.currentTime = 0
        localStorage.setItem("musicTime", "0")
        // Marcar como visitado para futuras cargas
        sessionStorage.setItem("visitedBefore", "true")
      }
      // Si no es la primera visita, restaurar la posición guardada
      else if (savedMusicTime) {
        music.currentTime = Number.parseFloat(savedMusicTime)
      }
    }
    // En otras páginas, restaurar la posición si existe
    else if (savedMusicPlaying === "true" && savedMusicTime) {
      music.currentTime = Number.parseFloat(savedMusicTime)
    }

    // Intentar reproducir la música si estaba sonando
    if (savedMusicPlaying === "true") {
      const playPromise = music.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error al restaurar música:", error)
        })
      }
    }
  }

  // Guardar la posición actual de la música antes de navegar
  window.addEventListener("beforeunload", () => {
    if (music && !music.paused) {
      localStorage.setItem("musicTime", music.currentTime)
      localStorage.setItem("musicPlaying", "true")
    } else if (music) {
      localStorage.setItem("musicPlaying", "false")
    }
  })
})
