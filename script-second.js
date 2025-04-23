
const colors = ["#f72585", "#fee440", '#38b000','#a9a2fa', '#3a0ca3', '#4cc9f0', '#f9c74f',  '#88292c'];

document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.getElementById("wiggly-text");
    const text = textElement.textContent;
    textElement.innerHTML = ""; // Clear the original text
  
    text.split("").forEach((letter, index) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.className = "wiggly-letter";
      span.style.animationDelay = `${index * 0.1}s`; // Add delay for each letter
      span.style.color = colors[index % colors.length]; // Cycle through colors
      textElement.appendChild(span);
    });
  });
