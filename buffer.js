

function initBuffers(gl) {
  var p = new Promise(resolve => {
    var imgDepth = document.getElementById("imgDepth")
    var imgColor = document.getElementById("imgColor")

    var bufferCanvas=document.getElementById("bufferCanvas");
    bufferCanvas.width = imgDepth.width;
    bufferCanvas.height = imgDepth.height;
    console.log(imgDepth.width, imgDepth.height);
    bufferCanvas.getContext("2d").drawImage(imgDepth, 0, 0, imgDepth.width, imgDepth.height);
    gl.flush()
    var positionBuffer = assignPositions(gl, bufferCanvas);
    var indexResult = assignElement(gl, bufferCanvas);

    var bufferColorCanvas = document.getElementById("bufferColorCanvas")
    bufferColorCanvas.width = imgColor.width
    bufferColorCanvas.height = imgColor.height
    bufferColorCanvas.getContext("2d").drawImage(imgColor, 0, 0, imgDepth.width, imgDepth.height)
    gl.flush()
    var colorBuffer = assignColors(gl, bufferColorCanvas);
    // load image from html and draw that on a hidden canvas
    // so that pixel information could be acquired using canvas
    
    resolve({
      position: positionBuffer,
      color: colorBuffer,
      indices: indexResult.indexBuffer,
      vertexCount: indexResult.vertexCount
    })
  })
  return p;      
}

function assignPositions(gl, bufferCanvas) {
  
  const xOffset = bufferCanvas.width / 2 * 1.1; // 1.1 move whole picture to left horizontally relative to center 
  const yOffset = bufferCanvas.height / 2 * 1.1; // 1.1 move whole picture to top horizontally relative to center
  const scale = Math.max(bufferCanvas.width, bufferCanvas.height)/3.2;
  console.log('scale ', scale)
  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  var positions = [];
  // Now create an array of positions for the square.
  const width = bufferCanvas.width;
  const height = bufferCanvas.height;
  console.log(width, height);
  var data = bufferCanvas.getContext('2d').getImageData(0, 0, width, height).data;
  var x = 0;
  var y = 0;
  console.log('data length ', data.length)
  for (var i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];
    var a = data[i + 3];
    var depth = 255 - (r + g + b + a) / 4;
    positions.push((x - xOffset) / scale);
    positions.push((-y + yOffset) / scale);
    positions.push(depth / 100);
    x += 1;
    if (x === width) {
      y += 1;
      x = 0;
    }
    if (y === height) {
      //break; // ???
    }
  }
  console.log('assign positions width: ', x)
  console.log('assign positions height: ', y)
  // console.log('positions\n', positions)

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW);
  return positionBuffer;
}

function assignColors(gl, bufferCanvas) {
  const width = bufferCanvas.width;
  const height = bufferCanvas.height;
  var data = bufferCanvas.getContext('2d').getImageData(0, 0, width, height).data;
  var colors = [];
  for (var i = 0; i < data.length; i++) {
    colors.push(data[i]/255);
    //colors.push(0)
  }
  // console.log("color: ", width, height, colors.length);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  return colorBuffer;
}

function assignElement(gl, bufferCanvas) {
  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  var width = bufferCanvas.width;
  var width2 = width - 1;
  var height = bufferCanvas.height - 1; 
  console.log(width, height);
  var indices = [];
  for (var i = 0; i < height; i ++) {
    for (var j = 0; j < width2; j ++) {
      var index = i * width + j;
      //console.log(index)
      indices.push(index)
      indices.push(index + width + 1);
      indices.push(index + width)
      indices.push(index);
      indices.push(index + width + 1);
      indices.push(index + 1);
    }
  }
  var vertexCount = indices.length
  console.log('number of vertex: ', vertexCount)
  // Now send the element array to GL
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
  return {
    indexBuffer, vertexCount
  };
}