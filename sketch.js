var database;
var drawing = [], currentPath = [], isDrawing = false;
var saveButton;
var r = 255, g = 255, b = 255;
var redButton,blueButton,greenButton,yellowButton,whiteButton,rainbowButton;
var rainbow = false;
var changeR = "no", changeG = "no", changeB = "no"; 
var chanceR = "no", chanceG = "no", chanceB = "no";
var colorE;

function setup() {
    canvas = createCanvas(1100,600);
    database = firebase.database();
    canvas.parent("canvascontainer");
    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);

    saveButton = createButton("save")
    saveButton.position(1150,30)
    saveButton.mousePressed(saveDrawing);

    clearButton = createButton("clear")
    clearButton.position(1150,70)
    clearButton.mousePressed(clearDrawing);
    
    redButton = createButton("red");
    redButton.position(180,605);
    redButton.mousePressed(()=>{
      r = 255;
      g = 0;
      b = 0;
    });

    blueButton = createButton("blue");
    blueButton.position(180,630)
    blueButton.mousePressed(()=>{
      r = 0;
      g = 0;
      b = 255;
    });

    whiteButton = createButton("white");
    whiteButton.position(240,605);
    whiteButton.mousePressed(()=>{
      r = 255;
      g = 255;
      b = 255;
    });

    greenButton = createButton("green");
    greenButton.position(240,630)
    greenButton.mousePressed(()=>{
      r = 0;
      g = 255;
      b = 0;
    });

    yellowButton = createButton("yellow");
    yellowButton.position(300,605);
    yellowButton.mousePressed(()=>{
      r = 255;
      g = 255;
      b = 0;
    });

    rainbowButton = createButton("rainbow");
    rainbowButton.position(300,630);
    rainbowButton.mousePressed(()=>{
      r = 255;
      g = 0;
      b = 6;
      rainbow = true;
    });

    colorE = createElement("h1","COLOUR :")
    colorE.position(5,590);
    /*
    var ref = database.ref("drawings")
    ref.on("value", gotData, errData)
    */
}

function startPath(){
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath)
}

function endPath(){
    isDrawing = false;
}

function draw() {
    background(20);

    if (rainbow === true) {
      if(r >= 255 && b === 6){
        changeB = "plus";
        chanceR = "no";
        chanceG = "no";
        chanceB = "yes";
      };
      if(b >= 255 && g <= 0){
        changeR = "minus";
        chanceR = "yes";
        chanceG = "no";
        chanceB = "no";
      };
      if(r <= 0 && b >= 255){
        changeG = "plus";
        chanceR = "no";
        chanceG = "yes";
        chanceB = "no";
      };
      if(g >= 255 && r <= 0){
        changeB = "minus";
        chanceR = "no";
        chanceG = "no";
        chanceB = "yes";
      };
      if(b <= 0 && g >= 255){
        changeR = "plus";
        chanceR = "yes";
        chanceG = "no";
        chanceB = "no";
      };
      if(r >= 255 && b <= 0) {
        changeG = "minus";
        chanceR = "no";
        chanceG = "yes";
        chanceB = "no";
      };
      if(r >= 255 && b <= 0 && g <= 0){
        changeR = "no";
        changeG = "no";
        changeB = "no";
        chanceR = "no";
        chanceG = "no";
        chanceB = "no";
        r = 255;
        g = 0;
        b = 6;
      }

    };

    if(r >= 255 && chanceR === "no"){
      changeR = "no";
    } else if(r <= 0 && chanceR === "no"){
      changeR = "no"
    };
    if(g >= 255 && chanceG === "no"){
      changeG = "no";
    } else if(g <= 0 && chanceG === "no"){
      changeG = "no"
    };
    if(b >= 255 && chanceB === "no"){
      changeB = "no";
    } else if(b <= 0 && chanceB === "no"){
      changeB = "no"
    };

    if(changeR === "plus"){
      r = r + 2;
    };
    if(changeR === "minus"){
      r = r - 2;
    };
    if(changeG === "plus"){
      g = g + 2;
    } else if(changeG === "minus"){
      g = g - 2;
    };
    if(changeB === "plus"){
      b = b + 2;
    } else if(changeB === "minus"){
      b = b - 2;
    };
    console.log(r,g,b)

    if(isDrawing){
      var point = {
        x : mouseX,
        y : mouseY
      };
      currentPath.push(point);
    }

    stroke(r,g,b);
    strokeWeight(2);
    noFill();
    for (var i = 0; i < drawing.length; i++){
      var path = drawing[i];
      beginShape();
      for (var j = 0; j < path.length; j++){
        vertex(path[j].x, path[j].y);
      }
      endShape();
    };
  
}

function saveDrawing(){
    var ref = database.ref("drawings");
    var data ={
        drawing : drawing,
        red : r,
        green : g,
        blue : b,
    }
    var result = ref.push(data , dataSent);
    console.log(result.key);
     
    function dataSent(err, status){
        console.log(status);
    }
}

function clearDrawing(){
  drawing = [];
}

function gotData(data){
    var elements = selectAll(".listing")
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
      
    }

    var drawings = data.val();
    var keys = Object.keys(drawings);
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        //console.log(key);
        var li = createElement('li', "");
        li.class("listing");
        var ahref = createA("#",key);
        ahref.mousePressed(showDrawing);
        ahref.parent(li);
        li.parent("drawinglist");
        
    }
}

function errData(err){
    console.log(err);
}

function showDrawing(){
    var key = this.html();
    //console.log(this.html());

    var ref = database.ref("drawings/" + key);
    ref.once("value", oneDrawing, errData);

    function oneDrawing(data){
      var dbDrawing = data.val();
      drawing = dbDrawing.drawing 
      console.log(drawing);
    }

}