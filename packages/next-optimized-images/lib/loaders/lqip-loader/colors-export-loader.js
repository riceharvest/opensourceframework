module.exports = (content) => {
  return `${content.toString('utf-8').replace('module.exports', 'var lqip')} module.exports = lqip.palette; module.exports = Object.assign(module.exports, lqip);`;
};
