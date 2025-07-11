import {getSiteGeneratedColors} from "/assets/scripts/colors.js"

export function composeTextElements(){
  const textElements = document.querySelectorAll(".decorated-text"); // Select all elements with the class "wiggly-text"

  const colors = getSiteGeneratedColors()

  textElements.forEach(textElement => {
    const existingLetters = textElement.querySelectorAll(".decorated-text-letter");
    const classes = textElement.classList;

    if (existingLetters.length > 0) {
      // Update existing wiggly letters
      existingLetters.forEach((letter, index) => {
        if (classes.contains("rainbow"))
          {
            letter.style.color = colors.lights[index % colors.lights.length];
          }
      });
    } else {
      // Create new decorated letters
      const text = textElement.textContent;
      textElement.innerHTML = ""; // Clear the original text

      text.split(" ").forEach((word, wordIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block"; // Ensure words stay together
        wordSpan.style.margin = "0 0.5em"; // Add spacing between words

        word.split("").forEach((letter, letterIndex) => {
          const span = document.createElement("span");

          span.classList.add("decorated-text-letter");

          if (classes.contains("wiggly"))
          {
            span.classList.add("wiggly-letter");
            span.style.animationDelay = `${(wordIndex * 0.5) + (letterIndex * 0.1)}s`; // Add delay for each letter
          }
          if (classes.contains("rainbow"))
          {
            span.style.color = colors.lights[letterIndex % colors.lights.length];
            span.classList.add("rainbow-letter");
          }
            
          span.textContent = letter;
          wordSpan.appendChild(span);
        });

        textElement.appendChild(wordSpan);
      });
    }
  
  });
}

function initDecorations() {
  composeTextElements();
  randomPositionDecorations();

  // Add event listener to the window to recompose text elements on resize
}

function randomPositionDecorations() {
  const decorations = document.querySelectorAll(".decoration.random-position");

  decorations.forEach(decoration => {
    const randomX = Math.random() * (window.innerWidth - decoration.offsetWidth);
    const randomY = Math.random() * (window.innerHeight - decoration.offsetHeight);

    decoration.style.left = `${randomX}px`;
    decoration.style.top = `${randomY}px`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDecorations();
});

let decorateState = -1
// -1 = initial state, 0 = not decorated, 1 = decorated

export function ToggleDecorate() {
  if (decorateState === -1) {
    // Initial state, supposed to be decorated from the start
    decorateState = 1;
  }
  
  if (decorateState === 0) {
    // Not decorated, apply decorations

    document.querySelectorAll(".decoration").forEach(decoration => {
      decoration.style.display = "block"; // Show the decorated text
    });
    composeTextElements();
    randomPositionDecorations();
    decorateState = 1; // Set to decorated state
  }
  else if (decorateState === 1) {
    // Already decorated, remove decorations
    document.querySelectorAll(".decoration").forEach(decoration => {
      decoration.style.display = "none"; // Hide the decorated text
    });
    decorateState = 0; // Set back to not decorated state
  }

}