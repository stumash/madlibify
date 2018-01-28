chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === "madlibify_button_pressed") {
        console.log("madlibify_button_press_received");
		getAllTextNodes();
    	console.log("word count: " + wordCount);
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

var wordCount = 0;
var words;

  function getAllTextNodes(){

    (function scanSubTree(node) {
      if (node.childNodes.length) {
        for (var i = 0; i < node.childNodes.length; i++) {
          scanSubTree(node.childNodes[i]);
		}
	  } else if(node.nodeType == Node.TEXT_NODE) {
		var nodeText = node.nodeValue;
		// process the text
		var nodeTextArr = nodeText.split(/[.,?!]?\s+/);
		nodeTextArr.forEach(function(current) {
            if (isWord(current)) {
                console.log("processing", nodeText);
                console.log("current", current);
                wordCount++;
                replacement = getWordFromSet(current);
			    nodeText = nodeText.replace(new RegExp(`${current}`), replacement);
                console.log("replaced by", replacement);
            }
		});
		node.nodeValue = nodeText;
	  }
    })(document.body);
  }

  function quote(str){
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
