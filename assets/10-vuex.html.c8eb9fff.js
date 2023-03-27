import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as a,a as t}from"./app.7b75b111.js";const p={},e=t(`<h2 id="理解" tabindex="-1"><a class="header-anchor" href="#理解" aria-hidden="true">#</a> 理解</h2><p>概念：专门在 Vue 中实现集中式状态（数据）管理的一个 Vue 插件，对 vue 应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。</p><p>什么时候使用？</p><p>1.多个组件依赖于同一状态</p><p>2.来自不同组件的行为需要变更同一状态</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/vuex-16349798007261.png" alt="VueX状态" loading="lazy"></p><h2 id="搭建-vuex-环境" tabindex="-1"><a class="header-anchor" href="#搭建-vuex-环境" aria-hidden="true">#</a> 搭建 VueX 环境</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// ./store/index.js VueX根文件</span>
<span class="token keyword">import</span> Vue <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> VueX <span class="token keyword">from</span> <span class="token string">&quot;vuex&quot;</span><span class="token punctuation">;</span>

Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>VueX<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//准备动作actions</span>
<span class="token keyword">const</span> actions <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function">increment</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    context<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&quot;INCREMENT&quot;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">decrement</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    context<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&quot;DECREMENT&quot;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">incrementOdd</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>context<span class="token punctuation">.</span>state<span class="token punctuation">.</span>num <span class="token operator">%</span> <span class="token number">2</span><span class="token punctuation">)</span> context<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&quot;INCREMENT&quot;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">incrementAysnc</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      context<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&quot;INCREMENT&quot;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">//准备变化mutations</span>
<span class="token keyword">const</span> mutations <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token constant">INCREMENT</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    state<span class="token punctuation">.</span>num <span class="token operator">+=</span> value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token constant">DECREMENT</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    state<span class="token punctuation">.</span>num <span class="token operator">-=</span> value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">//准备数据状态state</span>
<span class="token keyword">const</span> state <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">num</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> getters <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function">tenTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> state<span class="token punctuation">.</span>num <span class="token operator">*</span> <span class="token number">10</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">new</span> <span class="token class-name">VueX<span class="token punctuation">.</span>Store</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  actions<span class="token punctuation">,</span>
  mutations<span class="token punctuation">,</span>
  state<span class="token punctuation">,</span>
  getters<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// main.js</span>
<span class="token keyword">import</span> store <span class="token keyword">from</span> <span class="token string">&#39;./store&#39;</span>

<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  store<span class="token punctuation">,</span>
  <span class="token function-variable function">render</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">h</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">h</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token function">beforeCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>$bus <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">$mount</span><span class="token punctuation">(</span><span class="token string">&quot;#app&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心属性" tabindex="-1"><a class="header-anchor" href="#核心属性" aria-hidden="true">#</a> 核心属性</h2><h3 id="state" tabindex="-1"><a class="header-anchor" href="#state" aria-hidden="true">#</a> state</h3><p>1.VueX 管理的状态对象</p><p>2.它应该是唯一的</p><p>3.示例代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> state <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">xxx</span><span class="token operator">:</span> initValue<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="actions" tabindex="-1"><a class="header-anchor" href="#actions" aria-hidden="true">#</a> actions</h3><p>1.值为一个对象，包含多个响应用户动作的回调函数</p><p>2.通过 commit() 来触发 mutation 中函数的调用，间接更新 state</p><p>3.如何触发 actions 中的回调</p><p>​ 在组件中使用 <code>$store.dispatch(&#39;对应的 action 回调名&#39;)</code>触发</p><p>4.可以包含异步代码（定时器，ajax）</p><p>5.示例代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> actions <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function">zzz</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> commit<span class="token punctuation">,</span> state <span class="token punctuation">}</span><span class="token punctuation">,</span> data1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&quot;yyy&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> data <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mutations" tabindex="-1"><a class="header-anchor" href="#mutations" aria-hidden="true">#</a> mutations</h3><p>1.值是一个对象，包含多个直接更新 state 的方法。</p><p>2.谁能调用 mutation 中的方法，如何调用？</p><p>在 action 中：commit(&quot;对应的 mutation 方法名&quot;)触发</p><p>3.mutations 中方法的特点：不能写异步代码、只能单纯操作 state</p><p>在组件仅进行简单操作时，可越过 actions 直接对 mutations 操作，<code>this.$store.commit(xxx)</code></p><p>4.示例代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> mutations <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function">yyy</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> <span class="token punctuation">{</span> data1 <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">//更新state某属性</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getters" tabindex="-1"><a class="header-anchor" href="#getters" aria-hidden="true">#</a> getters</h3><p>1.值为一个对象，包含多个用于返回数据的函数</p><p>2.如何使用？ <code>$store.getters.xxx</code></p><p>3.示例代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> getters <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function">mmm</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> state<span class="token punctuation">.</span>msg <span class="token operator">+</span> <span class="token string">&quot;!&quot;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="map-方法" tabindex="-1"><a class="header-anchor" href="#map-方法" aria-hidden="true">#</a> Map 方法</h2><h3 id="mapstate" tabindex="-1"><a class="header-anchor" href="#mapstate" aria-hidden="true">#</a> mapState</h3><p>映射 state 中的数据为计算属性。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> mapState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vuex&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">computed</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// 借助mapState生成计算属性：sum、school、subject（对象写法）</span>
    <span class="token operator">...</span><span class="token function">mapState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">sum</span><span class="token operator">:</span> <span class="token string">&quot;sum&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">school</span><span class="token operator">:</span> <span class="token string">&quot;school&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">subject</span><span class="token operator">:</span> <span class="token string">&quot;subject&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// 借助mapState生成计算属性：sum、school、subject（数组写法）</span>
    <span class="token operator">...</span><span class="token function">mapState</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&quot;sum&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;school&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;subject&quot;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mapgetters" tabindex="-1"><a class="header-anchor" href="#mapgetters" aria-hidden="true">#</a> mapGetters</h3><p>映射 getters 中的数据为计算属性。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> mapGetters <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vuex&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">computed</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// 借助mapGetters生成计算属性：bigSum（对象写法）</span>
    <span class="token operator">...</span><span class="token function">mapGetters</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">bigSum</span><span class="token operator">:</span> <span class="token string">&quot;bigSum&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// 借助mapGetters生成计算属性：bigSum（数组写法）</span>
    <span class="token operator">...</span><span class="token function">mapGetters</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&quot;bigSum&quot;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mapactions" tabindex="-1"><a class="header-anchor" href="#mapactions" aria-hidden="true">#</a> mapActions</h3><p>生成与 actions 对话的方法，即包含<code>$store.dispatch(xxx)</code>的函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> mapActions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vuex&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// 借助mapActions生成：incrementOdd、incrementWait（对象写法）</span>
    <span class="token operator">...</span><span class="token function">mapActions</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">incrementOdd</span><span class="token operator">:</span> <span class="token string">&quot;jiaOdd&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">incrementWait</span><span class="token operator">:</span> <span class="token string">&quot;jiaWait&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// 借助mapActions生成：jiaOdd、jiaWait（数组写法）</span>
    <span class="token operator">...</span><span class="token function">mapActions</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&quot;jiaOdd&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;jiaWait&quot;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mapmutations" tabindex="-1"><a class="header-anchor" href="#mapmutations" aria-hidden="true">#</a> mapMutations</h3><p>生成与 mutations 对话的方法，即包含<code>$store.commit(yyy)</code>的函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> mapMutations <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vuex&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// 借助mapMutations生成：increment、decrement（对象写法）</span>
    <span class="token operator">...</span><span class="token function">mapMutations</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">increment</span><span class="token operator">:</span> <span class="token string">&quot;JIA&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">decrement</span><span class="token operator">:</span> <span class="token string">&quot;JIAN&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// 借助mapMutations生成：JIA、JIAN（数组写法）</span>
    <span class="token operator">...</span><span class="token function">mapMutations</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&quot;JIA&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;JIAN&quot;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>备注：mapActions 与 mapMutations 使用时，若需要传递参数需要：在模板中绑定事件时传递好参数，否则参数是事件对象。</p><h2 id="module-命名空间" tabindex="-1"><a class="header-anchor" href="#module-命名空间" aria-hidden="true">#</a> module 命名空间</h2><ol><li>包含多个 module</li><li>一个 module 是一个 store 的配置对象</li><li>与一个组件（包含有共享数据）对应</li></ol><p>步骤：</p><p>1.修改 store.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> countAbout <span class="token operator">=</span> <span class="token punctuation">{</span>
	<span class="token literal-property property">namespaced</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>	<span class="token comment">//开启命名空间</span>
	<span class="token literal-property property">state</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token literal-property property">x</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token literal-property property">mutations</span><span class="token operator">:</span> <span class="token punctuation">{</span> …… <span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token literal-property property">actions</span><span class="token operator">:</span> <span class="token punctuation">{</span> …… <span class="token punctuation">}</span>，
	<span class="token literal-property property">getters</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    	<span class="token function">bigSum</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    		<span class="token keyword">return</span> state<span class="token punctuation">.</span>sum <span class="token operator">*</span> <span class="token number">10</span>
    	<span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> personAbout <span class="token operator">=</span> <span class="token punctuation">{</span>
	<span class="token literal-property property">namespaced</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
	state <span class="token operator">=</span> <span class="token punctuation">{</span> …… <span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token literal-property property">mutations</span><span class="token operator">:</span> <span class="token punctuation">{</span> …… <span class="token punctuation">}</span>，
	<span class="token literal-property property">actions</span><span class="token operator">:</span> <span class="token punctuation">{</span> …… <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vuex<span class="token punctuation">.</span>Store</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
	<span class="token literal-property property">modules</span><span class="token operator">:</span> <span class="token punctuation">{</span>
		countAbout<span class="token punctuation">,</span>
		personAbout
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.开启命名空间后，组件中读取 state 数据</p><p>方式一：直接读取</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span>state<span class="token punctuation">.</span>personAbout<span class="token punctuation">.</span>list<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>方式二：借助 mapState 读取</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">...</span><span class="token function">mapState</span><span class="token punctuation">(</span><span class="token string">&#39;countAbout&#39;</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token string">&#39;sum&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;school&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;subject&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>3.开启命名空间后，组件中读取 getters 数据</p><p>方式一：直接读取</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span>getters<span class="token punctuation">[</span><span class="token string">&quot;personAbout/firstPersonName&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>方式二：借助 mapGetters 读取</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">...</span><span class="token function">mapGetters</span><span class="token punctuation">(</span><span class="token string">&#39;countAbout&#39;</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token string">&#39;bigSum&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>4.开启命名空间后，组件中调用 dispatch</p><p>方式一：直接 dispatch</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">&quot;personAbout/addPersonWang&quot;</span><span class="token punctuation">,</span> person<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>方式二：借助 mapActions</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">...</span><span class="token function">mapActions</span><span class="token punctuation">(</span><span class="token string">&#39;countAbout&#39;</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token string">&#39;incrementOdd&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;incrementAsync&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>5.开启命名空间后，组件中调用 commit</p><p>方式一：直接 commit</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&quot;personAbout/ADD_PERSON&quot;</span><span class="token punctuation">,</span> person<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>方式二：借助 mapMutations</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">...</span><span class="token function">mapMutations</span><span class="token punctuation">(</span><span class="token string">&#39;countAbout&#39;</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token string">&#39;increment&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;decrement&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,75),o=[e];function c(i,u){return s(),a("div",null,o)}const d=n(p,[["render",c],["__file","10-vuex.html.vue"]]);export{d as default};
