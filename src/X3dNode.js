X3d.Node = function(node) {
    this.node = node;
};

X3d.Node.getInstance = function(node) {
    var tagName = node.prop('tagName'),
        nodeInstance = null;

    switch (tagName) {
        case "NavigationInfo":
            nodeInstance = new X3d.NavigationInfoNode(node);
            break;
        case "Background":
            nodeInstance = new X3d.BackgroundNode(node);
            break;
        case "Scene":
            nodeInstance = new X3d.SceneNode(node);
            break;
        case "Transform":
            nodeInstance = new X3d.TransformNode(node);
            break;
        case "Group":
            nodeInstance = new X3d.GroupNode(node);
            break;
        case "Shape":
            nodeInstance = new X3d.ShapeNode(node);
            break;
        case "DirectionalLight":
            nodeInstance = new X3d.DirectionalLightNode(node);
            break;
        case "PointLight":
            nodeInstance = new X3d.PointLightNode(node);
            break;
        case "Viewpoint":
            nodeInstance = new X3d.ViewpointNode(node);
            break;
        case "Appearance":
            nodeInstance = new X3d.AppearanceNode(node);
            break;
        case "Material":
            nodeInstance = new X3d.MaterialNode(node);
            break;
        case "ImageTexture":
            nodeInstance = new X3d.ImageTextureNode(node);
            break;
        case "TextureTransform":
            nodeInstance = new X3d.TextureTransformNode(node);
            break;
        case "IndexedFaceSet":
            nodeInstance = new X3d.IndexedFaceSetNode(node);
            break;
        case "Coordinate":
            nodeInstance = new X3d.CoordinateNode(node);
            break;
        case "TextureCoordinate":
            nodeInstance = new X3d.TextureCoordinateNode(node);
            break;
        default:
            throw new X3d.UnknownNodeException();
    }

    return nodeInstance;
};

X3d.Node.parse = function(node) {
    var identifier = node.attr('DEF') || node.attr('USE'),
        nodeToParse,
        nodeInstance,
        parsedNode;

    if (identifier && X3d.cachedNodes[identifier]) {
        parsedNode = X3d.cachedNodes[identifier];
        console.log('cached node: ' + identifier);
    } else {
        if (node.attr('USE')) {
            nodeToParse = X3d.x3dSceneNode.find('[DEF="' + node.attr('USE') + '"]');
        } else {
            nodeToParse = node;
        }

        nodeInstance = X3d.Node.getInstance(nodeToParse);
        parsedNode = nodeInstance.parse();

        if (identifier) {
            X3d.cachedNodes[identifier] = parsedNode;
        }
    }

    return parsedNode;
};

X3d.Node.prototype.parseArray = function(str, fcn) {
    var trimmedStr, 
        splitStr;

    trimmedStr = str.replace(/\s+/g, ' ');
    trimmedStr = trimmedStr.replace(/^\s+/, '');
    trimmedStr = trimmedStr.replace(/\s+$/, '');

    splitStr = trimmedStr.split(' ');

    return splitStr.map(fcn);
};

X3d.Node.prototype.parseIntArray = function(str) {
    return this.parseArray(str, function(x) {
        return parseInt(x);
    });
};

X3d.Node.prototype.parseFloatArray = function(str) {
    return this.parseArray(str, function(x) {
        return parseFloat(x);
    });
};

X3d.Node.prototype.parseVector2 = function(str) {
    var coordinates = this.parseFloatArray(str);

    return new THREE.Vector2(coordinates[0], coordinates[1]);
};

X3d.Node.prototype.parseVector2Array = function(str) {
    var coordinates = this.parseFloatArray(str),
        n = coordinates.length,
        vectors = [],
        i = 0;

    while (i < n) {
        vectors.push(new THREE.Vector2(coordinates[i], coordinates[i + 1]));
        i = i + 2;
    }

    return vectors;
};

X3d.Node.prototype.parseVector3 = function(str) {
    var coordinates = this.parseFloatArray(str);

    return new THREE.Vector3(coordinates[0], coordinates[1], coordinates[2]);
};

X3d.Node.prototype.parseVector3Array = function(str) {
    var coordinates = this.parseFloatArray(str),
        n = coordinates.length,
        vectors = [],
        i = 0;

    while (i < n) {
        vectors.push(new THREE.Vector3(coordinates[i], coordinates[i + 1], coordinates[i + 2]));
        i = i + 3;
    }

    return vectors;
};

X3d.Node.prototype.isCamera = function(node) {
    return (node instanceof THREE.Camera);
};

X3d.Node.prototype.isLightSource = function(node) {
    return (node instanceof THREE.Light);
};
