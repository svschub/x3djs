X3d.TextureTree = function () {
    this.textures = {};
};

X3d.TextureTree.getTextureIdByName = function(textureName) {
    return textureName.replace('.', '_');
};

X3d.TextureTree.prototype.loadFromXml = function(xmlDoc) {
    var self = this,
        texturesNode = xmlDoc.find("textures");

    self.textures = {};

    texturesNode.children().each(function () {
        self.parseTextureNode(self, $(this), null);
    });
};

X3d.TextureTree.prototype.parseTextureNode = function(self, textureNode, parentId) {
    var attribute,
        textureId,
        texture = {},
        parentTexture;

    attribute = textureNode.attr('name');
    if (!attribute) {
        throw new X3d.InvalidTextureException('Attribute name is mandatory');
    }
    texture.name = attribute;

    textureId = X3d.TextureTree.getTextureIdByName(texture.name);

    attribute = textureNode.attr('url');
    if (!parentId && !attribute) {
        throw new X3d.InvalidTextureException('Attribute url is mandatory for root level textures');
    }
    texture.url = attribute;

    attribute = textureNode.attr('width');
    if (!attribute) {
        throw new X3d.InvalidTextureException('Attribute width is mandatory');
    }
    texture.width = parseInt(attribute);

    attribute = textureNode.attr('height');
    if (!attribute) {
        throw new X3d.InvalidTextureException('Attribute height is mandatory');
    }
    texture.height = parseInt(attribute);

    attribute = textureNode.attr('left');
    if (attribute) {
        texture.left = parseInt(attribute);
    }

    attribute = textureNode.attr('top');
    if (attribute) {
        texture.top = parseInt(attribute);
    }

    if (parentId) {
        texture.parentId = parentId;
        parentTexture = self.textures[parentId];
        if (parentTexture.parentId) {
            throw new X3d.Exception("Texture tree can only have hierarchy depth <= 2!");
        }

        texture.ub = texture.left/parentTexture.width;
        texture.ua = texture.width/parentTexture.width;
        // => u0 = ua*u + ub

        texture.vb = 1.0 - (texture.height + texture.top)/parentTexture.height;
        texture.va = texture.height/parentTexture.height;
        // => v0 = va*v + vb
    } else {
        texture.callbacks = [];
    }

    self.textures[textureId] = texture;

    textureNode.children().each(function () {
        self.parseTextureNode(self, $(this), textureId);
    });
};

X3d.TextureTree.prototype.loadTexture = function(textureProperties, onLoadCallback) {
    var textureId = X3d.TextureTree.getTextureIdByName(textureProperties.name),
        parentTextureId,
        texture,
        loadedTexture = null;

    if (this.textures[textureId]) {
        /**
         * Texture already exists within the tree.
         * Check if it is a root level texture.
         */

        if (this.textures[textureId].parentId) {
            // Texture has a parent texture. Redirect to the parent texture.
            parentTextureId = this.textures[textureId].parentId;
            if (this.textures[parentTextureId]) {
                texture = this.textures[parentTextureId];
                console.log('texture ' + textureId + ' found in tree, loading parent url ' + texture.url);
            }
        } else {
            // This texture is a root level texture:
            texture = this.textures[textureId];
            console.log('root level texture ' + textureId + ' found in tree, loading url ' + texture.url);
        }
    } else {
        /**
         * This texture does not exist within the tree.
         * Create a new root level texture with this ID.
         */

        this.textures[textureId] = {
            name: textureProperties.name,
            url: textureProperties.url,
            callbacks: []
        }

        texture = this.textures[textureId];
        console.log('texture ' + textureId + ' not found in tree, loading ' + texture.url);
    }

    if (texture.url && !texture.parentId) {
        if (!texture.data) {
            texture.data = new THREE.Texture(undefined, THREE.UVMapping);
        }

        // register callbacks only root level textures:
        texture.callbacks.push(onLoadCallback);
    }

    return texture.data;
};

X3d.TextureTree.prototype.evaluateCallbacks = function () {
    var self = this,
        texture;

    for (var textureId in self.textures) {
        (function(id) {
            var texture = self.textures[id],
                loader = new THREE.ImageLoader();

            if (!texture.parentId && texture.callbacks.length > 0) {
                loader.load(texture.url, function(image) {
                    texture.data.image = image;
                    texture.data.needsUpdate = true;
                    texture.callbacks.forEach(function(callback) {
                        callback(texture.data);
                    });
                });
            }
        }(textureId));
    }
};

X3d.TextureTree.prototype.getAbsoluteCoordinates = function(textureName, coordinates) {
    var textureId = X3d.TextureTree.getTextureIdByName(textureName),
        texture,
        u, v,
        absCoordinates = [];

    console.log('texture UVs: ' + JSON.stringify(coordinates));

    if (this.textures[textureId] && this.textures[textureId].parentId) {
        console.log('texture ' + textureName + '(id=' + textureId + ') has parent with id=' + this.textures[textureId].parentId);
        texture = this.textures[textureId];

        coordinates.forEach(function(uv) {
            u = texture.ua*uv.x + texture.ub;
            if (u < 0.0) { u = 0.0; }
            if (u > 1.0) { u = 1.0; }

            v = texture.va*uv.y + texture.vb;
            if (v < 0.0) { v = 0.0; }
            if (v > 1.0) { v = 1.0; }

            absCoordinates.push(new THREE.Vector2(u, v));
        });
    } else {
        console.log('texture ' + textureName + ' (id=' + textureId + ') has no parent');
        absCoordinates = coordinates;
    }

    console.log('absolute UVs: ' + JSON.stringify(absCoordinates));
    return absCoordinates;
};
