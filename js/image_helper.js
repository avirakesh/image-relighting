var ImgHelper = {
    img_mesh: [],
    getMesh: function (blockSize) {
        if (this.img_mesh.length != 0) {
            return this.img_mesh;
        }
        var srcImg = document.getElementById("src-img");

        var imgCanvas = document.createElement("canvas");
        var imgContext = imgCanvas.getContext("2d");

        imgCanvas.width = srcImg.naturalWidth;
        imgCanvas.height = srcImg.naturalHeight;

        imgContext.drawImage(srcImg, 0, 0);

        function createMeshFromImage() {
            var stepSize = blockSize - 1;
            var height = srcImg.naturalHeight;
            var width = srcImg.naturalWidth;
            var xSteps = Math.floor(width / stepSize);
            var ySteps = Math.floor(height / stepSize);

            console.log(xSteps);
            console.log(ySteps);

            var idx = 0;
            var mesh = [];
            for (var i = 0; i < ySteps; i++) {
                for (var j = 0; j < xSteps; j++) {
                    var startX = j * stepSize;
                    var startY = i * stepSize;

                    var endX = Math.min((j + 1) * stepSize, width - 1);
                    var endY = Math.min((i + 1) * stepSize, height - 1);

                    var v0 = imgContext.getImageData(startX, startY, 1, 1).data;
                    v0 = (v0[0] + v0[1] + v0[2]) / 3;

                    var v1 = imgContext.getImageData(endX, startY, 1, 1).data;
                    v1 = (v1[0] + v1[1] + v1[2]) / 3;

                    var v2 = imgContext.getImageData(startX, endY, 1, 1).data;
                    v2 = (v2[0] + v2[1] + v2[2]) / 3;

                    var v3 = imgContext.getImageData(endX, endY, 1, 1).data;
                    v3 = (v3[0] + v3[1] + v3[2]) / 3;

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
            return mesh;
        }

        this.img_mesh =  createMeshFromImage();
        return this.img_mesh;
    },
    img_size: [],
    getImageSize: function() {
        if (this.img_size.length != 0) {
            return this.img_size;
        }
        var srcImg = document.getElementById("src-img");
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
    }
};