# Change Log

All notable changes to the "masm-tasm" extension will be documented in this file.

## 目标

- [ ] 搞一个好看的logo
- [ ] 问题匹配功能完善
  - [ ] 在标注错误位置的时候，更加智能地显示
- [ ] hover的简单实现
  - [ ] 主要中断的hover
- [ ] 提供tasks来实现调试工作
- [ ] bug：每次一开始启动的时候需要点击两次,第一次不起作用
- [ ] LSP和DAP支持（目前对我来说太难了）

### 0.0.10

增加对带空格路径的优化，完善文档以及readme，修复某一次修改引起的masm错误信息显示不全的问题

### 0.0.8/0.0.9

- [x] (0.0.8)diagnose 精准显示（目前是从非空格行首显示到分号处（或行末尾），还需要完善）
- [x] (0.0.9)TASM中宏语法的错误，将宏中错误的地方也显示出来

实现diagnose问题信息的相对精准地显示，提供一个命令，打开命令面板之后可以使用“清除MASM/TASM的所有问题信息”清除diagnose信息。

### 0.0.5/0.0.6/0.0.7

增加一个auto模式，在汇编链接时调用msdos-player，（比较安静）在运行时使用dosbox，在使用TASM TD调试时使用dosbox（msdos会显示异常），在使用masm debug的时候使用msdos，这样直接在终端中显示会比较舒服。（变动有点大，可能会不稳定，欢迎issue和PR呀,估计最近几个版本都是修bug了）

1. 0.0.6：修复检测错误不全的问题，应该没有大问题了
2. 0.0.7: 修复dosbox中调用失灵的问题

- [x] 增加问题匹配功能，*已经可以提供一个简单的匹配功能了*
- [x] 在运行和调试之前先diagnose，即mixed模块

### 0.0.2/0.0.3/0.0.4

1. 0.0.2使用batch来简化msdos的调用，将需要的工具和插件一起打包，（基本失去支持除了windows系统以外系统的可能）。
2. 0.0.3修复了一个terminal.sendtext 传递的内容被吞掉了开头的一个字符的问题，简单地增加了一些空格，并没有根除问题。
3. 0.0.4使用child_process来替换掉一些vscode.terminal 应该解决了0.0.2中发现的问题了

- [ ] 实现根据情况自动下载相关组件 *废弃,已经直接打包在插件里面了*

### 0.0.1

初步完成一些对dosbox和msdos的简单调用还显得不是很完善

- [x] 实现在msdos之下运行调试MASM程序，运行TASM程序
- [x] 实现Dosbox来进行相关功能调用

### [Unreleased]

---nothing---
