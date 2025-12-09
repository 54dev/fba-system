// src/utils/time.js

export function formatDateTimeCn(isoString) {
  if (!isoString) return "";

  const d = new Date(isoString);
  // 转成 UTC 毫秒
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  // 加 8 小时（东八区）
  const cn = new Date(utc + 8 * 60 * 60 * 1000);

  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

  const Y = cn.getFullYear();
  const M = pad(cn.getMonth() + 1);
  const D = pad(cn.getDate());
  const h = pad(cn.getHours());
  const m = pad(cn.getMinutes());
  const s = pad(cn.getSeconds());

  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}
