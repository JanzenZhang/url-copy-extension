// URL Title Copier - Content Script
// 监听用户的复制操作，自动将 URL 和标题一起复制

let lastCopiedText = '';
let lastCopiedTime = 0;

// 加载用户设置
function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      format: 'title-url',
      separator: ' - ',
      autoEnable: true
    }, resolve);
  });
}

// 格式化复制内容
function formatCopyContent(title, url, settings) {
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

// 监听复制事件
document.addEventListener('copy', async (event) => {
  try {
    const settings = await loadSettings();

    // 如果用户禁用了自动复制，则不处理
    if (!settings.autoEnable) {
      return;
    }

    // 获取选中的文本（如果有）
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // 如果用户有选中文本，则不处理（用户可能是想复制选中的内容）
    if (selectedText.length > 0) {
      return;
    }

    // �防止重复处理同一个复制操作
    const currentTime = Date.now();
    if (currentTime - lastCopiedTime < 100) {
      return;
    }

    // 获取当前页面的标题和 URL
    const title = document.title || '';
    const url = window.location.href;

    // 格式化内容
    const formattedContent = formatCopyContent(title, url, settings);

    // 写入剪贴板
    await navigator.clipboard.writeText(formattedContent);

    // 更新最后复制时间和内容
    lastCopiedTime = currentTime;
    lastCopiedText = formattedContent;

    // 阻止默认的复制行为（因为我们已经写入了新的内容）
    event.preventDefault();

    // 在控制台输出（可选，用于调试）
    console.log('[URL Title Copier] 已复制:', formattedContent);

  } catch (error) {
    console.error('[URL Title Copier] 错误:', error);
  }
});

// 监听来自 background 或 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentPageInfo') {
    sendResponse({
      title: document.title || '',
      url: window.location.href
    });
  }
});

// 页面加载完成后通知 background
chrome.runtime.sendMessage({
  action: 'contentScriptLoaded',
  url: window.location.href
});
