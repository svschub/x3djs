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
        texture = THREE.ImageUtils.loadTexture(appearance.texture.name);
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

X3d.loadSceneFromX3d = function(x3dNode) {
    X3d.cachedNodes = {};

    X3d.x3dSceneNode = x3dNode.find("Scene");

    X3d.sceneCamera = null;

    X3d.background = {};

    X3d.ambientLights = [];

    X3d.scene = X3d.Node.parse(X3d.x3dSceneNode);

    X3d.ambientLights.forEach(function(ambientLight) {
        X3d.scene.add(ambientLight);
    });
};

X3d.getScene = function () {
    return X3d.scene;
};

X3d.getCamera = function () {
    return X3d.sceneCamera;
};

X3d.getAmbientLights = function () {
    return ambientLights;
};

X3d.hasNode = function(identifier) {
    return (X3d.cachedNodes[identifier] !== null);
};

X3d.getNode = function(identifier) {
    return X3d.cachedNodes[identifier];
};
