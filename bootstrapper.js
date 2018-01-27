// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.storage.sync.set({clean_news_feed: true});
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.browserAction.show(tab.id);
});
