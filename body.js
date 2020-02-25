var bodies = [];

class Body {
	constructor(pos, texture) {
		this.pos = (t) => { return pos; };
		this.vel = (t) => { return [0, 0, 0]; };
		this.rotation = (t) => { return m4.identity(); };

		this.vpositions = [];
		this.texcoords = [];
		this.indices = [];

		this.texture = texture;

		bodies.push(this);
	}

	createBuffers() {
		this.clearBuffers();

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

	clearBuffers() {
		if (this.positionBuffer == null) return;

		gl.deleteBuffer(this.positionBuffer);
		gl.deleteBuffer(this.texcoordBuffer);
		gl.deleteBuffer(this.indicesBuffer);
	}

	show() {
		//numerical method
		let pt = 0;

		if (transformation_method == PAST_LIGHTCONE) {
			for (let i = 0; i < 20; ++i) {
				let dis = v3.length(v3.subtract(this.pos(etherTime + pt), camPos)) + pt;
				pt -= 0.75 * dis;
			}
		}
		else {
			for (let i = 0; i < 20; ++i) {
				let tp = pt - v3.dot(camVel, v3.subtract(this.pos(etherTime + pt), camPos));
				pt -= tp;
			}
		}

		let vel = this.vel(etherTime + pt);
		//let pos = v3.subtract( this.pos(etherTime + pt), camPos);
		let pos = v3.subtract(this.pos(etherTime + pt), camVisPos);

		let x = [pt, pos[0], pos[1], pos[2]];
		let v = multiplyMatrixAndPoint(boost, x);
		if (simulationType == 0)
			v = [0, pos[0], pos[1], pos[2]];

		//contraction
		let relVel = v3.subtract(vel, camVel);
		relVel = v3.add(relVel, v3.mulScalar(v3.cross(camVel, v3.cross(camVel, vel)), g / (1 + g)));

		relVel = v3.mulScalar(relVel, 1 / (1 - v3.dot(camVel, vel)));

		var k;
		if (v3.lengthSq(relVel) > 0.999999)
			k = 0;
		else
			k = Math.sqrt(1 - v3.lengthSq(relVel));
		var n = v3.normalize(relVel);

		gl.uniform3f(u_n, n[0], n[1], n[2]);
		gl.uniform1f(u_k, k);
		gl.uniform3f(u_relPos, v[1], v[2], v[3]);
		gl.uniform3f(u_relVel, relVel[0], relVel[1], relVel[2]);

		gl.uniformMatrix4fv(u_rotation, false, this.rotation(etherTime + pt));

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

	loadModel(file, sx = 1, sy = 1, sz = 1) {

		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);

		var self = this;
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 200 || rawFile.status == 0) {
					var allText = rawFile.responseText;
					self.loadModel2(allText, sx, sy, sz);
				}
			}
		}
		rawFile.send(null);
	}

	loadModel2(text, sx = 1, sy = 1, sz = 1) {
		let mesh = new OBJ.Mesh(text);

		this.vpositions = mesh.vertices;
		this.indices = mesh.indices;
		this.texcoords = mesh.textures;

		for (let i = 0; i < this.vpositions.length; ++i) {
			if (i % 3 == 0)
				this.vpositions[i] *= sx;
			else if (i % 3 == 1)
				this.vpositions[i] *= sy;
			else
				this.vpositions[i] *= sz;
		}
		return;
	}
}

class Plane extends Body {
	constructor(pos, texture, sx = 1, sz = 1, segX = 1, segZ = 1, tx = 1, tz = 1) {
		super(pos, texture);

		for (let zv = 0; zv < segZ + 1; zv++)
			for (let xv = 0; xv < segX + 1; xv++) {
				this.vpositions.push(xv / segX - 0.5, 0, zv / segZ - 0.5);
				this.texcoords.push(tx * xv / segX, tz * zv / segZ);
			}

		for (let xs = 0; xs < segX; xs++)
			for (let zs = 0; zs < segZ; zs++) {
				this.indices.push(xs + zs * (segX + 1), xs + 1 + zs * (segX + 1), xs + 1 + (zs + 1) * (segX + 1),
					xs + zs * (segX + 1), xs + 1 + (zs + 1) * (segX + 1), xs + (zs + 1) * (segX + 1)
				);
			}

		for (let i = 0; i < this.vpositions.length; ++i) {
			if (i % 3 == 0)
				this.vpositions[i] *= sx;
			else if (i % 3 == 2)
				this.vpositions[i] *= sz;
		}

		this.createBuffers();
	}
}

