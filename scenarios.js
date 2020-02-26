class SimultaneityScenario {
	constructor() {
		simulationType = 1;
		scene = 1;

		transformation_method = PRESENT_HYPERSURFACE;
		projectionType = ORTOGRAPHIC;
		ortoFrustumSize = 5;

		sky_color = [0.73, 0.835, 1];

		camPos = [0, 1, 0];

		const vel = 0.5;

		const grass = new Plane([0, -0.6, 0], grassTex, 256, 128, 1, 1, 32, 16);
		const rail = new Plane([0, -0.599, 0], railTex, 256, 2.5, 1, 1, 32, 1);

		const station = new Body([1, -0.5, 3], stationTex);
		station.loadModel('assets/objects/railway_station/railway_station.obj', 0.4, 0.4, 0.4);
		station.createBuffers();
		station.rotation = (t) => {
			return m4.rotationY(Math.PI / 2);
		}

		const train = new Body([], trainTex);
		train.loadModel('assets/objects/train/train.obj', 0.2, 0.2, 0.2);
		train.createBuffers();
		train.vel = (t) => {
			return [vel, 0, 0];
		}
		train.pos = (t) => {
			return [vel * t, -0.6, 0];
		}
		train.rotation = (t) => {
			return m4.rotationY(Math.PI / 2);
		}

		const z = 1;
		const s = 0.15;
		const light1 = new Body([], yellow);
		light1.loadModel('assets/objects/sphere.obj', s, s, s);
		light1.createBuffers();
		light1.pos = (t) => {
			if (t > 0)
				return [-t, 0.2, z];
			return [0, -10, 0];
		};

		const light2 = new Body([], yellow);
		light2.loadModel('assets/objects/sphere.obj', s, s, s);
		light2.createBuffers();
		light2.pos = (t) => {
			if (t > 0)
				return [t, 0.2, z];
			return [0, -10, 0];
		};

		this.pos = (t) => {
			const camZ = 14;

			if (scene == 1) {
				if (t < -30)
					return [-15, 4.5, camZ];
				return [vel * (t), 4.5, camZ];
			}

			return [0, 4.5, camZ];
		};

		this.visPos = this.pos;

		this.vel = (t) => {
			if (scene == 1) {
				return [vel, 0, 0];
			}
			return [0, 0, 0];
		};

		this.timeline = (t) => {
			if (t < 90) {
				scene = 1;
				etherTime = t - 80; // -80 -> 10
			}
			else if (t < 140) {
				scene = 2;
				etherTime = t - 120; // -30 -> 20
			}
			else
				showMenu();
		}

		this.text = (t) => {
			if (scene == 1) {
				if (t < -79) return "";
				if (t < -63)
					return "In physics, the relativity of simultaneity is the concept that distant simultaneity – whether two spatially separated events occur at the same time – is not absolute, but depends on the observer's reference frame.";
				else if (t < -62) return "";
				else if (t < -30)
					return "According to Einstein's special theory of relativity, it is impossible to say in an absolute sense that two distinct events occur at the same time if those events are separated in space. If one reference frame assigns precisely the same time to two events that are at different points in space, a reference frame that is moving relative to the first will generally assign different times to the two events (the only exception being when motion is exactly perpendicular to the line connecting the locations of both events).";
				else if (t < -25)
					return "";
				else if (t < 10)
					return "A flash of light is given off at the center of the traincar just as the two observers pass each other. For the observer on board the train, the front and back of the traincar are at fixed distances from the light source and as such, according to this observer, the light will reach the front and back of the traincar at the same time.";
			}
			if (t < -28) return "";
			else if (t < 15)
				return "For the observer standing on the platform, on the other hand, the rear of the traincar is moving (catching up) toward the point at which the flash was given off, and the front of the traincar is moving away from it. As the speed of light is finite and the same in all directions for all observers, the light headed for the back of the train will have less distance to cover than the light headed for the front. Thus, the flashes of light will strike the ends of the traincar at different times."
			return "";
		};

		this.dir = (t) => {
			if (scene == 1)
				return v3.subtract(train.pos(t), this.pos(t));

			return [0, -0.4, -1];
		}
	}
}

