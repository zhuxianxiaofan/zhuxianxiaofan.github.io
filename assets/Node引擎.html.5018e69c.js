import{_ as a}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as d,a as p}from"./app.7b75b111.js";const i={},r=p('<h2 id="node-与浏览器引擎" tabindex="-1"><a class="header-anchor" href="#node-与浏览器引擎" aria-hidden="true">#</a> Node 与浏览器引擎</h2><h3 id="浏览器引擎" tabindex="-1"><a class="header-anchor" href="#浏览器引擎" aria-hidden="true">#</a> 浏览器引擎</h3><p>浏览器内核通常指的是浏览器的<strong>排版引擎</strong>（浏览器引擎、页面渲染引擎、样板引擎，多种称呼）</p><p>HTML 解析时遇到 JavaScript 标签，会停止当前解析，转而加载执行 JavaScript 代码。</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-浏览器引擎/image-20211008113021559-16336638230261.png" alt="浏览器引擎" loading="lazy"></p><h3 id="为什么需要-javascript-引擎" tabindex="-1"><a class="header-anchor" href="#为什么需要-javascript-引擎" aria-hidden="true">#</a> 为什么需要 Javascript 引擎</h3><p>事实上我们编写的 Javascript 无论交给浏览器或者 Node 执行，最后都是需要被 CPU 执行的；</p><p>但是 CPU 只认识自己的指令集，实际上是机器语言，才能被 CPU 执行；</p><p>所以我们需要 Javascript 引擎帮助我们将 Javascript 代码翻译成 CPU 指令来执行；</p><h3 id="常见的-javascript-引擎" tabindex="-1"><a class="header-anchor" href="#常见的-javascript-引擎" aria-hidden="true">#</a> 常见的 Javascript 引擎</h3><p>SpiderMonkey：第一款 Javascript 引擎，由 Brendan Eich 开发（Javascript 作者）；</p><p>Chakra：微软开发，用于 IE 浏览器；</p><p>JavascriptCore：Webkit 中的 Javascript 引擎，Apple 公司开发；</p><p>V8：Google 开发的强大 Javascript 引擎，帮助 Chrome 从众多浏览器中脱颖而出；</p><h3 id="v8-引擎" tabindex="-1"><a class="header-anchor" href="#v8-引擎" aria-hidden="true">#</a> V8 引擎</h3><p>V8 是用 C++编写的 Google 开源高性能 Javascript 和 WebAssembly 引擎，它用于 Chrome 和 Node.js 等。</p><p>它实现 ECMAScript 和 WebAssembly，并在 Windows 7 或更高版本，macOS 10.12+和使用 x64，IA-32，ARM 或 MIPS 处理器的 Linux 系统上运行。</p><p>V8 可以独立运行，也可以嵌入到任何 C++应用程序中。</p><p>运行机制流程图：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-浏览器引擎/image-20211008113355039.png" alt="V8引擎流程图" loading="lazy"></p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-浏览器引擎/image-20211008142351389.png" alt="V8引擎流程说明" loading="lazy"></p><h2 id="node-js" tabindex="-1"><a class="header-anchor" href="#node-js" aria-hidden="true">#</a> Node.js</h2><h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义" aria-hidden="true">#</a> 定义</h3><p>Node.js 基于 V8 引擎来执行 JavaScript 的代码，但是不仅仅只有 V8 引擎。</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-浏览器引擎/image-20211008143535345.png" alt="浏览器与Node差异" loading="lazy"></p><h3 id="架构" tabindex="-1"><a class="header-anchor" href="#架构" aria-hidden="true">#</a> 架构</h3><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-浏览器引擎/image-20211008150748415.png" alt="Node.js架构" loading="lazy"></p><h3 id="版本控制工具" tabindex="-1"><a class="header-anchor" href="#版本控制工具" aria-hidden="true">#</a> 版本控制工具</h3><p>nvm：Node Version Manager</p><p>Interactively Manage Your Node.js Versions（交互式管理你的 Node.js 版本）</p><p>nvm 的版本切换：</p><p><code>nvm ls</code> 查看所有已经安装的版本</p><p><code>nvm list available</code> 查看网络上可以安装的版本</p><p>如果不知道有现在还有哪些可以供安装的 node 版本，可以先运行 nvm list available 命令进行查看。</p><p>其中 LTS 表示长期稳定版本。</p><p><code>nvm install 14.16.1</code> 下载版本号为 14.16.1 的 node</p><p><code>nvm uninstall 14.16.1</code> 卸载版本号为 14.16.1 的 node</p><p><code>nvm root [path]</code> 设置和查看 root 路径</p><p><code>nvm use 14.16.1</code> 切换到版本号为 14.16.1 的 node</p><h3 id="javascript-代码执行" tabindex="-1"><a class="header-anchor" href="#javascript-代码执行" aria-hidden="true">#</a> Javascript 代码执行</h3><h4 id="浏览器执行" tabindex="-1"><a class="header-anchor" href="#浏览器执行" aria-hidden="true">#</a> 浏览器执行</h4><p>浏览器加载、解析 html 代码，需要先创建 html 文件</p><p>当 html 通过 script 标签，引入 js 文件</p><p>当浏览器遇到 script 标签，根据 src 加载，执行 js 代码</p><h4 id="node-执行" tabindex="-1"><a class="header-anchor" href="#node-执行" aria-hidden="true">#</a> node 执行</h4><p>电脑上安装 node 环境，配置环境变量</p><p>通过终端命令 node js 文件的方式来载入和执行对应的 js 文件</p><h3 id="node-的-repl" tabindex="-1"><a class="header-anchor" href="#node-的-repl" aria-hidden="true">#</a> Node 的 REPL</h3><p>REPL 是 Read-Eval-Print-Loop 的简称，读取-求值-输出-循环</p><p>REPL 是一个简单的、交互式的变成环境。</p><p>浏览器的 console 就可以看成一个 REPL</p><h3 id="node-程序传参-process" tabindex="-1"><a class="header-anchor" href="#node-程序传参-process" aria-hidden="true">#</a> Node 程序传参 process</h3><p>程序中传递的参数在 process 的内置对象中</p><p>如果我们直接打印这个内置对象，它里面包含特别的信息</p><p>argc：argument counter 的缩写，传递参数的个数；</p><p>argv：argument vector 的缩写，传入的具体参数。</p><h3 id="常见的全局对象" tabindex="-1"><a class="header-anchor" href="#常见的全局对象" aria-hidden="true">#</a> 常见的全局对象</h3><p>Node 中给我们提供了一些全局对象，方便我们进行一些操作</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-浏览器引擎/image-20211008162007211.png" alt="Node全局对象" loading="lazy"></p><p>process：提供了 Node 进程中相关的信息，比如 Node 的运行环境、参数信息等；</p><p>console：提供了简单的调试控制台。</p><p>定时器函数：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-浏览器引擎/image-20211008163033129.png" alt="定时器函数" loading="lazy"></p><p>global 是一个全局对象，事实上前面提到的 process、console、setTimeout 等都被放到 global 中</p><h3 id="特殊的全局对象" tabindex="-1"><a class="header-anchor" href="#特殊的全局对象" aria-hidden="true">#</a> 特殊的全局对象</h3><p>可以在模块中任意使用，但是在命令行交互中不可以使用</p><p>包括：</p><ul><li><p><code>__dirname</code> 获取当前文件所在路径，不包括后面文件名</p></li><li><p><code>__filename</code> 获取当前文件所在路径和文件名称，包括后面的文件名称</p></li><li><p><code>exports</code> 文件模块导出</p></li><li><p><code>require()</code> 文件模块导入</p></li></ul><h3 id="global-和-window" tabindex="-1"><a class="header-anchor" href="#global-和-window" aria-hidden="true">#</a> global 和 window</h3><p>浏览器中在定级范围内通过 var 声明的变量，默认添加到 window 对象上。</p><p>Node 中通过 var 声明的变量，不会放到 global 上。</p>',71),o=[r];function s(n,c){return e(),d("div",null,o)}const l=a(i,[["render",s],["__file","Node引擎.html.vue"]]);export{l as default};
