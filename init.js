const container = document.getElementById("menuContainer");

const simultaneityBtn = document.createElement("BUTTON");
simultaneityBtn.innerHTML = "Simultaneity";
simultaneityBtn.onclick = function () {
	inScenario = true;
	scenario = new SimultaneityScenario();
	hideMenu();
	requestAnimationFrame(render);
};
container.appendChild(simultaneityBtn);

const timeDilatationBtn = document.createElement("BUTTON");
timeDilatationBtn.innerHTML = "Time dilatation";
timeDilatationBtn.onclick = function () {
	inScenario = true;
	scenario = new TimeDilatationScenario();
	hideMenu();
	requestAnimationFrame(render);
};
container.appendChild(timeDilatationBtn);

const lengthContractionBtn = document.createElement("BUTTON");
lengthContractionBtn.innerHTML = "Length contraction";
lengthContractionBtn.onclick = function () {
	inScenario = true;
	scenario = new LengthContractionScenario();
	hideMenu();
	requestAnimationFrame(render);
};
container.appendChild(lengthContractionBtn);

const terrellRotationBtn = document.createElement("BUTTON");
terrellRotationBtn.innerHTML = "Terrell rotation";
terrellRotationBtn.onclick = function () {
	inScenario = true;
	scenario = new TerrellRotationScenario();
	hideMenu();
	requestAnimationFrame(render);
};
container.appendChild(terrellRotationBtn);

const ladderParadoxBtn = document.createElement("BUTTON");
ladderParadoxBtn.innerHTML = "Ladder paradox";
ladderParadoxBtn.onclick = function () {
	inScenario = true;
	scenario = new LadderParadoxScenario();
	hideMenu();
	requestAnimationFrame(render);
};
container.appendChild(ladderParadoxBtn);

const twinParadoxBtn = document.createElement("BUTTON");
twinParadoxBtn.innerHTML = "Twin paradox";
twinParadoxBtn.onclick = function () {
	inScenario = true;
	scenario = new TwinParadoxScenario();
	hideMenu();
	requestAnimationFrame(render);
};
container.appendChild(twinParadoxBtn);

const gateBtn = document.createElement("BUTTON");
gateBtn.innerHTML = "Freemode";
gateBtn.onclick = function () {
	inFreemode = true;
	overlay.style.opacity = "1";
	new Gate();
	document.querySelector("#c").requestPointerLock();
	etherTime = 0;
	hideMenu();
	requestAnimationFrame(render);
};
container.appendChild(gateBtn);

const pauseOverlay = document.getElementById("pause");
pauseOverlay.style.opacity = "0";
const overlay = document.getElementById("overlay");
overlay.style.opacity = "0";

const subtitleBar1 = document.getElementById("subtitleBar1");
const subtitleBar2 = document.getElementById("subtitleBar2");
let subtitleContent = "";
let currentSubtitleBar = 1;

///////////////////////////////////////////////////////////////////
"use strict";
twgl.setDefaults({
	attribPrefix: "a_"
});
const m4 = twgl.m4;
const v3 = twgl.v3;

const canvas = document.getElementById("c");
const gl = document.getElementById("c").getContext("webgl2");

const program = twgl.createProgramFromScripts(gl, ["vs", "fs"]);

const up = [0, 1, 0];

const u_n = gl.getUniformLocation(program, "n");
const u_k = gl.getUniformLocation(program, "k");
const u_relPos = gl.getUniformLocation(program, "relPos");
const u_relVel = gl.getUniformLocation(program, "relVel");

const u_rotation = gl.getUniformLocation(program, "rotation");

const u_simulationType = gl.getUniformLocation(program, "simulationType");

const u_diffuseLoc = gl.getUniformLocation(program, "u_diffuse");
const u_worldLoc = gl.getUniformLocation(program, "u_world");
const u_worldInverseTransposeLoc = gl.getUniformLocation(program, "u_worldInverseTranspose");
const u_worldViewProjectionLoc = gl.getUniformLocation(program, "u_worldViewProjection");
const u_viewInverseLoc = gl.getUniformLocation(program, "u_viewInverse");

