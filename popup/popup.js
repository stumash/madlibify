$("#madlibify_button").on("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0]
        chrome.runtime.sendMessage()
    })
})
