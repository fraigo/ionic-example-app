import React from 'react';
import './GameCanvas.css';

interface ContainerProps {
  id: string;
}

interface ICommand {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    border: string;
    fill: string;
    text: string;
    start: number;
    end: number;
}

class Command implements ICommand{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    border: string;
    fill: string;
    text: string;
    start: number;
    end: number;

    constructor(options: any) {
        this.id=options.id;
        this.x=options.x;
        this.y=options.y;
        this.w=options.w;
        this.h=options.h;
        this.border=options.border;
        this.fill=options.fill;
        this.text=options.text;
        this.start=options.start;
        this.end=options.end;
    }
}

var line=0;
var points : Array<Command>=[
];
var ui : Array<Command>=[
];
var time = 0;
var direction=1;
var barWidth=500;
var barHeight=60;
let score=new Command({
    id:"rect",
    x: 880,
    y: 30,
    w: 90,
    h: 30,
    border: "#fff",
    text: 0
});
ui.push(score);
var tickId=0;
var canvas : HTMLCanvasElement;
var interval = 50;
var running = true;


function drawItem(ctx:CanvasRenderingContext2D,item: Command, unit: number){
    if (item.fill){
        ctx.fillStyle=item.fill;
    }
    if (item.border){
        ctx.strokeStyle =item.border;
    }
    var x=item.x*unit;
    var y=item.y*unit;
    var w=item.w?item.w*unit:0;
    var h=item.h?item.h*unit:0;
    var start=item.start?item.start:0;
    var end=item.end?item.end:2*Math.PI;
    var fh=Math.round(30*unit);
    ctx.font=fh+"px Arial";

    if (item.id==="rect" && item.fill){
        ctx.fillRect(x,y,w,h);
    }
    if (item.id==="rect" && item.border && w>0){
        ctx.strokeRect(x,y,w,h);
    }
    if (item.id==="ellipse" && w>0){
        ctx.beginPath();
        ctx.ellipse(x,y,w/2,h/2,0,start,end);
        if (item.fill){
            ctx.fill();
        }
        if (item.border){
            ctx.stroke();
        }
    }
    if (item.text){
        ctx.textAlign = "center";
        if (item.border){
            ctx.fillStyle =item.border;
        }
        ctx.fillText(item.text,x+w/2,y+h/2+fh/3,w);
    }
}
function repaint(){
    if (canvas){
        const unit = getViewport()[2];
        var ctx=canvas.getContext("2d");
        if (ctx){
            ctx.fillStyle="#000";
            ctx.fillRect(0,0,1000*unit,750*unit);
            for(let idx in points){
                let pt=points[idx];
                drawItem(ctx, pt, unit);
            }
            for(let idx in ui){
                let pt=ui[idx];
                drawItem(ctx, pt, unit);
            }
        }
    }
}
function getViewport(){
    var ratio=4/3;
    var unit=1;
    var dw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    var dh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    var w=dw;
    var h=dh;
    if (w/ratio>h){
        w=h*ratio;
    }else{
        h=w/ratio;
    }
    unit=w/1000;
    return [w,h,unit];
}

function handleClick(ev: MouseEvent){
    if (ev.target===canvas){
        const unit = getViewport()[2];
        var nx=ev.offsetX/unit;
        var ny=ev.offsetY/unit;
        clickCanvas(nx,ny);
    }
}
function handleTouch(ev: TouchEvent){
    if (ev.target===canvas){
        const unit = getViewport()[2];
        var element  = ev.target as HTMLElement;
        var rect=element.getBoundingClientRect();
        console.log(ev.touches[0],rect);
        var nx=(ev.touches[0].pageX-rect.left)/unit;
        var ny=(ev.touches[0].pageY-rect.top)/unit;
        clickCanvas(nx,ny);
    }
}

function  clickCanvas(nx:number,ny: number){
    console.log(points);
    if (line>0 && running){
        var bar =points[line]; 
        var bar0 = points[line-1];
        var bw = (bar.w?bar.w:0);
        if (line>1){
            if (bar0){
                const newX0=Math.max(bar.x,points[line-1].x);
                const newX1=Math.min(bar.x+bw,points[line-1].x+(bar0.w?bar0.w:0));
                const newWidth=Math.max(0,newX1-newX0);
                console.log("new",newX0,newX1,newWidth);
                bar.x=newX0;
                bar.w=newWidth;   
                bar.text=""+newWidth;
                score.text+=newWidth; 
            }
        }else{
            if (bar){
                const newX0=Math.max(bar.x,0);
                const newX1=Math.min(bar.x+bw,1000);
                const newWidth=Math.max(0,newX1-newX0);
                bar.x=newX0;
                bar.w=newWidth;   
                bar.text=""+newWidth; 
                score.text+=newWidth;
            }
        }
        console.log(points[line].x);
    }
    repaint();
    if (running){
        line++;
    }
}


function tick(){
    if (line>=points.length){
        var prev=points[line-1];
        var pw=barWidth;
        var py=line*barHeight;
        if (prev){
            pw=prev.w;
            if (pw<2){
                running = false;
                return;
            }
            if ((750-py)<barHeight){
                setTimeout(function(){
                    points.splice(0,points.length);
                    line=0;
                    barWidth=500;
                    barHeight-=1;
                    interval-=5;
                    direction=1;
                    repaint();
                    if (tickId){
                        window.clearTimeout(tickId);
                    }
                    tickId=window.setTimeout(tick,50);
                },3000);
                return;
            }
        }
        var px=-direction*pw;
        points.push(new Command({id: "rect", x: px, y:750-py, w:pw, h:barHeight, fill: "#FF0", border: "#F00"}))    
    }else if(line>=0){
        points[line].x+=direction*10;
        if (points[line].x+points[line].w>1000){
            direction=-1;
        }
        if (points[line].x<0){
            direction=1;
        }
    }
    repaint();
    if (tickId){
        window.clearTimeout(tickId);
    }
    tickId=window.setTimeout(tick,interval);
}    


const GameCanvas: React.FC<ContainerProps> = ({ id }) => {

    
    var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    if (isTouch){
        window.addEventListener("touchstart",handleTouch);
    }else{
        window.addEventListener("click",handleClick);
    }

    const [iw,ih] = getViewport();
    const [dimensions, setDimensions] = React.useState({ 
        height: ih,
        width: iw
    })
    function handleResize() {
        const [w,h] = getViewport();
        setDimensions({
            height: h,
            width: w
        })
        repaint();
    }
    React.useEffect(() => {
        canvas = document.getElementById(id) as HTMLCanvasElement;
        repaint();
        tick();    
    })
    window.addEventListener('resize', function(){ clearTimeout(time); time=window.setTimeout(handleResize,500) });
    
  return (
    <div className="canvas-container"><canvas id={id} width={dimensions.width} height={dimensions.height} className="game-canvas"></canvas></div>
  );
};

export default GameCanvas;
