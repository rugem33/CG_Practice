"use strict";

import {VertexBuffer} from "./rendering/core/VertexBuffer.js";
import {IndexBuffer} from "./rendering/core/IndexBuffer.js";
import { VertexArray } from "./rendering/core/VertexArray.js";
import { Shader } from "./rendering/core/Shader.js";
import { Renderer } from "./rendering/core/Renderer.js";
import { OrbitCamera } from "./rendering/core/OrbitCamera.js";
import { Model } from "./rendering/core/Model.js";
import { Texture } from "./rendering/core/Texture.js";
import { DirectionalLight } from "./rendering/light/DirectionalLight.js"; 
import { Material } from "./rendering/core/Material.js";
// 아래 두개가 최소한으로 필요한 셰이더
import basicVertex from "./resources/shaders/basicVertex.js";
import basicFragment from "./resources/shaders/basicFragment.js";

import depthmapVertex from "./resources/shaders/depthmapVertex.js";
import depthmapFragment from "./resources/shaders/depthmapFragment.js";
import depthmapDebugFragment from "./resources/shaders/depthmapDebugFragment.js";

depthmapDebugFragment


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

  let teapotModel = new Model(gl);
  await teapotModel.LoadModel("./resources/models/teapot.obj");

  let quadModel = new Model(gl);
  await quadModel.LoadModel("./resources/models/quad.obj");

  // cube program
  let program = new Shader(gl, basicVertex, basicFragment);
  let depthmapProgram = new Shader(gl, depthmapVertex, depthmapFragment);
  // let depthmapDebugProgram = new Shader(gl, basicVertex, depthmapDebugFragment);

  let renderer = new Renderer(gl);

  let at = [0,0,0];
  let yaw = 90;
  let pitch = 0;
  let distance = 5;
  // OrbitCamera 객체 생성
  // at: 카메라가 바라보는 지점, yaw: y축 기준 회전각, pitch: x축 기준 회전각, distance: at 지점으로부터 카메라까지의 거리, turnspeed: 마우스 드래그 시 회전 속도
  let camera = new OrbitCamera(at, yaw, pitch, distance, 0.01);

  let projectionMatrix = mat4.create();
  let fovy = 60.0 * Math.PI / 180.0; // 라디안 단위
  let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight; 
  let near = 0.1;
  let far = 100.0;
  mat4.perspective(projectionMatrix, fovy, aspect, near, far);

  let depthmapWidth = 1024;
  let depthmapHeight = 1024;
  let light = new DirectionalLight(gl, [1.0, 1.0, 1.0], [2.0, 1.0, -2.0], 0.1, 1.0, depthmapWidth, depthmapHeight);

  let material = new Material(1.0, 64.0);

  SetupSliders();
  requestAnimationFrame(drawScene);

  // uniform 변수 포함 Draw Call 기능들을 함수로 정의하여 반복 호출(애니메이션 효과)
  function drawScene(){
    light.depthmap.Bind();
    depthmapProgram.Bind();
    {
      let modelMatrix = mat4.create();
      mat4.scale(modelMatrix, modelMatrix, [0.1,0.1,0.1]);

      depthmapProgram.SetUniformMatrix4fv("u_model", modelMatrix);
      depthmapProgram.SetDepthmapLightTransform(light);

      renderer.Clear();
      gl.viewport(0, 0, light.depthmapWidth, light.depthmapHeight);
      teapotModel.RenderModel(renderer);
    }
    light.depthmap.Unbind();
    depthmapProgram.Unbind();

    program.Bind();
    {
      webglUtils.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
      renderer.Clear();

      let modelMatrix = mat4.create();
      mat4.scale(modelMatrix, modelMatrix, [0.1,0.1,0.1]);

      program.SetUniformMatrix4fv("u_model", modelMatrix);
      program.SetUniformMatrix4fv("u_view", camera.GetViewMatrix());
      program.SetUniformMatrix4fv("u_projection", projectionMatrix);
      program.SetUniformMatrix4fv("u_lightSpaceMatrix", light.CalculateLightTransform());
      
      checkerTexture.Bind(0);
      program.SetUniform1i("u_texture", 0);
      program.SetLight(light);
      program.SetUniform3f("u_eyePosition", camera.eye[0], camera.eye[1], camera.eye[2]);
      program.SetMaterial(material);
      light.depthmap.Read(1);
      program.SetUniform1i("u_depthMap", 1);

      teapotModel.RenderModel(renderer);

      modelMatrix = mat4.create();
      mat4.translate(modelMatrix, modelMatrix, [0.0, -0.8, 0.0]); 
      mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1]);
      program.SetUniformMatrix4fv("u_model", modelMatrix);
      quadModel.RenderModel(renderer);
    }
    program.Unbind();

    requestAnimationFrame(drawScene);
  }

  function SetupSliders(){
      const pitchslider = document.getElementById("pitchslider");
      const yawslider = document.getElementById("yawslider");
      const distanceslider = document.getElementById("distanceslider");
      const directionXSlider = document.getElementById("directionx");
      const directionYSlider = document.getElementById("directiony");
      const directionZSlider = document.getElementById("directionz");
      const specularIntensitySlider = document.getElementById("specularIntensity");
      const shininessSlider = document.getElementById("shininess");

      pitchslider.addEventListener('input', ()=>{
        camera.pitch = pitchslider.value;
        camera.Update();
      });
      yawslider.addEventListener('input', ()=>{
        camera.yaw = yawslider.value;
        camera.Update();
      });
      distanceslider.addEventListener('input', ()=>{
        camera.distance = distanceslider.value;
        camera.Update();
      });
      directionXSlider.addEventListener('input', ()=>{
        light.direction[0] = directionXSlider.value;
      });
      directionYSlider.addEventListener('input', ()=>{
        light.direction[1] = directionYSlider.value;  
      });
      directionZSlider.addEventListener('input', ()=>{
        light.direction[2] = directionZSlider.value;  
      });
      specularIntensitySlider.addEventListener('input', ()=>{
        material.specularIntensity = specularIntensitySlider.value;  
      });
      shininessSlider.addEventListener('input', ()=>{
        material.shininess = shininessSlider.value;
      });
    }
    
  SetupSliders();
  drawScene();
}main();