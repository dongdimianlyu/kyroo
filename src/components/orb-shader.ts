export const vertexShader = `
  uniform float u_time;
  uniform float u_intensity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  // Multiple octave noise for liquid effect
  float noise(vec3 p) {
    return sin(p.x * 1.2) * sin(p.y * 1.3) * sin(p.z * 1.1);
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // Multiple octaves for complex liquid motion
    for(int i = 0; i < 4; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vUv = uv;
    vPosition = position;
    
    // Create flowing liquid displacement
    vec3 pos = position;
    float time = u_time * 0.5;
    
    // Multiple wave layers for ocean-like motion
    float wave1 = fbm(pos * 1.5 + vec3(time, time * 0.7, time * 0.3));
    float wave2 = fbm(pos * 2.3 + vec3(time * 0.8, time * 1.2, time * 0.6));
    float wave3 = fbm(pos * 0.8 + vec3(time * 0.4, time * 0.9, time * 1.1));
    
    // Combine waves for complex liquid motion
    float displacement = (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3) * u_intensity;
    
    // Apply displacement along normal for liquid surface effect
    pos += normal * displacement;
    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
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
  varying vec3 vWorldPosition;

  // Noise function for surface details
  float noise(vec3 p) {
    return sin(p.x * 1.2) * sin(p.y * 1.3) * sin(p.z * 1.1);
  }

  void main() {
    // Light, dreamy colors inspired by the reference
    vec3 lightPink = vec3(1.0, 0.85, 0.9);     // Very light pink
    vec3 lightPurple = vec3(0.9, 0.8, 1.0);    // Very light purple  
    vec3 lightBlue = vec3(0.8, 0.9, 1.0);      // Very light blue
    vec3 white = vec3(0.98, 0.98, 1.0);        // Slightly blue-tinted white
    
    // Create flowing color transitions
    float time = u_time * 0.3;
    vec3 noisePos = vWorldPosition * 2.0 + vec3(time, time * 0.7, time * 0.5);
    
    float colorNoise1 = noise(noisePos) * 0.5 + 0.5;
    float colorNoise2 = noise(noisePos * 1.7 + vec3(1.0, 2.0, 3.0)) * 0.5 + 0.5;
    float colorNoise3 = noise(noisePos * 0.8 + vec3(4.0, 5.0, 6.0)) * 0.5 + 0.5;
    
    // Blend colors based on position and noise for liquid effect
    vec3 color1 = mix(lightPink, lightPurple, colorNoise1);
    vec3 color2 = mix(lightBlue, white, colorNoise2);
    vec3 baseColor = mix(color1, color2, colorNoise3);
    
    // Add subtle gradient based on UV coordinates
    float gradientFactor = smoothstep(0.0, 1.0, vUv.y);
    baseColor = mix(baseColor, lightBlue, gradientFactor * 0.3);
    
    // Lighting for depth and dimension
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 2.0));
    float lightIntensity = max(dot(vNormal, lightDirection), 0.4);
    
    // Fresnel effect for glowing edges
    float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    fresnel = pow(fresnel, 1.5);
    
    // Surface reflection highlights
    float surfaceDetail = noise(vWorldPosition * 8.0 + u_time * 0.5) * 0.1 + 0.9;
    
    // Combine all effects
    vec3 finalColor = baseColor * lightIntensity * surfaceDetail;
    finalColor += fresnel * white * 0.4;
    
    // Subtle state changes (no harsh effects)
    if (u_isSpeaking) {
      finalColor += lightPink * 0.08;
    }
    if (u_isListening) {
      finalColor += lightBlue * 0.05;
    }
    
    // Ensure brightness and ethereal quality
    finalColor = mix(finalColor, white, 0.1);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`; 