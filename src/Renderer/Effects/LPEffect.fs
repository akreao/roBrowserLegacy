#version 300 es
#pragma vscode_glsllint_stage : frag
precision highp float;

in vec2 vTextureCoord;
uniform sampler2D uDiffuse;
uniform float uAlpha;
out vec4 fragColor;

void main(void) {
    vec4 textureSample = texture( uDiffuse,  vTextureCoord.st );
    if (textureSample.a == 0.0) {
        discard;
    }
    fragColor = vec4(textureSample.rgb, textureSample.a * uAlpha);
}
