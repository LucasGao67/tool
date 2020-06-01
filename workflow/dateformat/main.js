const moment = require('moment')
const util = require('util')
let result_array= []

function addResult(index,value,d){
    result_array = result_array.concat({
        title:value,
        subtitle:d,
        attributes:{
            uid:index,
            arg:value
        },
        arg:value,
        icon:'icon.png',
    }) 
}

function changeTime(m){
    let formatList = [
        {f:"X",d:"seconds"},
        {f:"x",d:"millseconds"},
        {f:"YYYY-MM-DD HH:mm:ss",d:""}
    ]
    let i = 0;
    for (;i<formatList.length;i++){
        let item = formatList[i]
        let value = m.format(item.f)
        addResult(i,value,item.d)
    }
    addResult(i++,m.toISOString(),"ISO time")

    console.log(JSON.stringify({
        items:result_array
    }))
}   

function handleNumber(value){
    while(value.length < 13){
        value+='0'
    }
    changeTime(moment(Number(value)))
}

function handleMiute(v){
    let v1 = v
    let i = 1
    v /= 1000 * 1000
    t = formatValue(v)
    addResult(i++,t+"ms",t+"毫秒")

    if (v>1){ // s
        v /= 1000
        t = formatValue(v)
        addResult(i++,t+"s",t+"秒")
    }

    if (v > 1){ // m 
        let m = parseInt(v / 60)
        let s = parseInt(v % 60)
        addResult(i++,util.format("%dm%ds",m,s),util.format("%d分%d秒",m,s))
        // t = formatValue(v)
    }

    if (v > 3600){ // h
        t = v
        let h = parseInt(v/(60 * 60))
        v = v % 3600
        let m = parseInt(v / 60)
        let s = parseInt(v % 60)
        addResult(i++,util.format("%dh%dm%ds",h,m,s),util.format("%d时%d分%d秒",h,m,s))
        v = t
    }

    addResult(i,v1 + "ns",v1+"纳秒")
   
    console.log(JSON.stringify({
        items:result_array
    }))
}

function formatValue(value){
    value = value.toFixed(2)
    if (parseInt(value) == value){
        return parseInt(value)
    }
    return value
}

let argv = process.argv
if (argv.length <= 2) return
if (argv[2] == "now"){
    let m = moment()
    changeTime(m)
}else if (argv[2].match(/^\d{10,}$/)){
    handleNumber(argv[2])
}else if(argv[2].match(/^\d*(ns|ms|s|m|h) *$/)){
    let value = argv[2].match(/^\d*/)[0]
    let unit = argv[2].match(/(ns|ms|s|m|h)/)[0]
    let v = 0
    switch (unit){
        case "ns":
            v = value
            break
        case "us":
            v= value * 1000
            break
        case "ms":
            v = value * 1000 * 1000
            break
        case "s":
            v = value * 1000 * 1000 * 1000
            break
        case "m":
            v = value * 1000 * 1000 * 1000 * 60
            break
        case "h":
            v = value * 1000 * 1000 * 1000 * 60 * 60
            break
    }
    handleMiute(v)
}else {
    let m = moment(argv[2])
    changeTime(m)
}

