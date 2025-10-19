export class Shader{
    gl;
    id;
    // dictionary 자료구조 (cache 용도)
    // key: uniform 변수명, value: 해당 uniform 변수의 location
    locations = {};

    constructor(gl, vsource, fsource)
    {
        this.gl = gl;
        // webgltutils 내 함수를 호출하면서 gl(attribute Buffer)와 두 셰이더 코트(텍스트)를 배열로 묶어 인자로 넘김
        // cpu에서 gpu로 셰이더 코드를 보내고(해당 코드는 gpu에서 실행) 컴파일 + 링크까지 해줌
        // 프로그램 객체를 리턴
        this.id = webglUtils.createProgramFromSources(this.gl,[vsource, fsource]);
    }

    Bind()
    {
        this.gl.useProgram(this.id); 
    }

    Unbind()
    {
        this.gl.useProgram(null); 
    }
    // uniform 변수의 location을 dictionary에서 찾아서 반환
    // 없으면 gl.getUniformLocation() 호출하여 location을 가져오고 dictionary에 저장
    GetUniformLocation(name)
    {
        let location = 0;
        if(name in this.locations)
        {
            location = this.locations[name];
        }
        else
        {
            location = this.gl.getUniformLocation(this.id, name); 
            this.locations[name] = location;
        }
        return location;
    }
    // float 4개짜리 uniform 변수에 값을 설정하는 함수
    // 특정 name의 uniform 변수에 v0, v1, v2, v3 값을 설정
    SetUniform4f(name, v0, v1, v2, v3)
    {
        let location = this.GetUniformLocation(name);
        this.gl.uniform4f(location, v0, v1, v2, v3);
    }
    
    SetUniformMatrix4fv(name, mat)
    {
        let location = this.GetUniformLocation(name);
        this.gl.uniformMatrix4fv(location, false, mat);
    }

    SetUniform1i(name, value){
        let location = this.GetUniformLocation(name);
        this.gl.uniform1i(location, value);
    }
}
