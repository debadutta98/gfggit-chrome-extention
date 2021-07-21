chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  if(request.todo==="showpageAction")
  {
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.pageAction.show(tabs[0].id);
    });
  }
});
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: "https://gfggit.herokuapp.com/"
    });
     chrome.tabs.query({},function (tabArray) {
    for(let i=0;i<tabArray.length;i++)
    {
      if(tabArray[i].favIconUrl==="https://media.geeksforgeeks.org/img-practice/favicon-1600291663.png")
      {
         chrome.tabs.update(tabArray[i].id, {selected: true});
        chrome.tabs.reload(tabArray[i].id);
alert("wait for page to reload don't switch the tab if any problem then please refresh your window agin then every thing will be all right");

      }
    }
    });
  } else if (details.reason === "update") {
    // When extension is updated
  } else if (details.reason === "chrome_update") {
    // When browser is updated
  } else if (details.reason === "shared_module_update") {
    // When a shared module is updated
  }
});
