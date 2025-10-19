export class VertexArray {
    id;
    gl;

    constructor(gl) {
        this.id = gl.createVertexArray();
        this.gl = gl;
    }

    bind() {
        // ArrayBuffer와 ElementArrayBuffer, program이 전부 null인 상태이므로 다시 바인드 필요
        // VAO를 바인딩하면 VAO에 바인딩된 버퍼 객체들도 자동으로 바인딩됨
        this.gl.bindVertexArray(this.id);
    }

    unbind() {
        this.gl.bindVertexArray(null); // rectangle VAO 의 바인딩 해제 > rectangle VAO에 바인딩된 버퍼 객체들은 null이 아님
    }


    // enableVertexAttribArray, vertexAttribPointer를 묶어서 처리
    // countArray : 각 attribute의 컴포넌트 개수 배열
    // nomalizedArray : 각 attribute의 정규화 여부 배열
    AddBuffer(vb, countArray, nomalizedArray){
        this.bind();
        vb.bind();

        // stride 계산 (3D의 stride도 계산 가능)
        // countArray의 각 요소에 3D인지 2D인지에 따라 컴포넌트 개수가 다르므로
        // countArray의 각 요소에 3 또는 2를 곱해서 stride 계산
        var stride = 0;
        for(var i=0; i<countArray.length; i++){
            stride += countArray[i] * 4; // float 4바이트
        }

        var offset = 0;
        for(var i=0; i<countArray.length; i++){
            // vertexShader의 layout(location=0) in vec4 a_position; 와 연결
            this.gl.enableVertexAttribArray(i);
            // location=0인 attribute 변수 a_position에
            // 각 정점이 몇 개의 컴포넌트로 구성되어있는지 (각 포지션을 몇 개의 컴포넌트로 구성할지)
            // 정규화 방법
            // stride, 다음 정점 데이터의 상대 시작 위치
            // offset, 버퍼의 시작 위치

            // 즉, 첫 번째 vertexshader의 a_position에 첫 두개의 컴포넌트로 구성된 정점 0, 
            // 두 번째 vertexshader의 a_position에 다음 두개의 컴포넌트로 구성된 정점 1,
            // 세 번째 vertexshader의 a_position에 다음 두개의 컴포넌트로 구성된 정점 2
            // 이렇게 총 3개의 vertexshader가 병렬실행됨
            this.gl.vertexAttribPointer(i, //attribute 위치 0번
                                countArray[i], //컴포넌트 개수
                                this.gl.FLOAT, //데이터 타입
                                nomalizedArray[i], //정규화 여부
                                stride, //stride, 각 정점 사이의 간격 (float으로 정규화 했으므로 바이트 단위)
                                offset); //버퍼의 오프셋(시작 위치)
            offset += countArray[i] * 4;
        }
    }
}