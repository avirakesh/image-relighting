var fs_src = `
    precision highp float;

    const vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
    const vec3 specColor = vec3(1.0, 1.0, 1.0);

    uniform vec3 lightPos;
    uniform sampler2D texSampler;

    varying vec3 fPos;
    varying vec3 fNormal;
    varying vec2 texCoords;

    vec3 normal;

    vec3 calculate_lighting() {
        vec3 lightDir = vec3(0.0, 0.0, 0.0) - vec3(lightPos.z, 0.0, -1.0);
        // float distance = length(lightDir);
        // if (distance >= 1.0) {
        //     distance = distance * distance;
        // } else {
        //     distance = pow(distance, 0.5);
        // }
        lightDir = normalize(lightDir);
    
        float lambertian = max(dot(lightDir, normal), 0.0);
        vec3 diffuse = diffuseColor * lambertian;

        float specularCoeff = 0.0;
        if (lambertian > 0.0) {
            vec3 viewDir = normalize(fPos);
            vec3 halfDir = normalize(lightDir + viewDir);
            
            float specAngle = max(dot(halfDir, normal), 0.0);
            specularCoeff = pow(specAngle, 1.0);
        }
        vec3 specular = 0.5 * specularCoeff * specColor;

        vec3 color = specular;
        return color;
    }

    void main() {
        normal = normalize(fNormal);
        vec3 color = calculate_lighting();
        // gl_FragColor = vec4(color, 1.0);
        vec4 texColor = texture2D(texSampler, texCoords);
        gl_FragColor = texColor + 0.25 * texColor * vec4(color, 1.0);
    }
`;