const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 5000
);
camera.position.set(0, 50, 300);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const ambientLight = new THREE.AmbientLight(0x333333, 0.2); // Уменьшена интенсивность
scene.add(ambientLight);


const textureLoader = new THREE.TextureLoader();

function loadTexture(url) {
    const texture = textureLoader.load(url);
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
}


(function createStarField() {
    const starGeometry = new THREE.SphereGeometry(2000, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: loadTexture('planets/starmap.jpg'),
        side: THREE.BackSide
    });
    const starField = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starField);
})();


(function createSun() {
    const sunGeometry = new THREE.SphereGeometry(16, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: loadTexture('planets/sunmap.jpg')
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.receiveShadow = false;
    sun.castShadow = false;
    scene.add(sun);

    const sunlight = new THREE.PointLight(0xffffff, 2, 500);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.width = 1024;
    sunlight.shadow.mapSize.height = 1024;
    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 500;
    sun.add(sunlight);
})();


function createPlanet(options) {
    const geometry = new THREE.SphereGeometry(options.size, 64, 64);
    const materialOptions = {
        map: loadTexture(options.texture),
        bumpScale: options.bumpScale || 1,
        metalness: 0,
        roughness: 1
    };
    if (options.bumpMap) {
        materialOptions.bumpMap = loadTexture(options.bumpMap);
    }
    const material = new THREE.MeshStandardMaterial(materialOptions);
    const planet = new THREE.Mesh(geometry, material);

    planet.castShadow = true;
    planet.receiveShadow = true;

    planet.userData = {
        distance: options.distance,
        orbitSpeed: options.orbitSpeed,
        rotationSpeed: options.rotationSpeed,
        angle: Math.random() * Math.PI * 2,
        name: options.name
    };

    scene.add(planet);
    return planet;
}

const planets = [];

const mercury = createPlanet({
    size: 2,
    texture: 'planets/mercury/mercurymap.jpg',
    bumpMap: 'planets/mercury/mercurybump.jpg',
    distance: 28,
    orbitSpeed: 0.04,
    rotationSpeed: 0.002,
    name: 'Mercury'
});
planets.push(mercury);

const venus = createPlanet({
    size: 4,
    texture: 'planets/venus/venusmap.jpg',
    bumpMap: 'planets/venus/venusbump.jpg',
    distance: 45,
    orbitSpeed: 0.015,
    rotationSpeed: 0.001,
    name: 'Venus'
});
planets.push(venus);

const earth = createPlanet({
    size: 5,
    texture: 'planets/earth/earthmap1k.jpg',
    bumpMap: 'planets/earth/earthbump1k.jpg',
    bumpScale: 0.5,
    distance: 62,
    orbitSpeed: 0.01,
    rotationSpeed: 0.02,
    name: 'Earth'
});
planets.push(earth);

(function addEarthClouds() {
    const cloudGeometry = new THREE.SphereGeometry(5.05, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: loadTexture('planets/earth/earthcloudmaptrans.jpg'),
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    clouds.castShadow = false;
    clouds.receiveShadow = true;
    earth.add(clouds);
})();

const moon = createPlanet({
    size: 1.2,
    texture: 'planets/earth/moon/moonmap1k.jpg',
    bumpMap: 'planets/earth/moon/moonbump1k.jpg',
    distance: 8,
    orbitSpeed: 0.05,
    rotationSpeed: 0.01,
    name: 'Moon'
});
moon.castShadow = true;
moon.receiveShadow = true;
earth.add(moon);

const mars = createPlanet({
    size: 3.5,
    texture: 'planets/mars/marsmap1k.jpg',
    bumpMap: 'planets/mars/marsbump1k.jpg',
    distance: 80,
    orbitSpeed: 0.008,
    rotationSpeed: 0.018,
    name: 'Mars'
});
planets.push(mars);

let currentPlanet = null;

function animate() {
    requestAnimationFrame(animate);

    planets.forEach(planet => {
        planet.userData.angle += planet.userData.orbitSpeed;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;

        planet.rotation.y += planet.userData.rotationSpeed;
    });

    moon.userData.angle += moon.userData.orbitSpeed;
    moon.position.x = Math.cos(moon.userData.angle) * moon.userData.distance;
    moon.position.z = Math.sin(moon.userData.angle) * moon.userData.distance;

    earth.children.forEach(child => {
        if (child.material && child.material.transparent) {
            child.rotation.y += 0.001;
        }
    });

    if (currentPlanet) {
        const offset = new THREE.Vector3(15, 10, 15);
        camera.position.copy(currentPlanet.position).add(offset);
        controls.target.copy(currentPlanet.position);
    }

    renderer.render(scene, camera);
    controls.update();
}

animate();

document.addEventListener('keydown', event => {
    switch (event.key) {
        case '1':
        case '2':
        case '3':
        case '4':
            const index = parseInt(event.key) - 1;
            currentPlanet = planets[index];
            break;
        case '0':
            currentPlanet = null;
            controls.target.set(0, 0, 0);
            camera.position.set(0, 50, 300);
            break;
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
