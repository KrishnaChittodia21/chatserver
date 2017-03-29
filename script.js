var username = prompt("Who you ? ");

var conn = io();

$(function () {

    conn.emit("signup", username);

    $('#send').click(function () {
        conn.emit("send_msg", {
            user: username,
            msg: $('#msg').val()
        })
    });

    conn.on("chatlog", function (data) {
        console.log(data);
        if (data.length > 0) {
            data.forEach(function (chat) {
                $('#chat').append('<li>' + chat.user + ": " + chat.msg + '</li>')
            })
        }
    });

    conn.on("rcv_msg", function (data) {
        $('#chat').append('<li>' + data + '</li>')
    })
});
