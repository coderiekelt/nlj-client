function nano(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}

$(document).ready(function() {
    var template = '<video id="ply" nlj-instance="{instance}" autoplay><source src="{source}" id="src" type="video/mp4"></video>';
    var srcTmp = '<source src="{source}" id="src" type="video/mp4">';

    $('nlj-player').html(nano(template, {
        source: $('nlj-player').attr('stream'),
        instance: $('nlj-player').attr('instance')})
    );

    $('#ply').css('width', '100%').css('height', '100%');

    var stream = $('nlj-player').attr('stream');
    var controller = $('nlj-player').attr('ws');

    var socket = new WebSocket(controller);

    socket.onmessage = function(msg){
        console.log(msg.data);

        if (msg.data === 'reset') {
            document.getElementById('ply').load();
            document.getElementById('ply').play();

            $('#ply').css('width', '100%').css('height', '100%');
            return;
        }

        var data = msg.data.split('');
        if (data[0] === 'w') {
            var str = msg.data.substr(1);
            $('nlj-watchers').text(str);
        }

        if (data[0] === 'p') {
            document.getElementById('ply').currentTime = parseInt(msg.data.substr(1));
            console.log('skipped to ' + parseInt(msg.data.substr(1)));
        }
    };
});