const positionLoc = gl.getAttribLocation(program, "a_position");
const normalLoc = gl.getAttribLocation(program, "a_normal");
const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");

const red = twgl.createTexture(gl, { src: 'assets/c_red.png' });
const green = twgl.createTexture(gl, { src: 'assets/c_green.png' });
const blue = twgl.createTexture(gl, { src: 'assets/c_blue.png' });
const white = twgl.createTexture(gl, { src: 'assets/c_white.png' });
const black = twgl.createTexture(gl, { src: 'assets/c_black.png' });
const gray = twgl.createTexture(gl, { src: 'assets/c_gray.png' });
const aqua = twgl.createTexture(gl, { src: 'assets/c_aqua.png' });
const yellow = twgl.createTexture(gl, { src: 'assets/c_yellow.png' });
const purple = twgl.createTexture(gl, { src: 'assets/c_purple.png' });
const sand = twgl.createTexture(gl, { src: 'assets/c_sand.png' });
const cinder = twgl.createTexture(gl, { src: 'assets/c_cinder.png' });
const sky = twgl.createTexture(gl, { src: 'assets/c_sky.png' });

const diceWhiteTex = twgl.createTexture(gl, { src: 'assets/diceWhite.jpg' });
const diceBlueTex = twgl.createTexture(gl, { src: 'assets/diceBlue.png' });
const check16Tex = twgl.createTexture(gl, { src: 'assets/check16.png' });
const check32Tex = twgl.createTexture(gl, { src: 'assets/check32.png' });
const check64Tex = twgl.createTexture(gl, { src: 'assets/check64.png' });

const earthTex = twgl.createTexture(gl, { src: 'assets/objects/earth/earth.png' });
const trainTex = twgl.createTexture(gl, { src: 'assets/objects/train/electrictrain.png', flipY: 1 });
const stationTex = twgl.createTexture(gl, { src: 'assets/objects/railway_station/railway_station.png', flipY: 1 });
const rocketTex = twgl.createTexture(gl, { src: 'assets/objects/rocket/rocket.jpg', flipY: 1 });
const barn_backTex = twgl.createTexture(gl, { src: 'assets/objects/barn/back.png' });

const planksTex = twgl.createTexture(gl, { src: 'assets/planks.jpg' });
const woodTex = twgl.createTexture(gl, { src: 'assets/wood.jpg' });
const barnTex = twgl.createTexture(gl, { src: 'assets/barn.jpg' });
const brickTex = twgl.createTexture(gl, { src: 'assets/brick.jpg' });
const clockTex = twgl.createTexture(gl, { src: 'assets/clock.jpg', flipY: 1, minLod:1,maxLod:1 });
const railTex = twgl.createTexture(gl, { src: 'assets/rail.png' });
const trainRoofTex = twgl.createTexture(gl, { src: 'assets/trainroof.png' });
const grassTex = twgl.createTexture(gl, { src: 'assets/grass.jpg' });
const rustTex = twgl.createTexture(gl, { src: 'assets/rust.jpg' });
const mirrorTex = twgl.createTexture(gl, { src: 'assets/mirror.png' });
const concreteTex = twgl.createTexture(gl, { src: 'assets/concrete.jpg' });
const shinglesTex = twgl.createTexture(gl, { src: 'assets/shingles.jpg' });
const roofing_metalTex = twgl.createTexture(gl, { src: 'assets/roofing_metal.jpg' });
const twin_diagramTex = twgl.createTexture(gl, { src: 'assets/twinDiagram.png', minLod:1,maxLod:1 });
const controlsTex = twgl.createTexture(gl, { src: 'assets/controls.png', minLod:1,maxLod:1 });

