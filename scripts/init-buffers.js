function initBuffers(gl) {
    const positionBuffer = createPositionBuffer(gl);
  
    return {
      position: positionBuffer,
    };
  }
  
  function createPositionBuffer(gl) {
    //create a buffer for the shape coordinates
    const positionBuffer = gl.createBuffer();
  
    //bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    //the vertices for the shape
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  
    //add the positions to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    return positionBuffer;
  }
  
  export { initBuffers };