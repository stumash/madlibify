$madlibify_button = null;

var db = null;

document.addEventListener("DOMContentLoaded", () => {
    $madlibify_button = $("#js-madlibify-btn");
    $madlibify_button.on("click", () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            console.log("fuck you");
            chrome.tabs.sendMessage(tabs[0].id, "madlibify_button_pressed");
        });
    });
    $wordset_button = $("#js-wordset-btn");
    $wordset_button.on("click", () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            console.log("fuck you");
            chrome.tabs.sendMessage(tabs[0].id, "wordset_button_pressed");
        });
    });

});

function getPartOfSpeechByWord(word) {
    db.word2pos.where("word").equals(word).then(function(obj) {
        switch(obj.pos) {
            case "a":
                return "adjective"
            case "v":
                return "verb"
            case "n":
                return "noun"
            case "r":
                return "adverb"
            default:
                return undefined
        }
    }).catch(function(e) {
        return undefined
    })
}