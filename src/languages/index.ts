/**
 * 注意：执行compile命令会重新生成本文件，所以请不要修改本文件
 */
import idMap from "./idMap"                                             // 语言ID映射文件
import { translate,VoerkaI18nScope  } from "@voerkai18n/runtime"
import defaultFormatters from "./formatters/zh"  
import defaultMessages from "./zh"  
import storage  from "./storage"



const messages = {
    'zh' :  defaultMessages,
    'en' : ()=>import("./en"),
	'ja' : ()=>import("./ja")
}

const formatters = {
    'zh' :  defaultFormatters,
    'en' : ()=>import("./formatters/en"),
	'ja' : ()=>import("./formatters/ja")
}

// 语言配置文件
const scopeSettings = {
    "languages": [
        {
            "name": "zh",
            "title": "简体中文",
            "default": true,
            "active": true
        },
        {
            "name": "en",
            "title": "English"
        },
        {
            "name": "ja",
            "title": "日本語"
        }
    ],
    "namespaces": {}
}

// 语言作用域
const scope = new VoerkaI18nScope({    
    id          : "hqhelper-dawntrail",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出调试信息   
    idMap,                                          // 消息id映射列表  
    library     : false,                      // 开发库时设为true
    messages,                                       // 语言包
    formatters,                                     // 扩展自定义格式化器    
    storage,                                        // 语言配置存储器
    ...scopeSettings
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 
export { 
    scopedTtranslate as t, 
    scope as i18nScope
}