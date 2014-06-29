X3d.MaterialNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.MaterialNode.prototype = Object.create(X3d.Node.prototype);

X3d.MaterialNode.prototype.parse = function() {
    var self = this,
        attribute,
        values;

    console.log('parsing X3D material');

    attribute = this.node.attr('diffuseColor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        self.diffuseColor = new THREE.Color();
        self.diffuseColor.setRGB(values[0], values[1], values[2]);
    }

    attribute = this.node.attr('specularColor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        self.specularColor = new THREE.Color();
        self.specularColor.setRGB(values[0], values[1], values[2]);
    }

    attribute = this.node.attr('emissiveColor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        self.emissiveColor = new THREE.Color();
        self.emissiveColor.setRGB(values[0], values[1], values[2]);
    }

    attribute = this.node.attr('ambientIntensity');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        self.ambientIntensity = values[0];
    }

    attribute = this.node.attr('shininess');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        self.shininess = values[0];
    }

    attribute = this.node.attr('transparency');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        self.transparency = values[0];
    }

    return self;
};
