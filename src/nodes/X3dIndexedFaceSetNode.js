X3d.IndexedFaceSetNode = function(node) {
    X3d.GeometryNode.call(this, node);
};

X3d.IndexedFaceSetNode.prototype = Object.create(X3d.GeometryNode.prototype);

X3d.IndexedFaceSetNode.prototype.parse = function(sceneLoader) {
    var self = this,
        child,
        attribute,
        creaseAngle,
        results;

    console.log('parsing X3D indexed face set');

    attribute = self.node.attr('solid');
    if (attribute) {
        self.solid = (attribute === "true");
    } else {
        self.solid = false;
    }

    attribute = self.node.attr('creaseAngle');
    if (attribute) {
        results = self.parseFloatArray(attribute);
        self.creaseAngle = results[0];
    } else {
        self.creaseAngle = 0.0;
    }

    attribute = self.node.attr('coordIndex');
    if (attribute) {
        self.coordIndex = self.parseIntArray(attribute);
    }

    attribute = self.node.attr('texCoordIndex');
    if (attribute) {
        self.texCoordIndex = self.parseIntArray(attribute);
    }

    self.node.children().each(function() {
        var childNode = $(this);

        try {
            child = sceneLoader.parseX3dNode(childNode);
            
            if (child instanceof X3d.CoordinateNode) {
                self.vertexCoordinates = child.coordinates;
            } else if (child instanceof X3d.TextureCoordinateNode) {
                self.textureCoordinates = child.coordinates;
            }
        } catch (e) {
            throw e;
        }
    });

    return self;
};

