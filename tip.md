1. Deno/Node/Brower 三个平台只要代码是通用的,依赖平台的运行时代码也行Deno/Node也许是通用的,但是在Brower端一定是不通用的
2. 想要rust代码能用,正确的做法是 : 在Deno端使用Rust的FFI , 在Node和Browser端使用WASM