const socket = io('https://stream1801.herokuapp.com/');
var data = [];
//$('#div-chat').hide();

let customConfig;

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

    //$('#div-chat').show();    // 값 입력 후 stream video channel 로 enter
    //$('#div-enter').hide(); // 입장시 id 입력 창
    console.log("arr: "+arrUserInfo);
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        console.log("result-arr : " + peerId+ " / " + ten);
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('USER', user => {
        //console.log(user);
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('DISCONNECT',peerId => {
      $(`#${peerId}`).remove();
    });
});

socket.on('EXIST', () => alert('SAME USERNAME EXIST'));

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
	   $("#dsRoom").append("<h4 class='room'>"+r+"</h4>");
	});
});

socket.on("server-send-room-socket", function(data){
	$("#room-connecter").html(data);
});

socket.on("server-chat",function(data){
  console.log("data: "+data);
	$("#txtwindow").append("<div>"+ data +"</div>");
	//alert(data);
});
var name="";
function getName(room,id){
name = prompt("이름을 입력하세요.", "");
var bool= confirm("이름이 "+name+" 맞습니까?");



  if(bool && id.trim() != ""){
    socket.emit('TEST', { ten: name, peerId: id });
    socket.emit('USER-INFO', { ten: name, peerId: id });
    location.href="./test.html?room="+room+"&id="+name;
  }else{
    console.log("retry");
  }
}

peer.on('open', id => {
  //$('#my-peer').append(id);
  $(".l_room").click(function(){
    var room = $(this).attr('id');
    console.log("l_data: "+ room);
    //  socket.emit('USER-INFO',   { ten: username, peerId: id });
    getName(room,id);
  });

  $(".r_room").click(function(){
    var room = $(this).attr('id');
    console.log("r_data: "+ room);
    //  socket.emit('USER-INFO',   { ten: username, peerId: id });
      getName(room);
  });
});

$(document).ready(function(){

	$("#btnRoom").click(function(){
		socket.emit("room-num",$('#txtRoom').val());
	});

	$("#btnChat").click(function(){
		socket.emit("user-chat",$("#txtMessage").val());
	});


});
