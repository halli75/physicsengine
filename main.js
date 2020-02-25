function render(time) {
	dt = time - prevTime;
	dt /= 1000;
	prevTime = time;
	if (dt > 0.1) dt = 0;

	if (inScenario) {
		camPos = scenario.pos(etherTime);
		camVisPos = scenario.visPos(etherTime);
		camVel = scenario.vel(etherTime);
		camDir = scenario.dir(etherTime);

		if (subtitleContent.localeCompare(scenario.text(etherTime)) != 0) {
			subtitleContent = scenario.text(etherTime);

			if (currentSubtitleBar == 1) {
				subtitleBar2.innerHTML = subtitleContent;
				const f = () => {
					currentSubtitleBar = 2;
					subtitleBar1.style.opacity = "0";
					subtitleBar2.style.opacity = "1";
				}
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, subtitleBar2], f);
			}
			else {
				subtitleBar1.innerHTML = subtitleContent;
				const f = () => {
					currentSubtitleBar = 1;
					subtitleBar1.style.opacity = "1";
					subtitleBar2.style.opacity = "0";
				}
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, subtitleBar1], f);
			}
		}
		scenario.event(etherTime);
	}
	else if (inFreemode) {
		if (pitch > Math.PI / 2)
			pitch = 1.57;
		if (pitch < -Math.PI / 2)
			pitch = -1.57;

		camDir[0] = Math.cos(pitch) * Math.cos(yaw);
		camDir[1] = Math.sin(pitch);
		camDir[2] = Math.cos(pitch) * Math.sin(yaw);

		camRight = v3.cross(camDir, up);
		v3.normalize(camRight, camRight);
		camFront = v3.cross(up, camRight);

		var fi = 0;
		var si = 0;
		var vi = 0;

		if (keys[87]) fi += 1;
		if (keys[83]) fi -= 1;
		if (keys[68]) si += 1;
		if (keys[65]) si -= 1;
		if (keys[32]) vi += 1;
		if (keys[16]) vi -= 1;

		var dv = v3.create(0, 0, 0);
		v3.add(dv, v3.mulScalar(camFront, fi), dv);
		v3.add(dv, v3.mulScalar(camRight, si), dv);
		v3.add(dv, v3.mulScalar(up, vi), dv);

		if (!constantSpeed) {
			v3.mulScalar(camVel, 0.95, camVel);
			v3.normalize(dv, dv);
			v3.mulScalar(dv, 0.0498, dv);
		}
		else {
			v3.mulScalar(dv, (0.9999 - v3.length(camVel)) / 100, dv);
		}
		v3.add(camVel, dv, camVel);
	}
	time *= 0.001;


	twgl.resizeCanvasToDisplaySize(gl.canvas);
	twgl.resizeCanvasToDisplaySize(ctx.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(sky_color[0], sky_color[1], sky_color[2], 1);

	let projection;
	if (projectionType == PERSPECTIVE)
		projection = m4.perspective(90 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 1000);
	else {
		const sc = ortoFrustumSize / canvas.clientHeight;
		projection = m4.ortho(-canvas.clientWidth * sc, canvas.clientWidth * sc, -canvas.clientHeight * sc, canvas.clientHeight * sc, 0.001, 1000);
	}

	const camera = m4.lookAt([0, 0, 0], camDir, up);

	const view = m4.inverse(camera);
	const viewProjection = m4.multiply(projection, view);
	var world = m4.rotationY(0);

	gl.useProgram(program);

	const b = v3.length(camVel);
	var n;
	g = 1 / Math.sqrt(1 - b * b);
	if (b == 0)
		n = [0, 0, 0];
	else
		n = v3.normalize(camVel);

	const det = g * dt;
	etherTime += det;

	var ds = v3.mulScalar(camVel, det);

	if (!inScenario) {
		v3.add(camPos, ds, camPos);
		camVisPos = camPos;
	}
	boost = [
		g, -g * b * n[0], -g * b * n[1], -g * b * n[2],
		-g * b * n[0], 1 + (g - 1) * n[0] * n[0], (g - 1) * n[0] * n[1], (g - 1) * n[0] * n[2],
		-g * b * n[1], (g - 1) * n[1] * n[0], 1 + (g - 1) * n[1] * n[1], (g - 1) * n[1] * n[2],
		-g * b * n[2], (g - 1) * n[2] * n[0], (g - 1) * n[2] * n[1], 1 + (g - 1) * n[2] * n[2]
	];

	gl.uniform1i(u_diffuseLoc, 0);
	gl.uniformMatrix4fv(u_viewInverseLoc, false, camera);
	gl.uniformMatrix4fv(u_worldLoc, false, world);
	gl.uniformMatrix4fv(u_worldInverseTransposeLoc, false, m4.transpose(m4.inverse(world)));
	gl.uniformMatrix4fv(u_worldViewProjectionLoc, false, m4.multiply(viewProjection, world));

	gl.uniform1i(u_simulationType, simulationType);

	for (let b of bodies) b.show();

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.font = "14px Arial";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;
	ctx.textAlign = "left";

	drawText("Position: " + camPos[0].toFixed(2) + "  " + camPos[1].toFixed(2) + "  " + camPos[2].toFixed(2), 10, 20);
	drawText("Velocity: " + b.toFixed(5), 10, 40);
	drawText("Time: " + etherTime.toFixed(2), 10, 60);

	if (constantSpeed)
		drawText("Constant speed ", 10, 80);

	if (inScenario || inFreemode)
		requestAnimationFrame(render);
}

function drawText(text, x, y) {
	ctx.strokeText(text, x, y);
	ctx.fillText(text, x, y);
}

function hideMenu() {
	container.style.display = "none";
	subtitleContent = "";
}

function showMenu() {
	container.style.display = "inline";
	subtitleBar1.innerHTML = "";
	subtitleBar2.innerHTML = "";
	subtitleContent = "";

	inScenario = false;
	inFreemode = false;

	for (let b of bodies) {
		b.clearBuffers();
	}
	bodies = [];

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(0, 0, 0, 1);
}


