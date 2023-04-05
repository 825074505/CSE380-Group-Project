precision mediump float;

uniform sampler2D u_Sampler;
uniform float u_Alpha;

varying vec2 v_TexCoord;

void main(){
	gl_FragColor = texture2D(u_Sampler, v_TexCoord);
	gl_FragColor.a *= smoothstep(0.0, 1.0, u_Alpha); //This should probably be removed and done in the js
}