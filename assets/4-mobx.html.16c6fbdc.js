const e=JSON.parse('{"key":"v-22ea0c44","path":"/react/13-react%E7%94%9F%E6%80%81/4-mobx.html","title":"Mobx","lang":"zh-CN","frontmatter":{"title":"Mobx","order":4,"category":[],"tag":["全局状态管理","Mobx"],"description":"介绍 原则：任何源自应用状态的东西都应该自动地获得 mobx 利用 getter 和 setter 收集组件的数据依赖关系，从而在数据发生变化时精确锁定组件，使界面更新粒度更加精细 其核心思想实际就是利用了Object.defineProperty和`Proxy实现依赖收集与更新 mobx流程 与 redux 的区别 1. mobx 写法更偏向 OOP...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/react/13-react%E7%94%9F%E6%80%81/4-mobx.html"}],["meta",{"property":"og:site_name","content":"高峰的前端笔记"}],["meta",{"property":"og:title","content":"Mobx"}],["meta",{"property":"og:description","content":"介绍 原则：任何源自应用状态的东西都应该自动地获得 mobx 利用 getter 和 setter 收集组件的数据依赖关系，从而在数据发生变化时精确锁定组件，使界面更新粒度更加精细 其核心思想实际就是利用了Object.defineProperty和`Proxy实现依赖收集与更新 mobx流程 与 redux 的区别 1. mobx 写法更偏向 OOP..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2023-03-24T06:28:40.000Z"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:tag","content":"全局状态管理"}],["meta",{"property":"article:tag","content":"Mobx"}],["meta",{"property":"article:modified_time","content":"2023-03-24T06:28:40.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"介绍","slug":"介绍","link":"#介绍","children":[]},{"level":2,"title":"与 redux 的区别","slug":"与-redux-的区别","link":"#与-redux-的区别","children":[]},{"level":2,"title":"基本用法","slug":"基本用法","link":"#基本用法","children":[{"level":3,"title":"state","slug":"state","link":"#state","children":[]},{"level":3,"title":"computed","slug":"computed","link":"#computed","children":[]},{"level":3,"title":"reactions","slug":"reactions","link":"#reactions","children":[]},{"level":3,"title":"actions","slug":"actions","link":"#actions","children":[]},{"level":3,"title":"异步 actions","slug":"异步-actions","link":"#异步-actions","children":[]}]},{"level":2,"title":"加入装饰器","slug":"加入装饰器","link":"#加入装饰器","children":[]},{"level":2,"title":"在类组件中使用","slug":"在类组件中使用","link":"#在类组件中使用","children":[{"level":3,"title":"store","slug":"store","link":"#store","children":[]},{"level":3,"title":"入口文件","slug":"入口文件","link":"#入口文件","children":[]},{"level":3,"title":"视图组件","slug":"视图组件","link":"#视图组件","children":[]}]},{"level":2,"title":"在函数组件中使用","slug":"在函数组件中使用","link":"#在函数组件中使用","children":[{"level":3,"title":"store","slug":"store-1","link":"#store-1","children":[]},{"level":3,"title":"context","slug":"context","link":"#context","children":[]},{"level":3,"title":"useContext","slug":"usecontext","link":"#usecontext","children":[]}]}],"git":{"createdTime":1679639320000,"updatedTime":1679639320000,"contributors":[{"name":"高峰","email":"1326733085@qq.com","commits":1}]},"readingTime":{"minutes":2.1,"words":629},"autoDesc":true,"filePathRelative":"react/13-react生态/4-mobx.md","localizedDate":"2023年3月24日"}');export{e as data};
