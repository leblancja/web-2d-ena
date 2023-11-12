import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

main();

function main() {
    const canvas = document.querySelector("#glcanvas");
     //initialize the GL context
     const gl = canvas.getContext("webgl");
    
    if (gl === null) {
        alert(
          "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
      }

    //set the clear color of the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

    //vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;
    const fsSource = `
        void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
  `;

    //create a shader program
    const shaderProgram = createShaderProgram(gl, vsSource, fsSource);
    //get the attributes and uniforms
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    //build the objects to be drawn
    const buffers = initBuffers(gl);

    //draw the scene
    drawScene(gl, programInfo, buffers);
}

function createShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    //create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    //check for errors
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram,
        )}`,
      );
      return null;
    }
  
    return shaderProgram;
  }

  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    //send the source to the shader object
    gl.shaderSource(shader, source);
  
    //compile the shader program
    gl.compileShader(shader);
    
    //check for errors
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
      );
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }





