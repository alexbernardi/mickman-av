uniform sampler2D furTexture;
uniform sampler2D normalMapTexture;
uniform float uTime;
uniform float uTest;
uniform float u2;
uniform float u3;
uniform float u4;

in vec3 vPosition;
in vec3 vWorldPosition;
in vec3 vNormal;
in vec3 vTangent;
in vec2 vUv;
in float vShellProgress;
in mat3 vNormalMatrix;
in float vDisplace;

layout(location=0) out vec4 outColor;



#include "../util/constants/pi.glsl";
#include "../util/xyz2octahedron.glsl";
#include "../util/xyz2equirect.glsl";

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

float powFast(float a, float b) {
  return a / ((1. - b) * a + b);
}

void main(void) {
    vec2 uv = vUv;
    vec2 uv0 = vUv;
    vec3 finalColor = vec3(0.0);
    
    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;

        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i*u4 + uTime*u3);

        d = sin(d*uTest + uTime)/2.;
        d = abs(d);

        d = pow(0.01 / d, 1.2);

        finalColor += col * d;
    }
    outColor = vec4(finalColor, 1.0);
}
