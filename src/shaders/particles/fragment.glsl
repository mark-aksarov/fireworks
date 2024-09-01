varying vec3 vPosition;

uniform vec3 uGlowColor;
uniform float uParticleSystemLength;

void main()
{
    // Light effect
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = (1.0 - strength);
    strength = pow(strength, 10.0);

    // Colors
    vec3 whiteColor = vec3(1.0);
    vec3 tailColor = vec3(0.976,0.886,0.765);

    // Gradient from center (whiteColor) to edge (uGlowColor)
    vec3 color = mix(uGlowColor, whiteColor, strength);

    /*
      Gradient from head (color) to tail (tailColor)
      LatheGeometry uses y-axis symmetry - https://threejs.org/docs/index.html?q=lath#api/en/geometries/LatheGeometry
    */
    color = mix(color, tailColor, smoothstep(0.1, 1.0, vPosition.y));

    // Decrease alpha from center to head and tail
    float center = uParticleSystemLength * 0.5;
    float centerOffset = abs(vPosition.y - center);

    //edge0 starts when centerOffset is 50% from center
    float edge0 = center * 0.5;

    //edge1 starts when centerOffset is 80% from center
    float edge1 = center * 0.8;

    /*
      from center to edge0 alpha is 1.0
      from edge0 to edge1 alpha decreases from 1.0 to 0.0
      from edge1 alpha is 0.0
    */
    float alpha = pow(1.0 - smoothstep(edge0, edge1, centerOffset), 1.0);

    gl_FragColor = vec4(color, strength * alpha);
}