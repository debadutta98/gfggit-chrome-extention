var baseUrl='https://gfggit.herokuapp.com';
var timeout;
function notify(notiId,context,type)
{
  var options={
    type:'basic',
    message:context,
     title: "gfggit",
    iconUrl:'/lib/img/icon48.jpg',
    eventTime:Date.now()+2000
  }
  chrome.notifications.create(notiId, options);
}
var signin=function(time){
  timeout=window.setTimeout(function(){
        var c=0;
     chrome.storage.sync.get(['token'], function(gfggit) {
       if(gfggit.token)
       {
         $('.form-control').val(gfggit.token);
       }
     });
    $('.second-box').css('display','none');
    $('.main-box').css('display','inline');
    $('#panel').css('display', 'none');
  $('#slide').on('click',function(){
    if(c==1)
    {
$(this).attr('src','/lib/img/down.svg');
        $('#panel').slideDown();
        c=0;
    }
    else
    {
        $('#panel').attr('display', 'inline-block');
  $(this).attr('src','/lib/img/up.svg');
    $('#panel').slideUp();
c=1;
    }
  });
},time);
};
 window.onload=function(){
    signin(2500);
   $('#save').on('click',function(){
     if($('.form-control').val()!=='' && $('.form-control').val()!=='undefined' && $('.form-control').val()!==null)
     {
      chrome.storage.sync.set({'token':$('.form-control').val()});
     window.location.reload();
     }
   });
   $('#key').on('click',function(){
     chrome.tabs.create({
     active: true,
     url: 'https://github.com/settings/tokens/new?scopes=repo&description=gfggit'
   });
   });
 };
 chrome.storage.sync.get(['token'],async function(gfggit){
   if(gfggit.token)
   {
  let response = await fetch(baseUrl+'/create/repo', {
      method: 'post',
      body: JSON.stringify({name:'gfggit', token:gfggit.token}),
      headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
if(response)
{
  if(typeof(response)==='object')
  {
    let json = await response.json();
    if(json.status===200 || json.status===201)
    {
      notify('success10','Successfully Create','basic');
    }
    else if(json.status===403)
    {
notify('netWorkerror4','Welcome Back','basic');
      //success
    }
    else
    {
      notify('netWorkerror3','User Authentication Error','basic');
    }
  }
}

let list = await fetch(baseUrl+'/repo/user/list', {
    method: 'post',
    body: JSON.stringify({name:'gfggit', token:gfggit.token}),
    headers: {
  'Accept': 'application/json',
 "Content-Type": "application/json; charset=utf-8"
}
});
if(list)
{
  var jsonobj;
  if(typeof(list)==='object')
  {
    jsonobj=await list.json();
  }
  if(typeof(jsonobj)!=='undefined')
  {
    if(jsonobj.status==200)
    {
      jsonobj.data.forEach(function(value){

    $('select').append(`<option>${value.full_name}</option>`)
    });
        $('#repo-number').text(jsonobj.data.length);
  var activities = document.getElementsByTagName("select");
$('select').on("click", function() {
    var options = $("select > option");
    var count = options.length;
    if(typeof(count) === "undefined" || count < 1)
    {
     $('#default').prop('selected');
    }
    else
    {
      if($('select').val())
      {
            chrome.storage.sync.set({"repo":$('select').val()});
              var atag='https://github.com/'+$('select').val();
            $('.github-link').attr('href',atag);
      }
    }
});

$('select').on("change", function() {
    if($('select').val() == "---Select Repo---")
    {
    $('.github-link').css('cursor','not-allowed');
  notify('selectRepo',"plz Select option",'basic');
    }
    else
    {
      if($('select').val())
      {
                $('.github-link').css('cursor','pointer');

              var atag='https://github.com/'+($('select').val());
          $('.github-link').attr('href',atag);
            chrome.storage.sync.set({"repo":$('select').val()});
      }
    }
});

  chrome.storage.sync.get(['repo'],function(gfggit){
    if(typeof(gfggit.repo)!=='undefined')
    {
        $('.github-link').css('cursor','pointer');
      var atag='https://github.com/'+gfggit.repo;
      $('.github-link').attr('href',atag);
      $('option').each(function(){
        if($(this).text()===gfggit.repo)
        {
          $(this).prop('selected',true);

        }
    });
    }
  });
}
  else
  {
notify('netWorkerror2','Failed to Reach You','basic');
  }
  }
}
//update user
let res = await fetch(baseUrl+'/repo/user', {
    method: 'post',
    body: JSON.stringify({token:gfggit.token}),
    headers: {
  'Accept': 'application/json',
 "Content-Type": "application/json; charset=utf-8"
}
});
if(res)
{
  var jsonuser=await res.json();
  if(jsonuser && jsonuser.status===200)
  {
    $('.upload').css('display', 'flex');
    if(jsonuser.data.avatar_url)
    {
      $('.avatar').attr('src',jsonuser.data.avatar_url);
    }
    if(jsonuser.data.name)
    {
      $('#user-name').text(jsonuser.data.name);
    }
  if(jsonuser.data.followers)
  {
    $('#user-follower').text(jsonuser.data.followers);
  }

  }
  else
  {
//404
notify('netWorkerror','Failed to Reach You','basic');
  }
}
else
{
//404
notify('netWorkerror1','Failed to Reach You','basic')
}

}
 });
