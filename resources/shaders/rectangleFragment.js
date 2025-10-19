export default
`#version 300 es
    precision mediump float;
    layout(location=0) out vec4 outColor;

    in vec4 v_color;

    void main() {
        outColor = v_color;}`;
// Fragment shader - 픽셀마다 색상을 결정하는 셰이더(픽셀 수만큼 병렬실행)
// outColor라는 이름의 출력 변수 선언
// outColor에 vec4 타입의 RGBA 색상 데이터 전달(현재 코드는 빨간색)
// v_color라는 이름의 입력 변수 선언
// vertex shader에서 계산된 보간된 색상 데이터를 전달받음