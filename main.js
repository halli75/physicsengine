//gateScenario();
//var myplane = new Plane(0,-1,0,check16Tex,1,1, 1,1);
//var myBody =  new Body(0,0,0,testTex);
//myBody.loadModel('assets/BrandenburgGate.obj');
//myBody.loadModel('assets/dog.obj');
//myBody.createBuffers();
function render(time) {
	if(etherTime == 0){
		prevTime = time - 1;
	}
  dt = time - prevTime;
  dt /= 1000;
  prevTime = time;

	if(inScenario) {
		camPos = scenario.pos(etherTime);
		camVel = scenario.vel(etherTime);	
		camDir = scenario.dir(etherTime);
		subtitle.innerHTML = scenario.text(etherTime);
	}
	else if(inFreemode) {
		if(pitch > Math.PI/2)
			pitch = 1.57;
		if(pitch < -Math.PI/2)
			pitch = -1.57;

		camDir[0] = Math.cos(pitch) * Math.cos(yaw);
		camDir[1] = Math.sin(pitch);
		camDir[2] = Math.cos(pitch) * Math.sin(yaw);
		
		camRight = v3.cross(camDir,up);
		v3.normalize(camRight, camRight);
		camFront = v3.cross(up,camRight);

		var fi = 0;
		var si = 0;
		var vi = 0;
		
		if (keys[87]) fi += 1;
		if (keys[83]) fi -= 1;
		if (keys[68]) si += 1;
		if (keys[65]) si -= 1;
		if (keys[32]) vi += 1;
		if (keys[16]) vi -= 1;

		var dv = v3.create(0,0,0);
		v3.add(dv,v3.mulScalar(camFront,fi), dv);
		v3.add(dv,v3.mulScalar(camRight,si), dv);
		v3.add(dv,v3.mulScalar(up,vi), dv);

		if(!constantSpeed) {
			v3.mulScalar(camVel, 0.95,camVel);
			v3.normalize(dv,dv);
			v3.mulScalar(dv,0.0498,dv); 
		}
		else{
			v3.mulScalar(dv, (0.9999 - v3.length(camVel))/100, dv);
		}
		v3.add(camVel,dv, camVel);
  }
  time *= 0.001;

	
	twgl.resizeCanvasToDisplaySize(gl.canvas);
  twgl.resizeCanvasToDisplaySize(ctx.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(0,0,0,1);

	const projection = m4.perspective(90 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 1000);

  var target = v3.add(camPos,camDir);

	//const camera = m4.lookAt(camPos, target, up);
  const camera = m4.lookAt([0,0,0], camDir, up);

	const view = m4.inverse(camera);
	const viewProjection = m4.multiply(projection, view);
	//const world = m4.rotationY(time);
  var world = m4.rotationY(0);

	gl.useProgram(program);


  const b = v3.length(camVel);
  var n;
  g = 1 / Math.sqrt(1 - b*b);
  if(b == 0)
    n = [0,0,0];
  else
    n = v3.normalize(camVel);

  const det= g * dt;
  etherTime += det;

  var ds = v3.mulScalar(camVel,det);

	if(!inScenario)
  	v3.add(camPos,ds, camPos);

  boost =  [
    g, -g*b*n[0], -g*b*n[1], -g*b*n[2],
    -g*b*n[0], 1+(g-1)*n[0]*n[0], (g-1)*n[0]*n[1], (g-1)*n[0]*n[2],
    -g*b*n[1], (g-1)*n[1]*n[0], 1+(g-1)*n[1]*n[1], (g-1)*n[1]*n[2],
    -g*b*n[2], (g-1)*n[2]*n[0], (g-1)*n[2]*n[1], 1+(g-1)*n[2]*n[2]
  ];

	gl.uniform1i(u_diffuseLoc, 0);
	gl.uniformMatrix4fv(u_viewInverseLoc, false, camera);
	gl.uniformMatrix4fv(u_worldLoc, false, world);
	gl.uniformMatrix4fv(u_worldInverseTransposeLoc, false, m4.transpose(m4.inverse(world)));
	gl.uniformMatrix4fv(u_worldViewProjectionLoc, false, m4.multiply(viewProjection, world));

	gl.uniform1i(u_simulationType, simulationType);

  for(let b of bodies) b.show();
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "14px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.textAlign = "left"; 

  drawText("Position: " +camPos[0].toFixed(2) + "  " +camPos[1].toFixed(2)+"  "+camPos[2].toFixed(2) , 10, 20);
  drawText("Velocity: " +b.toFixed(5), 10, 40);
  drawText("Time: " +etherTime.toFixed(2), 10, 60);

  if(constantSpeed) 
    drawText("Constant speed ", 10, 80);

	if(inScenario || inFreemode)
		requestAnimationFrame(render);
}

function drawText(text,x,y) {
  ctx.strokeText(text ,x,y);
  ctx.fillText(text, x,y);
}

function hideMenu(){
	container.style.display = "none";
}

function showMenu(){
	container.style.display = "inline";
	subtitle.innerHTML = "";
	scenario.text = (t) => {return ""};
	inScenario = false;
	bodies = [];
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(0,0,0,1);
}


