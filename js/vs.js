var vs_src = `
    precision highp float;

    uniform vec2 imgSize;
    uniform vec2 minMaxZ;
    
    attribute vec3 vPos;
    
    varying vec3 fPos;
    varying vec3 fColor;

    void main() {
        float xDiv = imgSize.x / 2.0;
        float yDiv = imgSize.y / 2.0;

        vec3 pos;
        pos.x = (vPos.x / xDiv) - 1.0;
        pos.y = (-vPos.y / yDiv) + 1.0;
        pos.z = ((vPos.z - minMaxZ.x) / (minMaxZ.y - minMaxZ.x));

        fPos  = pos;
        fColor = pos;

        gl_Position = vec4(pos, 1.0);
    }
`;