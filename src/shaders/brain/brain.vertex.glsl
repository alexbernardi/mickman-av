// uniform vec4 shellParams;
// uniform sampler2D normalMapTexture;
// uniform mat4 instanceMatrix;

out vec3 vPosition;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec3 vTangent;
out vec2 vUv;
// out float vShellProgress;
out mat3 vNormalMatrix;
// out float vDisplace;


void main() {

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * viewPosition;

    vPosition = position;
    vWorldPosition = worldPosition.xyz;
    vNormal = normal;
    vTangent = normalize(cross(vec3(0., 1., 0.), normal));
    vUv = uv;
    // vShellProgress = shellIndex / shellCount;
    vNormalMatrix = normalMatrix;
    // vDisplace = displace;
}

// void main() {
//     vec4 worldPosition = modelMatrix * vec4(position, 1.0);
//     vec4 viewPosition = viewMatrix * worldPosition;
//     gl_Position = projectionMatrix * viewPosition;

//     Set the varyings for the fragment shader
//     vPosition = position;
//     vWorldPosition = worldPosition.xyz;
//     vNormal = normal;
//     vTangent = normalize(cross(vec3(0., 1., 0.), normal));
//     vUv = uv;
//     Remove or comment out the unnecessary varyings
// }
