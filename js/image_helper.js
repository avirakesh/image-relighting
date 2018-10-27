function getMesh(blockSize) {
    var srcImg = document.getElementById("src-img");

    var imgCanvas = document.createElement("canvas");
    var imgContext = imgCanvas.getContext("2d");

    imgCanvas.width = srcImg.naturalWidth;
    imgCanvas.height = srcImg.naturalHeight;

    imgContext.drawImage(srcImg, 0, 0);
    createMeshFromImage();
    data = [];

    function createMeshFromImage() {
        var stepSize = blockSize - 1;
        var height = srcImg.naturalHeight;
        var width = srcImg.naturalWidth;
        var xSteps = Math.floor(width / stepSize);
        var ySteps = Math.floor(height / stepSize);

        console.log(xSteps);
        console.log(ySteps);

        var idx = 0;
        for (var i = 0; i < ySteps; i++) {
            for (var j = 0; j < xSteps; j++) {
                var startX = j * stepSize;
                var startY = i * stepSize;

                var endX = Math.min((j + 1) * stepSize, width - 1);
                var endY = Math.min((i + 1) * stepSize, height - 1);

                var leftTopData = imgContext.getImageData(startX, startY, 1, 1);
                var leftBottomData = imgContext.getImageData(startX, endY, 1, 1);
                var rightTop = imgContext.getImageData(endX, startY, 1, 1);
                var rightBottom = imgContext.getImageData(endX, endY, 1, 1);


            }
        }
    }

}