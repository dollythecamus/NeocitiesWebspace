export function UpdateWigglyText(colors){
  const textElements = document.querySelectorAll(".wiggly-text"); // Select all elements with the class "wiggly-text"
  const titleContainer = document.getElementById("title-container");

  if (titleContainer == null)
    {return;}

  titleContainer.style.borderColor = colors.darks[0]; // Set border color using the first dark color
  titleContainer.style.backgroundColor = colors.darks[1]; // Set background color using the first light color
  
  textElements.forEach(textElement => {
    const existingLetters = textElement.querySelectorAll(".wiggly-letter");

    if (existingLetters.length > 0) {
      // Update existing wiggly letters
      existingLetters.forEach((letter, index) => {
        letter.style.color = colors.lights[index % colors.lights.length]; // Cycle through colors
      });
    } else {
      // Create new wiggly letters
      const text = textElement.textContent;
      textElement.innerHTML = ""; // Clear the original text

      text.split(" ").forEach((word, wordIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block"; // Ensure words stay together
        wordSpan.style.margin = "0 0.5em"; // Add spacing between words

        word.split("").forEach((letter, letterIndex) => {
          const span = document.createElement("span");
          span.textContent = letter;
          span.className = "wiggly-letter";
          span.style.animationDelay = `${(wordIndex * 0.5) + (letterIndex * 0.1)}s`; // Add delay for each letter
          span.style.color = colors.lights[letterIndex % colors.lights.length]; // Cycle through colors
          wordSpan.appendChild(span);
        });

        textElement.appendChild(wordSpan);
      });
    }
  });
}
