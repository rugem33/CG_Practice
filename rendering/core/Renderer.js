export class Renderer {
    gl;

    constructor(gl) {
        this.gl = gl;
    }

    Clear() {
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