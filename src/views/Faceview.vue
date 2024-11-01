<template>
    <div>
        <div class="video-container">
            <video id="video" autoplay preload loop muted></video>
            <p class="text-center">{{ massage }}</p>
            <!-- <canvas id="overlayCanvas" width="200" height="200"
                style="position: absolute; top: 20; left: 0; transform: rotateY(180deg);"></canvas> -->
        </div>
        <div>
            <canvas id="fullCanvas" width="400" height="400"
                style="transform: rotateY(180deg); display: none;"></canvas>
        </div>
        <!-- <div>结果：{{ img }}</div> -->
    </div>
</template>

<script>
//import { userMedia } from '../../utils/utils';
import 'tracking/build/tracking.js';
import 'tracking/build/data/face-min.js';
import serviceAxios from "../utils/request";
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
    data() {
        return {
            img: '',
            videoObj: null,
            trackerTask: null,
            overlayContext: null,
            massage: "请将脸放入取景框中",
            logintoken:"",
        }
    },

    mounted() {
        this.getCompetence();
        this.aotulogin();

    },

    methods: {
        base64ToBinary(base64String) {
            // 从Base64字符串创建Blob对象
            const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
            const binaryData = atob(base64Data);
            const arrayBuffer = new ArrayBuffer(binaryData.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }

            const blob = new Blob([uint8Array], { type: 'image/png' });
            return blob;
        },
        openCamera() {
            this.$nextTick(() => {
                const fullCanvas = document.getElementById('fullCanvas')
                const fullContext = fullCanvas.getContext('2d')
                this.videoObj = document.getElementById('video')
                const tracker = new window.tracking.ObjectTracker('face')
                tracker.setInitialScale(4)
                tracker.setStepSize(2)
                tracker.setEdgesDensity(0.1)

                this.trackerTask = window.tracking.track('#video', tracker, { camera: true })
                this.img = this.trackerTask
                tracker.on('track', (event) => {
                    if (event.data.length !== 0) {
                        event.data.forEach((rect) => {
                            fullContext.clearRect(0, 0, fullCanvas.width, fullCanvas.height);
                            fullContext.drawImage(this.videoObj, 0, 0, fullCanvas.width, fullCanvas.height);
                            this.img = this.base64ToBinary(fullCanvas.toDataURL());
                        });
                    }
                })
            })
        },
        updateMassage() {
            if (this.massage === '请将脸放入取景框中') {
                this.massage = '请向左转动脸颊';
            } else if (this.massage === '请向左转动脸颊') {
                this.massage = '请张张嘴';
            } else if (this.massage === '请张张嘴') {
                this.sendImage();
                this.massage = '';
            }
            const randomDelay = Math.random() * (3.9 - 3.0) + 3.0;
            const delayInMilliseconds = randomDelay * 1000;
            setTimeout(this.updateMassage, delayInMilliseconds);

        },
        getCompetence() {
            let _this = this;
            this.video = document.getElementById("video");
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function (constraints) {
                    var getUserMedia =
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.getUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject(
                            new Error("getUserMedia is not implemented in this browser")
                        );
                    }
                    return new Promise(function (resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                };
            }
            var constraints = {
                video: { width: 350, height: 350, transform: "scaleX(-1)" },
                audio: false,
            };
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function (stream) {
                    if ("srcObject" in _this.video) {
                        _this.video.srcObject = stream;
                    } else {
                        _this.video.src = window.URL.createObjectURL(stream);
                    }
                    _this.video.onloadedmetadata = function (e) {
                        _this.video.play();
                    };

                    _this.openCamera();
                    setTimeout(this.updateMassage, 3000);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        de() {
            this.video.srcObject.getTracks()[0].stop();
            this.trackerTask.stop();
        },

        handleCancel() {
            this.videoObj.srcObject.getTracks()[0].stop()
            this.trackerTask.stop()
        },

        success(stream) {
            this.videoObj.srcObject = stream
            this.videoObj.play()
        },

        error(error) {
            console.log(`访问用户媒体设备失败${error.name}, ${error.message}`)
        },
        aotulogin(){
            serviceAxios({
                    url: "/api/user/login",
                    method: "post",
                    data: {
                        account: "814954582@qq.com",
                        password: "4pJR5s_mpyi0mTS5ievcEA ==",
                        isAdmin: true,
                    }
                }).then((res)=>{
                    this.logintoken = res.data.accessToken;
                    localStorage.setItem('logintoken', this.logintoken);
                }).catch((err)=>{
                    console.log(err);
                })
        },
        sendImage() {
            if (this.img != null) {                
                console.log(this.img);
                serviceAxios({
                    url: "/api/resource/upload",
                    method: "post",
                    data: {
                        file: this.img,
                        originalName: new Date().getTime() + ".png",
                        key: "face/"+new Date().getTime()+"face.png",
                        relativePath: "face/"+new Date().getTime()+"face.png",
                        type: "face",
                        storeType: "local"
                    },
                }).then((data) => {
                    ElMessageBox.alert('人脸上传成功', '成功', {
                    confirmButtonText: 'OK',
                    callback: (action) => {
                        ElMessage({
                            type: 'sucess',
                            message: `返回上一级`,
                        });
                    },
                });
                this.$router.push('../');
                }).catch((err) => {
                    console.log(err);
                });
            };
        }
    },

    beforeDestroy() {
        this.handleCancel()
    }
}
</script>

<style>
.text-center {
    font-size: 20px;
    color: #535559;
    font-family: 'PingFang SC';
    font-weight: bold;
}

.video-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 60px;
    width: 100%;
    height: 70vh;
}

#video {
    border-radius: 50%;
    overflow: hidden;
    width: 350;
    height: 350;
    transform: rotateY(180deg);
}

#fullCanvas {
    border-radius: 50%;
    overflow: hidden;
}
</style>