uniform float uSize;
uniform float uTime;
uniform float uTailGrowth;
uniform float uParticleSystemLength;

varying vec3 vPosition;

void main()
{
    vec3 transformed = position;

    /*
     * ЛИНЕЙНЫЙ рост хвоста.
     *
     * 0.0 -> начало
     * 1.0 -> полный хвост
     */

    transformed.y =
        position.y *
        uTailGrowth;

    /*
     * В начале головка немного компактнее.
     * Это не влияет на скорость роста хвоста.
     */

    float headScale =
        mix(
            0.45,
            1.0,
            uTailGrowth
        );

    transformed.x *= headScale;
    transformed.z *= headScale;

    /*
     * World position
     */

    vec4 modelPosition =
        modelMatrix *
        vec4(
            transformed,
            1.0
        );

    vec4 viewPosition =
        viewMatrix *
        modelPosition;

    gl_Position =
        projectionMatrix *
        viewPosition;

    gl_PointSize =
        uSize *
        (1.0 / -viewPosition.z);

    vPosition =
        transformed;
}