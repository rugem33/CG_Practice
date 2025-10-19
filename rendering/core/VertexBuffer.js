export class VertexBuffer {
    gl;
    id; // position buffer id

    constructor(gl, data){
        this.gl = gl;
        // gpu memory에 position buffer의 정점 데이터를 저장하는 버퍼 객체 생성 
        this.id = gl.createBuffer();
        // ARRAY_BUFFER는 vertex buffer 용도로 사용됨을 의미
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        // position buffer에 정점 데이터 저장 (cpu -> gpu)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }

    bind(){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.id);
    }

    unbind(){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
}