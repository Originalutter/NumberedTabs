// Since we don't observe the titles of the tabs we need to do this
setInterval(setTitles, 1000);

// ON UPDATED
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	if(changeInfo.status === "complete"){
		setTitleIndex(tab);
	}
});

//ON MOVED
chrome.tabs.onMoved.addListener(function (tabId,moveInfo){
	setTitles();
});

function setTitles(){
	chrome.windows.getAll({populate: true}, function (windows){
		windows.forEach(function(w){
			w.tabs.forEach(function(t){
				setTitleIndex(t);
			});
		});
	});
}

function setTitleIndex(tab){
	if(tab.url.startsWith("chrome://")){
		return;
	}
	var regex = /^(\d+)(\.\s.*)/;
	var res = regex.exec(tab.title);
	if(res === null){
		// tab is not numbered
		var tabNumber = tab.index + 1;
		var newTitle = tabNumber + ". " + tab.title;
		chrome.tabs.executeScript(tab.id, {code: 'document.title = "'+ newTitle + '";'}, null);
	} else {
		// tab is already numbered
		var tabNumber = tab.index + 1;
		var newTitle = tabNumber + res[2];
		chrome.tabs.executeScript(tab.id, {code: 'document.title = "'+ newTitle + '";'}, null);
	}
}