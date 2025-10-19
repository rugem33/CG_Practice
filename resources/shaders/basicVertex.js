export default
`#version 300 es

layout(location=0) in vec3 a_position;
layout(location=1) in vec2 a_texCoord;
layout(location=2) in vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_projection;
uniform mat4 u_view;

out vec2 v_texCoord;
out vec3 v_normal;

void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
    v_normal = a_normal;
}`;
// Vertex shader - 정점마다 실행되는 셰이더(정점 수만큼 병렬실행)
// a_position이라는 이름의 입력 변수 선언
// a_position에 vec4 타입의 정점 데이터 전달