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
        popup.style.background = "#fff";
        popup.style.border = "1px solid #ccc";
        popup.style.padding = "10px";
        popup.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
        popup.style.zIndex = "10000";
        popup.style.maxWidth = "300px";
        popup.style.wordWrap = "break-word";
        
        // Add a close button to the popup
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.marginTop = "10px";
        closeButton.style.padding = "5px";
        closeButton.style.cursor = "pointer";
        closeButton.style.backgroundColor = "#f44336";
        closeButton.style.color = "#fff";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "3px";
        
        // Close the popup when the close button is clicked
        closeButton.addEventListener("click", () => {
            document.body.removeChild(popup);
        });
        
        // Append the close button to the popup
        popup.appendChild(document.createElement("br")); // Line break for spacing
        popup.appendChild(closeButton);
        
        document.body.appendChild(popup);
    }
}
