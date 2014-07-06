X3d = function () {
};

X3d.getMaterial = function(node, appearance) {
    var material,
        properties = {},
        texture,
        isTransparent = (appearance.material.transparency && appearance.material.transparency > 0.0);

    properties.shading = THREE.SmoothShading;
 
    properties.vertexColors = THREE.VertexColors;

    if (appearance.material.solid) {
        properties.side = THREE.FrontSide;
    } else {
        properties.side = THREE.DoubleSide;
    }

    if (appearance.texture && appearance.texture.name) {
        texture = X3d.sceneLoader.textureTree.loadTexture(appearance.texture);
        texture.needsUpdate = true;
        properties.map = texture;
    }

    if (isTransparent) {
        properties.transparent = isTransparent;
        properties.opacity = 1.0 - appearance.material.transparency;
    }

    material = new THREE.MeshLambertMaterial(properties);

    return material;
}

X3d.setCreateMaterialCallback = function(getMaterial) {
    X3d.getMaterial = getMaterial;
};

X3d.transformObjectByMatrix = function(object, transformationMatrix) {
    if (object instanceof THREE.Object3D) {
        object.applyMatrix(transformationMatrix);

        if (object instanceof THREE.SpotLight) {
            object.target.position.applyMatrix4(transformationMatrix);
        }
    }
};
