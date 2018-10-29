var canvas;
var m4;
var v3;
var gl;

var shaderProgram;
var mesh = [];

var imgBuffer = {};

window.onload = function() {
    if (!init()) {
        return;
    }
    mesh = new Float32Array(ImgHelper.getMesh(5));
    setupShaderAttributes();
    draw();
};

function init() {
    canvas = document.getElementById('canvas');
    m4 = twgl.m4;
    v3 = twgl.v3;

    gl = canvas.getContext("webgl");
    setCanvasSize();

    window.addEventListener('resize', setCanvasSize);
    if(!setupShaders()) {
        return false;
    }

    return true;
}

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var aspectRatio = ImgHelper.getAspectRatio();
    console.log(aspectRatio);
    var m_width = window.innerWidth;
    var m_height = m_width / aspectRatio;

    if(m_height > window.innerHeight) {
        m_height = window.innerHeight;
        m_width = m_height * aspectRatio;
    }

    canvas.width = m_width;
    canvas.height = m_height;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function setupShaders() {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vs_src)
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert("Compile Error : Vertex Shader\n" +
              "-----------------------------\n" +
              gl.getShaderInfoLog(vertexShader) + 
              "\n-----------------------------");
        return false;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fs_src);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert("Compile Error : Fragment Shader\n" +
              "-------------------------------\n" +
              gl.getShaderInfoLog(fragmentShader) +
              "\n-----------------------------");
        return false;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to Link Shaders");
        return false;
    }
    gl.useProgram(shaderProgram);
    return true;
}

function setupShaderAttributes() {
    shaderProgram.positionAttr = gl.getAttribLocation(shaderProgram, 'vPos');
    gl.enableVertexAttribArray(shaderProgram.positionAttr);

    imgBuffer.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, imgBuffer.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
    imgBuffer.positionBuffer.itemSize = 3;
    imgBuffer.positionBuffer.numItems  = mesh.length / imgBuffer.positionBuffer.itemSize;

    // add normal here as well


    shaderProgram.imgSizeUnif = gl.getUniformLocation(shaderProgram, 'imgSize');
    shaderProgram.minMaxZUnif = gl.getUniformLocation(shaderProgram, 'minMaxZ');

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, imgBuffer.positionBuffer);
    gl.vertexAttribPointer(shaderProgram.positionAttr, imgBuffer.positionBuffer.itemSize, 
        gl.FLOAT, false, 0, 0);

    gl.uniform2fv(shaderProgram.imgSizeUnif, new Float32Array(ImgHelper.getImageSize()));
    console.log([ImgHelper.minZ, ImgHelper.maxZ]);
    gl.uniform2fv(shaderProgram.minMaxZUnif, new Float32Array([ImgHelper.minZ, ImgHelper.maxZ]));

    gl.drawArrays(gl.TRIANGLES, 0, imgBuffer.positionBuffer.numItems);
}