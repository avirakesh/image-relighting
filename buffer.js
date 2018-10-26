function initBuffers(gl) {

  var img=document.getElementById("img1");
  var canvas=document.getElementById("bufferCanvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx=canvas.getContext("2d");
  ctx.drawImage(img, 0,0, img.width, img.height);

  var positionBuffer = assignPositions(gl);
  var colorBuffer = assignColors(gl);
  var indexBuffer = assignElement(gl);
  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

function assignPositions(gl) {
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  const positions = [
    // Front face
    -0.10, -0.10,  0.10,
    0.10, -0.10,  0.10,
    0.10,  0.10,  0.10,
    -0.10,  0.10,  0.10,

     // Front face
     -0.10, -0.10,  0.05,
     0.10, -0.10,  0.10,
     0.10,  0.10,  0.10,
    -0.10,  0.10,  0.10,

    // Top face
    -0.10,  0.10, -0.20,
    -0.10,  0.10,  0.10,
    0.10,  0.10,  0.10,
    0.10,  0.10, -0.10,
    
    // Bottom face
    -0.10, -0.10, -0.10,
    0.10, -0.10, -0.10,
    0.10, -0.10,  0.10,
    -0.10, -0.10,  0.10,
    
    // Right face
    0.10, -0.10, -0.10,
    0.10,  0.10, -0.10,
    0.10,  0.10,  0.10,
    0.10, -0.10,  0.10,
    
    // Left face
    -0.10, -0.10, -0.10,
    -0.10, -0.10,  0.10,
    -0.10,  0.10,  0.10,
    -0.10,  0.10, -0.10,
  ];
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW);
  return positionBuffer;
}

function assignColors(gl) {
  const faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  return colorBuffer;
}

function assignElement(gl) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    0,  1,  2,      0,  2,  3,    // back /* when back is the same as front, back is not shown */
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);
  return indexBuffer;
}