X3d.ShapeNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.ShapeNode.prototype = Object.create(X3d.Node.prototype);

X3d.ShapeNode.prototype.parse = function() {
    var child,
        appearance = {},
        indexedFaceSet = null,
        indexedLineSet = null,
        mesh = null,

        adjustNormalsMutuallyIfNecessary = function(face1, normal1, face2, normal2, cosCreaseAngle) {
            var cosAngle = face1.normal.dot(face2.normal) / (face1.normal.length() * face2.normal.length());

            if (cosAngle >= cosCreaseAngle) {
                face1.vertexNormals[normal1].add(face2.normal);
                face2.vertexNormals[normal2].add(face1.normal);
            }
        },

        createUvVectors = function(geometry, texCoordIndex, textureCoordinates) {
            var faceVertices = [0, 0, 0],
                vertexCounter = 0;

            console.log('creating UV coordinates: ' + JSON.stringify(texCoordIndex) + ', ' + JSON.stringify(textureCoordinates));

            texCoordIndex.forEach(function(index) {
                if (index >= 0) {
                    if (vertexCounter < 3) {
                        faceVertices[vertexCounter] = index;
                        vertexCounter++;
                    }

                    if (vertexCounter == 3) {
                        geometry.faceVertexUvs[0].push([
                            new THREE.Vector2(textureCoordinates[faceVertices[0]].x, textureCoordinates[faceVertices[0]].y), 
                            new THREE.Vector2(textureCoordinates[faceVertices[1]].x, textureCoordinates[faceVertices[1]].y), 
                            new THREE.Vector2(textureCoordinates[faceVertices[2]].x, textureCoordinates[faceVertices[2]].y) 
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

            console.log('computing vertex normals ...');

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

                console.log('creating geometry vertices: reduced: ' + vertexMapSize + ' of ' + vertices.length);
                console.log(JSON.stringify(vertexMap));
            } else {
                console.log('creating geometry vertices: all: ' + vertices.length);
                vertices.forEach(function(vertex) {
                    geometry.vertices.push(vertex.clone());
                });
            }
        },

        createFaceGeometry = function(indexedFaceSet, appearance) {
            var geometry = new THREE.Geometry(),
                vertices = [],
                faceVertices = [0, 0, 0],
                face,
                vertexCounter = 0;

            console.log("creating face geometry...");

            geometry.faces = [];
            indexedFaceSet.coordIndex.forEach(function(index) {
                if (index >= 0) {
                    if (vertexCounter < 3) {
                        faceVertices[vertexCounter] = index;
                        vertexCounter++;
                    }

                    if (vertexCounter == 3) {
                        face = new THREE.Face3(faceVertices[0], faceVertices[1], faceVertices[2]);
                        geometry.faces.push(face);
                        faceVertices[1] = index;
                        vertexCounter = 2;
                    }
                } else {
                    vertexCounter = 0;
                }
            });

            indexedFaceSet.vertexCoordinates.forEach(function(vertex) {
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
                    appearance.material.diffuseColor.clone(),
                    appearance.material.diffuseColor.clone(),
                    appearance.material.diffuseColor.clone()
                ];
            });

            if (indexedFaceSet.creaseAngle > 0.0) {
                computeVertexNormals(geometry.faces, Math.cos(indexedFaceSet.creaseAngle));
            }

            if (appearance.texture &&
                indexedFaceSet.textureCoordinates.length > 0 &&
                indexedFaceSet.texCoordIndex.length > 0) {
                createUvVectors(geometry, indexedFaceSet.texCoordIndex, indexedFaceSet.textureCoordinates);
            }

            return geometry;
        },

        createLineGeometry = function(indexedLineSet, appearance) {
            var lines = new THREE.Object3D(),
                lineStripGeometry,
                lineStripLength = 0,
                lineStripCounter = 0,
                indexCounter = 0,
                colorIndex,
                materialProperties = {},
                finalizeLineStrip = function () {
                    lines.add(new THREE.Line(
                        lineStripGeometry,
                        new THREE.LineBasicMaterial(materialProperties)
                    ));                        

                    lineStripLength = 0;
                    lineStripCounter++;
                };

            console.log("creating line strips...");


            if (indexedLineSet.colorIndex && indexedLineSet.vertexColors) {
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


            indexedLineSet.coordIndex.forEach(function(index) {
                var vertexColor;

                if (index >= 0) {
                    if (lineStripLength == 0) {
                        lineStripGeometry = new THREE.Geometry();
                        lineStripGeometry.vertices = [];
                        lineStripGeometry.colors = [];
//                        lineStripGeometry.colorsNeedUpdate = true;
                    }

                    lineStripGeometry.vertices.push(new THREE.Vector3(
                        indexedLineSet.vertexCoordinates[index].x,    
                        indexedLineSet.vertexCoordinates[index].y,    
                        indexedLineSet.vertexCoordinates[index].z    
                    ));

                    if (indexedLineSet.colorIndex && indexedLineSet.vertexColors) {
                        colorIndex = indexedLineSet.colorIndex[indexCounter];

                        vertexColor = new THREE.Color();
                        vertexColor.setRGB(
                            indexedLineSet.vertexColors[colorIndex].r,    
                            indexedLineSet.vertexColors[colorIndex].g,    
                            indexedLineSet.vertexColors[colorIndex].b    
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
        

    console.log('parsing X3D shape');

    this.node.children().each(function() {
        try {
            child = X3d.Node.parse($(this));

            switch ($(this).prop('tagName')) {
                case "Appearance":
                    appearance = child;
                    console.log('appearance: ' + JSON.stringify(appearance));
                    break;
                case "IndexedFaceSet":
                    indexedFaceSet = child;
                    console.log('indexed face set: ' + JSON.stringify(indexedFaceSet));
                    break;
                case "IndexedLineSet":
                    indexedLineSet = child;
                    console.log('indexed line set: ' + JSON.stringify(indexedLineSet));
                    break;
                default:
            }
        } catch (e) {
            throw e;
        }
    });

    if (indexedFaceSet) {
        if (typeof appearance.material === "undefined") {
            console.log('no material found, adding standard material');
            appearance.material = {
                diffuseColor: new THREE.Color()
            };

            appearance.material.diffuseColor.setRGB(1.0, 1.0, 1.0);
        }

        appearance.material.solid = indexedFaceSet.solid;

        mesh = new THREE.Mesh(
            createFaceGeometry(indexedFaceSet, appearance),
            X3d.getMaterial(this.node, appearance)
        );
    } else if (indexedLineSet) {
        mesh = createLineGeometry(indexedLineSet, appearance);
    }

    return mesh;
};
