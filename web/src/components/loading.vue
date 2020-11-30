<template>
    <div class="d-flex justify-content-center h-100">
        <div class="m-auto">
            <div class="d-flex flex-column">
                <h2 class="mx-auto mb-3">Merry Christmas 🎁👀</h2>
                <div class="d-flex flex-column">
                    <a class="mx-auto" href="https://www.buymeacoffee.com/allanoricil" target="_blank">
                        <img src="../../static/images/buymeacoffee.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
                    </a>
                    <div class="paypal-qr-code-background d-flex flex-column py-4 mx-auto mt-3">
                        <img src="../../static/images/qrcodelogo.png" width="128px;" class="mx-auto mb-2">
                        <img src="../../static/images/QR Code.png" width="128px;" class="mx-auto">
                    </div>
                </div>
                <stretch background="var(--vscode-button-background)" class="mt-4 mx-auto"></stretch>
            </div>
        </div>
    </div>
</template>

<script>
import { Stretch } from 'vue-loading-spinner';
export default{
    components:{
        Stretch
    }
}
</script>

<style>
.paypal-qr-code-background{
  border-radius: 1rem; 
  background-color: white; 
  width: 200px;
}
</style>