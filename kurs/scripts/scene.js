function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 100);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.enablePan = true;
  controls.target.set(0, 0, 0);
  controls.update();

  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load(
    "img/grass.jpg",
    () => {
      console.log("Текстура травы загружена");
    },
    undefined,
    (err) => {
      console.error("Ошибка загрузки текстуры травы", err);
    }
  );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(10, 10);

  const groundGeometry = new THREE.PlaneBufferGeometry(200, 200, 50, 50);
  const groundMaterial = new THREE.MeshPhongMaterial({ map: groundTexture });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const skyTexture = textureLoader.load(
    "img/sky.jpg",
    () => {
      console.log("Текстура неба загружена");
    },
    undefined,
    (err) => {
      console.error("Ошибка загрузки текстуры неба", err);
    }
  );
  const skyGeometry = new THREE.SphereBufferGeometry(500, 60, 40);
  skyGeometry.scale(-1, 1, 1);
  const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture });
  sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(50, 50, 50);
  scene.add(directionalLight);
}