class TimeDilatationScenario {
	constructor() {
		simulationType = 1;
		scene = 1;

		transformation_method = PRESENT_HYPERSURFACE;
		projectionType = ORTOGRAPHIC;
		ortoFrustumSize = 12;

		sky_color = [0.73, 0.835, 1];

		camPos = [0, 1, 0];

		const vel = 0.9;
		const d = 6;

		const grass = new Plane([], grassTex, 1024, 256, 1, 1, 32, 8);
		grass.vel = (t) => {
			return [-vel, 0, 0];
		}
		grass.pos = (t) => {
			return [-vel * t, -3.6, 0];
		}
		const rail = new Plane([0, -2.599, 0], railTex, 1024, 20, 1, 1, 32, 1);
		rail.vel = grass.vel;
		rail.pos = (t) => {
			return v3.add(grass.pos(t), [0, 0.01, 0]);
		};
		const floor = new Plane([0, 0, 0], trainRoofTex, 40, 10, 1, 1);
		const car = new Cube([0, -0.51, 0], trainRoofTex, 40, 1, 10, 1, 1, 1);

		const wheel1 = new Body([10, -2.25, 3], rustTex);
		wheel1.loadModel("assets/objects/cylinder.obj", 2.5, 1, 2.5);
		wheel1.createBuffers();
		wheel1.rotation = (t) => {
			return m4.rotationX(Math.PI / 2);
		}

		const wheel2 = new Body([10, -2.25, -3], rustTex);
		wheel2.loadModel("assets/objects/cylinder.obj", 2.5, 1, 2.5);
		wheel2.createBuffers();
		wheel2.rotation = wheel1.rotation;

		const mirror = new Cube([0, 1.5, -3.2], mirrorTex, 12, 3, 0.3);

		const light = new Body([], yellow);
		light.loadModel('assets/objects/sphere.obj', 0.35, 0.35, 0.35);
		light.createBuffers();
		light.pos = (t) => {
			if (t < 0)
				return [0, 0.2, 2];
			else if (t < 5)
				return [0, 0.2, -t + 2];
			else if (t < 10)
				return [0, 0.2, t - 8];
			return [0, 0.2, 2];
		};

		const flashlight = new Body([0, 0.2, 4.2], black);
		flashlight.loadModel('assets/objects/flashlight.obj', 0.018, 0.018, 0.018);
		for (let i = 0; i < flashlight.vpositions.length; ++i) {
			if (i % 3 == 1)
				flashlight.vpositions[i] -= 4.55;
		};
		flashlight.createBuffers();
		flashlight.rotation = (t) => {
			return m4.rotationY(-Math.PI / 2);
		}

		const face1 = new Body([-4, 0.1, 2], clockTex);
		face1.loadModel('assets/objects/circle.obj', 6, 6, 6);
		face1.createBuffers();
		face1.rotation = (t) => {
			return m4.rotationX(-Math.PI / 2);
		};

		const hand1 = new Cube([-3, 2.1, 3], black, 0.05, 2, 0.01, 1, 1, 1);
		hand1.rotation = (t) => {
			return m4.rotateZ(m4.rotationX(-Math.PI / 2), -Math.PI / 30 * t);
		};
		for (let i = 0; i < hand1.vpositions.length; ++i) {
			if (i % 3 == 1)
				hand1.vpositions[i] += 1;
		};
		hand1.createBuffers();
		hand1.pos = (t) => {
			return v3.add(face1.pos(t), [0, 0.01, 0]);
		}

		const face2 = new Body([-4, 2, 2], clockTex);
		face2.loadModel('assets/objects/circle.obj', 6, 6, 6);
		face2.createBuffers();
		face2.rotation = (t) => {
			return m4.rotationX(-Math.PI / 2);
		};
		face2.vel = grass.vel;
		face2.pos = (t) => {
			return [-vel * (t - d), 0.1, 9];
		}

		const hand2 = new Cube([-3, 2.1, 3], black, 0.05, 2, 0.01, 1, 1, 1);
		hand2.rotation = (t) => {
			return m4.rotateZ(m4.rotationX(-Math.PI / 2), -Math.PI / 30 * (t + 25) * Math.sqrt(1 - vel ** 2));
		};
		for (let i = 0; i < hand2.vpositions.length; ++i) {
			if (i % 3 == 1)
				hand2.vpositions[i] += 1;
		};
		hand2.createBuffers();
		hand2.vel = grass.vel;
		hand2.pos = (t) => {
			return v3.add(face2.pos(t), [0, 0.01, 0]);
		}

		this.pos = (t) => {
			if (scene == 1) {
				if (t < -6)
					return [-vel * (t + 6), 10, 6];
				return [0, 10, 6];
			}

			return [-vel * (t - d), 10, 6];
		};

		this.visPos = this.pos;

		this.vel = (t) => {
			if (scene == 1)
				return [0, 0, 0];
			return [-vel, 0, 0];
		};

		this.dir = (t) => {
			if (scene == 1) {
				if (t < -7)
					return v3.subtract(floor.pos(t), this.pos(t));
				else if (t < -5)
					return v3.subtract(v3.add(floor.pos(t), [0, 0, 5.9 * (t + 7) / 2]), this.pos(t));
			}
			return [0, -1, -0.01];
		}

		this.timeline = (t) => {
			if (t < 87) {
				scene = 1;
				etherTime = t - 72; // -72 -> 15
			}
			else if (t < 302) {
				scene = 2;
				etherTime = t - 177; // -90 -> 125
			}
			else
				showMenu();
		}

		this.text = (t) => {
			if (scene == 1) {
				if (t < -70) return "";
				else if (t < -50)
					return "Special relativity indicates that, for an observer in an inertial frame of reference, a clock that is moving relative to him will be measured to tick slower than a clock that is at rest in his frame of reference. This case is sometimes called special relativistic time dilation.";
				else if (t < -48) return "";
				else if (t < -24)
					return "Time dilation can be inferred from the observed constancy of the speed of light in all reference frames dictated by the second postulate of special relativity. This constancy of the speed of light means that, counter to intuition, speeds of material objects and light are not additive. It is not possible to make the speed of light appear greater by moving towards or away from the light source.";
				else if (t < -22) return "";
				else if (t < 13)
					return "Consider then, a simple clock consisting of two mirrors A and B, between which a light pulse is bouncing. The separation of the mirrors is $L$ and the clock ticks once each time the light pulse hits either of the mirrors. In the frame in which the clock is at rest, the light pulse traces out a path of length $2L$ and the period of the clock is $2L$ divided by the speed of light: $\\Delta t = \\frac{2L}{c}$";
				return "";
			}

			if (t < -85) return "";
			else if (t < 30)
				return "From the frame of reference of a moving observer traveling at the speed v relative to the resting frame of the clock, the light pulse is seen as tracing out a longer, angled path. Keeping the speed of light constant for all inertial observers, requires a lengthening of the period of this clock from the moving observer's perspective. That is to say, in a frame moving relative to the local clock, this clock will appear to be running more slowly. Straightforward application of the Pythagorean theorem leads to the well-known prediction of special relativity:";
			else if (t < 32) return "";
			else if (t < 120)
				return "The total time for the light pulse to trace its path is given by $\\Delta t' = \\frac{2D}{c}$. The length of the half path can be calculated as a function of known quantities as $D = \\sqrt{ \\left( \\frac{1}{2} v \\Delta t' \\right)^2 + L^2}$. Elimination of the variables D and L from these three equations results in $\\Delta t' = \\frac{ \\Delta t}{1 -  \\frac{v^2}{c^2}  }$, which expresses the fact that the moving observer's period of the clock $\\Delta t'$ is longer than the period $\\Delta t$ in the frame of the clock itself. It can be also expressed as $\\Delta t' = \\gamma \\Delta t$ where $\\gamma$ is what we call a Lorentz factor. ";
			return "";
		};
	}
}

