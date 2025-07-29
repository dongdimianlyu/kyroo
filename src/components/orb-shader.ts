export const vertexShader = `
  uniform float u_time;
  uniform float u_intensity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simple, stable noise function
  float noise(vec3 p) {
    return sin(p.x) * sin(p.y) * sin(p.z);
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Very gentle, stable deformation
    vec3 pos = position;
    float n = noise(pos * 2.0 + u_time * 0.3) * 0.1;
    pos += normal * n * u_intensity;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  uniform float u_time;
  uniform bool u_isSpeaking;
  uniform bool u_isListening;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    // Stable, beautiful gradient
    vec3 primaryColor = vec3(0.4, 0.6, 1.0);   // Soft blue
    vec3 secondaryColor = vec3(0.7, 0.4, 1.0); // Soft purple
    
    // Smooth vertical gradient
    float gradientFactor = smoothstep(0.0, 1.0, vUv.y);
    vec3 baseColor = mix(secondaryColor, primaryColor, gradientFactor);
    
    // Lighting calculation
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 2.0));
    float lightIntensity = max(dot(vNormal, lightDirection), 0.3);
    
    // Fresnel for rim lighting
    float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    fresnel = pow(fresnel, 2.0);
    
    // Combine everything
    vec3 finalColor = baseColor * lightIntensity;
    finalColor += fresnel * vec3(1.0, 1.0, 1.0) * 0.3;
    
    // Subtle state indicators (no flickering)
    if (u_isSpeaking) {
      finalColor += vec3(0.1, 0.1, 0.2);
    }
    if (u_isListening) {
      finalColor += vec3(0.05, 0.1, 0.1);
    }
    
    // Ensure proper alpha
    gl_FragColor = vec4(finalColor, 1.0);
  }
`; 