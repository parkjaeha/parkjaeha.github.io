const socket = io('https://stream1801.herokuapp.com/');
var data = [];
$('#room_enter').hide();
var name="";
let customConfig;
var text = "";
var dt;
var time;
var peer_data;

$.ajax({
  url: "",
  data: {
    ident: "parkjaeha",
    secret: "9e2ac3be-fdc8-11e7-bf3f-9884ff03e586",
    domain: "parkjaeha.github.io",
    application: "default",
    room: "default",
    secure: 1
  },
  success: function (data, status) {
    customConfig = data.d;
    console.log(customConfig);
  },
  async: false
});

// user info get
socket.on('ONLINE', arrUserInfo => {

    console.log("arr: "+arrUserInfo);
    console.log("size: "+arrUserInfo.length);
    console.log("socket: " +socket.peerId);
    console.log("/////////////////////// online //////////////////////");

        var user = "";
      arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#my-peer').append("2"+peerId);
        console.log("result-arr : " + peerId+ " / " + ten);
        //console.log("person : " + person);
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
        console.log("/////////////////////// add //////////////////////");
      });

socket.on('USER', user => {
  const { ten, peerId } = user;
  //console.log("check: " + person);
      $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
});

    socket.on('DISCONNECT',peerId => {
      $(`#${peerId}`).remove();

    });

});

socket.on('EXIST', () => {
  $('#room-list').show();
  $('#room_enter').hide();
  alert('SAME USERNAME EXIST');
});


function openStream(){
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

//openStream()
//.then(stream => playStream('localStream', stream));
const peer = new Peer({
  key: 'peerjs',
  host: 'mypeer1801.herokuapp.com',
  secure: true,
  port: 443,
  config: customConfig
});

/*
peer.on('open', id => {
  $('#my-peer').append(id);

  $('#btnSignUp').click( () => {
      const username = $('#txtUsername').val();
      socket.emit('USER-INFO',   { ten: username, peerId: id });
  });
});
*/

 //caller
$('#btnCall').click(() => {
  const id = $('#remoteId').val();
  //console.log("id: "+id);
  openStream()
  .then(stream => {
      playStream('localStream', stream);
      const call = peer.call(id,stream);
      call.on('stream',remoteStream => playStream('remoteStream', remoteStream));
  });
});

//callee
peer.on('call', call => {
  openStream()
  .then(stream => {
    call.answer(stream);
    playStream('localStream', stream);
    call.on('stream',remoteStream => playStream('remoteStream', remoteStream));
  });
});

/////////////////////////////////////////////////////////
socket.on("server-send-rooms", function(data){
	   $("#dsRoom").html("");
	 data.map(function(r){
	   //$("#dsRoom").append(name+"<h4 class=''>"+r+"</h4>");
	});
});

socket.on("server-send-room-socket", function(data){
  console.log(data);
	//$("#room-connecter").html(data);
});

socket.on("server-chat",function(data){
  var count = data.length;
  console.log("data:1 "+count);

   text =  text + data + "</p>"+"</div>";

  console.log("text--------->: "+text);
  $("#txtwindow").append(text);
	//$("#txtwindow").append(name+":1 <div>"+ data +"</div>");
});

socket.on("server-name",function(data){
  console.log("data:2 "+data+" / "+name);
  text="";
  dt = new Date();
  time = dt.getHours() + ":" + dt.getMinutes();
  console.log(time);
  //right
  if(data == name){
      text = "<div class='container darker'>"+'<span class="time-left">'+time+'</span>'+'<img src="/public/img/chat.png" alt="Avatar" style="width:80%;" class="right">'+"<p class='text_r'>" +name +"</p> <p class='text_or'>";
//$("#txtwindow").append(name+":2 <div>"+ data +"</div>");
  //left
  }else{
    text = "<div class='container'>"+'<span class="time-right">'+time+'</span>'+'<img src="/public/img/chat.png" alt="Avatar" style="width:80%;">'+"<p class='text_l'>" +data +"</p> <p class='text_ol'>";
  }
	//alert(data);
});
//////////////////////////////////
var room ="";

function getName(room,id){
name = prompt("이름을 입력하세요.", "");
//var bool= confirm("이름이 "+name+" 맞습니까?");

  if(id != ""){
    socket.emit('USER-INFO', { ten: name, peerId: id });
    $("#room-connecter").html(room);
    socket.emit("room-num",room);
    $('#room_enter').show();    // 값 입력 후 stream video channel 로 enter
    $('#room-list').hide();     // 입장시 id 입력 창
    //location.href="./test.html?room="+room+"&id="+name;
  }else{
    console.log("retry");
  }
}

peer.on('open', id => {
  //$('#my-peer').append("1"+id);
  peer_data = id;
  $(".l_room").click(function(){
     room = $(this).attr('id');
    console.log("l_data: "+ room);
    //  socket.emit('USER-INFO',   { ten: username, peerId: id });
    getName(room,peer_data);
  });

  $(".r_room").click(function(){
     room = $(this).attr('id');
    console.log("r_data: "+ room);
    //  socket.emit('USER-INFO',   { ten: username, peerId: id });
      getName(room,id);
  });

  $(".button_click").click(function(){
      room = $(this).attr('id');
      console.log("new room :"+room);
      getName(room,id);
  });

});
var textmsg;
var vt = [];
var count = 0;
var number = 0;
var result = "";
var num=0;
$(document).ready(function(){
/*
	$("#btnRoom").click(function(){
		socket.emit("room-num",$('#txtRoom').val());
	});
*/

var out = document.getElementById("txtwindow");
// allow 1px inaccuracy by adding 1
var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;

$("#flip").click(function(){
     $("#panel").slideToggle("slow");
     if(num ==0){
       num=1;
       $("#font").attr("class","glyphicon glyphicon-chevron-up");
     }else{
       num=0;
              $("#font").attr("class","glyphicon glyphicon-chevron-down");
     }
 });

function chat_msg(){
  socket.emit("user-name", name);

  socket.emit("user-chat", $("#txtMessage").val());
  $("#txtMessage").val("");
}

  $('#txtMessage').keyup(function(e) {
    textmsg = $(this).val();
    console.log("length: "+textmsg.length);
      if (e.keyCode == 13) chat_msg();

      if(isScrolledToBottom)
    out.scrollTop = out.scrollHeight - out.clientHeight;
  });

  $("#btnChat").click(function(){
      chat_msg();
      if(isScrolledToBottom)
    out.scrollTop = out.scrollHeight - out.clientHeight;
   });

});
