import {
	BoxGeometry,
	BufferGeometry,
	CapsuleGeometry,
	CircleGeometry,
	Color,
	ConeGeometry,
	Curve,
	CylinderGeometry,
	DirectionalLight,
	DodecahedronGeometry,
	DoubleSide,
	ExtrudeGeometry,
	Float32BufferAttribute,
	Group,
	IcosahedronGeometry,
	LatheGeometry,
	LineSegments,
	LineBasicMaterial,
	Mesh,
	MeshPhongMaterial,
	OctahedronGeometry,
	PerspectiveCamera,
	PlaneGeometry,
	RepeatWrapping,
	RingGeometry,
	Scene,
	Shape,
	ShapeGeometry,
	SphereGeometry,
	TetrahedronGeometry,
	TextureLoader,
	TorusGeometry,
	TorusKnotGeometry,
	TubeGeometry,
	Vector2,
	Vector3,
	WireframeGeometry,
	WebGLRenderer
} from './three.module.js';

import { GUI } from './lil-gui.module.min.js';
import { OrbitControls } from './OrbitControls.js';

const twoPi = Math.PI * 2;

const textureLoader = new TextureLoader();

const bricks = textureLoader.load( 'bricks.jpg' );
bricks.wrapS = RepeatWrapping;
bricks.wrapT = RepeatWrapping;
bricks.repeat.set( 9, 1 );

const checker = textureLoader.load( 'checker.jpg' );
checker.wrapS = RepeatWrapping;
checker.wrapT = RepeatWrapping;
checker.repeat.set( 9, 1 );

const lineMaterial = new LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.1 } );
const meshMaterial = new MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: false, map: checker } );

function MakeTorus ( group ) {

	const data = {
		radius: 10,
		tube: 1,
		radialSegments: 16,
		tubularSegments: 100,
		arc: twoPi,
		lines: false
	};

	function generateGeometry() {
		// remove children
		group.clear();

		const geometry = new TorusGeometry(
				data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc
			)
		if (data.lines)
		{
			group.add( new LineSegments( geometry, lineMaterial ) );
		}
		group.add( new Mesh( geometry, meshMaterial ) );
	}

	const folder = gui.addFolder( 'THREE.TorusGeometry' );

	folder.add( data, 'radius', 1, 20 ).onChange( generateGeometry );
	folder.add( data, 'tube', 0.1, 10 ).onChange( generateGeometry );
	folder.add( data, 'radialSegments', 2, 30 ).step( 1 ).onChange( generateGeometry );
	folder.add( data, 'tubularSegments', 3, 200 ).step( 1 ).onChange( generateGeometry );
	folder.add( data, 'arc', 0.1, twoPi ).onChange( generateGeometry );

	const folder2 = gui.addFolder( 'Appearance' );

	folder2.add( data, 'lines').onChange( generateGeometry );

	generateGeometry();
}

const gui = new GUI();

const scene = new Scene();
scene.background = new Color( 0x444444 );

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
camera.position.z = 30;

const renderer = new WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.enableZoom = false;

const lights = [];
lights[ 0 ] = new DirectionalLight( 0xffffff, 3 );
lights[ 1 ] = new DirectionalLight( 0xffffff, 3 );
lights[ 2 ] = new DirectionalLight( 0xffffff, 3 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

const group = new Group();
MakeTorus( group );
scene.add( group );


function render() {

	requestAnimationFrame( render );

	group.rotation.x += 0.005;
	group.rotation.y += 0.005;

	renderer.render( scene, camera );

}

window.addEventListener( 'resize', function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();

