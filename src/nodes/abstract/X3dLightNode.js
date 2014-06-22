X3d.LightNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.LightNode.prototype = Object.create(X3d.Node.prototype);

X3d.LightNode.prototype.parseBasicLightProperties = function() {
    var attribute,
        values, 
        ambientIntensity,
        ambientColor;

    console.log('parsing X3D light');

    this.color = new THREE.Color();
    attribute = this.node.attr('color');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        this.color.setRGB(values[0], values[1], values[2]);
    } else {
        this.color.setRGB(1.0, 1.0, 1.0);
    }

    attribute = this.node.attr('intensity');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        this.intensity = values[0];
    } else {
        this.intensity = 1.0;
    }

    attribute = this.node.attr('ambientIntensity');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        ambientIntensity = values[0];
        if (ambientIntensity > 0.0) {
            console.log('adding ambient light component with intensity ' + ambientIntensity);
            ambientColor = new THREE.Color();
            ambientColor.copy(this.color);
            ambientColor.multiplyScalar(ambientIntensity);
            X3d.ambientLights.push(new THREE.AmbientLight(ambientColor.getHex()));
        }
    }
};
