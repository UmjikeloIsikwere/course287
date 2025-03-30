function loadModel(modelName) {
  const modelPaths = {
    Фламинго: { path: "models/animal/Flamingo.glb", type: "glb" },
    Лошадь: { path: "models/animal/Horse.glb", type: "glb" },
    Попугай: { path: "models/animal/Parrot.glb", type: "glb" },
    Куст: { path: "models/bush/Bush1.obj", mtl: "models/bush/Bush1.mtl", type: "obj" },
    Забор: { path: "models/fence/grade.obj", mtl: "models/fence/grade.mtl", type: "obj" },
    Дом: { path: "models/house/Cyprys_House.obj", mtl: "models/house/Cyprys_House.mtl", type: "obj" },
    Пальма: { path: "models/tree/palm/Palma 001.obj", mtl: "models/tree/palm/Palma 001.mtl", type: "obj" },
    Ель: { path: "models/tree/pine/needle01.obj", mtl: "models/tree/pine/needle01.mtl", type: "obj" },
    Дерево: { path: "models/tree/tree/Tree.obj", mtl: "models/tree/tree/Tree.mtl", type: "obj" },
  };

  const modelInfo = modelPaths[modelName];
  if (!modelInfo) {
    console.error("Не найден путь для модели:", modelName);
    return;
  }

  if (modelInfo.type === "glb") {
    const loader = new THREE.GLTFLoader();
    loader.load(
      modelInfo.path,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        scene.add(model);
        console.log("Модель загружена:", modelName);
      },
      undefined,
      (error) => {
        console.error("Ошибка загрузки GLB модели:", error);
      }
    );
  } else if (modelInfo.type === "obj") {
    if (modelInfo.mtl) {
      const mtlLoader = new THREE.MTLLoader();
      mtlLoader.load(
        modelInfo.mtl,
        (materials) => {
          materials.preload();
          const objLoader = new THREE.OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.load(
            modelInfo.path,
            (object) => {
              object.position.set(0, 0, 0);
              scene.add(object);
              console.log("Модель загружена:", modelName);
            },
            undefined,
            (error) => {
              console.error("Ошибка загрузки OBJ модели:", error);
            }
          );
        },
        undefined,
        (error) => {
          console.error("Ошибка загрузки MTL файла:", error);
        }
      );
    } else {
      const objLoader = new THREE.OBJLoader();
      objLoader.load(
        modelInfo.path,
        (object) => {
          object.position.set(0, 0, 0);
          scene.add(object);
          console.log("Модель загружена:", modelName);
        },
        undefined,
        (error) => {
          console.error("Ошибка загрузки OBJ модели:", error);
        }
      );
    }
  } else {
    console.error("Неизвестный тип модели:", modelInfo.type);
  }
}

function removeSelectedObject() {
  if (selectedObject && selectedObject !== ground && selectedObject !== sky) {
    scene.remove(selectedObject);
    selectedObject = null;
    updateTransformControllers();
  }
}
