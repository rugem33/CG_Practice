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
    
    SetUniform3f(name, v0, v1, v2)
    {
        let location = this.GetUniformLocation(name);
        this.gl.uniform3f(location, v0, v1, v2);
    }

    SetUniform1f(name, v)
    {
        let location = this.GetUniformLocation(name);
        this.gl.uniform1f(location, v);
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

    SetLight(light) {
        this.SetUniform3f("u_directionalLight.base.color", light.lightColor[0], light.lightColor[1], light.lightColor[2]);
        this.SetUniform3f("u_directionalLight.direction", light.direction[0], light.direction[1], light.direction[2]);
        this.SetUniform1f("u_directionalLight.base.diffuseIntensity", light.diffuseIntensity);
        this.SetUniform1f("u_directionalLight.base.ambientIntensity", light.ambientIntensity);
    }

    SetMaterial(material) {
        this.SetUniform1f("u_material.specularIntensity", material.specularIntensity);
        this.SetUniform1f("u_material.shininess", material.shininess);
    }

    SetDepthmapLightTransform(light){
        this.SetUniformMatrix4fv("u_lightVP", light.CalculateLightTransform());
    }

    SetPBRMaterial(PBRMaterial) {
        this.SetUniform3f("u_albedo", PBRMaterial.albedo[0], PBRMaterial.albedo[1], PBRMaterial.albedo[2]);
        this.SetUniform1f("u_metallic", PBRMaterial.metallic);
        this.SetUniform1f("u_roughness", PBRMaterial.roughness);
        this.SetUniform1f("u_ao", PBRMaterial.ao);
    }

    SetPBRLight(lightPositions, lightColors) {
        for (let i = 0; i < lightPositions.length; i++) {
            this.SetUniform3f(`u_lightPositions[${i}]`, lightPositions[i][0], lightPositions[i][1], lightPositions[i][2]);
            this.SetUniform3f(`u_lightColors[${i}]`, lightColors[i][0], lightColors[i][1], lightColors[i][2]);
        }
    }
}
