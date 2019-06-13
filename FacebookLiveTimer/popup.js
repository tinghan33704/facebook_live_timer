var edit_lock = false;
var time_arr = [-1, -1, -1, -1, -1];

$(document).ready(function (){
    chrome.runtime.sendMessage({action: "getTimerData"}, function(){});
});


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if(msg.action == 'showTimerData')
    {
        $(".timer").html('');
        var timer = msg.data;
        var timer_str = '';
        timer_str += '<hr>';
        for(let i=0; i<timer.length; i++)
        {
            var time_s = '';
            if(timer[i].time >= 0)
            {
                var time_offset = new Date(timer[i].time);
                time_offset.setTime(time_offset.getTime()-new Date().getTimezoneOffset()*60*1000);
                var time_a = (time_offset.toISOString()).replace('T', ' ').split(":");
                time_s = time_a[0]+':'+time_a[1];
            }
            else time_s = '---';
            time_arr[i] = timer[i].time;
            
            timer_str += '<div class="row">';
            timer_str += '   <div class="col-xs-1 delete" id="delete_'+i+'"><i class="fa fa-times-circle"></i></div>';
            timer_str += '   <div class="col-xs-1 edit" id="edit_'+i+'"><i class="fa fa-edit"></i></div>';
            timer_str += '   <div class="col-xs-5 time" id="time_'+i+'">'+time_s+'</div>';
            timer_str += '   <div class="col-xs-5 url" id="url_'+i+'">'+((timer[i].url !== '')?timer[i].url:'---')+'</div>';
            timer_str += '</div>';
            timer_str += '<hr>';
            
        }
        $(".timer").html(timer_str);
        
        for(let i=0; i<timer.length; i++)
        {
            $("#delete_"+i).on('click', {id: i}, deleteTimer);
            $("#edit_"+i).on('click', {id: i}, editTimer);
        }
    }
    return true;
});

function deleteTimer(event)
{
    if(!edit_lock)
    {
        console.log('delete '+event.data.id);
        chrome.runtime.sendMessage({action: "deleteTimerData", index: event.data.id}, function(){});
    }
}

function editTimer(event)
{
    if(!edit_lock)
    {
        edit_lock = true;
        $("#edit_"+event.data.id).off('click', editTimer).on('click', {id: event.data.id}, saveData);
        $("#edit_"+event.data.id).html('<i class="fa fa-check-circle"></i>');
        
        var now = new Date();
        now.setTime(now.getTime()-now.getTimezoneOffset()*60*1000);
        
        var pre_url = ($("#url_"+event.data.id).html() == '---')?'':$("#url_"+event.data.id).html();
        var time = (time_arr[event.data.id] > -1)?(new Date(time_arr[event.data.id])).toISOString().slice(0, 16):now.toISOString().slice(0, 16);
        $("#time_"+event.data.id).html('<input type="datetime-local" value="'+time+'"></input>');
        $("#url_"+event.data.id).html('<input type="text" value="'+pre_url+'"></input>');
    }
}

function saveData(event)
{
    edit_lock = false;
    var time = $("#time_"+event.data.id+" input").val();
    var time_milli = new Date(time).getTime();
    var time_a = time.replace('T', ' ').split(":");
    time = time_a[0]+':'+time_a[1];
    var url = $("#url_"+event.data.id+" input").val();
    
    $("#edit_"+event.data.id).off('click', saveData).on('click', {id: event.data.id}, editTimer);
    $("#edit_"+event.data.id).html('<i class="fa fa-edit"></i>');
    
    if(time && url !== '')
    {    
        $("#time_"+event.data.id).html(time);
        $("#url_"+event.data.id).html(url);
        
        chrome.runtime.sendMessage({action: "setTimerData", id: event.data.id, time: time_milli, url: url}, function(){});
    }
    else
    {
        $("#time_"+event.data.id).html("---");
        $("#url_"+event.data.id).html("---");
    }
}