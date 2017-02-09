"use strict";

var self = this;


var VISUALS_VISIBLE = true;

var SCALE_FACTOR = 1500;
var CAMERA_BOUND = 200;

var NUM_POINTS_SUBSET = 20000;
var NUM_SUBSETS = 7;
var NUM_POINTS = NUM_POINTS_SUBSET * NUM_SUBSETS;

var NUM_LEVELS = 10;
var LEVEL_DEPTH = 400;

var DEF_BRIGHTNESS = 1;
var DEF_SATURATION = 0.8;

var SPRITE_SIZE = Math.ceil(3 * window.innerWidth / 1600);

// Orbit parameters constraints
var A_MIN = -30;
var A_MAX = 30;
var B_MIN = 0.2;
var B_MAX = 1.8;
var C_MIN = 5;
var C_MAX = 17;
var D_MIN = 0;
var D_MAX = 10;
var E_MIN = 0;
var E_MAX = 12;

// Orbit parameters
var a, b, c, d, e;

// Orbit data
var orbit = {
    subsets: [],
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
    scaleX: 0,
    scaleY: 0
};

var container;
var camera, scene, renderer, vrrenderer, composer, hueValues = [];
var renderCanvas, vrHMD, vrHMDSensor;

var mouseX = 0, mouseY = 0;
var renderTargetWidth = window.innerWidth;
var renderTargetHeight = window.innerHeight;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var speed = 1.5;
var rotationSpeed = 0.002;
var vrSupported = false;
var vrEnabled = false;
var isFullscreen = false;

var FRACTALS = {


    getHoplaFractals: function (_scene) {

        this.scene = _scene;

        // Initialize data points
        for (var i = 0; i < NUM_SUBSETS; i++) {
            var subsetPoints = [];
            for (var j = 0; j < NUM_POINTS_SUBSET; j++) {
                subsetPoints[j] = {
                    x: 0,
                    y: 0,
                    vertex: new THREE.Vector3(0, 0, 0)
                };
            }
            orbit.subsets.push(subsetPoints);
        }

        this.init(_scene, this.sprite1);

    },

    init: function (_scene, _sprite) {
        console.log("Fractals init", _scene);
        this.SPRITE_SIZE = Math.ceil(3 * this.renderTargetWidth / 1600);
        this.sprite1 = new THREE.TextureLoader().load('./galaxy.png', this.loadTexture);

        console.log("Fractals sprite1", this.sprite1);

        this.generateOrbit();

        for (var s = 0; s < this.NUM_SUBSETS; s++) { hueValues[s] = Math.random(); }

        // Create particle systems
        for (var k = 0; k < NUM_LEVELS; k++) {
            for (var s = 0; s < NUM_SUBSETS; s++) {
                var geometry = new THREE.Geometry();
                for (var i = 0; i < NUM_POINTS_SUBSET; i++) { geometry.vertices.push(orbit.subsets[s][i].vertex); }
                var materials = new THREE.PointsMaterial({ size: (SPRITE_SIZE), map: this.sprite1, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
                THREE.ColorConverter.setHSV(materials.color, hueValues[s], DEF_SATURATION, DEF_BRIGHTNESS);
                var particles = new THREE.Points(geometry, materials);
                particles.myMaterial = materials;
                particles.myLevel = k;
                particles.mySubset = s;
                particles.position.x = 0;
                particles.position.y = 0;
                particles.position.z = - LEVEL_DEPTH * k - (s * LEVEL_DEPTH / NUM_SUBSETS) + SCALE_FACTOR / 2;
                particles.needsUpdate = 0;
                _scene.add(particles);
            }
        }

    },

    updateOrbit: function () {
        this.generateOrbit();
        for (var s = 0; s < NUM_SUBSETS; s++) {
            hueValues[s] = Math.random();
        }
        for (var i = 0; i < scene.children.length; i++) {
            scene.children[i].needsUpdate = 1;
        }
    },

    generateOrbit: function () {
        var x, y, z, x1;
        var idx = 0;

        this.prepareOrbit();

        // Using local vars should be faster
        var al = a;
        var bl = b;
        var cl = c;
        var dl = d;
        var el = e;
        var subsets = orbit.subsets;
        var num_points_subset_l = NUM_POINTS_SUBSET;
        var num_points_l = NUM_POINTS;
        var scale_factor_l = SCALE_FACTOR;

        var xMin = 0, xMax = 0, yMin = 0, yMax = 0;

        for (var s = 0; s < NUM_SUBSETS; s++) {

            // Use a different starting point for each orbit subset
            x = s * 0.005 * (0.5 - Math.random());
            y = s * 0.005 * (0.5 - Math.random());

            var curSubset = subsets[s];

            for (var i = 0; i < num_points_subset_l; i++) {

                // Iteration formula (generalization of the Barry Martin's original one)
                z = (dl + Math.sqrt(Math.abs(bl * x - cl)));
                if (x > 0) { x1 = y - z; }
                else if (x === 0) { x1 = y; }
                else { x1 = y + z; }
                y = al - x;
                x = x1 + el;

                curSubset[i].x = x;
                curSubset[i].y = y;

                if (x < xMin) { xMin = x; }
                else if (x > xMax) { xMax = x; }
                if (y < yMin) { yMin = y; }
                else if (y > yMax) { yMax = y; }

                idx++;
            }
        }


    },

    prepareOrbit: function () {
        this.shuffleParams();
        orbit.xMin = 0;
        orbit.xMax = 0;
        orbit.yMin = 0;
        orbit.yMax = 0;
    },

    shuffleParams: function () {
        a = A_MIN + Math.random() * (A_MAX - A_MIN);
        b = B_MIN + Math.random() * (B_MAX - B_MIN);
        c = C_MIN + Math.random() * (C_MAX - C_MIN);
        d = D_MIN + Math.random() * (D_MAX - D_MIN);
        e = E_MIN + Math.random() * (E_MAX - E_MIN);
    },

    loadTexture: function (texture) {
        // do something with the texture
        // var material = new THREE.MeshBasicMaterial({
        //     map: texture
        // });
        // this.sprite = texture;
        return texture;
    }
}




