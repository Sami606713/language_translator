// Listen for the message to retrieve and display the translated text
chrome.storage.local.get("translatedText", (result) => {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving translated text:", chrome.runtime.lastError.message);
        return;
    }

    const translatedText = result.translatedText;
    if (translatedText) {
        console.log("Retrieved translated text:", translatedText);
        displayTranslationAboveSelection(translatedText);

        // Clear the translated text from storage after displaying it
        chrome.storage.local.remove("translatedText");
    }
});

// Function to display the translation above the selected text
function displayTranslationAboveSelection(text) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Create a popup to show the translated text
        const popup = document.createElement("div");
        popup.innerText = text;
        popup.style.position = "absolute";
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.style.top = `${rect.top + window.scrollY - 50}px`; // 50px above the selected text
        popup.style.padding = "15px 20px";
        popup.style.boxShadow = "0px 6px 18px rgba(0, 0, 0, 0.3)";
        popup.style.zIndex = "10000";
        popup.style.maxWidth = "350px";
        popup.style.wordWrap = "break-word";
        popup.style.borderRadius = "12px";
        popup.style.fontSize = "16px";
        popup.style.lineHeight = "1.5";
        popup.style.transition = "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease";
        popup.style.opacity = "0";
        popup.style.transform = "translateY(-15px)";
        
        // Theme styling based on system's color scheme preference
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
            popup.style.backgroundColor = "#222";
            popup.style.color = "#fff";
            popup.style.border = "1px solid #444";
        } else {
            popup.style.backgroundColor = "#fff";
            popup.style.color = "#333";
            popup.style.border = "1px solid #ddd";
        }

        // Add a close button with a stylish hover effect
        const closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "12px";
        closeButton.style.color = isDarkMode ? "#ccc" : "#555";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "20px";
        closeButton.style.fontWeight = "bold";
        closeButton.style.transition = "color 0.3s ease";

        // Change close button color on hover
        closeButton.addEventListener("mouseover", () => {
            closeButton.style.color = isDarkMode ? "#fff" : "#000";
        });
        closeButton.addEventListener("mouseout", () => {
            closeButton.style.color = isDarkMode ? "#ccc" : "#555";
        });

        // Close the popup when the close button is clicked
        closeButton.addEventListener("click", () => {
            popup.style.opacity = "0";
            popup.style.transform = "translateY(-15px)";
            setTimeout(() => document.body.removeChild(popup), 300); // Wait for animation to complete
        });

        // Append the close button and the popup to the document
        popup.appendChild(closeButton);
        document.body.appendChild(popup);

        // Trigger the transition effect
        setTimeout(() => {
            popup.style.opacity = "1";
            popup.style.transform = "translateY(0)";
        }, 10);

        // Adjust popup position if it overflows the viewport
        const popupRect = popup.getBoundingClientRect();
        if (popupRect.right > window.innerWidth) {
            popup.style.left = `${window.innerWidth - popupRect.width - 20}px`;
        }
        if (popupRect.top < 0) {
            popup.style.top = `${rect.bottom + window.scrollY + 10}px`; // position below the selection if overflow
        }
    }
}
