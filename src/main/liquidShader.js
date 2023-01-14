export function getLiquidShader() {
    return `
        uniform vec2 u_screenSize;
        uniform float u_time;
        uniform sampler2D u_texture;    // this texture holds rendering from the previous frame
        uniform sampler2D u_noise;      // this is noise texture reference
        uniform float u_cubeElevation;

        varying vec3 vPos;
        varying vec2 vUV;

        vec2 figureCenter = vec2(0.5, 0.0);
        const float rPx = 10.0;
        const float PI = 3.1415926535;
        const float sqrt2 = sqrt(2.0);

        const vec4 backgroundColor = vec4(255.0 / 255.0, 225.0 / 255.0, 125.0 / 255.0, 1.0);

        float rand(vec2 co) {
            return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float getRandAngle(vec2 pxCoords) {
            // return PI / 10.0 * rand(pxCoords) + PI / 3.0;
            return PI / 2.0 * rand(pxCoords) + PI / 5.0;
        }

        bool drawBox(vec2 center, vec2 uv, float w, float h) {
            bool xCond = uv.x >= center.x - w / 2.0 && uv.x <= center.x + w / 2.0;
            bool yCond = uv.y >= center.y - h / 2.0 && uv.y <= center.y + h / 2.0;
            return xCond && yCond;
        }


        bool drawCircle(vec2 center, vec2 uv, float radius) {
            return (uv.x - center.x) * (uv.x - center.x) + (uv.y - center.y) * (uv.y - center.y) <= radius * radius;
        }


        float getRotation(vec2 pxCoords) {
            float angle = getRandAngle(pxCoords);   // rand angle from PI/12 (15deg) to PI / 4 (45deg);
            float outValue = 0.0;
            int rotations = 1;
            vec2 n = vec2(floor(rPx * cos(angle)), floor(rPx * sin(angle)));
            while (angle <= 1.5 * PI) {
                n = 5.0 * vec2(floor(rPx * cos(angle)), floor(rPx * sin(angle)));

                vec2 pos = (pxCoords + n * vec2(-0.2, 4.0)) / u_screenSize.xy;
                vec4 color = texture(u_texture, pos);

                // use this if liquid is light color
                // outValue += 1.0 * dot(color.xy, n.xy);

                // use this if liquid is dark color
                outValue += 2.0 * dot(vec2(1.0) - color.xy, n.xy);

                angle += getRandAngle(pxCoords + n);
                rotations += 1;
            }
            return outValue / float(rotations + 1);
        }

        void main()
        {
            vec2 uv = gl_FragCoord.xy / u_screenSize.xy;

            // Rotations
            float r_angle = getRandAngle(uv);

            float angle = r_angle;
            vec2 n = vec2(floor(rPx * cos(angle)), floor(rPx * sin(angle)));
            int rotations = 1;
            float rotation = 1.0;
            while (angle <= 2.0 * PI) {
                rotation += getRotation(gl_FragCoord.xy + n);
                angle += getRandAngle(gl_FragCoord.xy + n);

                float factor = 1.0;
                // TODO: factor should change from 1.0 to 3.0 with time ?

                n += factor * rotation * vec2(floor(rPx * cos(angle)), floor(rPx * sin(angle)));
                rotations += 1;
            }
            n = n / float(rotations);
            float finalAngle = getRandAngle(gl_FragCoord.xy + n);
            vec2 offset = vec2(-0.3, -1.0);

            vec2 pos = (gl_FragCoord.xy + n * offset) / u_screenSize.xy;
            vec4 texel = texture(u_texture, fract(pos));
            vec4 finalColor = texel;

            gl_FragColor = finalColor;

            // Initial figure
            if (u_cubeElevation < 4.4) {
                // if (drawCircle(figureCenter, uv, 0.07)) {
                if (uv.x >= 0.46 && uv.x <= 0.54 && uv.y >= 0.0 && uv.y <= 0.05) {
                    // gl_FragColor = vec4(94, 7, 26, 255) / 255.0;
                    // gl_FragColor = vec4(94, 0.0, 26, 255) / 255.0;
                    
                    gl_FragColor = vec4(191, 87, 71, 255) / 255.0;
                }
                else {
                    gl_FragColor = backgroundColor;
                }
            }
        }
    `;
}