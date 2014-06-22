X3d.AppearanceNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.AppearanceNode.prototype = Object.create(X3d.Node.prototype);

X3d.AppearanceNode.prototype.parse = function() {
    var appearance = {};

    console.log('parsing X3D appearance');

    this.node.children().each(function() {
        var child, childNode = $(this);

        try {
            child = X3d.Node.parse(childNode);
            switch (childNode.prop('tagName')) {
                case "Material":
                    appearance.material = child;
                    break;
                case "ImageTexture":
                    appearance.texture = child;
                    break;
                case "TextureTransform":
                    appearance.textureTransform = child;
                    break;
                default:
            }
        } catch (e) {
            throw e;
        }
    });

    if (typeof appearance.material === "undefined") {
        console.log('adding standard material');
        appearance.material = {
            diffuseColor: new THREE.Color()
        };

        appearance.material.diffuseColor.setRGB(1.0, 1.0, 1.0);
    }

    return appearance;
};
