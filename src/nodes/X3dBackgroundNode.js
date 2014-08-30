X3d.BackgroundNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.BackgroundNode.prototype = Object.create(X3d.Node.prototype);

X3d.BackgroundNode.prototype.parse = function(sceneLoader) {
    var background = {},
        attribute,
        values;

    console.log('parsing X3D background');

    background.groundColor = new THREE.Color();
    attribute = this.node.attr('groundColor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        background.groundColor.setRGB(values[0], values[1], values[2]);
    } else {
        background.groundColor.setRGB(0, 0, 0);
    }

    background.skyColor = new THREE.Color();
    attribute = this.node.attr('skyColor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        background.skyColor.setRGB(values[0], values[1], values[2]);
    } else {
        background.skyColor.setRGB(0, 0, 0);
    }

    X3d.background = background;

//    console.log('background: ' + JSON.stringify(background));

    return null;
};
