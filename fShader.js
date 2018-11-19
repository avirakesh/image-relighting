const fsSource = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;
    
    void main(void) {
      gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
    }
  `;