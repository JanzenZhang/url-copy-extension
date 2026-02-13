# URL Title Copier - Chrome 扩展插件

一个简单的 Chrome 扩展插件，通过快捷键复制网页标题和 URL。

## 功能特性

- ✅ 通过快捷键复制标题和 URL
- ✅ 支持多种复制格式
- ✅ 可自定义分隔符
- ✅ 页面内容复制时自动添加标题
- ✅ 提供快捷复制按钮
- ✅ 选项页面用于自定义设置

## 使用方法

### 快捷键复制（推荐）

在任意页面按下快捷键即可复制标题和 URL：
- **Windows/Linux**: `Ctrl + Shift + Y`
- **Mac**: `Command + Shift + Y`

### 页面内容复制

在网页内容区域按下 `Ctrl+C`（或 `Cmd+C`）时：
- 如果**没有选中文本**：自动复制 `网页标题 - URL`
- 如果**有选中文本**：只复制选中的文本（正常行为）

### 弹出窗口

点击扩展图标可以：
- 查看扩展状态
- 启用/禁用页面内容自动复制
- 立即复制当前页面
- 打开选项页面

## 支持的复制格式

1. **标题 - URL**（默认）：`Example Domain - https://example.com`
2. **URL - 标题**：`https://example.com - Example Domain`
3. **Markdown 链接**：`[Example Domain](https://example.com)`
4. **仅标题**：`Example Domain`

## 文件结构

```
url-title-copier/
├── manifest.json       # 扩展配置文件
├── content.js          # 内容脚本
├── background.js       # 后台服务脚本
├── popup.html          # 弹出窗口界面
├── popup.js            # 弹出窗口逻辑
├── options.html        # 选项页面
├── options.js          # 选项页面逻辑
├── icons/              # 图标目录
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # 说明文件
```

## 安装步骤

### 1. 打开 Chrome 扩展管理页面
在地址栏输入：`chrome://extensions/`

### 2. 启用开发者模式
点击右上角的 **"开发者模式"** 开关

### 3. 加载扩展
1. 点击左上角的 **"加载已解压的扩展程序"** 按钮
2. 选择 `url-title-copier` 文件夹
3. 扩展安装成功！

### 4. 测试快捷键
打开任意网页，按下 `Ctrl+Shift+Y`（或 `Command+Shift+Y`），然后粘贴测试！

## 选项页面

在选项页面中可以：
- 启用/禁用页面内容自动复制
- 选择复制格式
- 自定义分隔符
- 预览输出格式

## 注意事项

1. **快捷键冲突**：如果 `Ctrl+Shift+Y` 与其他软件冲突，可以在 `chrome://extensions/shortcuts` 中修改
2. **地址栏复制**：直接在地址栏复制时，只能复制 URL，无法获取标题（浏览器限制）
3. **选中文本优先**：在页面内容区域，如果有选中的文本，则只复制选中的文本
4. **兼容性**：支持 Chrome 88+（Manifest V3）

## 自定义快捷键

如果默认快捷键与其他软件冲突，可以自定义：

1. 打开 `chrome://extensions/shortcuts`
2. 找到 "URL Title Copier"
3. 点击快捷键旁边的输入框
4. 按下你想要的新快捷键

## 开发者信息

- 版本：1.1.0
- Manifest 版本：3
- 最低 Chrome 版本：88

## 更新日志

### v1.1.0
- 添加快捷键支持（Ctrl+Shift+C / Cmd+Shift+C）
- 支持从任意位置复制标题和 URL
- 优化弹出窗口界面

### v1.0.0
- 初始版本发布
- 支持基本复制功能
- 添加选项页面

## 许可证

MIT License
