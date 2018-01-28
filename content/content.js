var nextNounIndex = 0;
var nextVerbIndex = 0;
var nextAdjectiveIndex = 0;

$( document ).ready(function() {
    console.log( "ready!" );
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request === "madlibify_button_pressed") {
            console.log("madlibify_button_press_received")
        }
        if (request === "wordset_button_pressed") {
            console.log("wordset_button_press_received")
            $wordset_dialog = $("#madlibify-wordset-dialog-container");

            if($wordset_dialog.hasClass("showing")){
                return;
            }

            $wordset_dialog.addClass("showing");

            loadWordList();

            var $save_button = $("#madlibify-save-wordlist");
            $save_button.off("click");
            $save_button.on("click", handleSaveButtonClick);

            var $exit_button = $("#madlibify-exit-dialog");
            $exit_button.off("click");
            $exit_button.on("click", function() {
                $wordset_dialog.removeClass("showing");
            });
        }
    });

    $.get(chrome.extension.getURL('/content/wordsetDialog.html'), function(data) {
        $($.parseHTML(data)).appendTo('body');
    });
});

function loadWordList() {

    var wordList = {
        nouns: [],
        verbs: [],
        adjectives: []
    };

    $("#madlibify-wordset-dialog input").each(function(){
        $(this).val("");
    });

    // Save it using the Chrome extension storage API.
    chrome.storage.sync.get("wordList", function(items) {
        if(items.wordList){
            var $nounInputs = $("#madlibify-noun-list input");
            items.wordList.nouns.forEach(function(noun, index) {
                $nounInputs.get(index).value = noun;
            });
            var $verbInputs = $("#madlibify-verb-list input");
            items.wordList.verbs.forEach(function(verb, index) {
                $verbInputs.get(index).value = verb;
            });
            var $adjectiveInputs = $("#madlibify-adjective-list input");
            items.wordList.adjectives.forEach(function(adjective, index) {
                $adjectiveInputs.get(index).value = adjective;
            });
        }
    });


}

function handleSaveButtonClick() {

    var wordListObject = {
        nouns: [],
        verbs: [],
        adjectives: []
    };

    var $nounInputs = $("#madlibify-noun-list input");
    $nounInputs.each(function(index) {
        var inputValue = $( this ).val();
        if(inputValue){
            wordListObject.nouns.push(inputValue);
        }
    });

    var $verbInputs = $("#madlibify-verb-list input");
    $verbInputs.each(function(index) {
        var inputValue = $( this ).val();
        if(inputValue){
            wordListObject.verbs.push(inputValue);
        }
    });

    var $adjectiveInputs = $("#madlibify-adjective-list input");
    $adjectiveInputs.each(function(index) {
        var inputValue = $( this ).val();
        if(inputValue){
            wordListObject.adjectives.push(inputValue);
        }
    });

    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'wordList': wordListObject}, function() {
        console.log("saved to sync storage");
        // var i = 0;
        // for(i = 0; i < 6; i++){
        //     getNextReplacementWord("noun", function(word) {
        //         console.log(word);
        //     })
        // }
        // for(i = 0; i < 6; i++){
        //     getNextReplacementWord("verb", function(word) {
        //         console.log(word);
        //     })
        // }
        // for(i = 0; i < 6; i++){
        //     getNextReplacementWord("adjective", function(word) {
        //         console.log(word);
        //     })
        // }
    });
}

function getNextReplacementWord(type, callback) {
    var result = undefined;
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.get("wordList", function(items) {
        if(items.wordList){
            if(type === "noun"){
                var nouns = items.wordList.nouns;
                result = nouns[nextNounIndex%nouns.length];
                nextNounIndex++;
            }
            if(type === "verb"){
                var verbs = items.wordList.verbs;
                result = verbs[nextVerbIndex%verbs.length];
                nextVerbIndex++;

            }
            if(type === "adjective"){
                var adjectives = items.wordList.adjectives;
                result = adjectives[nextAdjectiveIndex%adjectives.length];
                nextAdjectiveIndex++;
            }
        }
        callback(result);
    });
}