class LengthContractionScenario {
	constructor() {
		simulationType = 1;
		scene = 1;

		sky_color = [0.73, 0.835, 1];

		transformation_method = PRESENT_HYPERSURFACE;
		projectionType = ORTOGRAPHIC;
		ortoFrustumSize = 8;

		camPos = [0, 1, 0];

		const vel = 0.7;
		const len = 4 * Math.sqrt(1 - vel ** 2);

		const grass = new Plane([0, -5, 64], grassTex, 512, 512, 1, 1, 64, 64);

		const rod = new Body([0, 0, 0], rustTex);
		rod.loadModel('assets/objects/cylinder.obj', 1, 8, 1);
		rod.createBuffers();
		rod.vel = (t) => {
			return [vel, 0, 0];
		}
		rod.pos = (t) => {
			return [vel * t - len, 0, 0];
		}
		rod.rotation = (t) => {
			return m4.rotationZ(Math.PI / 2);
		}

		const face = new Body([], clockTex);
		face.loadModel('assets/objects/circle.obj', 3, 3, 3);
		face.createBuffers();
		face.vel = (t) => {
			return [vel, 0, 0];
		}
		face.pos = (t) => {
			return [vel * t, 3, 0];
		}

		const hand = new Cube([3, 0, 0.01], black, 0.05, 1.2, 0.01, 1, 1, 1);
		hand.rotation = (t) => {
			return m4.rotationZ(-Math.PI / 30 * t * Math.sqrt(1 - vel ** 2));
		};
		for (let i = 0; i < hand.vpositions.length; ++i) {
			if (i % 3 == 1)
				hand.vpositions[i] += 0.6;
		};
		hand.vel = face.vel;
		hand.pos = (t) => {
			return v3.add(face.pos(t), [0, 0, 0.01]);
		}
		hand.createBuffers();

		const face_stationary = new Body([0, -3, 0], clockTex);
		face_stationary.loadModel('assets/objects/circle.obj', 3, 3, 3);
		face_stationary.createBuffers();

		const hand_stationary = new Cube([3, 0, 0.01], black, 0.05, 1.2, 0.01, 1, 1, 1);
		for (let i = 0; i < hand_stationary.vpositions.length; ++i) {
			if (i % 3 == 1)
				hand_stationary.vpositions[i] += 0.6;
		};
		hand_stationary.createBuffers();
		hand_stationary.rotation = (t) => {
			return m4.rotationZ(-Math.PI / 30 * t);
		};
		hand_stationary.pos = (t) => {
			return v3.add(face_stationary.pos(t), [0, 0, 0.01]);
		}

		const xoff = 3;

		this.pos = (t) => {
			const camZ = 20;
			const camY = 3;

			if (t < 15)
				return [xoff, camY, camZ];
			else if (t < 16)
				return [xoff + vel * (t - 15) ** 2 / 2, camY, camZ];

			return [xoff + vel / 2 + vel * (t - 16), camY, camZ];
		};

		this.visPos = this.pos;

		this.vel = (t) => {
			if (t < 15)
				return [0, 0, 0];
			else if (t < 16)
				return [(t - 15) * vel, 0, 0];
			return [vel, 0, 0];
		};

		this.dir = (t) => {
			const toff = 5;
			if (t < -toff)
				return v3.subtract(v3.add(rod.pos(t), [xoff + vel * toff + len, -3, -10]), this.pos(t));
			else
				return [0, -6, -30];
		}

		this.timeline = (t) => {
			if (t < 162)
				etherTime = t - 100; // -100 -> 62
			else
				showMenu();
		}

		this.text = (t) => {
			if (t < -96) return "";
			else if (t < -74)
				return "Length contraction is the phenomenon that a moving object's length is measured to be shorter than its proper length, which is the length as measured in the object's own rest frame. It is usually only noticeable at a substantial fraction of the speed of light. Length contraction is only in the direction in which the body is travelling.";
			else if (t < -72) return "";
			else if (t < -52)
				return 'Length contraction can be derived from time dilation, according to which the rate of a single "moving" clock (indicating its proper time $T_0$) is lower with respect to two synchronized "resting" clocks (indicating $T$). Time dilation is represented by the relation $T = T_0 \\cdot \\gamma$';
			else if (t < -50) return "";
			else if (t < 15)
				return "Suppose a rod of proper length $L_0$ at rest in $S$ and a clock at rest in $S'$ are moving along each other with speed $v$. Since, according to the principle of relativity, the magnitude of relative velocity is the same in either reference frame, the respective travel times of the clock between the rod's endpoints are given by $T=L_0 / v$ in $S$ and $T'_0=L' / v$ in $S'$, thus $L_0 = Tv$ and $L' = T_0'v$. By inserting the time dilation formula, the ratio between those lengths is $ \\frac{L'}{L_0}=\\frac{T_0'v}{Tv}= 1 / \\gamma $ ";
			else if (t < 16) return "";
			else if (t < 60)
				return "Therefore, the length measured in $S'$ is given by $L' = L_0 / \\gamma$ So since the clock's travel time across the rod is longer in $S$ than in $S'$ (time dilation in $S$), the rod's length is also longer in $S$ than in $S'$ (length contraction in $S'$). Likewise, if the clock were at rest in $S$ and the rod in $S'$, the above procedure would give $$L=L_0' / \\gamma$$";
			return "";
		};
	}
}