class Cube extends Body {
	constructor(pos, texture, sx = 1, sy = 1, sz = 1, segX = 1, segY = 1, segZ = 1) {
		super(pos, texture);

		let voff = 0;

		for (let zv = 0; zv <= segZ; zv++)
			for (let yv = 0; yv <= segY; yv++) {
				this.vpositions.push(0.5, yv / segY - 0.5, zv / segZ - 0.5);
				this.texcoords.push(4 / 4 - yv / segY / 4, 1 / 3 + zv / segZ / 3);
			}
		for (let zs = 0; zs < segZ; zs++)
			for (let ys = 0; ys < segY; ys++) {
				this.indices.push(ys + zs * (segY + 1), ys + 1 + zs * (segY + 1), ys + 1 + (zs + 1) * (segY + 1),
					ys + zs * (segY + 1), ys + 1 + (zs + 1) * (segY + 1), ys + (zs + 1) * (segY + 1)
				);
			}
		voff = this.vpositions.length / 3;

		for (let zv = 0; zv <= segZ; zv++)
			for (let yv = 0; yv <= segY; yv++) {
				this.vpositions.push(-0.5, yv / segY - 0.5, zv / segZ - 0.5);
				this.texcoords.push(1 / 4 + yv / segY / 4, 1 / 3 + zv / segZ / 3);
			}
		for (let zs = 0; zs < segZ; zs++)
			for (let ys = 0; ys < segY; ys++) {
				this.indices.push(voff + ys + zs * (segY + 1), voff + ys + 1 + zs * (segY + 1), voff + ys + 1 + (zs + 1) * (segY + 1),
					voff + ys + zs * (segY + 1), voff + ys + 1 + (zs + 1) * (segY + 1), voff + ys + (zs + 1) * (segY + 1)
				);
			}
		voff = this.vpositions.length / 3;

		for (let zv = 0; zv <= segZ; zv++)
			for (let xv = 0; xv <= segX; xv++) {
				this.vpositions.push(xv / segX - 0.5, 0.5, zv / segZ - 0.5);
				this.texcoords.push(2 / 4 + xv / segX / 4, 1 / 3 + zv / segZ / 3);
			}
		for (let xs = 0; xs < segX; xs++)
			for (let zs = 0; zs < segZ; zs++) {
				this.indices.push(voff + xs + zs * (segX + 1), voff + xs + 1 + zs * (segX + 1), voff + xs + 1 + (zs + 1) * (segX + 1),
					voff + xs + zs * (segX + 1), voff + xs + 1 + (zs + 1) * (segX + 1), voff + xs + (zs + 1) * (segX + 1)
				);
			}
		voff = this.vpositions.length / 3;

		for (let zv = 0; zv <= segZ; zv++)
			for (let xv = 0; xv <= segX; xv++) {
				this.vpositions.push(xv / segX - 0.5, -0.5, zv / segZ - 0.5);
				this.texcoords.push(1 / 4 - xv / segX / 4, 1 / 3 + zv / segZ / 3);
			}
		for (let xs = 0; xs < segX; xs++)
			for (let zs = 0; zs < segZ; zs++) {
				this.indices.push(voff + xs + zs * (segX + 1), voff + xs + 1 + zs * (segX + 1), voff + xs + 1 + (zs + 1) * (segX + 1),
					voff + xs + zs * (segX + 1), voff + xs + 1 + (zs + 1) * (segX + 1), voff + xs + (zs + 1) * (segX + 1)
				);
			}
		voff = this.vpositions.length / 3;

		for (let yv = 0; yv <= segY; yv++)
			for (let xv = 0; xv <= segX; xv++) {
				this.vpositions.push(xv / segX - 0.5, yv / segY - 0.5, 0.5);
				this.texcoords.push(2 / 4 + xv / segX / 4, 3 / 3 - yv / segY / 3);
			}
		for (let ys = 0; ys < segY; ys++)
			for (let xs = 0; xs < segX; xs++) {
				this.indices.push(voff + xs + ys * (segX + 1), voff + xs + 1 + ys * (segX + 1), voff + xs + 1 + (ys + 1) * (segX + 1),
					voff + xs + ys * (segX + 1), voff + xs + 1 + (ys + 1) * (segX + 1), voff + xs + (ys + 1) * (segX + 1)
				);
			}
		voff = this.vpositions.length / 3;

		for (let yv = 0; yv <= segY; yv++)
			for (let xv = 0; xv <= segX; xv++) {
				this.vpositions.push(xv / segX - 0.5, yv / segY - 0.5, -0.5);
				this.texcoords.push(2 / 4 + xv / segX / 4, 0 / 3 + yv / segY / 3);
			}
		for (let ys = 0; ys < segY; ys++)
			for (let xs = 0; xs < segX; xs++) {
				this.indices.push(voff + xs + ys * (segX + 1), voff + xs + 1 + ys * (segX + 1), voff + xs + 1 + (ys + 1) * (segX + 1),
					voff + xs + ys * (segX + 1), voff + xs + 1 + (ys + 1) * (segX + 1), voff + xs + (ys + 1) * (segX + 1)
				);
			}

		for (let i = 0; i < this.vpositions.length; ++i) {
			if (i % 3 == 0)
				this.vpositions[i] *= sx;
			else if (i % 3 == 1)
				this.vpositions[i] *= sy;
			else
				this.vpositions[i] *= sz;
		}

		this.createBuffers();
	}
}

function multiplyMatrixAndPoint(matrix, point) {

	//Give a simple variable name to each part of the matrix, a column and row number
	var c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
	var c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
	var c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
	var c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

	//Now set some simple names for the point
	var x = point[0];
	var y = point[1];
	var z = point[2];
	var w = point[3];

	//Multiply the point against each part of the 1st column, then add together
	var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

	//Multiply the point against each part of the 2nd column, then add together
	var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

	//Multiply the point against each part of the 3rd column, then add together
	var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

	//Multiply the point against each part of the 4th column, then add together
	var resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

	return [resultX, resultY, resultZ, resultW];
}