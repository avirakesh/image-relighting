var fs_src = `
    precision highp float;

    const vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
    const vec3 specColor = vec3(1.0, 1.0, 1.0);

    varying vec3 fPos;
    varying vec3 fNormal;

    vec3 normal;

    vec3 lightPos = vec3(0.0, 0.0, 0.75);

    vec3 calculate_lighting() {
        vec3 lightDir = lightPos - fPos;
        float distance = length(lightDir);
        distance = distance * distance;
    
        float lambertian = max(dot(lightDir, normal), 0.0);
        vec3 diffuse = 0.75 * diffuseColor * lambertian / distance;

        float specularCoeff = 0.0;
        if (lambertian > 0.0) {
            vec3 viewDir = normalize(fPos);
            vec3 halfDir = normalize(lightDir + viewDir);
            
            float specAngle = max(dot(halfDir, normal), 0.0);
            specularCoeff = pow(specAngle, 2.0);
        }
        vec3 specular = 0.5 * specularCoeff * specColor / distance;

        vec3 color = diffuse;
        return color;
    }

    void main() {
        normal = normalize(fNormal);
        vec3 color = calculate_lighting();
        gl_FragColor = vec4(color, 1.0);
    }
`;