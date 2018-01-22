const socket = io('https://stream1801.herokuapp.com/');
const count = 0;
$('#div-chat').hide();

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
socket.on('DANH_SACH_ONLINE', arrUserInfo => {

    $('#div-chat').show();    // 값 입력 후 stream video channel 로 enter
    $('#div-dang-ky').hide(); // 입장시 id 입력 창

    //console.log(arrUserInfo);
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        //console.log(user);
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI',peerId => {
      $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));

function openStream(){
    const config = { audio: false, video: true };
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

peer.on('open', id => {
  $('#my-peer').append(id);
  $('#btnSignUp').click( () => {
      const username = $('#txtUsername').val();
      socket.emit('NGUOI_DUNG_DANG_KY',   { ten: username, peerId: id });
  });
});

//ADD    - extra
$('#add').click( () => {

  console.log("add click");
  const i = 0;
    $('#result').append(`<br /><br /><video class="`+i+`" width="300" controls></video>`);
});

 //caller
$('#btnCall').click(() => {
  const id = $('#remoteId').val();
  console.log("id: "+id);
  openStream()
  .then(stream => {
      playStream('localStream', stream);
      const call = peer.call(id,stream);
      call.on('stream',remoteStream => playStream('remoteStream', remoteStream));
  });
});

peer.on('call', call => {
  openStream()
  .then(stream => {
    call.answer(stream);
    playStream('localStream', stream);
    call.on('stream',remoteStream => playStream('remoteStream', remoteStream));
  });
});
