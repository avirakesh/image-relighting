var vs_src = `
    precision highp float;

    uniform vec2 imgSize;
    uniform vec2 minMaxZ;
    
    attribute vec3 vPos;
    attribute vec3 normal;
    
    varying vec3 fPos;
    varying vec3 fNormal;
    varying vec2 texCoords;

    void main() {
        float xDiv = imgSize.x / 2.0;
        float yDiv = imgSize.y / 2.0;

        vec3 pos;
        pos.x = (vPos.x / xDiv) - 1.0;
        pos.y = (-vPos.y / yDiv) + 1.0;
        pos.z = (vPos.z - minMaxZ.x) / (minMaxZ.y - minMaxZ.x + 1.0);

        fPos  = pos;
        texCoords = vec2((pos.x + 1.0) / 2.0, -(pos.y - 1.0) / 2.0);

        vec3 correctedNormal = normalize(normal);
        correctedNormal = vec3(-correctedNormal.x, correctedNormal.y, -correctedNormal.z);
        fNormal = correctedNormal;

        gl_Position = vec4(pos, 1.0);
    }
`;