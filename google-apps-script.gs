/**
 * Google Apps Script — 实验一数据自动收集
 * ===========================================
 * 将实验数据自动写入 Google Sheets
 *
 * 使用方法：
 * 1. 打开 Google Sheets，新建表格
 * 2. 扩展程序 → Apps Script → 粘贴此代码
 * 3. 部署 → 新部署 → 网页应用
 *    - 执行身份：自己
 *    - 访问权限：任何人
 * 4. 复制生成的 URL，填入 index.html 的 CONFIG.googleScriptUrl
 */

// 表头（需与实验导出格式一致）
var HEADERS = [
  '被试ID', '时间戳', '年龄', '性别', '年级', '专业',
  '日常视频时长_h', '日常倍速频率',
  'DGI总分', 'DGI食物', 'DGI身体', 'DGI社交', 'DGI金钱', 'DGI成就'
];

// 35道题目列
for (var t = 1; t <= 32; t++) HEADERS.push('DGI_' + t);

// 测谎题
HEADERS.push('测谎1_说谎', '测谎2_饮食自控', '测谎3_更难管住', '测谎4_认真度');

// 倍速指标 + 观看后问卷
HEADERS.push(
  '平均观看速度', '最终播放速度', '最高播放速度', '首次加速时间_s',
  '倍速调整次数', '高倍速停留比例', '总观看时长_s', '观看完成率',
  '视频兴趣', '视频难度', '主观理解度', '观看无聊感', '观看急躁感', '是否看过视频',
  '提交时间'
);

/**
 * 处理 POST 请求
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.parameter.data || e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 自动创建表头
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    // 提取数据行
    var m = data.speedMetrics || {};
    var dm = data.demographics || {};
    var dg = data.dgiScores || {};
    var pq = data.postQuestionnaire || {};
    var resp = (data.dgi || {}).responses || {};

    var row = [
      data.participantId || '', data.timestamp || '',
      dm.age || '', dm.gender || '', dm.grade || '', dm.major || '',
      dm.dailyVideoHours || '', dm.dailySpeedFreq || '',
      dg.total || '', dg.food || '', dg.physical || '', dg.social || '', dg.money || '', dg.achievement || ''
    ];

    for (var t = 1; t <= 32; t++) row.push(resp[t] !== undefined ? resp[t] : '');

    row.push(resp[101] !== undefined ? resp[101] : '');
    row.push(resp[102] !== undefined ? resp[102] : '');
    row.push(resp[103] !== undefined ? resp[103] : '');
    row.push(resp[104] !== undefined ? resp[104] : '');

    row.push(
      m.avgSpeed || '', m.finalSpeed || '', m.maxSpeed || '', m.firstAccelTime || '',
      m.adjustmentCount || '', m.highSpeedRatio || '', m.totalWatchTime || '', m.watchCompletionRate || '',
      pq.interest || '', pq.difficulty || '', pq.comprehension || '',
      pq.boredom || '', pq.impatience || '', pq.seenBefore || '',
      new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})
    );

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 处理 GET 请求（测试用）
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    sheet: SpreadsheetApp.getActiveSpreadsheet().getName(),
    rows: SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getLastRow() - 1 // 减去表头
  })).setMimeType(ContentService.MimeType.JSON);
}
