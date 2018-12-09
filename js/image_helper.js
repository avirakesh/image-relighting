var ImgHelper = {
    img_mesh: [],
    getMesh: function (blockSize) {
        if (this.img_mesh.length != 0) {
            return this.img_mesh;
        }

        blockSize  = blockSize || 2
        console.log(blockSize);
        
        var srcImg = document.getElementById("src-depth-img");

        var imgCanvas = document.createElement("canvas");
        var imgContext = imgCanvas.getContext("2d");

        var height = srcImg.naturalHeight;
        var width = srcImg.naturalWidth;
        imgCanvas.width = width;
        imgCanvas.height = height;
        

        imgContext.drawImage(srcImg, 0, 0);

        function createMeshFromImage() {
            var minZ = 255, maxZ = 0;
            var stepSize = blockSize - 1;
            var xSteps = Math.floor(width / stepSize);
            var ySteps = Math.floor(height / stepSize);

            console.log(xSteps);
            console.log(ySteps);

            var idx = 0;
            var mesh = [];
            var normals = []
            for (var i = 0; i < ySteps; i++) {
                for (var j = 0; j < xSteps; j++) {
                    var startX = j * stepSize;
                    var startY = i * stepSize;

                    var endX = Math.min((j + 1) * stepSize, width - 1);
                    var endY = Math.min((i + 1) * stepSize, height - 1);

                    var v0 = imgContext.getImageData(startX, startY, 1, 1).data;
                    v0 = (v0[0] + v0[1] + v0[2]) / 3;
                    minZ = Math.min(v0, minZ);
                    maxZ = Math.max(v0, maxZ);

                    var v1 = imgContext.getImageData(endX, startY, 1, 1).data;
                    v1 = (v1[0] + v1[1] + v1[2]) / 3;
                    minZ = Math.min(v1, minZ);
                    maxZ = Math.max(v1, maxZ);

                    var v2 = imgContext.getImageData(startX, endY, 1, 1).data;
                    v2 = (v2[0] + v2[1] + v2[2]) / 3;
                    minZ = Math.min(v2, minZ);
                    maxZ = Math.max(v2, maxZ);

                    var v3 = imgContext.getImageData(endX, endY, 1, 1).data;
                    v3 = (v3[0] + v3[1] + v3[2]) / 3;
                    minZ = Math.min(v3, minZ);
                    maxZ = Math.max(v3, maxZ);

                    points = [
                        [startX, startY, v0],
                        [endX, startY, v1],
                        [startX, endY, v2],
                        [endX, endY, v3]
                    ]
                    
                    for (var m = 0; m < 2; m++) {
                        for (var n = 0; n < 3; n++) {
                            for (var o = 0; o < 3; o++) {
                                mesh[idx] = points[m + n][o];
                                idx++;
                            }
                        }
                    }
                }
            }

            var scale = (maxZ - minZ) * 15;
            for (var nidx = 0; nidx < mesh.length; nidx += 3) {
                var pt = [ mesh[nidx], mesh[nidx + 1], mesh[nidx + 2] ]
                var normal = getNormalsForPoints(pt, minZ, scale);
                normals[nidx] = normal[0];
                normals[nidx + 1] = normal[1];
                normals[nidx + 2] = normal[2];
            }
            return [mesh, minZ, maxZ, normals];
        }

        function getNormalsForPoints(point, minZ, zScale) {
            normals = [];
            var pt = point;
            var x = pt[0];
            var y = pt[1];

            var s = 3;
            var lt = [Math.max(0, x - s), Math.max(0, y - s)];
            var ltVal = imgContext.getImageData(lt[0], lt[1], 1, 1).data;
            lt[2] = [( ltVal[0] + ltVal[1] + ltVal[2] ) / 3];

            var rt = [Math.min(width - 1, x + s), Math.max(0, y - s)];
            var rtVal = imgContext.getImageData(rt[0], rt[1], 1, 1).data;
            rt[2] = ( rtVal[0] + rtVal[1] + rtVal[2] ) / 3;

            var lb = [Math.max(0, x - s), Math.min(height - 1, y + s)];
            var lbVal = imgContext.getImageData(lb[0], lb[1], 1, 1).data;
            lb[2] = ( lbVal[0] + lbVal[1] + lbVal[2] ) / 3;

            var rb = [Math.min(width - 1, x + s), Math.min(height - 1, y + s)];
            var rbVal = imgContext.getImageData(rb[0], rb[1], 1, 1).data;
            rb[2] = ( rbVal[0] + rbVal[1] + rbVal[2] ) / 3;

            var rtv = v3.subtract(rt, pt);
            var ltv = v3.subtract(lt, pt);
            var lbv = v3.subtract(lb, pt);
            var rbv = v3.subtract(rb, pt);

            // var v1 = v3.subtract(rt, lb);
            // var v2 = v3.subtract(lt, rb);

            var normal = [
                v3.cross(rtv, ltv), 
                v3.cross(ltv, lbv), 
                v3.cross(lbv, rbv),
                v3.cross(rbv, rtv)
                // v3.cross(ltv, rtv),
                // v3.cross(lbv, ltv),
                // v3.cross(rbv, lbv),
                // v3.cross(rtv, rbv)
                // v3.cross(v2, v1)
            ];

            

            normals = v3.add(
                v3.add(
                    v3.add(normal[0], normal[1]),
                    normal[1]
                ),
                normal[3]
            );

            // normals = normal[0];
            return normals;
        }

        var res =  createMeshFromImage();
        this.img_mesh = res[0];
        this.minZ = res[1];
        this.maxZ = res[2];
        this.normals = res[3]

        return this.img_mesh;
    },
    img_size: [],
    getImageSize: function() {
        if (this.img_size.length != 0) {
            return this.img_size;
        }
        var srcImg = document.getElementById("src-depth-img");
        this.img_size = [srcImg.naturalWidth, srcImg.naturalHeight];
        return this.img_size;
    },
    aspect_ratio: -1,
    getAspectRatio: function() {
        if (this.aspect_ratio != -1) {
            return this.aspect_ratio
        }
        var size = this.getImageSize();
        this.aspect_ratio = size[0] / size[1];
        return this.aspect_ratio;
    },
    minZ: 255,
    maxZ: 0,

    normals: [],
    getNormals: function() {
        if (this.normals.length == 0) {
            this.getMesh(5);
        }

        return this.normals;
    }
};