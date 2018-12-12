var canvas;
var m4;
var v3;
var gl;

var shaderProgram;
var mesh = [];
var normals = [];

var imgBuffer = {};

var lightPos = [0, 0, -1];
var xlightSlider; 
var ylightSlider;
var zlightSlider;
var lightPosSpan;

var lightingCheckbox;
var textureCheckbox;
var textureLighting = 3;

var lightIntensity = 0.4;
var lightIntensitySlider;
var lightIntensitySpan;

var images = {
    img: [
        "bird.jpg",
        "coke.jpg",
        "tunnel.jpg",
        "room.jpg",
        "shelf.jpg",
        "flower.jpg",
        "misc.jpg",
        'office.jpg',
        'kitchen.jpg'
    ],
    texRoot: './images/texture/',
    depthRoot: './images/depth/'
};

var imgIdx = 8;

var canvasDrag = false;
var mouseInCanvas = false;

window.onload = function() {

    if (location.search.substr(1) == "") {
        imgIdx = 0;
    } else {
        imgIdx = parseInt(location.search.substr(1))
    }
    Promise.all([
        load.img(images.depthRoot + images.img[imgIdx], "src-depth-img"),
        load.img(images.texRoot + images.img[imgIdx], "src-tex-img"),
    ]).then(() => {

        if (!init()) {
            return;
        }
        setTimeout(startProcessing, 100);
    })

    //document.getElementById('src-depth-img').src = images.depthRoot + images.img[imgIdx];
    //document.getElementById('src-tex-img').src = images.texRoot + images.img[imgIdx];

};

function startProcessing() {
    setCanvasSize();
    mesh = new Float32Array(ImgHelper.getMesh(5));
    normals = new Float32Array(ImgHelper.getNormals());
    setupShaderAttributes();
    
    xlightSlider = document.getElementById('xlightSlider');
    ylightSlider = document.getElementById('ylightSlider');
    zlightSlider = document.getElementById('zlightSlider');
    lightPosSpan = document.getElementById('light-pos-span');

    xlightSlider.value = 0.00;
    xlightSlider.addEventListener('input', sliderUpdate);

    ylightSlider.value = 0.00;
    ylightSlider.addEventListener('input', sliderUpdate);

    zlightSlider.value = -100.00;
    zlightSlider.addEventListener('input', sliderUpdate);

    lightingCheckbox = document.getElementById('lighting-checkbox');
    textureCheckbox = document.getElementById('texture-checkbox');

    lightingCheckbox.addEventListener('input', checkboxUpdate);
    textureCheckbox.addEventListener('input', checkboxUpdate);

    lightIntensitySlider = document.getElementById('lightIntensitySlider');
    lightIntensitySpan = document.getElementById('light-intensity-span');

    lightIntensitySlider.value = 40;
    lightIntensitySlider.addEventListener('input', sliderUpdate);

    canvas.addEventListener('click', function(event) {
        updateLightFromCanvas(event);
    });

    canvas.addEventListener('mousedown', function(event) {
        canvasDrag = true;
        updateLightFromCanvas();
    });

    canvas.addEventListener('mouseup', function(event) {
        canvasDrag = false;
    });

    canvas.addEventListener('mousemove', function(event) {
        if (canvasDrag) {
            updateLightFromCanvas(event);
        }
    })

    canvas.addEventListener('mouseenter', () => {mouseInCanvas = true})
    canvas.addEventListener('mouseout', () => {mouseInCanvas = false})

    window.addEventListener('wheel', function(event) {
        if (mouseInCanvas) {
            event.preventDefault()
            var delta = event.deltaY / 80
            this.console.log(delta)
            this.console.log(zlightSlider.value)
            delta = Number(zlightSlider.value) - delta
            Math.abs(delta)>100 ? delta>0 ? delta=100 : delta=-100 : delta = delta
            zlightSlider.value = delta
            this.console.log(zlightSlider.value)
            sliderUpdate();
        }
    })

    document.getElementById('loader-overlay-div').setAttribute('style', 'display: none; visibility: hidden;')
    lightPosSpan.innerHTML = '[' + lightPos[0].toFixed(2) + ', ' + lightPos[1].toFixed(2) + ', ' + lightPos[2].toFixed(2) + ']';
    lightIntensitySpan.innerHTML = lightIntensity;
    draw();

    setupImageSelector();
}

function updateLightFromCanvas(event) {
    if (event) {
        var rect = canvas.getBoundingClientRect()
        var x = event.offsetX
        var y = event.offsetY
        //console.log(event.pageX, event.pageY)
        //console.log(event.offsetX, event.offsetY)
        x = (2 * x / canvas.width) - 1;
        y = -((2 * y / canvas.height) - 1);
        
        xlightSlider.value = Math.round(x * 100);
        ylightSlider.value = Math.round(y * 100);
    }
    sliderUpdate();
}

