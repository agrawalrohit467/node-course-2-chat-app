var socket = io();

function scrollToBottom(){
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    var padding = 30;

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight + padding >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function(){
    var params = $.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No error');
        }
    });
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users){
    var ol = $('<ol></ol>');
    
    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
})

socket.on('adminMessage', function(message){
    var template = $('#admin-message-template').html();
    var html = Mustache.render(template,{
        message
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var css;
    if(message.from === "You") css = 'float:right;background-color:#dcf8c6;';
    else css = 'float:left;background-color:#fff;';
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt:formattedTime,
        displayColor: `color:${message.displayColor}`,
        css
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var css;
    if(message.from === "You") css = 'float:right;background-color:#dcf8c6;';
    else css = 'float:left;background-color:#fff;';
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt:formattedTime,
        displayColor: `color:${message.displayColor}`,
        css
    })
    $('#messages').append(html);
    scrollToBottom();
})

$("#message-form").on('submit', function(e){
    e.preventDefault();

    //var messageTextbox = $('[name=message]');
    //text: messageTextbox.val()
    socket.emit('createMessage', {
        text: $('.emojionearea-editor').html()
    }, function(){
        //messageTextbox.val('');
        $('.emojionearea-editor').html('');
        if($('.emojionearea-picker').css("display") !== "none")
            $('.emojionearea-button-close').click();
    });
});

var locationButton = $('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    });
});
