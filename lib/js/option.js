window.onload=function(){
  chrome.storage.sync.get(['token'],function(gfggit){
    if(gfggit.token)
    {
      $('.text').val(gfggit.token);
    }
  });
  $('#save-token').on('click',function(){
    if($('.text').val())
    {
          chrome.storage.sync.set({token:$('.text').val()},function(){
            close();
          });
    }
  });
  $('.close-window').on('click',function(){
    chrome.tabs.create({
    active: true,
    url: 'https://github.com/settings/tokens/new?scopes=repo&description=gfggit'
  });
  });
  $('#delete-token').on('click',function(){
    chrome.storage.sync.set({token:''},function(){
      close();
    });
  });
};
