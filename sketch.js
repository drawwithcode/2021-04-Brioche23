/*
Brioschi Alessio
Creative Coding 2021-22

Assignment_03
"Animated DOM:
Create dynamic and/or moving HTML elements,
modify them and use callbacks

Use at least one interaction from the last lesson"

Idea
Using buttons to create firework-like shapes
that appear when you clap your hands

MICROPHONE
Always on

MOUSE
left click on the button:   change the color of the background
*/

//  Each firework is made of buttons arranged in a spiral pattern
class Firework {
  constructor(_id, _offX, _offY, _increment, _angle, _scalar) {
    this.id = _id;
    //  Position of each button relative to the first one
    this.x = 0;
    this.y = 0;
    //  Position of the entire element in the window
    this.offX = _offX;
    this.offY = _offY;
    this.btns = [];
    this.number = random(80, 90); // Randomizing the number of buttons per firework
    this.increment = map(_increment, 2, 10, 0.5, 3); //  Remapping the increment to a more limited range
    this.angle = _angle; //  Angle of the spiral
    this.scalar = _scalar; //  How much the button are dispersed (high scalar = big hole in the center)
    //  Color is set in HSL mode so i can make the center brighter
    this.h = random(360);
    this.s = 100;
    this.l = 100;
    this.opacity = 1; //  Set the initial opacity
    this.dead = false; //  Sentinel
  }

  //  Create function
  create() {
    //  For to create the fireworkd
    for (let i = 0; i < this.number; i++) {
      //  Arranging the button in a spiral
      //  Code taken from here: https://editor.p5js.org/hyershin/sketches/SkG_S5K3W
      this.x = this.offX + cos(this.angle) * this.scalar;
      this.y = this.offY + sin(this.angle) * this.scalar;
      //  Adding button to the array, text in the button: its number in the cluster
      this.btns[i] = createButton(i);
      //  Setting the position of each button
      this.btns[i].position(this.x, this.y);

      //  Styling
      //  Button color
      this.btns[i].style(
        "background-color",
        "hsl(" + this.h + "," + this.s + "%," + (this.l - i) + "%)"
      );
      //  Code to make the text the same color as the bg
      // this.btns[i].style(
      //   "color",
      //   "hsl(" + this.h + "," + this.s + "%," + (this.l - i) + "%)"
      // );
      this.btns[i].style("border", "none"); //  No border
      this.btns[i].style("font-family", "courier"); //  Courier
      //  Random radius for the button corner roundess
      const radius = random(0, 100);
      this.btns[i].style("border-radius", radius + "%");
      this.btns[i].class("cl-" + this.id);

      //  Callback: when btn is pressed change the bg color
      this.btns[i].mousePressed(() => {
        changeBgColor(this.h, this.s);
      });
      //  Increment the scalar and the angle for the next button
      this.scalar += this.increment;
      this.angle += this.increment;
    }
  }

  // function to make the firework fade
  fade() {
    //  Gradually decrementing the opacity for each button
    this.btns.forEach((f) => {
      f.style("opacity", this.opacity);
      if (this.opacity >= -0.05) this.opacity -= 0.0001;
    });
    //  If the button is no longer visible set the firework as "dead"
    if (this.opacity < 0) this.dead = true;
  }

  //  Function to remove all the buttons of the element from the dom
  deleteBtns() {
    this.btns.forEach((b) => {
      b.remove();
    });
  }
}

//  Initializing variables
let body;
let frwrks = [];
let n = 0;
const angle = 10;
const scalar = 1;

let mic;

function setup() {
  noCanvas();
  //  Setting a lower framerate to get less audio samples from the mic
  frameRate(12);
  //  Setting up the microphone
  userStartAudio();
  mic = new p5.AudioIn();
  mic.start();

  //  Changing the background color
  body = select("body");
  body.style("background-color", "black");

  //  Main text
  let p = createP("If you are happy and you know it clap your hands!");
  let box = select("#box");
  //  the P element is parented to the box div, centered in the page (in css)
  p.parent(box);
  p.style("color", "white");
}

function draw() {
  //  If the mic is on (always)
  if (mic) {
    const micLevel = mic.getLevel();
    //  Mapping the input volume from 0 to 10
    const mappedLevel = map(micLevel, 0, 1, 0, 10);

    //  If the volume is > 2
    if (mappedLevel > 2) {
      //  Add a firework element in the array
      frwrks[n] = new Firework(
        n,
        random(windowWidth),
        random(windowHeight),
        mappedLevel, // The size of the firework is proportional to the loudness of the clap
        angle,
        scalar
      );
      //  Creating and displayng the element
      frwrks[n].create();
      n++;
    }
  }

  //  if the firework is completely faded, deleteBtns all the buttons and remove item from the array
  frwrks.forEach((f, index, array) => {
    f.fade(); // Fade the buttons each frame

    if (f.dead == true) {
      f.deleteBtns();
      array.splice(index, 1);
    }
  });
}

function changeBgColor(h, s) {
  //  Same Hue and Saturation but keep Lightness at 50%
  body.style("background-color", "hsl(" + h + "," + s + "%," + 50 + "%)");
}
