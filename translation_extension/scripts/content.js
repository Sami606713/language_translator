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

        // Create the container for the popup (which will also include the minimize functionality)
        const popupContainer = document.createElement("div");
        popupContainer.style.position = "absolute";
        popupContainer.style.left = `${rect.left + window.scrollX}px`;
        popupContainer.style.top = `${rect.top + window.scrollY - 50}px`; // 50px above the selected text
        popupContainer.style.zIndex = "10000";
        popupContainer.style.maxWidth = "350px";
        popupContainer.style.borderRadius = "12px";
        popupContainer.style.transition = "opacity 0.3s ease, transform 0.3s ease";

        // Create the popup itself
        const popup = document.createElement("div");
        popup.style.padding = "15px 20px";
        popup.style.boxShadow = "0px 6px 18px rgba(0, 0, 0, 0.3)";
        popup.style.backgroundColor = "#fff";
        popup.style.color = "#333";
        popup.style.border = "1px solid #ddd";
        popup.style.borderRadius = "12px";
        popup.style.fontSize = "16px";
        popup.style.lineHeight = "1.5";
        popup.style.wordWrap = "break-word";
        popup.innerText = text;

        // Add a close button
        const closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "12px";
        closeButton.style.color = "#555";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "20px";
        closeButton.style.fontWeight = "bold";

        // Add minimize button
        const minimizeButton = document.createElement("span");
        minimizeButton.innerHTML = "_";
        minimizeButton.style.position = "absolute";
        minimizeButton.style.top = "10px";
        minimizeButton.style.right = "40px";
        minimizeButton.style.color = "#555";
        minimizeButton.style.cursor = "pointer";
        minimizeButton.style.fontSize = "20px";

        // Minimize the popup
        let isMinimized = false;
        minimizeButton.addEventListener("click", () => {
            if (isMinimized) {
                popup.style.display = "block";
                minimizeButton.innerHTML = "_";
            } else {
                popup.style.display = "none";
                minimizeButton.innerHTML = "+";
            }
            isMinimized = !isMinimized;
        });

        // Close the popup when the close button is clicked
        closeButton.addEventListener("click", () => {
            popupContainer.style.opacity = "0";
            popupContainer.style.transform = "translateY(-15px)";
            setTimeout(() => document.body.removeChild(popupContainer), 300); // Wait for animation
        });

        // Add drag functionality
        let offsetX, offsetY;
        popupContainer.addEventListener("mousedown", (e) => {
            offsetX = e.clientX - popupContainer.getBoundingClientRect().left;
            offsetY = e.clientY - popupContainer.getBoundingClientRect().top;

            const onMouseMove = (e) => {
                popupContainer.style.left = `${e.clientX - offsetX}px`;
                popupContainer.style.top = `${e.clientY - offsetY}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // Append elements to the popup container
        popupContainer.appendChild(popup);
        popupContainer.appendChild(closeButton);
        popupContainer.appendChild(minimizeButton);

        // Append the popup container to the body
        document.body.appendChild(popupContainer);
    }
}
