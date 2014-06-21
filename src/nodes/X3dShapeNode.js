X3d.ShapeNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.ShapeNode.prototype = Object.create(X3d.Node.prototype);

X3d.ShapeNode.prototype.parse = function() {
    var child,
        appearance = null,
        indexedFaceSet = null,
        mesh = null,

        adjustNormalsMutuallyIfNecessary = function(face1, normal1, face2, normal2, cosCreaseAngle) {
            var cosAngle = face1.normal.dot(face2.normal) / (face1.normal.length() * face2.normal.length());

            if (cosAngle >= cosCreaseAngle) {
                face1.vertexNormals[normal1].add(face2.normal);
                face2.vertexNormals[normal2].add(face1.normal);
            }
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

        createGeometry = function(indexedFaceSet, appearance) {
            var geometry = new THREE.Geometry(),
                vertices = [],
                faceVertices = [0, 0, 0],
                face,
                vertexCounter = 0;

            console.log("creating geometry...");

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

            indexedFaceSet.point.forEach(function(vertex) {
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

            return geometry;
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
                default:
            }
        } catch (e) {
            throw e;
        }
    });

    if (indexedFaceSet && appearance) {
        mesh = new THREE.Mesh(
            createGeometry(indexedFaceSet, appearance),
            X3d.getMaterial(this.node, appearance)
        );
    }

    return mesh;
};
