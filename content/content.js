chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === "madlibify_button_pressed") {
        console.log("madlibify_button_press_received")
    }
});
