function lightScenario(){
  let p1 = new Cube(0,0,0, 0.5,0.5,0.5,color(255));
  p1.vel.x = 1;

  let p2 = new Cube(0,0,0, 0.5,0.5,0.5,color(255));
  p2.vel.x = -1;
  
  let p3 = new Cube(0,0,0, 0.5,0.5,0.5,color(255));
  p3.vel.y = sqrt(2)/2;
  p3.vel.z = sqrt(2)/2;
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
  /*
  let la = new Cube(-5,0,-10,1,1,1,color(255));
  la.vel.z = 1;
  let lb = new Cube(0,0,-10,1,1,1,color(255));
  lb.vel.z = 1;
  let lc = new Cube(5,0,-10,1,1,1,color(255));
  lc.vel.z = 1;
  */
}