function initBuffers(gl) {

  var img = new Image();
  var p = new Promise(resolve => {
    img.addEventListener('load', () => {
      var bufferCanvas=document.getElementById("bufferCanvas");
      bufferCanvas.width = img.width;
      bufferCanvas.height = img.height;
      console.log(img.width, img.height);
      bufferCanvas.getContext("2d").drawImage(img, 0,0, img.width, img.height);

      var positionBuffer = assignPositions(gl, bufferCanvas);
      var colorBuffer = assignColors(gl, bufferCanvas);
      var indexBuffer = assignElement(gl, bufferCanvas);
      // load image from html and draw that on a hidden canvas
      // so that pixel information could be acquired using canvas
      resolve( {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
      })
    }, false)
  })
  img.src = "/images/finalzdepth.png";
  return p;      
}

function assignPositions(gl, bufferCanvas) {
  const xOffset = bufferCanvas.width / 2;
  const yOffset = bufferCanvas.height / 2;
  const scale = 5;
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var positions = [];
  // Now create an array of positions for the square.
  const width = bufferCanvas.width;
  const height = bufferCanvas.height;
  var data = bufferCanvas.getContext('2d').getImageData(0, 0, width, height).data;
  var x = 0;
  var y = 0;
  for (var i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];
    var a = data[i + 3];
    var depth = (r + g + b + a) / 4;
    positions.push((x - xOffset) / scale);
    positions.push((y - yOffset) / scale);
    x += 1;
    if (x === width) {
      y += 1;
      x = 0;
    }
    if (y === height) {
      break; // ???
    }
  }
  // const positions = [
  //   // Front face
  //   -0.10, -0.10,  0.10,
  //   0.10, -0.10,  0.10,
  //   0.10,  0.10,  0.10,
  //   -0.10,  0.10,  0.10,

  //    // Front face
  //    -0.10, -0.10,  0.05,
  //    0.10, -0.10,  0.10,
  //    0.10,  0.10,  0.10,
  //   -0.10,  0.10,  0.10,

  //   // Top face
  //   -0.10,  0.10, -0.20,
  //   -0.10,  0.10,  0.10,
  //   0.10,  0.10,  0.10,
  //   0.10,  0.10, -0.10,
    
  //   // Bottom face
  //   -0.10, -0.10, -0.10,
  //   0.10, -0.10, -0.10,
  //   0.10, -0.10,  0.10,
  //   -0.10, -0.10,  0.10,
    
  //   // Right face
  //   0.10, -0.10, -0.10,
  //   0.10,  0.10, -0.10,
  //   0.10,  0.10,  0.10,
  //   0.10, -0.10,  0.10,
    
  //   // Left face
  //   -0.10, -0.10, -0.10,
  //   -0.10, -0.10,  0.10,
  //   -0.10,  0.10,  0.10,
  //   -0.10,  0.10, -0.10,
  // ];
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW);
  return positionBuffer;
}

function assignColors(gl, bufferCanvas) {
  const width = bufferCanvas.width;
  const widthOffset = width * 4;
  const height = bufferCanvas.height;
  var data = bufferCanvas.getContext('2d').getImageData(0, 0, width, height).data;
  // const faceColors = [
  //   [1.0,  1.0,  1.0,  1.0],    // Front face: white
  //   [1.0,  0.0,  0.0,  1.0],    // Back face: red
  //   [0.0,  1.0,  0.0,  1.0],    // Top face: green
  //   [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
  //   [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
  //   [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  // ];

  // Convert the array of colors into a table for all the vertices.

  // var colors = [];

  // for (var j = 0; j < faceColors.length; ++j) {
  //   const c = faceColors[j];

  //   // Repeat each color four times for the four vertices of the face
  //   colors = colors.concat(c, c, c, c);
  // }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return colorBuffer;
}

function assignElement(gl, bufferCanvas) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  var width = bufferCanvas.width;
  var height = bufferCanvas.height;
  var len = bufferCanvas.getContext('2d').getImageData(0, 0, width, height).data.length / 4 - width;
  var indices = [];
  for (var i = 0, j = 1; i < len; i ++, j ++) {
    if (j !== width) {
      indices.push(i);
      indices.push(i + width);
      indices.push(i + width + 1);
      indices.push(i);
      indices.push(i + 1);
      indices.push(i + width + 1);
    } else {
      j = 1;
    }
  }
  // const indices = [
  //   0,  1,  2,      0,  2,  3,    // front
  //   0,  1,  2,      0,  2,  3,    // back /* when back is the same as front, back is not shown */
  //   8,  9,  10,     8,  10, 11,   // top
  //   12, 13, 14,     12, 14, 15,   // bottom
  //   16, 17, 18,     16, 18, 19,   // right
  //   20, 21, 22,     20, 22, 23,   // left
  // ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);
  return indexBuffer;
}