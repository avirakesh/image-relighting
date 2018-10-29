var fs_src = `
    precision highp float;

    varying vec3 fPos;
    varying vec3 fColor;

    void main() {
        gl_FragColor = vec4(fPos.z, fPos.z, fPos.z, 1.0);
    }
`;