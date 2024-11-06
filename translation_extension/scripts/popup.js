// this is my popup.js file
// make language seection option that i can display the user after selecting the text.
// popup.js

document.addEventListener('DOMContentLoaded', () => {
    // Create the language selector div
    const languageSelectorDiv = document.createElement('div');
    languageSelectorDiv.id = 'languageSelector';
    languageSelectorDiv.style.display = 'none'; // Initially hide it

    // Create a label for the selector
    const label = document.createElement('label');
    label.textContent = 'Select Language: ';
    languageSelectorDiv.appendChild(label);

    // Create the language selection dropdown
    const languageSelect = document.createElement('select');
    languageSelect.id = 'languageSelect';
    
    // Add language options
    const languages = [
        { value: 'en', text: 'English' },
        { value: 'es', text: 'Spanish' },
        { value: 'fr', text: 'French' },
        { value: 'de', text: 'German' }
        // Add more languages as needed
    ];
    
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.value;
        option.textContent = lang.text;
        languageSelect.appendChild(option);
    });

    languageSelectorDiv.appendChild(languageSelect);

    // Create a save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Language';
    languageSelectorDiv.appendChild(saveButton);

    // Append the language selector div to the body of the popup
    document.body.appendChild(languageSelectorDiv);

    // Load the saved language from chrome.storage
    chrome.storage.sync.get('selectedLanguage', (data) => {
        if (data.selectedLanguage) {
            languageSelect.value = data.selectedLanguage;
        }
    });

    // Show the language selector when a message is received
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'showLanguageSelector') {
            languageSelectorDiv.style.display = 'block'; // Show the language selector
        }
    });

    // Save the selected language to chrome.storage when the button is clicked
    saveButton.addEventListener('click', () => {
        const selectedLanguage = languageSelect.value;
        chrome.storage.sync.set({ selectedLanguage }, () => {
            console.log('Language saved:', selectedLanguage);
        });
    });
});
