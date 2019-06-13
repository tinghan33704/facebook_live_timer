function init(){
    
}


function checkLiveTag()         // 第一階段：連結至指定專頁，開始辨認直播的標籤是否存在
{
    var live_tag = $("u:contains('直播')");
    
    if(live_tag)
    {
        if(live_tag.length > 0)
        {
            live_tag.click();
            chrome.runtime.sendMessage({action: 'liveTagFound'});
        }
        else location.reload();
    }
    else location.reload();
}

function checkFirstVideo()      // 第二階段：直播的標籤存在後連結至專頁影片頁面，搜尋第一支影片(理論上都會是直播)
{
    var live_video_1 = $("._2wrk").closest("._5asl").children('a').attr('href');
    var live_video_2 = $("._2t3c").children('span').attr('href');
    
    if(live_video_1)
    {
        if(live_video_1.length > 0)
        {
            location.href = live_video_1;
            chrome.runtime.sendMessage({action: 'liveVideoFound'});
        }
        else location.reload();
    }
    else if(live_video_2)
    {
        if(live_video_2.length > 0)
        {
            location.href = live_video_2;
            chrome.runtime.sendMessage({action: 'liveVideoFound'});
        }
        else location.reload();
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