X3d.IndexedFaceSetNode.prototype.createMesh = function(appearance, sceneLoader) {
    var self = this,

        geometry = new THREE.Geometry(),
        vertices = [],
        faceVertices = [0, 0, 0],
        face,
        vertexCounter = 0,
        vertexColor,

        adjustNormalsMutuallyIfNecessary = function(face1, normal1, face2, normal2, cosCreaseAngle) {
            var cosAngle = face1.normal.dot(face2.normal) / (face1.normal.length() * face2.normal.length());

            if (cosAngle >= cosCreaseAngle) {
                face1.vertexNormals[normal1].add(face2.normal);
                face2.vertexNormals[normal2].add(face1.normal);
            }
        },

        createUvVectors = function(geometry, texCoordIndex, textureCoordinates, texture) {
            var absTextureCoordinates = sceneLoader.textureTree.getAbsoluteCoordinates(texture.name, textureCoordinates),
                faceVertices = [0, 0, 0],
                vertexCounter = 0;

//            console.log('creating UV coordinates: ' + JSON.stringify(texCoordIndex) + ', ' + JSON.stringify(textureCoordinates));

            texCoordIndex.forEach(function(index) {
                if (index >= 0) {
                    if (vertexCounter < 3) {
                        faceVertices[vertexCounter] = index;
                        vertexCounter++;
                    }

                    if (vertexCounter == 3) {
                        geometry.faceVertexUvs[0].push([
                            new THREE.Vector2(absTextureCoordinates[faceVertices[0]].x, absTextureCoordinates[faceVertices[0]].y),
                            new THREE.Vector2(absTextureCoordinates[faceVertices[1]].x, absTextureCoordinates[faceVertices[1]].y),
                            new THREE.Vector2(absTextureCoordinates[faceVertices[2]].x, absTextureCoordinates[faceVertices[2]].y)
                        ]);

                        faceVertices[1] = index;
                        vertexCounter = 2;
                    }
                } else {
                    vertexCounter = 0;
                }
            });
        },

        computeVertexNormals = function(faces, cosCreaseAngle) {
            var vertices = {},
                faceIndex,
                indexedFaces,
                faceVertices,
                nConnectedFaces,
                face1, face2;

//            console.log('computing vertex normals ...');

            faceIndex = 0;
            faces.forEach(function(face) {
                if (!(face.a in vertices)) {
                    vertices[face.a] = {};
                }
                vertices[face.a][faceIndex] = 0;

                if (!(face.b in vertices)) {
                    vertices[face.b] = {};
                }
                vertices[face.b][faceIndex] = 1;

                if (!(face.c in vertices)) {
                    vertices[face.c] = {};
                }
                vertices[face.c][faceIndex] = 2;

                faceIndex++;
            });

            for (var vertex in vertices) {
                faceVertices = vertices[vertex];

                indexedFaces = [];
                for (var face in faceVertices) {
                    indexedFaces.push(face);
                }

                nConnectedFaces = indexedFaces.length;
                for (var i = 0; i < nConnectedFaces; i++) {
                    for (var j = i + 1; j < nConnectedFaces; j++) {
                        face1 = indexedFaces[i];
                        face2 = indexedFaces[j];
                        adjustNormalsMutuallyIfNecessary(
                            faces[face1], faceVertices[face1],
                            faces[face2], faceVertices[face2],
                            cosCreaseAngle
                        );
                    }
                }
            }

            faces.forEach(function(face) {
                face.vertexNormals.forEach(function(vertexNormal) {
                    vertexNormal.normalize();
                });
            });
        },

        createGeometryVertices = function(geometry, vertices) {
            var vertexMap = {},
                vertexMapSize = 0,
                vertexIndex;

            geometry.faces.forEach(function(face) {
                vertexMap[face.a] = 0;
                vertexMap[face.b] = 0;
                vertexMap[face.c] = 0;
            });

            for (var vertex in vertexMap) {
                vertexMapSize++;
            }

            geometry.vertices = [];
            if (vertexMapSize < vertices.length) {
                vertexIndex = 0;
                for (var vertex in vertexMap) {
                    geometry.vertices.push(vertices[vertex].clone());
                    vertexMap[vertex] = vertexIndex;
                    vertexIndex++;
                }

                geometry.faces.forEach(function(face) {
                    face.a = vertexMap[face.a];
                    face.b = vertexMap[face.b];
                    face.c = vertexMap[face.c];
                });

//                console.log('creating geometry vertices: reduced: ' + vertexMapSize + ' of ' + vertices.length);
//                console.log(JSON.stringify(vertexMap));
            } else {
//                console.log('creating geometry vertices: all: ' + vertices.length);
                vertices.forEach(function(vertex) {
                    geometry.vertices.push(vertex.clone());
                });
            }
        };

    console.log("creating face geometry...");

    if (typeof appearance.material === "undefined") {
        console.log('no material found, adding standard material');
        appearance.material = {
            diffuseColor: new THREE.Color()
        };

        appearance.material.diffuseColor.setRGB(1.0, 1.0, 1.0);
    }

    if (appearance.material.diffuseColor) {
        vertexColor = appearance.material.diffuseColor;
    } else {
        vertexColor = appearance.material.emissiveColor;
    }

    appearance.material.solid = self.solid;

    geometry.faces = [];
    self.coordIndex.forEach(function(index) {
        if (index >= 0) {
            if (vertexCounter < 3) {
                faceVertices[vertexCounter] = index;
                vertexCounter++;
            }

            if (vertexCounter === 3) {
                face = new THREE.Face3(faceVertices[0], faceVertices[1], faceVertices[2]);
                geometry.faces.push(face);
                faceVertices[1] = index;
                vertexCounter = 2;
            }
        } else {
            vertexCounter = 0;
        }
    });

    self.vertexCoordinates.forEach(function(vertex) {
        vertices.push(vertex.clone());
    });

    createGeometryVertices(geometry, vertices);

    geometry.faceVertexUvs[0] = [];

    geometry.computeFaceNormals();
    geometry.computeCentroids();

    geometry.faces.forEach(function(face) {
        face.vertexNormals = [
            face.normal.clone(),
            face.normal.clone(),
            face.normal.clone()
        ];

        face.vertexColors = [
            vertexColor.clone(),
            vertexColor.clone(),
            vertexColor.clone()
        ];
    });

    if (self.creaseAngle > 0.0) {
        computeVertexNormals(geometry.faces, Math.cos(self.creaseAngle));
    }

    if (appearance.texture &&
        self.textureCoordinates.length > 0 &&
        self.texCoordIndex.length > 0) {

        createUvVectors(
            geometry, 
            self.texCoordIndex, 
            self.textureCoordinates,
            appearance.texture
        );
    }

    return new THREE.Mesh(
        geometry,
        sceneLoader.createMaterial(appearance.getMaterialProperties(sceneLoader))
    );
};
