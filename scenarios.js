class LengthContractionScenario {
  constructor(){
		simulationType = 1;
		let h = new Body(4,1.5,0,housemedievalTex);
		h.loadModel('assets/objects/housemedieval.obj', 0.2,0.2,0.2);
		h.createBuffers();

		camPos = [0,1,0];

		let c1 = new Body(2,0,-10,trainTex);
		c1.loadModel('assets/train.obj', 0.15,0.15,0.15);
		c1.vel = [0,0,0.9];
		c1.createBuffers();


		let w1 = new Cube(2,10,3,red,3,3,0.1);
		w1.vel = [0,-0.9,0];

		let w2 = new Cube(2,10,-4,red,3,3,0.1);
		w2.vel = [0,-0.9,0];

    new Plane(0.5,0,0.5,grassTex,32,32,32,32);

		const t1 = 10.5;
		const t2 = 11.5;

		scene = 1;

    this.pos = (t) => {
			if(scene == 1)
				return [-3,2,0];
			return [-3, 2, -10 + 0.9*t];

      if(t < t1)
        return [-3,2,0];
      else if (t < t2)
        return [-3,2, 0.9*(t-t1)**2 /2];
      else if (t < 25)
        return [-3,2, 0.9*(t2-t1)/2 + (t-t2)*0.9];

			showMenu();
      return[0,0,0];
    };

    this.vel = (t) => {
			if(t>15) {
				scene = 2;
				etherTime = 0;
			}
			if(scene == 1)
				return [0,0,0];
			return[0,0,0.9];

      if(t < t1)
        return [0,0,0];
      else if (t < t2)
        return [0,0, (t-t1)*0.9];
      else if (t < 25)
        return [0,0, 0.9];

      return[0,0,0];
    };

		this.dir = (t) => {
			return [1,0,0];
		}

		this.text = (t) => {
      return "Length contraction is the phenomenon that a moving object's length is measured to be shorter than its proper length, which is the length as measured in the object's own rest frame.[1]";
    };
  }
}

class SimultaneityScenario{
  constructor(){
		simulationType = 1;
		
		new Cube(0,0,0,gray,100,0.1,0.1);
		new Cube(0,0,5,gray,100,0.1,0.1);
		new Cube(0,0,-5,gray,100,0.1,0.1);
		
		new Cube(0,0,0,gray,0.1,0.1,100);
		new Cube(-5,0,0,gray,0.1,0.1,100);
		new Cube(5,0,0,gray,0.1,0.1,100);

		let a = new Cube(-5,0,0,red,1,1,1);
		let b = new Cube(0,0,0,green,1,1,1);
		let c = new Cube(5,0,0,blue,1,1,1);

		let line = new Cube(0,0,0,white,100,0.1,0.1);
		line.vel[2] = 0.9999;

		let line2 = new Cube(0,0,0,green,1,1,100);
		line2.vel[2] = 0.9999;

		//new Cube(0,0,0,white,100,0.1,0.1);
		//new Cube(0,0,5*Math.sqrt(2),white,100,0.1,0.1);
		//new Cube(0,0,-5*Math.sqrt(2),white,100,0.1,0.1);



		var t1 = 5;
		var t2 = 6;

		//var v = -0.5/Math.sqrt(2);
		//var v = -0.5;
		var v = 0.5;
		var vo = 0.5;

		this.pos = (t) => {
			return [0,10,t];
			return[0,10,0];
      if(t < t1)
        return [0,10,0];
      else if (t < t2)
        return [v*(t-t1)**2 /2, 10,0];
      else if (t < 150)
        return [v*(t2-t1)/2 + (t-t2)*v, 10,0];

			showMenu();
      return[0,0,0];
    };

    this.vel = (t) => {
			return [-0.3,0,0];

			/*
			if(t < t1)
        return [0,0,1/Math.sqrt(2)];
      else if (t < t2)
        return [(t-t1)*v, 0,1/Math.sqrt(2)];
      else if (t < 150)
        return [v, 0,1/Math.sqrt(2)];
			*/
			
      if(t < t1)
        return [0,0,0];
      else if (t < t2)
        return [(t-t1)*v, 0,0];
      else if (t < 150)
        return [v, 0,0];
			
      return[0,0,0];
    };

		this.dir = (t) => {
			return [0,-1,0.01];
		}

		this.text = (t) => {
      return "In physics, the relativity of simultaneity is the concept that distant simultaneity – whether two spatially separated events occur at the same time – is not absolute, but depends on the observer's reference frame.";
    };
	}
}

