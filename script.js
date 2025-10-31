const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const width = 8
const candyColors = ['red','yellow','orange','green','blue','purple']
let squares = []
let score = 0
let draggedCandy
let replacedCandy

// Create board
function createBoard() {
  for(let i=0; i < width*width; i++) {
    const square = document.createElement('div')
    square.setAttribute('draggable', true)
    square.setAttribute('id', i)
    let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
    square.style.backgroundColor = randomColor
    grid.appendChild(square)
    squares.push(square)

    // Drag events
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragend', dragEnd)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('dragenter', dragEnter)
    square.addEventListener('dragleave', dragLeave)
    square.addEventListener('drop', dragDrop)
  }
}
createBoard()

// Drag functions
function dragStart() {
  draggedCandy = this
}
function dragOver(e) {
  e.preventDefault()
}
function dragEnter(e) {
  e.preventDefault()
}
function dragLeave() {}
function dragDrop() {
  replacedCandy = this
}
function dragEnd() {
  let draggedId = parseInt(draggedCandy.id)
  let replacedId = parseInt(replacedCandy.id)

  // Valid moves (adjacent squares)
  let validMoves = [draggedId-1, draggedId+1, draggedId-width, draggedId+width]
  if(validMoves.includes(replacedId)) {
    let tempColor = draggedCandy.style.backgroundColor
    draggedCandy.style.backgroundColor = replacedCandy.style.backgroundColor
    replacedCandy.style.backgroundColor = tempColor

    if(!checkMatches()) {
      // Swap back if no match
      let tempColor = draggedCandy.style.backgroundColor
      draggedCandy.style.backgroundColor = replacedCandy.style.backgroundColor
      replacedCandy.style.backgroundColor = tempColor
    }
  }
}

// Check matches
function checkMatches() {
  let matchFound = false

  // Check rows
  for(let i=0; i<64; i++) {
    let rowOfThree = [i, i+1, i+2]
    if(rowOfThree.every(index => squares[index] && squares[index].style.backgroundColor === squares[i].style.backgroundColor)) {
      if((i%width) < width-2) { // prevent wrap
        rowOfThree.forEach(index => squares[index].style.backgroundColor = '')
        score += 3
        scoreDisplay.textContent = score
        matchFound = true
      }
    }
  }

  // Check columns
  for(let i=0; i<48; i++) {
    let columnOfThree = [i, i+width, i+2*width]
    if(columnOfThree.every(index => squares[index].style.backgroundColor === squares[i].style.backgroundColor)) {
      columnOfThree.forEach(index => squares[index].style.backgroundColor = '')
      score += 3
      scoreDisplay.textContent = score
      matchFound = true
    }
  }
  return matchFound
}

// Drop candies
function moveDown() {
  for(let i=0; i<55; i++) {
    if(squares[i+width].style.backgroundColor === '') {
      squares[i+width].style.backgroundColor = squares[i].style.backgroundColor
      squares[i].style.backgroundColor = ''
    }

    // Top row refill
    if(i < width && squares[i].style.backgroundColor === '') {
      let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      squares[i].style.backgroundColor = randomColor
    }
  }
}

// Game loop
window.setInterval(() => {
  moveDown()
  checkMatches()
}, 100)