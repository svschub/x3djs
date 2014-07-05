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
        texture = X3d.textureTree.loadTexture(appearance.texture);
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
    X3d.lights = [];

    if (!X3d.textureTree) {
        X3d.textureTree = new X3d.TextureTree();
    }

    X3d.scene = X3d.Node.parse(X3d.x3dSceneNode);

    X3d.lights.forEach(function(light) {
        X3d.scene.add(light);
    });
};

X3d.loadTextureTreeFromXml = function(xmlFile) {
    $.ajax({
        url: xmlFile,
        type: 'GET',
        async: false,
        cache: false,
        timeout: 30000,
        data: {},
        success: function(xmlResponse) {
            X3d.textureTree = new X3d.TextureTree();
            X3d.textureTree.loadFromXml($(xmlResponse));
        },
        error: function(response) {
            console.log('error: ' + JSON.stringify(response));
        }
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

X3d.transformObjectByMatrix = function(object, transformationMatrix) {
    if (object instanceof THREE.Object3D) {
        object.applyMatrix(transformationMatrix);

        if (object instanceof THREE.SpotLight) {
            object.target.position.applyMatrix4(transformationMatrix);
        }
    }
};

