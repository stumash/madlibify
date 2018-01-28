chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === "madlibify_button_pressed") {
		getAllTextNodes();
    	//console.log("word count: " + wordCount);
	}
});

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
