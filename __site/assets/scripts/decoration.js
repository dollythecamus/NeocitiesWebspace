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

let decorateState = -1
// -1 = initial state, 0 = not decorated, 1 = decorated

function initDecorations() {
  const container = document.querySelector(".decorations-container");
    if (container) {
      if (container.classList.contains("default-off")) {
        decorateState = 0;
        container.style.display = "none"; // Hide the decorations container by default

        console.log("Decorations are off by default.");

        return;
      }
      if (container.classList.contains("default-on")) {
        
        decorateState = 1;
        container.style.display = "block"; // Show the decorations container by default

        composeTextElements();
        randomPositionDecorations();
        return;
      }
    }
}

function randomPositionDecorations() {
  const decorations = document.querySelectorAll(".decoration.random-position");

  decorations.forEach(decoration => {
    const randomX = Math.random() * (window.innerWidth - window.innerWidth / 4);
    const randomY = Math.random() * (window.innerHeight - window.innerHeight / 4);

    decoration.style.left = `${randomX}px`;
    decoration.style.top = `${randomY}px`;
  });
}

export function ToggleDecorate() {
  if (decorateState === -1) {
    // Initial state, supposed to be decorated from the start
    decorateState = 1;
  }
  
  if (decorateState === 0) {
    // Not decorated, apply decorations

    const container = document.querySelector(".decorations-container");
    container.style.display = "block"; // Show the decorations container
    composeTextElements();
    randomPositionDecorations();
    decorateState = 1; // Set to decorated state
  }
  else if (decorateState === 1) {
    // Already decorated, remove decorations
    const container = document.querySelector(".decorations-container");
    container.style.display = "none"; // Hide the decorations container
    decorateState = 0; // Set back to not decorated state
  }

}

initDecorations();

document.querySelectorAll(".decoration").forEach(decoration => {

  decoration.addEventListener("click", (event) => {
    if (decoration.classList.contains("erasable")) {
      decoration.style.display = "none";
    }
  });
});
