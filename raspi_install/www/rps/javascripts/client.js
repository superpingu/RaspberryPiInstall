$(function() {
    var socket = io.connect('http://'+window.location.hostname+':3001');

    socket.on('serial-read', function (data) {
        data = data.replace(/\n/g, "<br>");
        var serialDiv = $("#serial");
        if(serialDiv.scrollTop() > serialDiv.prop("scrollHeight") - serialDiv.height() - 120)
            serialDiv.html($("#serial").html()+data).scrollTop(serialDiv.prop("scrollHeight") - serialDiv.height());
        else
            serialDiv.html($("#serial").html()+data);
    });

    socket.on('serial-baudrate', function (data) {
        $("#baudrate").val(data);
    });

    $("#clear").click(function() {
        $("#serial").html("");
    });

    $("#connect-port").click(function() {
        var baudrate = parseInt($("#baudrate").val());
        if(!isNaN(baudrate)) {
            $("#clear").click();
            socket.emit("serial-connect", {baudrate: baudrate});
        } else {
            alert("Le baudrate doit être un nombre !");
        }
    });

    $(document).keypress(function(e) {
        if(!$("#baudrate").is(":focus")) {
            var char = String.fromCharCode(event.which);
            char = char.replace("\r", "\r\n");
            socket.emit("serial-write", {char: char});
        }
    });
});
