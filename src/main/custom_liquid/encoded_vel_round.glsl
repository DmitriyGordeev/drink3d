vec2 figureCenter = vec2(0.5);


// coeffs
float offset = 0.001;


const float PI = 2.0 * 3.1415926535;
const float sqrt2 = sqrt(2.0);


float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}


bool drawBox(vec2 center, vec2 uv, float w, float h) {
    bool xCond = uv.x >= center.x - w / 2.0 && uv.x <= center.x + w / 2.0;
    bool yCond = uv.y >= center.y - h / 2.0 && uv.y <= center.y + h / 2.0;
    return xCond && yCond;
}


bool drawCircle(vec2 center, vec2 uv, float radius) {
    return (uv.x - center.x) * (uv.x - center.x) + (uv.y - center.y) * (uv.y - center.y) <= radius * radius;
}


// color to impulse
vec3 cti(vec4 color) {
    return vec3(color.r, 2.0 * color.g - 1.0, 2.0 * color.b - 1.0);
}


// impulse to color
vec4 itc(vec3 vel) {
    return vec4(vel.r, (vel.g + 1.0) / 2.0, (vel.b + 1.0) / 2.0, 1.0);
}

const float a1 = 0.0;
const float a2 = PI / 4.0;
const float a3 = PI / 2.0;
const float a4 = 3.0 * PI / 4.0;
const float a5 = PI;
const float a6 = 5.0 * PI / 4.0;
const float a7 = -PI / 2.0;
const float a8 = 7.0 * PI / 4.0;


