precision mediump float;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main() {
  //gl_FragColor.rgba = texture2D(u_texture, v_texCoord);
  /*
  vec4 sum = vec4(0.0);
  float numSamples = 0.0;

  for (int x = -2; x <= 2; x++) {
    for (int y = -2; y <= 2; y++) {
      vec2 offset = vec2(float(x), float(y)) / vec2(900.0, 900.0);
      sum += texture2D(u_texture, v_texCoord + offset);
      numSamples += 1.0;
    }
  }

  gl_FragColor = sum / numSamples;
  */

  vec2 texCoord = vec2(
    floor(v_texCoord.x * 150.0 + 0.5) / 150.0,
    floor(v_texCoord.y * 150.0 + 0.5) / 150.0
  );

  gl_FragColor = texture2D(u_texture, texCoord);
  //gl_FragColor = texture2D(u_texture, v_texCoord/6.0);
}