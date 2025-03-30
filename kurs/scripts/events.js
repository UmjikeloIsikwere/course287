function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (settings.mode === "brush" && isPainting) {
    applyBrush();
  }

  if (settings.mode === "select" && isDragging && selectedObject) {
    raycaster.setFromCamera(mouse, camera);
    const intersectionPoint = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
      selectedObject.position.copy(intersectionPoint.add(dragOffset));
    }
  }
}

function onMouseWheel(event) {
  if (settings.mode === "brush") {
    settings.brushRadius += event.deltaY * 0.01;
    if (settings.brushRadius < 1) settings.brushRadius = 1;
  }
}

function onMouseDown(event) {
    if (event.target.closest('.dg')) {
      return;
    }
    
    if (settings.mode === "brush" && event.button === 0) {
      isPainting = true;
    } else if (settings.mode === "select" && event.button === 0) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster
        .intersectObjects(scene.children, true)
        .filter(i => i.object !== ground && i.object !== sky);
      if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        if (selectedObject.parent && selectedObject.parent !== scene) {
          selectedObject = selectedObject.parent;
        }
        updateTransformControllers();
        isDragging = true;
        dragPlane.set(new THREE.Vector3(0, 1, 0), -selectedObject.position.y);
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
        dragOffset.copy(selectedObject.position).sub(intersectionPoint);
      } else {
        selectedObject = null;
        updateTransformControllers();
      }
    }
  }
  

function onMouseUp(event) {
  if (settings.mode === "brush") {
    isPainting = false;
  }
  if (settings.mode === "select") {
    isDragging = false;
  }
}

function onCameraMouseDown(event) {
  if (event.button === 2) {
    isRightDragging = true;
    initialMouseY = event.clientY;
    initialCameraTilt = camera.rotation.x;
  }
}

function onCameraMouseMove(event) {
  if (isRightDragging) {
    const deltaY = event.clientY - initialMouseY;
    camera.rotation.x = initialCameraTilt + deltaY * 0.005;
    camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, camera.rotation.x));
  }
}

function onCameraMouseUp(event) {
  if (event.button === 2) {
    isRightDragging = false;
  }
}

function addEventListeners() {
  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("wheel", onMouseWheel, false);
  window.addEventListener("mousedown", onMouseDown, false);
  window.addEventListener("mouseup", onMouseUp, false);

  renderer.domElement.addEventListener("mousedown", onCameraMouseDown, false);
  renderer.domElement.addEventListener("mousemove", onCameraMouseMove, false);
  renderer.domElement.addEventListener("mouseup", onCameraMouseUp, false);

  renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault(), false);
}
