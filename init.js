const container = document.getElementById("menuContainer");

let title = document.createElement("P");
title.innerHTML = "Relativity simulation";    
title.id = "title";
container.appendChild(title);  

var lengthContractionBtn = document.createElement("BUTTON"); 
lengthContractionBtn.innerHTML = "Length contraction";
lengthContractionBtn.onclick = function(){
	inScenario = true;
	scenario = new LengthContractionScenario();
	etherTime = 0;
	hideMenu();
	requestAnimationFrame(render);
};                 
container.appendChild(lengthContractionBtn);

var simultaneityBtn = document.createElement("BUTTON"); 
simultaneityBtn.innerHTML = "Simultaneity";
simultaneityBtn.onclick = function(){
	inScenario = true;
	scenario = new SimultaneityScenario();
	etherTime = 0;
	hideMenu();
	requestAnimationFrame(render);
};                 
container.appendChild(simultaneityBtn);

var terrellRotationBtn = document.createElement("BUTTON"); 
terrellRotationBtn.innerHTML = "Terrell rotation";
terrellRotationBtn.onclick = function(){
	inScenario = true;
	scenario = new TerrellRotationScenario();
	etherTime = 0;
	hideMenu();
	requestAnimationFrame(render);
};              
container.appendChild(terrellRotationBtn);  

var gateBtn = document.createElement("BUTTON"); 
gateBtn.innerHTML = "gate";
gateBtn.onclick = function(){
	inFreemode = true;
	new Gate();
	etherTime = 0;
	hideMenu();
	requestAnimationFrame(render);
};              
container.appendChild(gateBtn);  


var subtitle = document.createElement("P");
subtitle.innerHTML = "";    
subtitle.id = "subtitle";
document.getElementById("subtitleContainer").appendChild(subtitle);
//container.appendChild(subtitle);
///////////////////////////////////////////////////////////////////
"use strict";
twgl.setDefaults({
	attribPrefix: "a_"
});
const m4 = twgl.m4;
const v3 = twgl.v3;
//const gl = document.querySelector("#c").getContext("webgl");
const gl = document.getElementById("c").getContext("webgl");

var textCanvas = document.getElementById("text");
var ctx = textCanvas.getContext("2d");

const program = twgl.createProgramFromScripts(gl, ["vs", "fs"]);

const up = [0, 1, 0];

const u_n = gl.getUniformLocation(program, "n");
const u_k = gl.getUniformLocation(program, "k");
const u_relPos = gl.getUniformLocation(program, "relPos");
const u_relVel = gl.getUniformLocation(program, "relVel");

const u_simulationType = gl.getUniformLocation(program, "simulationType");

const u_diffuseLoc = gl.getUniformLocation(program, "u_diffuse");
const u_worldLoc = gl.getUniformLocation(program, "u_world");
const u_worldInverseTransposeLoc = gl.getUniformLocation(program, "u_worldInverseTranspose");
const u_worldViewProjectionLoc = gl.getUniformLocation(program, "u_worldViewProjection");
const u_viewInverseLoc = gl.getUniformLocation(program, "u_viewInverse");

const positionLoc = gl.getAttribLocation(program, "a_position");
const normalLoc = gl.getAttribLocation(program, "a_normal");
const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");

const red = twgl.createTexture(gl, {src: 'assets/c_red.png'}); 
const green = twgl.createTexture(gl, {src: 'assets/c_green.png'}); 
const blue = twgl.createTexture(gl, {src: 'assets/c_blue.png'}); 
const white = twgl.createTexture(gl, {src: 'assets/c_white.png'}); 
const gray = twgl.createTexture(gl, {src: 'assets/c_gray.png'}); 
const aqua = twgl.createTexture(gl, {src: 'assets/c_aqua.png'}); 
const yellow = twgl.createTexture(gl, {src: 'assets/c_yellow.png'}); 
const purple = twgl.createTexture(gl, {src: 'assets/c_purple.png'}); 
const sand = twgl.createTexture(gl, {src: 'assets/c_sand.png'}); 
const cinder = twgl.createTexture(gl, {src: 'assets/c_cinder.png'}); 

const diceWhiteTex = twgl.createTexture(gl, {src: 'assets/diceWhite.jpg'}); 
const diceBlueTex = twgl.createTexture(gl, {src: 'assets/diceBlue.png'});
const check16Tex = twgl.createTexture(gl, {src: 'assets/check16.png'});
const check32Tex = twgl.createTexture(gl, {src: 'assets/check32.png'});  
const check64Tex = twgl.createTexture(gl, {src: 'assets/check64.png'});

const testTex = twgl.createTexture(gl, {src: 'assets/test.jpg'}); 
const trainTex = twgl.createTexture(gl, {src: 'assets/electrictrain.png', flipY:1}); 
const houseTex = twgl.createTexture(gl, {src: 'assets/smallhouse.jpg', flipY:1}); 
const housemedievalTex = twgl.createTexture(gl, {src: 'assets/objects/housemedieval.jpg', flipY:1}); 
const grassTex = twgl.createTexture(gl, {src: 'assets/grass.jpg'}); 

var pitch = 0;
var yaw = 0;

document.querySelector("#c").addEventListener("mousemove", e => {
    const mouseSensitivity = 0.003;
    yaw += e.movementX * mouseSensitivity;
    pitch -= e.movementY * mouseSensitivity;
});

document.querySelector("#text").addEventListener("mousedown", e => {
    document.querySelector("#c").requestPointerLock();
});

var etherTime = 0;

var prevTime = 0;
var dt = 0;

var g;
var boost;

var keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { 
  keys[e.keyCode] = true;

  if(e.keyCode == 67) {//c
    if(constantSpeed) 
      constantSpeed = false;
    else 
      constantSpeed = true;   
  } 
  else if(e.keyCode == 69){//e
    let light = new Cube(camPos[0],camPos[1],camPos[2],yellow,0.1,0.1,0.1);
    light.vel = v3.add( camVel, v3.divScalar(camDir,g) );
    v3.add(light.vel, v3.mulScalar( camVel, v3.dot(camDir,camVel)*g/(1+g) ), light.vel);
    v3.divScalar(light.vel, 1+v3.dot(camDir,camVel), light.vel);
    v3.subtract( light.pos, v3.mulScalar(light.vel, etherTime), light.pos);
  }
	else if(e.keyCode == 82){//r
		etherTime = 0;
	}
	else if(e.keyCode == 88){//x
		showMenu();
	}
}

var camPos = v3.create(3,0,0);
var camVel = v3.create(0,0,0);
var camDir = v3.create(1,0,0);
var camRight;
var camFront;

var constantSpeed = false;
var scenario = null;
var inScenario = false;
var inFreemode = false;

var simulationType = 0;

var scene;

//let s = new Gate();

