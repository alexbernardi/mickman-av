uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform sampler2D uMap;
uniform float uTextureBlendFactor;
uniform float uScaleFactor;

varying float vElevation;
varying vec2 vUv;


void main()
{
    vec2 scaledUv = vUv * uScaleFactor; // scaleFactor is a vec2 to control repeat in x and y directions

    // Retrieve the texture color
    vec3 uMapColor = texture2D(uMap, scaledUv).xyz;

    // Calculate mix strength based on elevation and other factors
    float mixStrength = vElevation * uColorMultiplier + uColorOffset;

    // Interpolate between two colors based on elevation
    vec3 baseColor = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Blend the base color with the texture color
    vec3 blendedColor = mix(baseColor, uMapColor, uTextureBlendFactor); // textureBlendFactor controls the blend ratio

    // Set the final color
    gl_FragColor = vec4(blendedColor, 1.0);

    #include <colorspace_fragment>
}