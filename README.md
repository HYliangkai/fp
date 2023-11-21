# 使用 ts 构建的 FP(函数式编程)系统

- 🚀 代码方面解决 JS 存在的“特性”
- 🚀 提升代码可读性
- 🚀 编程 FP 化

## How to use

### Deno
- If you use in `deno` project, direct use `mod.ts`   
or   
- `import * as fpSystem from "https://deno.land/x/fp_system@v0.3/mod.ts";`

### Node/Browser
- If you use `node`/`browser` project, you can use `deno task build` to build this project, and use `./npmBuild/esm/mod` in your project (use esm )

## Feature

### TypeClass

 ✅ Option    
 ✅ Result    
 ✅ Own[Dep]    
 ✅ Lazy    
 ✅ Either    
 ✅ Ord    
 ⭕️ Entry  

### Functions

 ✅ flow    
 ✅ pipe  
 ✅ match    
 ✅ algebraicEffect  

### ThirdLib

✅ zod
✅ rxjs

### Error handling