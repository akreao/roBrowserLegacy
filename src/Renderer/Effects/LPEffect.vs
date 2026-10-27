#version 300 es
#pragma vscode_glsllint_stage : vert
precision highp float;

in vec2 aPosition;
in vec2 aTextureCoord;
out vec2 vTextureCoord;
uniform mat4 uModelViewMat;
uniform mat4 uProjectionMat;
uniform vec3 uPosition;
uniform float uSize;
uniform float uLift;

void main(void) {
    // The quad's corners go on the world axes, uSize cells from the centre (a diamond).
    vec2 corner    = vec2(aPosition.x - aPosition.y, aPosition.x + aPosition.y) * 0.5 * uSize;
    vec4 position  = vec4(uPosition.x + 0.5 + corner.x, -uPosition.z - uLift, uPosition.y + 0.5 + corner.y, 1.0);
    gl_Position    = uProjectionMat * uModelViewMat * position;
    gl_Position.z -= 0.01;
    vTextureCoord  = aTextureCoord;
}
