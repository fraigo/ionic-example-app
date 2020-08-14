import React from 'react';
import './GameCanvas.css';

interface ContainerProps {
  id: string;
}

interface Command {
    id: string,
    x: number,
    y: number,
    w?: number,
    h?: number,
    border?: string,
    fill?: string,
    text?: string
}

const GameCanvas: React.FC<ContainerProps> = ({ id }) => {
    var points : Array<Command>=[
    ];
    var interval=2000;
    function add(){
        var px=Math.random()*960+20;
        var py=Math.random()*710+20;
        points.push({id: "rect", x: px, y:py, w:50, h:50, fill: "#FF0"})
        repaint();
        setTimeout(add,interval=Math.max(750,interval-20));

    }
    function repaint(){
        var canvas= document.getElementById(id) as HTMLCanvasElement;
        if (canvas){
            const unit = getViewport()[2];
            var ctx=canvas.getContext("2d");
            if (ctx){
                ctx.fillStyle="#000";
                ctx.fillRect(0,0,1000*unit,750*unit);
                for(var idx in points){
                    var pt=points[idx];
                    if (pt.fill){
                        ctx.fillStyle=pt.fill;
                    }
                    if (pt.w && pt.h){
                        ctx.fillRect(pt.x*unit,pt.y*unit,pt.w*unit,pt.h*unit);
                    }
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
    function  checkPoints(nx:number,ny: number){
        for(var idx=points.length-1; idx>=0; idx--){
            var pt = points[idx];
            if (pt.w && pt.h){
                var r=Math.sqrt((pt.x+pt.w/2-nx)*(pt.x+pt.w/2-nx)+(pt.y+pt.h/2-ny)*(pt.y+pt.h/2-ny));
                //console.log(idx,r);
                if (r<pt.w){
                    points.splice(idx,1);
                }

            }
        }
        points.push({id: "rect", x: nx-4, y:ny-4, w:8, h:8, fill: "#F0F"});
        repaint();
    }
    function handleClick(ev: MouseEvent){
        if (ev.target===document.getElementById(id)){
            const unit = getViewport()[2];
            var nx=ev.offsetX/unit;
            var ny=ev.offsetY/unit;
            checkPoints(nx,ny);
        }
    }
    function handleTouch(ev: TouchEvent){
        if (ev.target===document.getElementById(id)){
            const unit = getViewport()[2];
            var element  = ev.target as HTMLElement;
            var rect=element.getBoundingClientRect();
            console.log(ev.touches[0],rect);
            var nx=(ev.touches[0].pageX-rect.x)/unit;
            var ny=(ev.touches[0].pageY-rect.y)/unit;
            checkPoints(nx,ny);
        }
    }
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

        repaint();
    })
    var time = 0;
    window.addEventListener('resize', function(){ clearTimeout(time); time=window.setTimeout(handleResize,500) });
    add();    
  return (
    <div className="canvas-container"><canvas id={id} width={dimensions.width} height={dimensions.height} className="game-canvas"></canvas></div>
  );
};

export default GameCanvas;
