function applyBrush() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(ground);
  if (intersects.length > 0) {
    const point = intersects[0].point;
    const vertices = ground.geometry.attributes.position;
    const normals = ground.geometry.attributes.normal;
    const vertex = new THREE.Vector3();
    const normal = new THREE.Vector3();
    for (let i = 0; i < vertices.count; i++) {
      vertex.fromBufferAttribute(vertices, i);
      const worldVertex = ground.localToWorld(vertex.clone());
      const distance = worldVertex.distanceTo(point);
      if (distance < settings.brushRadius) {
        const influence = (settings.brushRadius - distance) / settings.brushRadius;
        normal.fromBufferAttribute(normals, i);
        vertex.addScaledVector(normal, influence * settings.brushStrength);
        vertices.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
    }
    vertices.needsUpdate = true;
    ground.geometry.computeVertexNormals();
  }
}
