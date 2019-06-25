var interval_id;
var timer = [];
var open_tab = [];
var video_tab = [];
var live_tab = [];

interval_id = setInterval(function(){
    checkTimerExpired();
    //console.log('check');
},10000);

$(document).ready(function(){
    if(timer.length == 0)
    {
        chrome.storage.sync.get(['timer'], function(items) {
            timer = items.timer;
        });
    }
});

function checkTimerExpired()
{
    for(let i=0; i<5; i++)
    {
        if(timer[i].time >= 0 && Date.now() > timer[i].time)
        {
            //console.log(timer[i].id+ ' expired');
            openTab(i);
            deleteTimer(i);
        }
    }
    
    open_tab.forEach(function(element){
        chrome.tabs.sendMessage(element, {action: 'checkLiveTag'});
    });
    
    video_tab.forEach(function(element){
        chrome.tabs.sendMessage(element, {action: 'checkFirstVideo'});
    });
}

function deleteTimer(id)
{
    timer[id].url = '';
    timer[id].time = -1;
    
    chrome.storage.sync.set({timer: timer}, function() {});
    
    console.log('[FacebookLiveTimer] Delete timer '+(id+1));
}

function setTimer(id, url, time)
{
    timer[id].url = url;
    timer[id].time = time;
    
    chrome.storage.sync.set({timer: timer}, function() {});
    
    console.log('[FacebookLiveTimer] Set timer '+(id+1)+' to '+new Date(time).toString()+' with url '+url);
}

function openTab(id)
{
    chrome.tabs.create({url: timer[id].url}, function(newTab){
        open_tab.push(newTab.id);
    });
    console.log('[FacebookLiveTimer] Open new tab with url '+timer[id].url);
}


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if(msg.action == 'getTimerData')
    {
        chrome.runtime.sendMessage({action: "showTimerData", data: timer});
    }
    else if(msg.action == 'setTimerData')
    {
        setTimer(msg.id, msg.url, msg.time);
    }
    else if(msg.action == 'deleteTimerData')
    {
        deleteTimer(msg.index);
        chrome.runtime.sendMessage({action: "showTimerData", data: timer});
    }
    else if(msg.action == 'liveTagFound')
    {
        var tab_id = sender.tab.id;
        var index = open_tab.indexOf(tab_id);
        if(index !== -1) open_tab.splice(index, 1);
        
        video_tab.push(tab_id);
    }
    else if(msg.action == 'liveVideoFound')
    {
        var tab_id = sender.tab.id;
        var index = video_tab.indexOf(tab_id);
        if(index !== -1) video_tab.splice(index, 1);
        
        live_tab.push(tab_id);
    }
    return true;
});


chrome.runtime.onInstalled.addListener(function() {
    var timer_array = [
        {'id': 0, 'url': '', 'time': -1},
        {'id': 1, 'url': '', 'time': -1},
        {'id': 2, 'url': '', 'time': -1},
        {'id': 3, 'url': '', 'time': -1},
        {'id': 4, 'url': '', 'time': -1},
    ];
    chrome.storage.sync.set({timer: timer_array}, function() {
        timer = timer_array;
    });
    
});

chrome.tabs.onRemoved.addListener(function(tab_id, removed) {
    var index = open_tab.indexOf(tab_id);
    if(index !== -1) open_tab.splice(index, 1);
    
    index = video_tab.indexOf(tab_id);
    if(index !== -1) video_tab.splice(index, 1);
    
    index = video_tab.indexOf(tab_id);
    if(index !== -1) video_tab.splice(index, 1);
})

/*
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if(details.url == tabs[0].url && details.url != currentUrl)
            {
                currentUrl = details.url;
                chrome.tabs.sendMessage(tabs[0].id, {action: "newPage"}, function(response) {});  
            }
        });
    }
});
*/