const Path = require('path')
const t = require('@babel/types')

/**
 * 把目标字符串转为正则，参考 webpack
 * https://github.com/webpack/webpack/blob/c181294865dca01b28e6e316636fef5f2aad4eb6/lib/ModuleFilenameHelpers.js
 */
function asRegExp(test) {
  if (typeof test === 'string') {
    test = new RegExp(test.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
  }
  return test
}
/**
 * 检验文件名称是否存在于 exclude 列表中
 * @param {*} filename
 * @param {*} exclude
 * @returns boolean
 */
function filenameInExclude(filename, exclude) {
  if (!exclude) return false
  exclude = asRegExp(exclude)
  if (Array.isArray(exclude)) {
    return exclude.map(asRegExp).some(r => r.test(filename))
  } else {
    return exclude.test(filename)
  }
}

/**
 * 1. if -> 提供 customPrefix ，则为前缀名
 * 2. else if -> 如果打印是在 node_modules里，则前缀默认为模块名且无行号
 * 3. else e.g. [index.js 4:13] (showLocation 可以控制是否显示行号)
 */
module.exports = () => {
  return {
    visitor: {
      CallExpression(path, state) {
        let {
          customPrefix, // 自定义前缀
          exclude = [], // 某些组件会有自己的规范，需要排除
          showLocation = true // 是否显示文件的位置信息 [index.js 8:13]
        } = state.opts || {}
        const filename = state.file.opts.filename
        if (filenameInExclude(filename, exclude)) return

        if (
          path.node.callee.object &&
          path.node.callee.object.name === 'console' &&
          path.node.callee.property.name !== 'table'
        ) {
          let value
          // 使用配置传入的自定义前缀
          if (customPrefix) {
            value = customPrefix
          } else {
            let prefix = ''
            // 如果 node_modules 里面有打印，默认取到组件的名字作为前缀 （@mfelibs为私有域）
            const r = filename.match(/node_modules\/(@xxx\/)?([^\/]+)/)
            if (r) {
              const componentName = r[2] || ''
              prefix = '📖 ' + componentName
              // 组件强制不显示行号
              showLocation = false
            } else {
              prefix = Path.basename(filename)
            }
            const location = showLocation
              ? ` ${path.node.loc.start.line}:${path.node.loc.start.column}`
              : ''

            value = `[${prefix}${location}]`
          }
          value += ' '

          const firstNode = path.node.arguments[0]
          // 是字符串或者模版字符串在原有的字符前拼接，否则 %c %s 等这种会错误处理
          if (t.isStringLiteral(firstNode)) {
            firstNode.value = value + firstNode.value
          } else if (t.isTemplateLiteral(firstNode)) {
            const _val = firstNode.quasis[0].value
            firstNode.quasis[0].value = {
              raw: value + _val.raw,
              cooked: value + _val.cooked
            }
          } else {
            path.node.arguments.unshift({
              type: 'StringLiteral',
              value
            })
          }
        }
      }
    }
  }
}
