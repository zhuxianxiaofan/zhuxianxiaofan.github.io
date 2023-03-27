const l=JSON.parse('{"key":"v-3f7e24fc","path":"/base/javascript/%E9%AB%98%E9%98%B6%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1.html","title":"高阶面向对象","lang":"zh-CN","frontmatter":{"title":"高阶面向对象","order":7,"category":[],"tag":["Javascript高阶","Class","闭包","原型链"],"description":"值类型和引用类型 判断方式 typeof 判断值类型 instanceof 判断引用类型 存储机制 基本数据类型存放于栈内存。在 JS 中用于在编译器和内存中保存变量、方法调用。 引用类型存放于堆内存。它的赋值是堆内存地址的引用（指针）， 所以两个变量指向的还是同一个对象，对任何一个的操作都会相互的影响。（浅拷贝概念）。 实例对象创建方法 1.new ...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/base/javascript/%E9%AB%98%E9%98%B6%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1.html"}],["meta",{"property":"og:site_name","content":"高峰的前端笔记"}],["meta",{"property":"og:title","content":"高阶面向对象"}],["meta",{"property":"og:description","content":"值类型和引用类型 判断方式 typeof 判断值类型 instanceof 判断引用类型 存储机制 基本数据类型存放于栈内存。在 JS 中用于在编译器和内存中保存变量、方法调用。 引用类型存放于堆内存。它的赋值是堆内存地址的引用（指针）， 所以两个变量指向的还是同一个对象，对任何一个的操作都会相互的影响。（浅拷贝概念）。 实例对象创建方法 1.new ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2023-03-24T06:28:40.000Z"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:tag","content":"Javascript高阶"}],["meta",{"property":"article:tag","content":"Class"}],["meta",{"property":"article:tag","content":"闭包"}],["meta",{"property":"article:tag","content":"原型链"}],["meta",{"property":"article:modified_time","content":"2023-03-24T06:28:40.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"值类型和引用类型","slug":"值类型和引用类型","link":"#值类型和引用类型","children":[{"level":3,"title":"判断方式","slug":"判断方式","link":"#判断方式","children":[]},{"level":3,"title":"存储机制","slug":"存储机制","link":"#存储机制","children":[]},{"level":3,"title":"实例对象创建方法","slug":"实例对象创建方法","link":"#实例对象创建方法","children":[]},{"level":3,"title":"代码块解析","slug":"代码块解析","link":"#代码块解析","children":[]},{"level":3,"title":"静态方法","slug":"静态方法","link":"#静态方法","children":[]},{"level":3,"title":"实例方法","slug":"实例方法","link":"#实例方法","children":[]},{"level":3,"title":"数据类型转换","slug":"数据类型转换","link":"#数据类型转换","children":[]},{"level":3,"title":"基本包装类型","slug":"基本包装类型","link":"#基本包装类型","children":[]}]},{"level":2,"title":"执行机制分析","slug":"执行机制分析","link":"#执行机制分析","children":[{"level":3,"title":"语法分析","slug":"语法分析","link":"#语法分析","children":[]},{"level":3,"title":"预编译阶段","slug":"预编译阶段","link":"#预编译阶段","children":[]},{"level":3,"title":"执行阶段","slug":"执行阶段","link":"#执行阶段","children":[]}]},{"level":2,"title":"Class 类","slug":"class-类","link":"#class-类","children":[{"level":3,"title":"继承","slug":"继承","link":"#继承","children":[]},{"level":3,"title":"本质","slug":"本质","link":"#本质","children":[]}]},{"level":2,"title":"构造函数","slug":"构造函数","link":"#构造函数","children":[{"level":3,"title":"实例成员和静态成员","slug":"实例成员和静态成员","link":"#实例成员和静态成员","children":[]},{"level":3,"title":"构造函数原型 prototype","slug":"构造函数原型-prototype","link":"#构造函数原型-prototype","children":[]},{"level":3,"title":"对象原型 __proto__","slug":"对象原型-proto","link":"#对象原型-proto","children":[]},{"level":3,"title":"constructor 构造函数","slug":"constructor-构造函数","link":"#constructor-构造函数","children":[]},{"level":3,"title":"原型链（重要）","slug":"原型链-重要","link":"#原型链-重要","children":[]},{"level":3,"title":"成员查找规则","slug":"成员查找规则","link":"#成员查找规则","children":[]},{"level":3,"title":"扩展内置对象须知","slug":"扩展内置对象须知","link":"#扩展内置对象须知","children":[]}]},{"level":2,"title":"函数进阶","slug":"函数进阶","link":"#函数进阶","children":[{"level":3,"title":"调用方式","slug":"调用方式","link":"#调用方式","children":[]},{"level":3,"title":"this 指向（重要）","slug":"this-指向-重要","link":"#this-指向-重要","children":[]},{"level":3,"title":"改变 this 指向","slug":"改变-this-指向","link":"#改变-this-指向","children":[]}]},{"level":2,"title":"严格模式","slug":"严格模式","link":"#严格模式","children":[{"level":3,"title":"开启严格模式","slug":"开启严格模式","link":"#开启严格模式","children":[]},{"level":3,"title":"严格模式简要规则","slug":"严格模式简要规则","link":"#严格模式简要规则","children":[]}]},{"level":2,"title":"闭包（重要）","slug":"闭包-重要","link":"#闭包-重要","children":[{"level":3,"title":"定义","slug":"定义","link":"#定义","children":[]},{"level":3,"title":"作用","slug":"作用","link":"#作用","children":[]}]},{"level":2,"title":"递归","slug":"递归","link":"#递归","children":[]},{"level":2,"title":"对象拷贝","slug":"对象拷贝","link":"#对象拷贝","children":[{"level":3,"title":"浅拷贝（单层）","slug":"浅拷贝-单层","link":"#浅拷贝-单层","children":[]},{"level":3,"title":"深拷贝","slug":"深拷贝","link":"#深拷贝","children":[]}]}],"git":{"createdTime":1679639320000,"updatedTime":1679639320000,"contributors":[{"name":"高峰","email":"1326733085@qq.com","commits":1}]},"readingTime":{"minutes":29.53,"words":8860},"autoDesc":true,"filePathRelative":"base/javascript/高阶面向对象.md","localizedDate":"2023年3月24日"}');export{l as data};
