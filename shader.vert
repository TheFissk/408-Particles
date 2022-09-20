#version 300 es

layout (location = 0) in vec3 vPosition;
layout (location = 1) in float vMove;
layout (location = 2) in vec2 translate;
layout (location = 3) in float size;
layout (location = 4) in vec4 vColor;
layout (location = 5) in float moveBy;


uniform mat4 p;
uniform mat4 mv;

out vec4 color;

void main() 
{
    //apply the shape modifier. 
    //Its kind of gross using a float as a bool
    //but it works and I couldn't get 
    //a more sensible solution (like sending a short) to work.
    vec3 pos = vPosition;
    if(vMove > 0.0) {
        pos *= moveBy;
    }
    pos += vec3(translate,0.0);

    vec4 mvPosition = mv * vec4(pos,1.0);

    //Apply projection and send out
    gl_Position = p*mvPosition;

    //copy colour
    color = vColor;
}
