

export function UpdateWigglyText(colors){
  const textElements = document.querySelectorAll(".wiggly-text"); // Select all elements with the class "wiggly-text"
  const titleContainer = document.getElementById("title-container");

  titleContainer.style.borderColor = colors.darks[0]; // Set border color using the first dark color
  titleContainer.style.backgroundColor = colors.darks[1]; // Set background color using the first light color
  
  textElements.forEach(textElement => {
        const text = textElement.textContent;
        textElement.innerHTML = ""; // Clear the original text

        text.split("").forEach((letter, index) => {
            const span = document.createElement("span");
            span.textContent = letter;
            span.className = "wiggly-letter";
            span.style.animationDelay = `${index * 0.1}s`; // Add delay for each letter
            span.style.color = colors.lights[index % colors.lights.length]; // Cycle through colors
            textElement.appendChild(span);
        });
    });
}
