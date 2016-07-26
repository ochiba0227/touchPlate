var myButton = 0;	// [Start]/[Stop]のフラグ
var rapCount = 0; // 距離に応じたカウント
var distance = 100;
var poolLength = 25;
var myInterval;
var textInput = document.getElementById('msg_input');
var startButton = document.getElementById('startButton');
var time = document.getElementById('time');
var myStart;
// 1.イベントとコールバックの定義
var socketio = io();

socketio.on("connected", function(name) {});
socketio.on("touch", function (data) {
  /*addMessage(data);*/
  //計測中でない場合
  if(myButton==0){
    return;
  }
  rapCount++;
  //泳ぎ切ったら
  if(rapCount*poolLength==distance){
    myCheck();
  }
  //計測状態が継続するなら計測表示をしばらくストップ
  else{
    clearInterval( myInterval );
    setTimeout(function(){myInterval=setInterval("myDisp()",1);}, 3000);
  }
  console.log(rapCount)
});
socketio.on("boardConnected", function (data) { /*alert(data);*/ });
socketio.on("disconnect", function () {});

// 2.イベントに絡ませる関数の定義
function start(name) {
  socketio.emit("connected", name);
}

function addMessage (msg) {
  var domMeg = document.createElement('div');
  domMeg.innerHTML = new Date().toLocaleTimeString() + ' ' + msg;
  msgArea.appendChild(domMeg);
}

//スタートストップを制御
function myCheck(){
  if (myButton==0){	// Startボタンを押した
    myStart=new Date();	// スタート時間を退避
    rapCount = 0;
    myButton = 1;
    startButton.value = "Stop!";
    myInterval=setInterval("myDisp()",1);
  }else{	// Stopボタンを押した
    myDisp();
    myButton = 0;
    startButton.value = "Start";
    clearInterval( myInterval );
  }
}
//表示部分
function myDisp(){
  myStop=new Date();	// 経過時間を退避
  myTime = myStop.getTime() - myStart.getTime();	// 通算ミリ秒計算
  myH = Math.floor(myTime/(60*60*1000));	// '時間'取得
  myTime = myTime-(myH*60*60*1000);
  myM = Math.floor(myTime/(60*1000));	// '分'取得
  myTime = myTime-(myM*60*1000);
  myS = Math.floor(myTime/1000);	// '秒'取得
  myMS = myTime%1000;	// 'ミリ秒'取得
  //textInput.value = myH+":"+myM+":"+myS+":"+myMS;
  time.innerHTML  = myH+":"+myM+":"+myS+":"+myMS;
}

$(function(){
  //textInput.value = "";
  time.innerHTML  = 0+":"+0+":"+0+":"+0;
});
