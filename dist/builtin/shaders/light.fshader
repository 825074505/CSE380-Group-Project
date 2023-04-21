precision mediump float;
varying vec2 v_texCoord;
uniform sampler2D u_texture;
uniform vec2 canvasSize;
uniform float lightAngle;
varying vec2 vLightPosition;
uniform float dst;
uniform vec3 lightTint;
uniform float opacity;
uniform float intensity;
uniform vec2 angleRange;
uniform float lightScale;
uniform vec2 lineEndPosition;

//Adapted from https://github.com/motion-canvas/examples/blob/master/examples/deferred-lighting/src/shaders/light.fragment.glsl

vec2 rotate2D(vec2 v, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

//This function is from https://www.shadertoy.com/view/4sc3Wn by Flyguy
//Distance to a line segment,
float dfLine(vec2 start, vec2 end, vec2 uv)
{
	vec2 line = end - start;
	float frac = dot(uv - start,line) / dot(line,line);
	return distance(start + line * clamp(frac, 0.0, 1.0), uv);
}

vec2 closestPointOnLine(vec2 start, vec2 end, vec2 uv)
{
	vec2 line = end - start;
	float frac = dot(uv - start,line) / dot(line,line);
	return start + line * clamp(frac, 0.0, 1.0); 
}

void main() {
  vec4 color = texture2D(u_texture, v_texCoord);
  //float length = (lineEndPosition == vec2(-1.0, -1.0)) ? distance(gl_FragCoord.xy, vLightPosition) : dfLine(vLightPosition, lineEndPosition, gl_FragCoord.xy);
  float length = distance(gl_FragCoord.xy, vLightPosition);
  float distanceFalloff = clamp(1.0 - length / (canvasSize.x * lightScale) * 2.0 + (dst * lightScale) / (canvasSize.x), 0.0, 1.0);
  distanceFalloff *= distanceFalloff;


  vec2 direction = (gl_FragCoord.xy - vLightPosition) / length;
  vec2 rotatedReference = rotate2D(vec2(0.99, 0.0), lightAngle);
  float angle = acos(dot(direction, rotatedReference));
  float angularFalloff = clamp(smoothstep(radians(angleRange.x), radians(angleRange.y), angle), 0.0, 1.0);
  //angularFalloff = (lineEndPosition == vec2(-1.0, -1.0)) ? angularFalloff : 1.0;

  float finalA = angularFalloff * distanceFalloff * intensity;
  vec3 finalColor = color.rgb;
  float originalA = finalA;
  finalA *= mix(1.0, color.a, opacity);

  gl_FragColor.rgb = finalColor * lightTint;
  gl_FragColor.a = finalA;

  gl_FragColor.rgba += mix(
        vec4(lightTint * finalA, 0.0),
        vec4(lightTint * originalA, originalA),
        opacity
    );
}