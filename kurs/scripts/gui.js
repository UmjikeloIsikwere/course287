function initGUI() {
  gui = new dat.GUI();
  gui.add(settings, "mode", ["brush", "select"]).name("Режим");
  gui.add(settings, "brushRadius", 1, 20).name("Радиус кисти");
  gui.add(settings, "brushStrength", 0.1, 5).name("Сила кисти");

  gui.add(settings, "selectedModel", availableModels).name("Выбор модели");
  gui.add(settings, "addModel").name("Добавить модель");
  gui.add(settings, "removeSelected").name("Удалить выбранное");

  scaleController = gui
    .add(settings, "scale", 0.1, 5)
    .name("Масштаб")
    .onChange((val) => {
      if (selectedObject) selectedObject.scale.set(val, val, val);
    });
  rotationController = gui
    .add(settings, "rotationY", 0, 360)
    .name("Поворот")
    .onChange((val) => {
      if (selectedObject) selectedObject.rotation.y = THREE.MathUtils.degToRad(val);
    });
  hideTransformControllers();
}

function updateTransformControllers() {
  if (selectedObject) {
    settings.scale = selectedObject.scale.x;
    settings.rotationY = THREE.MathUtils.radToDeg(selectedObject.rotation.y);
    scaleController.updateDisplay();
    rotationController.updateDisplay();
    showTransformControllers();
  } else {
    hideTransformControllers();
  }
}

function showTransformControllers() {
  scaleController.domElement.parentNode.parentNode.style.display = "";
  rotationController.domElement.parentNode.parentNode.style.display = "";
}

function hideTransformControllers() {
  scaleController.domElement.parentNode.parentNode.style.display = "none";
  rotationController.domElement.parentNode.parentNode.style.display = "none";
}
