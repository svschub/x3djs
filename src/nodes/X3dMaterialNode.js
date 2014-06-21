X3d.MaterialNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.MaterialNode.prototype = Object.create(X3d.Node.prototype);

X3d.MaterialNode.prototype.parse = function() {
    var material = {},
        attribute,
        values;

    console.log('parsing X3D material');

    attribute = this.node.attr('diffuseColor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        material.diffuseColor = new THREE.Color();
        material.diffuseColor.setRGB(values[0], values[1], values[2]);
    }

    attribute = this.node.attr('specularColor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        material.specularColor = new THREE.Color();
        material.specularColor.setRGB(values[0], values[1], values[2]);
    }

    attribute = this.node.attr('emissiveColor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        material.emissiveColor = new THREE.Color();
        material.emissiveColor.setRGB(values[0], values[1], values[2]);
    }

    attribute = this.node.attr('ambientIntensity');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        material.ambientIntensity = values[0];
    }

    attribute = this.node.attr('shininess');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        material.shininess = values[0];
    }

    attribute = this.node.attr('transparency');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        material.transparency = values[0];
    }

    return material;
};
