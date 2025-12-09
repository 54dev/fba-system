// src/utils/time.js

function pad(num) {
  return String(num).padStart(2, "0");
}

/**
 * 把 ISO 时间（后端返回）格式化为中国时间 +8
 * 格式：YYYY-MM-DD HH:mm:ss
 */
export function formatDateTimeCn(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  // 转为 UTC，再加 8 小时
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const china = new Date(utc + 8 * 60 * 60 * 1000);

  const y = china.getFullYear();
  const m = pad(china.getMonth() + 1);
  const d = pad(china.getDate());
  const hh = pad(china.getHours());
  const mm = pad(china.getMinutes());
  const ss = pad(china.getSeconds());

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}
