#version 300 es
precision highp float;

in vec2 aPosition;
in vec2 aTextureCoord;

out vec2 vTextureCoord;

uniform mat4 uModelViewMat;
uniform mat4 uProjectionMat;

// Orb centre in GL world space, quad half width in cells
uniform vec3 uPosition;
uniform float uSize;

void main(void) {
    // Camera-facing quad: corners are added in view space
    vec4 center   = uModelViewMat * vec4(uPosition, 1.0);
    gl_Position   = uProjectionMat * (center + vec4(aPosition * uSize, 0.0, 0.0));
    vTextureCoord = aTextureCoord;
}
