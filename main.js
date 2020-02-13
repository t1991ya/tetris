const canvas=document.getElementById("can");
const ctx=canvas.getContext('2d');
const width=300;
const height=400;
canvas.width=width;
canvas.height=height;
const blockSize=20;
const hCells=width/blockSize;
const VCells=height/blockSize;
const J={state:["1110001000000000","0010001001100000","0000100011100000","1100100010000000"],color:"navy"};
const I={state:["0000111100000000","0100010001000100","0000111100000000","0100010001000100"],color:"aqua"};
const L={state:["1110100000000000","0110001000100000","0000001011100000","1000100011000000"],color:"orange"}; 
const S={state:["0110110000000000","0100011000100000","0110110000000000","0100011000100000"],color:"green"};
const Z={state:["1100011000000000","0010011001000000","1100011000000000","0010011001000000"],color:"red"};
const T={state:["1110010000000000","0010011000100000","0000010011100000","1000110010000000"],color:"magenta"};
const O={state:["0110011000000000","0110011000000000","0110011000000000","0110011000000000"],color:"yellow"};
const tetrominoShapes=[J,I,L,S,Z,T,O];
var grid=[];
var isRotated=false;
// define starting position for every tetromino shape
var startX=120;
var startY=0;
var score=0;
// the Game speeed in ms
var speed=1000-100*(score/5);
var m=0;
var id=0;
var state=0;

var tetromino=[];
function stopGame()
{
   cancelAnimationFrame(id);
}
canvas.addEventListener('click',turnOn);
document.addEventListener('keydown',gameControle);
document.addEventListener('keyup',resetSpeed);
function resetSpeed(e)
{
    if(e.key=="ArrowDown")
        speed=1000-100*(score/5);
}
function turnOn(e)
{
    var x=e.offsetX;
    var y=e.offsetY;
    x=Math.floor(x/blockSize);
    y=Math.floor(y/blockSize);
    grid[x+y*15].isColored=!grid[x+y*15].isColored;
    console.log(x*20,y*20,grid[x+y*15]);
    drawGrid();
}


// function to move tetrominos H and Rotate Them
function gameControle(e)
{
    //pause game
   if(e.key=="p")
   {
       stopGame();
   }
   // start game
   if(e.key==" ")
   {
   stopGame();
   startGame();
   }
    if(e.key=="ArrowUp")
    {
    var stop=false;
        
      var nexttetromino=[];
        tetromino.forEach(element=>{
            nexttetromino.push(new square(element.x,element.y));
        });
        nexttetromino=[];
       rotate(nexttetromino);
       state--;
       if(state==-1)
        state=3;

        nexttetromino.forEach(element=>{
            if(grid[element.index].isColored==true)
            {
                stop=true;

            }
           
            if(element.x>width-blockSize)
            {
                stop=true;
               
            }
            if(element.x<0)
            {
                stop=true;
               
            }
            if(element.y==height-blockSize)
            {
                stop=true;
              
            }
           
            
        });
    if(!stop)
    {
        tetromino=[];
        rotate(tetromino);
    }
 }
    if(e.key=="ArrowRight")
    {
       var stop=false;
       tetromino.forEach(element=>{
           if(element.x==width-blockSize)
           stop=true;
           else
          if(grid[element.index+1].isColored)
          stop=true;
       });
       if(!stop)
       {
        startX+=blockSize;
        tetromino.forEach(element=>
        {
            
            element.x+=blockSize;
        });
       }
        
     
    }
    if(e.key=="ArrowLeft")
    {
        var stop=false;
        tetromino.forEach(element=>{
            if(element.x==0)
            stop=true;
            else
           if(grid[element.index-1].isColored)
           stop=true;
        });
        if(!stop)
        {
         startX+=-blockSize;
         tetromino.forEach(element=>
         {
             
             element.x+=-blockSize;
         });
        }
    }
    if(e.key=="ArrowDown")
    {
      speed-=200;
    }

    drawGrid();
    drawtetromino();
 
}
class square
{
   constructor (x,y)
   {
       this.x=x;
       this.y=y;
   }
  
