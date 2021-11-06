class Buttons {
  constructor(_offX, _offY, _speed) {
    this.x = 0;
    this.y = 0;
    this.offX = _offX;
    this.offY = _offY;
    this.btns = [];
    this.number = random(70, 90);
    this.angle = 10;
    this.scalar = 2;
    this.speed = map(_speed, 2, 10, 0.5, 3);
    this.color;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.opacity = 1;
    this.morto = false;
  }

  create() {
    let radius = random(0, 100);
    for (let i = 0; i < 90; i++) {
      this.x = this.offX + cos(this.angle) * this.scalar;
      this.y = this.offY + sin(this.angle) * this.scalar;
      this.btns[i] = createButton(round(this.speed));
      this.btns[i].position(this.x, this.y);
      this.btns[i].style(
        "background-color",
        "rgb(" + this.r + "," + this.g + "," + this.b + ")"
      );
      this.btns[i].style(
        "color",
        "rgb(" + this.r + "," + this.g + "," + this.b + ")"
      );
      this.btns[i].style("border", "none");

      this.btns[i].style("border-radius", radius + "%");

      this.btns[i].parent("box");
      this.btns[i].mousePressed(() => {
        changeBgColor(this.r, this.g, this.b);
      });
      this.scalar += this.speed;
      this.angle += this.speed;
    }
  }

  fade() {
    this.btns.forEach((b) => {
      b.style("opacity", this.opacity);
      if (this.opacity >= -0.05) this.opacity -= 0.0001;
      if (this.opacity < 0) this.morto = true;
    });
  }
}

let state = 0;

let body;
let btns = [];
let n = 0;
let angle = 10;
let offX = 1;
let offY = 1;
let scalar = 1;
const speed = 0.8;

let mic;

function setup() {
  noCanvas();
  frameRate(12);
  userStartAudio();
  mic = new p5.AudioIn();
  mic.start();

  offX = windowWidth / 2;
  offY = windowHeight / 2;

  body = select("body");
  body.style("background-color", "black");

  let p = createP("If you are happy and you know it clap your hands!");
  p.position(offX, offY);
}

// let opacity = 1;

function draw() {
  if (mic) {
    const micLevel = mic.getLevel();
    let mappedLevel = map(micLevel, 0, 1, 0, 10);

    if (mappedLevel > 2) {
      btns[n] = new Buttons(
        random(windowWidth),
        random(windowHeight),
        mappedLevel
      );
      btns[n].create();
      n++;
    }
  }
  btns.forEach((b, index, array) => {
    b.fade();
    if (b.morto == true) {
      console.log("Morto");
      array.splice(index, 1);
    }
  });
}

function changeBgColor(r, g, b) {
  body.style("background-color", "rgb(" + r + "," + g + "," + b + ")");
}
