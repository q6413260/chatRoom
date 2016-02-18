/**
 * Created by yeming on 11/2/2016.
 */
var userId = "";
var userName = "";
var socket = null;
$(function(){

    $('#login').on('click', function(){
        var userName = $('#userName').val();
        if(userName){
            $('#userName').val('');
            $('#loginbox').hide();
            $('#chatbox').show();
            init(userName);
        }
    });

    $('#msgSend').on('click', function(){
        var content = $('#content').val();
        if(content){
            var message = {};
            message['userId'] = userId;
            message['userName'] = userName;
            message['content'] = content;
            socket.emit('message', message);
            $('#content').val('');
        }
    });

    $('#logout').on('click', function(){
        location.reload();
    });

    function init(userName){
        this.userId = getUid();
        this.userName = userName;
        $('#showUserName').html(userName);
        scrollToBottom();
        socket = io.connect('ws://172.19.22.94:3000');
        socket.emit('login', {userId: this.userId, userName: this.userName});
        socket.on('login', function(obj){
            updateSysMsg(obj, 'login');
        });
        this.socket.on('logout', function(obj){
            updateSysMsg(obj, 'logout');
        });
        this.socket.on('message', function(message){
            var isMe = (message.userId == this.userId) ? true:false;
            var contentDiv = '<div>' + message.content + '</div>';
            var userNameDiv = '<span>' + message.userName + '</span>';
            var msgSection = document.createElement('msgSection');
            if(isMe){
                msgSection.className = 'user';
                $(msgSection).html(contentDiv + userNameDiv);
            }else{
                msgSection.className = 'service';
                $(msgSection).html(userNameDiv + contentDiv);
            }
            $('#message').append(msgSection);
        });
    };

    function updateSysMsg(obj, action){
        var onlineUsers = obj.onlineUsers;
        var onlineCount = obj.onlineCount;
        var user = obj.user;
        var userHtml = "";
        var separator = "";
        for(key in onlineUsers){
            if(onlineUsers.hasOwnProperty(key)){
                userHtml += separator + onlineUsers[key];
                separator = ",";
            }
        }
        $('#onlineCount').html('当前共有'+onlineCount+'人在线,在线列表:'+userHtml);
        var html = "";
        html += "<div class='msg-system'>";
        html += user.userName;
        if(action=="login"){
            html += "加入了聊天室";
        }else if(action == "logout"){
            html += "退出了聊天室";
        }
        html += "</div>";
        var msgSection = document.createElement('msgSection');
        msgSection.className = 'system J-mjrlinkWrap J-cutMsg';
        $(msgSection).html(html);
        $('#message').append(msgSection);
        scrollToBottom();
    };

    function getUid(){
        return new Date().getTime()+""+Math.floor(Math.random()*899+100);
    };

    function scrollToBottom(){
        window.scrollTo(0, $('#message').clientHeight);
    };
})