const http = require('http');
const fs = require('fs');
// 提供文件系统路径相关的能力
const path = require('path');
// 可根据文件扩展名得出MIME类型
const mime = require('mime');

// 缓存
const cache = {};