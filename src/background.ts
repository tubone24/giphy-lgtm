function polling() {
  setTimeout(polling, 1000 * 30);
}

polling();

chrome.tabs.onActivated.addListener(function (tabId) {
  chrome.tabs.query({ active: true }, function (tab) {
    const url = tab[0].url || "";
    const regex = new RegExp(/^https:\/\/github.com\/.+\/.+\/pull.+/);
    console.log(url);
    if (regex.test(url)) {
      chrome.browserAction.setIcon({ path: "icon-github.png" });
    } else {
      chrome.browserAction.setIcon({ path: "icon.png" });
    }
  });
});
