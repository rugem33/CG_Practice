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
//import basicVertex from "./resources/shaders/basicVertex.js";
//import basicFragment from "./resources/shaders/basicFragment.js";

//import depthmapVertex from "./resources/shaders/depthmapVertex.js";
//import depthmapFragment from "./resources/shaders/depthmapFragment.js";
//import depthmapDebugFragment from "./resources/shaders/depthmapDebugFragment.js";

import pbrVertex from "./resources/shaders/pbrVertex.js";
import pbrFragment from "./resources/shaders/pbrFragment.js";
import { PBRMaterial } from "./rendering/core/PBRMaterial.js";

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

  // let quadModel = new Model(gl);
  // await quadModel.LoadModel("./resources/models/quad.obj");

  // cube program
  //let program = new Shader(gl, basicVertex, basicFragment);
  //let depthmapProgram = new Shader(gl, depthmapVertex, depthmapFragment);
  // let depthmapDebugProgram = new Shader(gl, basicVertex, depthmapDebugFragment);

  // pbr program
  let pbrProgram = new Shader(gl, pbrVertex, pbrFragment);

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

  /*  let depthmapWidth = 1024;
  let depthmapHeight = 1024;
  let light = new DirectionalLight(gl, [1.0, 1.0, 1.0], [2.0, 1.0, -2.0], 0.1, 1.0, depthmapWidth, depthmapHeight);*/
  
  // let material = new Material(1.0, 64.0);

  let lightPositions = [
    [-10.0, 10.0, 10.0],
    [10.0, 10.0, 10.0],
    [-10.0, -10.0, 10.0],
    [10.0, -10.0, 10.0]
  ];

  let lightColors = [
    [300.0, 300.0, 300.0],
    [300.0, 300.0, 300.0],
    [300.0, 300.0, 300.0],
    [300.0, 300.0, 300.0]
  ];

  let material = new PBRMaterial(    
    [0.5, 0.0, 0.0],
    1.0,
    0.5,
    1.0
  );

  SetupSliders();
  requestAnimationFrame(drawScene);

  // uniform 변수 포함 Draw Call 기능들을 함수로 정의하여 반복 호출(애니메이션 효과)
  function drawScene(){
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    renderer.Clear();

    pbrProgram.Bind();
    {
      let modelMatrix = mat4.create();
      mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1]);

      pbrProgram.SetUniformMatrix4fv("u_model", modelMatrix);
      pbrProgram.SetUniformMatrix4fv("u_view", camera.GetViewMatrix());
      pbrProgram.SetUniformMatrix4fv("u_projection", projectionMatrix);
      pbrProgram.SetUniform3f("u_eyePosition", camera.eye[0], camera.eye[1], camera.eye[2]);
    
      pbrProgram.SetPBRMaterial(material);
      pbrProgram.SetPBRLight(lightPositions, lightColors);

      teapotModel.RenderModel(renderer);
    }
    pbrProgram.Unbind();

    requestAnimationFrame(drawScene);
  }

  function SetupSliders(){
      const pitchslider = document.getElementById("pitchslider");
      const yawslider = document.getElementById("yawslider");
      const distanceslider = document.getElementById("distanceslider");
      /*const directionXSlider = document.getElementById("directionx");
      const directionYSlider = document.getElementById("directiony");
      const directionZSlider = document.getElementById("directionz");
      const specularIntensitySlider = document.getElementById("specularIntensity");
      const shininessSlider = document.getElementById("shininess");*/

      const albedoRSlider = document.getElementById("albedoR");
      const albedoGSlider = document.getElementById("albedoG");
      const albedoBSlider = document.getElementById("albedoB");
      const metallicSlider = document.getElementById("metallic");
      const roughnessSlider = document.getElementById("roughness");
      const aoSlider = document.getElementById("ao");

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
      /* directionXSlider.addEventListener('input', ()=>{
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
      });*/

      albedoRSlider.addEventListener('input', ()=>{
        material.albedo[0] = albedoRSlider.value;
      });
      albedoGSlider.addEventListener('input', ()=>{
        material.albedo[1] = albedoGSlider.value;
      });
      albedoBSlider.addEventListener('input', ()=>{
        material.albedo[2] = albedoBSlider.value;
      });
      metallicSlider.addEventListener('input', ()=>{
        material.metallic = metallicSlider.value;
      });
      roughnessSlider.addEventListener('input', ()=>{
        material.roughness = roughnessSlider.value;
      });
      aoSlider.addEventListener('input', ()=>{
        material.ao = aoSlider.value;
      });
    }
    
  SetupSliders();
  drawScene();
}main();