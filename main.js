const imagePairs = [
    {original:"images/a1_8gt.png", recon:"images/a1_2ditic_0.0373.png", bpp:0.0373},
    {original:"images/a2_7gt.png", recon:"images/a2_1ditic_0.054.png", bpp:0.054},
    {original:"images/a3_gt.png", recon:"images/a3_ditic_0.042.png", bpp:0.042},
    {original:"images/01092_TR_4032x3024.png", recon:"images/ditic_01092_TR_4032x3024.png", bpp:0.029},
    {original:"images/1_1.png", recon:"images/ditic_1_1.png", bpp:0.017},
];


let currentIndex=0;
let sliderPercent=50;
let isDragging=false;
let magnifierEnabled=false;  /* toggle for magnifier - default OFF */
const zoom=2;

const wrapper=document.getElementById("compare");
const original=document.getElementById("original");
const recon=document.getElementById("recon");
const line=document.getElementById("line");
const handle=document.getElementById("handle");
const magnifier=document.getElementById("magnifier");

function updateImage(){
    original.src=imagePairs[currentIndex].original;
    recon.src=imagePairs[currentIndex].recon;
    const bpp = imagePairs[currentIndex].bpp.toFixed(4);
    document.getElementById("imageCounter").innerText=(currentIndex+1)+" / "+imagePairs.length+" | bpp: "+bpp;
}
updateImage();

function nextImage(){
    currentIndex=(currentIndex+1)%imagePairs.length;
    updateImage();
}
function prevImage(){
    currentIndex=(currentIndex-1+imagePairs.length)%imagePairs.length;
    updateImage();
}

wrapper.addEventListener("mousedown",()=>isDragging=true);
window.addEventListener("mouseup",()=>isDragging=false);

window.addEventListener("mousemove",(e)=>{
    const rect=wrapper.getBoundingClientRect();
    let x=e.clientX-rect.left;
    let y=e.clientY-rect.top;

    if(isDragging){
        if(x<0)x=0;
        if(x>rect.width)x=rect.width;
        sliderPercent=(x/rect.width)*100;
        recon.style.clipPath=`inset(0 ${100-sliderPercent}% 0 0)`;
        line.style.left=sliderPercent+"%";
        handle.style.left=sliderPercent+"%";
    }

    if(x>=0 && x<=rect.width && y>=0 && y<=rect.height && magnifierEnabled){
        magnifier.style.display="block";
        magnifier.style.left=(x-75)+"px";
        magnifier.style.top=(y-75)+"px";

        const activeImage =
            sliderPercent/100*rect.width > x ?
            imagePairs[currentIndex].recon :
            imagePairs[currentIndex].original;

        magnifier.style.backgroundImage=`url(${activeImage})`;
        magnifier.style.backgroundSize=rect.width*zoom+"px "+rect.height*zoom+"px";
        magnifier.style.backgroundPosition=
            -(x*zoom-75)+"px "+-(y*zoom-75)+"px";
    }else{
        magnifier.style.display="none";
    }
});

/* ===== BibTeX Copy ===== */
function copyBibtex(){
    const text=document.getElementById("bibtex").innerText;
    navigator.clipboard.writeText(text);
    document.getElementById("copyMsg").innerText="Copied!";
    setTimeout(()=>document.getElementById("copyMsg").innerText="",1500);
}

/* ===== Magnifier Toggle ===== */
function toggleMagnifier(){
    magnifierEnabled = !magnifierEnabled;
    const btn = document.getElementById("magnifierToggle");
    if(magnifierEnabled){
        btn.style.background = "#666";
        btn.innerText = "🔍 Zoom ON";
    } else {
        btn.style.background = "#999";
        btn.innerText = "🔍 Zoom OFF";
        magnifier.style.display = "none";
    }
}

/* ===== Theme Toggle ===== */
document.getElementById("themeToggle").onclick=function(){
    document.body.classList.toggle("light");
    this.innerText =
        document.body.classList.contains("light") ? "☀️" : "🌙";
};