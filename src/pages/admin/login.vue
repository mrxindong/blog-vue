<template>
    <div class="logindiv">
        <div class="logindiv_from">
            <ul>
                <li>
                    <el-input placeholder="请输入用户名" v-model="username">
                        <template slot="prepend">用户名</template>
                    </el-input>
                </li>
                <li> 
                    <el-input placeholder="请输入密码" v-model="pwd" type="password" >
                        <template slot="prepend">密&nbsp;码</template>
                    </el-input>
                </li> 
                <li> 
                  <el-input placeholder="请输入左侧验证码"  v-model="picLyanzhengma">
                        <template slot="prepend">
                          <input type="button"  class="codeimg" @click="createCode"  v-model="checkCode"/>
                        </template>
                    </el-input>
                </li> 
                <li>
                    <input class="btnlogin" type="button" value="登   录" @click="login">
                </li>
                 <li>
                    <span class="err" ref="errmsg"></span>
                </li>
            </ul>
        </div>
    </div>

</template>
<script>
var code ; //在全局定义验证码
export default {
  data() {
    return {
      username: "",
      pwd: "",
       picLyanzhengma:'',
       checkCode:''
    };
  },
  methods: {
     // 图片验证码
      createCode(){
          code = "";    
          var codeLength = 4;//验证码的长度   
          var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',   
           'S','T','U','V','W','X','Y','Z');//随机数   
          for(var i = 0; i < codeLength; i++) {//循环操作   
              var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）   
              code += random[index];//根据索引取得随机数加到code上   
          }   
          this.checkCode = code;//把code值赋给验证码   
      },
      // 判断验证码是否正确
      checkLpicma(){
          var code=this.picLyanzhengma.toUpperCase();//取得输入的验证码并转化为大写         
          if(code== '') {
              this.$refs.errmsg.innerHTML="error:请输入验证码";
          }else if(code!= this.checkCode ) {   
              this.$refs.errmsg.innerHTML="error:验证码错误";      
              this.createCode();//刷新验证码   
              this.picLyanzhengma = '';
          }else { 
              //验证码正确  
              return true;
          } 
      }
      ,
    //登录
    login() {
      if (this.username.trim()== "") {
        this.$refs.errmsg.innerHTML = "error:请输入用户名";
      }else if (this.pwd.trim() == "") {
        this.$refs.errmsg.innerHTML = "error:请输入密码";
      }else if(this.pwd.trim().length<6){
        this.$refs.errmsg.innerHTML = "error:密码长度至少6位";
       }else if(this.checkLpicma()){
         //验证码正确
        //去登录
        this.$axios
          .post(
            "/admin/users/login",
            "username=" + this.username + "&password=" + this.pwd
          )
          .then(res => {
            //console.log(res.data);
            if (res.data.code == 200 && res.data.result == "ok") {
              //登录成功
              this.$router.push({
                name: "adminindex"
              });
            } else if (res.data.code == 500) {
              this.$refs.errmsg.innerHTML = "error:" + res.data.message;
            }
          })
          .catch(err => {
            this.$refs.errmsg.innerHTML = "登录出错:" + err;
          });
      }
    }
  },
   created(){
        this.createCode();
    }
};
</script>
<style scoped lang="less">
.logindiv {
  height: 100%;
  background: linear-gradient(to right, #003973 0, #e5e5be 100%);
  padding-top: 200px;
  box-sizing: border-box;
  &_from {
    width: 500px;
    height: 380px;
    box-shadow: rgb(201, 201, 201) 0px 0px 5px;
    text-align: center;
    margin: 0 auto;
    border-radius: 5px;

    ul {
      padding-top: 30px;
      li {
        margin-top: 30px;
      }
    }
  }
}
.btnlogin {
  width: 200px;
  height: 45px;
  background: #fd6036;
  color: #fff;
  border: 0;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
}
.err {
  color: #fff;
  font-size: 14px;
  margin-top: 20px;
}

.el-input {
  width: 350px;
}


//验证码
.codeimg{
    font-size: 18px;
    letter-spacing: 3px;
    color: #053d84;
    background: #f2f2f5;
    vertical-align: middle;
    width: 80px;
    height:35px;
    border-radius: 5px;
}

</style>


