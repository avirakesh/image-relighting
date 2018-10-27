var vs_src = `
    precision highp float;

    attribute vec3 vPos;
    
    varying vec3 fPos;
    varying vec3 fColor;

    void main() {
        fPos  = vPos;
        fColor = vPos;

        gl_Position = vec4(vPos, 1.0);
    }
`;