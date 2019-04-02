const echo = (command) => {
    console.log("Command : ", command);
    if (command === "hideNSFW") {
        hideNSFW()
    } else if (command === "restoreNSFW") {
        restoreNSFW()
    }
}

const hideNSFW = () => {

    nsfw = []
    sfw = []
    orgylist = []

    // update nsfw list
    nsfw = [
        /reddit/,
        /youtube/,
        /pornhub/
    ]
    // update sfw list
    sfw = [
        "https://stackoverflow.com/questions/11922964/how-do-i-view-the-storage-of-a-chrome-extension-ive-installed",
        "https://ss64.com/vb/sendkeys.html",
        "https://learncodefrom.us/"
    ]

    chrome.tabs.query({}, function (tabs) {
        for (tab of tabs) {
            // console.log(tab.url)
            for (test of nsfw) {
                if ((tab.url).match(test)) {
                    // store the corresponding urls in orgylist
                    orgylist.push({
                        url : tab.url,
                        pinned : tab.pinned,
                        index : tab.index,
                        active : tab.active
                    });
                    // close the corresponding tabs
                    console.log(tab.url, " is removed")
                    chrome.tabs.remove(tab.id);
                    break;
                }
            }
        }
        // console.log(orgylist)
        chrome.storage.sync.set({
            "orgylist": orgylist
        })
    })

    // select r (random) websites from sfw list and store in poser
    // open every url in poser list in new tab
    do {
        random = Math.random()
        safe = Math.floor( Math.random() * sfw.length)
        tabConfig = {
            url: sfw[safe],
            pinned: Boolean(Math.random() < 0.5)
        }
        // create a new tab with safeURL
        chrome.tabs.create(tabConfig, tab => {
            console.log("created : ", tab.url, " tab id : ", tab.id);
            poser.push(tab.id);
        })
        sfw.splice(safe, 1)
        if (Math.random() < 0.4) {
            break;
        }
    } while (sfw.length !== 0);
}

const restoreNSFW = () => {
    // close every tab in poser list
    for (tab of poser){
        chrome.tabs.remove(tab)
    }
    // open every url in orgylist in new tab
    chrome.storage.sync.get(["orgylist"], snap => {
        for (tab of snap.orgylist){
            chrome.tabs.create(tab)
        }
        chrome.storage.sync.set({"orgylist" : []})
    })
    console.log("restored")
}


poser = []

chrome.commands.onCommand.addListener(echo);