class TerrellRotationScenario {
	constructor() {
		simulationType = 2;

		transformation_method = PRESENT_HYPERSURFACE;
		projectionType = PERSPECTIVE;
		sky_color = [0, 0, 0];

		for (let x = -18; x < 25; x += 3) {
			const c = new Cube([x, -1.35, 0], diceBlueTex, 1, 1, 1, 8, 8, 8);
			c.rotation = (t) => {
				return m4.rotateX(m4.rotationZ(Math.PI), -Math.PI / 2);
			};
		}

		for (let x = -18; x < 25; x += 3) {
			const c = new Cube([x, 1, 0], diceBlueTex, 1, 1, 1, 8, 8, 8);
			c.vel = (t) => {
				return [-0.9, 0, 0];
			};
			c.pos = (t) => {
				return [x - 0.9 * t, 1.35, 0];
			};
			c.rotation = (t) => {
				return m4.rotateX(m4.rotationZ(Math.PI), -Math.PI / 2);
			};
		}

		this.pos = (t) => {
			if (t < 55) {
				return [-19, 0, -3.5];
			}
			showMenu();
			return [0, 0, 0];
		};

		this.visPos = (t) => {
			if (t < 0)
				return [-19 + 0.5 * t, 0, -3.5 + 0.5 * t];
			return [-19, 0, -3.5];
		}

		this.vel = (t) => {
			return [0, 0, 0];
		};

		this.dir = (t) => {
			return [1, 0, 0.7];
		}

		this.timeline = (t) => {
			if (t < 120)
				etherTime = t - 65; // -65 -> 55
			else
				showMenu();
		}

		this.text = (t) => {
			if (t < -50)
				return "Terrell rotation or Terrell effect is the visual distortion that a passing object would appear to undergo, according to the special theory of relativity if it were travelling a significant fraction of the speed of light.";
			else if (t < -47)
				return "";
			else if (t < -20)
				return "In everyday life, where all relative velocities are small compared to the speed of light, we can always assume that when light rays reach our eye simultaneously and there create the image of some object, they have also simultaneously left the object. This assumption is, of course, not justified any more, when the relative velocity between observer and object is comparable to the speed of light. Then, the light travel times have to be taken into account.";
			else if (t < -17)
				return "";
			else if (t < 0)
				return "The apparent rotation is especially clearly visible in cubes moving at 90% of the speed of light above a line of non-moving cubes. The non-moving cubes are ligned up along the path of the moving ones, and all cubes have the same orientation.";
			else if (t < 3)
				return "";
			else if (t < 20)
				return "The image that we form of a moving cube is created by light rays that reach the eye at a certain instant. Since different light rays come from different points on the cube, they needed different amounts of time to reach the eye and were therefore emitted at different times. ";
			else if (t < 23)
				return "";
			else if (t < 45)
				return "As distance to the cube becomes shorter, the vector projection of velocity of photons emited from back face to eye projected onto cube velocity becomes smaller. At some point, the cube outpaces light rays coming from the back face and thus we can see the back face of the cube."
			return "";
		};
	}
}

