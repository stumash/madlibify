chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === "madlibify_button_pressed") {
        console.log("madlibify_button_press_received");
		replaceTextOnPage();
    	console.log("word count: " + wordCount);
		console.log("words.length:", words.length);
	}
});

// use words.filter(isWord) ?
function isWord(str) {
	if (str.length > 0) {
		return !str.includes((" ")) && str !== "" && str !== "." && str != ",";
	}
	return false;
}

// mock insertion function
function getWordFromSet(word) {
	switch(Math.floor(Math.random() * 4)) {
	case 0:
		return "cat";
		break;
	case 1:
		return "doing";
		break;
	case 2:
		return "sneaky";
		break;
	case 3:
		return word;
		break;
	}
}

const LONGEST_WORD_LENGTH = 34;
var wordCount = 0;
var words;
// create array of all words
function replaceTextOnPage() {
	wordCount = 0;
	words = [];
    getAllTextNodes().forEach(function(node) {
    	//node.nodeValue = node.nodeValue.replace(new RegExp(quote(from), 'gi'), to);

		var theWords = node.nodeValue.split(/\s+/);
		var buffer = node.nodeValue;
		var startingPoint = 0;
		var newWord = "";
        var anomalyCtr = 0;

		theWords.forEach(function(current) {
			if (current && isWord(current)) {
				//console.log(current);
                anomalyCtr = 0;
				words.push(current);
				newWord = getWordFromSet(current); // based off current, can still end up being current
				node.nodeValue = node.nodeValue.replace(current.substring(startingPoint), newWord);
				wordCount++;
			} else {
                anomalyCtr += newWord.length;
				console.log("anomaly detected!:", current);
			}
			startingPoint += newWord.length + anomalyCtr + 1;
		});
    });
}

  function getAllTextNodes(){
    var result = [];

    (function scanSubTree(node) {
      if (node.childNodes.length)
        for (var i = 0; i < node.childNodes.length; i++)
          scanSubTree(node.childNodes[i]);
      else if(node.nodeType == Node.TEXT_NODE)
        result.push(node);
    })(document.body);

    return result;
  }

  function quote(str){
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
}

// modify the words array accordingly
/*function modifyWords() {
	for (var i = 0; i < modifyWords.length; i++) {
		words[i] = insertWord(words[i]);
	}
}*/

// now update (madlibify) the text of body element
/*function madlibify() {
	var j = 0;
	var bodyText = $("body").text();
	$bodyRef = $("body");

}*/
