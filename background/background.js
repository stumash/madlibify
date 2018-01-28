let db = null;
let table = null;

chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason == "install") {
        // word2pos: word to part-of-speech
        let db = new Dexie("word2pos.db");
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
        console.log("doing things to update.... merp");
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.word){
            new Dexie('word2pos.db').open().then(function (db) {
                db.tables.forEach(function (table) {
                    if(table.name === "word2pos"){
                        table.get(request.word, function(value){
                            let pos = undefined;
                            if(value){
                                console.log(value);
                                if(value.pos === "a"){
                                    pos = "adjective";
                                }
                                if(value.pos === "v"){
                                    pos = "verb";
                                }
                                if(value.pos === "n"){
                                    pos = "noun";
                                }
                            }
                            sendResponse({pos: pos});
                        });
                    }
                });
            }).catch('NoSuchDatabaseError', function(e) {
                // Database with that name did not exist
                console.error ("Database not found");
                sendResponse({pos: undefined});
            }).catch(function (e) {
                console.error ("Oh uh: " + e);
                sendResponse({pos: undefined});
            });
        } else {
            sendResponse({pos: undefined});
        }
        return true;
    });
