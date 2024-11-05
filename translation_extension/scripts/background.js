// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed or updated.");

    chrome.contextMenus.create({
        id: "translateText",
        title: "Translate Selected Text",
        contexts: ["selection"] // Show this item only when text is selected
    });

    console.log("Context menu item 'Translate Selected Text' created.");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translateText") {
        console.log("Context menu item clicked. Selected text:", info.selectionText);

        // Delay to ensure the context menu click has processed
        setTimeout(() => {
            // Query the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                console.log("Active tab:", tabs);

                // Call your translation function here
                translateText(info.selectionText)
                    .then(translatedText => {
                        console.log("Translated text:", translatedText);
                        chrome.storage.local.set({ "translatedText": translatedText }); // Save the translated text to storage
                        
                        console.log("Executing ...");

                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ["scripts/content.js"]
                        });
                    })
                    .catch(error => {
                        console.error("Translation error:", error);
                    });
            });
        }, 100); // Delay for 100 milliseconds
    } else {
        console.warn("Unknown menu item clicked:", info.menuItemId);
    }
});

// Function to translate text using an external API
async function translateText(text) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your API key
    const targetLanguage = 'es'; // Change this to the desired target language

    // Example using fetch to call the translation API
    const response = await fetch(`http://127.0.0.1:8000/translate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "text": text,
            "dest_language": "Urdu"
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch translation: ' + response.statusText);
    }

    const data = await response.json();

    return data["translated_text"];
}
