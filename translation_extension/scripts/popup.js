// languageSelector.js
document.addEventListener("DOMContentLoaded", function() {
    const languageSelect = document.getElementById("languageSelect");
    const saveLanguageBtn = document.getElementById("saveLanguageBtn");
    
    // Load the saved language when the page loads
    chrome.storage.sync.get("selectedLanguage", function(data) {
        if (data.selectedLanguage) {
            languageSelect.value = data.selectedLanguage;
        }
    });

    // Save the selected language to Chrome storage
    saveLanguageBtn.addEventListener("click", function() {
        console.log("Save language button clicked");
        const selectedLanguage = languageSelect.value;
        chrome.storage.sync.set({ selectedLanguage: selectedLanguage }, function() {
            console.log("Language saved:", selectedLanguage);
        });
    });
});