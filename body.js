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

        let faceUV = this.facesUV[faceIx];

        buff.texture(this.textures[faceUV[0]]);
        buff.beginShape();

        let i = 1;
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

  applyGalilean() {
    let relPos = this.pos.copy().add( this.vel.copy().mult(etherTime)).sub(camPos);
    for(let i = 0; i < this.vertices.length; i++) {
      let locPos = this.vertices[i].copy();
      locPos.add( relPos);
        
      this.tVertices[i] = locPos;
    }
  }

  applyLorentz() {
    let relVel = p5.Vector.sub(this.vel, camVel);
    relVel.add( p5.Vector.cross( camVel, p5.Vector.cross(camVel, this.vel)).mult(g/(1+g)) );
    relVel.mult( 1/(1-camVel.dot(this.vel)) );

    var k;
    if(relVel.magSq()>0.999999)
      k = 0;
    else 
      k = sqrt(1-relVel.magSq());
    var n = relVel.copy().normalize();

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
      locPos.add( relPos);
        
      this.tVertices[i] = locPos;
    }
  }
  
  applyLorentzAndTerrell() {
    let relVel = p5.Vector.sub(this.vel, camVel);
    relVel.add( p5.Vector.cross( camVel, p5.Vector.cross(camVel, this.vel)).mult(g/(1+g)) );
    relVel.mult( 1/(1-camVel.dot(this.vel)) );

    var k;
    if(relVel.magSq()>0.99)
      k = 0;
    else 
      k = sqrt(1-relVel.magSq());
    var n = relVel.copy().normalize();

    /////////////////////////////////////////////////////////////

    let t = (etherTime + camVel.dot(this.pos) - camVel.dot(camPos)) / (1 - camVel.dot(this.vel));
    let pos = this.pos.copy().add( this.vel.copy().mult(t) );
    pos.sub(camPos);
    t -= etherTime;
    let x = [t , pos.x, pos.y, pos.z];

    let v = multiplyMatrixAndPoint(boost, x);

    let relPos = createVector(v[1],v[2],v[3]);

    if(relVel.magSq() < 0.999999) {
      for(let i = 0; i < this.vertices.length; i++) {
        let locPos = this.vertices[i].copy();
        locPos.sub( n.copy().mult( (1 - k) * locPos.dot(n)));
        locPos.add( relPos);
        
        let td = -sqrt(4*locPos.dot(relVel)*locPos.dot(relVel)-4*locPos.magSq()*(relVel.magSq()-1) ) +2*locPos.dot(relVel);
        td /= 2*(relVel.magSq()-1);
        locPos.sub(relVel.copy().mult(td));
        
        this.tVertices[i] = locPos;
      }
    }
    else{
      if(relPos.dot(relVel) > 0){
        for(let i = 0; i < this.vertices.length; i++) {
          let locPos = this.vertices[i].copy();
          locPos.sub( n.copy().mult( (1 - k) * locPos.dot(n)));
          locPos.add( relPos);
          
          let td = locPos.magSq()/2/locPos.dot(relVel);
          locPos.sub(relVel.copy().mult(td));
          
          this.tVertices[i] = locPos;
        }
      }
      else{
        for(let i = 0; i < this.vertices.length; i++) {
          this.tVertices[i] = createVector(0,0,0);
        }
      }
    }
  }
}

class Plane extends Body{
  constructor(x,y,z,sx,sz,sur,segX=1,segZ=1){
    if(Array.isArray(sur) || sur instanceof p5.Color)
      super(x,y,z,sur);
    else
      super(x,y,z,[sur]);

    if(segX < 0) {
      let density = -segX;
      segX = sx * density;
      segZ = sz * density;   
    }

    for(let xv = 0; xv < segX + 1; xv++)
      for(let zv = 0; zv < segZ + 1; zv++)
        this.vertices.push(createVector(xv/segX -0.5, 0, zv/segZ -0.5));

    for(let xs = 0; xs < segX; xs++)
      for(let zs = 0; zs < segZ; zs++) {
        this.faces.push([zs+xs*(segZ+1), zs+1+xs*(segZ+1), zs+1+(xs+1)*(segZ+1), zs+(xs+1)*(segZ+1)]);

        if(!this.colored)
          this.facesUV.push([ 0, [xs/segX, zs/segZ], [(xs+1)/segX, zs/segZ], [(xs+1)/segX, (zs+1)/segZ], [xs/segX, (zs+1)/segZ] ]);
      }

    for(let v of this.vertices){
      v.x *= sx;
      v.z *= sz;
    }

  }
}

