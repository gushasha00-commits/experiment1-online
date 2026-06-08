# 实验一 线上版（GitHub Pages）

**特质延迟满足对自由倍速选择的预测作用** — 线上远程实验

🌐 **实验链接**：`https://gushasha00-commits.github.io/experiment1-online/`

## 被试操作流程

1. 打开实验链接
2. 阅读知情同意 → 填写基本信息 → 完成DGI问卷 → 休息1分钟 → 观看视频 → 填写观后问卷
3. 实验结束后**下载数据文件（.xlsx）**，发送给研究者

全程约 **15 分钟**，建议使用 Chrome/Edge 浏览器。

## 研究者部署说明

### 1. 配置视频 URL

编辑 `index.html` 顶部 CONFIG：

```javascript
var CONFIG = {
  videoUrl: '你的视频URL',  // 修改此处
  googleScriptUrl: ''       // 可选：Google Sheets 自动收集
};
```

**视频托管方案（免费）：**
- **GitHub Releases**：上传视频到本仓库 Release，获取下载直链
- 其他：阿里云OSS、腾讯云COS、七牛云等

### 2. （可选）自动收集数据到 Google Sheets

1. 打开 [Google Sheets](https://sheets.google.com)，新建表格
2. 点击 `扩展程序` → `Apps Script`
3. 粘贴 `google-apps-script.gs` 中的代码
4. 点击 `部署` → `新部署` → `网页应用` → `部署`
5. 复制生成的 URL，填入 CONFIG 的 `googleScriptUrl`

### 3. 启用 GitHub Pages

`Settings` → `Pages` → Source: `main` branch → Save

### 4. 上传视频

`Releases` → `Create a new release` → 上传视频文件 → 复制下载链接 → 更新 CONFIG.videoUrl

## 本地开发

直接双击 `index.html` 即可在浏览器中测试（需本地有 video.mp4）。

## 数据格式

导出的 .xlsx 文件包含：
- 基本信息（年龄、性别、年级、专业等）
- DGI 量表 32 题原始作答 + 4 道测谎题
- DGI 总分及5维度得分
- 倍速行为指标（平均速度、最终速度、最高速度、调整次数等）
- 观看后问卷（兴趣、难度、理解度、无聊感、急躁感）
