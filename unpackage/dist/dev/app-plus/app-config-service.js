
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/Index","pages/playlist/Playlist","pages/songlist/Songlist","pages/newSonglist/NewSonglist","pages/profile/Profile","pages/collect/Collect","pages/collectPlaylist/CollectPlaylist","pages/recentPlay/RecentPlay"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"MOO","navigationBarBackgroundColor":"#1A191B","backgroundColor":"#1A191B","enablePullDownRefresh":true,"onReachBottomDistance":50,"style":{"app-plus":{"background":"#1A191B"}}},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"MOO","compilerVersion":"3.1.8","entryPagePath":"pages/index/Index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/Index","meta":{"isQuit":true},"window":{"enablePullDownRefresh":false,"navigationStyle":"custom","backgroundColor":"#1A191B"}},{"path":"/pages/playlist/Playlist","meta":{},"window":{"enablePullDownRefresh":false,"navigationStyle":"custom","backgroundColor":"#1A191B"}},{"path":"/pages/songlist/Songlist","meta":{},"window":{"enablePullDownRefresh":false,"navigationStyle":"custom","backgroundColor":"#1A191B"}},{"path":"/pages/newSonglist/NewSonglist","meta":{},"window":{"enablePullDownRefresh":false,"navigationStyle":"custom","backgroundColor":"#1A191B"}},{"path":"/pages/profile/Profile","meta":{},"window":{"enablePullDownRefresh":false,"navigationStyle":"custom","backgroundColor":"#1A191B"}},{"path":"/pages/collect/Collect","meta":{},"window":{"enablePullDownRefresh":false,"navigationStyle":"custom","backgroundColor":"#1A191B"}},{"path":"/pages/collectPlaylist/CollectPlaylist","meta":{},"window":{"enablePullDownRefresh":false,"navigationStyle":"custom","backgroundColor":"#1A191B"}},{"path":"/pages/recentPlay/RecentPlay","meta":{},"window":{"enablePullDownRefresh":false,"navigationStyle":"custom","backgroundColor":"#1A191B"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
