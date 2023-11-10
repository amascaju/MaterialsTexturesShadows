import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import "./style.css"

// Declaració d'elements principals
//Loader de models GLTF
let loader = null
//Loader de textures
let textureLoader = null
const rotationSpeed = 0.0001
let scene = null
let camera = null
let renderer = null
// array d’objectes dels quals hem d’actualitzar la rotació.
const objects = [];

setupScene()

const albedoFabric = "textures/fabric/textures/fabric_pattern_07_col_1_1k.jpg"
const normalFabric = "textures/fabric/textures/fabric_pattern_07_nor_gl_1k.jpg"
const roughFabric = "textures/fabric/textures/fabric_pattern_07_rough_1k.jpg"

const albedoMud = "textures/mud/textures/brown_mud_leaves_01_diff_1k.jpg"
const normalMud = "textures/mud/textures/brown_mud_leaves_01_nor_gl_1k.jpg"
const roughMud = "textures/mud/textures/brown_mud_leaves_01_rough_1k.jpg"
const albedoTexture = textureLoader.load(albedoMud)
const normalTexture = textureLoader.load(normalMud)
const roughTexture = textureLoader.load(roughMud)

const albeldoTerra = "textures/terra-2/textures/excavated_soil_wall_diff_1k.jpg"
const normalTerra = "textures/terra-2/textures/excavated_soil_wall_nor_gl_1k.jpg"
const roughTerra = "textures/terra-2/textures/excavated_soil_wall_arm_1k.jpg"
const aoTerra = "textures/terra-2/textures/excavated_soil_wall_arm_1k.jpg"
const albedoTextureTerra = textureLoader.load(albeldoTerra)
const normalTextureTerra = textureLoader.load(normalTerra)
const roughTextureTerra = textureLoader.load(roughTerra)
const aoTextureTerra = textureLoader.load(aoTerra)

const albeldoBrick = "textures/brick/rock_wall_10_diff_1k.jpg"
const normalBrick = "textures/brick/rock_wall_10_nor_gl_1k.jpg"
const heightBrick = "textures/brick/rock_wall_10_disp_1k.jpg"
const roughBrick = "textures/brick/rock_wall_10_rough_1k.jpg"
const aoBrick = "textures/brick/rock_wall_10_ao_1k.jpg"
const albedoTextureBrick = textureLoader.load(albeldoBrick)
const normalTextureBrick = textureLoader.load(normalBrick)
const heightTextureBrick = textureLoader.load(heightBrick)
const roughTextureBrick = textureLoader.load(roughBrick)
const aoTextureBrick = textureLoader.load(aoBrick)

// const metalTilesbasecolor = textureLoader.load("./Metal_Tiles_003_basecolor.jpg");
// const metalTilesnormalMap = textureLoader.load("./Metal_Tiles_003_normal.jpg");
// const metalTilesheightMap = textureLoader.load("./Metal_Tiles_003_height.png");
// const metalTilesroughnessMap = textureLoader.load("./Metal_Tiles_003_roughness.jpg");
// const metalTilesambientOcclusionMap = textureLoader.load("./Metal_Tiles_003_ambientOcclusion.jpg");
// const metalTilesmetallic = textureLoader.load("./Metal_Tiles_003_metallic.jpg");

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)


const cubMat = new THREE.MeshStandardMaterial({
  map: albedoTextureBrick,
  normalMap: normalTextureBrick,
  displacementMap: heightTextureBrick,
  displacementScale: 0.00001,
  roughnessMap: roughTextureBrick,
  roughness: 0.5,
  aoMap: aoTextureBrick
})
const cubMat2 = new THREE.MeshStandardMaterial({
  map: albedoTextureTerra,
  normalMap: normalTextureTerra,
  roughnessMap: roughTextureTerra,
  roughness: 0.5,
  aoMap: aoTextureTerra
})

const geometrysphere = new THREE.SphereGeometry( 1 ); 
const materialsphere = new THREE.MeshStandardMaterial({
  map: albedoTextureBrick,
  normalMap: normalTextureBrick,
   displacementMap: heightTextureBrick,
   displacementScale: 0.09,
   roughnessMap: roughTextureBrick,
   roughness: 0.5,
   aoMap: aoTextureBrick
})
const sphere = new THREE.Mesh( geometrysphere, materialsphere )
scene.add( sphere );

const cubito = new THREE.Mesh(cubeGeometry, cubMat)
const cubito2 = new THREE.Mesh(cubeGeometry, cubMat2)
cubito.castShadow = true
cubito2.castShadow = true
cubito2.position.set(3,0,0)
cubito.position.set(-3,0,0)
scene.add(cubito)
scene.add(cubito2)
objects.push(cubito)
objects.push(cubito2)


// const plane5 = new THREE.Mesh(
//   new THREE.PlaneGeometry(2, 2, 512, 512), 
//   new THREE.MeshStandardMaterial({ 
//     map: brickWallbasecolor, 
//     normalMap: brickWallnormalMap, 
//     displacementMap: brickWallheightMap, 
//     displacementScale: 0.05, 
//     roughnessMap: brickWallroughnessMap, 
//     roughness: 0.25, 
//     aoMap: brickWallambientOcclusionMap }))
// plane5.geometry.attributes.uv2 = plane5.geometry.attributes.uv;
// plane5.position.y = 3
// plane5.position.x = 0.8
// scene.add(plane5)

////////ENTORN/////////////////
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
  'textures/environmentMaps/bosc/px.png',
  'textures/environmentMaps/bosc/nx.png',
  'textures/environmentMaps/bosc/py.png',
  'textures/environmentMaps/bosc/ny.png',
  'textures/environmentMaps/bosc/pz.png',
  'textures/environmentMaps/bosc/nz.png'
])

scene.background = environmentMap

// ////////////////////////////////////////////////
// // assync loading de texture i generació del cub
// ///////////////////////////////////////////////
// textureLoader.load(
//   // resource URL
//   mudTexturePath,

//   // onLoad callback
//   function (texture) {


//     // in this example we create the material when the texture is loaded
//     const material = new THREE.MeshBasicMaterial({
//       map: texture
//     })

//     const cube = new THREE.Mesh(cubeGeometry, material)

//     scene.add(cube)
//     objects.push(cube)
//   },
//   // onError callback
//   function (err) {
//     console.error('An error happened: ' + err)
//   }
// )



let time = Date.now()
function animate() {
  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  objects.forEach((obj) => {
    if (obj != null) obj.rotation.y += rotationSpeed * deltaTime;
  });


  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()


// Preparació de l'escena
function setupScene() {
  //Loader de models GLTF
  loader = new GLTFLoader()
  //Loader de textures
  textureLoader = new THREE.TextureLoader()

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 2, 2)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  document.body.appendChild(renderer.domElement)

  //controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  //directional light
  const dirlight = new THREE.DirectionalLight(0xffffff,3);
  dirlight.position.set(-1, 1, 1);
  dirlight.castShadow = true
  scene.add(dirlight);

  //scene.add(new THREE.AmbientLight(0xffffff, 2));
  //spotlight
  // const spotLight = new THREE.SpotLight(0xffffff, 20, 40, Math.PI/8)
  // spotLight.position.set(-5, 4, 1)
  // scene.add(spotLight)


  //plane
  const planeGeo = new THREE.PlaneGeometry(10, 10)
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff
  })
  const plane = new THREE.Mesh(planeGeo, planeMat)
  plane.position.y = -1
  plane.rotation.x = Math.PI * -0.5
  plane.receiveShadow = true
  scene.add(plane)
}
