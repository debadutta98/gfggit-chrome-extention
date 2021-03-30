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
  } else if (details.reason === "update") {
    // When extension is updated
  } else if (details.reason === "chrome_update") {
    // When browser is updated
  } else if (details.reason === "shared_module_update") {
    // When a shared module is updated
  }
});
