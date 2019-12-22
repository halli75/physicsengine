var bodies = [];

class Body {
  constructor(x,y,z,texture){
    this.pos = v3.create(x,y,z);
    this.vel = v3.create(0,0,0);

    this.vpositions = [];
    this.texcoords = [];
    this.indices = [];

    this.texture = texture;
		
    bodies.push(this);
  }

  createBuffers(){
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vpositions), gl.STATIC_DRAW);
    this.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.STATIC_DRAW);
    this.indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
  }
  
  loadModel(file, sx=1, sy=1, sz=1){
    
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);

    var self = this;
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                self.loadM(allText,sx,sy,sz);
                //console.log(allText);
            }
        }
    }
    rawFile.send(null);
    /*
    fetch(file)
      .then(response => response.text())
      .then(text => loadM(text))
      */
}

loadM(text, sx=1, sy=1, sz=1) {
	let mesh = new OBJ.Mesh(text);
	
	this.vpositions = mesh.vertices;
	this.indices = mesh.indices;
	this.texcoords = mesh.textures;

	for(let i=0; i < this.vpositions.length; ++i){
      if(i%3 == 0)
        this.vpositions[i] *= sx;
      else if(i%3 == 1)
        this.vpositions[i] *= sy;
      else 
        this.vpositions[i] *= sz;
  }
	return;
}

  show() {
    let relVel = v3.subtract( this.vel, camVel);
    relVel = v3.add( relVel, v3.mulScalar( v3.cross( camVel, v3.cross( camVel, this.vel)), g/(1+g)) );

    v3.mulScalar( 1/(1 - v3.dot( camVel, this.vel)));

    var k;
    if(v3.lengthSq(relVel)>0.999999)
      k = 0;
    else 
      k = Math.sqrt(1-v3.lengthSq(relVel));
    var n = v3.normalize(relVel);

    let t = (etherTime + v3.dot(camVel, this.pos) - v3.dot(camVel, camPos)) / (1 - v3.dot(camVel, this.vel));

    let pos = v3.add( this.pos, v3.mulScalar(this.vel, t));
    v3.subtract(pos, camPos, pos);
    t -= etherTime;

    let x = [t , pos[0], pos[1], pos[2]];
    let v = multiplyMatrixAndPoint(boost, x);
		if(simulationType == 0)
			v = [0, pos[0], pos[1], pos[2]];

    gl.uniform3f(u_n, n[0],n[1],n[2]);
    gl.uniform1f(u_k, k);
    gl.uniform3f(u_relPos, v[1],v[2],v[3]);
    gl.uniform3f(u_relVel, relVel[0],relVel[1],relVel[2]);
    
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texcoordLoc);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}

class Plane extends Body{
  constructor(x,y,z,texture,sx=1,sz=1,segX=1,segZ=1){
    super(x,y,z,texture);

    for(let zv = 0; zv < segZ + 1; zv++)
      for(let xv = 0; xv < segX + 1; xv++) {
        this.vpositions.push(xv/segX -0.5, 0, zv/segZ -0.5);
        this.texcoords.push(xv/segX, zv/segZ);
      }

    for(let xs = 0; xs < segX; xs++)
      for(let zs = 0; zs < segZ; zs++) {
        this.indices.push(xs+zs*(segX+1), xs+1+zs*(segX+1), xs+1+(zs+1)*(segX+1),
                          xs+zs*(segX+1), xs+1+(zs+1)*(segX+1), xs+(zs+1)*(segX+1)
        );
      }

    for(let i=0; i < this.vpositions.length; ++i){
      if(i%3 == 0)
        this.vpositions[i] *= sx;
      else if(i%3 == 2)
        this.vpositions[i] *= sz;
    }

    this.createBuffers();
  }
}

