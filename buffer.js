function initBuffers(gl) {

  var img = new Image();
  var p = new Promise(resolve => {
    img.addEventListener('load', () => {
      var bufferCanvas=document.getElementById("bufferCanvas");
      bufferCanvas.width = img.width;
      bufferCanvas.height = img.height;
      //console.log(img.width, img.height);
      bufferCanvas.getContext("2d").drawImage(img, 0,0, img.width, img.height);

      var positionBuffer = assignPositions(gl, bufferCanvas);
      var colorBuffer = assignColors(gl, bufferCanvas);
      var indexResult = assignElement(gl, bufferCanvas);
      // load image from html and draw that on a hidden canvas
      // so that pixel information could be acquired using canvas
      resolve( {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexResult.indexBuffer,
        vertexCount: indexResult.vertexCount
      })
    }, false)
  })
  //img.src = "/images/finalzdepth.png"
  //img.src = "/images/test.jpg";
  img.src = "/images/testsmall.png"
  return p;      
}

function assignPositions(gl, bufferCanvas) {
  
  const xOffset = bufferCanvas.width / 2;
  const yOffset = bufferCanvas.height / 2;
  const scale = Math.max(bufferCanvas.width, bufferCanvas.height) / 3;
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
    var depth = (r + g + b + a) / 4 - 128;
    positions.push((x - xOffset) / scale);
    positions.push((-y + yOffset) / scale);
    positions.push(depth / 100);
    x += 1;
    if (x === width) {
      y += 1;
      x = 0;
    }
    if (y === height) {
      break; // ???
    }
  }
  console.log('width: ', x)
  console.log('height: ', y)
  // console.log('positions\n', positions)


  // const positions = [
  //   -1.0, 1.0, 1.0,
  //   1.0, 1.0, 1.0,
  //   -1.0, -1.0, 1.0,
  //   1.0, -1.0, 1.0
  // ];
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
  const widthOffset = width * 4;
  const height = bufferCanvas.height;
  var colors = bufferCanvas.getContext('2d').getImageData(0, 0, width, height).data;
  
  // console.log('colors\n', data)

  // Convert the array of colors into a table for all the vertices.

  // Convert the array of colors into a table for all the vertices.

  // var colors = [
  //   1.0,  1.0,  1.0,  1.0,
  //   1.0,  0.0,  0.0,  1.0,
  //   0.0,  1.0,  0.0,  1.0,
  //   0.0,  0.0,  1.0,  1.0
  // ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  return colorBuffer;
}

function assignElement(gl, bufferCanvas) {
  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  var width = bufferCanvas.width - 1;
  var height = bufferCanvas.height - 1;
  console.log(width, height);
  var len = bufferCanvas.getContext('2d').getImageData(0, 0, width, height).data.length / 8;
  var indices = [];
  for (i = 0; i < height; i ++) {
    for (j = 0; j < width; j ++) {
      var index = i * height + j;
      indices.push(index)
      indices.push(index + width)
      indices.push(index + width + 1);
      indices.push(index);
      indices.push(index + width + 1);
      indices.push(index + 1);
    }
  }
  // for (var i = 0, j = 1; i < len; i ++, j ++) {
  //   if (j < width) {
  //     indices.push(i);
  //     indices.push(i + width);
  //     indices.push(i + width + 1);
  //     indices.push(i);
  //     indices.push(i + width + 1);
  //     indices.push(i + 1);
  //   } else {
  //     j = 1;
  //   }
  // }
  //console.log('indices\n', indices)

  // const indices = [
  //   0, 1, 2
  // ];
  var vertexCount = indices.length;
  console.log('number of vertex: ', vertexCount)
  // Now send the element array to GL
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);
  return {
    indexBuffer, vertexCount
  };
}