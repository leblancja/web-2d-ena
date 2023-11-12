function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //set clear color to black, fully opaque
    gl.clearDepth(1.0); //clear everything
    gl.enable(gl.DEPTH_TEST); //enable depth testing
    gl.depthFunc(gl.LEQUAL); //near things obscure far things
  
    //clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
 
    //create a perspective matrix
    //simulates the field of view of 45 degrees with a width/height ratio that matches the canvas
    //only draw things between 0.1 and 100 units from the camera
    const fieldOfView = (45 * Math.PI) / 180; //in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  
    //set the drawing position to the center of the view
    const modelViewMatrix = mat4.create();
  
    //move the drawing position a bit to move the square
    mat4.translate(
      modelViewMatrix, //destination matrix
      modelViewMatrix, //matrix to translate
      [-0.0, 0.0, -6.0],
    ); //amount to translate
  
    //get and set the positions from the buffer
    setPositionAttribute(gl, buffers, programInfo);
  
    //set our program to be used for drawing
    gl.useProgram(programInfo.program);
  
    //set the shader uniforms
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix,
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix,
    );
  
    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }
  
  //getting the positions from the buffer
  function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 2; //pull out 2 values per iteration
    const type = gl.FLOAT; //the data in the buffer is 32bit floats
    const normalize = false; //don't normalize
    const stride = 0; //how many bytes to get from one set of values to the next
    //0 = use type and numComponents above
    const offset = 0; //how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  
  export { drawScene };