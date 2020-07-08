// 驼峰转换下划线
const toLine = (name) => {
  const r = name.replace(/([A-Z])/g, '_$1').toLowerCase();
  if (r.startsWith('_')) {
    return r.slice(1);
  }
  return r;
};

// 解析golang tags
const parseTags = (originTags) => {
  return originTags.split().map((b) => {
    const r = b.replace('(', ':').replace(')', '').split(':');
    return {
      'key': r[0],
      'v': r[1],
      'value': toLine(r[1]),
    };
  });
};

export default {
  toLine,
  parseTags,
};
