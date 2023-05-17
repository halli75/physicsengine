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
				    return "";
					//return "In physics, the relativity of simultaneity is the concept that distant simultaneity – whether two spatially separated events occur at the same time – is not absolute, but depends on the observer's reference frame.";
				else if (t < -62) return "";
				else if (t < -30)
				    return "";
					//return "According to Einstein's special theory of relativity, it is impossible to say in an absolute sense that two distinct events occur at the same time if those events are separated in space. If one reference frame assigns precisely the same time to two events that are at different points in space, a reference frame that is moving relative to the first will generally assign different times to the two events (the only exception being when motion is exactly perpendicular to the line connecting the locations of both events).";
				else if (t < -25)
					return "";
				else if (t < 10)
				    //return "";
				    return "Train's Perspective";
					//return "A flash of light is given off at the center of the traincar just as the two observers pass each other. For the observer on board the train, the front and back of the traincar are at fixed distances from the light source and as such, according to this observer, the light will reach the front and back of the traincar at the same time.";
			}
			if (t < -28) return "";
			else if (t < 15)
			    //return "";
			    return "Ground's Perspective";
				//return "For the observer standing on the platform, on the other hand, the rear of the traincar is moving (catching up) toward the point at which the flash was given off, and the front of the traincar is moving away from it. As the speed of light is finite and the same in all directions for all observers, the light headed for the back of the train will have less distance to cover than the light headed for the front. Thus, the flashes of light will strike the ends of the traincar at different times."
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

		const vel = 0.5;
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
				    return "";
					//return "Special relativity indicates that, for an observer in an inertial frame of reference, a clock that is moving relative to him will be measured to tick slower than a clock that is at rest in his frame of reference. This case is sometimes called special relativistic time dilation.";
				else if (t < -48) return "";
				else if (t < -24)
				    return "";
					//return "Time dilation can be inferred from the observed constancy of the speed of light in all reference frames dictated by the second postulate of special relativity. This constancy of the speed of light means that, counter to intuition, speeds of material objects and light are not additive. It is not possible to make the speed of light appear greater by moving towards or away from the light source.";
				else if (t < -22) return "";
				else if (t < 13)
				    //return "";
				    return "Train Perspective";
					//return "Consider then, a simple clock consisting of two mirrors A and B, between which a light pulse is bouncing. The separation of the mirrors is $L$ and the clock ticks once each time the light pulse hits either of the mirrors. In the frame in which the clock is at rest, the light pulse traces out a path of length $2L$ and the period of the clock is $2L$ divided by the speed of light: $\\Delta t = \\frac{2L}{c}$";
				return "";
			}

			if (t < -85) return "";
			else if (t < 30)
			    //return "";
			    return "Ground Perspective";
				//return "From the frame of reference of a moving observer traveling at the speed v relative to the resting frame of the clock, the light pulse is seen as tracing out a longer, angled path. Keeping the speed of light constant for all inertial observers, requires a lengthening of the period of this clock from the moving observer's perspective. That is to say, in a frame moving relative to the local clock, this clock will appear to be running more slowly. Straightforward application of the Pythagorean theorem leads to the well-known prediction of special relativity:";
			else if (t < 32) return "";
			else if (t < 120)
			    return "";
			    //return "The total time for the light pulse to trace its path is given by $\\Delta t' = \\frac{2D}{c}$. The length of the half path can be calculated as a function of known quantities as $D = \\sqrt{ \\left( \\frac{1}{2} v \\Delta t' \\right)^2 + L^2}$. Elimination of the variables D and L from these three equations results in $\\Delta t' = \\frac{ \\Delta t}{1 -  \\frac{v^2}{c^2}  }$, which expresses the fact that the moving observer's period of the clock $\\Delta t'$ is longer than the period $\\Delta t$ in the frame of the clock itself. It can be also expressed as $\\Delta t' = \\gamma \\Delta t$ where $\\gamma$ is what we call a Lorentz factor. ";
			return "";
		};
	}
}

