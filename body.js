var bodies = [];

class Body {
  constructor(x,y,z,surface){
    this.pos = createVector(x,y,z);
    this.vel = createVector(0,0,0);
    this.vertices = [];
    this.tVertices = [];
    this.faces = [];

    this.colored = false;
    
    if(surface instanceof p5.Color){
      this.colored = true;
      this.color = surface;
    }
    else{
      this.textures = surface;
      this.facesUV = [];
    }

    bodies.push(this);
  }

  show() {
    if(this.colored) {
      buff.fill(this.color);

      for(let face of this.faces) {
        buff.beginShape();

        for(let i of face) {
          let v = this.tVertices[i];
          buff.vertex(v.x,v.y,v.z);
        }
        buff.endShape(CLOSE);
      }
    }
    else{
      
      let faceIx = 0;
      for(let face of this.faces) {

        buff.texture(this.textures[faceIx]);
        buff.beginShape();

        let faceUV = this.facesUV[faceIx];

        let i = 0;
        for(let vertIx of face) {
          let v = this.tVertices[vertIx];
          buff.vertex(v.x,v.y,v.z, faceUV[i][0], faceUV[i][1]);
          i++;
        }
        buff.endShape(CLOSE);

        faceIx++;
      }
    }
  }

  update() {
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

    let relPos = createVector(v[1],v[2],v[3]);

    for(let i = 0; i < this.vertices.length; i++) {
      let locPos = this.vertices[i].copy();
      locPos.sub( n.copy().mult( (1 - k) * locPos.dot(n)));
      this.tVertices[i] = locPos.add( relPos); 
    }
  }
}

class Cube extends Body{
  constructor(x,y,z,sx,sy,sz,sur){
    if(Array.isArray(sur) || sur instanceof p5.Color)
      super(x,y,z,sur);
    else
      super(x,y,z,[sur,sur,sur,sur,sur,sur]);

    this.vertices.push(createVector(-0.5,0.5,-0.5));
    this.vertices.push(createVector(-0.5,0.5,0.5));
    this.vertices.push(createVector(0.5,0.5,0.5));
    this.vertices.push(createVector(0.5,0.5,-0.5));

    this.vertices.push(createVector(-0.5,-0.5,-0.5));
    this.vertices.push(createVector(-0.5,-0.5,0.5));
    this.vertices.push(createVector(0.5,-0.5,0.5));
    this.vertices.push(createVector(0.5,-0.5,-0.5));

    var zP = [2,6,5,1];
    this.faces.push(zP);

    var zN = [0,4,7,3];
    this.faces.push(zN);
 
    var xP = [3,7,6,2];
    this.faces.push(xP);

    var xN = [1,5,4,0];
    this.faces.push(xN);

    var yP = [0,1,2,3];
    this.faces.push(yP);

    var yN = [4,5,6,7];
    this.faces.push(yN);

    for(let v of this.vertices){
      v.x *= sx;
      v.y *= sy;
      v.z *= sz;
    }

    if(!this.colored){
      const texFace = [
        [0,0],
        [1,0],
        [1,1],
        [0,1]
      ];

      for(let i = 0; i < 6; i++) {
        this.facesUV.push( JSON.parse(JSON.stringify(texFace)) );
      }
    }

  }
}

class Plane extends Body{
  constructor(x,y,z,sx,sz,sur){
    if(Array.isArray(sur) || sur instanceof p5.Color)
      super(x,y,z,sur);
    else
      super(x,y,z,[sur]);

    this.vertices.push(createVector(-0.5,0,-0.5));
    this.vertices.push(createVector(-0.5,0,0.5));
    this.vertices.push(createVector(0.5,0,0.5));
    this.vertices.push(createVector(0.5,0,-0.5));

    this.faces.push([0,1,2,3]);

    for(let v of this.vertices){
      v.x *= sx;
      v.z *= sz;
    }

    if(!this.colored){
      const texFace = [
        [0,0],
        [1,0],
        [1,1],
        [0,1]
      ];
      this.facesUV.push( texFace);
    }

  }
}