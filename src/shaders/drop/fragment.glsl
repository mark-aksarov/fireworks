varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 uGlowColor;
uniform float uGlowStrength;
uniform float uOpacity;
uniform float uDropLength;
uniform float uStartTailOpacity;

void main()
{
  // Normal
  vec3 normal = normalize(vNormal);

  // View direction
  vec3 viewDirection = normalize(cameraPosition - vPosition);

  /*
    Strength decreases from center to edge
    This helps decrease alpha and create color gradients
  */
  float strength = abs(dot(viewDirection, normal));
  strength = pow(strength, uGlowStrength);
  
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

  // Decrease alpha from head to tail
  float alpha = 1.0 - smoothstep(0.1, uStartTailOpacity * uDropLength, vPosition.y);

  // Strength decreases alpha from center to edge
  gl_FragColor = vec4(color, uOpacity * strength * alpha);
} 