class LadderParadoxScenario {
	constructor() {
		simulationType = 1;
		scene = 1;

		transformation_method = PRESENT_HYPERSURFACE;
		projectionType = ORTOGRAPHIC;
		ortoFrustumSize = 6;

		sky_color = [0.73, 0.835, 1];

		camPos = [0, 6, 10];

		const grass = new Plane([0, 0, 0], grassTex, 256, 256, 1, 1, 32, 32);

		const ladder = new Body([], woodTex);
		ladder.loadModel('assets/objects/ladder.obj', 0.06, 0.06, 0.04);

		for (let i = 0; i < ladder.vpositions.length; ++i)
			if (i % 3 == 1)
				ladder.vpositions[i] -= 5.5;

		ladder.rotation = (t) => { return m4.rotationZ(Math.PI / 2); };

		ladder.vel = (t) => {
			return [0.9, 0, 0];
		};
		ladder.pos = (t) => {
			return [0.9 * (t), 0.7, 0];
		};
		ladder.createBuffers();

		const floor = new Body([0, 0.01, 0], concreteTex);
		floor.loadModel('assets/objects/barn/floor.obj', 0.5, 0.5, 0.5);
		floor.createBuffers();
		floor.rotation = (t) => {
			return m4.rotationY(Math.PI / 2);
		}

		const roof1 = new Body([0, 0, 0], shinglesTex);
		roof1.loadModel('assets/objects/barn/roof1.obj', 0.5, 0.5, 0.5);
		roof1.createBuffers();
		roof1.rotation = floor.rotation;

		const roof2 = new Body([0, 0, 0], shinglesTex);
		roof2.loadModel('assets/objects/barn/roof2.obj', 0.5, 0.5, 0.5);
		roof2.createBuffers();
		roof2.rotation = floor.rotation;
		roof2.pos = (t) => {
			if (t < -10) return [0, 0, 0];
			else return [0, -10, 0];
		}

		const walls1 = new Body([0, 0, 0], roofing_metalTex);
		walls1.loadModel('assets/objects/barn/walls1.obj', 0.5, 0.5, 0.5);
		walls1.createBuffers();
		walls1.rotation = floor.rotation;

		const walls2 = new Body([0, 0, 0], roofing_metalTex);
		walls2.loadModel('assets/objects/barn/walls2.obj', 0.5, 0.5, 0.5);
		walls2.createBuffers();
		walls2.rotation = floor.rotation;
		walls2.pos = roof2.pos;

		const windows = new Body([0, 0, 0], white);
		windows.loadModel('assets/objects/barn/windows.obj', 0.5, 0.5, 0.5);
		windows.createBuffers();
		windows.rotation = floor.rotation;

		const back = new Plane([0, 1.425, -0.8], barn_backTex, 7.75, 2.85);
		back.rotation = (t) => {
			return m4.rotationX(Math.PI / 2);
		}

		const x = 3.9;

		const face1 = new Body([-x, 6, 0], clockTex);
		face1.loadModel('assets/objects/circle.obj', 3, 3, 3);
		face1.createBuffers();

		const hand1 = new Cube([-x, 6, 0.01], black, 0.05, 1.2, 0.01, 1, 1, 1);
		hand1.rotation = (t) => {
			return m4.rotationZ(-Math.PI / 30 * t);
		};
		for (let i = 0; i < hand1.vpositions.length; ++i) {
			if (i % 3 == 1)
				hand1.vpositions[i] += 0.6;
		};
		hand1.createBuffers();

		const face2 = new Body([x, 6, 0], clockTex);
		face2.loadModel('assets/objects/circle.obj', 3, 3, 3);
		face2.createBuffers();

		const hand2 = new Cube([x, 6, 0.01], black, 0.05, 1.2, 0.01, 1, 1, 1);
		hand2.rotation = (t) => {
			return m4.rotationZ(-Math.PI / 30 * t);
		};
		for (let i = 0; i < hand2.vpositions.length; ++i) {
			if (i % 3 == 1)
				hand2.vpositions[i] += 0.6;
		};
		hand2.createBuffers();

		const gate1 = new Cube([-x, 1.5, 0], planksTex, 0.1, 1.5, 2);
		for (let i = 0; i < gate1.vpositions.length; ++i)
			if (i % 3 == 1)
				gate1.vpositions[i] -= 0.75;

		gate1.createBuffers();
		gate1.rotation = (t) => {
			if (t < -1.5)
				return m4.rotationZ(-Math.PI / 2);
			else if (t < -0.5)
				return m4.rotationZ(-Math.PI / 2 + Math.PI / 2 * (t + 1.5));
			else if (t < 0.5)
				return m4.identity();
			else if (t < 1.5)
				return m4.rotationZ(-Math.PI / 2 * (t - 0.5));
			return m4.rotationZ(-Math.PI / 2);
		};

		const gate2 = new Cube([x, 1.5, 0], planksTex, 0.1, 1.5, 2);
		for (let i = 0; i < gate2.vpositions.length; ++i) {
			if (i % 3 == 1)
				gate2.vpositions[i] -= 0.75;
		};
		gate2.createBuffers();
		gate2.rotation = (t) => {
			if (t < -1.5)
				return m4.rotationZ(Math.PI / 2);
			else if (t < -0.5)
				return m4.rotationZ(Math.PI / 2 - Math.PI / 2 * (t + 1.5));
			else if (t < 0.5)
				return m4.identity();
			else if (t < 1.5)
				return m4.rotationZ(Math.PI / 2 * (t - 0.5));
			return m4.rotationZ(Math.PI / 2);
		};

		this.pos = (t) => {
			if (scene == 1)
				return [0, 6, 32];
			return [0.9 * (t), 6, 32];
		};

		this.visPos = this.pos;

		this.vel = (t) => {
			if (scene == 1) {
				return [0, 0, 0];
			}

			return [0.9, 0, 0];
		};

		this.dir = (t) => {
			if (scene == 1 && t < -10)
				return v3.subtract(v3.add(ladder.pos(t), [9, 1.3, 0]), this.pos(t));
			return [0, -1, -8];
		}

		this.timeline = (t) => {
			if (t < 78) {
				scene = 1;
				etherTime = t - 47; // -45 -> 33
			}
			else if (t < 188) {
				scene = 2;
				etherTime = t - 143; // -65 -> 55
			}
			else
				showMenu();
		}

		this.text = (t) => {
			if (scene == 1) {
				if (t < -45) return "";
				if (t < -31)
					return "The ladder paradox (or barn-pole paradox) is a thought experiment in special relativity. It involves a ladder, parallel to the ground, travelling horizontally at relativistic speed and therefore undergoing a Lorentz length contraction.";
				else if (t < -30) return "";
				else if (t < 8)
					return "The ladder is imagined passing through the open front and rear doors of a garage or barn which is shorter than its rest length, so if the ladder was not moving it would not be able to fit inside. To a stationary observer, due to the contraction, the moving ladder is able to fit entirely inside the building as it passes through.";
				else if (t < 10) return "";
				else if (t < 31)
					return "On the other hand, from the point of view of an observer moving with the ladder, the ladder will not be contracted, and it is the building which will be Lorentz contracted to an even smaller length. Therefore the ladder will not be able to fit inside the building as it passes through. This poses an apparent discrepancy between the realities of both observers.";
				else return "";
			}
			if (t < -60) return "";
			if (t < 5)
				return "The solution to the apparent paradox lies in the relativity of simultaneity: what one observer considers to be two simultaneous events may not in fact be simultaneous to another observer. When we say the ladder fits inside the garage, what we mean precisely is that, at some specific time, the position of the back of the ladder and the position of the front of the ladder were both inside the garage."
			else if (t < 10) return "";
			else if (t < 50)
				return "As simultaneity is relative, then, two observers disagree on whether the ladder fits. To the observer with the garage, the back end of the ladder was in the garage at the same time that the front end of the ladder was, and so the ladder fit; but to the observer with the ladder, these two events were not simultaneous, and the ladder did not fit.";
			else return "";
		};
	}
}