class TerrellRotationScenario{
	constructor(){
		simulationType = 2;
		yaw = 0.4;
		
		for(let x = -18; x < 0; x += 3){
			new Cube(x,1,0, diceBlueTex, 1,1,1, 8,8,8);
		}

		for(let x = -18; x < 0; x += 3){
			let c = new Cube(x,-1,0, diceBlueTex, 1,1,1, 8,8,8);
			c.vel[0] = -0.9;
		}

		this.pos = (t) => {
			if(t < 10)
      	return[-20,0,-4];

			showMenu();
			return[0,0,0];
    };

    this.vel = (t) => {
      return[0,0,0];
    };

		this.dir = (t) => {
			return [1,0,0.3];
		}

		this.text = (t) => {
      return "Terrell rotation or Terrell effect is the visual distortion that a passing object would appear to undergo, according to the special theory of relativity if it were travelling a significant fraction of the speed of light.";
    };
	}
}

class Gate{
	constructor(){
		let c1 = new Body(2,0,0,check64Tex);
		c1.loadModel('assets/BrandenburgGate.obj', 0.15,0.15,0.15);
		c1.createBuffers();
	}
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



function cubeScenario(){
  camPos = [-15,0,0];
  yaw = 0;
  //let d = 5;
  let d = 4;
  let l1 = 9;
  let l2 = 7;

  new Cube(0,-d,-d,gray, l1,1,1,l1,1,1);
  new Cube(0,-d,d,gray, l1,1,1,l1,1,1);
  new Cube(0,d,-d,gray, l1,1,1,l1,1,1);
  new Cube(0,d,d,gray, l1,1,1,l1,1,1);
  
  new Cube(-d,0,-d,gray, 1,l2,1,1,l2,1);
  new Cube(-d,0,d,gray, 1,l2,1,1,l2,1);
  new Cube(d,0,-d,gray, 1,l2,1,1,l2,1);
  new Cube(d,0,d,gray, 1,l2,1,1,l2,1);

  new Cube(-d,-d,0,gray, 1,1,l2,1,1,l2);
  new Cube(-d,d,0,gray, 1,1,l2,1,1,l2);
  new Cube(d,-d,0,gray, 1,1,l2,1,1,l2);
  new Cube(d,d,0,gray, 1,1,l2,1,1,l2);
}

function gateScenario(d=1){
  camPos = [0,2,-16];
  yaw = 1.57;

  new Plane(0.5,0,0.5,check32Tex,32,32,32,32);
  new Cube(-2,3,0,sand, 1,6,3,1,6,3);
  new Cube(2,3,0,sand, 1,6,3,1,6,3);

  new Cube(-5,3,0,sand, 1,6,3,1,6,3);
  new Cube(5,3,0,sand, 1,6,3,1,6,3);

  new Cube(-8,3,0,sand, 1,6,3,1,6,3);
  new Cube(8,3,0,sand, 1,6,3,1,6,3);

  new Cube(0,6.5,0,sand, 17,1,3,16,1,1);
  new Cube(0,7,0,sand, 18,0.5,4,18,1,1);
  new Cube(0,8,0,sand, 17,1.5,2,16,1,1);
  new Cube(0,8.1,0,sand, 5,1.7,4,3,1,1);
  new Cube(0,10,0,cinder, 3,2,2,3,2,1);
}