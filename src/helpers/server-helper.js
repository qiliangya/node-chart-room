const mime = require('mime');
const fs = require('fs');


/**
 * @param { object } response - 请求响应
 * @description 当页面路径不存在时, 发送404提示
 * @returns { undefined } undefined
 */
export const send404 = function (response) {
  response.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  response.write('Error 404: resource not found!')
  response.end()
}

/**
 * @param { object } response - 请求响应
 * @param { string } filePath - 文件路径
 * @param { any } fileContents - 文件内容 
 * @description 提供文件数据服务
 */
export const sendFile = function (response, filePath, fileContents) {
  response.writeHead(200, {
    "Content-Type": mime.lookup(path.basename(filePath))
  });
  response.end(fileContents)
}

/**
 * @param { object } response - 请求响应
 * @param { object } cache - 缓存数据
 * @param { string } absPath - 文件绝对路径
 * @description 访问内存比访问文件系统快得多, 所以能缓存的尽量缓存, 只有第一次请求会请求文件, 剩余的全部被缓存起来
 */
export const serveStatic = function (response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath])
  } else {
    fs.exists(absPath, function (exists) {
      if (exists) {
        fs.readFile(absPath, function (err, data) {
          if (err) {
            send404(response)
          } else {
            cache[absPath] = data
            sendFile(response, absPath, data)
          }
        })
      } else {
        send404(response)
      }
    })
  }
}