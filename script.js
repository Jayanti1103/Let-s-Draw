const canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d");
let painting=false,tool="brush",color=document.getElementById("color").value,size=document.getElementById("size").value;

canvas.addEventListener("mousedown",e=>{
  if(tool==="fill") floodFill(e.offsetX,e.offsetY,hexToRgba(color));
  else{painting=true;draw(e);}
});
canvas.addEventListener("mouseup",()=>{painting=false;ctx.beginPath();});
canvas.addEventListener("mousemove",draw);

function draw(e){
  if(!painting||tool==="fill") return;
  ctx.lineWidth=size;
  ctx.lineCap="round";
  ctx.strokeStyle=(tool==="eraser")?"#fff":color;
  ctx.lineTo(e.offsetX,e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX,e.offsetY);
}

document.getElementById("color").oninput=e=>color=e.target.value;
document.getElementById("size").oninput=e=>size=e.target.value;
document.getElementById("brush").onclick=()=>tool="brush";
document.getElementById("eraser").onclick=()=>tool="eraser";
document.getElementById("fill").onclick=()=>tool="fill";
document.getElementById("clear").onclick=()=>ctx.clearRect(0,0,canvas.width,canvas.height);
document.getElementById("save").onclick=()=>{
  const link=document.createElement("a");
  link.download="painting.png";
  link.href=canvas.toDataURL();
  link.click();
};

// --- Flood Fill (bucket) ---
function floodFill(startX,startY,fillColor){
  const imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
  const data=imgData.data;
  const width=canvas.width;
  const height=canvas.height;
  const stack=[[startX,startY]];
  const startPos=(startY*width+startX)*4;
  const startColor=data.slice(startPos,startPos+4);

  if(colorsMatch(startColor,fillColor)) return;

  while(stack.length){
    const [x,y]=stack.pop();
    if(x<0||y<0||x>=width||y>=height) continue;
    const pos=(y*width+x)*4;
    const pixel=data.slice(pos,pos+4);
    if(!colorsMatch(pixel,startColor)) continue;
    data[pos]=fillColor[0];
    data[pos+1]=fillColor[1];
    data[pos+2]=fillColor[2];
    data[pos+3]=255;
    stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
  }
  ctx.putImageData(imgData,0,0);
}

function colorsMatch(a,b){return a[0]===b[0]&&a[1]===b[1]&&a[2]===b[2]&&a[3]===b[3];}
function hexToRgba(hex){
  const bigint=parseInt(hex.slice(1),16);
  return [(bigint>>16)&255,(bigint>>8)&255,bigint&255,255];
}