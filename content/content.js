let nextNounIndex = 0;
let nextVerbIndex = 0;
let nextAdjectiveIndex = 0;

let db = null;

$( document ).ready(function() {
    console.log( "ready!" );
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request === "madlibify_button_pressed") {
            console.log("madlibify_button_press_received");
            getAllTextNodes();
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

    db = new Dexie("word2pos.db")
    db.open().catch(function(error) {
        console.error("could not open word2pos.db")
    })
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

// use words.filter(isWord) ?
function isWord(str) {
    str = str.trim();
	if (str.length > 0) {
		return !str.match(/['!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g);
	}
	return false;
}

// mock insertion function
function getWordFromSet(word) {
	switch(Math.floor(Math.random() * 7)) {
	case 0:
		return "cat";
		break;
	case 1:
		return "doing";
		break;
	case 2:
		return "sneaky";
		break;
	default:
		return word;
		break;
	}
}

function getNextWord(type){
	if(type === "noun"){
		return "cat";
	}
    if(type === "verb"){
        return "eat";
    }
    if(type === "adjective"){
        return "funny";
    }
    return undefined;
}

function getPos(word){
	if(word.charAt(0) === "n"){
		return "noun";
	}
    if(word.charAt(0) === "v"){
        return "verb";
    }
    if(word.charAt(0) === "a"){
        return "adjective";
    }
    return undefined;
}

var wordCount = 0;
var words;

  function getAllTextNodes(){

    (function scanSubTree(node) {
      if (node.childNodes.length) {
        for (var i = 0; i < node.childNodes.length; i++) {
          scanSubTree(node.childNodes[i]);
		}
	  } else if (node.nodeType == Node.TEXT_NODE) {
		var nodeText = node.nodeValue;
        newText = "";
		// process the text
		var nodeTextArr = nodeText.split(/\b/);
        //var stepsBetweenArr = nodeText.split(/\w*[\w']*\w{1,}/);
        var j = 0;		
        var from = 0;
        var to = 0;
        //console.log("stepsbetwenarr", stepsBetweenArr); 
       nodeTextArr.forEach(function(current, index) {
            if (isWord(current)) {
                //console.log("current", current);
                wordCount++;
                /*replacement = getWordFromSet(current);
                to += current.length - 1 + ((stepsBetweenArr[j]) ? stepsBetweenArr[j++].length : 0);
                console.log("from", from, "to", to);
			    newText += nodeText.substring(from, to).replace(new RegExp(`${current}`), replacement);
                console.log("newText", newText);
                from += to;*/

                var pos = getPos(current);

                if(pos){
                	newText += getNextWord(pos);
				} else {
                	newText += current;
				}

                // find replacement word
                // replacement = getWordFromSet(current);

                // add replacement word to newText
                // newText += replacement;

                //newText += stepsBetweenArr[index+1];

            } else {
                // add punctuation/spacing to newText
                newText += current;
            }
		});
		node.nodeValue = newText;
	  }
    })(document.body);
  }

  function quote(str){
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
