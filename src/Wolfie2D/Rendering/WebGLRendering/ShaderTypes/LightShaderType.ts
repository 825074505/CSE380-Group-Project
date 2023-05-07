import Mat4x4 from "../../../DataTypes/Mat4x4";
import Vec2 from "../../../DataTypes/Vec2";
import Graphic from "../../../Nodes/Graphic";
import Light from "../../../Nodes/Graphics/Light";
import ResourceManager from "../../../ResourceManager/ResourceManager";
import QuadShaderType from "./QuadShaderType";
import MathUtils from "../../../Utils/MathUtils";
/** */
export default class LightShaderType extends QuadShaderType {

	constructor(programKey: string){
		super(programKey);
		this.resourceManager = ResourceManager.getInstance();
	}

	initBufferObject(): void {
		this.bufferObjectKey = "light_buffer_key";
		this.resourceManager.createBuffer(this.bufferObjectKey);
	}

	render(gl: WebGLRenderingContext, options: Record<string, any>): void {

		options.position = options.position.clone().scale(options.worldSize.x/900);
		const program = this.resourceManager.getShaderProgram(this.programKey);

		gl.useProgram(program);
		// Create a quad
		const quadBuffer = this.resourceManager.getBuffer(this.bufferObjectKey);;
		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		
		/*
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		-0.75, -0.75,
		1, -1,
		-1, 1,
		0.75, 0.75
		]), gl.STATIC_DRAW);
		*/
		const halfSize = (options.distance + 0.50 * options.worldSize.x) * options.scale;
		
		const maxX = MathUtils.clamp((options.position.x + halfSize - (options.worldSize.x / 2))/(options.worldSize.x/2), -1, 1);
		const minX = MathUtils.clamp((options.position.x - halfSize - (options.worldSize.x / 2))/(options.worldSize.x / 2), -1, 1);
		const maxY = MathUtils.clamp((options.worldSize.x - options.position.y + halfSize - (options.worldSize.x / 2))/(options.worldSize.x / 2), -1, 1);
		const minY = MathUtils.clamp((options.worldSize.x - options.position.y - halfSize - (options.worldSize.x / 2))/(options.worldSize.x / 2), -1, 1);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		minX, minY,
		maxX, minY,
		minX, maxY,
		maxX, maxY,
		]), gl.STATIC_DRAW);
		
		
		// Set up the attributes and uniforms
		const positionLocation = gl.getAttribLocation(program, 'a_position');
		const textureLocation = gl.getUniformLocation(program, 'u_texture');

		// Set up the viewport and clear the default framebuffer
		gl.viewport(0, 0, options.worldSize.x, options.worldSize.x);
		//gl.clearColor(0, 0, 0, 1);
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Use the shader program, bind the quad, and set the texture
		//gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.activeTexture(gl.TEXTURE0 + 30);

		
		gl.bindTexture(gl.TEXTURE_2D, options.texture);
		gl.uniform1i(textureLocation, 30);

		const lightPositionLocation = gl.getUniformLocation(program, "lightPosition");
		gl.uniform2f(lightPositionLocation, options.position.x, options.worldSize.x - options.position.y);

		var canvasSizeLoc = gl.getUniformLocation(program, "canvasSize");
		gl.uniform2f(canvasSizeLoc, options.worldSize.x, options.worldSize.x);



		const lightAngleLocation = gl.getUniformLocation(program, "lightAngle");
		gl.uniform1f(lightAngleLocation, options.angle);

		/*
		uniform vec3 lightTint;
		uniform float opacity;
		uniform float intensity;
		*/

		const lightTintLocation = gl.getUniformLocation(program, "lightTint");
		gl.uniform3f(lightTintLocation, options.tintColor.r/255, options.tintColor.g/255, options.tintColor.b/255);

		const opacityLocation = gl.getUniformLocation(program, "opacity");
		gl.uniform1f(opacityLocation, options.opacity);

		const intensityLocation = gl.getUniformLocation(program, "intensity");
		gl.uniform1f(intensityLocation, options.intensity);

		const distanceLocation = gl.getUniformLocation(program, "dst");
		gl.uniform1f(distanceLocation, options.distance);

		
		const lightscaleLocation = gl.getUniformLocation(program, "lightScale");
		gl.uniform1f(lightscaleLocation, options.scale);
		
		const angleRangeLocation = gl.getUniformLocation(program, "angleRange");
		gl.uniform2f(angleRangeLocation, options.angleRange.x, options.angleRange.y);

		const lineEndPositionLocation = gl.getUniformLocation(program, "lineEndPosition");
		if(options.lineEndPosition.x == -1)
			gl.uniform2f(lineEndPositionLocation, options.lineEndPosition.x, options.lineEndPosition.y);
		else
			gl.uniform2f(lineEndPositionLocation, options.lineEndPosition.x, options.worldSize.x - options.lineEndPosition.y);

		// Draw the quad
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	getOptions(light: Light): Record<string, any> {
		let options: Record<string, any> = {
			position: light.position,
			angle: light.angle,
			intensity: light.intensity,
			distance: light.distance,
			opacity: light.opacity,
			tintColor: light.tintColor,
			angleRange: light.angleRange,
			scale: light.lightScale,
			lineEndPosition: light.lineEndPosition,
		}

		return options;
	}
}