class TwinParadoxScenario {
	constructor() {
		simulationType = 1;

		scene = 1;
		projectionType = ORTOGRAPHIC;
		ortoFrustumSize = 15;

		transformation_method = PRESENT_HYPERSURFACE;
		sky_color = [0, 0, 0];

		const earth = new Body([-10, 6, 0], earthTex);
		earth.loadModel('assets/objects/earth/earth.obj', 2, 2, 2);
		earth.createBuffers();
		earth.rotation = (t) => {
			return m4.rotateY(m4.rotationX(Math.PI * 5 / 4), hand_stationary.time * Math.PI / 20);
		};

		const face_stationary = new Body([0, 12, 0], clockTex);
		face_stationary.loadModel('assets/objects/circle.obj', 6, 6, 6);
		face_stationary.createBuffers();

		const hand_stationary = new Cube([0, 12, 0.01], black, 0.05, 2.5, 0.01, 1, 1, 1);
		hand_stationary.rotation = (t) => {
			hand_stationary.time = t;
			return m4.rotationZ(-Math.PI / 30 * (t));
		};

		for (let i = 0; i < hand_stationary.vpositions.length; ++i) {
			if (i % 3 == 1)
				hand_stationary.vpositions[i] += 1.25;
		};
		hand_stationary.createBuffers();

		const diagram = new Plane([], twin_diagramTex, 14, 14, 1, 1);
		for (let i = 0; i < diagram.vpositions.length; ++i) {
			if (i % 3 == 0)
				diagram.vpositions[i] += 20;
			if (i % 3 == 1)
				diagram.vpositions[i] -= 100;
			if (i % 3 == 2)
				diagram.vpositions[i] -= 7;
		};
		diagram.createBuffers();
		diagram.rotation = (t) => {
			return m4.rotationX(Math.PI / 2);
		}

		////////////////////////////////////////////////////////////

		const rocket = new Body([], rocketTex);
		rocket.loadModel('assets/objects/rocket/rocket.obj', 2, 2, 2);
		for (let i = 0; i < rocket.vpositions.length; ++i) {
			if (i % 3 == 2)
				rocket.vpositions[i] -= 4.5;
		};
		rocket.createBuffers();

		const face = new Body([], clockTex);
		face.loadModel('assets/objects/circle.obj', 6, 6, 6);
		face.createBuffers();

		const hand = new Cube([], black, 0.05, 2.5, 0.01, 1, 1, 1);

		for (let i = 0; i < hand.vpositions.length; ++i) {
			if (i % 3 == 1)
				hand.vpositions[i] += 1.25;
		};
		hand.createBuffers();

		const a = 0.16; //acceleration
		const ad = 5; //acceleration duration
		const cd = 20; //constant speed duration
		const v = a * ad;

		face.vel = (t) => {
			if (t < 0)
				return [0, 0, 0];
			else if (t < ad)
				return [a * t, 0, 0];
			else if (t < ad + cd)
				return [a * ad, 0, 0];
			else if (t < 3 * ad + cd)
				return [a * ad - a * (t - ad - cd), 0, 0];
			else if (t < 3 * ad + 2 * cd)
				return [-a * ad, 0, 0];
			else if (t < 4 * ad + 2 * cd)
				return [a * (t - 4 * ad - 2 * cd), 0, 0];
			else return [0, 0, 0];
		};

		face.pos = (t) => {
			if (t < 0)
				return [0, 0, 0];
			else if (t < ad)
				return [(a * t ** 2) / 2, 0, 0];
			else if (t < ad + cd)
				return [(a * ad ** 2) / 2 + a * ad * (t - ad), 0, 0];
			else if (t < 3 * ad + cd)
				return [(a * ad ** 2) / 2 + a * ad * cd + a * ad * (t - ad - cd) - a * (t - ad - cd) ** 2 / 2, 0, 0];
			else if (t < 3 * ad + 2 * cd)
				return [(a * ad ** 2) / 2 + a * ad * cd - a * ad * (t - 3 * ad - cd), 0, 0];
			else if (t < 4 * ad + 2 * cd)
				return [a * (t - 4 * ad - 2 * cd) ** 2 / 2, 0, 0];
			else return [0, 0, 0];
		};

		face.age = (t) => {
			const aa = (a * ad * Math.sqrt(1 - (a * ad) ** 2) + Math.asin(a * ad)) / 2 / a;
			const ca = cd * Math.sqrt(1 - v ** 2);
			if (t < 0)
				return t;
			else if (t < ad)
				return (a * t * Math.sqrt(1 - (a * t) ** 2) + Math.asin(a * t)) / 2 / a;
			else if (t < ad + cd)
				return (t - ad) * Math.sqrt(1 - v ** 2) + aa;
			else if (t < 3 * ad + cd) {
				const arg = -2 * ad - cd + t;
				return (arg * Math.sqrt(1 - arg ** 2 * a ** 2) - Math.asin(-a * arg) / a) / 2 + 2 * aa + ca;
			} else if (t < 3 * ad + 2 * cd) {
				return 3 * aa + ca + (t - 3 * ad - cd) * Math.sqrt(1 - v ** 2);
			} else if (t < 4 * ad + 2 * cd) {
				const arg = t - 4 * ad - 2 * cd;
				return (arg * Math.sqrt(1 - arg ** 2 * a ** 2) - Math.asin(-a * arg) / a) / 2 + 4 * aa + 2 * ca;
			} else return 4 * aa + 2 * ca + t - 4 * ad - 2 * cd;
		};

		hand.vel = face.vel;

		hand.pos = (t) => {
			var p = face.pos(t);
			p[2] += 0.01;
			return p;
		};

		hand.rotation = (t) => {
			return m4.rotationZ(-Math.PI / 30 * face.age(t));
		};

		rocket.vel = face.vel;
		rocket.pos = (t) => {
			const x = face.pos(t);
			x[1] += 6;
			return x;
		}
		rocket.rotation = (t) => {
			if (t < ad + cd)
				return m4.rotateY(m4.rotationX(Math.PI), Math.PI / 2);
			else if (t < 3 * ad + cd)
				return m4.rotateY(m4.rotationX(Math.PI), Math.PI / 2 - Math.PI * (t - ad - cd) / 2 / ad);
			else if (t < 3 * ad + 2 * cd)
				return m4.rotateY(m4.rotationX(Math.PI), -Math.PI / 2);
			else if (t < 4 * ad + 2 * cd)
				return m4.rotateY(m4.rotationX(Math.PI), -Math.PI / 2 - Math.PI * (t - 3 * ad - 2 * cd) / ad);
			else
				return m4.rotateY(m4.rotationX(Math.PI), Math.PI / 2);
		}

		this.pos = (t) => {
			if (scene == 1) {
				return [15, 0, 10];
			}

			let x = face.pos(t);
			x[1] += 1;
			x[2] = 10;
			return x;
		}

		this.visPos = this.pos;

		this.vel = (t) => {
			if (scene == 1)
				return [0, 0, 0];

			return face.vel(t);
		};

		this.dir = (t) => {
			return [0, 0, -1];
		}

		this.text = (t) => {
			if (scene == 1) {
				if (t < -18) return "";
				else if (t < 18)
					return "In physics, the twin paradox is a thought experiment in special relativity involving identical twins, one of whom makes a journey into space in a high-speed rocket and returns home to find that the twin who remained on Earth has aged more. This result appears puzzling because each twin sees the other twin as moving, and so, according to an incorrect and naive application of time dilation and the principle of relativity, each should paradoxically find the other to have aged less.";
				else if (t < 20) return "";
				else if (t < 60)
					return "Resolution is based on the fact that the earthbound twin is at rest in the same inertial frame throughout the journey, while the travelling twin is not. In this approach, determining which observer switches frames and which does not is crucial. Although both twins can legitimately claim that they are at rest in their own frame, only the traveling twin experiences acceleration when the spaceship engines are turned on. This acceleration, measurable with an accelerometer, makes his rest frame temporarily non-inertial.";
			}

			if (t < -38) return "";
			else if (t < 10)
				return "Relativity of simultaneity means that switching from one inertial frame to another requires an adjustment in what slice through spacetime counts as the \"present\". In the spacetime diagram on the right, drawn for the reference frame of the Earth-based twin, that twin's world line coincides with the vertical axis (his position is constant in space, moving only in time). On the first leg of the trip, the second twin moves to the right (black sloped line); and on the second leg, back to the left. Blue lines show the planes of simultaneity for the traveling twin during the first leg of the journey; red lines, during the second leg.";
			else if (t < 12) return "";
			else if (t < 100)
				return "Just before turnaround, the traveling twin calculates the age of the Earth-based twin by measuring the interval along the vertical axis from the origin to the upper blue line. Just after turnaround, if he recalculates, he will measure the interval from the origin to the lower red line. In a sense, during the U-turn the plane of simultaneity jumps from blue to red and very quickly sweeps over a large segment of the world line of the Earth-based twin. When one transfers from the outgoing inertial frame to the incoming inertial frame there is a jump discontinuity in the age of the Earth-based twin.";
			return "";
		};

		this.timeline = (t) => {
			if (t < 20 + 4 * ad + 2 * cd) {
				scene = 1;
				etherTime = t - 20; // -20 ->
			}
			else if (t < 165 + 4 * ad + 2 * cd) {
				scene = 2;
				etherTime = t - 4 * ad - 2 * cd - 60; // -40 -> 105
			}
			else
				showMenu();
		}

		diagram.pos = (t) => {
			if (scene == 1) return [0, 0, 1000];
			else return this.pos(t);
		}
		diagram.vel = this.vel;
	}
}

