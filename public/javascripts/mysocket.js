var myButton = 0;	// [Start]/[Stop]のフラグ
var rapCount = 0; // 距離に応じたカウント
var distance = 100;
var poolLength = 25;
var myInterval;
var textInput = document.getElementById('msg_input');
var startButton = document.getElementById('startButton');
var time = document.getElementById('result_time');
var myStart = null;

var result1 = document.getElementById('result1');
var result2 = document.getElementById('result2');
var result3 = document.getElementById('result3');
var result4 = document.getElementById('result4');
var worldRecord = document.getElementById('worldRecord');
var worldRecord_Time = null;

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
    startButton.style.display = "";
    var elapsedTime = getTimeElapsed(myStart);
    if(worldRecord_Time==null||worldRecord_Time>elapsedTime){
      worldRecord.innerHTML = "WR. " + formatDate(elapsedTime);
      worldRecord_Time = elapsedTime;
      // 多分クッキーに書き込む
    }
  }
  //計測状態が継続するなら計測表示をしばらくストップ
  else{
    clearInterval( myInterval );
    setTimeout(function(){myInterval=setInterval("myDisp()",1);}, 3000);
  }
  var cur_record = document.getElementById('record'+rapCount);
  cur_record.innerHTML=rapCount+". "+time.innerHTML;
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
    // startButton.value = "Stop!";
    startButton.style.display = "none";
    clearRecords();
    myInterval=setInterval("myDisp()",1);
  }else{	// Stopボタンを押した
    myDisp();
    myButton = 0;
    // startButton.value = "Start";
    clearInterval( myInterval );
  }
}

function clearRecords(){
  var cur_record = null;
  for(var rapCount=1;rapCount<=4;rapCount++){
    cur_record = document.getElementById('record'+rapCount);
    cur_record.innerHTML=rapCount+". ";
  }
}

//表示部分
function myDisp(){
  if(myStart==null){
    myTime = new Date(0);
  }
  else{
    myTime = getTimeElapsed(myStart);
  }
  time.innerHTML  = formatDate(myTime);
}

// 経過時間を表示
function　getTimeElapsed(myStart){
  var myStop=new Date();	// 経過時間を退避
  return myStop.getTime() - myStart.getTime();	// 通算ミリ秒計算
}

// 時間を表示する形式に変換
function formatDate(myTime){
  myH = Math.floor(myTime/(60*60*1000));	// '時間'取得
  myTime = myTime-(myH*60*60*1000);
  myM = Math.floor(myTime/(60*1000));	// '分'取得
  myTime = myTime-(myM*60*1000);
  myS = Math.floor(myTime/1000);	// '秒'取得
  myMS = myTime%1000;	// 'ミリ秒'取得
  return ("0" + myH).slice(-2)+":"+("0" + myM).slice(-2)+":"+("0" + myS).slice(-2)+":"+(myMS+"00").slice(0,3);
}

$(function(){
  myDisp();
});
