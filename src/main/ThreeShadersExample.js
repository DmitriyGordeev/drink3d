import * as THREE from 'three';
import {DragControls} from 'three/addons/controls/DragControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



export class ThreeShadersExample {
    constructor() {
        this.setupFrameCallback();
        this.canvas = document.getElementById('c');
        this.scale();

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.clock = new THREE.Clock();
    }

    setupFrameCallback() {
        window.customRequestAnimationFrame = function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
                window.setTimeout(a, 1E3 / 60)
            }
        }();
    }


    scale() {
        this.cw = window.innerWidth;
        this.ch = window.innerHeight;
    }


    animateScene(objects) {
        window.customRequestAnimationFrame(() => {
            this.animateScene(objects)
        });

        this.uniforms.u_time.value = this.clock.getElapsedTime();
        this.renderScene();
    }


    startScene() {
        let canvas = this.canvas;
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setClearColor("#361b1b");
        this.renderer.setSize(this.cw, this.ch);

        this.scene = new THREE.Scene();
        let aspect = this.canvas.width / this.canvas.height;

        this.camera = new THREE.PerspectiveCamera(45, aspect);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);
    }



    createCube() {

        this.uniforms = {
            u_time: { type: 'f', value: 0.0 }
        };

        let vertexShader = `
            uniform float u_time;
        
            varying vec3 vColor;
            attribute float size;
            
            void main() {
                vColor = vec3(position.x + sin(u_time), position.y - cos(u_time), position.z);
                
                vec3 newPos = position;
                newPos.x = newPos.x * (1.0 + 0.2 * sin(4.0 * u_time));
                newPos.y = newPos.y * (1.0 + 0.2 * cos(3.0 * u_time));
                newPos.z = newPos.z * (1.0 + 0.2 * sin(4.0 * u_time));
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
            }
            `;

        let fragmentShader = `
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4( vColor, 1.0 );
            }
            `;


        const shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,

            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        } );


        let cubeGeometry = new THREE.BoxGeometry(2, 2, 2);

        let sizes = Array.apply(0, new Array(36)).map(i => 1.0)

        console.log(sizes);

        // cubeGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        // cubeGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        cubeGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute(sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

        this.cube = new THREE.Mesh(cubeGeometry, shaderMaterial);
        this.cube.rotation.y = 0.2;
        this.cube.rotation.x = 0.3;
        this.scene.add(this.cube);
    }


    createPlane() {
        this.uniforms = {
            u_time: { type: 'f', value: 0.0 },
            u_screenSize: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)}
        };

        console.log(window.innerWidth + "," + window.innerHeight);

        // TODO: как рисовать жидкость прямо на plane ?

        let vertexShader = `
            uniform float u_time;
            uniform vec2 u_screenSize;
            varying vec3 vColor;
            attribute float size;
            
            void main() {
                vColor = vec3(position.x, position.y, position.z);             
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
            `;

        let fragmentShader = `
            uniform vec2 u_screenSize;
            varying vec3 vColor;
            void main() {
                // gl_FragColor = vec4( vColor, 1.0 );
                gl_FragColor = vec4(gl_FragCoord.x / u_screenSize.x, gl_FragCoord.y / u_screenSize.y, 1.0, 1.0);
            }
            `;


        const shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,

            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        } );

        const geometry = new THREE.PlaneGeometry( 4, 4 );

        // cubeGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        // cubeGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        // cubeGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute(sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

        this.plane = new THREE.Mesh(geometry, shaderMaterial);
        this.plane.rotation.y = 0.2;
        this.plane.rotation.x = 0.3;
        this.scene.add(this.plane);
    }


    // createPoints() {
    //     this.uniforms = {
    //         pointTexture: { value: new THREE.TextureLoader().load( 'textures/spark1.png' ) },
    //         u_time: {type: 'f', value: 0.0}
    //     };
    //
    //     let vertexShader = `
    //         uniform float u_time;
    //         attribute float size;
    //         varying vec3 vColor;
    //         void main() {
    //             vColor = color;
    //             vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    //             mvPosition.x = sin(mvPosition.x * u_time * 0.1);
    //             gl_PointSize = size * ( 300.0 / -mvPosition.z );
    //             gl_Position = projectionMatrix * mvPosition;
    //         }`;
    //
    //     let fragmentShader = `
    //         uniform sampler2D pointTexture;
    //         varying vec3 vColor;
    //         void main() {
    //             gl_FragColor = vec4( vColor, 1.0 );
    //             gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
    //             // gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_FragCoord );
    //         }`;
    //
    //     const shaderMaterial = new THREE.ShaderMaterial( {
    //         uniforms: this.uniforms,
    //         vertexShader: vertexShader,
    //         fragmentShader: fragmentShader,
    //
    //         blending: THREE.AdditiveBlending,
    //         depthTest: false,
    //         transparent: true,
    //         vertexColors: true
    //     } );
    //
    //     const radius = 200;
    //     let geometry = new THREE.BufferGeometry();
    //
    //     const positions = [];
    //     const colors = [];
    //     const sizes = [];
    //
    //     const color = new THREE.Color();
    //
    //     let particles = 10000;
    //     for ( let i = 0; i < particles; i ++ ) {
    //         positions.push( ( Math.random() * 2 - 1 ) * radius );
    //         positions.push( ( Math.random() * 2 - 1 ) * radius );
    //         positions.push( ( Math.random() * 2 - 1 ) * radius );
    //
    //         color.setHSL( i / particles, 1.0, 0.5 );
    //         colors.push( color.r, color.g, color.b );
    //         sizes.push( 20 );
    //     }
    //
    //     geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    //     geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    //     geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );
    //
    //     this.particleSystem = new THREE.Points( geometry, shaderMaterial );
    //     console.log(this.scene);
    //     this.geometry = geometry;
    //     this.scene.add( this.particleSystem );
    // }



    renderScene() {

        // const time = Date.now() * 0.005;
        // this.particleSystem.rotation.z = 0.01 * time;
        // const sizes = this.geometry.attributes.size.array;
        // for ( let i = 0; i < 10000; i ++ ) {
        //     sizes[ i ] = 3 * ( 1 + Math.sin( 0.1 * i + time ) );
        // }
        // this.geometry.attributes.size.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }


    entry() {
        this.startScene();

        // this.createPoints();
        // this.createCube();
        this.createPlane();


        window.addEventListener('keydown', () => {
            console.log("keyDown");
        }, true);

        window.addEventListener('keyup', () => {
            console.log("keyUp");
        }, true);

        this.animateScene([this.cube]);
        this.renderScene();
    }


}
