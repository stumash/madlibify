$madlibify_button = null;
document.addEventListener("DOMContentLoaded", () => {
    $madlibify_button = $("#madlibify_button")
    $madlibify_button.on("click", () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            console.log("fuck you");
            chrome.tabs.sendMessage(tabs[0].id, "madlibify_button_pressed")
        });
    })
})
