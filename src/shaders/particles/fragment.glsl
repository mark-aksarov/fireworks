varying vec3 vPosition;

uniform vec3 uGlowColor;
uniform float uParticleSystemLength;
uniform float uTailGrowth;
uniform float uOpacity;

void main()
{
    /*
     * -----------------------------
     * PARTICLE SHAPE
     * -----------------------------
     */

    float distanceFromCenter =
        distance(
            gl_PointCoord,
            vec2(0.5)
        );

    float strength =
        1.0 -
        distanceFromCenter;

    strength =
        pow(
            strength,
            10.0
        );

    /*
     * -----------------------------
     * POSITION
     * -----------------------------
     */

    /*
     * Так как vertex shader уже
     * умножил Y на uTailGrowth,
     * нормализуем относительно
     * текущей длины.
     */

    float normalizedY =
        clamp(
            vPosition.y /
            max(
                uParticleSystemLength *
                uTailGrowth,
                0.0001
            ),
            0.0,
            1.0
        );

    /*
     * -----------------------------
     * COLORS
     * -----------------------------
     */

    vec3 whiteColor =
        vec3(1.0);

    vec3 tailColor =
        vec3(
            0.976,
            0.886,
            0.765
        );

    vec3 color =
        mix(
            uGlowColor,
            whiteColor,
            strength
        );

    color =
        mix(
            color,
            tailColor,
            smoothstep(
                0.1,
                1.0,
                normalizedY
            )
        );

    /*
     * -----------------------------
     * PARTICLE FADE
     * -----------------------------
     */

    float center =
        0.5;

    float centerOffset =
        abs(
            normalizedY -
            center
        );

    float alpha =
        1.0 -
        smoothstep(
            0.25,
            0.4,
            centerOffset
        );

    /*
     * При нулевом росте
     * оставляем яркую точку.
     */

    float headVisibility =
        smoothstep(
            0.0,
            0.03,
            uTailGrowth
        );

    alpha *= headVisibility;

    /*
     * Форма частицы.
     */

    alpha *= strength;
    alpha *= uOpacity;

    if (alpha < 0.001)
        discard;

    gl_FragColor =
        vec4(
            color,
            alpha
        );
}