class Gate {
	constructor() {
		simulationType = 2;
		transformation_method = PRESENT_HYPERSURFACE;
		projectionType = PERSPECTIVE;
		sky_color = [0.73, 0.835, 1];

		gateScenario();
	}
}

function gateScenario(d = 1) {
	camPos = [0, 2, -16];
	yaw = 1.57;

	new Plane([0.5, 0, 0.5], check32Tex, 32, 32, 32, 32);
	new Cube([-2, 3, 0], sand, 1, 6, 3, 1, 6, 3);
	new Cube([2, 3, 0], sand, 1, 6, 3, 1, 6, 3);

	new Cube([-5, 3, 0], sand, 1, 6, 3, 1, 6, 3);
	new Cube([5, 3, 0], sand, 1, 6, 3, 1, 6, 3);

	new Cube([-8, 3, 0], sand, 1, 6, 3, 1, 6, 3);
	new Cube([8, 3, 0], sand, 1, 6, 3, 1, 6, 3);

	new Cube([0, 6.5, 0], sand, 17, 1, 3, 16, 1, 1);
	new Cube([0, 7, 0], sand, 18, 0.5, 4, 18, 1, 1);
	new Cube([0, 8, 0], sand, 17, 1.5, 2, 16, 1, 1);
	new Cube([0, 8.1, 0], sand, 5, 1.7, 4, 3, 1, 1);
	new Cube([0, 10, 0], cinder, 3, 2, 2, 3, 2, 1);
}