// URL Title Copier - Popup Script
// 处理弹出窗口的逻辑

// DOM 元素
const autoEnableEl = document.getElementById('auto-enable');
const copyNowBtn = document.getElementById('copy-now');
const openSettingsBtn = document.getElementById('open-settings');
const previewTextEl = document.getElementById('preview-text');

// 加载设置
function loadSettings() {
  return StorageUtils.get({
    format: 'title-url',
    separator: ' - ',
    autoEnable: true
  });
}

// 更新 UI 状态
function updateUI(settings) {
  // 更新开关状态
  if (autoEnableEl) {
    autoEnableEl.checked = settings.autoEnable;
  }
  
  // 更新预览
  updatePreview(settings);
}

// 更新预览
function updatePreview(settings) {
  const formatLabels = {
    'title-url': '标题 - URL',
    'url-title': 'URL - 标题',
    'markdown': '[标题](URL)',
    'title': '仅标题'
  };
  if (previewTextEl) {
    previewTextEl.textContent = formatLabels[settings.format] || settings.format;
  }
}

// 初始化
async function init() {
  const settings = await loadSettings();
  updateUI(settings);
}

// 监听自动启用开关变化
if (autoEnableEl) {
  autoEnableEl.addEventListener('change', async () => {
    const settings = await loadSettings();
    settings.autoEnable = autoEnableEl.checked;

    StorageUtils.set(settings).then(() => {
      updateUI(settings);
    });
  });
}

// 立即复制当前页面
if (copyNowBtn) {
  copyNowBtn.addEventListener('click', async () => {
    try {
      // 检查 chrome.tabs API 是否可用
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        showCopyError('开发环境无法获取标签页');
        return;
      }

      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab) {
        showCopyError('无法获取当前标签页');
        return;
      }

      // 使用 scripting API 直接注入脚本获取页面信息
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
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
        const formattedContent = formatContent(title, url, settings);

        // 写入剪贴板
        await navigator.clipboard.writeText(formattedContent);

        // 显示成功状态
        showCopySuccess();
      } else {
        showCopyError('无法获取页面信息');
      }
    } catch (error) {
      console.error('复制失败:', error);
      showCopyError('复制失败: ' + error.message);
    }
  });
}

// 格式化内容
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

// 显示复制成功
function showCopySuccess() {
  const originalText = copyNowBtn.textContent;
  copyNowBtn.textContent = '已复制';
  copyNowBtn.classList.add('success');

  setTimeout(() => {
    copyNowBtn.textContent = '立即复制当前页面';
    copyNowBtn.classList.remove('success');
  }, 2000);
}

// 显示复制失败
function showCopyError(message) {
  copyNowBtn.textContent = '复制失败';
  copyNowBtn.classList.add('error');

  setTimeout(() => {
    copyNowBtn.textContent = '立即复制当前页面';
    copyNowBtn.classList.remove('error');
  }, 2000);

  // Optional: show a toast or simplified alert
  // alert(message); // Removed alert for cleaner UI, button state is enough
}

// 打开设置页面
if (openSettingsBtn) {
  openSettingsBtn.addEventListener('click', () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html');
    }
  });
}

// 初始化
init();
