var bodies = [];

class Body {
  constructor(x,y,z,col){
    this.pos = createVector(x,y,z);
    this.vel = createVector(0,0,0);
    this.col = col;
    this.faces = [];
    this.tFaces = [];
    bodies.push(this);
  }

  show() {
    buff.fill(this.col);
    for(let face of this.tFaces){
      buff.beginShape();
      for(let v of face){
        buff.vertex(v[0],v[1],v[2]);
      }
      buff.endShape();
    }
  }

  update() {
    this.tFaces = JSON.parse(JSON.stringify(this.faces));

    let relVel = p5.Vector.sub(this.vel, camVel);
    relVel.add( p5.Vector.cross( camVel, p5.Vector.cross(camVel, this.vel)).mult(g/(1+g)) );
    relVel.mult( 1/(1-camVel.dot(this.vel)) );

    var k;
    if(relVel.magSq()>0.999)
      k = 0;
    else 
      k = sqrt(1-relVel.magSq());
    var n = relVel.normalize();

    /////////////////////////////////////////////////////////////

    let t = (etherTime + camVel.dot(this.pos) - camVel.dot(camPos)) / (1 - camVel.dot(this.vel));
    let pos = this.pos.copy().add( this.vel.copy().mult(t) );
    pos.sub(camPos);
    t -= etherTime;
    let x = [t , pos.x, pos.y, pos.z];

    let v = multiplyMatrixAndPoint(boost, x);
    //print(v[0]);

    let relPos = createVector(v[1],v[2],v[3]);

    //print(relPos.copy().sub(debugPos).mag());
    //debugPos = relPos.copy();

    for(let i = 0; i < this.tFaces.length; i++){
      let face = this.tFaces[i];

      for(let j = 0; j < face.length; j++){
        let v = face[j];

        let locPos = createVector(v[0],v[1],v[2]);
        locPos.sub( n.copy().mult( (1 - k) * locPos.dot(n)));

        v[0] = locPos.x + relPos.x;
        v[1] = locPos.y + relPos.y;
        v[2] = locPos.z + relPos.z;        
      }
    }
  }
}

class Cube extends Body{
  constructor(x,y,z,sx,sy,sz,col){
    super(x,y,z,col);

    var zP = [ 
      [-0.5,-0.5,0.5],
      [-0.5,0.5,0.5],
      [0.5,0.5,0.5],
      [0.5,-0.5,0.5]
    ];
    this.faces.push(zP);

    var zN = [ 
      [-0.5,-0.5,-0.5],
      [-0.5,0.5,-0.5],
      [0.5,0.5,-0.5],
      [0.5,-0.5,-0.5]
    ];
    this.faces.push(zN);
 
    var xP = [ 
      [0.5,-0.5,-0.5],
      [0.5,-0.5,0.5],
      [0.5,0.5,0.5],
      [0.5,0.5,-0.5]
    ];
    this.faces.push(xP);

    var xN = [ 
      [-0.5,-0.5,0.5],
      [-0.5,0.5,0.5],
      [-0.5,0.5,-0.5],
      [-0.5,-0.5,-0.5]
    ];
    this.faces.push(xN);

    var yP = [ 
      [-0.5,0.5,0.5],
      [0.5,0.5,0.5],
      [0.5,0.5,-0.5],
      [-0.5,0.5,-0.5]
    ];
    this.faces.push(yP);

    var yN = [ 
      [-0.5,-0.5,0.5],
      [0.5,-0.5,0.5],
      [0.5,-0.5,-0.5],
      [-0.5,-0.5,-0.5]
    ];
    this.faces.push(yN);

    for(let face of this.faces){
      for(let v of face){
        v[0] *= sx;
        v[1] *= sy;
        v[2] *= sz;
      }
    }
  }
}

class Plane extends Body{
  constructor(x,y,z,r,col){
    super(x,y,z,col);
    var plane = [ 
      [-0.5,0,0.5],
      [-0.5,0,-0.5],
      [0.5,0,-0.5],
      [0.5,0,0.5]
    ];
    this.faces.push(plane);

    for(let face of this.faces){
      for(let v of face){
        v[0] *= r;
        v[1] *= r;
        v[2] *= r;
      }
    }
  }
}