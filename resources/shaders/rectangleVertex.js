export default
`#version 300 es
    layout(location=0) in vec4 a_position;
    layout(location=1) in vec4 a_color;

    uniform vec4 u_offset;
    out vec4 v_color;
    void main() {      
        gl_Position = a_position + u_offset;
        v_color = a_color;
    }`;
// Vertex shader 
// vec4 : 4개의 float로 이루어진 벡터
// vec4라는 타입의 a_position이라는 이름의 attribute 변수 선언
// a_position에 정점 위치 데이터를 전달(현재 코드는 PB의 정점 데이터)
// offset라는 이름의 uniform 변수로 평행이동