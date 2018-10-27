
var cubeRotation = 0.0;
var isRotate = 1;
const numComponents = 3;

main();

//
// start here
//
function main() {
  
  // wait until canvas element is loaded.
  document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      },
    };

    var then = 0;
    //const buffers = initBuffers(gl);
    Promise.all([
      //load.img("/images/bird0-depth.jpg", "imgDepth"),              // not working
      //load.img("/images/bird0-alternative.jpg", "imgColor"),        // not working
      //load.img("/images/bird0-depth-small.jpg", "imgDepth"),        //not working
      //load.img("/images/bird0-alternative-small.jpg", "imgColor"),  //not working
      //load.img("/images/flower1-depth.jpg", "imgDepth"),            // not working 
      //load.img("/images/flower1-alternative.jpg", "imgColor"),      // not working
      //load.img("/images/flower1-depth-small.jpg", "imgDepth"),      // kind of working, lossing many pixels
      //load.img("/images/flower1-alternative-small.jpg", "imgColor"),// kind of working, lossing many pixels
      //load.img("/images/Shelf-depthmap.jpg", "imgDepth"),           // not working
      //load.img("/images/Shelf-alternative.jpg", "imgColor"),        // not working
      //load.img("/images/Shelf-depthmap-small.jpg", "imgDepth"),     // kind of working
      //load.img("/images/Shelf-alternative-small.jpg", "imgColor"),  // kind of working
      //load.img("/images/Tunnel-depthmap.jpg", "imgDepth"),          // not working
      //load.img("/images/Tunnel-alternative.jpg", "imgColor"),       // not working
      //load.img("/images/Tunnel-depthmap-small.jpg", "imgDepth"),    // kind of working
      //load.img("/images/Tunnel-alternative-small.jpg", "imgColor"), // kind of working
      //load.img("/images/finalzdepth.png", "imgDepth"),              // not working
      //load.img("/images/finalzdepth.png", "imgColor"),              // not working
      //load.img("/images/finalzdepthsmall.png", "imgDepth"),         // not working
      //load.img("/images/finalzdepthsmall.png", "imgColor"),         // not working
      //load.img("/images/test.jpg", "imgDepth"),                     // working
      //load.img("/images/test.jpg", "imgColor"),                     // working
      load.img("/images/testsmall.png", "imgDepth"),                // working
      load.img("/images/testsmallcolor.png", "imgColor"),           // working
    ]).then(() => {
      initBuffers(gl).then(buffers => {
        console.log(buffers)
        // Draw the scene repeatedly
        function render(now) {
          now *= 0.001;  // convert to seconds
          var deltaTime = now - then;
          if (!isRotate) {
            deltaTime = 0;
          }
          then = now;
    
          drawScene(gl, programInfo, buffers, deltaTime);
    
          requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
      })
    })
  });

}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function rotateModel() {
  if (isRotate) {
    isRotate = 0;
  } else {
    isRotate = 1;
  }
}

