// URL Title Copier - Background Service Worker
// 处理扩展的后台逻辑和快捷键

// 获取当前格式化内容
function formatContent(title, url, settings) {
  switch (settings.format) {
    case 'title-url':
      return `${title}${settings.separator}${url}`;
    case 'url-title':
      return `${url}${settings.separator}${title}`;
    case 'markdown':
      return `[${title}](${url})`;
    case 'title':
      return title;
    default:
      return `${title}${settings.separator}${url}`;
  }
}

// 加载设置
function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      format: 'title-url',
      separator: ' - ',
      autoEnable: true
    }, resolve);
  });
}

// 复制当前标签页的标题和 URL
async function copyWithTitle(tabId) {
  try {
    // 注入脚本获取页面标题
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        return {
          title: document.title,
          url: window.location.href
        };
      }
    });

    if (results && results[0] && results[0].result) {
      const { title, url } = results[0].result;
      const settings = await loadSettings();

      // 格式化内容
      const content = formatContent(title, url, settings);

      // 写入剪贴板
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (text) => {
          navigator.clipboard.writeText(text);
        },
        args: [content]
      });

      console.log('[URL Title Copier] 已复制:', content);
      return true;
    }
  } catch (error) {
    console.error('[URL Title Copier] 复制失败:', error);
  }
  return false;
}

// 安装时的事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[URL Title Copier] 扩展已安装');

    // 设置默认配置
    chrome.storage.sync.set({
      format: 'title-url',
      separator: ' - ',
      autoEnable: true
    });
  } else if (details.reason === 'update') {
    console.log('[URL Title Copier] 扩展已更新');
  }
});

// 监听快捷键命令
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === 'copy-with-title' && tab) {
    await copyWithTitle(tab.id);
  }
});

// 监听来自 content script 或 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'contentScriptLoaded') {
    console.log('[URL Title Copier] Content script 已加载:', request.url);
  }
});

// 监听扩展图标点击事件
chrome.action.onClicked.addListener(async (tab) => {
  if (tab) {
    await copyWithTitle(tab.id);
  }
});
