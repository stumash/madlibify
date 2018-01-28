let db = null;

chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason == "install") {
        // word2pos: word to part-of-speech
        db = new Dexie("word2pos.db");
        db.version(2).stores({
            word2pos: "word,pos"
        })
        // read the wordnet dictionary file, parse it to JSON, and put JSON into db
        $.get(chrome.extension.getURL("dictionary/wn_dict.json"), function(data) {
            console.log("breakpoint");
            // data = JSON.parse(data)
            console.log(data)
            db.open().catch(function(e) {
                console.log(e)
            })
            db.word2pos.bulkPut(data).then(function(e) {
                console.log("BulkPut success!")
                $madlibify_button.on("click", () => {
                    chrome.tabs.query({}, (tabs) => {
                        console.log("fuck you");
                        tabs.forEach((tab) => {
                            chrome.tabs.sendMessage(tab.id, "bulk_put_success");
                        });
                    });
                });
            }).catch(Dexie.BulkError, function(e) {
                console.error("BulkPut failed!")
            })
        })
    } else if (details.reason == "update") {
        console.log("doing things to update.... merp")
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.operation == "getDB")
            sendResponse({db: db});
    });
