attribute vec2 a_position;
varying vec2 v_texCoord;
uniform vec2 lightPosition;
varying vec2 vLightPosition;

void main() {
	v_texCoord = a_position * 0.5 + 0.5;
	gl_Position = vec4(a_position, 0.0, 1.0);

	vLightPosition = lightPosition;
}