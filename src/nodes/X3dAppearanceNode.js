X3d.AppearanceNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.AppearanceNode.prototype = Object.create(X3d.Node.prototype);

X3d.AppearanceNode.prototype.parse = function() {
    var child,
        appearance = {};

    console.log('parsing X3D appearance');

    this.node.children().each(function() {
        try {
            child = X3d.Node.parse($(this));
            switch ($(this).prop('tagName')) {
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

    return appearance;
};
