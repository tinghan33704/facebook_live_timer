function init(){
    
}


function checkLiveTag()         // 第一階段：連結至指定專頁的直播分頁，開始辨認直播的標籤是否存在
{
    var live_tag = document.getElementsByClassName("j83agx80 rgmg9uty pmk7jnqg rnx8an3s fcg2cn6m");
    if(live_tag)
    {
        if(live_tag.length > 0)
        {
            console.log('[FacebookLiveTimer] Find stream, try to connect...');
            chrome.runtime.sendMessage({action: 'liveTagFound'});
        }
        else location.reload();
    }
    else location.reload();
}

function clickVideo()      // 第二階段：點擊影片
{
    var live_video_element = document.getElementsByClassName("j83agx80 rgmg9uty pmk7jnqg rnx8an3s fcg2cn6m")[0].parentNode.getElementsByClassName("i09qtzwb rq0escxv");
    
    if(live_video_element[0])
    {
        /*
        if(live_video.length > 0)
        {
            location.href = live_video;
            chrome.runtime.sendMessage({action: 'liveVideoFound'});
        }
        else location.reload();
        */
        console.log('[FacebookLiveTimer] Find video, try to connect...');
        
        var live_video = live_video_element[0];
        console.log('[FacebookLiveTimer] Connect to video...');
        live_video.click();
        chrome.runtime.sendMessage({action: 'liveVideoFound'});
    }
    else location.reload();
}

function reloadVideo()      // 第三階段：重整頁面以開啟寶箱點擊器
{
    var live_video_element = document.getElementsByClassName("k4urcfbm datstx6m");
    
    if(live_video_element[0])
    {
        location.reload();
        console.log('[FacebookLiveTimer] Reload to trigger treasure clicker...');
        chrome.runtime.sendMessage({action: 'liveVideoReload'});
    }
}

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

    if(msg.action == 'checkLiveTag')
    {
        checkLiveTag();
    }
    else if(msg.action == 'clickVideo')
    {
        clickVideo();
    }
    else if(msg.action == 'reloadVideo')
    {
        reloadVideo();
    }
});

window.addEventListener('DOMContentLoaded', function () {
    init();
});