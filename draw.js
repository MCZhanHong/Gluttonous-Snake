var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");
//构造对象方块
function Rect(x,y,w,h,cr){
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.cr=cr;
}
//画方块的方法
Rect.prototype.draw=function(){
	context.beginPath();
	context.fillStyle=this.cr;
	context.rect(this.x,this.y,this.w,this.h);
	context.fill();
	context.stroke();
}

//构造对象蛇
function Snake(){
	//数组蛇
	var snakeArr=[];
	for(var i=0;i<4;i++){
		var rect=new Rect(i*20,0,20,20,"gray");
		snakeArr.splice(0,0,rect);
		//snakeArr.push(rect);
	}
	//蛇头
	var head=snakeArr[0];
	head.cr="red";
	this.head=snakeArr[0];
	this.snakeArr=snakeArr;
	//初始化方向 37左38上39右40下
	this.direction=39;
}
Snake.prototype.draw=function(){
	for(var i=0;i<this.snakeArr.length;i++){
		this.snakeArr[i].draw();
	}
}
Snake.prototype.move=function(){
	var rect=new Rect(this.head.x,this.head.y,this.head.w,this.head.h,"gray");
	this.snakeArr.splice(1,0,rect);
	if(isEat()){
		food=new getRandomFood();
	}else{
		this.snakeArr.pop();
	}
	switch(this.direction){
		case 37:
			this.head.x-=this.head.w;
			break;
		case 39:
			this.head.x+=this.head.w;
			break;
		case 38:
			this.head.y-=this.head.h;
			break;
		case 40:
			this.head.y+=this.head.h;
			break;
		default:
			break;
	}
	//gameover判定
	if(this.head.x>canvas.width||this.head.x<0||this.head.y>canvas.height||this.head.y<0){
		clearInterval(timer);
	}
	for(var i=1;i<this.snakeArr.length;i++){
		if(this.snakeArr[i].x==this.head.x&&this.snakeArr[i].y==this.head.y)
			clearInterval(timer);
	}
}
//画蛇
var snake =new Snake();
snake.draw();
//画食物
var food=new getRandomFood();
//定时器
var timer=setInterval(function(){
	context.clearRect(0,0,canvas.width,canvas.height);
	food.draw();
	snake.move();
	snake.draw();
},100);

//键盘事件，蛇不能直接掉头
document.onkeydown=function(e){
	var ev=e||window.event;
	switch(ev.keyCode){
		case 37:
			if(snake.direction!==39)
				snake.direction=37;
			break;
		case 38:
			if(snake.direction!==40){
				snake.direction=38;
			}
			break;
		case 39:
			if(snake.direction!==37)
				snake.direction=39;
			break;
		case 40:
			if(snake.direction!==38)
				snake.direction=40;
			break;
	}
	ev.preventDefault;
}
//随机函数
function getNumberInRange(min,max){
	var range=max-min;
	var r=Math.random();
	return Math.round(r*range+min);
}

//食物对象
function getRandomFood(){
	//判断食物是否出现在蛇身上，如果重合则重新生成
	var isOnSnake=true;
	//食物随机出现
	while(isOnSnake){
		isOnSnake=false;
		var indexX=getNumberInRange(0,canvas.width/20-1);
		var indexY=getNumberInRange(0,canvas.height/20-1);
		var rect=new Rect(indexX*20,indexY*20,20,20,"green");
		for(var i=0;i<snake.snakeArr.length;i++){
			if(snake.snakeArr[i].x==rect.x&&snake.snakeArr[i].y==rect.y){
				isOnSnake=true;
				break;
			}
		}
	}
	return rect;
}

//判断是否吃到食物
function isEat(){
	if(snake.head.x==food.x&&snake.head.y==food.y)
		return true;
	else
		return false;
}
