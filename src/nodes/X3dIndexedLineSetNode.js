X3d.IndexedLineSetNode = function(node) {
    X3d.GeometryNode.call(this, node);
};

X3d.IndexedLineSetNode.prototype = Object.create(X3d.GeometryNode.prototype);

X3d.IndexedLineSetNode.prototype.parse = function(sceneLoader) {
    var self = this,
        child,
        attribute;

    console.log('parsing X3D indexed line set');

    attribute = self.node.attr('coordIndex');
    if (attribute) {
        self.coordIndex = self.parseIntArray(attribute);
    }

    attribute = this.node.attr('colorIndex');
    if (attribute) {
        self.colorIndex = self.parseIntArray(attribute);
    }

    self.node.children().each(function() {
        var childNode = $(this);

        try {
            child = sceneLoader.parseX3dNode(childNode);

            if (child instanceof X3d.CoordinateNode) {
                self.vertexCoordinates = child.coordinates;
            } else if (child instanceof X3d.ColorNode) {
                self.vertexColors = child.colors;
            }
        } catch (e) {
            throw e;
        }
    });

    return self;
};


X3d.IndexedLineSetNode.prototype.createMesh = function(appearance, sceneLoader) {
    var self = this,
        lines = new THREE.Object3D(),
        lineStripGeometry,
        lineStripLength = 0,
        lineStripCounter = 0,
        indexCounter = 0,
        colorIndex,
        materialProperties = {},
        finalizeLineStrip = function() {
            lines.add(new THREE.Line(
                lineStripGeometry,
                new THREE.LineBasicMaterial(materialProperties)
            ));

            lineStripLength = 0;
            lineStripCounter++;
        };

    console.log("creating line strips...");


    if (self.colorIndex && self.vertexColors) {
        materialProperties.vertexColors = THREE.VertexColors;
    } else if (appearance.material && appearance.material.emissiveColor) {
        materialProperties.color = appearance.material.emissiveColor.getHex();
    } else {
        materialProperties.color = 0xffffff;
    }

    if (appearance.lineProperties && appearance.lineProperties.lineWidth) {
        materialProperties.linewidth = appearance.lineProperties.lineWidth;
    } else {
        materialProperties.linewidth = 1.0;
    }

    if (appearance.material &&
        appearance.material.transparency &&
        appearance.material.transparency > 0.0) {

        materialProperties.transparent = true;
        materialProperties.opacity = 1.0 - appearance.material.transparency;
    }


    self.coordIndex.forEach(function(index) {
        var vertexColor;

        if (index >= 0) {
            if (lineStripLength == 0) {
                lineStripGeometry = new THREE.Geometry();
                lineStripGeometry.vertices = [];
                lineStripGeometry.colors = [];
//              lineStripGeometry.colorsNeedUpdate = true;
            }

            lineStripGeometry.vertices.push(new THREE.Vector3(
                self.vertexCoordinates[index].x,
                self.vertexCoordinates[index].y,
                self.vertexCoordinates[index].z
            ));

            if (self.colorIndex && self.vertexColors) {
                colorIndex = self.colorIndex[indexCounter];

                vertexColor = new THREE.Color();
                vertexColor.setRGB(
                    self.vertexColors[colorIndex].r,
                    self.vertexColors[colorIndex].g,
                    self.vertexColors[colorIndex].b
                );

                lineStripGeometry.colors.push(vertexColor);
            }

            lineStripLength++;
        } else {
            if (lineStripLength > 0) {
                finalizeLineStrip();
            }
        }

        indexCounter++;
    });

    if (lineStripLength > 0) {
        finalizeLineStrip();
    }

    return lines;
};
