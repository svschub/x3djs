X3d.SceneLoader = function () {
    this.x3dSceneNode = null;
    this.cachedNodes = {};
    this.background = {};
    this.scene = null;
    this.sceneCamera = null;
    this.lights = [];
    this.textureTree = new X3d.TextureTree();
    this.createMaterial = this.createMaterialDefaultHandler;

    this.deferred = null;
    this.promise = null;
};

X3d.SceneLoader.prototype.loadSceneFromX3d = function(x3dFile) {
    var self = this;

    self.deferred = new $.Deferred();
    self.promise = self.deferred.promise();

    self.cachedNodes = {};
    self.background = {};
    self.sceneCamera = null;
    self.lights = [];

    $.when(self.textureTree.getPromise()).then(function () {
        return $.ajax({
            url: x3dFile,
            type: 'GET',
            data: {}
        });
    }).done(function(x3dResponse) {
        try {
            self.x3dSceneNode = $(x3dResponse).find("Scene");

            self.scene = self.parseX3dNode(self.x3dSceneNode);

            self.lights.forEach(function(light) {
                self.scene.add(light);
            });

            self.textureTree.evaluateCallbacks();
            self.deferred.resolve(self.scene);
        } catch (e) {
            self.deferred.reject(e.message);
        }
    }).fail(function(response) {
        self.deferred.reject(response);
    });

    return self.promise;
};

X3d.SceneLoader.prototype.parseX3dNode = function(node) {
    var self = this,
        identifier = node.attr('DEF') || node.attr('USE'),
        nodeToParse,
        nodeInstance,
        parsedNode;

    if (identifier && self.cachedNodes[identifier]) {
        parsedNode = self.cachedNodes[identifier];
        console.log('cached node: ' + identifier);
    } else {
        if (node.attr('USE')) {
            nodeToParse = self.x3dSceneNode.find('[DEF="' + node.attr('USE') + '"]');
        } else {
            nodeToParse = node;
        }

        nodeInstance = X3d.Node.getInstance(nodeToParse);
        parsedNode = nodeInstance.parse(self);

        if (identifier) {
            self.cachedNodes[identifier] = parsedNode;
        }
    }

    return parsedNode;
};

X3d.SceneLoader.prototype.getPromise = function () {
    return this.promise;
};

X3d.SceneLoader.prototype.loadTextureTreeFromXml = function(xmlFile) {
    var self = this;

    self.textureTree.loadFromXml(xmlFile);

    return self.textureTree.getPromise();
};

X3d.SceneLoader.prototype.unloadTextureTree = function () {
    this.textureTree = new X3d.TextureTree();
};

X3d.SceneLoader.prototype.getPromise = function () {
    return this.deferred.promise();
};

X3d.SceneLoader.prototype.setCreateMaterialHandler = function(createMaterialHandler) {
    this.createMaterial = createMaterialHandler;
};

X3d.SceneLoader.prototype.createMaterialDefaultHandler = function(properties) {
    return new THREE.MeshLambertMaterial(properties);
}

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
        