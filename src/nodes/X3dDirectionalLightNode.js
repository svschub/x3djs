X3d.DirectionalLightNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.DirectionalLightNode.prototype = Object.create(X3d.Node.prototype);

X3d.DirectionalLightNode.prototype.parse = function() {
    var attribute,
        light,
        values, lightColor, color, intensity, ambientIntensity, direction;

    console.log('parsing X3D directional light');

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
        if (ambientIntensity > 0.0) {
            console.log('adding ambient light component with intensity ' + ambientIntensity);
            X3d.ambientLights.push(new THREE.AmbientLight(
                lightColor.multiplyScalar(ambientIntensity).getHex()
            ));
        }
    }

    attribute = this.node.attr('direction');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        direction = new THREE.Vector3(values[0], values[1], values[2]);
    }

    light = new THREE.DirectionalLight(color, intensity);
    light.position = direction;
    light.position.negate();

    return light;
};
