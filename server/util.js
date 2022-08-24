const fs = require('fs')
const path = require('path')

function addPage(strData) {
    try {
        fs.accessSync(path.join(__dirname, './public'))
    } catch (error) {
        if (error.code === 'ENOENT') fs.mkdirSync(path.join(__dirname, './public'))
        else throw error
    }
    try {
        fs.accessSync(path.join(__dirname, 'public/pages-raw-data'))
    } catch (error) {
        if (error.code === 'ENOENT') fs.mkdirSync(path.join(__dirname, 'public/pages-raw-data'))
        else throw error
    }
    try {
        const id = `${new Date().getTime()}-${Number.parseInt(Math.random() * 100)}`
        fs.writeFileSync(path.join(__dirname, `public/pages-raw-data/${id}`), strData)
        return id
    } catch (error) {
        throw error
    }
}

function getPage(id) {
    try {
        const data = fs.readFileSync(path.join(__dirname, `public/pages-raw-data/${id}`), 'utf8')
        return data
    } catch (error) {
        throw error
    }
}

function getAllPages() {
    try {
        const data = fs.readdirSync(path.join(__dirname, 'public/pages-raw-data/'), () => {})
        return data
    } catch (error) {
        throw error
    }
}

function log(ctx) {
    const req = ctx.request
    fs.appendFile(path.join(__dirname, 'log.log'),`
        时间: ${new Date()};
        接口: ${req.url};
        origin: ${req.headers.origin};
        `, () => {})
}
function comingLog(ctx) {
    const req = ctx.request
    fs.appendFile(path.join(__dirname, 'coming.log'),`
        时间: ${new Date()};
        接口: ${req.url};
        来源: ${req.headers['x-forwarded-for']};
        `, () => {})
}

module.exports = {
    addPage,
    getPage,
    getAllPages,
    log,
    comingLog,
}