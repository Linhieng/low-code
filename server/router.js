const KoaRouter = require('koa-router')
const multer = require('@koa/multer')
const path = require('path')
const { FileUploaderServer } = require('easy-file-uploader-server')
const {addPage, getPage, getAllPages, log} = require('./util')

const upload = multer()
const router = KoaRouter()

const fileUploader = new FileUploaderServer({
  tempFileLocation: path.join(__dirname, './public/tempUploadFile'),
  mergedFileLocation: path.join(__dirname, './public/mergedUploadFile'),
})

router.post('/api/initUpload', async (ctx, next) => {
  const { name } = ctx.request.body
  const uploadId = await fileUploader.initFilePartUpload(name)
  ctx.body = { uploadId }
  await next()
})

router.post('/api/uploadPart', upload.single('partFile'), async (ctx, next) => {
  const { buffer } = ctx.file
  const { uploadId, partIndex } = ctx.request.body
  const partFileMd5 = await fileUploader.uploadPartFile(uploadId, partIndex, buffer)
  ctx.body = { partFileMd5 }
  await next()
})

router.post('/api/finishUpload', async (ctx, next) => {
  const { uploadId, name, md5 } = ctx.request.body
  const { path: filePathOnServer } = await fileUploader.finishFilePartUpload(uploadId, name, md5)
  const suffix = filePathOnServer.split(`${path.sep}public${path.sep}`)[1]
  ctx.body = { path: suffix }
  await next()
})

// NOTE: 后台代码，现在只要求 “能跑就行”

router.post('/api/uploadPage', async (ctx, next) => {
  log(ctx)
  try {
    const id = addPage(JSON.stringify(ctx.request.body))
    ctx.status = 200
    ctx.body = { id }
  } catch (error) {
    console.error('上传页面出错, ', error)
    ctx.status = 500
    ctx.body = {msg: error.message}
  }

  await next()
})

router.get('/api/page/:id', async (ctx, next) => {
  log(ctx)
  const id = ctx.params.id
  try {
    ctx.body = {drawData: getPage(id)}
    ctx.status = 200
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('不存在该文件', id)
      ctx.body = {msg: '不存在该文件'}
      ctx.status = 404
    } else {
      console.error('读取文件时出错', error)
      ctx.status = 500
      ctx.body = {msg: error.message}
    }
  }

  await next()
})

router.get('/api/getAllPages', async (ctx, next) => {
  log(ctx)
  try {
    ctx.body = {allId: getAllPages()}
    ctx.status = 200
  } catch (error) {
    console.error('获取所有文件时出错', error)
    ctx.status = 500
    ctx.body = {msg: error.message}
  }

  await next()
})

module.exports = router
