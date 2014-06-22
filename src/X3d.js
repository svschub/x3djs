X3d = function () {
};

X3d.setCreateMaterialCallback = function(getMaterial) {
    X3d.getMaterial = getMaterial;
}

X3d.loadSceneFromX3d = function(x3dNode) {
    X3d.cachedNodes = {};

    X3d.x3dSceneNode = x3dNode.find("Scene");

    X3d.sceneCamera = null;

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
