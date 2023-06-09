import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as o,b as n,d as s,e as t,a as c,r as i}from"./app.7b75b111.js";const l={},u={href:"https://v2.cn.vuejs.org/v2/guide/reactivity.html",target:"_blank",rel:"noopener noreferrer"},r=c(`<p>当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，并使用 Object.defineProperty 把这些 property 全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。</p><p>这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 能够追踪依赖，在 property 被访问和修改时通知变更。这里需要注意的是不同浏览器在控制台打印数据对象时对 getter/setter 的格式化并不同，所以建议安装 vue-devtools 来获取对检查数据更加友好的用户界面。</p><p>每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/data.png" alt="Vue2响应式原理官网图例" loading="lazy"></p><p>为了彻底弄懂 Vue2 的数据更新原理，手写相关实现代码，让相关知识不再处于“忽悠阶段”，现记录本章节</p><h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><h3 id="mvvm-模式" tabindex="-1"><a class="header-anchor" href="#mvvm-模式" aria-hidden="true">#</a> MVVM 模式</h3><p><code>&lt;template&gt;</code> 提供 html 模板视图(view)</p><p><code>&lt;script&gt;</code> 中的 data 提供已声明的响应式数据(model)</p><p><code>&lt;script&gt;</code> 中的其他对 data 的操作实现 model 和 view 之间的双向响应(view-model)</p><h3 id="非侵入式变化" tabindex="-1"><a class="header-anchor" href="#非侵入式变化" aria-hidden="true">#</a> 非侵入式变化</h3><p>Vue 的数据变化语法为 <code>this.a ++;</code>，并未调用其他任何 API，为非侵入式数据变化</p><p>React 的数据变化语法为 <code>this.setState({ a: this.state.a ++; })</code>，小程序同样也是 <code>this.setData({ a: this.data.a + 1 })</code>，都需要借助框架的 API 才能修改数据，为侵入式数据变化</p><h3 id="上帝的钥匙" tabindex="-1"><a class="header-anchor" href="#上帝的钥匙" aria-hidden="true">#</a> 上帝的钥匙</h3><p><code>Object.defineProperty()</code> 数据劫持/数据代理</p><p>利用 JS 引擎赋予的功能，监测对象属性变化。</p><p>但是仅有“上帝的钥匙”不够，还需要设计一套精密的系统，因此需要一套依赖收集与订阅发布系统。</p><h2 id="_1-实现完整的数据劫持" tabindex="-1"><a class="header-anchor" href="#_1-实现完整的数据劫持" aria-hidden="true">#</a> 1.实现完整的数据劫持</h2><p>简而言之，对需要数据劫持的对象初始化 Observer 观察者类，并开启数据劫持</p><h3 id="方法简介" tabindex="-1"><a class="header-anchor" href="#方法简介" aria-hidden="true">#</a> 方法简介</h3><p><code>Object.defineProperty()</code> 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;a&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;b&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// { a: 3, b: 5 }</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>a<span class="token punctuation">,</span> obj<span class="token punctuation">.</span>b<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 3, 5</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="隐藏属性" tabindex="-1"><a class="header-anchor" href="#隐藏属性" aria-hidden="true">#</a> 隐藏属性</h3><p>同时，还可以设置一些额外隐藏的属性，这里只列 2 个为例</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;a&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
  <span class="token comment">// 是否可写</span>
  <span class="token literal-property property">writable</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">// 不可写的属性，对obj.a的数据修改不会生效</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;b&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
  <span class="token comment">// 是否可以被枚举</span>
  <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">// 无法被枚举的属性，对obj作for..in循环的时候不会被读取</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getter-setter" tabindex="-1"><a class="header-anchor" href="#getter-setter" aria-hidden="true">#</a> getter/setter</h3><p>get：属性的 getter 参数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 <code>this</code> 对象（由于继承关系，这里的 <code>this</code> 不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。<strong>默认为 undefined</strong></p><p>set：属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（被赋予的新值），会传入赋值时的 <code>this</code> 对象。<strong>默认为 undefined</strong></p><p>get 和 set，可以通过闭包存储 get 和 set 的值</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;a&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token comment">// getter</span>
  <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;你试图访问obj的a属性&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// setter</span>
  <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;你试图改变obj的a属性&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 你试图访问obj的a属性 undefined</span>
obj<span class="token punctuation">.</span>a <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span> <span class="token comment">// 你试图改变obj的a属性 obj.a仍然是undefined</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>get/set 需要变量周转才能工作</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> temp<span class="token punctuation">;</span>

Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;a&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token comment">// getter</span>
  <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;你试图访问obj的a属性&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> temp<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// setter</span>
  <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;你试图改变obj的a属性&quot;</span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    temp <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
obj<span class="token punctuation">.</span>a <span class="token operator">=</span> <span class="token number">9</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 9</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>设置 defineReactive 函数实现变量闭包</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 可枚举</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 可以被配置，比如可以被delete</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// getter</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图访问obj的</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> val<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setter</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图改变obj的</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      val <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token function">defineReactive</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;a&quot;</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 10</span>
obj<span class="token punctuation">.</span>a <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="递归侦测对象属性-实现-observer-类" tabindex="-1"><a class="header-anchor" href="#递归侦测对象属性-实现-observer-类" aria-hidden="true">#</a> 递归侦测对象属性(实现 Observer 类)</h3><p>形如<code>Object.defineProperty(obj, &#39;a&#39;)</code> 仅当 a 作为基本类型可以正常监测属性，如果 a 是嵌套对象，则 a 内部的属性变化无法正常监测</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// defineReactive.js</span>
<span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  val <span class="token operator">=</span> val <span class="token operator">||</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 可枚举</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 可以被配置，比如可以被delete</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// getter</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图访问obj的</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> val<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setter</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图改变obj的</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      val <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">m</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">n</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token function">defineReactive</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;a&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// a是响应式对象数据</span>
obj<span class="token punctuation">.</span>a<span class="token punctuation">.</span>m<span class="token punctuation">.</span>n <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>a<span class="token punctuation">.</span>m<span class="token punctuation">.</span>n<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// n不是响应式数据</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，Observer 观察者模式需要将一个正常的 object 转换为每个层级的属性都是响应式（可以被侦测）的 object</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// util.js __ob__属性定义</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">def</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> enumerable</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    value<span class="token punctuation">,</span>
    enumerable<span class="token punctuation">,</span>
    <span class="token literal-property property">writable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// defineReactive.js</span>
<span class="token comment">// 响应式数据劫持的核心函数</span>
<span class="token comment">// 作用1：生成val闭包变量，用以劫持数据</span>
<span class="token comment">// 作用2：对val变量开启observe类型判断与监听，生成递归结构的观察者类</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  val <span class="token operator">=</span> val <span class="token operator">||</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义响应式数据前，先执行一次值类型判断，如果为复杂类型，则会new Observer实例同时遍历key值进入defineReactive的递归执行，直到key的value值为基本类型为止</span>
  <span class="token function">observe</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 可枚举</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 可以被配置，比如可以被delete</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// getter</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图访问</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> val<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setter</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图改变</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      val <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// observer.js 观察者类</span>
<span class="token comment">// 数据变量的观察者类</span>
<span class="token comment">// 作用1：为闭包变量创建实例对象，只要递归结构中存在复杂类型就一定会创建新的实例对象</span>
<span class="token comment">// 作用2：在实例上声明一个响应式变化的 __ob__ 对象，现阶段暂时用不上</span>
<span class="token comment">// 作用3：遍历实例的全部key值并开启响应式数据劫持</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> defineReactive <span class="token keyword">from</span> <span class="token string">&quot;./defineReactive.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 给需要开启监听的对象声明绑定一个初始化的Observer类，key值为__ob__，且不可被枚举</span>
    <span class="token function">def</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&quot;__ob__&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 遍历value的key，对每一个属性都开启监听</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 遍历</span>
  <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">defineReactive</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 值类型监听判断函数，也是对象观察者模式初始化执行或后续值改变时触发的函数</span>
<span class="token comment">// 作用1：为复杂数据类型，且没有初始化过Observer实例对象的变量，作new Observer操作</span>
<span class="token comment">// 作用2：作为defineReactive响应式数据劫持函数的递归操作入口函数，实现多层级复杂类型的递归响应式数据劫持</span>
<span class="token keyword">import</span> Observer <span class="token keyword">from</span> <span class="token string">&quot;./observer.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">observe</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 基本类型不再往下执行，递归的跳出条件</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value <span class="token operator">!==</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> ob<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value<span class="token punctuation">.</span>__ob__ <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当对象的 __ob__ 不为 undefined 时，说明value已经初始化创建过Observer实例了，此时不再执行new Observer，__ob__是响应式的</span>
    ob <span class="token operator">=</span> value<span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 对象不存在 __ob__ 属性时，new Observer实例对象并初始化value值</span>
    ob <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Observer</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> ob<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数组的响应式处理" tabindex="-1"><a class="header-anchor" href="#数组的响应式处理" aria-hidden="true">#</a> 数组的响应式处理</h3><p>上述的实现只能处理普通对象形式，对于数组仍无法正确处理</p><p>因此，Vue2 底层改写了数组的 7 个方法：push、pop、shift、unshift、splice、sort、reverse</p><p>实现方式：以 <code>Array.prototype</code> 为原型，创建一个 arrayMethods 对象</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1672982883181.jpg" alt="响应式原理修改数组方法" loading="lazy"></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// array.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> arrayPrototype <span class="token operator">=</span> <span class="token class-name">Array</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> arrayMethods <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>arrayPrototype<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> methodsNeedChange <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">&quot;push&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;pop&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;shift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;unshift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;splice&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;sort&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;reverse&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

methodsNeedChange<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">methodName</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 备份原来的方法</span>
  <span class="token keyword">const</span> original <span class="token operator">=</span> arrayPrototype<span class="token punctuation">[</span>methodName<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义新方法</span>
  <span class="token function">def</span><span class="token punctuation">(</span>
    arrayMethods<span class="token punctuation">,</span>
    methodName<span class="token punctuation">,</span>
    <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 执行数组的老方法，保证原API顺利执行</span>
      <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">original</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> arguments<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 从顶层对象开始递归调用声明下的数组，已经完成了实例初始化，执行\`def(value, &quot;__ob__&quot;, this, false);\`后当前数组必定包含 __ob__ 属性</span>
      <span class="token keyword">const</span> ob <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>

      <span class="token comment">// 7种方法里有3种方法 push / unshift / splice 能够插入新项，现在要把插入的新项也变为observe响应式数据</span>
      <span class="token keyword">let</span> inserted <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

      <span class="token keyword">switch</span> <span class="token punctuation">(</span>methodName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token string">&quot;push&quot;</span><span class="token operator">:</span>
        <span class="token keyword">case</span> <span class="token string">&quot;unshift&quot;</span><span class="token operator">:</span>
          inserted <span class="token operator">=</span> arguments<span class="token punctuation">;</span> <span class="token comment">// 指向插入的新项</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> <span class="token string">&quot;splice&quot;</span><span class="token operator">:</span>
          <span class="token comment">// splice参数是splice(下标[，数量[，插入的新项]])</span>
          inserted <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 指向第三个参数</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 判断有没有要插入的新项</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>inserted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        ob<span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>inserted<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> result<span class="token punctuation">;</span> <span class="token comment">// 返回原API的原返回值</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token boolean">false</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// observer.js 观察者类</span>
<span class="token comment">// 数据变量的观察者类</span>
<span class="token comment">// 作用1：为闭包变量创建实例对象，只要递归结构中存在复杂类型就一定会创建新的实例对象</span>
<span class="token comment">// 作用2：在实例上声明一个响应式变化的 __ob__ 对象，现阶段暂时用不上</span>
<span class="token comment">// 作用3：遍历实例的全部key值并开启响应式数据劫持</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> defineReactive <span class="token keyword">from</span> <span class="token string">&quot;./defineReactive.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> arrayMethods <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./array.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 给需要开启监听的对象声明绑定一个初始化的Observer类，key值为__ob__，且不可被枚举</span>
    <span class="token function">def</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&quot;__ob__&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 1.如果是数组，将这个数组的原型指向重写后的arrayMethods</span>
      <span class="token comment">// \`Object.setPrototypeOf\`：将第一个参数的原型对象指向到第二个参数</span>
      Object<span class="token punctuation">.</span><span class="token function">setPrototypeOf</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> arrayMethods<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 2.让数组实现响应式</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 遍历value的key，对每一个属性都开启监听</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 遍历</span>
  <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">defineReactive</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 数组的特殊遍历</span>
  <span class="token function">observeArray</span><span class="token punctuation">(</span><span class="token parameter">arr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> l <span class="token operator">=</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> l<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 逐项observe</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="完整的数据劫持源码参考" tabindex="-1"><a class="header-anchor" href="#完整的数据劫持源码参考" aria-hidden="true">#</a> 完整的数据劫持源码参考</h3><p>至此，可遍历、递归并且对对象和数组都生效的完整数据劫持原理已经实现，阶段性源码参考如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// util.js __ob__属性定义</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">def</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> enumerable</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    value<span class="token punctuation">,</span>
    enumerable<span class="token punctuation">,</span>
    <span class="token literal-property property">writable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// defineReactive.js</span>
<span class="token comment">// 响应式数据劫持的核心函数</span>
<span class="token comment">// 作用1：生成val闭包变量，用以劫持数据</span>
<span class="token comment">// 作用2：对val变量开启observe类型判断与监听，生成递归结构的观察者类</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  val <span class="token operator">=</span> val <span class="token operator">||</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义响应式数据前，先执行一次值类型判断，如果为复杂类型，则会new Observer实例同时遍历key值进入defineReactive的递归执行，直到key的value值为基本类型为止</span>
  <span class="token function">observe</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 可枚举</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 可以被配置，比如可以被delete</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// getter</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图访问</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> val<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setter</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图改变</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      val <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// array.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> arrayPrototype <span class="token operator">=</span> <span class="token class-name">Array</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> arrayMethods <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>arrayPrototype<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> methodsNeedChange <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">&quot;push&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;pop&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;shift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;unshift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;splice&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;sort&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;reverse&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

methodsNeedChange<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">methodName</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 备份原来的方法</span>
  <span class="token keyword">const</span> original <span class="token operator">=</span> arrayPrototype<span class="token punctuation">[</span>methodName<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义新方法</span>
  <span class="token function">def</span><span class="token punctuation">(</span>
    arrayMethods<span class="token punctuation">,</span>
    methodName<span class="token punctuation">,</span>
    <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 执行数组的老方法，保证原API顺利执行</span>
      <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">original</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> arguments<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 从顶层对象开始递归调用声明下的数组，已经完成了实例初始化，执行\`def(value, &quot;__ob__&quot;, this, false);\`后当前数组必定包含 __ob__ 属性</span>
      <span class="token keyword">const</span> ob <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>

      <span class="token comment">// 7种方法里有3种方法 push / unshift / splice 能够插入新项，现在要把插入的新项也变为observe响应式数据</span>
      <span class="token keyword">let</span> inserted <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

      <span class="token keyword">switch</span> <span class="token punctuation">(</span>methodName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token string">&quot;push&quot;</span><span class="token operator">:</span>
        <span class="token keyword">case</span> <span class="token string">&quot;unshift&quot;</span><span class="token operator">:</span>
          inserted <span class="token operator">=</span> arguments<span class="token punctuation">;</span> <span class="token comment">// 指向插入的新项</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> <span class="token string">&quot;splice&quot;</span><span class="token operator">:</span>
          <span class="token comment">// splice参数是splice(下标[，数量[，插入的新项]])</span>
          inserted <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 指向第三个参数</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 判断有没有要插入的新项</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>inserted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        ob<span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>inserted<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> result<span class="token punctuation">;</span> <span class="token comment">// 返回原API的原返回值</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token boolean">false</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// observer.js 观察者类</span>
<span class="token comment">// 数据变量的观察者类</span>
<span class="token comment">// 作用1：为闭包变量创建实例对象，只要递归结构中存在复杂类型就一定会创建新的实例对象</span>
<span class="token comment">// 作用2：在实例上声明一个响应式变化的 __ob__ 对象，现阶段暂时用不上</span>
<span class="token comment">// 作用3：遍历实例的全部key值并开启响应式数据劫持</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> defineReactive <span class="token keyword">from</span> <span class="token string">&quot;./defineReactive.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> arrayMethods <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./array.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 给需要开启监听的对象声明绑定一个初始化的Observer类，key值为__ob__，且不可被枚举</span>
    <span class="token function">def</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&quot;__ob__&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 1.如果是数组，将这个数组的原型指向重写后的arrayMethods</span>
      <span class="token comment">// \`Object.setPrototypeOf\`：将第一个参数的原型对象指向到第二个参数</span>
      Object<span class="token punctuation">.</span><span class="token function">setPrototypeOf</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> arrayMethods<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 2.让数组实现响应式</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 遍历value的key，对每一个属性都开启监听</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 遍历</span>
  <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">defineReactive</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 数组的特殊遍历</span>
  <span class="token function">observeArray</span><span class="token punctuation">(</span><span class="token parameter">arr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> l <span class="token operator">=</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> l<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 逐项observe</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 值类型监听判断函数，也是对象观察者模式初始化执行或后续值改变时触发的函数</span>
<span class="token comment">// 作用1：为复杂数据类型，且没有初始化过Observer实例对象的变量，作new Observer操作</span>
<span class="token comment">// 作用2：作为defineReactive响应式数据劫持函数的递归操作入口函数，实现多层级复杂类型的递归响应式数据劫持</span>
<span class="token keyword">import</span> Observer <span class="token keyword">from</span> <span class="token string">&quot;./observer.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">observe</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 基本类型不再往下执行，递归的跳出条件</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value <span class="token operator">!==</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> ob<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value<span class="token punctuation">.</span>__ob__ <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当对象的 __ob__ 不为 undefined 时，说明value已经初始化创建过Observer实例了，此时不再执行new Observer，__ob__是响应式的</span>
    ob <span class="token operator">=</span> value<span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 对象不存在 __ob__ 属性时，new Observer实例对象并初始化value值</span>
    ob <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Observer</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> ob<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 代码实现</span>
<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token function">observe</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行顺序：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>执行observe<span class="token punctuation">(</span>obj<span class="token punctuation">)</span>
├── new Observer<span class="token punctuation">(</span>obj<span class="token punctuation">)</span>,并执行this.walk<span class="token punctuation">(</span><span class="token punctuation">)</span>遍历obj的属性，执行defineReactive<span class="token punctuation">(</span><span class="token punctuation">)</span>
    ├── defineReactive<span class="token punctuation">(</span>obj, a<span class="token punctuation">)</span>
        ├── 执行observe<span class="token punctuation">(</span>obj.a<span class="token punctuation">)</span> 发现obj.a不是对象，直接返回
        ├── 执行defineReactive<span class="token punctuation">(</span>obj, a<span class="token punctuation">)</span> 的剩余代码
    ├── defineReactive<span class="token punctuation">(</span>obj, b<span class="token punctuation">)</span>
	    ├── 执行observe<span class="token punctuation">(</span>obj.b<span class="token punctuation">)</span> 发现obj.b是对象
	        ├── 执行 new Observer<span class="token punctuation">(</span>obj.b<span class="token punctuation">)</span>，遍历obj.b的属性，执行defineReactive<span class="token punctuation">(</span><span class="token punctuation">)</span>
                    ├── 执行defineReactive<span class="token punctuation">(</span>obj.b, c<span class="token punctuation">)</span>
                        ├── 执行observe<span class="token punctuation">(</span>obj.b.c<span class="token punctuation">)</span> 发现obj.b.c不是对象，直接返回
                        ├── 执行defineReactive<span class="token punctuation">(</span>obj.b, c<span class="token punctuation">)</span>的剩余代码
            ├── 执行defineReactive<span class="token punctuation">(</span>obj, b<span class="token punctuation">)</span>的剩余代码
代码执行结束
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用关系：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1672995344760.jpg" alt="调用关系" loading="lazy"></p><p>三个函数相互调用从而形成了递归，与普通的递归有所不同。 有些同学可能会想，只要在 setter 中调用一下渲染函数来重新渲染页面，不就能完成在数据变化时更新页面了吗？确实可以，但是这样做的代价就是：任何一个数据的变化，都会导致这个页面的重新渲染，代价未免太大了吧。我们想做的效果是：数据变化时，只更新与这个数据有关的 DOM 结构，那就涉及到下文的内容了：依赖</p><h2 id="_2-实现订阅-发布模式的依赖收集" tabindex="-1"><a class="header-anchor" href="#_2-实现订阅-发布模式的依赖收集" aria-hidden="true">#</a> 2.实现订阅-发布模式的依赖收集</h2><ul><li>在 Vue2 中，中等粒度依赖，用到数据的组件都是依赖</li><li>在 getter 中收集依赖，在 setter 中触发依赖</li></ul><p><strong>核心：Dep 类和 Watcher 类</strong></p><ul><li>把依赖收集的代码封装成一个 Dep 类，它专门用来管理依赖，每个 Observer 的实例，成员中都有一个 Dep 的实例</li><li>Watcher 是一个中介，数据发生变化时通过 Watcher 中转，通知组件</li><li>下图为官方的订阅-发布模式图例</li></ul><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1672988976577.jpg" alt="发布订阅模式" loading="lazy"></p><ul><li>依赖就是 Watcher。只有 Watcher 触发的 getter 才会收集依赖，哪个 Watcher 触发了 getter，就把哪个 Watcher 收集到 Dep 中。</li><li>Dep 使用订阅-发布模式，当数据发生变化时，会循环依赖列表，把所有的 Watcher 都通知一遍。</li><li>代码实现的巧妙之处：Watcher 把自己设置到全局的一个指定位置，然后读取数据，因为读取了数据，所以会触发这个数据的 getter。在 getter 中就能得到当前正在读取数据的 Watcher，并把这个 Watcher 收集到 Dep 中。</li></ul><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1672989938316.jpg" alt="更详细的发布订阅模式" loading="lazy"></p><h3 id="初始化订阅-发布系统" tabindex="-1"><a class="header-anchor" href="#初始化订阅-发布系统" aria-hidden="true">#</a> 初始化订阅-发布系统</h3><h3 id="watcher-类初步实现" tabindex="-1"><a class="header-anchor" href="#watcher-类初步实现" aria-hidden="true">#</a> Watcher 类初步实现</h3><p>Watcher 类作为一个独立的订阅系统，当且仅当依赖的数据发生变化时，接收到数据发生变化的消息时，才会触发 update 更新，最后如果回调函数存在再执行回调（对标 watch 配置项中的 handler）</p><p>初步实现如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// watcher.js</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Watcher</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> expression<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// data: 数据对象，如obj</span>
    <span class="token comment">// expression：表达式，如b.c，根据data和expression就可以获取watcher依赖的数据</span>
    <span class="token comment">// cb：依赖变化时触发的回调</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>expression <span class="token operator">=</span> expression<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>cb <span class="token operator">=</span> cb<span class="token punctuation">;</span>
    <span class="token comment">// 初始化watcher实例时订阅数据</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token function">parsePath</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>expression<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 当收到数据变化的消息时执行该方法，从而调用cb</span>
  <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token function">parsePath</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>expression<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 对存储的数据进行更新</span>
    <span class="token function">cb</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">parsePath</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> expression</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> segments <span class="token operator">=</span> expression<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&quot;.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">of</span> segments<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>obj<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
    obj <span class="token operator">=</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> obj<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dep-类初步实现" tabindex="-1"><a class="header-anchor" href="#dep-类初步实现" aria-hidden="true">#</a> Dep 类初步实现</h3><p>创建完 Watcher 类实现订阅系统后，我们还需要一个类来实现发布系统，总结一下接下来需要实现的功能：</p><ol><li>有一个数组来存储 watcher，用以存储需要更新的订阅信息。</li><li>watcher 实例需要订阅(依赖)数据，也就是获取依赖或者收集依赖。</li><li>watcher 的依赖发生变化时触发 watcher 的回调函数，也就是派发更新。</li></ol><p>每个数据都应该维护一个属于自己的数组，该数组来存放依赖自己的 watcher，我们可以在 defineReactive 中定义一个数组 dep，这样通过闭包，每个属性就能拥有一个属于自己的 dep</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// defineReactive.js</span>
<span class="token comment">// 响应式数据劫持的核心函数</span>
<span class="token comment">// 作用1：生成val闭包变量，用以劫持数据</span>
<span class="token comment">// 作用2：对val变量开启observe类型判断与监听，生成递归结构的观察者类</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dep <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  val <span class="token operator">=</span> val <span class="token operator">||</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义响应式数据前，先执行一次值类型判断，如果为复杂类型，则会new Observer实例同时遍历key值进入defineReactive的递归执行，直到key的value值为基本类型为止</span>
  <span class="token function">observe</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 可枚举</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 可以被配置，比如可以被delete</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// getter</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图访问</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> val<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setter</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图改变</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      val <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      dep<span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，再实现收集依赖的功能，实现代码前先总结一下现阶段情况与下阶段目标</p><ul><li><p>从 Watcher 类中不难看出，实例化时会执行 get 方法，get 方法的作用就是获取自己依赖的数据，而我们重写了数据的访问行为，为每个数据定义了 getter，因此 getter 函数就会执行，如果我们在 getter 中把当前的 watcher 添加到 dep 数组中，就可以收集依赖</p></li><li><p>注意：执行到 getter 时，<code>new Watcher()</code>的 get 方法还没有执行完毕。</p><p><code>new Watcher()</code>时执行 constructor，调用了实例的 get 方法，实例的 get 方法会读取数据的值，从而触发了数据的 getter，getter 执行完毕后，实例的 get 方法执行完毕，并返回值，constructor 执行完毕，实例化完毕。</p></li><li><p>总体的依赖收集过程就是：渲染页面时碰到插值表达式，v-bind 等需要数据等地方，会实例化一个 watcher,实例化 watcher 就会对依赖的数据求值，从而触发 getter，数据的 getter 函数就会添加依赖自己的 watcher，从而完成依赖收集。我们可以理解为 watcher 在收集依赖，而代码的实现方式是在数据中存储依赖自己的 watcher</p></li><li><p>实现依赖收集后，我们最后要实现的功能是派发更新，也就是依赖变化时触发 watcher 的回调。从依赖收集部分我们知道，获取哪个数据，也就是说触发哪个数据的 getter，就说明 watcher 依赖哪个数据，因此数据变化的时候，就通过 setter 来派发更新。</p></li></ul><h3 id="订阅-发布初步实现" tabindex="-1"><a class="header-anchor" href="#订阅-发布初步实现" aria-hidden="true">#</a> 订阅-发布初步实现</h3><p>配合 vue2 源码完善代码，进一步完善 Watcher 类和 Dep 类，附上阶段源码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// util.js __ob__属性定义</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">def</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> enumerable</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    value<span class="token punctuation">,</span>
    enumerable<span class="token punctuation">,</span>
    <span class="token literal-property property">writable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// defineReactive.js</span>
<span class="token comment">// 响应式数据劫持的核心函数</span>
<span class="token comment">// 作用1：生成val闭包变量，用以劫持数据</span>
<span class="token comment">// 作用2：对val变量开启observe类型判断与监听，生成递归结构的观察者类</span>
<span class="token keyword">import</span> Dep <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dep <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Dep</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  val <span class="token operator">=</span> val <span class="token operator">||</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义响应式数据前，先执行一次值类型判断，如果为复杂类型，则会new Observer实例同时遍历key值进入defineReactive的递归执行，直到key的value值为基本类型为止</span>
  <span class="token function">observe</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 可枚举</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 可以被配置，比如可以被delete</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// getter</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图访问</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 重要！！！get收集依赖</span>
      dep<span class="token punctuation">.</span><span class="token function">depend</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> val<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setter</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图改变</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      val <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 重要！！！set更新依赖</span>
      dep<span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// watcher.js</span>
<span class="token keyword">import</span> Dep <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> pushTarget<span class="token punctuation">,</span> popTarget <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> uid <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Watcher</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> expression<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// data: 数据对象，如obj</span>
    <span class="token comment">// expression：表达式，如b.c，根据data和expression就可以获取watcher依赖的数据</span>
    <span class="token comment">// cb：依赖变化时触发的回调</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>uid <span class="token operator">=</span> uid<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>expression <span class="token operator">=</span> expression<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>cb <span class="token operator">=</span> cb<span class="token punctuation">;</span>
    <span class="token comment">// 初始化watcher实例时订阅数据</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 1.新增watcher目标target的push和pop步骤</span>
    <span class="token comment">// 2.因为js为单线程执行，因此同一时刻仅有一个watcher实例执行，Dep.target必定是当前正处于实例化过程中的watcher</span>
    <span class="token comment">// 3.等待value值成功析出之后，将当前实例从targetStack中弹出，保证父子对象的两个watcher实例初始化时不会出现target冲突</span>
    <span class="token keyword">let</span> value<span class="token punctuation">;</span>
    <span class="token function">pushTarget</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      value <span class="token operator">=</span> <span class="token function">parsePath</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>expression<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
      <span class="token function">popTarget</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 当收到数据变化的消息时执行该方法，从而调用cb</span>
  <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 基本类型，新旧值不相等才会执行更新与回调；复杂类型，触发update时必定更新，vue2特性，因此oldValue与newValue也总是相等</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">||</span> <span class="token keyword">typeof</span> value <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> oldValue <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value<span class="token punctuation">;</span> <span class="token comment">// 对存储的数据进行更新</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">cb</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">,</span> oldValue<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 调用回调函数，对标Vue2-watch的handler函数</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">parsePath</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> expression</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> segments <span class="token operator">=</span> expression<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&quot;.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">of</span> segments<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>obj<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
    obj <span class="token operator">=</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> obj<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// dep.js</span>
<span class="token keyword">var</span> uid <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Dep</span> <span class="token punctuation">{</span>
  <span class="token keyword">static</span> target <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>uid <span class="token operator">=</span> uid<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token comment">// 存储订阅者数组 subscribes</span>
    <span class="token comment">// 数组里实际存放的是 Watcher 的实例对象</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>subs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 添加watcher依赖到指定的dep实例，当且仅当全局的Dep.target绑定了watcher实例时才会push进去</span>
  <span class="token function">depend</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Dep<span class="token punctuation">.</span>target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">addSub</span><span class="token punctuation">(</span>Dep<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 通知更新</span>
  <span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 浅拷贝</span>
    <span class="token keyword">const</span> subs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token comment">// 遍历执行watcher实例的update方法更新value</span>
    subs<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">s</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> s<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">addSub</span><span class="token punctuation">(</span><span class="token parameter">sub</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>sub<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> targetStack <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">pushTarget</span><span class="token punctuation">(</span><span class="token parameter">_target</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  targetStack<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>Dep<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Dep<span class="token punctuation">.</span>target <span class="token operator">=</span> _target<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">popTarget</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Dep<span class="token punctuation">.</span>target <span class="token operator">=</span> targetStack<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// array.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> arrayPrototype <span class="token operator">=</span> <span class="token class-name">Array</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> arrayMethods <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>arrayPrototype<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> methodsNeedChange <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">&quot;push&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;pop&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;shift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;unshift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;splice&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;sort&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;reverse&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

methodsNeedChange<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">methodName</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 备份原来的方法</span>
  <span class="token keyword">const</span> original <span class="token operator">=</span> arrayPrototype<span class="token punctuation">[</span>methodName<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义新方法</span>
  <span class="token function">def</span><span class="token punctuation">(</span>
    arrayMethods<span class="token punctuation">,</span>
    methodName<span class="token punctuation">,</span>
    <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 执行数组的老方法，保证原API顺利执行</span>
      <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">original</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> arguments<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 从顶层对象开始递归调用声明下的数组，已经完成了实例初始化，执行\`def(value, &quot;__ob__&quot;, this, false);\`后当前数组必定包含 __ob__ 属性</span>
      <span class="token keyword">const</span> ob <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>

      <span class="token comment">// 7种方法里有3种方法 push / unshift / splice 能够插入新项，现在要把插入的新项也变为observe响应式数据</span>
      <span class="token keyword">let</span> inserted <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

      <span class="token keyword">switch</span> <span class="token punctuation">(</span>methodName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token string">&quot;push&quot;</span><span class="token operator">:</span>
        <span class="token keyword">case</span> <span class="token string">&quot;unshift&quot;</span><span class="token operator">:</span>
          inserted <span class="token operator">=</span> arguments<span class="token punctuation">;</span> <span class="token comment">// 指向插入的新项</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> <span class="token string">&quot;splice&quot;</span><span class="token operator">:</span>
          <span class="token comment">// splice参数是splice(下标[，数量[，插入的新项]])</span>
          inserted <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 指向第三个参数</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 判断有没有要插入的新项</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>inserted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        ob<span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>inserted<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> result<span class="token punctuation">;</span> <span class="token comment">// 返回原API的原返回值</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token boolean">false</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// observer.js 观察者类</span>
<span class="token comment">// 数据变量的观察者类</span>
<span class="token comment">// 作用1：为闭包变量创建实例对象，只要递归结构中存在复杂类型就一定会创建新的实例对象</span>
<span class="token comment">// 作用2：在实例上声明一个响应式变化的 __ob__ 对象，现阶段暂时用不上</span>
<span class="token comment">// 作用3：遍历实例的全部key值并开启响应式数据劫持</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> defineReactive <span class="token keyword">from</span> <span class="token string">&quot;./defineReactive.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> arrayMethods <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./array.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> Dep <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 给需要开启监听的对象声明绑定一个初始化的Observer类，key值为__ob__，且不可被枚举</span>
    <span class="token function">def</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&quot;__ob__&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 1.如果是数组，将这个数组的原型指向重写后的arrayMethods</span>
      <span class="token comment">// \`Object.setPrototypeOf\`：将第一个参数的原型对象指向到第二个参数</span>
      Object<span class="token punctuation">.</span><span class="token function">setPrototypeOf</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> arrayMethods<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 2.让数组实现响应式</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 遍历value的key，对每一个属性都开启监听</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 遍历</span>
  <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">defineReactive</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 数组的特殊遍历</span>
  <span class="token function">observeArray</span><span class="token punctuation">(</span><span class="token parameter">arr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> l <span class="token operator">=</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> l<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 逐项observe</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 值类型监听判断函数，也是对象观察者模式初始化执行或后续值改变时触发的函数</span>
<span class="token comment">// 作用1：为复杂数据类型，且没有初始化过Observer实例对象的变量，作new Observer操作</span>
<span class="token comment">// 作用2：作为defineReactive响应式数据劫持函数的递归操作入口函数，实现多层级复杂类型的递归响应式数据劫持</span>
<span class="token keyword">import</span> Observer <span class="token keyword">from</span> <span class="token string">&quot;./observer.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">observe</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 基本类型不再往下执行，递归的跳出条件</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value <span class="token operator">!==</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> ob<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value<span class="token punctuation">.</span>__ob__ <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当对象的 __ob__ 不为 undefined 时，说明value已经初始化创建过Observer实例了，此时不再执行new Observer，__ob__是响应式的</span>
    ob <span class="token operator">=</span> value<span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 对象不存在 __ob__ 属性时，new Observer实例对象并初始化value值</span>
    ob <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Observer</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> ob<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// entry.js</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> Watcher <span class="token keyword">from</span> <span class="token string">&quot;./watcher&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">m</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">n</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span>
  <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token function">observe</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;obj&quot;</span><span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">new</span> <span class="token class-name">Watcher</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;b&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">watcher,b从</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>oldVal<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">变成了</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>val<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
obj<span class="token punctuation">.</span>b <span class="token operator">=</span> <span class="token number">50</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="订阅系统完善" tabindex="-1"><a class="header-anchor" href="#订阅系统完善" aria-hidden="true">#</a> 订阅系统完善</h3><p>至此，Watcher 类的实例化已经可实现对 obj.b 的依赖收集与更新回调。但是仍存在两个问题：1、对象内部属性变化无法监测；2、数组的 7 种方法无法监测。为了实现对复杂类型的精确侦听，还需要对 defineReactive、Observer、arrayMethods 扩充</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// defineReactive.js</span>
<span class="token comment">// 响应式数据劫持的核心函数</span>
<span class="token comment">// 作用1：生成val闭包变量，用以劫持数据</span>
<span class="token comment">// 作用2：对val变量开启observe类型判断与监听，生成递归结构的观察者类</span>
<span class="token keyword">import</span> Dep <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dep <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Dep</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  val <span class="token operator">=</span> val <span class="token operator">||</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义响应式数据前，先执行一次值类型判断，如果为复杂类型，则会new Observer实例同时遍历key值进入defineReactive的递归执行，直到key的value值为基本类型为止</span>
  <span class="token keyword">let</span> childOb <span class="token operator">=</span> <span class="token function">observe</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 可枚举</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 可以被配置，比如可以被delete</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// getter</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图访问</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 重要！！！get收集依赖</span>
      dep<span class="token punctuation">.</span><span class="token function">depend</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 改动</span>
      <span class="token comment">// 完善对象的依赖收集</span>
      <span class="token comment">// childOb通过observe嵌套执行，目的是确保父对象内部的子对象可以正确执行依赖收集</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>childOb<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        childOb<span class="token punctuation">.</span>dep<span class="token punctuation">.</span><span class="token function">depend</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> val<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setter</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图改变</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      val <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
      childOb <span class="token operator">=</span> <span class="token function">observe</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 重要！！！set更新依赖</span>
      dep<span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// observer.js 观察者类</span>
<span class="token comment">// 数据变量的观察者类</span>
<span class="token comment">// 作用1：为闭包变量创建实例对象，只要递归结构中存在复杂类型就一定会创建新的实例对象</span>
<span class="token comment">// 作用2：在实例上声明一个响应式变化的 __ob__ 对象，现阶段暂时用不上</span>
<span class="token comment">// 作用3：遍历实例的全部key值并开启响应式数据劫持</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> defineReactive <span class="token keyword">from</span> <span class="token string">&quot;./defineReactive.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> arrayMethods <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./array.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> Dep <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 改动</span>
    <span class="token comment">// 为了确保复杂对象可以被正确侦听，需要给对象的 __ob__ 绑定dep实例</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>dep <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Dep</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 给需要开启监听的对象声明绑定一个初始化的Observer类，key值为__ob__，且不可被枚举</span>
    <span class="token function">def</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&quot;__ob__&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 1.如果是数组，将这个数组的原型指向重写后的arrayMethods</span>
      <span class="token comment">// \`Object.setPrototypeOf\`：将第一个参数的原型对象指向到第二个参数</span>
      Object<span class="token punctuation">.</span><span class="token function">setPrototypeOf</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> arrayMethods<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 2.让数组实现响应式</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 遍历value的key，对每一个属性都开启监听</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 遍历</span>
  <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">defineReactive</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 数组的特殊遍历</span>
  <span class="token function">observeArray</span><span class="token punctuation">(</span><span class="token parameter">arr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> l <span class="token operator">=</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> l<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 逐项observe</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// array.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> arrayPrototype <span class="token operator">=</span> <span class="token class-name">Array</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> arrayMethods <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>arrayPrototype<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> methodsNeedChange <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">&quot;push&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;pop&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;shift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;unshift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;splice&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;sort&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;reverse&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

methodsNeedChange<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">methodName</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 备份原来的方法</span>
  <span class="token keyword">const</span> original <span class="token operator">=</span> arrayPrototype<span class="token punctuation">[</span>methodName<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义新方法</span>
  <span class="token function">def</span><span class="token punctuation">(</span>
    arrayMethods<span class="token punctuation">,</span>
    methodName<span class="token punctuation">,</span>
    <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 执行数组的老方法，保证原API顺利执行</span>
      <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">original</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> arguments<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 从顶层对象开始递归调用声明下的数组，已经完成了实例初始化，执行\`def(value, &quot;__ob__&quot;, this, false);\`后当前数组必定包含 __ob__ 属性</span>
      <span class="token keyword">const</span> ob <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>

      <span class="token comment">// 7种方法里有3种方法 push / unshift / splice 能够插入新项，现在要把插入的新项也变为observe响应式数据</span>
      <span class="token keyword">let</span> inserted <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

      <span class="token keyword">switch</span> <span class="token punctuation">(</span>methodName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token string">&quot;push&quot;</span><span class="token operator">:</span>
        <span class="token keyword">case</span> <span class="token string">&quot;unshift&quot;</span><span class="token operator">:</span>
          inserted <span class="token operator">=</span> arguments<span class="token punctuation">;</span> <span class="token comment">// 指向插入的新项</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> <span class="token string">&quot;splice&quot;</span><span class="token operator">:</span>
          <span class="token comment">// splice参数是splice(下标[，数量[，插入的新项]])</span>
          inserted <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 指向第三个参数</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 判断有没有要插入的新项</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>inserted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        ob<span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>inserted<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 改动</span>
      <span class="token comment">// 数组7方法之一改动时，需要调动数组对象的dep实例开启依赖收集</span>
      ob<span class="token punctuation">.</span>dep<span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">return</span> result<span class="token punctuation">;</span> <span class="token comment">// 返回原API的原返回值</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token boolean">false</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，数组的 7 种方法和对象内部属性可以正常侦听了</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">m</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">n</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span>
  <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token function">observe</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">new</span> <span class="token class-name">Watcher</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;b&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">@watcher,b从</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>oldVal<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">变成了</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>val<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">new</span> <span class="token class-name">Watcher</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;a.m.n&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">@watcher,a从</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>oldVal<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">变成了</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>val<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">new</span> <span class="token class-name">Watcher</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&quot;c&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">@watcher,c从</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>oldVal<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">变成了</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>val<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
obj<span class="token punctuation">.</span>a<span class="token punctuation">.</span>m<span class="token punctuation">.</span>n <span class="token operator">=</span> <span class="token number">88</span><span class="token punctuation">;</span>
obj<span class="token punctuation">.</span>b <span class="token operator">=</span> <span class="token number">99</span><span class="token punctuation">;</span>
obj<span class="token punctuation">.</span>c<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最终完整源码" tabindex="-1"><a class="header-anchor" href="#最终完整源码" aria-hidden="true">#</a> 最终完整源码</h2><h3 id="util-js" tabindex="-1"><a class="header-anchor" href="#util-js" aria-hidden="true">#</a> util.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// util.js __ob__属性定义</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">def</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> enumerable</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    value<span class="token punctuation">,</span>
    enumerable<span class="token punctuation">,</span>
    <span class="token literal-property property">writable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="definereactive-js" tabindex="-1"><a class="header-anchor" href="#definereactive-js" aria-hidden="true">#</a> defineReactive.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// defineReactive.js</span>
<span class="token comment">// 响应式数据劫持的核心函数</span>
<span class="token comment">// 作用1：生成val闭包变量，用以劫持数据</span>
<span class="token comment">// 作用2：对val变量开启observe类型判断与监听，生成递归结构的观察者类</span>
<span class="token keyword">import</span> Dep <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dep <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Dep</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  val <span class="token operator">=</span> val <span class="token operator">||</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义响应式数据前，先执行一次值类型判断，如果为复杂类型，则会new Observer实例同时遍历key值进入defineReactive的递归执行，直到key的value值为基本类型为止</span>
  <span class="token keyword">let</span> childOb <span class="token operator">=</span> <span class="token function">observe</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// 可枚举</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 可以被配置，比如可以被delete</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// getter</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图访问</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 重要！！！get收集依赖</span>
      dep<span class="token punctuation">.</span><span class="token function">depend</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 改动</span>
      <span class="token comment">// 完善对象的依赖收集</span>
      <span class="token comment">// childOb通过observe嵌套执行，目的是确保父对象内部的子对象可以正确执行依赖收集</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>childOb<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        childOb<span class="token punctuation">.</span>dep<span class="token punctuation">.</span><span class="token function">depend</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> val<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setter</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你试图改变</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">属性</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      val <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
      childOb <span class="token operator">=</span> <span class="token function">observe</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 重要！！！set更新依赖</span>
      dep<span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="array-js" tabindex="-1"><a class="header-anchor" href="#array-js" aria-hidden="true">#</a> array.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// array.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> arrayPrototype <span class="token operator">=</span> <span class="token class-name">Array</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> arrayMethods <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>arrayPrototype<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> methodsNeedChange <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">&quot;push&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;pop&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;shift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;unshift&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;splice&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;sort&quot;</span><span class="token punctuation">,</span>
  <span class="token string">&quot;reverse&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

methodsNeedChange<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">methodName</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 备份原来的方法</span>
  <span class="token keyword">const</span> original <span class="token operator">=</span> arrayPrototype<span class="token punctuation">[</span>methodName<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义新方法</span>
  <span class="token function">def</span><span class="token punctuation">(</span>
    arrayMethods<span class="token punctuation">,</span>
    methodName<span class="token punctuation">,</span>
    <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 执行数组的老方法，保证原API顺利执行</span>
      <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">original</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> arguments<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 从顶层对象开始递归调用声明下的数组，已经完成了实例初始化，执行\`def(value, &quot;__ob__&quot;, this, false);\`后当前数组必定包含 __ob__ 属性</span>
      <span class="token keyword">const</span> ob <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>

      <span class="token comment">// 7种方法里有3种方法 push / unshift / splice 能够插入新项，现在要把插入的新项也变为observe响应式数据</span>
      <span class="token keyword">let</span> inserted <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

      <span class="token keyword">switch</span> <span class="token punctuation">(</span>methodName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token string">&quot;push&quot;</span><span class="token operator">:</span>
        <span class="token keyword">case</span> <span class="token string">&quot;unshift&quot;</span><span class="token operator">:</span>
          inserted <span class="token operator">=</span> arguments<span class="token punctuation">;</span> <span class="token comment">// 指向插入的新项</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> <span class="token string">&quot;splice&quot;</span><span class="token operator">:</span>
          <span class="token comment">// splice参数是splice(下标[，数量[，插入的新项]])</span>
          inserted <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 指向第三个参数</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 判断有没有要插入的新项</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>inserted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        ob<span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>inserted<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 改动</span>
      <span class="token comment">// 数组7方法之一改动时，需要调动数组对象的dep实例开启依赖收集</span>
      ob<span class="token punctuation">.</span>dep<span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">return</span> result<span class="token punctuation">;</span> <span class="token comment">// 返回原API的原返回值</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token boolean">false</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dep-js" tabindex="-1"><a class="header-anchor" href="#dep-js" aria-hidden="true">#</a> dep.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">var</span> uid <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Dep</span> <span class="token punctuation">{</span>
  <span class="token keyword">static</span> target <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>uid <span class="token operator">=</span> uid<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token comment">// 存储订阅者数组 subscribes</span>
    <span class="token comment">// 数组里实际存放的是 Watcher 的实例对象</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>subs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 添加watcher依赖到指定的dep实例，当且仅当全局的Dep.target绑定了watcher实例时才会push进去</span>
  <span class="token function">depend</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Dep<span class="token punctuation">.</span>target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">addSub</span><span class="token punctuation">(</span>Dep<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 通知更新</span>
  <span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 浅拷贝</span>
    <span class="token keyword">const</span> subs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token comment">// 遍历执行watcher实例的update方法更新value</span>
    subs<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">s</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> s<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">addSub</span><span class="token punctuation">(</span><span class="token parameter">sub</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>sub<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> targetStack <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">pushTarget</span><span class="token punctuation">(</span><span class="token parameter">_target</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  targetStack<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>Dep<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Dep<span class="token punctuation">.</span>target <span class="token operator">=</span> _target<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">popTarget</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Dep<span class="token punctuation">.</span>target <span class="token operator">=</span> targetStack<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="watcher-js" tabindex="-1"><a class="header-anchor" href="#watcher-js" aria-hidden="true">#</a> watcher.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> Dep <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> pushTarget<span class="token punctuation">,</span> popTarget <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// watcher.js</span>
<span class="token keyword">var</span> uid <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Watcher</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> expression<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// data: 数据对象，如obj</span>
    <span class="token comment">// expression：表达式，如b.c，根据data和expression就可以获取watcher依赖的数据</span>
    <span class="token comment">// cb：依赖变化时触发的回调</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>uid <span class="token operator">=</span> uid<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>expression <span class="token operator">=</span> expression<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>cb <span class="token operator">=</span> cb<span class="token punctuation">;</span>
    <span class="token comment">// 初始化watcher实例时订阅数据</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 1.新增watcher目标target的push和pop步骤</span>
    <span class="token comment">// 2.因为js为单线程执行，因此同一时刻仅有一个watcher实例执行，Dep.target必定是当前正处于实例化过程中的watcher</span>
    <span class="token comment">// 3.等待value值成功析出之后，将当前实例从targetStack中弹出，保证父子对象的两个watcher实例初始化时不会出现target冲突</span>
    <span class="token keyword">let</span> value<span class="token punctuation">;</span>
    <span class="token function">pushTarget</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      value <span class="token operator">=</span> <span class="token function">parsePath</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>expression<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
      <span class="token function">popTarget</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 当收到数据变化的消息时执行该方法，从而调用cb</span>
  <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 基本类型，新旧值不相等才会执行更新与回调；复杂类型，触发update时必定更新，vue2特性，因此oldValue与newValue也总是相等</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">||</span> <span class="token keyword">typeof</span> value <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> oldValue <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value<span class="token punctuation">;</span> <span class="token comment">// 对存储的数据进行更新</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">cb</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">,</span> oldValue<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 调用回调函数，对标Vue2-watch的handler函数</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">parsePath</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> expression</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> segments <span class="token operator">=</span> expression<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&quot;.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">of</span> segments<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>obj<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
    obj <span class="token operator">=</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> obj<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="observer-js" tabindex="-1"><a class="header-anchor" href="#observer-js" aria-hidden="true">#</a> observer.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// observer.js 观察者类</span>
<span class="token comment">// 数据变量的观察者类</span>
<span class="token comment">// 作用1：为闭包变量创建实例对象，只要递归结构中存在复杂类型就一定会创建新的实例对象</span>
<span class="token comment">// 作用2：在实例上声明一个响应式变化的 __ob__ 对象，现阶段暂时用不上</span>
<span class="token comment">// 作用3：遍历实例的全部key值并开启响应式数据劫持</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> def <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./util.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> defineReactive <span class="token keyword">from</span> <span class="token string">&quot;./defineReactive.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> observe <span class="token keyword">from</span> <span class="token string">&quot;./observe&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> arrayMethods <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./array.js&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> Dep <span class="token keyword">from</span> <span class="token string">&quot;./dep.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 改动</span>
    <span class="token comment">// 为了确保复杂对象可以被正确侦听，需要给对象的 __ob__ 绑定dep实例</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>dep <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Dep</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 给需要开启监听的对象声明绑定一个初始化的Observer类，key值为__ob__，且不可被枚举</span>
    <span class="token function">def</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&quot;__ob__&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 1.如果是数组，将这个数组的原型指向重写后的arrayMethods</span>
      <span class="token comment">// \`Object.setPrototypeOf\`：将第一个参数的原型对象指向到第二个参数</span>
      Object<span class="token punctuation">.</span><span class="token function">setPrototypeOf</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> arrayMethods<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 2.让数组实现响应式</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 遍历value的key，对每一个属性都开启监听</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 遍历</span>
  <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">defineReactive</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 数组的特殊遍历</span>
  <span class="token function">observeArray</span><span class="token punctuation">(</span><span class="token parameter">arr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> l <span class="token operator">=</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> l<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 逐项observe</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="observe-js" tabindex="-1"><a class="header-anchor" href="#observe-js" aria-hidden="true">#</a> observe.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 值类型监听判断函数，也是对象观察者模式初始化执行或后续值改变时触发的函数</span>
<span class="token comment">// 作用1：为复杂数据类型，且没有初始化过Observer实例对象的变量，作new Observer操作</span>
<span class="token comment">// 作用2：作为defineReactive响应式数据劫持函数的递归操作入口函数，实现多层级复杂类型的递归响应式数据劫持</span>
<span class="token keyword">import</span> Observer <span class="token keyword">from</span> <span class="token string">&quot;./observer.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">observe</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 基本类型不再往下执行，递归的跳出条件</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value <span class="token operator">!==</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> ob<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> value<span class="token punctuation">.</span>__ob__ <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当对象的 __ob__ 不为 undefined 时，说明value已经初始化创建过Observer实例了，此时不再执行new Observer，__ob__是响应式的</span>
    ob <span class="token operator">=</span> value<span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 对象不存在 __ob__ 属性时，new Observer实例对象并初始化value值</span>
    ob <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Observer</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> ob<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过，watch 选项的 deep 深度监听暂时还未实现，这部分放到 computed 与 watch 源码分析里说。</p><h2 id="太长不看-总结" tabindex="-1"><a class="header-anchor" href="#太长不看-总结" aria-hidden="true">#</a> 太长不看-总结</h2><h3 id="响应式数据声明" tabindex="-1"><a class="header-anchor" href="#响应式数据声明" aria-hidden="true">#</a> 响应式数据声明</h3><ol><li>Vue2 的响应式原理由数据劫持系统和订阅-发布系统组成，主要实现类是 Observer，最终实现效果是将 data 返回值对象注册为渲染 watcher(render-watcher)</li><li>数据劫持系统的核心是<code>Object.defineProperty()</code>，利用闭包变量与 getter/setter 实现变量的响应式处理，此处暂定为响应式声明函数<code>defineReactive</code></li><li>数据劫持系统的具现化体现在 Observer 类上，在 data 的响应式对象初始化时，先“观察”对象 data（observe），通过对象递归逐层实例化 Observer 类，对每个属性都实现<code>Object.defineProperty()</code>数据劫持</li><li><code>Object.defineProperty()</code>只能生效于普通对象，数组内部的数据变化无法正确生效，Vue2 对数组的处理是重写了数组原型上的 7 种方法：push、pop、shift、unshift、splice、sort、reverse，在不影响这 7 中方法的原方法执行的状况下，开启响应式数据声明<code>defineReactive</code></li></ol><h3 id="订阅-发布系统" tabindex="-1"><a class="header-anchor" href="#订阅-发布系统" aria-hidden="true">#</a> 订阅-发布系统</h3><ol start="5"><li>订阅-发布系统的核心是依赖收集与依赖更新，借助数据劫持的响应式处理来实现目标变量的依赖收集与依赖更新，主要使用者是 computed(computed-watcher) 和 watch(user-watcher)</li><li>订阅-发布系统的具现化体现在 Dep 类和 Watcher 类上。(1)Dep 既是响应式数据的订阅者也是数据更新的发布者，有依赖收集（实际上算是监听收集）方法和通知更新（通知监听更新依赖）方法；(2)Watcher 是出于数据外部的监听器，有依赖获取方法和依赖更新方法；(3)Watcher 实例储存在 Dep 实例中，借由 Dep 发布数据变化的操作，实现精准的数据的实时侦听、数据更新与回调函数执行</li><li>Dep 的执行原理是，在 data 的响应式对象初始化时，对象逐层递归实例化 Observer 类的同时，为每个 Observer 实例创建层层嵌套的 Dep 实例，并且在遍历对象内部属性创建响应式数据时，在响应式声明函数<code>defineReactive</code>中也为每个闭包函数创建一个 Dep 实例</li><li>Watcher 执行依赖收集的原理是，存在对响应式数据的监听需求时（如 computed、watch 等配置项属性），初始化实例并传入目标数据的值、对象目标路径（如 a.b.m.n）和回调函数，最后获取目标值储存到 Watcher 实例中。由于获取的时候触发了 getter，因此调用 Dep 实例的依赖收集方法，将当前出于活性化的 Watcher 类储存在 Dep 实例中</li><li>Watcher 执行依赖更新的原理是，数据变化时触发了 setter，此时调用 Dep 实例的通知更新方法，遍历当前 Dep 实例内部储存的 Watcher 实例，依次调用 Watcher 实例的依赖更新方法，更新数据并执行回调；对于数组方法，则是在触发 7 种方法时，执行数组对象的 Observer 实例内 Dep 实例的通知更新方法来执行</li><li>Dep 储存 Watcher 的联动处理依靠全局唯一变量 Window.target（在 Vue2 源码中是 Dep 类的静态属性 Dep.target），由于 JS 单线程的特性，程序中同时只会有一个 Watcher 实例在运行，将 Watcher 实例赋给 Dep.target 后再执行 Dep 的依赖收集储存 Dep.target，最后清空 Dep.target，确保对应目标对象的 Dep 实例可以正确存储目标对象的 Watcher 实例</li><li>为了确保<code>defineReactive</code>和数组重写方法中可以正确调用对应的目标对象，Vue2 特意为每个 Observer 类创建一个 <code>__ob__</code>属性，指向 Observer 当前实例对象，以保证在其他闭包函数中对实例的正确引用</li></ol><p>可运行项目 demo 详见：</p>`,120),k={href:"https://github.com/mi-saka10032/vue2-reactive-sourceCode/tree/master/reactive",target:"_blank",rel:"noopener noreferrer"};function d(v,m){const a=i("ExternalLinkIcon");return e(),o("div",null,[n("p",null,[s("这里是官网的"),n("a",u,[s("响应式原理"),t(a)]),s("原文")]),r,n("p",null,[n("a",k,[s("https://github.com/mi-saka10032/vue2-reactive-sourceCode/tree/master/reactive"),t(a)])])])}const f=p(l,[["render",d],["__file","1-深入响应式原理.html.vue"]]);export{f as default};
