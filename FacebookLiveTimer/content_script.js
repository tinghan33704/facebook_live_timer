function init(){
    
}


function checkLiveTag()         // 第一階段：連結至指定專頁，開始辨認直播的標籤是否存在
{
    var live_tag = $("u:contains('直播')");
    
    if(live_tag)
    {
        if(live_tag.length > 0)
        {
            console.log('[FacebookLiveTimer] Find stream, try to connect...');
            live_tag.click();
            chrome.runtime.sendMessage({action: 'liveTagFound'});
        }
        else location.reload();
    }
    else location.reload();
}

function checkFirstVideo()      // 第二階段：直播的標籤存在後連結至專頁影片頁面，搜尋第一支影片(理論上都會是直播)
{
    var live_video = $("span:contains('所有影片')").parent().parent().find(".hcukyx3x");
    
    if(live_video.length > 0)
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
        chrome.runtime.sendMessage({action: 'liveVideoFound'});
        live_video.find(".kfpcsd3p").find("._28__").click();
    }
    else location.reload();
}

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

    if(msg.action == 'checkLiveTag')
    {
        checkLiveTag();
    }
    else if(msg.action == 'checkFirstVideo')
    {
        checkFirstVideo();
    }
});

window.addEventListener('DOMContentLoaded', function () {
    init();
});