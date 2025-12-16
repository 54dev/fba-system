// frontend/src/utils/time.js

// 转成 中国时间 +8 并格式化：YYYY-MM-DD HH:mm:ss
export function formatDateTimeCn(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  const str = d.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // 转成 2025-12-10 12:34:56
  return str.replace(/\//g, "-");
}
