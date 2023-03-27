import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c,b as n,d as s,e as t,a as e,r as i}from"./app.7b75b111.js";const l={},u=e(`<h2 id="composition-api-组合式-api" tabindex="-1"><a class="header-anchor" href="#composition-api-组合式-api" aria-hidden="true">#</a> Composition API（组合式 API）</h2><h3 id="setup" tabindex="-1"><a class="header-anchor" href="#setup" aria-hidden="true">#</a> setup</h3><p>Vue3.0 中一个新的配置项，值为一个函数。</p><p>setup 是所有 Composition API（组合 API）“表演的舞台”</p><p>组件中所用到的：数据、方法等等，均要配置在 setup 中。</p><p>setup 函数的两种返回值：</p><ol><li>若返回一个对象，则对象中的属性、方法, 在模板中均可以直接使用。（重点关注）</li><li>若返回一个渲染函数：则可以自定义渲染内容。（了解）</li></ol><div class="language-vue line-numbers-mode" data-ext="vue"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">&quot;1&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> age <span class="token operator">=</span> <span class="token number">18</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> <span class="token function-variable function">sayHello</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;Hello&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      name<span class="token punctuation">,</span>
      age<span class="token punctuation">,</span>
      sayHello<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token comment">// 返回一个函数（渲染函数）</span>
    <span class="token comment">// return () =&gt; h(&#39;h1&#39;, &#39;Hello你好&#39;)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意点：</p><ol><li>尽量不要与 Vue2.x 配置混用</li></ol><p>Vue2.x 配置（data、methods、computed）可以访问到 setup 中的属性或方法，但在 setup 中不能访问到 Vue2.x 的配置。如果两者配置重名，以 setup 优先。</p><ol start="2"><li>setup 不能是一个 async 函数，因为返回值不再是 return 的对象, 而是 promise, 模板看不到 return 对象中的属性。（后期也可以返回一个 Promise 实例，但需要 Suspense 和异步组件的配合）</li></ol><h3 id="setup-执行时机" tabindex="-1"><a class="header-anchor" href="#setup-执行时机" aria-hidden="true">#</a> setup 执行时机</h3><p>在 beforeCreate 之前执行一次，this 是 undefined</p><p>setup 的参数：</p><ul><li>props：值为对象，包含组件外部传递进来，且组件内部声明接收了的属性</li><li>context：上下文对象，包含属性 <ul><li>attrs：值为对象，包含组件外部传递过来，但没有在 props 配置中声明的属性，相当于<code>this.$attrs</code></li><li>slots：收到的插槽内容，相当于<code>this.$slots</code></li><li>emit：分发自定义事件的函数，相当于<code>this.$emit</code></li></ul></li></ul><h3 id="ref-函数" tabindex="-1"><a class="header-anchor" href="#ref-函数" aria-hidden="true">#</a> ref 函数</h3><p>作用：定义一个响应式数据</p><p>语法：<code>const xx = ref(initValue)</code></p><ul><li>创建一个包含响应式数据的引用对象（reference 对象，简称 ref 对象）</li><li>在 js 中操作数据：<code>xx.value = xxxxx</code></li><li>模板中读取数据：不需要<code>.value</code>，直接写入插值语句<code>&lt;div&gt;{{ xx }}&lt;/div&gt;</code></li><li>接收的数据可以是基本类型，也可以是对象类型（最好是基本类型）</li><li>基本类型的数据：响应式依然是靠<code>Object.defineProperty()</code>的 get 与 set 完成的</li><li>对象类型的数据：内部借助 Vue3 的 reactive 函数</li></ul><h3 id="reactive-函数" tabindex="-1"><a class="header-anchor" href="#reactive-函数" aria-hidden="true">#</a> reactive 函数</h3><p>作用：定义一个对象类型的响应式数据（基本类型只使用 ref 函数）</p><p>语法：<code>const obj = reactive({ name: &#39;123&#39; })</code></p><ul><li>接收一个对象（或数组》，返回一个代理对象（Proxy 的实例对象，简称 proxy 对象）</li><li>reactive 定义的响应式数据是深层次的</li><li>内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作</li></ul><h3 id="计算与监视属性" tabindex="-1"><a class="header-anchor" href="#计算与监视属性" aria-hidden="true">#</a> 计算与监视属性</h3><h4 id="computed" tabindex="-1"><a class="header-anchor" href="#computed" aria-hidden="true">#</a> computed</h4><p>与 Vue2.x 中 computed 配置功能一致</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>computed<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      <span class="token operator">...</span>
  	<span class="token comment">//计算属性——简写</span>
      <span class="token keyword">let</span> fullName <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
          <span class="token keyword">return</span> person<span class="token punctuation">.</span>firstName <span class="token operator">+</span> <span class="token string">&#39;-&#39;</span> <span class="token operator">+</span> person<span class="token punctuation">.</span>lastName
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token comment">//计算属性——完整</span>
      <span class="token keyword">let</span> fullName <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
              <span class="token keyword">return</span> person<span class="token punctuation">.</span>firstName <span class="token operator">+</span> <span class="token string">&#39;-&#39;</span> <span class="token operator">+</span> person<span class="token punctuation">.</span>lastName
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token function">set</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">{</span>
              <span class="token keyword">const</span> nameArr <span class="token operator">=</span> value<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&#39;-&#39;</span><span class="token punctuation">)</span>
              person<span class="token punctuation">.</span>firstName <span class="token operator">=</span> nameArr<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
              person<span class="token punctuation">.</span>lastName <span class="token operator">=</span> nameArr<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>
          <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="watch" tabindex="-1"><a class="header-anchor" href="#watch" aria-hidden="true">#</a> watch</h4><p>与 Vue2.x 中 watch 配置功能一致</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//情况一：监视ref定义的响应式数据</span>
<span class="token function">watch</span><span class="token punctuation">(</span>
  sum<span class="token punctuation">,</span>
  <span class="token punctuation">(</span><span class="token parameter">newValue<span class="token punctuation">,</span> oldValue</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;sum变化了&quot;</span><span class="token punctuation">,</span> newValue<span class="token punctuation">,</span> oldValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">immediate</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//情况二：监视多个ref定义的响应式数据</span>
<span class="token function">watch</span><span class="token punctuation">(</span><span class="token punctuation">[</span>sum<span class="token punctuation">,</span> msg<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">newValue<span class="token punctuation">,</span> oldValue</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;sum或msg变化了&quot;</span><span class="token punctuation">,</span> newValue<span class="token punctuation">,</span> oldValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">/* 情况三：监视reactive定义的响应式数据
  			若watch监视的是reactive定义的响应式数据，则无法正确获得oldValue！！
  			若watch监视的是reactive定义的响应式数据，则强制开启了深度监视 
  */</span>
<span class="token function">watch</span><span class="token punctuation">(</span>
  person<span class="token punctuation">,</span>
  <span class="token punctuation">(</span><span class="token parameter">newValue<span class="token punctuation">,</span> oldValue</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;person变化了&quot;</span><span class="token punctuation">,</span> newValue<span class="token punctuation">,</span> oldValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">immediate</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token literal-property property">deep</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//此处的deep配置不再奏效</span>

<span class="token comment">//情况四：监视reactive定义的响应式数据中的某个属性</span>
<span class="token function">watch</span><span class="token punctuation">(</span>
  <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> person<span class="token punctuation">.</span>job<span class="token punctuation">,</span>
  <span class="token punctuation">(</span><span class="token parameter">newValue<span class="token punctuation">,</span> oldValue</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;person的job变化了&quot;</span><span class="token punctuation">,</span> newValue<span class="token punctuation">,</span> oldValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">immediate</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token literal-property property">deep</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//情况五：监视reactive定义的响应式数据中的某些属性</span>
<span class="token function">watch</span><span class="token punctuation">(</span>
  <span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> person<span class="token punctuation">.</span>job<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> person<span class="token punctuation">.</span>name<span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">(</span><span class="token parameter">newValue<span class="token punctuation">,</span> oldValue</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;person的job变化了&quot;</span><span class="token punctuation">,</span> newValue<span class="token punctuation">,</span> oldValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">immediate</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token literal-property property">deep</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//特殊情况</span>
<span class="token function">watch</span><span class="token punctuation">(</span>
  <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> person<span class="token punctuation">.</span>job<span class="token punctuation">,</span>
  <span class="token punctuation">(</span><span class="token parameter">newValue<span class="token punctuation">,</span> oldValue</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;person的job变化了&quot;</span><span class="token punctuation">,</span> newValue<span class="token punctuation">,</span> oldValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">deep</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//此处由于监视的是reactive素定义的对象中的某个属性，所以deep配置有效</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="watcheffect" tabindex="-1"><a class="header-anchor" href="#watcheffect" aria-hidden="true">#</a> watchEffect</h4><p>watch 既要指明监视的属性，也要指明监视的回调。</p><p>watchEffect 不用指明监视哪个属性，监视的回调中用到哪个属性，就监视哪个属性。</p><p>watchEffect 有点像 computed：</p><ul><li>但 computed 注重计算出来的值（回调函数的返回值），所以必须要谢返回值</li><li>而 watchEffect 更注重过程（回调函数的函数体），所以不用写返回值</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调。</span>
<span class="token function">watchEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> x1 <span class="token operator">=</span> sum<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
  <span class="token keyword">const</span> x2 <span class="token operator">=</span> person<span class="token punctuation">.</span>age<span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;watchEffect配置的回调执行了&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h3><p>以下是 vue3 的生命周期图示</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue3/lifecycle.16e4c08e.png" alt="Vue3生命周期" loading="lazy"></p><p>Vue3 中可以继续使用 Vue2 的生命周期钩子，但有两个更名：</p><p><code>beforeDestroy</code>改名为 <code>beforeUnmount</code></p><p><code>destroyed</code>改名为 <code>unmounted</code></p><p>Vue3 也提供了 Composition API 形式的生命周期钩子，与 Vue2 中钩子对应关系如下</p><ul><li><code>beforeCreate</code>===&gt;<code>setup()</code></li><li><code>created</code>=======&gt;<code>setup()</code></li><li><code>beforeMount</code> ===&gt;<code>onBeforeMount</code></li><li><code>mounted</code>=======&gt;<code>onMounted</code></li><li><code>beforeUpdate</code>===&gt;<code>onBeforeUpdate</code></li><li><code>updated</code> =======&gt;<code>onUpdated</code></li><li><code>beforeUnmount</code> ==&gt;<code>onBeforeUnmount</code></li><li><code>unmounted</code> =====&gt;<code>onUnmounted</code></li></ul><h3 id="自定义-hook-函数" tabindex="-1"><a class="header-anchor" href="#自定义-hook-函数" aria-hidden="true">#</a> 自定义 hook 函数</h3><p>什么是 hook？—— 本质是一个函数，把 setup 函数中使用的 Composition API 进行了封装。</p><p>类似于 vue2.x 中的 mixin。</p><p>自定义 hook 的优势: 复用代码, 让 setup 中的逻辑更清楚易懂。</p><p>以下是一个暴露响应式宽高数据和获取窗口宽高方法的 hooks 函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> reactive <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 导出一个默认方法</span>

  <span class="token comment">// 创建一个对象，保存宽度和高度值</span>
  <span class="token keyword">const</span> screen <span class="token operator">=</span> <span class="token function">reactive</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
    <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 创建一个方法，获取可视化界面的宽度和高度值</span>
  <span class="token keyword">const</span> <span class="token function-variable function">getWH</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    screen<span class="token punctuation">.</span>width <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>clientWidth<span class="token punctuation">;</span>
    screen<span class="token punctuation">.</span>height <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>clientHeight<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span> screen<span class="token punctuation">,</span> getWH <span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token comment">// 方法返回宽高值</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="组合式-api-的优势" tabindex="-1"><a class="header-anchor" href="#组合式-api-的优势" aria-hidden="true">#</a> 组合式 API 的优势</h3><h4 id="options-api-存在的问题" tabindex="-1"><a class="header-anchor" href="#options-api-存在的问题" aria-hidden="true">#</a> Options API 存在的问题</h4><p>使用传统 OptionsAPI 中，新增或者修改一个需求，就需要分别在 data，methods，computed 里修改。</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue3/optionsAPI.image" alt="OptionsAPI" loading="lazy"></p><h4 id="composition-api-的优势" tabindex="-1"><a class="header-anchor" href="#composition-api-的优势" aria-hidden="true">#</a> Composition API 的优势</h4><p>我们可以更加优雅的组织我们的代码，函数。让相关功能的代码更加有序的组织在一起。</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue3/compositionAPI.image" alt="CompositionAPI" loading="lazy"></p><h2 id="响应式原理" tabindex="-1"><a class="header-anchor" href="#响应式原理" aria-hidden="true">#</a> 响应式原理</h2><h3 id="vue2-响应式" tabindex="-1"><a class="header-anchor" href="#vue2-响应式" aria-hidden="true">#</a> Vue2 响应式</h3><p>实现原理：</p><ul><li>对象类型：通过<code>Object.defineProperty()</code>对属性的读取、修改进行拦截（数据劫持）</li><li>数组类型：通过重写更新数组的一系列方法实现拦截（对数组的变更方法进行了包裹）</li><li>存在问题：新增属性、删除属性，界面不更新；直接通过下标修改数组，界面不更新</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> <span class="token string">&quot;count&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vue3-响应式" tabindex="-1"><a class="header-anchor" href="#vue3-响应式" aria-hidden="true">#</a> Vue3 响应式</h3><p>实现原理：</p>`,65),r=n("li",null,"通过 Proxy 代理：拦截对象中任意属性的变化，包括：属性值的读写、属性的添加、属性的删除等。",-1),d=n("li",null,"通过 Reflect 反射：对源对象的属性进行操作。",-1),k=n("li",null,"MDN 文档中描述的 Proxy 和 Reflect：",-1),v={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy",target:"_blank",rel:"noopener noreferrer"},m={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect",target:"_blank",rel:"noopener noreferrer"},b=e(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token comment">// 拦截读取属性值</span>
  <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> prop<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> prop<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// 拦截设置属性值或添加新属性</span>
  <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> prop<span class="token punctuation">,</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> prop<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// 拦截删除属性</span>
  <span class="token function">deleteProperty</span><span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> prop</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">deleteProperty</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> prop<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

proxy<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">&quot;tom&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ref-与-reactive-对比" tabindex="-1"><a class="header-anchor" href="#ref-与-reactive-对比" aria-hidden="true">#</a> ref 与 reactive 对比</h3><ul><li>从定义数据角度对比：</li></ul><p>ref 用来定义基本类型数据</p><p>reactive 定义复杂类型数据</p><p>注：ref 也可定义复杂类型，它内部实际上自动通过 reactive 转为代理对象</p><ul><li>从原理角度对比：</li></ul><p>ref 通过<code>Object.defineProperty()</code>实现响应式（数据劫持）</p><p>reactive 通过使用 Proxy 实现响应式（数据代理），并通过 Reflect 操作原对象内部数据</p><ul><li>从使用角度对比：</li></ul><p>ref 定义的数据：操作数据需要<code>.value</code>去读写数据，模板读取时直接读取，不需要<code>.value</code></p><p>reactive 定义的数据：操作数据与模板读取数据均不需要<code>.value</code></p>`,12);function h(f,g){const a=i("ExternalLinkIcon");return o(),c("div",null,[u,n("ul",null,[r,d,k,n("li",null,[s("Proxy："),n("a",v,[s("https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy"),t(a)])]),n("li",null,[s("Reflect："),n("a",m,[s("https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect"),t(a)])])]),b])}const x=p(l,[["render",h],["__file","3-compositionAPI.html.vue"]]);export{x as default};
