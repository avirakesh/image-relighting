  // Vertex shader program

  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  attribute vec3 aVertexNormal;

  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  
  uniform float lightR;
  uniform float lightG;
  uniform float lightB;
  
  uniform float lightX;
  uniform float lightY;
  uniform float lightZ;
  
  varying lowp vec4 vColor;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;

    // Apply lighting effect
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    // value range from -1 to +1
    highp vec3 directionalLightColor = vec3(lightR, lightG, lightB);
    // originally 0.85, 0.8, 0.75
    // value range from -1 to +1, exclude 0
    highp vec3 directionalVector = normalize(vec3(lightX, lightY, lightZ));
    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
  }
`;