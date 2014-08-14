X3d.SceneLoader = function () {
    this.cachedNodes = {};
    this.background = {};
    this.scene = null;
    this.sceneCamera = null;
    this.lights = [];
    this.textureTree = new X3d.TextureTree();
};

X3d.SceneLoader.prototype.loadSceneFromX3d = function(x3dFile, onSuccessCallback, onErrorCallback) {
    var self = this;

    self.cachedNodes = {};
    self.background = {};
    self.sceneCamera = null;
    self.lights = [];

    X3d.sceneLoader = self;

    $.ajax({
        url: x3dFile,
        type: 'GET',
        async: (typeof onSuccessCallback === "function"),
        cache: false,
        timeout: 30000,
        data: {},
        success: function(x3dResponse) {
            try {
                X3d.x3dSceneNode = $(x3dResponse).find("Scene");

                self.scene = X3d.Node.parse(X3d.x3dSceneNode);

                self.lights.forEach(function(light) {
                    self.scene.add(light);
                });

                self.textureTree.evaluateCallbacks();
            } catch (e) {
                if (onErrorCallback) {
                    onErrorCallback(e);
                } else {
                    throw e;
                }
            }

            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        error: function(response) {
            var message = "Could not load scene from file " + x3dFile + "!";

            if (onErrorCallback) {
                onErrorCallback(message);
            } else {
                throw new X3d.Exception(message);
            }
        }
    });
};

X3d.SceneLoader.prototype.loadTextureTreeFromXml = function(xmlFile, onSuccessCallback, onErrorCallback) {
    var self = this;

    self.textureTree = new X3d.TextureTree();

    $.ajax({
        url: xmlFile,
        type: 'GET',
        async: (typeof onSuccessCallback === "function"),
        cache: false,
        timeout: 30000,
        data: {},
        success: function(xmlResponse) {
            try {
                self.textureTree.loadFromXml($(xmlResponse));
            } catch (e) {
                if (onErrorCallback) {
                    onErrorCallback(e);
                } else {
                    throw e;
                }
            }

            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        error: function(response) {
            var message = "Could not load texture tree from file " + xmlFile + "!";

            if (onErrorCallback) {
                onErrorCallback(message);
            } else {
                throw new X3d.Exception(message);
            }
        }
    });
};

X3d.SceneLoader.prototype.unloadTextureTree = function () {
    this.textureTree = new X3d.TextureTree();
};

X3d.SceneLoader.prototype.getScene = function () {
    return this.scene;
};

X3d.SceneLoader.prototype.getCamera = function () {
    return this.sceneCamera;
};

X3d.SceneLoader.prototype.getLights = function () {
    return this.lights;
};

X3d.SceneLoader.prototype.hasNode = function(identifier) {
    return (this.cachedNodes[identifier] !== null);
};

X3d.SceneLoader.prototype.getNode = function(identifier) {
    return this.cachedNodes[identifier];
};
        