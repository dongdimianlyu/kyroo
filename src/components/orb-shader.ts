export const vertexShader = `
  uniform float u_time;
  uniform float u_intensity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Stable noise function
  float noise(vec3 p) {
    return sin(p.x * 2.1) * sin(p.y * 1.7) * sin(p.z * 1.9);
  }

  void main() {
    vUv = uv;
    vPosition = position;
    
    // Create large, flowing waves
    vec3 pos = position;
    float time = u_time * 0.4;
    
    // Large primary waves
    float wave1 = noise(pos * 0.8 + vec3(time * 1.2, time * 0.9, time * 0.7));
    float wave2 = noise(pos * 1.5 + vec3(time * 0.8, time * 1.1, time * 0.6));
    float wave3 = noise(pos * 2.2 + vec3(time * 0.5, time * 0.7, time * 1.0));
    
    // Combine for big wave displacement
    float displacement = (wave1 * 0.6 + wave2 * 0.3 + wave3 * 0.1) * u_intensity;
    
    // Apply displacement
    pos += normal * displacement;
    
    vNormal = normalize(normalMatrix * normal);
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

  // Simple noise for color variation
  float noise(vec3 p) {
    return sin(p.x * 2.1) * sin(p.y * 1.7) * sin(p.z * 1.9);
  }

  void main() {
    // VIBRANT, SATURATED COLORS
    vec3 brightPink = vec3(1.0, 0.4, 0.8);      // Bright pink
    vec3 brightPurple = vec3(0.6, 0.3, 1.0);    // Bright purple
    vec3 brightBlue = vec3(0.3, 0.6, 1.0);      // Bright blue
    vec3 brightCyan = vec3(0.4, 0.9, 1.0);      // Bright cyan
    
    // Create flowing color patterns
    float time = u_time * 0.3;
    vec3 colorPos = vPosition * 1.5 + vec3(time, time * 0.8, time * 0.6);
    
    float colorMix1 = noise(colorPos) * 0.5 + 0.5;
    float colorMix2 = noise(colorPos * 1.3 + vec3(10.0)) * 0.5 + 0.5;
    
    // Blend vibrant colors
    vec3 color1 = mix(brightPink, brightPurple, colorMix1);
    vec3 color2 = mix(brightBlue, brightCyan, colorMix2);
    vec3 baseColor = mix(color1, color2, sin(time + vUv.y * 3.14159) * 0.5 + 0.5);
    
    // Strong lighting for visibility
    vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
    float light = max(dot(vNormal, lightDir), 0.2);
    
    // Fresnel glow
    float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    fresnel = pow(fresnel, 1.2);
    
    // Combine with strong brightness
    vec3 finalColor = baseColor * light;
    finalColor += fresnel * vec3(1.0, 0.9, 1.0) * 0.6;
    
    // Boost overall brightness significantly
    finalColor *= 1.4;
    
    // State effects
    if (u_isSpeaking) {
      finalColor += brightPink * 0.15;
    }
    if (u_isListening) {
      finalColor += brightBlue * 0.1;
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`; 