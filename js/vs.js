var vs_src = `
    precision highp float;

    uniform vec2 imgSize;
    
    attribute vec3 vPos;
    
    varying vec3 fPos;
    varying vec3 fColor;

    void main() {
        float xDiv = 1920.0 / 2.0;
        float yDiv = 1080.0 / 2.0;

        vec3 pos;
        pos.x = (vPos.x / xDiv) - 1.0;
        pos.y = (-vPos.y / yDiv) + 1.0;
        pos.z = (vPos.z / 255.0);

        fPos  = pos;
        fColor = pos;

        gl_Position = vec4(pos, 1.0);
    }
`;