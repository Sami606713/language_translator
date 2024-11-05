console.log("Content script loaded.");

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
        popup.style.top = `${rect.top + window.scrollY - 30}px`; // 30px above the selected text
        popup.style.padding = "10px";
        popup.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
        popup.style.zIndex = "10000";
        popup.style.maxWidth = "300px";
        popup.style.wordWrap = "break-word";
        popup.style.borderRadius = "8px";
        popup.style.fontSize = "14px";
        
        // Determine theme based on system's color scheme preference
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
            popup.style.background = "#333";
            popup.style.color = "#fff";
            popup.style.border = "1px solid #555";
        } else {
            popup.style.background = "#fff";
            popup.style.color = "#000";
            popup.style.border = "1px solid #ccc";
        }

        // Add a close button to the top right corner of the popup
        const closeButton = document.createElement("button");
        closeButton.innerText = "X";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.style.background = "red";
        closeButton.style.border = "none";
        closeButton.style.color = isDarkMode ? "#fff" : "#333";
        closeButton.style.fontSize = "16px";
        closeButton.style.cursor = "pointer";

        // Close the popup when the close button is clicked
        closeButton.addEventListener("click", () => {
            document.body.removeChild(popup);
        });

        // Append the close button and the popup to the document
        popup.appendChild(closeButton);
        document.body.appendChild(popup);

        // Adjust popup position if it overflows the viewport
        const popupRect = popup.getBoundingClientRect();
        if (popupRect.right > window.innerWidth) {
            popup.style.left = `${window.innerWidth - popupRect.width - 20}px`;
        }
        if (popupRect.top < 0) {
            popup.style.top = `${rect.bottom + window.scrollY + 5}px`; // position below the selection if overflow
        }
    }
}
