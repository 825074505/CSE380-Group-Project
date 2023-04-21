import Mat4x4 from "../../../DataTypes/Mat4x4";
import Vec2 from "../../../DataTypes/Vec2";
import Graphic from "../../../Nodes/Graphic";
import Light from "../../../Nodes/Graphics/Light";
import ResourceManager from "../../../ResourceManager/ResourceManager";
import QuadShaderType from "./QuadShaderType";

/** */
export default class CopyShaderType extends QuadShaderType {

	constructor(programKey: string){
		super(programKey);
		this.resourceManager = ResourceManager.getInstance();
	}

	initBufferObject(): void {
		this.bufferObjectKey = "light_buffer_key";
		this.resourceManager.createBuffer(this.bufferObjectKey);
	}

	render(gl: WebGLRenderingContext, options: Record<string, any>): void {

		const program = this.resourceManager.getShaderProgram(this.programKey);

		gl.useProgram(program);
		// Create a quad
		const quadBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		-1, -1,
		1, -1,
		-1, 1,
		1, 1
		]), gl.STATIC_DRAW);

		// Set up the attributes and uniforms
		const positionLocation = gl.getAttribLocation(program, 'a_position');
		const textureLocation = gl.getUniformLocation(program, 'u_texture');

		// Set up the viewport and clear the default framebuffer
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		//gl.clearColor(0, 0, 0, 1);
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Use the shader program, bind the quad, and set the texture
		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.activeTexture(gl.TEXTURE0 + options.textureNum);

		
		gl.bindTexture(gl.TEXTURE_2D, options.texture);
		gl.uniform1i(textureLocation, options.textureNum);

		// Draw the quad
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	getOptions(light: Light): Record<string, any> {
		let options: Record<string, any> = {
			
		}

		return options;
	}
}