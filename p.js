document.addEventListener("DOMContentLoaded", () => {
    // Book navigation
    const bookContent = document.querySelector(".book-content")
    const prevBtn = document.getElementById("prev-btn")
    const nextBtn = document.getElementById("next-btn")
    const currentPageEl = document.getElementById("current-page")
    const totalPagesEl = document.getElementById("total-pages")
  
    let currentPage = 0
    const totalPages = 6
    let isFlipping = false
  
    // Initialize the book
    renderPage(currentPage)
    updateNavigation()
  
    // Event listeners for navigation
    prevBtn.addEventListener("click", goToPrevPage)
    nextBtn.addEventListener("click", goToNextPage)
  
    function goToPrevPage() {
      if (currentPage > 0 && !isFlipping) {
        flipPage(currentPage - 1)
      }
    }
  
    function goToNextPage() {
      if (currentPage < totalPages - 1 && !isFlipping) {
        flipPage(currentPage + 1)
      }
    }
  
    function flipPage(newPage) {
      isFlipping = true
  
      // Add flipping animation
      const currentPageWrapper = bookContent.querySelector(".page-wrapper")
      currentPageWrapper.classList.add("flipping")
  
      // After animation completes, render the new page
      setTimeout(() => {
        currentPage = newPage
        renderPage(currentPage)
        updateNavigation()
        isFlipping = false
      }, 500)
    }
  
    function renderPage(pageIndex) {
      // Clear current content
      bookContent.innerHTML = ""
  
      // Get template for the current page
      const templateId = `page${pageIndex + 1}-template`
      const template = document.getElementById(templateId)
  
      if (template) {
        const clone = document.importNode(template.content, true)
        bookContent.appendChild(clone)
  
        // Initialize page-specific functionality
        if (pageIndex === 3) {
          initCrossword()
        } else if (pageIndex === 4) {
          initWordSearch()
        }
      }
    }
  
    function updateNavigation() {
      currentPageEl.textContent = currentPage + 1
      totalPagesEl.textContent = totalPages
  
      prevBtn.disabled = currentPage === 0
      nextBtn.disabled = currentPage === totalPages - 1
    }
  
    // Crossword puzzle functionality
    function initCrossword() {
      const questions = [
        { id: "color", question: "Mi color favorito", answer: "negro", direction: "across", row: 0, col: 0, length: 5 },
        {
          id: "cita",
          question: "Lugar de la primera cita",
          answer: "musas",
          direction: "across",
          row: 1,
          col: 2,
          length: 5,
        },
        {
          id: "postre",
          question: "Sabor del postre que te invité en la primera cita",
          answer: "coco",
          direction: "across",
          row: 2,
          col: 4,
          length: 4,
        },
        {
          id: "peluche",
          question: "Nombre de uno de mis peluches",
          answer: "spiderman",
          direction: "across",
          row: 3,
          col: 0,
          length: 9,
        },
        {
          id: "curso",
          question: "Mi curso favorito es",
          answer: "redes",
          direction: "across",
          row: 4,
          col: 3,
          length: 5,
        },
        {
          id: "animal",
          question: "Animal que más mencionamos",
          answer: "monky",
          direction: "across",
          row: 5,
          col: 1,
          length: 5,
        },
        {
          id: "declare",
          question: "Lugar donde me declaré",
          answer: "ruta6",
          direction: "across",
          row: 6,
          col: 2,
          length: 5,
        },
        {
          id: "picnic",
          question: "Donde hicimos nuestro picnic",
          answer: "pimentel",
          direction: "across",
          row: 7,
          col: 0,
          length: 8,
        },
      ]
  
      const crosswordGrid = document.getElementById("crossword-grid")
      const crosswordQuestions = document.getElementById("crossword-questions")
  
      if (!crosswordGrid || !crosswordQuestions) return
  
      // Create the grid
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const cell = document.createElement("div")
          cell.classList.add("crossword-cell")
  
          // Check if this cell is part of a word
          let isPartOfWord = false
          let questionId = ""
          let letterIndex = 0
  
          for (const q of questions) {
            if (q.direction === "across" && q.row === row && col >= q.col && col < q.col + q.length) {
              isPartOfWord = true
              questionId = q.id
              letterIndex = col - q.col
              break
            }
          }
  
          if (isPartOfWord) {
            cell.dataset.questionId = questionId
            cell.dataset.letterIndex = letterIndex
          } else {
            cell.classList.add("empty")
          }
  
          crosswordGrid.appendChild(cell)
        }
      }
  
      // Create the questions
      questions.forEach((q, index) => {
        const questionDiv = document.createElement("div")
        questionDiv.classList.add("crossword-question")
        questionDiv.dataset.questionId = q.id
  
        questionDiv.innerHTML = `
          <span>${index + 1}. ${q.question}:</span>
          <input type="text" data-question-id="${q.id}" maxlength="${q.length}">
        `
  
        crosswordQuestions.appendChild(questionDiv)
  
        // Add event listener to the input
        const input = questionDiv.querySelector("input")
        input.addEventListener("input", (e) => {
          const value = e.target.value.toUpperCase()
          const questionId = e.target.dataset.questionId
          const question = questions.find((q) => q.id === questionId)
  
          // Update the grid cells
          const cells = crosswordGrid.querySelectorAll(`[data-question-id="${questionId}"]`)
          cells.forEach((cell) => {
            const letterIndex = Number.parseInt(cell.dataset.letterIndex)
            if (letterIndex < value.length) {
              cell.textContent = value[letterIndex]
            } else {
              cell.textContent = ""
            }
          })
  
          // Check if the answer is correct
          if (value.toLowerCase() === question.answer.toLowerCase()) {
            questionDiv.classList.add("correct")
            cells.forEach((cell) => cell.classList.add("correct"))
          } else {
            questionDiv.classList.remove("correct")
            cells.forEach((cell) => cell.classList.remove("correct"))
          }
        })
      })
    }
  
    // Word search functionality
    function initWordSearch() {
      const words = ["GARDEN", "HAPPYLAND", "PIMENTEL", "FEXTICUN", "TEATRO"]
      const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff"]
      const gridSize = 15
  
      const wordsearchGrid = document.getElementById("wordsearch-grid")
      const wordsearchWords = document.getElementById("wordsearch-words")
  
      if (!wordsearchGrid || !wordsearchWords) return
  
      // Generate the grid
      const grid = generateWordSearchGrid(words, gridSize)
  
      // Render the grid
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const cell = document.createElement("div")
          cell.classList.add("wordsearch-cell")
          cell.dataset.row = row
          cell.dataset.col = col
          cell.textContent = grid[row][col]
          wordsearchGrid.appendChild(cell)
        }
      }
  
      // Render the words
      words.forEach((word, index) => {
        const wordEl = document.createElement("div")
        wordEl.classList.add("wordsearch-word")
        wordEl.textContent = word
        wordEl.style.backgroundColor = colors[index % colors.length]
        wordEl.style.opacity = "0.5"
        wordEl.dataset.word = word
        wordsearchWords.appendChild(wordEl)
      })
  
      // Word selection functionality
      let isSelecting = false
      let selectedCells = []
  
      // Mouse events for word selection
      wordsearchGrid.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("wordsearch-cell")) {
          isSelecting = true
          clearSelection()
          selectCell(e.target)
        }
      })
  
      wordsearchGrid.addEventListener("mouseover", (e) => {
        if (isSelecting && e.target.classList.contains("wordsearch-cell")) {
          if (!selectedCells.includes(e.target)) {
            selectCell(e.target)
          }
        }
      })
  
      document.addEventListener("mouseup", () => {
        if (isSelecting) {
          isSelecting = false
          checkSelectedWord()
        }
      })
  
      function selectCell(cell) {
        selectedCells.push(cell)
        cell.style.backgroundColor = "#e0e0e0"
      }
  
      function clearSelection() {
        selectedCells.forEach((cell) => {
          if (!cell.dataset.found) {
            cell.style.backgroundColor = "transparent"
          }
        })
        selectedCells = []
      }
  
      function checkSelectedWord() {
        // Get the selected letters
        const selectedWord = selectedCells.map((cell) => cell.textContent).join("")
        const reversedWord = selectedWord.split("").reverse().join("")
  
        // Check if it matches any of the words
        for (let i = 0; i < words.length; i++) {
          const word = words[i]
          if (selectedWord === word || reversedWord === word) {
            // Mark the word as found
            const wordEl = wordsearchWords.querySelector(`[data-word="${word}"]`)
            wordEl.classList.add("found")
            wordEl.style.opacity = "1"
            wordEl.style.textDecoration = "line-through"
  
            // Mark the cells
            selectedCells.forEach((cell) => {
              cell.style.backgroundColor = colors[i % colors.length]
              cell.dataset.found = "true"
            })
            return
          }
        }
  
        // If no word was found, clear the selection
        clearSelection()
      }
  
      function generateWordSearchGrid(words, size) {
        // Initialize grid with empty spaces
        const grid = Array(size)
          .fill()
          .map(() => Array(size).fill(""))
  
        // Place words in the grid
        for (const word of words) {
          let placed = false
          let attempts = 0
  
          while (!placed && attempts < 100) {
            attempts++
  
            // Random direction (0: horizontal, 1: vertical, 2: diagonal)
            const direction = Math.floor(Math.random() * 3)
  
            // Random starting position
            const row = Math.floor(Math.random() * size)
            const col = Math.floor(Math.random() * size)
  
            // Check if word fits
            let fits = true
  
            if (direction === 0) {
              // Horizontal
              if (col + word.length > size) fits = false
              else {
                for (let i = 0; i < word.length; i++) {
                  if (grid[row][col + i] !== "" && grid[row][col + i] !== word[i]) {
                    fits = false
                    break
                  }
                }
              }
  
              if (fits) {
                for (let i = 0; i < word.length; i++) {
                  grid[row][col + i] = word[i]
                }
                placed = true
              }
            } else if (direction === 1) {
              // Vertical
              if (row + word.length > size) fits = false
              else {
                for (let i = 0; i < word.length; i++) {
                  if (grid[row + i][col] !== "" && grid[row + i][col] !== word[i]) {
                    fits = false
                    break
                  }
                }
              }
  
              if (fits) {
                for (let i = 0; i < word.length; i++) {
                  grid[row + i][col] = word[i]
                }
                placed = true
              }
            } else {
              // Diagonal
              if (row + word.length > size || col + word.length > size) fits = false
              else {
                for (let i = 0; i < word.length; i++) {
                  if (grid[row + i][col + i] !== "" && grid[row + i][col + i] !== word[i]) {
                    fits = false
                    break
                  }
                }
              }
  
              if (fits) {
                for (let i = 0; i < word.length; i++) {
                  grid[row + i][col + i] = word[i]
                }
                placed = true
              }
            }
          }
        }
  
        // Fill remaining spaces with random letters
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (grid[i][j] === "") {
              grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
            }
          }
        }
  
        return grid
      }
    }
  
    // Create floating particles
    createParticles()
  
    // Add hover effect to the photo
    const polaroid = document.querySelector(".polaroid")
    if (polaroid) {
      polaroid.addEventListener("mouseover", function () {
        this.style.transform = "rotate(0) scale(1.02)"
      })
  
      polaroid.addEventListener("mouseout", function () {
        this.style.transform = "rotate(-3deg)"
      })
    }
  
    // Function to create floating particles
    function createParticles() {
      const particlesContainer = document.querySelector(".particles")
      const particleCount = 20
  
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.classList.add("particle")
  
        // Random position
        const posX = Math.random() * 100
        const posY = Math.random() * 100
  
        // Random size
        const size = Math.random() * 10 + 5
  
        // Random animation duration
        const duration = Math.random() * 20 + 10
  
        // Random delay
        const delay = Math.random() * 5
  
        // Set styles
        particle.style.cssText = `
          position: absolute;
          top: ${posY}%;
          left: ${posX}%;
          width: ${size}px;
          height: ${size}px;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          pointer-events: none;
          animation: float ${duration}s ease-in-out ${delay}s infinite;
          opacity: ${Math.random() * 0.5 + 0.3};
        `
  
        if (particlesContainer) {
          particlesContainer.appendChild(particle)
        }
      }
    }
  })
  
  // Add floating animation
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <style>
      @keyframes float {
        0%, 100% {
          transform: translateY(0) rotate(0);
        }
        50% {
          transform: translateY(-20px) rotate(10deg);
        }
      }
      
      .particle {
        position: absolute;
        pointer-events: none;
      }
    </style>
  `,
  )
  