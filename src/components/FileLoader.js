import React, { useRef, useState, useEffect } from 'react'


function heFormat(d) {
  return {
    sample: d.sample,
    group: d.group,
    pos: +d.pos,
    covA: parseFloat(d.covA),
    covB: parseFloat(d.covB)
  }
}

const ImportFromFileBodyComponent = () => {
  let fileReader;

  const handleFileChosen = (file) => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
    const result = event.target.result;
    // Do something with result
    });

    reader.addEventListener('progress', (event) => {
      if (event.loaded && event.total) {
        const percent = (event.loaded / event.total) * 100;
        console.log(`Progress: ${Math.round(percent)}`);
      }
    });
    reader.readAsDataURL(file);
  }

  return <div className='upload-expense'>
    <input
      type='file'
      id='file'
      className='input-file'
      accept='.csv'
      onChange={e => handleFileChosen(e.target.files[0])}
    />
  </div>
}

export default ImportFromFileBodyComponent