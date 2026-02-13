// URL Title Copier - Options Script
// 处理选项页面的逻辑

// DOM 元素
const autoEnableEl = document.getElementById('auto-enable');
const formatEl = document.getElementById('format');
const separatorEl = document.getElementById('separator');
const previewContentEl = document.getElementById('preview-content');
const saveBtn = document.getElementById('save');
const resetBtn = document.getElementById('reset');
const saveMessageEl = document.getElementById('save-message');

// 默认设置
const defaultSettings = {
  format: 'title-url',
  separator: ' - ',
  autoEnable: true
};

// 示例数据用于预览
const exampleTitle = 'Example Domain';
const exampleUrl = 'https://example.com';

// 加载设置
function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaultSettings, resolve);
  });
}

// 更新 UI
function updateUI(settings) {
  autoEnableEl.checked = settings.autoEnable;
  formatEl.value = settings.format;
  separatorEl.value = settings.separator;
  updatePreview(settings);
}

// 更新预览
function updatePreview(settings) {
  const content = formatContent(exampleTitle, exampleUrl, settings);
  previewContentEl.textContent = content;
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

// 保存设置
function saveSettings() {
  const settings = {
    autoEnable: autoEnableEl.checked,
    format: formatEl.value,
    separator: separatorEl.value || ' - '
  };

  chrome.storage.sync.set(settings, () => {
    // 显示保存成功消息
    saveMessageEl.classList.add('show');
    setTimeout(() => {
      saveMessageEl.classList.remove('show');
    }, 2000);

    updatePreview(settings);
  });
}

// 恢复默认设置
function resetSettings() {
  if (confirm('确定要恢复默认设置吗？')) {
    chrome.storage.sync.set(defaultSettings, () => {
      updateUI(defaultSettings);
      saveMessageEl.classList.add('show');
      setTimeout(() => {
        saveMessageEl.classList.remove('show');
      }, 2000);
    });
  }
}

// 事件监听
saveBtn.addEventListener('click', saveSettings);
resetBtn.addEventListener('click', resetSettings);

// 实时更新预览
formatEl.addEventListener('change', async () => {
  const settings = await loadSettings();
  settings.format = formatEl.value;
  updatePreview(settings);
});

separatorEl.addEventListener('input', async () => {
  const settings = await loadSettings();
  settings.separator = separatorEl.value;
  updatePreview(settings);
});

// 初始化
async function init() {
  const settings = await loadSettings();
  updateUI(settings);
}

init();
