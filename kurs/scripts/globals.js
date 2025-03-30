let scene, camera, renderer, gui;
let ground, sky;
let selectedObject = null;
let isDragging = false;
let isPainting = false;
let dragOffset = new THREE.Vector3();
let dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

let isRightDragging = false;
let initialMouseY = 0;
let initialCameraTilt = 0;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const settings = {
  mode: "brush",
  brushRadius: 5,
  brushStrength: 0.5,
  scale: 1,
  rotationY: 0,
  selectedModel: "Дом",
  addModel: function () {
    loadModel(settings.selectedModel);
  },
  removeSelected: function () {
    removeSelectedObject();
  },
};

const availableModels = ["Фламинго", "Лошадь", "Попугай", "Куст", "Забор", "Дом", "Пальма", "Ель", "Дерево"];

let scaleController, rotationController;
