import{_ as t}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as a,a as r}from"./app.7b75b111.js";const l={},d=r('<p>全称 Browser Object Model 浏览器对象模型</p><p>BOM 可以使我们通过 JS 来操作浏览器</p><p>在 BOM 中为我们提供了一组对象，用来完成对浏览器的操作</p><h2 id="bom-对象" tabindex="-1"><a class="header-anchor" href="#bom-对象" aria-hidden="true">#</a> BOM 对象</h2><h3 id="window" tabindex="-1"><a class="header-anchor" href="#window" aria-hidden="true">#</a> Window：</h3><p>整个浏览器的窗口，同时也是网页中的全局对象。</p><p>下面的 Navigator、Location 这些对象都属于 window 属性。</p><h4 id="事件" tabindex="-1"><a class="header-anchor" href="#事件" aria-hidden="true">#</a> 事件</h4><ol><li>onload</li></ol><p>window.onload 是窗口 (页面）加载事件，当文档内容完全加载完成会触发该事件(包括图像、脚本 文件、CSS 文件等)。</p><p>注意：</p><p>1.有了 window.onload ，就可以把 JS 代码写到页面元素的上方，因为 onload 是等页面内容全 部加载完毕，再去执行处理函数</p><p>2.window.onload 传统注册事件方式 只能写一次，如果有多个，会以最后一个 window.onload 为准</p><p>3.如果使用 addEventListener 则没有限制</p><br><ol start="2"><li>onresize</li></ol><p>window.onresize 是调整窗口大小加载事件, 当触发时就调用的处理函数。</p><p>1.只要窗口大小发生像素变化，就会触发这个事件</p><p>2.经常利用这个事件完成响应式布局</p><p>3.window.innerWidth：获取当前屏幕的宽度</p><h4 id="方法" tabindex="-1"><a class="header-anchor" href="#方法" aria-hidden="true">#</a> 方法</h4><ol><li>open()</li></ol><p>打开新窗口</p><p>语法：</p><p>window.open(URL,name,parameters)</p><p>URL 为子窗口页面地址</p><p>name 为子窗口句柄</p><p>parameters 为窗口参数(各参数用逗号分隔)</p><br><ol start="2"><li>close()</li></ol><p>close() 方法用于关闭浏览器窗口。</p><br><ol start="3"><li><strong>setInterval()</strong></li></ol><p>按照指定的周期（以毫秒计）来调用函数或计算表达式。</p><p>参数：</p><p>1.回调函数，该函数每隔一段时间被调用一次。</p><p>2.每次调用间隔的时间，单位毫秒。</p><p>返回值：一个 Number 类型的数据。数字用来作为定时器的唯一标识。</p><br><ol start="4"><li>clearInterval()</li></ol><p>关闭一个定时器</p><p>方法中需要一个定时器的标识作为参数，这样将关闭标识对应定时器。</p><p>clearInterval()可以接收任意参数，如果参数标识有效，则停止对应定时器。</p><p>如果参数无效，则不执行。</p><br><ol start="5"><li>setTimeout()</li></ol><p>延时调用一个函数，不马上执行，而是隔一段时间以后再执行。</p><p>与定时调用区别：定时调用执行多次，延时调用只执行一次。</p><h3 id="navigator" tabindex="-1"><a class="header-anchor" href="#navigator" aria-hidden="true">#</a> Navigator</h3><p>当前浏览器的信息，通过该对象可以识别不同浏览器。由于历史原因，Navigator 对象中大部分属性已经不能帮助识别浏览器了。</p><p>一般只会使用 userAgent（字符串）来判断浏览器信息</p><p>userAgent：包含浏览器信息内容，不同浏览器内容不同。</p><p>IE11 已去除微软和 IE 相关标识，现在也不能通过 userAgent 识别浏览器是否为 IE 了。</p><p>现在常通过一些浏览器中特有对象，判断浏览器信息。</p><p>比如：ActiveXObject</p><h3 id="location" tabindex="-1"><a class="header-anchor" href="#location" aria-hidden="true">#</a> Location：</h3><p>当前浏览器的地址栏信息。通过它可以获取地址栏信息，操作浏览器跳转页面。</p><p>直接打印 location：获取到地址栏信息（当前页面的完整路径）。</p><p>修改 location 为完整路径 or 相对路径，会自动跳转到该路径，并且生成相应历史记录。</p><table><thead><tr><th style="text-align:left;">属性</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:left;">hash</td><td style="text-align:left;">设置或返回从井号（#）开始的 URL（锚）</td></tr><tr><td style="text-align:left;">host</td><td style="text-align:left;">设置或返回主机名和当前 URL 的端口号</td></tr><tr><td style="text-align:left;">hostname</td><td style="text-align:left;">设置或返回当前 URL 的主机名</td></tr><tr><td style="text-align:left;">href</td><td style="text-align:left;">设置或返回完整的 URL</td></tr><tr><td style="text-align:left;">pathname</td><td style="text-align:left;">设置或返回当前 URL 的路径部分</td></tr><tr><td style="text-align:left;">port</td><td style="text-align:left;">设置或返回当前 URL 的端口号</td></tr><tr><td style="text-align:left;">protocol</td><td style="text-align:left;">设置或返回当前 URL 的协议</td></tr><tr><td style="text-align:left;">search</td><td style="text-align:left;">设置或返回从问号（?）开始的 URL（查询部分）</td></tr></tbody></table><table><thead><tr><th style="text-align:left;">属性</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:left;">assign()</td><td style="text-align:left;">跳转到其他页面，作用和直接修改 location 一样</td></tr><tr><td style="text-align:left;">reload()</td><td style="text-align:left;">重新加载当前页面，作用和刷新一样。方法中传递 true，强制清空缓存刷新页面</td></tr><tr><td style="text-align:left;">replace()</td><td style="text-align:left;">使用一个新的页面替换当前页面，调用完毕后跳转页面。不会生成历史记录，不能使用回退按钮</td></tr></tbody></table><h4 id="从输入-url-到页面加载的全过程" tabindex="-1"><a class="header-anchor" href="#从输入-url-到页面加载的全过程" aria-hidden="true">#</a> 从输入 URL 到页面加载的全过程</h4><p>1.DNS 域名解析</p><p>2.建立 TCP 连接</p><p>3.发送 HTTP 请求</p><p>4.服务器返回响应结果（处理请求并返回 HTTP 报文）</p><p>5.浏览器解析 THML</p><p>6.浏览器渲染页面</p><p>7.连接结束</p><h3 id="history" tabindex="-1"><a class="header-anchor" href="#history" aria-hidden="true">#</a> History</h3><p>浏览器的历史记录，可以通过该对象操作浏览器的历史记录。由于隐私原因，该对象不能获取到具体历史记录，只能操作浏览器向前 or 向后翻页。而且该操作只在当次访问时有效。</p><table><thead><tr><th style="text-align:left;">属性</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:left;">length</td><td style="text-align:left;">返回浏览器历史列表中的 URL 数量</td></tr></tbody></table><table><thead><tr><th style="text-align:left;">方法</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:left;">back()</td><td style="text-align:left;">加载 history 列表中的前一个 URL</td></tr><tr><td style="text-align:left;">forward()</td><td style="text-align:left;">加载 history 列表中的下一个 URL</td></tr><tr><td style="text-align:left;">go()</td><td style="text-align:left;">加载 history 列表中的某个具体页面</td></tr></tbody></table><p>go()</p><p>跳转到指定页面</p><p>需要一个整数作为参数：</p><p>1：向前跳转1个页面 等于forward()</p><p>2：向前跳转2个页面</p><p>-1：向后跳转一个页面 等于back()</p><p>-2：向后跳转2个页面</p><h3 id="screen" tabindex="-1"><a class="header-anchor" href="#screen" aria-hidden="true">#</a> Screen：</h3><p>用户的屏幕信息，可获取到用户的显示器相关信息。（用的较少）。</p><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>这些BOM对象在浏览器中都是作为window对象的属性保存的，可以通过window对象来使用，也可以直接使用。</p><h2 id="定时器应用" tabindex="-1"><a class="header-anchor" href="#定时器应用" aria-hidden="true">#</a> 定时器应用</h2><h3 id="思想" tabindex="-1"><a class="header-anchor" href="#思想" aria-hidden="true">#</a> 思想</h3><p>定时器设置，通过启动/停止事件给定时器设置关键值，用于启动和停止定时器。</p><p>定时器放置于事件中的时候，由于事件不断调用导致定时器叠加，所以每次定时器函数调用时必须先清除定时器再向下执行。</p><h3 id="设置" tabindex="-1"><a class="header-anchor" href="#设置" aria-hidden="true">#</a> 设置</h3><p>定义一个变量timer，用来保存定时器标识。</p><p>参数：</p><p>obj，执行动画的对象。</p><p>attr：要执行动画的样式，比如：left top width height</p><p>target：执行动画的目标位置。</p><p>speed，移动速度。</p><p>判断speed正负值，如果从左向右移，speed为正；如果从右向左移，speed为负。</p><p>回调函数，这个函数将会在动画执行完毕之后执行。</p><h3 id="两个及以上元素调用同一个定时器响应函数" tabindex="-1"><a class="header-anchor" href="#两个及以上元素调用同一个定时器响应函数" aria-hidden="true">#</a> 两个及以上元素调用同一个定时器响应函数</h3><p>无法调用同一个timer变量，因为后一个元素触发响应时总会清除前一个timer定时器。</p><p>需要给对象添加obj.timer属性，对象自己保存自己的定时器标识。</p><h2 id="执行机制" tabindex="-1"><a class="header-anchor" href="#执行机制" aria-hidden="true">#</a> 执行机制</h2><h3 id="js是单线程" tabindex="-1"><a class="header-anchor" href="#js是单线程" aria-hidden="true">#</a> JS是单线程</h3><p>单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务，这样所导致的问题 是：如果 JS 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。</p><h3 id="同步和异步" tabindex="-1"><a class="header-anchor" href="#同步和异步" aria-hidden="true">#</a> 同步和异步</h3><p>同步任务：都在主线程上执行，形成一个执行栈。</p><p>异步任务：JS 的异步是通过回调函数实现的，异步任务相关回调函数添加到任务队列中（任务队列也称为消息队列）,一般而言，异步任务有以下三种类型：</p><p>1.普通事件，如 click、resize 等</p><p>2.资源加载，如 load、error 等</p><p>3.定时器，包括 setInterval、setTimeout 等</p><p>为了解决这个问题，JS 的设计者将这种耗时很长的任务先挂起，并添加到一个叫做任务队列 的处理机制中，等到其他任务执行完毕后，才会来执行它，这种任务叫做异步任务，而其他先被执 行的任务叫做同步任务。</p><p>异步任务必须指定<strong>回调函数</strong>，当主线程开始执行异步任务，就是执行对应的回调函数</p><p>3.执行流程</p><p>1.先执行执行栈中的同步任务</p><p>2.异步任务（回调函数）放入任务队列中</p><p>3.一旦执行栈中的所有同步任务执行完毕，系统就会按次序读取任务队列中的异步任务，于是被 读取的异步任务结束等待状态，进入执行栈，开始执行</p><p>由于主线程不断的重复获得任务、执行任务、再获取任务、再执行，所以这种机制被称为事件循环</p>',116),p=[d];function i(n,h){return e(),a("div",null,p)}const c=t(l,[["render",i],["__file","BOM.html.vue"]]);export{c as default};