const gate_bronzeRoofTex = twgl.createTexture(gl, { src: 'assets/objects/gate/BronzeRoof1.jpg', flipY: 1 });
const gate_bronzeStatuesTex = twgl.createTexture(gl, { src: 'assets/objects/gate/BronzeStatues1.jpg', flipY: 1 });
const gate_columnsTex = twgl.createTexture(gl, { src: 'assets/objects/gate/Columns1.jpg', flipY: 1 });
const gate_darkerWallTex = twgl.createTexture(gl, { src: 'assets/objects/gate/DarkerWall1.jpg', flipY: 1 });
const gate_fregioTex = twgl.createTexture(gl, { src: 'assets/objects/gate/Fregio1.jpg', flipY: 1 });
const gate_marblecColumnsTex = twgl.createTexture(gl, { src: 'assets/objects/gate/MarbleColumns2.jpg', flipY: 1 });
const gate_sideGliphTex = twgl.createTexture(gl, { src: 'assets/objects/gate/SideGliph1.jpg', flipY: 1 });
const gate_templeFrontTex = twgl.createTexture(gl, { src: 'assets/objects/gate/TempleFront1.jpg', flipY: 1 });
const gate_wallTex = twgl.createTexture(gl, { src: 'assets/objects/gate/WhiteWall1.jpg', flipY: 1 });
const gate_sideBuildingTex = twgl.createTexture(gl, { src: 'assets/objects/gate/WindowsBuilding1.jpg', flipY: 1});

let pitch = 0;
let yaw = 0;

document.querySelector("#c").addEventListener("mousemove", e => {
	const mouseSensitivity = 0.003;
	yaw += e.movementX * mouseSensitivity;
	pitch -= e.movementY * mouseSensitivity;
});

document.addEventListener('pointerlockchange', (e) => {
	if (document.pointerLockElement == null) {
		showMenu();
	}
}, false);

let etherTime = 0;

let prevTime = 0;
let dt = 0;

let g;
let boost;

const keys = {};
window.onkeyup = function (e) { keys[e.keyCode] = false; }
window.onkeydown = function (e) {
	keys[e.keyCode] = true;

	if (inScenario) {
		if (e.keyCode == 37) {//left
			scenarioTime -= 5 * g;
			if (scenarioTime < 0)
				scenarioTime = 0;
		}
		else if (e.keyCode == 39) {//right
			scenarioTime += 5 * g;
		}
		else if (e.keyCode == 32) {//space
			if (paused) {
				paused = false;
				pauseOverlay.style.opacity = "0";
			}
			else {
				paused = true;
				pauseOverlay.style.opacity = "1";
			}
		}
		else if (e.keyCode == 27) {//esc
			showMenu();
		}
	}
	else if (inFreemode) {
		if (e.keyCode == 67) {//c
			if (constantSpeed)
				constantSpeed = false;
			else
				constantSpeed = true;
		}
		else if (e.keyCode == 69) {//e
			let light = new Cube([], yellow, 0.1, 0.1, 0.1);

			const vel = v3.add(camVel, v3.divScalar(camDir, g));
			v3.add(vel, v3.mulScalar(camVel, v3.dot(camDir, camVel) * g / (1 + g)), vel);
			v3.divScalar(vel, 1 + v3.dot(camDir, camVel), vel);

			const pos = [...camPos];
			const t0 = etherTime;

			light.pos = (t) => {
				return v3.add(pos, v3.mulScalar(vel, etherTime - t0));
			}
			light.vel = (t) => {
				return vel;
			};
		}
	}
}

let camPos = [0, 0, 0];
let camVisPos;
let camVel = [0, 0, 0];
let camDir = [];
let camRight;
let camFront;

let constantSpeed = false;

let scenario = null;
let scenarioTime;
let paused;

let inScenario = false;
let inFreemode = false;

let simulationType = 0;

const NONE = 0; //simple Galilean transformation
const PRESENT_HYPERSURFACE = 1; //objects are transformed to hypersurface of present with Lorentz transformation
const PAST_LIGHTCONE = 2; //lag in signals reaching the observer is considered
let transformation_method = PRESENT_HYPERSURFACE;
let sky_color = [0, 0, 0];

const PERSPECTIVE = 0;
const ORTOGRAPHIC = 1;
let projectionType = PERSPECTIVE;
let ortoFrustumSize = 1;

let scene;