import {getSiteGeneratedColors} from "/scripts/colors.js"

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


