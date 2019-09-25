function gateScenario(){
  camPos = createVector(0,-1,-20);
  yaw = HALF_PI;

  new Plane(0.5,0,0.5,64,64,check64Tex);
  new Cube(-2,-3,0, 1,6,3,color(234,213,158));
  new Cube(2,-3,0, 1,6,3,color(234,213,158));

  new Cube(-5,-3,0, 1,6,3,color(234,213,158));
  new Cube(5,-3,0, 1,6,3,color(234,213,158));

  new Cube(-8,-3,0, 1,6,3,color(234,213,158));
  new Cube(8,-3,0, 1,6,3,color(234,213,158));

  new Cube(0,-6.5,0, 17,1,3,color(234,213,158));
  new Cube(0,-7,0, 18,0.5,4,color(234,213,158));
  new Cube(0,-8,0, 17,1.5,2,color(234,213,158));
  new Cube(0,-8.1,0, 5,1.7,4,color(234,213,158));
  new Cube(0,-10,0, 3,2,2,color(103,150,138));
}

function defaultScenario(){
  let mc = new Cube(0,1,0, 1,1,1,color(255));

  let mc2 = new Cube(5,1,0, 1,1,1,color(155));
  
  let slow = new Cube(0,0,0, 0.5,0.5,0.5,color(55,0,0));
  slow.vel.x = 0.0001;
  let mid = new Cube(0,0,0, 0.5,0.5,0.5,color(155,0,0));
  mid.vel.x = 0.5;
  let fast = new Cube(0,0,0, 0.5,0.5,0.5,color(255,0,0));
  fast.vel.x = 1;
}

function simultaneityScenario(){
  
  new Cube(0,0,0,100,0.1,0.1,color(50));
  new Cube(0,0,5,100,0.1,0.1,color(50));
  new Cube(0,0,-5,100,0.1,0.1,color(50));

  new Cube(0,0,0,0.1,0.1,100,color(50));
  new Cube(-5,0,0,0.1,0.1,100,color(50));
  new Cube(5,0,0,0.1,0.1,100,color(50));

  let a = new Cube(-5,0,0,1,1,1,color(255,0,0));
  let b = new Cube(0,0,0,1,1,1,color(0,255,0));
  let c = new Cube(5,0,0,1,1,1,color(0,0,255));
  

  let line = new Cube(0,0,-10,100,0.1,0.1,color(255));
  line.vel.z = 1;

  camPos = createVector(0,-5,0);
}