class Cube extends Body{
  constructor(x,y,z,texture,sx=1,sy=1,sz=1,segX=1,segY=1,segZ=1){
    super(x,y,z,texture);

    let voff = 0;

    for(let zv = 0; zv <= segZ; zv++)
      for(let yv = 0; yv <= segY; yv++) {
        this.vpositions.push(0.5, yv/segY -0.5, zv/segZ -0.5);
        this.texcoords.push(4/4 - yv/segY/4, 1/3 + zv/segZ/3);
      }
    for(let zs = 0; zs < segZ; zs++)
      for(let ys = 0; ys < segY; ys++) {
        this.indices.push(ys+zs*(segY+1), ys+1+zs*(segY+1), ys+1+(zs+1)*(segY+1),
                          ys+zs*(segY+1), ys+1+(zs+1)*(segY+1), ys+(zs+1)*(segY+1)
        );
      }
    voff = this.vpositions.length/3;
    
    for(let zv = 0; zv <= segZ; zv++)
      for(let yv = 0; yv <= segY; yv++) {
        this.vpositions.push(-0.5, yv/segY -0.5, zv/segZ -0.5);
        this.texcoords.push(1/4 + yv/segY/4, 1/3 + zv/segZ/3);
      }
    for(let zs = 0; zs < segZ; zs++)
      for(let ys = 0; ys < segY; ys++) {
        this.indices.push(voff + ys+zs*(segY+1),voff + ys+1+zs*(segY+1),voff + ys+1+(zs+1)*(segY+1),
                          voff + ys+zs*(segY+1),voff + ys+1+(zs+1)*(segY+1),voff + ys+(zs+1)*(segY+1)
        );
      }
    voff = this.vpositions.length/3;

    for(let zv = 0; zv <= segZ; zv++)
      for(let xv = 0; xv <= segX; xv++) {
        this.vpositions.push(xv/segX -0.5, 0.5, zv/segZ -0.5);
        this.texcoords.push(2/4 + xv/segX/4, 1/3 + zv/segZ/3);
      }
    for(let xs = 0; xs < segX; xs++)
      for(let zs = 0; zs < segZ; zs++) {
        this.indices.push(voff + xs+zs*(segX+1),voff + xs+1+zs*(segX+1),voff + xs+1+(zs+1)*(segX+1),
                          voff + xs+zs*(segX+1),voff + xs+1+(zs+1)*(segX+1),voff + xs+(zs+1)*(segX+1)
        );
      }
    voff = this.vpositions.length/3;

    for(let zv = 0; zv <= segZ; zv++)
      for(let xv = 0; xv <= segX; xv++) {
        this.vpositions.push(xv/segX -0.5, -0.5, zv/segZ -0.5);
        this.texcoords.push(1/4 - xv/segX/4, 1/3 + zv/segZ/3);
      }
    for(let xs = 0; xs < segX; xs++)
      for(let zs = 0; zs < segZ; zs++) {
        this.indices.push(voff + xs+zs*(segX+1),voff + xs+1+zs*(segX+1),voff + xs+1+(zs+1)*(segX+1),
                          voff + xs+zs*(segX+1),voff + xs+1+(zs+1)*(segX+1),voff + xs+(zs+1)*(segX+1)
        );
    }
    voff = this.vpositions.length/3;

    for(let yv = 0; yv <= segY; yv++)
      for(let xv = 0; xv <= segX; xv++) {
        this.vpositions.push(xv/segX -0.5, yv/segY -0.5, 0.5);
        this.texcoords.push(2/4 + xv/segX/4, 3/3 - yv/segY/3);
      } 
    for(let ys = 0; ys < segY; ys++)
      for(let xs = 0; xs < segX; xs++) {
        this.indices.push(voff + xs+ys*(segX+1),voff + xs+1+ys*(segX+1),voff + xs+1+(ys+1)*(segX+1),
                          voff + xs+ys*(segX+1),voff + xs+1+(ys+1)*(segX+1),voff + xs+(ys+1)*(segX+1)
        );
    }
    voff = this.vpositions.length/3;

    for(let yv = 0; yv <= segY; yv++)
      for(let xv = 0; xv <= segX; xv++) {
        this.vpositions.push(xv/segX -0.5, yv/segY -0.5, -0.5);
        this.texcoords.push(2/4 + xv/segX/4, 0/3 + yv/segY/3);
      }
    for(let ys = 0; ys < segY; ys++)
      for(let xs = 0; xs < segX; xs++) {
        this.indices.push(voff + xs+ys*(segX+1),voff + xs+1+ys*(segX+1),voff + xs+1+(ys+1)*(segX+1),
                          voff + xs+ys*(segX+1),voff + xs+1+(ys+1)*(segX+1),voff + xs+(ys+1)*(segX+1)
        );
      }
    
    for(let i=0; i < this.vpositions.length; ++i){
      if(i%3 == 0)
        this.vpositions[i] *= sx;
      else if(i%3 == 1)
        this.vpositions[i] *= sy;
      else 
        this.vpositions[i] *= sz;
    }

    this.createBuffers();
  }
}