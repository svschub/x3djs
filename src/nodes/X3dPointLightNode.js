X3d.PointLightNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.PointLightNode.prototype = Object.create(X3d.Node.prototype);

X3d.PointLightNode.prototype.parse = function() {
    var attribute,
        values, 
        light,
        lightColor, color, intensity, ambientIntensity, distance;

    console.log('parsing X3D point light');

    attribute = this.node.attr('color');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        lightColor = new THREE.Color();
        lightColor.setRGB(values[0], values[1], values[2]);
        color = lightColor.getHex();
    } else {
        color = 0xffffff;
    }

    attribute = this.node.attr('intensity');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        intensity = values[0];
    } else {
        intensity = 1.0;
    }

    attribute = this.node.attr('ambientIntensity');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        ambientIntensity = values[0];
        X3d.ambientLightColor.add(lightColor.multiplyScalar(ambientIntensity));
    }

    attribute = this.node.attr('radius');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        distance = values[0];
    } else {
        distance = 0;
    }

    light = new THREE.PointLight(color, intensity, distance);

    return light;
};