function sliderUpdate() {
    lightPos = [xlightSlider.value / 100, ylightSlider.value / 100, zlightSlider.value / 100];
    lightPosSpan.innerHTML = '[' + lightPos[0].toFixed(2) + ', ' + lightPos[1].toFixed(2) + ', ' + lightPos[2].toFixed(2) + ']';
    
    lightIntensity = lightIntensitySlider.value / 100;
    lightIntensitySpan.innerHTML = lightIntensity;
    draw();
}

function checkboxUpdate() {
    textureLighting = 0;
    if (lightingCheckbox.checked) {
        textureLighting += 2;
    }

    if (textureCheckbox.checked) {
        textureLighting += 1;
    }

    draw();
}



function init() {
    canvas = document.getElementById('canvas');
    m4 = twgl.m4;
    v3 = twgl.v3;

    gl = canvas.getContext("webgl");

    window.addEventListener('resize', setCanvasSize);
    if(!setupShaders()) {
        return false;
    }

    return true;
}

function setCanvasSize() {
    var imgSize = ImgHelper.getImageSize();
    var ratio = 1
    if (window.innerWidth * ratio < imgSize[0] || window.innerHeight * ratio < imgSize[1]) {
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;

        var aspectRatio = ImgHelper.getAspectRatio();
        console.log(aspectRatio);


        var m_width = window.innerWidth * ratio;
        var m_height = m_width / aspectRatio;

        if (canvas.height > canvas.width && m_height > window.innerHeight * 0.6) {
            m_height = window.innerHeight;
            m_width = m_height * aspectRatio;
        }

        canvas.width = m_width;
        canvas.height = m_height;
    } else {
        canvas.width = imgSize[0];
        canvas.height = imgSize[1];
    }

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

    shaderProgram.normalAttr = gl.getAttribLocation(shaderProgram, 'normal');
    gl.enableVertexAttribArray(shaderProgram.normalAttr);

    imgBuffer.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, imgBuffer.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
    imgBuffer.positionBuffer.itemSize = 3;
    imgBuffer.positionBuffer.numItems  = mesh.length / imgBuffer.positionBuffer.itemSize;

    imgBuffer.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, imgBuffer.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    imgBuffer.normalBuffer.itemSize = 3;
    imgBuffer.normalBuffer.numItems = normals.length / imgBuffer.normalBuffer.itemSize;

    imgBuffer.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, imgBuffer.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('src-tex-img'));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    shaderProgram.imgSizeUnif = gl.getUniformLocation(shaderProgram, 'imgSize');
    shaderProgram.minMaxZUnif = gl.getUniformLocation(shaderProgram, 'minMaxZ');
    shaderProgram.lightPos = gl.getUniformLocation(shaderProgram, 'lightPos');
    shaderProgram.texSampler = gl.getUniformLocation(shaderProgram, 'texSampler');
    shaderProgram.textureLighting = gl.getUniformLocation(shaderProgram, 'textureLighting');
    shaderProgram.lightIntensity = gl.getUniformLocation(shaderProgram, 'lightIntensity');

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function draw() {
    //canvas.width = canvas.parentElement.width
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, imgBuffer.positionBuffer);
    gl.vertexAttribPointer(shaderProgram.positionAttr, imgBuffer.positionBuffer.itemSize, 
        gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, imgBuffer.normalBuffer);
    gl.vertexAttribPointer(shaderProgram.normalAttr, imgBuffer.normalBuffer.itemSize, 
        gl.FLOAT, false, 0, 0);

    gl.bindTexture(gl.TEXTURE_2D, imgBuffer.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('src-tex-img'));

    gl.uniform2fv(shaderProgram.imgSizeUnif, new Float32Array(ImgHelper.getImageSize()));
    gl.uniform2fv(shaderProgram.minMaxZUnif, new Float32Array([ImgHelper.minZ, ImgHelper.maxZ]));
    gl.uniform3fv(shaderProgram.lightPos, new Float32Array(lightPos));
    gl.uniform1i(shaderProgram.texSampler, 0);
    gl.uniform1i(shaderProgram.textureLighting, textureLighting);
    gl.uniform1f(shaderProgram.lightIntensity, lightIntensity);

    gl.drawArrays(gl.TRIANGLES, 0, imgBuffer.positionBuffer.numItems);
   
}

function setupImageSelector() {
    var selector = document.getElementById('image-select');

    for (var i = 0; i < images.img.length; i++) {
        var option = document.createElement('option');
        option.text = images.img[i]; 
        option.value = i;

        if (imgIdx == i) {
            option.selected = true;
        }
        
        selector.add(option, i);
    }

    var reloadButton = document.getElementById('reload-button');
    reloadButton.addEventListener('click', function() {
        var selectedIdx = selector.selectedIndex;
        var selectedOption = selector.options[selectedIdx];

        window.location.href = window.location.href.split('?')[0] + '?' + selectedOption.value;
    })
}