  get index(){
      return this.x/blockSize+this.y*hCells/blockSize;
  }
   isColored=false;
   color="black";
}
// move tetromino Down
var last=0;
function checkScore()
{
    
    for(let j=0;j<VCells;j++)
    {
        var addscore=true;
        for(let i=0;i<hCells;i++)
        {
            if(grid[i+hCells*j].isColored==false)
            {
                addscore=false;
            }
            
        }
        if(addscore)
        {
                for(let i=0;i<hCells;i++)
            {
                
                grid[i+hCells*j].isColored=false;
            }
            var t=[];
            for(let i=0;i<hCells;i++)
                t.push(new square(blockSize*i,0));
            for(let i=hCells*(j+1)-1;i>hCells-1;i--)
            {
                grid[i].isColored=grid[i-hCells].isColored;
                grid[i].color=grid[i-hCells].color;
            }

            score++;
           
           
        }
           
    }

}

function displayGameInfo()
{

    document.getElementById("score").textContent=score;
    document.getElementById("level").textContent=Math.floor(score/5);
}
function move(now)
{
    if(now-last>speed)
    {
        if(detectCollision())
        {
             m=Math.floor(Math.random()*7);
            startX=120;
            startY=0;
            state=0;

            tetromino.forEach(element=>{
                
                grid[element.index]=element;
                grid[element.index].isColored=true;
            });
            tetromino=[];
            newTetromino(state,m,tetromino);
            
            speed=1000-100*level;
            isRotated=false;
            checkScore();
            displayGameInfo();
        }
        else
        {
            tetromino.forEach(element=>
                {
                   element.y+=blockSize;
                });
                startY+=blockSize;
        }
        last=now;
        id=requestAnimationFrame(move);
        drawGrid();
        drawtetromino();
        
                  
    }
    else
    {
       id= requestAnimationFrame(move);
    }
    if(gameEnd())
        {
            stopGame();
            alert("Game is over");
        }
   
}

//check collision
function detectCollision()
{
    var stop=false;
    tetromino.forEach(element=>
        {
            if(element.y==height-blockSize)
                stop=true;
            else
            {
               
                if(grid[element.index+hCells].isColored==true)
                {
                    stop=true;
                    
                }
            }
        });
    return stop;
}

// game  Start
function startGame()
{
    id= requestAnimationFrame(move);
}

function newTetromino(n,m,g)
{
    var t=tetrominoShapes[m];
    var st=t.state[n];
    for(let j=0;j<st.length;j++)
    {
        if(st[j]=="1")
        {
            var s=new square((j%4)*blockSize+startX,Math.floor(j/4)*blockSize+startY);
            s.color=t.color;
            g.push(s);
        }
    }
}
// Rotate a tetromino
function rotate(t)
{
    if(isRotated==false&&state==0)
        {
            state++;
            isRotated=true;
        }
    newTetromino(state,m,t);
    state++;
    if(state==4)
    {
        state=0;
    }
}
function colorTetremino()
{
    tetromino.forEach(element=>element.indexsColored=true);
}

// draw single square
function drawsqaure(s)
{
    ctx.fillStyle=s.color;
    ctx.fillRect(s.x,s.y,blockSize-1,blockSize-1);
}
// check for game end
function gameEnd()
{
    end=false;
    for(let i=0;i<hCells;i++)
    {
        if(grid[i].isColored==true)
        {
            end=true;
            break;
        }
    }
    return end;
}
// draw grid
function drawGrid()
{
    ctx.fillStyle="white";
    ctx.fillRect(0,0,width,height);
    grid.forEach(element => {
        drawsqaure(element);
       if(!element.isColored)
       {
        ctx.clearRect(element.x,element.y,blockSize-1,blockSize-1);
       }
        
    });
}
// fill grid with squares
function fillGrid()
{
    for(let i=0;i<VCells;i++)
    {
        for(let j=0;j<hCells;j++)
        {
            grid.push(new square(j*blockSize,i*blockSize));
        }
    }
}
//draw tetromino
function drawtetromino()
{
    tetromino.forEach(element=>
        {
            drawsqaure(element);
        });
}
fillGrid();
newTetromino(state,m,tetromino);
drawGrid();
drawtetromino();
