precision mediump float;

varying vec4 v_Position;

uniform float u_Alpha;

uniform vec2 canvasSize;

uniform vec2 u_size;

/**
 * Macros that define constants used in the fragment shader program. 
 */
#define MIN_DISTANCE 0.00
#define MAX_DISTANCE 0.02
#define MIDLINE 0.0

/**
 *  This function generates the appropriate alpha value for the fragment color
 *  to render a laser that looks like a sin wave. The alpha value depends on 
 *  the distance of the vertex position from the sine waves curve. Positions
 *  closer to the curve of the sin wave should have a higher alpha value.
 *
 *  +------------------------------------------------------+
 *  | 	   __	  __	 __		__	   __	  __		   | 
 *  | 	  /	 \	 /	\	/  \   /  \	  /	 \	 /	\		   |
 *  |   _/	  \_/	 \_/	\_/	   \_/	  \_/	 \_		   |  
 *  | 													   |
 *  +------------------------------------------------------+
 *
 *  @param position - the position from the vertex shader (v_Position)
 *  @return - the alpha value of the fragment color
 */
float sinwave_laser(vec4 position);

/**
 *  This function generates the appropriate alpha value for the fragment shader
 *  to render a laser that is a straight line. The alpha value depends on the
 *  distance of the vertex fragments position from the midline of the lasers
 *  bounding rectangle. 
 *
 *  +------------------------------------------------------+
 *  | 													   |
 *  + -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - + <- this is the midline
 *  |													   |
 *  +------------------------------------------------------+
 */
float linear_laser(vec4 position);

//This function is from https://www.shadertoy.com/view/4sc3Wn by Flyguy
//Distance to a line segment,
float dfLine(vec2 start, vec2 end, vec2 uv)
{
	vec2 line = end - start;
	float frac = dot(uv - start,line) / dot(line,line);
	return distance(start + line * clamp(frac, 0.0, 1.0), uv);
}

// TODO Need to somehow pass in the color from the laser shader type
uniform vec4 u_FragColor;
void main(){
    gl_FragColor = u_FragColor;
	//gl_FragColor.a = linear_laser(v_Position) * u_Alpha;
	gl_FragColor.a = u_Alpha;
}


// TODO Get the laser to look like a sinwave
float sinwave_laser(vec4 position) {
    float s = sin(position.x*40.0) * 0.015;
    float dist = distance(position.y, s);
	return 1.0 - smoothstep(MIN_DISTANCE, MAX_DISTANCE, dist);
}

float linear_laser(vec4 position) {
	float dist = distance(position.y, MIDLINE) * (u_size.x / 600.0);
	return 1.0 - smoothstep(MIN_DISTANCE, MAX_DISTANCE, dist);
}