const vec2 e1 = vec2(cos(a1), sin(a1));
const vec2 e2 = vec2(cos(a2), sin(a2));
const vec2 e3 = vec2(cos(a3), sin(a3));
const vec2 e4 = vec2(cos(a4), sin(a4));
const vec2 e5 = vec2(cos(a5), sin(a5));
const vec2 e6 = vec2(cos(a6), sin(a6));
const vec2 e7 = vec2(cos(a7), sin(a7));
const vec2 e8 = vec2(cos(a8), sin(a8));


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy;

    // colors at the previous frame
    vec4 C0 = texture(iChannel0, uv);
    vec3 I0 = cti(C0);

    // Convert colors to impulses
    vec4 C1 = texture(iChannel0, uv + vec2(offset, 0.0));   vec3 I1 = cti(C1);
    vec4 C2 = texture(iChannel0, uv + offset * e2);         vec3 I2 = cti(C2);
    vec4 C3 = texture(iChannel0, uv + vec2(0.0, offset));   vec3 I3 = cti(C3);
    vec4 C4 = texture(iChannel0, uv + offset * e4);         vec3 I4 = cti(C4);
    vec4 C5 = texture(iChannel0, uv + vec2(-offset, 0.0));  vec3 I5 = cti(C5);
    vec4 C6 = texture(iChannel0, uv + offset * e6);         vec3 I6 = cti(C6);
    vec4 C7 = texture(iChannel0, uv + vec2(0.0, -offset));  vec3 I7 = cti(C7);
    vec4 C8 = texture(iChannel0, uv + offset * e8);         vec3 I8 = cti(C8);

    vec2 vel0 = vec2(I0.g, I0.b);


    // Point 1
    float w0 = I0.r / (I0.r + I1.r);
    float w1 = I1.r / (I0.r + I1.r);

    // mass outcome
    float r01 = 0.0;
    float dot01 = dot(vel0, e1);
    if (dot01 > 0.0)
        r01 = w0 * dot01;

    // mass income from point 1
    float r10 = 0.0;
    float dot10 = dot(vec2(I2.g, I2.b), -e1);
    if (dot10 > 0.0)
        r10 = w1 * dot10;

    // new mass:
    // float newMass01 = I0.r - r01 + r10;
    float deltaMass01 = r10 - r01;

    // velocity
    float velX1 = 0.0;
    float velY1 = 0.0;
    // if (I1.g < 0.0) {
        velX1 = I0.g * w0 + I1.g * w1;
        velY1 = I0.b * w0 + I1.b * w1;
    // }


    // Point 2
    w0 = I0.r / (I0.r + I2.r);
    float w2 = I2.r / (I0.r + I2.r);

    // mass outcome
    float r02 = 0.0;
    float dot02 = dot(vel0, e2);
    if (dot02 > 0.0)
        r02 = w0 * dot02;

    // mass income from point 2
    float r20 = 0.0;
    float dot20 = dot(vec2(I2.g, I2.b), -e2);
    if (dot20 > 0.0)
        r20 = w2 * dot20;

    // new mass:
    // float newMass02 = I0.r - r02 + r20;
    float deltaMass02 = r20 - r02;

    // velocity
    float velX2 = 0.0;
    float velY2 = 0.0;
    // if (dot20 > 0.0) {
        velX2 = I0.g * w0 + I2.g * w2;
        velY2 = I0.b * w0 + I2.b * w2;
    // }


    // Point 3
    w0 = I0.r / (I0.r + I3.r);
    float w3 = I3.r / (I0.r + I3.r);

    // mass outcome
    float r03 = 0.0;
    float dot03 = dot(vel0, e3);
    if (dot03 > 0.0)
        r03 = w0 * dot03;

    // mass income from point 3
    float r30 = 0.0;
    float dot30 = dot(vec2(I3.g, I3.b), -e3);
    if (dot30 < 0.0)
        r30 = w3 * dot30;

    // new mass:
    // float newMass03 = I0.r - r03 + r30;
    float deltaMass03 = r30 - r03;

    // velocity
    float velX3 = 0.0;
    float velY3 = 0.0;
    // if (I3.b < 0.0) {
        velX3 = I0.g * w0 + I3.g * w3;
        velY3 = I0.b * w0 + I3.b * w3;
    // }



    // Point 4
    w0 = I0.r / (I0.r + I4.r);
    float w4 = I4.r / (I0.r + I4.r);


    // mass outcome
    float r04 = 0.0;
    float dot04 = dot(vel0, e4);
    if (dot04 > 0.0)
        r04 = w0 * dot04;

    // mass income from point 4
    float r40 = 0.0;
    float dot40 = dot(vec2(I4.g, I4.b), -e4);
    if (dot40 > 0.0)
        r40 = w4 * dot40;

    // new mass:
    // float newMass04 = I0.r - r04 + r40;
    float deltaMass04 = r40 - r04;

    // velocity
    float velX4 = 0.0;
    float velY4 = 0.0;
    // if (dot40 > 0.0) {
        velX4 = I0.g * w0 + I4.g * w4;
        velY4 = I0.b * w0 + I4.b * w4;
    // }




    // Point 5
    w0 = I0.r / (I0.r + I5.r);
    float w5 = I5.r / (I0.r + I5.r);

    // mass outcome
    float r05 = 0.0;
    float dot05 = dot(vel0, e5);
    if (dot05 < 0.0)
        r05 = w0 * dot05;

    // mass income from point 5
    float r50 = 0.0;
    float dot50 = dot(vec2(I5.g, I5.b), -e5);
    if (dot50 > 0.0)
        r50 = w5 * dot50;

    // new mass:
    // float newMass05 = I0.r - r05 + r50;
    float deltaMass05 = r50 - r05;

    // velocity
    float velX5 = 0.0;
    float velY5 = 0.0;
    // if (I5.g > 0.0) {
        velX5 = I0.g * w0 + I5.g * w5;
        velY5 = I0.b * w0 + I5.b * w5;
    // }



    // Point 6
    w0 = I0.r / (I0.r + I6.r);
    float w6 = I6.r / (I0.r + I6.r);


    // mass outcome
    float r06 = 0.0;
    float dot06 = dot(vel0, e6);
    if (dot06 > 0.0)
        r06 = w0 * dot06;

    // mass income from point 6
    float r60 = 0.0;
    float dot60 = dot(vec2(I6.g, I6.b), -e6);
    if (dot60 > 0.0)
        r60 = w6 * dot60;

    // new mass:
    // float newMass06 = I0.r - r06 + r60;
    float deltaMass06 = r60 - r06;

    // velocity
    float velX6 = 0.0;
    float velY6 = 0.0;
    // if (dot60 > 0.0) {
        velX6 = I0.g * w0 + I6.g * w6;
        velY6 = I0.b * w0 + I6.b * w6;
    // }


    // Point 7
    w0 = I0.r / (I0.r + I7.r);
    float w7 = I7.r / (I0.r + I7.r);

    // mass outcome
    float r07 = 0.0;
    float dot07 = dot(vel0, e7);
    if (dot07 > 0.0)
        r07 = w0 * dot07;

    // mass income from point 7
    float r70 = 0.0;
    float dot70 = dot(vec2(I7.g, I7.b), -e7);
    if (dot70 > 0.0)
        r70 = w7 * dot70;

    // new mass:
    // float newMass07 = I0.r - r07 + r70;
    float deltaMass07 = r70 - r07;

    // velocity
    float velX7 = 0.0;
    float velY7 = 0.0;
    // if (I7.b > 0.0) {
        velX7 = I0.g * w0 + I7.g * w7;
        velY7 = I0.b * w0 + I7.b * w7;
    // }



    // Point 8
    w0 = I0.r / (I0.r + I8.r);
    float w8 = I8.r / (I0.r + I8.r);


    // mass outcome
    float r08 = 0.0;
    float dot08 = dot(vel0, e8);
    if (dot08 > 0.0)
        r08 = w0 * dot08;

    // mass income from point 8
    float r80 = 0.0;
    float dot80 = dot(vec2(I8.g, I8.b), -e8);
    if (dot80 > 0.0)
        r80 = w8 * dot80;

    // new mass:
    // float newMass08 = I0.r - r08 + r80;
    float deltaMass08 = r80 - r08;

    // velocity
    float velX8 = 0.0;
    float velY8 = 0.0;
    // if (dot80 > 0.0) {
        velX8 = I0.g * w0 + I8.g * w8;
        velY8 = I0.b * w0 + I8.b * w8;
    // }


    float newMass = I0.r + deltaMass01 + deltaMass02 + deltaMass03 +
        deltaMass04 + deltaMass05 + deltaMass06 + deltaMass07 + deltaMass08;



    float newVelX0 = 0.0;
    float newVelY0 = 0.0;
    if (newMass > 0.0) {
       newVelX0 = velX1 + velX2 + velX3 + velX4 + velX5 + velX6 + velX7 + velX8;
       newVelY0 = velY1 + velY2 + velY3 + velY4 + velY5 + velY6 + velY7 + velY8;
    }


    vec4 finalColor = itc(vec3(newMass, newVelX0, newVelY0));



    fragColor = finalColor;



    // Initial figure
    if (iFrame < 2) {
        if (drawBox(figureCenter, uv, 0.2, 0.3)) {

            fragColor = itc(vec3(1.0, 0.0, -0.01));

        }
        else {
            // zero mass and zero speed (no liquid there)
            // fragColor = vec4(0.0, 0.5, 0.5, 1.0);

            fragColor = itc(vec3(0.0));
        }
    }

}