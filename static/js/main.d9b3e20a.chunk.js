(this.webpackJsonpsite=this.webpackJsonpsite||[]).push([[0],{6:function(e,t,a){e.exports={App:"App_App__248Ek",AppHeader:"App_AppHeader__3789_",AppLink:"App_AppLink__9W8vc",topContainer:"App_topContainer__1MYKD",tabsContainer:"App_tabsContainer__2qsJS",iframeSpinWrapper:"App_iframeSpinWrapper__3Vw1R",iframe:"App_iframe__JounH",iframeVisible:"App_iframeVisible__1fvY7",invisible:"App_invisible__PFf-1","App-logo-spin":"App_App-logo-spin__QlDWQ"}},60:function(e,t,a){},90:function(e,t,a){"use strict";a.r(t);var s=a(1),c=a(0),n=a.n(c),r=a(14),o=a.n(r),i=(a(60),a(15)),l=a(16),p=a(6),b=a.n(p),u=a(94),j=a(93),f=a(95),d=a(30),m=a(17);var g=[{value:"cookie",label:"Cookies"},{value:"localStorage",label:"Local Storage"}];function h(){var e=Object(c.useState)(!1),t=Object(l.a)(e,2),a=t[0],n=t[1],r=function(){var e=Object(c.useMemo)((function(){var e=new URLSearchParams(window.location.search),t=e.get("storageType");return{storageType:("cookie"===t||"localStorage"===t?t:void 0)||"cookie",useStorageAccessAPI:!!e.get("useStorageAccessAPI")}}),[]),t=Object(c.useState)(e),a=Object(l.a)(t,2),s=a[0],n=a[1];Object(c.useEffect)((function(){var e={storageType:s.storageType,useStorageAccessAPI:s.useStorageAccessAPI?"1":""},t="?"+new URLSearchParams(e).toString();console.log(t),window.history.pushState(null,"local stage change",t)}),[s]);var r=Object(c.useCallback)((function(e){n((function(t){return Object(m.a)(Object(m.a)({},t),{},{storageType:e})}))}),[]),o=Object(c.useCallback)((function(e){n((function(t){return Object(m.a)(Object(m.a)({},t),{},{useStorageAccessAPI:e})}))}),[]);return{localState:s,setStorageType:r,setUseRequestStorageAPI:o}}(),o=r.setUseRequestStorageAPI,i=r.setStorageType,p=r.localState,f=p.useStorageAccessAPI,d=p.storageType,h=Object(c.useMemo)((function(){return"".concat({localStorage:"local-storage",cookie:"cookies"}[d],"/").concat(f?"1":"")}),[f,d]);return Object(s.jsxs)("div",{className:b.a.App,children:[Object(s.jsxs)("div",{className:b.a.topContainer,children:[Object(s.jsxs)("h2",{children:["A site ",window.location.host]}),Object(s.jsxs)("div",{className:"",children:[Object(s.jsxs)("label",{htmlFor:"firstname1",className:"",children:["Iframe border ",Object(s.jsx)(u.a,{size:"default",checkedChildren:"visible",unCheckedChildren:"hidden",onChange:n,defaultChecked:a})]}),Object(s.jsx)("br",{}),Object(s.jsx)("br",{}),Object(s.jsx)("label",{htmlFor:"firstname1",className:"",children:"Storage method"}),Object(s.jsx)("div",{className:"",children:Object(s.jsx)(j.a.Group,{options:g,value:d,onChange:function(e){return i(e.target.value)},optionType:"button",size:"large",buttonStyle:"solid"})}),Object(s.jsx)("br",{}),Object(s.jsxs)("label",{htmlFor:"firstname1",className:"",children:["Storage Access API ",Object(s.jsx)(u.a,{size:"default",onChange:o,checkedChildren:"on",unCheckedChildren:"off",defaultChecked:f})]})]})]}),Object(s.jsx)(O,{url:"https://showcookie2.me/"+h,iframeVisible:a})]})}var O=Object(c.memo)((function(e){var t=e.iframeVisible,a=e.url,n=Object(c.useState)(!0),r=Object(l.a)(n,2),o=r[0],p=r[1];return Object(c.useEffect)((function(){p(!0)}),[a]),Object(s.jsxs)(s.Fragment,{children:[Object(s.jsxs)("p",{className:Object(d.a)(Object(i.a)({},b.a.invisible,!t)),children:["Iframe URL: ",a]}),Object(s.jsx)(f.a,{size:"large",spinning:o,wrapperClassName:b.a.iframeSpinWrapper,className:b.a.iframeSpinWrapper,children:Object(s.jsx)("iframe",{title:"A note maker",className:Object(d.a)(b.a.iframe,Object(i.a)({},b.a.iframeVisible,t)),src:a,onLoad:function(){return p(!1)}})})]})}));O.displayName="IFrameContent";var A=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,96)).then((function(t){var a=t.getCLS,s=t.getFID,c=t.getFCP,n=t.getLCP,r=t.getTTFB;a(e),s(e),c(e),n(e),r(e)}))};o.a.render(Object(s.jsx)(n.a.StrictMode,{children:Object(s.jsx)(h,{})}),document.getElementById("root")),A()}},[[90,1,2]]]);
//# sourceMappingURL=main.d9b3e20a.chunk.js.map