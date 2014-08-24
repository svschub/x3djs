X3d = function () {
};

X3d.transformObjectByMatrix = function(object, transformationMatrix) {
    if (object instanceof THREE.Object3D) {
        object.applyMatrix(transformationMatrix);

        if (object instanceof THREE.SpotLight) {
            object.target.position.applyMatrix4(transformationMatrix);
        }
    }
};
