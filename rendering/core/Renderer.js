export class Renderer {
    gl;

    constructor(gl) {
        this.gl = gl;
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
    }

    Clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    // 기존 drawcall 함수 대체
    Draw(VAO, IB) {
        VAO.bind();
        IB.bind();

        let primitiveType = this.gl.TRIANGLES;
        let indexCount = IB.getCount();
        let indexOffset = 0;

        this.gl.drawElements(primitiveType, indexCount, this.gl.UNSIGNED_SHORT, indexOffset);

        VAO.unbind();
        IB.unbind();
    }
}