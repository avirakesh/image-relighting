var canvas;
var m4;
var v3;
var gl;
var aspect_ratio;

var shaderProgram;

window.onload = function() {
    if (!init()) {
        return;
    }

    var mesh = getMesh(5);
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

    aspect_ratio = canvas.width / canvas.height;
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