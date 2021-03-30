var baseUrl='https://gfggit.herokuapp.com';
var runtime;
// function notify(notiId,context,type)
// {
//   var options={
//     type:'basic',
//     message:context,
//      title: "gfggit",
//     iconUrl:'/lib/img/icon48.jpg',
//     eventTime:Date.now()+2000
//   }
//   chrome.notifications.create(notiId, options);
// }
chrome.runtime.sendMessage({todo:"showpageAction"});

$( document ).ready(function(){

  $('#run').on('click',function(){
    setTimeout(function(){
    appendtoOut(1000);
    },5000);
  });
});
function getCode()
{
  var text='';
   var total_code_line=$('.ace_layer > .ace_line').length;
$('.ace_line').each(function(){
    text+=$(this).text();
    text+='\n';
  });
  return text;
}
function getTitile()
{
  var title=$('.problem-tab__name').text();
  return title.trim();
}
function executionTime()
{
  //alert($('.out').find('pre').text());
if(typeof($('.out').find('pre').text())!=='undefined' && ($('.out').find('pre').text())!=='' && $('.out').find('pre').text().includes('Correct Answer.') && $('.out').find('img').attr('src')==='https://media.geeksforgeeks.org/img-practice/right.png')
{
  //alert('ehoiejwq');
 var arr=$('.out').find('pre').text().split(' ');
 var a=arr[arr.length-1].split(':');
return a[1];
}
else
{
return "unknown";
}

}
function questionType()
{
  var type=$('.problem-tab__problem-level').text();
return type;
}
function selectLanguage()
{
  var lan=$('.filter-option').text();
  if(lan)
  {
    if(lan==='C (gcc 5.4)')
    {
return '.c';
    }
    else if(lan==='C++ (g++ 5.4)')
    {
return '.cpp';
    }
    else if(lan==='Java (1.8)')
    {
return '.java';
    }
    else if(lan==='Python3')
    {
return '.py';
    }
  }
  else
  {
    return '.txt';
  }
}
var appendtoOut=function(time)
{
  var time_start;
  time_start=setInterval(function(){
    if(typeof($('.out').find('pre').text())!=='undefined' && ($('.out').find('pre').text())!=='' && $('.out').find('pre').text().includes('Correct Answer.') && $('.out').find('img').attr('src')==='https://media.geeksforgeeks.org/img-practice/right.png')
    {
    if(($('.out').find('pre').hasClass('trigger-upload'))==false)
    {
      runtime=executionTime();
      $('.out').find('pre').append(`<b><h4><i>Program is Sucessfully Executed ready to upload</i><br>-----------------------------------------------<br><i>click The icon to upload</i></h4></b><img src='https://media.geeksforgeeks.org/wp-content/uploads/20210324191545/upload-300x300.png' width='30px' height='30px' class="trigger-upload" style="margin-left:10px;"/>
      <br>`);
      $('.trigger-upload').on('click',function(){
        if(!$('.out').find('pre').hasClass('show-load'))
        {
   $('.out').find('pre').append(`<div style='display:inline' class="show-load"><div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div><i><h4>wait for Upload</h4></i></div>`);
}
      uploadGithub();
      });
        clearInterval(time_start);
    }
  }
},time);
};
function encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

function decode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
function uploadGithub(){
  chrome.storage.sync.get(['token','repo'],async function(gfggit){
    if(gfggit.token && gfggit.repo && gfggit.repo!=='---Select Repo---')
    {
    //  chrome.tabs.query({ active: true,currentWindow: true}, async function(tabs){
        if(window.location.href)
       {
      var arr=gfggit.repo.split('/');
      var file={
        content:encode(getCode()),
        title:getTitile(),
        exeTime:runtime,
        type:questionType(),
        file:selectLanguage(),
        token:gfggit.token,
        owner:arr[0],
        repo:arr[1],
        link:window.location.href
      };
      let response = await fetch(baseUrl+'/repo/createfile', {
          method: 'post',
          body: JSON.stringify(file),
          headers: {
        'Accept': 'application/json',
       "Content-Type": "application/json; charset=utf-8"
      }
    });
if(response)
{
  let res=await response.json();
  if(res.status===200 || res.status==201)
  {
    if($(document).find('.out').find('div').hasClass('show-load'))
    {
    //  alert('present');
    $(document).find('.out').find('div').css('display','none');
        $('.out').find('pre').append(`<i><h4>Uploaded Successfully ✔</h4></i>`);
    }
  }
  else if(res.status===404)
  {
    if($(document).find('.out').find('div').hasClass('show-load'))
    {
      $(document).find('.out').find('div').css('display','none');
      $('.out').find('pre').append(`<i><h4>Failed Upload❌</h4></i>`);
    }
  }
  else
  {
    if($(document).find('.out').find('div').hasClass('show-load'))
    {
      $(document).find('.out').find('div').css('display','none');
        $('.out').find('pre').append(`<i><h4>File is Already Uploaded 💯</h4></i>`);
    }
  }
}
else
{
  if(gfggit.token && gfggit.repo==='---Select Repo---')
  {
    if($(document).find('.out').find('div').hasClass('show-load'))
    {
      $(document).find('.out').find('div').css('display','none');
      $('.out').find('pre').append('<i><h4>Select a Repository✅</h4></i>');
    }
  }
  else
  {
    if($(document).find('.out').find('div').hasClass('show-load'))
    {
       $(document).find('.out').find('div').css('display','none');
      $('.out').find('pre').append(`<i><h4>Some Thing Going Wrong Please Try again ‼‼</h4></i><h4 style="color:red;">X</h4>`);
    }
    //notify('error3','Invalid authentication','basic')
  }
  //404 failed
}
}
//});
    }
  });
}
