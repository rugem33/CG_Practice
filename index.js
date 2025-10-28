"use strict";

import {VertexBuffer} from "./rendering/core/VertexBuffer.js";
import {IndexBuffer} from "./rendering/core/IndexBuffer.js";
import { VertexArray } from "./rendering/core/VertexArray.js";
import { Shader } from "./rendering/core/Shader.js";
import { Renderer } from "./rendering/core/Renderer.js";
import { OrbitCamera } from "./rendering/core/OrbitCamera.js";
import { Model } from "./rendering/core/Model.js";
import { Texture } from "./rendering/core/Texture.js"; 
// 아래 두개가 최소한으로 필요한 셰이더
import basicVertex from "./resources/shaders/basicVertex.js";
import basicFragment from "./resources/shaders/basicFragment.js";


const {mat4, vec4} = glMatrix;

async function main(){

// uniform 변수 = 각각의 셰이더에서 공유하는 변수
// 정점을 생성하는 코드

  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  let checkerTexture = new Texture(gl);
  checkerTexture.LoadTexture("./resources/textures/CustomUVChecker_byValle_2K.png");

  let externalTexture = new Texture(gl);
  externalTexture.LoadTexture("https://c1.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg");

  let cubeModel = new Model(gl);
  await cubeModel.LoadModel("./resources/models/cube.obj");

  let teapotModel = new Model(gl);
  await teapotModel.LoadModel("./resources/models/teapot.obj");

  // cube program
  let program = new Shader(gl, basicVertex, basicFragment);

  let renderer = new Renderer(gl);

  const pitchslider = document.getElementById("pitchslider");
  pitchslider.addEventListener('input', ()=>{
    camera.pitch = pitchslider.value;
    camera.Update();
  });

  const yawslider = document.getElementById("yawslider");
  yawslider.addEventListener('input', ()=>{
    camera.yaw = yawslider.value;
    camera.Update();
  });

  const distanceslider = document.getElementById("distanceslider");
  distanceslider.addEventListener('input', ()=>{
    camera.distance = distanceslider.value;
    camera.Update();
  });

  let at = [0,0,0];
  let yaw = yawslider.value;
  let pitch = pitchslider.value;
  let distance = distanceslider.value;
  // OrbitCamera 객체 생성
  // at: 카메라가 바라보는 지점, yaw: y축 기준 회전각, pitch: x축 기준 회전각, distance: at 지점으로부터 카메라까지의 거리, turnspeed: 마우스 드래그 시 회전 속도
  let camera = new OrbitCamera(at, yaw, pitch, distance, 0.01);

  let projectionMatrix = mat4.create();
  let fovy = 60.0 * Math.PI / 180.0; // 라디안 단위
  let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight; 
  let near = 0.1;
  let far = 100.0;
  mat4.perspective(projectionMatrix, fovy, aspect, near, far);

  requestAnimationFrame(drawScene);

  let rotationAngle = 0.0;

  // uniform 변수 포함 Draw Call 기능들을 함수로 정의하여 반복 호출(애니메이션 효과)
  function drawScene(){

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    rotationAngle += 0.1 * Math.PI / 180.0;

    //---rectangle buffer Setup---//
    // 실행 가능한 상태의 program을 webgl에 바인딩
    // gl.bindbuffer()와 유사한 기능
    // array buffer에 저장된 정점 데이터를 attribute 변수 a_position에 바인딩
    /*gl.useProgram(program);
    rectangleVAO.bind(); // rectangle VAO 바인딩*/

    // 모든 프로그램이 동일하게 갖는 값은 uniform 변수로 전달


    // rectangle uniform setting
    /*var location = gl.getUniformLocation(program, "u_color"); // program에서 변수(u_color)의 위치를 가져옴
    gl.uniform4f(location, 0.8, 0.3, 0.8, 1.0); // location이 가리키고 있는 변수가 4개의 파라미터를 가짐을 알림*/
    

    /*var offsetLocation = gl.getUniformLocation(program, "u_offset");  // program에서 변수(u_offset)의 위치를 가져옴
    gl.uniform4f(offsetLocation, x_offset, 0.0, 0.0, 0.0); // x축으로 x_offset만큼 평행이동*/
    
    //---Draw Call---//
    // Draw Call Triangle 
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    
    // Draw Call Indexed Triangles
    // index buffer에 저장된 인덱스 개수만큼 삼각형을 그려라
    /*var primitiveType = gl.TRIANGLES; //삼각형 모드
    var count = rectangleIB.getCount(); //인덱스 개수
    var offset = 0; //인덱스 버퍼의 오프셋
    gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);

    gl.useProgram(null); // optional
    rectangleVAO.unbind(); // rectangle VAO 바인딩 해제

    // triangle draw call
    //---triangle buffer Setup---//
    gl.useProgram(triangleprogram);
    triangleVAO.bind(); // triangle VAO 바인딩

    gl.drawElements(primitiveType, triangleIB.getCount(), gl.UNSIGNED_SHORT, 0);

    gl.useProgram(null); // optional
    triangleVAO.unbind(); // triangle VAO 바인딩 해제*/
    renderer.Clear();

    // rectangle draw call
    program.Bind();
    {
        let modelMatrix = mat4.create();
        mat4.fromYRotation(modelMatrix, rotationAngle);
        mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -3.0]);

        program.SetUniformMatrix4fv("u_model", modelMatrix);
        program.SetUniformMatrix4fv("u_view", camera.GetViewMatrix());
        program.SetUniformMatrix4fv("u_projection", projectionMatrix);
        // program.SetUniform4f("u_color", 0.8, 0.3, 0.8, 1.0);
        externalTexture.Bind(0);
        program.SetUniform1i("u_texture", 0);
        cubeModel.RenderModel(renderer);

        modelMatrix = mat4.create();
        mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1]);
        program.SetUniformMatrix4fv("u_model", modelMatrix);
        checkerTexture.Bind(0);
        program.SetUniform1i("u_texture", 0);
        teapotModel.RenderModel(renderer);

    }
    program.Unbind();
    
    requestAnimationFrame(drawScene);
  }

  drawScene();
}main();