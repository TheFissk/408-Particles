#version 300 es

in vec3 vPosition;
in float vMove;

uniform mat4 p,mv;
uniform vec4 vColor;
uniform float moveBy;

out vec4 color;

void main() 
{
    //Move vertex to view
    vec3 pos = vPosition;
    if(vMove > 0.0) {
        pos = pos*moveBy;
    }
    vec4 mvPosition = mv*vec4(pos,1.0);

    //Apply projection and send out
    gl_Position = p*mvPosition;

    //copy colour
    color = vColor;
}
