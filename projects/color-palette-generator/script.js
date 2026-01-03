const generateBtn=document.getElementById("generateBtn");
const colorBoxes=document.querySelectorAll(".color-box");

function randomColor(){
    const hex="0123456789ABCDEF";
    let color="#";
    for(let i=0;i<6;i++){
        color+=hex[Math.floor(Math.random()*16)];
    }
    return color;
}

function generatePalette(){
    colorBoxes.forEach(box=>{
        const color=randomColor();
        box.style.background=color;
        box.textContent=color;
    });
}

generateBtn.addEventListener("click",generatePalette);

// generate once on load
generatePalette();
