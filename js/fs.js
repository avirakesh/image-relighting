var fs_src = `
    precision highp float;

    varying vec3 fPos;
    varying vec3 fColor;

    void main() {
        gl_FragColor = vec4((1.0 - fPos.z), 0.0, fPos.z, 1.0);
    }
`;