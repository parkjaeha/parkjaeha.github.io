//A simple html5 draw board

var prepareCanvas = function () {
  var socket = io();
  var canDiv = document.getElementById("canvasDiv");
  var canvasWidth="400";
  var canvasHeight = "400";
  canvas     = document.createElement("canvas");
  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);
  canvas.setAttribute("id", 'canvas');
  canDiv.appendChild(canvas);
 context = canvas.getContext("2d");


  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();

  var paint;

  function addClick(x,y,draggin){
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(draggin);

  }


  function redraw(clickDrag,clickX,clickY){

    context.strokeStyle = "#df4b26";
    context.lineJoin    = "round";
    context.lineWidth   = 5;

    for(i = 0; i < clickX.length;i ++){
      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
      }else{
        context.moveTo(clickX[i]-1, clickY[i]);
      }

     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
    }
  }


socket.on("drawing",function(msg){
    redraw(msg.drag, msg.x, msg.y);
})

  $("#canvas").mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw(clickDrag, clickX, clickY);
  });

  $("#canvas").mousemove(function(e){
    if(paint){
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw(clickDrag, clickX, clickY);
    }

  });

  $('#canvas').mouseup(function(e){
    paint = false;
    socket.emit("drawing", {drag : clickDrag, x : clickX, y : clickY});
  });

  $('#canvas').mouseleave(function(e){
    paint = false;
    socket.emit("drawing", {drag : clickDrag, x : clickX, y : clickY});
  });


}
