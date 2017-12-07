const fs = require('fs')
const fse = require('fs-extra')
const md5File = require('md5-file')
const path = require('path')
const glob = require("glob")
const testFolder = path.join(__dirname, '../ebook-release/ebook3.0-win32-x64/')
const outPath = path.join(__dirname, './update.json')


//写入txt的文件格式
let data = {
    "name": "electron-demo",
    "description": "更新？不存在的",
    "version": "1.0.0",
    "update_time": "2017-12-7",
    "md5Arr": []
}

glob(testFolder + '**', function (er, files) {
    let len = files.length
    files.forEach((filename, index) => {
        fs.stat(filename, (eror, stats) => {
            if (eror) {
                console.warn('获取文件stats失败')
            } else {
                let isFile = stats.isFile() //是文件  
                let isDir = stats.isDirectory() //是文件夹  
                if (isFile) {
                    const hash = md5File.sync(filename)
                    //console.log(`The MD5 of ${filename} is: ${hash}`)
                    let file_info = {
                        "filePath": filename,
                        "md5": hash
                    }
                    data.md5Arr.push(file_info)
                }
            }
            if (index === (len - 1)) {
                console.log(data.md5Arr.length)
                fse.ensureFile(outPath, (err) => {
                    if (!err) {
                        fse.createFile(outPath, (err) => {
                            if (err) {
                                console.log(err)
                            }
                            console.log("创建成功 create success")
                            fs.writeFile(outPath, JSON.stringify(data), function (err) {
                                if (!err) {
                                    console.log("写入成功！")
                                }
                            })
                        })
                    }
                })
            }
        })
    })
})
