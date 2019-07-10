// 时间格式化函数
var commonFun={
    //参数：date datetime类型，fmt :日期格式，字符串类型 "yyyy-MM-dd HH:mm:ss"
    formatDate:function(date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
            }
        }
        return fmt;
    },
    //验证服务器返回码
    checkServercode:function(res,obj){
        var success=false;
        if(res.data.code==304){
            //未登录或登录已超时，则返回登录页面
            obj.$router.push({
                name:'Login'
             })
            }else if(res.data.code==500){
                obj.errortitle="code:500";
                obj.errordesc=res.data.message;
                obj.errshow=true;
            }else if(res.data.code==200){
              //成功
              success=true; 
       }
       return success;

    },
    //axios请求中catch到的错误信息，处理
    catcherror:function(obj,title,err){
        obj.errortitle="(catch error)"+title;
        obj.errordesc=err;
        obj.errshow=true;
    },
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
module.exports=commonFun;