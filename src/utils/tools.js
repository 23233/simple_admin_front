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
  if (originTags) {
    return originTags.split(' ').map((b) => {
      if (b.indexOf('(') >= 0) {
        b = b.replace(/\(/g, ':').replace(/\)/g, '');
      }
      if (b.indexOf('\'') >= 0) {
        b = b.replace(/'/g, '');
      }

      if (b.indexOf(':') >= 0) {
        const r = b.split(':');
        return {
          'key': r[0],
          'v': r[1],
          'value': toLine(r[1]),
        };
      }
      return {
        'key': b,
        'v': b,
        'value': toLine(b),
      };
    });
  }
  return [];
};

export default {
  toLine,
  parseTags,
};
