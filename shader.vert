#version 300 es

  //Buffer Layout
  //1x4 birth, 1x4 size, 1x4 shape, 1x4 rotation, 2x4 location, 2x4 translate, 4x4 color - to save Attrib Pointers, this is packed

layout (location = 0) in vec2 vPosition;
layout (location = 1) in float vMove;
layout (location = 2) in vec4 ran;
layout (location = 3) in vec4 locTrans;
layout (location = 4) in vec4 vColor;


uniform mat4 p;
uniform float frame;

out vec4 color;

mat4 scaleMatrix(float s);
mat4 translateMatrix(vec3 t);
mat4 rotationMatrix(float d);
void main() 
{
    //unpack the data
    float age = frame - ran[0];
    float size = ran[1];
    float shape = ran[2];
    float rotate = ran[3] * age;

    vec2 translate = vec2(locTrans[0], locTrans[1]) + (vec2(locTrans[2], locTrans[3]) * age);
    
    //apply the shape modifier. 
    //Its kind of gross using a float as a bool
    //but it works and I couldn't get 
    //a more sensible solution (like sending a short) to work.
    vec2 ppos = vPosition;
    if(vMove > 0.0) {
        ppos *= shape;
    }
    vec4 pos = vec4(ppos,0,1);
    pos *= scaleMatrix(size);
    pos *= rotationMatrix(rotate);
    pos *= translateMatrix(vec3(translate,0.0));


    //Apply projection and send out
    gl_Position = p*pos;

    //copy colour
    color = vColor;
}

mat4 scaleMatrix(float s)
{ 
    return mat4(
        s,   0.0, 0.0, 0.0,
        0.0, s,   0.0, 0.0,
        0.0, 0.0, s,   0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 translateMatrix(vec3 t)
{
        return mat4(
        1.0, 0.0, 0.0, t[0],
        0.0, 1.0, 0.0, t[1],
        0.0, 0.0, 1.0, t[2],
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 rotationMatrix(float d) {
    return mat4(
        cos(d), -sin(d), 0.0, 0.0,
        sin(d), cos(d),  0.0, 0.0,
        0.0,    0.0,     1.0, 0.0,
        0.0,    0.0,     0.0, 1.0
    );
}