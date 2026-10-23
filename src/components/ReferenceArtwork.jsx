import React from 'react';
// Coordinates describe a viewport in the upright 1350 x 1080 reference.
export default function ReferenceArtwork({ x, y, width, height, className = '', source = '/assets/aistudio/f487ba6eb54458fc8b6490488d8de434_c9551682.jpg' }) {
 return <span aria-hidden="true" className={`reference-art ${className}`} style={{aspectRatio:`${width} / ${height}`}}><img draggable="false" alt="" src={source} style={{width:`${1080/width*100}%`,left:`${(1350-x)/width*100}%`,top:`${-y/height*100}%`}}/></span>;
}