class Cube extends Body{
  constructor(x,y,z,sx,sy,sz,sur,segX=1,segY=1,segZ=1){
    if(Array.isArray(sur) || sur instanceof p5.Color)
      super(x,y,z,sur);
    else
      super(x,y,z,[sur,sur,sur,sur,sur,sur]);

    if(segX < 0) {
      let density = -segX;
      segX = sx * density;
      segY = sy * density;
      segZ = sz * density;   
    }

    let vertexMap = new Map();

    let self = this;

    function vIx(x,y,z) { //vertex index
      let s = JSON.stringify([x,y,z]);

      if(vertexMap.has(s)) {
        return vertexMap.get(s);
      }
      else {
        vertexMap.set(s,vertexMap.size);
        self.vertices.push(createVector(x,y,z));
      }
      return vertexMap.size - 1;
    }

    for(let x = 0; x < segX; x++) 
      for(let y = 0; y < segY; y++) {
        this.faces.push( [ vIx(x/segX,y/segY,0), vIx(x/segX,(y+1)/segY,0), vIx((x+1)/segX,(y+1)/segY,0), vIx((x+1)/segX,y/segY,0)] );
        this.faces.push( [ vIx(x/segX,y/segY,1), vIx(x/segX,(y+1)/segY,1), vIx((x+1)/segX,(y+1)/segY,1), vIx((x+1)/segX,y/segY,1)] );

        if(!this.colored) {
          this.facesUV.push( [0, [x/segX,y/segY], [x/segX,(y+1)/segY], [(x+1)/segX,(y+1)/segY], [(x+1)/segX,y/segY] ] );
          this.facesUV.push( [1, [x/segX,y/segY], [x/segX,(y+1)/segY], [(x+1)/segX,(y+1)/segY], [(x+1)/segX,y/segY] ] );
        }
      } 
    
    for(let x = 0; x < segX; x++) 
      for(let z = 0; z < segZ; z++) {
        this.faces.push( [ vIx(x/segX,0,z/segZ), vIx((x+1)/segX,0,z/segZ), vIx((x+1)/segX,0,(z+1)/segZ), vIx(x/segX,0,(z+1)/segZ)] );
        this.faces.push( [ vIx(x/segX,1,z/segZ), vIx((x+1)/segX,1,z/segZ), vIx((x+1)/segX,1,(z+1)/segZ), vIx(x/segX,1,(z+1)/segZ)] );

        if(!this.colored) {
          this.facesUV.push( [2, [x/segX,z/segZ], [(x+1)/segX,z/segZ], [(x+1)/segX,(z+1)/segZ], [x/segX,(z+1)/segZ] ] );
          this.facesUV.push( [3, [x/segX,z/segZ], [(x+1)/segX,z/segZ], [(x+1)/segX,(z+1)/segZ], [x/segX,(z+1)/segZ] ] );
        }
      } 
    
    for(let y = 0; y < segY; y++) 
      for(let z = 0; z < segZ; z++) {
        this.faces.push( [ vIx(0,y/segY,z/segZ), vIx(0,(y+1)/segY,z/segZ), vIx(0,(y+1)/segY,(z+1)/segZ), vIx(0,y/segY,(z+1)/segZ)] );
        this.faces.push( [ vIx(1,y/segY,z/segZ), vIx(1,(y+1)/segY,z/segZ), vIx(1,(y+1)/segY,(z+1)/segZ), vIx(1,y/segY,(z+1)/segZ)] );

        if(!this.colored) {
          this.facesUV.push( [4, [y/segY,z/segZ], [(y+1)/segY,z/segZ], [(y+1)/segY,(z+1)/segZ], [y/segY,(z+1)/segZ] ] );
          this.facesUV.push( [5, [y/segY,z/segZ], [(y+1)/segY,z/segZ], [(y+1)/segY,(z+1)/segZ], [y/segY,(z+1)/segZ] ] );
        }
      } 

    for(let v of this.vertices){
      v.x -= 0.5;
      v.y -= 0.5;
      v.z -= 0.5;
      v.x *= sx;
      v.y *= sy;
      v.z *= sz;
    }

  }
}