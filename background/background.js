chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install" || details.reason == "update"){
        // word2pos: word to part-of-speech
        let db = new Dexie("word2pos.db")
        db.version(2).stores({
            word2pos: "&word,pos"
        })
        // read the wordnet dictionary file, parse it to JSON, and put JSON into db
        $.get(chrome.extension.getURL("dictionary/wn_dict.json"), function(data) {
            data = JSON.parse(data)
            console.log(data)
            db.open().catch(function(e) {
                console.log(e)
            })
            db.word2pos.bulkPut(data).then(function(e) {
                console.log("BulkPut success!")
            }).catch(Dexie.BulkError, function(e) {
                console.error("BulkPut failed!")
            })
        })
    }
});
