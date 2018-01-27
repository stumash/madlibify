chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request["message"] == "clicked madlibify button") {
            console.log("madlibify: activate!")
        }
    }
);
console.log("eyyyy")
