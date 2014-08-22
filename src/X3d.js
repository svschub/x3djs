X3d = function () {
};

X3d.createMaterial = function(properties) {
    return new THREE.MeshLambertMaterial(properties);
}

X3d.setCreateMaterialCallback = function(createMaterial) {
    X3d.createMaterial = createMaterial;
};

X3d.transformObjectByMatrix = function(object, transformationMatrix) {
    if (object instanceof THREE.Object3D) {
        object.applyMatrix(transformationMatrix);

        if (object instanceof THREE.SpotLight) {
            object.target.position.applyMatrix4(transformationMatrix);
        }
    }
};
