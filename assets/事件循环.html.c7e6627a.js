import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as o,b as s,d as n,e as c,a,r as i}from"./app.7b75b111.js";const u={},l=a(`<h2 id="事件循环" tabindex="-1"><a class="header-anchor" href="#事件循环" aria-hidden="true">#</a> 事件循环</h2><p>事件循环理解成我们编写的 JavaScript 和浏览器或者 Node 之间的一个桥梁</p><ol><li><p>浏览器的事件循环是一个我们编写的 JavaScript 代码和浏览器 API 调用(setTimeout/AJAX/监听事件等)的一个桥梁, 桥梁之间通过回调函数进行沟通</p></li><li><p>Node 的事件循环是一个我们编写的 JavaScript 代码和系统调用（file system、network 等）之间的一个桥梁, 桥梁之间通过回调函数进行沟通。</p></li></ol><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/07-事件循环/image-20211012231455645.png" alt="事件循环简图" loading="lazy"></p><h2 id="进程和线程" tabindex="-1"><a class="header-anchor" href="#进程和线程" aria-hidden="true">#</a> 进程和线程</h2><p>进程（process）：计算机已经运行的程序</p><p>线程（thread）：操作系统能够运行运算调度的最小单位</p><p><strong>直观解释</strong></p><p>进程：我们可以认为，启动一个应用程序，就会默认启动一个进程（也可能是多个进程）</p><p>线程：每一个进程中，都会启动一个线程用来执行程序中的代码，这个线程被称之为主线程</p><p>进程是线程的容器</p><p><strong>形象的例子解释</strong></p><p>操作系统类似于一个工厂；</p><p>工厂中里有很多车间，这个车间就是进程；</p><p>每个车间可能有一个以上的工人在工厂，这个工人就是线程；</p><h3 id="多进程多线程开发" tabindex="-1"><a class="header-anchor" href="#多进程多线程开发" aria-hidden="true">#</a> 多进程多线程开发</h3><p>CPU 的运算速度非常快，它可以快速的在多个进程之间迅速的切换</p><p>进程中的线程获取获取到时间片时，就可以快速执行我们编写的代码</p><p>对于用户来说是感受不到这种快速的切换的</p><h3 id="浏览器和-javascript" tabindex="-1"><a class="header-anchor" href="#浏览器和-javascript" aria-hidden="true">#</a> 浏览器和 Javascript</h3><p>JavaScript 是单线程的，但是 JavaScript 的线程应该有自己的容器进程：浏览器或者 Node</p><p>目前多数的浏览器其实都是多进程的，当我们打开一个 tab 页面时就会开启一个新的进程，这是为了防止一个页面卡死而造成所有页面无法响应，整个浏览器需要强制退出</p><p>每个进程中又有很多的线程，其中包括执行 JavaScript 代码的线程</p><p>但是 JavaScript 的代码执行是在一个单独的线程中执行的，这就意味着 JavaScript 的代码，在同一个时刻只能做一件事。如果这件事是非常耗时的，当前的线程就会被阻塞</p><h3 id="浏览器事件循环" tabindex="-1"><a class="header-anchor" href="#浏览器事件循环" aria-hidden="true">#</a> 浏览器事件循环</h3><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/07-事件循环/image-20211012232522122.png" alt="浏览器事件循环" loading="lazy"></p><h3 id="浏览器宏任务和微任务" tabindex="-1"><a class="header-anchor" href="#浏览器宏任务和微任务" aria-hidden="true">#</a> 浏览器宏任务和微任务</h3><p>宏任务队列（macrotask queue）：ajax、setTimeout、setInterval、DOM 监听、UI Rendering 等</p><p>微任务队列（microtask queue）：Promise 的 then 回调、 Mutation Observer API、queueMicrotask()等</p><p>优先级：</p><p>1.main script 中的代码优先执行（编写的顶层 script 代码）</p><p>2.在执行任何一个宏任务之前（不是队列，是一个宏任务），都会先查看微任务队列中是否有任务需要执行</p><p><strong>宏任务执行之前，必须保证微任务队列是空的</strong></p><p><strong>如果不为空，那么就优先执行微任务队列中的任务（回调）</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 经典面试题：任务打印顺序</span>
<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;set1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;then4&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;then2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;pr1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;then1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;set2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;queueMicrotask1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;then3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终顺序：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>pr1
2
then1
queueMicrotask1
then3
set1
then2
then4
set2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="node-架构分析" tabindex="-1"><a class="header-anchor" href="#node-架构分析" aria-hidden="true">#</a> Node 架构分析</h2><p>浏览器中的 EventLoop 是根据 HTML5 定义的规范来实现的，不同的浏览器可能会有不同的实现，而 Node 中是由 libuv 实现的</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/07-事件循环/image-20211013093913382.png" alt="Node架构" loading="lazy"></p><p>libuv 中主要维护了一个 EventLoop 和 worker threads（线程池）</p><p>EventLoop 负责调用系统的一些其他操作：文件的 IO、Network、child-processes 等</p><h3 id="阻塞-io-和非阻塞-io" tabindex="-1"><a class="header-anchor" href="#阻塞-io-和非阻塞-io" aria-hidden="true">#</a> 阻塞 IO 和非阻塞 IO</h3><p>我们任何程序中的文件操作都是需要进行系统调用（操作系统的文件系统），对文件的操作，是一个操作系统的 IO 操作（输入、输出）</p><p>操作系统为我们提供了<strong>阻塞式调用</strong>和<strong>非阻塞式调用</strong>：</p><ul><li><p>阻塞式调用： 调用结果返回之前，当前线程处于阻塞态（阻塞态 CPU 是不会分配时间片的），调用线程只有在得到调用结果之后才会继续执行。</p></li><li><p>非阻塞式调用： 调用执行之后，当前线程不会停止执行，只需要过一段时间来检查一下有没有结果返回即可。</p></li></ul><p>开发中的很多耗时操作，都可以基于这样的<strong>非阻塞式调用</strong>：</p><ul><li><p>网络请求本身使用了 Socket 通信，而 Socket 本身提供了 select 模型，可以进行非阻塞方式的工作</p></li><li><p>文件读写的 IO 操作，我们可以使用操作系统提供的基于事件的回调机制</p></li></ul><h3 id="非阻塞-io-的问题" tabindex="-1"><a class="header-anchor" href="#非阻塞-io-的问题" aria-hidden="true">#</a> 非阻塞 IO 的问题</h3><h4 id="_1-轮询操作" tabindex="-1"><a class="header-anchor" href="#_1-轮询操作" aria-hidden="true">#</a> 1.轮询操作</h4><p>非阻塞 IO 也会存在一定的问题：我们并没有获取到需要读取（我们以读取为例）的结果，那么就意味着为了可以知道是否读取到了完整的数据，我们需要频繁的去确定读取到的数据是否是完整的，这个过程我们称之为轮询操作。</p><p>轮询工作如何分配：</p><ul><li>如果我们的主线程频繁的去进行轮询的工作，那么必然会大大降低性能</li><li>并且开发中我们可能不只是一个文件的读写，可能是多个文件</li><li>而且可能是多个功能：网络的 IO、数据库的 IO、子进程调用</li></ul><p>libuv 提供了一个<strong>线程池（Thread Pool）</strong></p><ul><li>线程池会负责所有相关的操作，并且会通过轮询等方式等待结果</li><li>当获取到结果时，就可以将对应的回调放到事件循环（某一个事件队列）中</li><li>事件循环就可以负责接管后续的回调工作，告知 JavaScript 应用程序执行对应的回调函数</li></ul><h4 id="_2-阻塞和非阻塞、同步和异步" tabindex="-1"><a class="header-anchor" href="#_2-阻塞和非阻塞、同步和异步" aria-hidden="true">#</a> 2.阻塞和非阻塞、同步和异步</h4><p><strong>阻塞和非阻塞是对于被调用者来说的</strong></p><p>系统调用，操作系统为我们提供了阻塞调用和非阻塞调用</p><p><strong>同步和异步是对于调用者来说的</strong></p><p>如果我们在发起调用之后，不会进行其他任何的操作，只是等待结果，这个过程就称之为同步调用</p><p>如果我们再发起调用之后，并不会等待结果，继续完成其他的工作，等到有回调时再去执行，这个过程就是 异步调用</p><p><strong>Libuv 采用的是非阻塞异步 IO 的调用方式</strong></p><h2 id="node-事件循环" tabindex="-1"><a class="header-anchor" href="#node-事件循环" aria-hidden="true">#</a> Node 事件循环</h2><p>事件循环像是一个桥梁，是连接着应用程序的 JavaScript 和系统调用之间的通道</p><ul><li><p>无论是我们的文件 IO、数据库、网络 IO、定时器、子进程，在完成对应的操作后，都会将对应的结果和回调 函数放到事件循环（任务队列）中。</p></li><li><p>事件循环会不断的从任务队列中取出对应的事件（回调函数）来执行。</p></li></ul><p>一次完整的事件循环 Tick 分成很多个阶段：</p><ul><li>定时器（Timers）：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数</li><li>待定回调（Pending Callback）：对某些系统操作（如 TCP 错误类型）执行回调，比如 TCP 连接时接收到 ECONNREFUSED</li><li>idle, prepare：仅系统内部使用</li><li>轮询（Poll）：检索新的 I/O 事件；执行与 I/O 相关的回调</li><li>检测：setImmediate() 回调函数在这里执行</li><li>关闭的回调函数：一些关闭的回调函数，如：socket.on(&#39;close&#39;, ...)</li></ul><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/07-事件循环/image-20211013095917185.png" alt="Node事件循环" loading="lazy"></p><h3 id="node-宏任务和微任务" tabindex="-1"><a class="header-anchor" href="#node-宏任务和微任务" aria-hidden="true">#</a> Node 宏任务和微任务</h3><p>从一次事件循环的 Tick 来说，Node 的事件循环更复杂，它也分为微任务和宏任务</p><p>宏任务（macrotask）：setTimeout、setInterval、IO 事件、setImmediate、close 事件</p><p>微任务（microtask）：Promise 的 then 回调、process.nextTick、queueMicrotask</p><p>微任务队列：</p><ul><li>next tick queue：process.nextTick</li><li>other queue：Promise 的 then 回调、queueMicrotask</li></ul><p>宏任务队列：</p><ul><li>timer queue：setTimeout、setInterval</li><li>poll queue：IO 事件</li><li>check queue：setImmediate</li><li>close queue：close 事件</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 经典面试题：任务打印顺序</span>
<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">async1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;async1 start&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">await</span> <span class="token function">async2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;async1 end&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">async2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;async2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;script start&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setTimeout0&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setTimeout2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">300</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">setImmediate</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setImmediate&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

process<span class="token punctuation">.</span><span class="token function">nextTick</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;nextTick1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">async1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

process<span class="token punctuation">.</span><span class="token function">nextTick</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;nextTick2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;promise1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;promise2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;promise3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;script end&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终顺序：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>script start
async1 start
async2
promise1
promise2
script end
nextTick1
nextTick2
async1 end
promise3
setTimeout0
setImmediate
setTimeout2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="执行时序的有趣问题" tabindex="-1"><a class="header-anchor" href="#执行时序的有趣问题" aria-hidden="true">#</a> 执行时序的有趣问题</h3><p>问题：同属宏任务的 setTimeout(fn, 0)和 setImmediate(fn)谁先执行</p><p>情景 1：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;outer&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setTimeout&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">setImmediate</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setImmediate&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 打印顺序：outer -&gt; setImmediate -&gt; setTimeout</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>流程分析：</p><ol><li>外层是一个 setTimeout，所以执行他的回调的时候已经在 timers 阶段了</li><li>处理里面的 setTimeout，因为本次循环的 timers 正在执行，所以他的回调其实加到了下个 timers 阶段</li><li>处理里面的 setImmediate，将它的回调加入 check 阶段的队列</li><li>外层 timers 阶段执行完，进入 pending callbacks，idle, prepare，poll，这几个队列都是空的，所以继续往下</li><li>到了 check 阶段，发现了 setImmediate 的回调，拿出来执行</li><li>然后是 close callbacks，队列是空的，跳过</li><li>又是 timers 阶段，执行我们的 console</li></ol><p>但是我们上面 console.log(&#39;setTimeout&#39;)和 console.log(&#39;setImmediate&#39;)都包在了一个 setTimeout 里面，如果直接写在最外层会怎么样呢？</p><p>情景 2：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;outer&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setTimeout&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">setImmediate</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setImmediate&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 打印顺序结果不统一，有时会是：outer -&gt; setTimeout -&gt; setImmediate，有时又会是：outer -&gt; setImmediate -&gt; setTimeout</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,88),k={href:"https://nodejs.org/api/timers.html#settimeoutcallback-delay-args",target:"_blank",rel:"noopener noreferrer"},r=a(`<ol><li>外层同步代码一次性全部执行完，遇到异步 API 就塞到对应的阶段</li><li>遇到 setTimeout，虽然设置的是 0 毫秒触发，但是被 node.js 强制改为 1 毫秒，塞入 times 阶段</li><li>遇到 setImmediate 塞入 check 阶段</li><li>同步代码执行完毕，进入 Event Loop</li><li>先进入 times 阶段，检查当前时间过去了 1 毫秒没有，如果过了 1 毫秒，满足 setTimeout 条件，执行回调，如果没过 1 毫秒，跳过</li><li>跳过空的阶段，进入 check 阶段，执行 setImmediate 回调</li></ol><p>通过上述流程的梳理，我们发现关键就在这个 1 毫秒，如果同步代码执行时间较长，进入 Event Loop 的时候 1 毫秒已经过了，setTimeout 执行，如果 1 毫秒还没到，就先执行了 setImmediate。每次我们运行脚本时，机器状态可能不一样，导致运行时有 1 毫秒的差距，一会儿 setTimeout 先执行，一会儿 setImmediate 先执行。但是这种情况只会发生在还没进入 timers 阶段的时候。像我们第一个例子那样，因为已经在 timers 阶段，所以里面的 setTimeout 只能等下个循环了，所以 setImmediate 肯定先执行。同理的还有其他 poll 阶段的 API 也是这样的，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">var</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;fs&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span>__filename<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setTimeout&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">setImmediate</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;setImmediate&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里 setTimeout 和 setImmediate 在 readFile 的回调里面，由于 readFile 回调是 I/O 操作，他本身就在 poll 阶段，所以他里面的定时器只能进入下个 timers 阶段，但是 setImmediate 却可以在接下来的 check 阶段运行，所以 setImmediate 肯定先运行，他运行完后，去检查 timers，才会运行 setTimeout。</p><h3 id="特殊的-process-nexttick" tabindex="-1"><a class="header-anchor" href="#特殊的-process-nexttick" aria-hidden="true">#</a> 特殊的 process.nextTick()</h3><p>其实 process.nextTick()是一个特殊的异步 API，他不属于任何的 Event Loop 阶段。事实上 Node 在遇到这个 API 时，Event Loop 根本就不会继续进行，会马上停下来执行 process.nextTick()，这个执行完后才会继续 Event Loop。</p><p>这种机制其实类似于我们前面讲的微任务，但是并不完全一样,比如同时有 nextTick 和 Promise 的时候，肯定是 nextTick 先执行，原因是 nextTick 的队列比 Promise 队列优先级更高。</p><p>因此这里将 Node 的微任务队列分为两大类，首先执行的是 process.nextTick()的 nextTick queue，然后才执行其余队列任务 other queue。</p>`,8);function d(v,m){const t=i("ExternalLinkIcon");return e(),o("div",null,[l,s("p",null,[n("实际上，node.js 里面 setTimeout(fn, 0)会被强制改为 setTimeout(fn, 1)，"),s("a",k,[n("详见官方文档"),c(t)]),n("，再顺便提下，HTML5 里面 setTimeout 最小的时间限制是 4ms。接下来进行流程分析：")]),r])}const h=p(u,[["render",d],["__file","事件循环.html.vue"]]);export{h as default};
