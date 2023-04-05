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

//Adapted from https://github.com/motion-canvas/examples/blob/master/examples/deferred-lighting/src/shaders/light.fragment.glsl

vec2 rotate2D(vec2 v, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

void main() {
  //vec4 color = texture2D(u_texture, v_texCoord);
  //float length = distance(gl_FragCoord.xy, vLightPosition);
  //float distanceFalloff = clamp(1.0 - length/(canvasSize.x) * 2.0 + (dst)/(canvasSize.x), 0.0, 1.0);
  //distanceFalloff *= distanceFalloff;


  //float scaledDst = dst * lightScale;
  //float distanceFalloff = clamp(1.0 - (length * lightScale) / (canvasSize.x) * 2.0 + scaledDst / (canvasSize.x), 0.0, 1.0);
  //distanceFalloff *= distanceFalloff;

  //float refDst = dst / lightScale;
  //float referenceFalloff = clamp(1.0 - length / (canvasSize.x) * 2.0 + refDst / (canvasSize.x), 0.0, 1.0);
  //float distanceFalloff = pow(referenceFalloff, lightScale);
  //distanceFalloff *= distanceFalloff;

  vec4 color = texture2D(u_texture, v_texCoord);
  float length = distance(gl_FragCoord.xy, vLightPosition);
  float distanceFalloff = clamp(1.0 - length / (canvasSize.x * lightScale) * 2.0 + (dst * lightScale) / (canvasSize.x), 0.0, 1.0);
  distanceFalloff *= distanceFalloff;




  vec2 direction = (gl_FragCoord.xy - vLightPosition) / length;
  vec2 rotatedReference = rotate2D(vec2(0.99, 0.0), lightAngle);
  float angle = acos(dot(direction, rotatedReference));
  float angularFalloff = clamp(smoothstep(radians(angleRange.x), radians(angleRange.y), angle), 0.0, 1.0);

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