function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function init() {
  initScene();
  initGUI();
  addEventListeners();
}

init();
animate();
