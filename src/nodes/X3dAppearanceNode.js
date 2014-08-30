X3d.AppearanceNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.AppearanceNode.prototype = Object.create(X3d.Node.prototype);

X3d.AppearanceNode.prototype.parse = function(sceneLoader) {
    var self = this;

    console.log('parsing X3D appearance');

    self.node.children().each(function() {
        var child, childNode = $(this);

        try {
            child = sceneLoader.parseX3dNode(childNode);

            if (child instanceof X3d.MaterialNode) {
                self.material = child;
            } else if (child instanceof X3d.LinePropertiesNode) {
                self.lineProperties = child;
            } else if (child instanceof X3d.ImageTextureNode) {
                self.texture = child;
            } else if (child instanceof X3d.TextureTransformNode) {
                self.textureTransform = child;
            }
        } catch (e) {
            throw e;
        }
    });

    return self;
};

X3d.AppearanceNode.prototype.getMaterialProperties = function(sceneLoader) {
    var self = this,
        properties = {},
        texture,
        isTransparent = (self.material.transparency && self.material.transparency > 0.0);

    properties.shading = THREE.SmoothShading;
 
    properties.vertexColors = THREE.VertexColors;

    if (self.material.solid) {
        properties.side = THREE.FrontSide;
    } else {
        properties.side = THREE.DoubleSide;
    }

    if (self.texture && self.texture.name) {
        texture = sceneLoader.textureTree.loadTexture(self.texture, function(loadedTexture) {
            texture.needsUpdate = true;
        });

        properties.map = texture;
    }

    if (isTransparent) {
        properties.transparent = isTransparent;
        properties.opacity = 1.0 - self.material.transparency;
    }

    return properties;
};
