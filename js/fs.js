var fs_src = `
    precision highp float;

    varying vec3 fPos;
    varying vec3 fNormal;

    void main() {
        gl_FragColor = vec4(normalize(fNormal), 1.0);
    }
`;