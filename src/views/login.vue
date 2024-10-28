<template>
    <div class="login">
        <el-card style="max-width: 480px" class="box-card">
            <template #header>
                <div class="card-header">
                    <span>购物商城界面</span>
                </div>
            </template>
            <el-tabs v-model="activeName" class="login-tabs" @tab-click="handleTabsClick" stretch>
                <el-tab-pane label="登录" name="login">
                    <el-form :model="loginForm" status-icon ref='loginForm' :rules="loginRules" label-width="100px"
                        class="login-Form">
                        <el-form-item label="用户名" prop="username">
                            <el-input clearable v-model="loginForm.username" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="pass">
                            <el-input clearable type="password" v-model="loginForm.pass" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="注册" name="register">
                    <el-form :model="registerForm" status-icon ref='registerForm' :rules="registerRules"
                        label-width="100px" class="register-Form">
                        <el-form-item label="用户名" prop="username">
                            <el-input clearable v-model="registerForm.username" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="pass">
                            <el-input clearable type="password" v-model="registerForm.pass"
                                autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input clearable type="password" v-model="registerForm.checkPass"
                                autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄" prop="age">
                            <el-input clearable v-model.number="registerForm.age"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('registerForm')">提交</el-button>
                            <el-button @click="resetForm('registerForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <template #footer></template>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        var validateUserName = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入用户名'))
            } else {
                callback();
            }
        };
        var checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('年龄不能为空'));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    if (value < 18) {
                        callback(new Error('必须年满18岁'));
                    } else {
                        callback();
                    }
                }
            }, 1000);
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                // if (this.ruleForm.checkPass !== '') {
                //     this.$refs.ruleForm.validateField('checkPass');
                // }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            activeName: "login",
            activeTab: "",
            loginForm: {
                username: '',
                pass: ''
            },
            registerForm: {
                username: '',
                pass: '',
                checkPass: '',
                age: ''
            },
            registerRules: {
                Rusername: [
                    { validator: validateUserName, trigger: 'blur' }
                ],
                Rpass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                RcheckPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                Rage: [
                    { validator: checkAge, trigger: 'blur' }
                ]
            }, loginRules: {
                Lusername: [
                    { validator: validateUserName, trigger: 'blur' }
                ],
                Lpass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.activeTab === "login") {
                        console.log("登录")
                    }
                    if (this.activeTab === "register") {
                        console.log("注册")
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleTabsClick(tab) {
            this.activeTab = tab.paneName;
        }
    }
}

</script>


<style lang="less" scoped>
.login {
    width: 1200px;
    margin: 0 auto;

    .box-card {
        width: 600px;
        margin: 100px auto;
    }
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #3c5b91;
    font-size: 32px;
    font-weight: 600;
}
</style>
