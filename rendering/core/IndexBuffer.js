export class IndexBuffer {
    id; // index buffer id
    // bind, unbind 시 gl context에 접근하기 위해 member 변수로 저장
    gl; // gl context
    count; // number of indices (drawElements 호출 시 사용)

    constructor(gl, data, count){
        // gl context 저장
        this.gl = gl;
        // index buffer에 인덱스 데이터를 저장하는 버퍼 객체 생성
        this.id = gl.createBuffer();
        // ELEMENT_ARRAY_BUFFER는 index buffer 용도로 사용됨을 의미
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
        // index buffer에 인덱스 데이터 저장 (cpu -> gpu)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

        this.count = count;
    }
    bind(){
        // member 변수 gl을 통해 gl context에 접근 가능
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.id);
    }
    unbind(){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }   
    getCount(){
        return this.count;
    }
}