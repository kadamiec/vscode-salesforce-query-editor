// @ts-nocheck
const vscode = require('vscode');
const path = require('path');
const Webview = require('../utilities/webview');

class NotificationsWebview extends Webview {

   constructor(name, contributeCommand) {
      super(
         name,
         contributeCommand,
         `<!doctype html>
      <html lang="en" data-n-head="%7B%22lang%22:%7B%221%22:%22en%22%7D%7D">
         <head>
            <title>${name}</title>
            <meta data-n-head="1" charset="utf-8">
            <meta data-n-head="1" name="viewport" content="width=device-width,initial-scale=1">
            <meta data-n-head="1" data-hid="description" name="description" content="">
            <script src="/_nuxt/app.js" crossorigin="anonymous"></script>
         </head>
         <body>
            <div id="__nuxt">
               <style>#nuxt-loading{background:#fff;visibility:hidden;opacity:0;position:absolute;left:0;right:0;top:0;bottom:0;display:flex;justify-content:center;align-items:center;flex-direction:column;animation:nuxtLoadingIn 10s ease;-webkit-animation:nuxtLoadingIn 10s ease;animation-fill-mode:forwards;overflow:hidden}@keyframes nuxtLoadingIn{0%{visibility:hidden;opacity:0}20%{visibility:visible;opacity:0}100%{visibility:visible;opacity:1}}@-webkit-keyframes nuxtLoadingIn{0%{visibility:hidden;opacity:0}20%{visibility:visible;opacity:0}100%{visibility:visible;opacity:1}}#nuxt-loading>div,#nuxt-loading>div:after{border-radius:50%;width:5rem;height:5rem}#nuxt-loading>div{font-size:10px;position:relative;text-indent:-9999em;border:.5rem solid #f5f5f5;border-left:.5rem solid #000;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation:nuxtLoading 1.1s infinite linear;animation:nuxtLoading 1.1s infinite linear}#nuxt-loading.error>div{border-left:.5rem solid #ff4500;animation-duration:5s}@-webkit-keyframes nuxtLoading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes nuxtLoading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}</style>
               <script>window.addEventListener("error",function(){var e=document.getElementById("nuxt-loading");e&&(e.className+=" error")})</script>
               <div id="nuxt-loading" aria-live="polite" role="status">
                  <div>Loading...</div>
               </div>
            </div>
            <script>window.__NUXT__={config:{app:{basePath:"/",assetsPath:"/_nuxt/",cdnURL:null}}}</script>
            <script>
               const vscode = acquireVsCodeApi();
               vscode.postMessage();
            </script>
         </body>
      </html>
      `,
         vscode.ViewColumn.Two,
         true,
         true,
         false,
         path.join('views', 'notifications', 'dist', '_nuxt'),
         'info',
         false
      );
   }
}

module.exports = NotificationsWebview;
