#Assignment 1 Submission

Timothy Fiss - 200463907

Entirely done with JS and webGL

initShaders2.js is stolen from CS315. It loads the shaders into memory (Hard and I can't be bothered). Everything else is mine.

I hate how this ended up being organized. Its all sorts of spaghet.

Creative elements are the particle rotation, ability to change the emission rate. and rainbow mode.

Performance really starts petering out once you are spawning ~2-3 k particles/s. I could probably optimize the shader to find more performance.

Known Bugs:
Lifting shift before releasing the letter key will result in the key not being properly disabled
In Chrome on Mac if you have hardware acceleration enabled it doesn't render.


you can view it from:
http://www.webdev.cs.uregina.ca/~taf745/cs408/Ass1/Assignment1.html