import{j as l}from"./jsx-runtime-DR9Q75dM.js";import{r as i,a as pn}from"./index-DRjF_FHU.js";import{u as P,S as vn,a as gn,c as M}from"./utils-DcIm4c_J.js";import{P as O,d as hn}from"./index-Dz3SudTg.js";import{F as yn}from"./index-rX-Bn4lm.js";import{b as dt,B as xn}from"./button-DC7OJGv3.js";import{c as L}from"./createLucideIcon-B4XAxcv3.js";function bn(e,t){const n=i.createContext(t),r=a=>{const{children:c,...s}=a,f=i.useMemo(()=>s,Object.values(s));return l.jsx(n.Provider,{value:f,children:c})};r.displayName=e+"Provider";function o(a){const c=i.useContext(n);if(c)return c;if(t!==void 0)return t;throw new Error(`\`${a}\` must be used within \`${e}\``)}return[r,o]}function ft(e,t=[]){let n=[];function r(a,c){const s=i.createContext(c),f=n.length;n=[...n,c];const u=p=>{var y;const{scope:v,children:h,...C}=p,d=((y=v==null?void 0:v[e])==null?void 0:y[f])||s,g=i.useMemo(()=>C,Object.values(C));return l.jsx(d.Provider,{value:g,children:h})};u.displayName=a+"Provider";function m(p,v){var d;const h=((d=v==null?void 0:v[e])==null?void 0:d[f])||s,C=i.useContext(h);if(C)return C;if(c!==void 0)return c;throw new Error(`\`${p}\` must be used within \`${a}\``)}return[u,m]}const o=()=>{const a=n.map(c=>i.createContext(c));return function(s){const f=(s==null?void 0:s[e])||a;return i.useMemo(()=>({[`__scope${e}`]:{...s,[e]:f}}),[s,f])}};return o.scopeName=e,[r,En(o,...t)]}function En(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const r=e.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(a){const c=r.reduce((s,{useScope:f,scopeName:u})=>{const p=f(a)[`__scope${u}`];return{...s,...p}},{});return i.useMemo(()=>({[`__scope${t.scopeName}`]:c}),[c])}};return n.scopeName=t.scopeName,n}function R(e,t,{checkForDefaultPrevented:n=!0}={}){return function(o){if(e==null||e(o),n===!1||!o.defaultPrevented)return t==null?void 0:t(o)}}var oe=globalThis!=null&&globalThis.document?i.useLayoutEffect:()=>{},Cn=pn.useId||(()=>{}),wn=0;function le(e){const[t,n]=i.useState(Cn());return oe(()=>{e||n(r=>r??String(wn++))},[e]),e||(t?`radix-${t}`:"")}function I(e){const t=i.useRef(e);return i.useEffect(()=>{t.current=e}),i.useMemo(()=>(...n)=>{var r;return(r=t.current)==null?void 0:r.call(t,...n)},[])}function Nn({prop:e,defaultProp:t,onChange:n=()=>{}}){const[r,o]=An({defaultProp:t,onChange:n}),a=e!==void 0,c=a?e:r,s=I(n),f=i.useCallback(u=>{if(a){const p=typeof u=="function"?u(e):u;p!==e&&s(p)}else o(u)},[a,e,o,s]);return[c,f]}function An({defaultProp:e,onChange:t}){const n=i.useState(e),[r]=n,o=i.useRef(r),a=I(t);return i.useEffect(()=>{o.current!==r&&(a(r),o.current=r)},[r,o,a]),n}function Sn(e,t=globalThis==null?void 0:globalThis.document){const n=I(e);i.useEffect(()=>{const r=o=>{o.key==="Escape"&&n(o)};return t.addEventListener("keydown",r,{capture:!0}),()=>t.removeEventListener("keydown",r,{capture:!0})},[n,t])}var Dn="DismissableLayer",he="dismissableLayer.update",Tn="dismissableLayer.pointerDownOutside",Rn="dismissableLayer.focusOutside",_e,mt=i.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),pt=i.forwardRef((e,t)=>{const{disableOutsidePointerEvents:n=!1,onEscapeKeyDown:r,onPointerDownOutside:o,onFocusOutside:a,onInteractOutside:c,onDismiss:s,...f}=e,u=i.useContext(mt),[m,p]=i.useState(null),v=(m==null?void 0:m.ownerDocument)??(globalThis==null?void 0:globalThis.document),[,h]=i.useState({}),C=P(t,x=>p(x)),d=Array.from(u.layers),[g]=[...u.layersWithOutsidePointerEventsDisabled].slice(-1),y=d.indexOf(g),N=m?d.indexOf(m):-1,b=u.layersWithOutsidePointerEventsDisabled.size>0,E=N>=y,w=_n(x=>{const T=x.target,q=[...u.branches].some(ce=>ce.contains(T));!E||q||(o==null||o(x),c==null||c(x),x.defaultPrevented||s==null||s())},v),D=kn(x=>{const T=x.target;[...u.branches].some(ce=>ce.contains(T))||(a==null||a(x),c==null||c(x),x.defaultPrevented||s==null||s())},v);return Sn(x=>{N===u.layers.size-1&&(r==null||r(x),!x.defaultPrevented&&s&&(x.preventDefault(),s()))},v),i.useEffect(()=>{if(m)return n&&(u.layersWithOutsidePointerEventsDisabled.size===0&&(_e=v.body.style.pointerEvents,v.body.style.pointerEvents="none"),u.layersWithOutsidePointerEventsDisabled.add(m)),u.layers.add(m),ke(),()=>{n&&u.layersWithOutsidePointerEventsDisabled.size===1&&(v.body.style.pointerEvents=_e)}},[m,v,n,u]),i.useEffect(()=>()=>{m&&(u.layers.delete(m),u.layersWithOutsidePointerEventsDisabled.delete(m),ke())},[m,u]),i.useEffect(()=>{const x=()=>h({});return document.addEventListener(he,x),()=>document.removeEventListener(he,x)},[]),l.jsx(O.div,{...f,ref:C,style:{pointerEvents:b?E?"auto":"none":void 0,...e.style},onFocusCapture:R(e.onFocusCapture,D.onFocusCapture),onBlurCapture:R(e.onBlurCapture,D.onBlurCapture),onPointerDownCapture:R(e.onPointerDownCapture,w.onPointerDownCapture)})});pt.displayName=Dn;var Pn="DismissableLayerBranch",On=i.forwardRef((e,t)=>{const n=i.useContext(mt),r=i.useRef(null),o=P(t,r);return i.useEffect(()=>{const a=r.current;if(a)return n.branches.add(a),()=>{n.branches.delete(a)}},[n.branches]),l.jsx(O.div,{...e,ref:o})});On.displayName=Pn;function _n(e,t=globalThis==null?void 0:globalThis.document){const n=I(e),r=i.useRef(!1),o=i.useRef(()=>{});return i.useEffect(()=>{const a=s=>{if(s.target&&!r.current){let f=function(){vt(Tn,n,u,{discrete:!0})};const u={originalEvent:s};s.pointerType==="touch"?(t.removeEventListener("click",o.current),o.current=f,t.addEventListener("click",o.current,{once:!0})):f()}else t.removeEventListener("click",o.current);r.current=!1},c=window.setTimeout(()=>{t.addEventListener("pointerdown",a)},0);return()=>{window.clearTimeout(c),t.removeEventListener("pointerdown",a),t.removeEventListener("click",o.current)}},[t,n]),{onPointerDownCapture:()=>r.current=!0}}function kn(e,t=globalThis==null?void 0:globalThis.document){const n=I(e),r=i.useRef(!1);return i.useEffect(()=>{const o=a=>{a.target&&!r.current&&vt(Rn,n,{originalEvent:a},{discrete:!1})};return t.addEventListener("focusin",o),()=>t.removeEventListener("focusin",o)},[t,n]),{onFocusCapture:()=>r.current=!0,onBlurCapture:()=>r.current=!1}}function ke(){const e=new CustomEvent(he);document.dispatchEvent(e)}function vt(e,t,n,{discrete:r}){const o=n.originalEvent.target,a=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:n});t&&o.addEventListener(e,t,{once:!0}),r?hn(o,a):o.dispatchEvent(a)}var ue="focusScope.autoFocusOnMount",de="focusScope.autoFocusOnUnmount",Me={bubbles:!1,cancelable:!0},Mn="FocusScope",gt=i.forwardRef((e,t)=>{const{loop:n=!1,trapped:r=!1,onMountAutoFocus:o,onUnmountAutoFocus:a,...c}=e,[s,f]=i.useState(null),u=I(o),m=I(a),p=i.useRef(null),v=P(t,d=>f(d)),h=i.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;i.useEffect(()=>{if(r){let d=function(b){if(h.paused||!s)return;const E=b.target;s.contains(E)?p.current=E:k(p.current,{select:!0})},g=function(b){if(h.paused||!s)return;const E=b.relatedTarget;E!==null&&(s.contains(E)||k(p.current,{select:!0}))},y=function(b){if(document.activeElement===document.body)for(const w of b)w.removedNodes.length>0&&k(s)};document.addEventListener("focusin",d),document.addEventListener("focusout",g);const N=new MutationObserver(y);return s&&N.observe(s,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",d),document.removeEventListener("focusout",g),N.disconnect()}}},[r,s,h.paused]),i.useEffect(()=>{if(s){je.add(h);const d=document.activeElement;if(!s.contains(d)){const y=new CustomEvent(ue,Me);s.addEventListener(ue,u),s.dispatchEvent(y),y.defaultPrevented||(In(Bn(ht(s)),{select:!0}),document.activeElement===d&&k(s))}return()=>{s.removeEventListener(ue,u),setTimeout(()=>{const y=new CustomEvent(de,Me);s.addEventListener(de,m),s.dispatchEvent(y),y.defaultPrevented||k(d??document.body,{select:!0}),s.removeEventListener(de,m),je.remove(h)},0)}}},[s,u,m,h]);const C=i.useCallback(d=>{if(!n&&!r||h.paused)return;const g=d.key==="Tab"&&!d.altKey&&!d.ctrlKey&&!d.metaKey,y=document.activeElement;if(g&&y){const N=d.currentTarget,[b,E]=jn(N);b&&E?!d.shiftKey&&y===E?(d.preventDefault(),n&&k(b,{select:!0})):d.shiftKey&&y===b&&(d.preventDefault(),n&&k(E,{select:!0})):y===N&&d.preventDefault()}},[n,r,h.paused]);return l.jsx(O.div,{tabIndex:-1,...c,ref:v,onKeyDown:C})});gt.displayName=Mn;function In(e,{select:t=!1}={}){const n=document.activeElement;for(const r of e)if(k(r,{select:t}),document.activeElement!==n)return}function jn(e){const t=ht(e),n=Ie(t,e),r=Ie(t.reverse(),e);return[n,r]}function ht(e){const t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const o=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||o?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t}function Ie(e,t){for(const n of e)if(!Ln(n,{upTo:t}))return n}function Ln(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}function Fn(e){return e instanceof HTMLInputElement&&"select"in e}function k(e,{select:t=!1}={}){if(e&&e.focus){const n=document.activeElement;e.focus({preventScroll:!0}),e!==n&&Fn(e)&&t&&e.select()}}var je=Wn();function Wn(){let e=[];return{add(t){const n=e[0];t!==n&&(n==null||n.pause()),e=Le(e,t),e.unshift(t)},remove(t){var n;e=Le(e,t),(n=e[0])==null||n.resume()}}}function Le(e,t){const n=[...e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),n}function Bn(e){return e.filter(t=>t.tagName!=="A")}var $n="Portal",yt=i.forwardRef((e,t)=>{var s;const{container:n,...r}=e,[o,a]=i.useState(!1);oe(()=>a(!0),[]);const c=n||o&&((s=globalThis==null?void 0:globalThis.document)==null?void 0:s.body);return c?yn.createPortal(l.jsx(O.div,{...r,ref:t}),c):null});yt.displayName=$n;function Un(e,t){return i.useReducer((n,r)=>t[n][r]??n,e)}var ie=e=>{const{present:t,children:n}=e,r=qn(t),o=typeof n=="function"?n({present:r.isPresent}):i.Children.only(n),a=P(r.ref,zn(o));return typeof n=="function"||r.isPresent?i.cloneElement(o,{ref:a}):null};ie.displayName="Presence";function qn(e){const[t,n]=i.useState(),r=i.useRef({}),o=i.useRef(e),a=i.useRef("none"),c=e?"mounted":"unmounted",[s,f]=Un(c,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return i.useEffect(()=>{const u=z(r.current);a.current=s==="mounted"?u:"none"},[s]),oe(()=>{const u=r.current,m=o.current;if(m!==e){const v=a.current,h=z(u);e?f("MOUNT"):h==="none"||(u==null?void 0:u.display)==="none"?f("UNMOUNT"):f(m&&v!==h?"ANIMATION_OUT":"UNMOUNT"),o.current=e}},[e,f]),oe(()=>{if(t){let u;const m=t.ownerDocument.defaultView??window,p=h=>{const d=z(r.current).includes(h.animationName);if(h.target===t&&d&&(f("ANIMATION_END"),!o.current)){const g=t.style.animationFillMode;t.style.animationFillMode="forwards",u=m.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=g)})}},v=h=>{h.target===t&&(a.current=z(r.current))};return t.addEventListener("animationstart",v),t.addEventListener("animationcancel",p),t.addEventListener("animationend",p),()=>{m.clearTimeout(u),t.removeEventListener("animationstart",v),t.removeEventListener("animationcancel",p),t.removeEventListener("animationend",p)}}else f("ANIMATION_END")},[t,f]),{isPresent:["mounted","unmountSuspended"].includes(s),ref:i.useCallback(u=>{u&&(r.current=getComputedStyle(u)),n(u)},[])}}function z(e){return(e==null?void 0:e.animationName)||"none"}function zn(e){var r,o;let t=(r=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(o=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var fe=0;function Vn(){i.useEffect(()=>{const e=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",e[0]??Fe()),document.body.insertAdjacentElement("beforeend",e[1]??Fe()),fe++,()=>{fe===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(t=>t.remove()),fe--}},[])}function Fe(){const e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}var S=function(){return S=Object.assign||function(t){for(var n,r=1,o=arguments.length;r<o;r++){n=arguments[r];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},S.apply(this,arguments)};function xt(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n}function Gn(e,t,n){if(n||arguments.length===2)for(var r=0,o=t.length,a;r<o;r++)(a||!(r in t))&&(a||(a=Array.prototype.slice.call(t,0,r)),a[r]=t[r]);return e.concat(a||Array.prototype.slice.call(t))}var ne="right-scroll-bar-position",re="width-before-scroll-bar",Hn="with-scroll-bars-hidden",Kn="--removed-body-scroll-bar-size";function me(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function Yn(e,t){var n=i.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(r){var o=n.value;o!==r&&(n.value=r,n.callback(r,o))}}}})[0];return n.callback=t,n.facade}var Xn=typeof window<"u"?i.useLayoutEffect:i.useEffect,We=new WeakMap;function Zn(e,t){var n=Yn(null,function(r){return e.forEach(function(o){return me(o,r)})});return Xn(function(){var r=We.get(n);if(r){var o=new Set(r),a=new Set(e),c=n.current;o.forEach(function(s){a.has(s)||me(s,null)}),a.forEach(function(s){o.has(s)||me(s,c)})}We.set(n,e)},[e]),n}function Qn(e){return e}function Jn(e,t){t===void 0&&(t=Qn);var n=[],r=!1,o={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(a){var c=t(a,r);return n.push(c),function(){n=n.filter(function(s){return s!==c})}},assignSyncMedium:function(a){for(r=!0;n.length;){var c=n;n=[],c.forEach(a)}n={push:function(s){return a(s)},filter:function(){return n}}},assignMedium:function(a){r=!0;var c=[];if(n.length){var s=n;n=[],s.forEach(a),c=n}var f=function(){var m=c;c=[],m.forEach(a)},u=function(){return Promise.resolve().then(f)};u(),n={push:function(m){c.push(m),u()},filter:function(m){return c=c.filter(m),n}}}};return o}function er(e){e===void 0&&(e={});var t=Jn(null);return t.options=S({async:!0,ssr:!1},e),t}var bt=function(e){var t=e.sideCar,n=xt(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw new Error("Sidecar medium not found");return i.createElement(r,S({},n))};bt.isSideCarExport=!0;function tr(e,t){return e.useMedium(t),bt}var Et=er(),pe=function(){},se=i.forwardRef(function(e,t){var n=i.useRef(null),r=i.useState({onScrollCapture:pe,onWheelCapture:pe,onTouchMoveCapture:pe}),o=r[0],a=r[1],c=e.forwardProps,s=e.children,f=e.className,u=e.removeScrollBar,m=e.enabled,p=e.shards,v=e.sideCar,h=e.noIsolation,C=e.inert,d=e.allowPinchZoom,g=e.as,y=g===void 0?"div":g,N=e.gapMode,b=xt(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),E=v,w=Zn([n,t]),D=S(S({},b),o);return i.createElement(i.Fragment,null,m&&i.createElement(E,{sideCar:Et,removeScrollBar:u,shards:p,noIsolation:h,inert:C,setCallbacks:a,allowPinchZoom:!!d,lockRef:n,gapMode:N}),c?i.cloneElement(i.Children.only(s),S(S({},D),{ref:w})):i.createElement(y,S({},D,{className:f,ref:w}),s))});se.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};se.classNames={fullWidth:re,zeroRight:ne};var nr=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function rr(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=nr();return t&&e.setAttribute("nonce",t),e}function or(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function ar(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var ir=function(){var e=0,t=null;return{add:function(n){e==0&&(t=rr())&&(or(t,n),ar(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},sr=function(){var e=ir();return function(t,n){i.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},Ct=function(){var e=sr(),t=function(n){var r=n.styles,o=n.dynamic;return e(r,o),null};return t},cr={left:0,top:0,right:0,gap:0},ve=function(e){return parseInt(e||"",10)||0},lr=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],o=t[e==="padding"?"paddingRight":"marginRight"];return[ve(n),ve(r),ve(o)]},ur=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return cr;var t=lr(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},dr=Ct(),$="data-scroll-locked",fr=function(e,t,n,r){var o=e.left,a=e.top,c=e.right,s=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(Hn,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(s,"px ").concat(r,`;
  }
  body[`).concat($,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),n==="margin"&&`
    padding-left: `.concat(o,`px;
    padding-top: `).concat(a,`px;
    padding-right: `).concat(c,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(s,"px ").concat(r,`;
    `),n==="padding"&&"padding-right: ".concat(s,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(ne,` {
    right: `).concat(s,"px ").concat(r,`;
  }
  
  .`).concat(re,` {
    margin-right: `).concat(s,"px ").concat(r,`;
  }
  
  .`).concat(ne," .").concat(ne,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(re," .").concat(re,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat($,`] {
    `).concat(Kn,": ").concat(s,`px;
  }
`)},Be=function(){var e=parseInt(document.body.getAttribute($)||"0",10);return isFinite(e)?e:0},mr=function(){i.useEffect(function(){return document.body.setAttribute($,(Be()+1).toString()),function(){var e=Be()-1;e<=0?document.body.removeAttribute($):document.body.setAttribute($,e.toString())}},[])},pr=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,o=r===void 0?"margin":r;mr();var a=i.useMemo(function(){return ur(o)},[o]);return i.createElement(dr,{styles:fr(a,!t,o,n?"":"!important")})},ye=!1;if(typeof window<"u")try{var V=Object.defineProperty({},"passive",{get:function(){return ye=!0,!0}});window.addEventListener("test",V,V),window.removeEventListener("test",V,V)}catch{ye=!1}var F=ye?{passive:!1}:!1,vr=function(e){return e.tagName==="TEXTAREA"},wt=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!vr(e)&&n[t]==="visible")},gr=function(e){return wt(e,"overflowY")},hr=function(e){return wt(e,"overflowX")},$e=function(e,t){var n=t.ownerDocument,r=t;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var o=Nt(e,r);if(o){var a=At(e,r),c=a[1],s=a[2];if(c>s)return!0}r=r.parentNode}while(r&&r!==n.body);return!1},yr=function(e){var t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight;return[t,n,r]},xr=function(e){var t=e.scrollLeft,n=e.scrollWidth,r=e.clientWidth;return[t,n,r]},Nt=function(e,t){return e==="v"?gr(t):hr(t)},At=function(e,t){return e==="v"?yr(t):xr(t)},br=function(e,t){return e==="h"&&t==="rtl"?-1:1},Er=function(e,t,n,r,o){var a=br(e,window.getComputedStyle(t).direction),c=a*r,s=n.target,f=t.contains(s),u=!1,m=c>0,p=0,v=0;do{var h=At(e,s),C=h[0],d=h[1],g=h[2],y=d-g-a*C;(C||y)&&Nt(e,s)&&(p+=y,v+=C),s instanceof ShadowRoot?s=s.host:s=s.parentNode}while(!f&&s!==document.body||f&&(t.contains(s)||t===s));return(m&&(Math.abs(p)<1||!o)||!m&&(Math.abs(v)<1||!o))&&(u=!0),u},G=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},Ue=function(e){return[e.deltaX,e.deltaY]},qe=function(e){return e&&"current"in e?e.current:e},Cr=function(e,t){return e[0]===t[0]&&e[1]===t[1]},wr=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},Nr=0,W=[];function Ar(e){var t=i.useRef([]),n=i.useRef([0,0]),r=i.useRef(),o=i.useState(Nr++)[0],a=i.useState(Ct)[0],c=i.useRef(e);i.useEffect(function(){c.current=e},[e]),i.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(o));var d=Gn([e.lockRef.current],(e.shards||[]).map(qe),!0).filter(Boolean);return d.forEach(function(g){return g.classList.add("allow-interactivity-".concat(o))}),function(){document.body.classList.remove("block-interactivity-".concat(o)),d.forEach(function(g){return g.classList.remove("allow-interactivity-".concat(o))})}}},[e.inert,e.lockRef.current,e.shards]);var s=i.useCallback(function(d,g){if("touches"in d&&d.touches.length===2||d.type==="wheel"&&d.ctrlKey)return!c.current.allowPinchZoom;var y=G(d),N=n.current,b="deltaX"in d?d.deltaX:N[0]-y[0],E="deltaY"in d?d.deltaY:N[1]-y[1],w,D=d.target,x=Math.abs(b)>Math.abs(E)?"h":"v";if("touches"in d&&x==="h"&&D.type==="range")return!1;var T=$e(x,D);if(!T)return!0;if(T?w=x:(w=x==="v"?"h":"v",T=$e(x,D)),!T)return!1;if(!r.current&&"changedTouches"in d&&(b||E)&&(r.current=w),!w)return!0;var q=r.current||w;return Er(q,g,d,q==="h"?b:E,!0)},[]),f=i.useCallback(function(d){var g=d;if(!(!W.length||W[W.length-1]!==a)){var y="deltaY"in g?Ue(g):G(g),N=t.current.filter(function(w){return w.name===g.type&&(w.target===g.target||g.target===w.shadowParent)&&Cr(w.delta,y)})[0];if(N&&N.should){g.cancelable&&g.preventDefault();return}if(!N){var b=(c.current.shards||[]).map(qe).filter(Boolean).filter(function(w){return w.contains(g.target)}),E=b.length>0?s(g,b[0]):!c.current.noIsolation;E&&g.cancelable&&g.preventDefault()}}},[]),u=i.useCallback(function(d,g,y,N){var b={name:d,delta:g,target:y,should:N,shadowParent:Sr(y)};t.current.push(b),setTimeout(function(){t.current=t.current.filter(function(E){return E!==b})},1)},[]),m=i.useCallback(function(d){n.current=G(d),r.current=void 0},[]),p=i.useCallback(function(d){u(d.type,Ue(d),d.target,s(d,e.lockRef.current))},[]),v=i.useCallback(function(d){u(d.type,G(d),d.target,s(d,e.lockRef.current))},[]);i.useEffect(function(){return W.push(a),e.setCallbacks({onScrollCapture:p,onWheelCapture:p,onTouchMoveCapture:v}),document.addEventListener("wheel",f,F),document.addEventListener("touchmove",f,F),document.addEventListener("touchstart",m,F),function(){W=W.filter(function(d){return d!==a}),document.removeEventListener("wheel",f,F),document.removeEventListener("touchmove",f,F),document.removeEventListener("touchstart",m,F)}},[]);var h=e.removeScrollBar,C=e.inert;return i.createElement(i.Fragment,null,C?i.createElement(a,{styles:wr(o)}):null,h?i.createElement(pr,{gapMode:e.gapMode}):null)}function Sr(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const Dr=tr(Et,Ar);var St=i.forwardRef(function(e,t){return i.createElement(se,S({},e,{ref:t,sideCar:Dr}))});St.classNames=se.classNames;var Tr=function(e){if(typeof document>"u")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},B=new WeakMap,H=new WeakMap,K={},ge=0,Dt=function(e){return e&&(e.host||Dt(e.parentNode))},Rr=function(e,t){return t.map(function(n){if(e.contains(n))return n;var r=Dt(n);return r&&e.contains(r)?r:(console.error("aria-hidden",n,"in not contained inside",e,". Doing nothing"),null)}).filter(function(n){return!!n})},Pr=function(e,t,n,r){var o=Rr(t,Array.isArray(e)?e:[e]);K[n]||(K[n]=new WeakMap);var a=K[n],c=[],s=new Set,f=new Set(o),u=function(p){!p||s.has(p)||(s.add(p),u(p.parentNode))};o.forEach(u);var m=function(p){!p||f.has(p)||Array.prototype.forEach.call(p.children,function(v){if(s.has(v))m(v);else try{var h=v.getAttribute(r),C=h!==null&&h!=="false",d=(B.get(v)||0)+1,g=(a.get(v)||0)+1;B.set(v,d),a.set(v,g),c.push(v),d===1&&C&&H.set(v,!0),g===1&&v.setAttribute(n,"true"),C||v.setAttribute(r,"true")}catch(y){console.error("aria-hidden: cannot operate on ",v,y)}})};return m(t),s.clear(),ge++,function(){c.forEach(function(p){var v=B.get(p)-1,h=a.get(p)-1;B.set(p,v),a.set(p,h),v||(H.has(p)||p.removeAttribute(r),H.delete(p)),h||p.removeAttribute(n)}),ge--,ge||(B=new WeakMap,B=new WeakMap,H=new WeakMap,K={})}},Or=function(e,t,n){n===void 0&&(n="data-aria-hidden");var r=Array.from(Array.isArray(e)?e:[e]),o=Tr(e);return o?(r.push.apply(r,Array.from(o.querySelectorAll("[aria-live]"))),Pr(r,o,n,"aria-hidden")):function(){return null}},xe="Dialog",[Tt,Rt]=ft(xe),[_r,A]=Tt(xe),Pt=e=>{const{__scopeDialog:t,children:n,open:r,defaultOpen:o,onOpenChange:a,modal:c=!0}=e,s=i.useRef(null),f=i.useRef(null),[u=!1,m]=Nn({prop:r,defaultProp:o,onChange:a});return l.jsx(_r,{scope:t,triggerRef:s,contentRef:f,contentId:le(),titleId:le(),descriptionId:le(),open:u,onOpenChange:m,onOpenToggle:i.useCallback(()=>m(p=>!p),[m]),modal:c,children:n})};Pt.displayName=xe;var Ot="DialogTrigger",_t=i.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,o=A(Ot,n),a=P(t,o.triggerRef);return l.jsx(O.button,{type:"button","aria-haspopup":"dialog","aria-expanded":o.open,"aria-controls":o.contentId,"data-state":Ce(o.open),...r,ref:a,onClick:R(e.onClick,o.onOpenToggle)})});_t.displayName=Ot;var be="DialogPortal",[kr,kt]=Tt(be,{forceMount:void 0}),Mt=e=>{const{__scopeDialog:t,forceMount:n,children:r,container:o}=e,a=A(be,t);return l.jsx(kr,{scope:t,forceMount:n,children:i.Children.map(r,c=>l.jsx(ie,{present:n||a.open,children:l.jsx(yt,{asChild:!0,container:o,children:c})}))})};Mt.displayName=be;var ae="DialogOverlay",It=i.forwardRef((e,t)=>{const n=kt(ae,e.__scopeDialog),{forceMount:r=n.forceMount,...o}=e,a=A(ae,e.__scopeDialog);return a.modal?l.jsx(ie,{present:r||a.open,children:l.jsx(Mr,{...o,ref:t})}):null});It.displayName=ae;var Mr=i.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,o=A(ae,n);return l.jsx(St,{as:vn,allowPinchZoom:!0,shards:[o.contentRef],children:l.jsx(O.div,{"data-state":Ce(o.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),j="DialogContent",jt=i.forwardRef((e,t)=>{const n=kt(j,e.__scopeDialog),{forceMount:r=n.forceMount,...o}=e,a=A(j,e.__scopeDialog);return l.jsx(ie,{present:r||a.open,children:a.modal?l.jsx(Ir,{...o,ref:t}):l.jsx(jr,{...o,ref:t})})});jt.displayName=j;var Ir=i.forwardRef((e,t)=>{const n=A(j,e.__scopeDialog),r=i.useRef(null),o=P(t,n.contentRef,r);return i.useEffect(()=>{const a=r.current;if(a)return Or(a)},[]),l.jsx(Lt,{...e,ref:o,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:R(e.onCloseAutoFocus,a=>{var c;a.preventDefault(),(c=n.triggerRef.current)==null||c.focus()}),onPointerDownOutside:R(e.onPointerDownOutside,a=>{const c=a.detail.originalEvent,s=c.button===0&&c.ctrlKey===!0;(c.button===2||s)&&a.preventDefault()}),onFocusOutside:R(e.onFocusOutside,a=>a.preventDefault())})}),jr=i.forwardRef((e,t)=>{const n=A(j,e.__scopeDialog),r=i.useRef(!1),o=i.useRef(!1);return l.jsx(Lt,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:a=>{var c,s;(c=e.onCloseAutoFocus)==null||c.call(e,a),a.defaultPrevented||(r.current||(s=n.triggerRef.current)==null||s.focus(),a.preventDefault()),r.current=!1,o.current=!1},onInteractOutside:a=>{var f,u;(f=e.onInteractOutside)==null||f.call(e,a),a.defaultPrevented||(r.current=!0,a.detail.originalEvent.type==="pointerdown"&&(o.current=!0));const c=a.target;((u=n.triggerRef.current)==null?void 0:u.contains(c))&&a.preventDefault(),a.detail.originalEvent.type==="focusin"&&o.current&&a.preventDefault()}})}),Lt=i.forwardRef((e,t)=>{const{__scopeDialog:n,trapFocus:r,onOpenAutoFocus:o,onCloseAutoFocus:a,...c}=e,s=A(j,n),f=i.useRef(null),u=P(t,f);return Vn(),l.jsxs(l.Fragment,{children:[l.jsx(gt,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:o,onUnmountAutoFocus:a,children:l.jsx(pt,{role:"dialog",id:s.contentId,"aria-describedby":s.descriptionId,"aria-labelledby":s.titleId,"data-state":Ce(s.open),...c,ref:u,onDismiss:()=>s.onOpenChange(!1)})}),l.jsxs(l.Fragment,{children:[l.jsx(Fr,{titleId:s.titleId}),l.jsx(Br,{contentRef:f,descriptionId:s.descriptionId})]})]})}),Ee="DialogTitle",Ft=i.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,o=A(Ee,n);return l.jsx(O.h2,{id:o.titleId,...r,ref:t})});Ft.displayName=Ee;var Wt="DialogDescription",Bt=i.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,o=A(Wt,n);return l.jsx(O.p,{id:o.descriptionId,...r,ref:t})});Bt.displayName=Wt;var $t="DialogClose",Ut=i.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,o=A($t,n);return l.jsx(O.button,{type:"button",...r,ref:t,onClick:R(e.onClick,()=>o.onOpenChange(!1))})});Ut.displayName=$t;function Ce(e){return e?"open":"closed"}var qt="DialogTitleWarning",[Lr,zt]=bn(qt,{contentName:j,titleName:Ee,docsSlug:"dialog"}),Fr=({titleId:e})=>{const t=zt(qt),n=`\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;return i.useEffect(()=>{e&&(document.getElementById(e)||console.error(n))},[n,e]),null},Wr="DialogDescriptionWarning",Br=({contentRef:e,descriptionId:t})=>{const r=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${zt(Wr).contentName}}.`;return i.useEffect(()=>{var a;const o=(a=e.current)==null?void 0:a.getAttribute("aria-describedby");t&&o&&(document.getElementById(t)||console.warn(r))},[r,e,t]),null},$r=Pt,Ur=_t,qr=Mt,zr=It,Vr=jt,Gr=Ft,Hr=Bt,Vt=Ut,Gt="AlertDialog",[Kr,wo]=ft(Gt,[Rt]),_=Rt(),Ht=e=>{const{__scopeAlertDialog:t,...n}=e,r=_(t);return l.jsx($r,{...r,...n,modal:!0})};Ht.displayName=Gt;var Yr="AlertDialogTrigger",Kt=i.forwardRef((e,t)=>{const{__scopeAlertDialog:n,...r}=e,o=_(n);return l.jsx(Ur,{...o,...r,ref:t})});Kt.displayName=Yr;var Xr="AlertDialogPortal",Yt=e=>{const{__scopeAlertDialog:t,...n}=e,r=_(t);return l.jsx(qr,{...r,...n})};Yt.displayName=Xr;var Zr="AlertDialogOverlay",Xt=i.forwardRef((e,t)=>{const{__scopeAlertDialog:n,...r}=e,o=_(n);return l.jsx(zr,{...o,...r,ref:t})});Xt.displayName=Zr;var U="AlertDialogContent",[Qr,Jr]=Kr(U),Zt=i.forwardRef((e,t)=>{const{__scopeAlertDialog:n,children:r,...o}=e,a=_(n),c=i.useRef(null),s=P(t,c),f=i.useRef(null);return l.jsx(Lr,{contentName:U,titleName:Qt,docsSlug:"alert-dialog",children:l.jsx(Qr,{scope:n,cancelRef:f,children:l.jsxs(Vr,{role:"alertdialog",...a,...o,ref:s,onOpenAutoFocus:R(o.onOpenAutoFocus,u=>{var m;u.preventDefault(),(m=f.current)==null||m.focus({preventScroll:!0})}),onPointerDownOutside:u=>u.preventDefault(),onInteractOutside:u=>u.preventDefault(),children:[l.jsx(gn,{children:r}),l.jsx(to,{contentRef:c})]})})})});Zt.displayName=U;var Qt="AlertDialogTitle",Jt=i.forwardRef((e,t)=>{const{__scopeAlertDialog:n,...r}=e,o=_(n);return l.jsx(Gr,{...o,...r,ref:t})});Jt.displayName=Qt;var en="AlertDialogDescription",tn=i.forwardRef((e,t)=>{const{__scopeAlertDialog:n,...r}=e,o=_(n);return l.jsx(Hr,{...o,...r,ref:t})});tn.displayName=en;var eo="AlertDialogAction",nn=i.forwardRef((e,t)=>{const{__scopeAlertDialog:n,...r}=e,o=_(n);return l.jsx(Vt,{...o,...r,ref:t})});nn.displayName=eo;var rn="AlertDialogCancel",on=i.forwardRef((e,t)=>{const{__scopeAlertDialog:n,...r}=e,{cancelRef:o}=Jr(rn,n),a=_(n),c=P(t,o);return l.jsx(Vt,{...a,...r,ref:c})});on.displayName=rn;var to=({contentRef:e})=>{const t=`\`${U}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${U}\` by passing a \`${en}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${U}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;return i.useEffect(()=>{var r;document.getElementById((r=e.current)==null?void 0:r.getAttribute("aria-describedby"))||console.warn(t)},[t,e]),null},no=Ht,ro=Kt,oo=Yt,an=Xt,sn=Zt,cn=nn,ln=on,un=Jt,dn=tn;const ao=no,io=ro,so=oo,we=i.forwardRef(({className:e,...t},n)=>l.jsx(an,{className:M("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...t,ref:n}));we.displayName=an.displayName;const Ne=i.forwardRef(({className:e,...t},n)=>l.jsxs(so,{children:[l.jsx(we,{}),l.jsx(sn,{ref:n,className:M("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...t})]}));Ne.displayName=sn.displayName;const Ae=({className:e,...t})=>l.jsx("div",{className:M("flex flex-col space-y-2 text-center sm:text-left",e),...t});Ae.displayName="AlertDialogHeader";const Se=({className:e,...t})=>l.jsx("div",{className:M("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...t});Se.displayName="AlertDialogFooter";const De=i.forwardRef(({className:e,...t},n)=>l.jsx(un,{ref:n,className:M("text-lg font-semibold",e),...t}));De.displayName=un.displayName;const Te=i.forwardRef(({className:e,...t},n)=>l.jsx(dn,{ref:n,className:M("text-sm text-muted-foreground",e),...t}));Te.displayName=dn.displayName;const Re=i.forwardRef(({className:e,...t},n)=>l.jsx(cn,{ref:n,className:M(dt(),e),...t}));Re.displayName=cn.displayName;const Pe=i.forwardRef(({className:e,...t},n)=>l.jsx(ln,{ref:n,className:M(dt({variant:"outline"}),"mt-2 sm:mt-0",e),...t}));Pe.displayName=ln.displayName;we.__docgenInfo={description:"",methods:[]};Ne.__docgenInfo={description:"",methods:[]};Ae.__docgenInfo={description:"",methods:[],displayName:"AlertDialogHeader"};Se.__docgenInfo={description:"",methods:[],displayName:"AlertDialogFooter"};De.__docgenInfo={description:"",methods:[]};Te.__docgenInfo={description:"",methods:[]};Re.__docgenInfo={description:"",methods:[]};Pe.__docgenInfo={description:"",methods:[]};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fn=L("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const co=L("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=L("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=L("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uo=L("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fo=L("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mo=L("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),po=e=>{switch(e){case"success":return l.jsx(co,{className:"h-6 w-6 text-[#22c55e]"});case"warning":return l.jsx(mo,{className:"h-6 w-6 text-[#eab308]"});case"error":return l.jsx(fn,{className:"h-6 w-6 text-[#ef4444]"});default:return l.jsx(Oe,{className:"h-6 w-6 text-[#2563eb]"})}},vo=e=>{switch(e){case"success":return"border-[#22c55e]/20 ";case"warning":return"border-[#eab308]/20";case"error":return"border-[#ef4444]/20 ";default:return"border-[#2563eb]/20 "}},mn=({trigger:e,alert:t,onConfirm:n,onCancel:r,className:o})=>{const a=()=>{r==null||r()},c=()=>{n()};return l.jsxs(ao,{children:[l.jsx(io,{asChild:!0,children:l.jsxs(xn,{variant:e.variant,size:e.size,disabled:e.disabled,className:`rounded-[10px] ${o}`,children:[e.icon&&l.jsx("span",{className:"mr-2",children:e.icon}),e.text]})}),l.jsxs(Ne,{className:`border-2 ${vo(t.type??"info")}`,children:[l.jsxs(Ae,{className:"gap-4",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[po(t.type??"info"),l.jsx(De,{children:t.title})]}),t.description&&l.jsx(Te,{children:t.description})]}),l.jsxs(Se,{children:[l.jsx(Pe,{onClick:a,children:t.cancelText??"취소"}),l.jsx(Re,{onClick:c,children:t.confirmText??"확인"})]})]})]})};mn.__docgenInfo={description:`@description
CustomAlert 컴포넌트는 사용자 정의 알림 대화 상자를 생성합니다.
이 컴포넌트는 트리거 버튼을 클릭하면 나타나는 알림 대화 상자를 포함합니다.

@example
\`\`\`tsx
<CustomAlert
  trigger={{ text: 'Delete', variant: 'destructive' }}
  alert={{ title: 'Are you sure?', description: 'This action cannot be undone.', type: 'warning' }}
  onConfirm={() => console.log('Confirmed')}
  onCancel={() => console.log('Cancelled')}
/>
\`\`\`

@param {Object} props - CustomAlert 컴포넌트의 속성
@param {Object} props.trigger - 알럿 트리거 버튼 설정
@param {string} props.trigger.text - 트리거 버튼의 텍스트
@param {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'} [props.trigger.variant] - 트리거 버튼의 스타일 변형
@param {'default' | 'sm' | 'lg' | 'icon'} [props.trigger.size] - 트리거 버튼의 크기
@param {boolean} [props.trigger.disabled] - 트리거 버튼의 비활성화 여부
@param {React.ReactNode} [props.trigger.icon] - 트리거 버튼에 표시할 아이콘
@param {Object} props.alert - 알럿 내용 설정
@param {string} props.alert.title - 알럿의 제목
@param {string} [props.alert.description] - 알럿의 설명
@param {'info' | 'success' | 'warning' | 'error'} [props.alert.type] - 알럿의 유형
@param {string} [props.alert.cancelText] - 취소 버튼의 텍스트
@param {string} [props.alert.confirmText] - 확인 버튼의 텍스트
@param {Function} props.onConfirm - 확인 버튼 클릭 시 호출되는 콜백 함수
@param {Function} [props.onCancel] - 취소 버튼 클릭 시 호출되는 콜백 함수

@return {JSX.Element} 사용자 정의 알림 대화 상자 컴포넌트`,methods:[],displayName:"CustomAlert",props:{trigger:{required:!0,tsType:{name:"signature",type:"object",raw:`{
    text: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
    icon?: React.ReactNode;
}`,signature:{properties:[{key:"text",value:{name:"string",required:!0}},{key:"variant",value:{name:"union",raw:"'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'destructive'"},{name:"literal",value:"'outline'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'ghost'"},{name:"literal",value:"'link'"}],required:!1}},{key:"size",value:{name:"union",raw:"'default' | 'sm' | 'lg' | 'icon'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'icon'"}],required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"icon",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}}]}},description:""},alert:{required:!0,tsType:{name:"signature",type:"object",raw:`{
    title: string;
    description?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    cancelText?: string;
    confirmText?: string;
}`,signature:{properties:[{key:"title",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}},{key:"type",value:{name:"union",raw:"'info' | 'success' | 'warning' | 'error'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'error'"}],required:!1}},{key:"cancelText",value:{name:"string",required:!1}},{key:"confirmText",value:{name:"string",required:!1}}]}},description:""},onConfirm:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const No={title:"Components/CustomAlert",component:mn,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:`CustomAlert 컴포넌트는 사용자 정의 알림 대화 상자를 생성합니다.
이 컴포넌트는 트리거 버튼을 클릭하면 나타나는 알림 대화 상자를 포함합니다.`}}},argTypes:{trigger:{control:{type:"object"},defaultValue:{text:"Trigger",variant:"default",size:"default",disabled:!1,icon:null}},alert:{control:{type:"object"},defaultValue:{title:"Title",description:"Description",type:"info",cancelText:"Cancel",confirmText:"Confirm"}},onConfirm:{action:"confirm"},onCancel:{}}},Y={args:{trigger:{text:"알럿 열기",variant:"default"},alert:{title:"기본 알럿",description:"기본적인 알럿 메시지입니다.",type:"info"},onConfirm:()=>console.log("확인 clicked")}},X={args:{trigger:{text:"공지사항",variant:"outline",icon:l.jsx(Oe,{className:"h-4 w-4"})},alert:{type:"info",title:"업데이트 안내",description:"새로운 기능이 추가되었습니다. 지금 확인해보세요!",confirmText:"확인하기"},onConfirm:()=>console.log("info confirmed")}},Z={args:{trigger:{text:"다운로드",variant:"default",icon:l.jsx(lo,{className:"h-4 w-4"})},alert:{type:"success",title:"다운로드 완료",description:"파일이 성공적으로 다운로드되었습니다.",confirmText:"확인"},onConfirm:()=>console.log("success confirmed")}},Q={args:{trigger:{text:"나가기",variant:"outline",icon:l.jsx(uo,{className:"h-4 w-4"})},alert:{type:"warning",title:"변경사항이 있습니다",description:"저장하지 않고 나가시겠습니까?",confirmText:"나가기",cancelText:"취소"},onConfirm:()=>console.log("warning confirmed"),onCancel:()=>console.log("warning cancelled")}},J={args:{trigger:{text:"삭제",variant:"destructive",icon:l.jsx(fo,{className:"h-4 w-4"})},alert:{type:"error",title:"삭제 확인",description:"이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",confirmText:"삭제",cancelText:"취소"},onConfirm:()=>console.log("error confirmed"),onCancel:()=>console.log("error cancelled")}},ee={args:{trigger:{text:"실행 불가",variant:"default",disabled:!0,icon:l.jsx(fn,{className:"h-4 w-4"})},alert:{type:"info",title:"실행할 수 없음",description:"현재 이 작업을 실행할 수 없습니다."},onConfirm:()=>console.log("disabled confirmed")}},te={args:{trigger:{text:"상세 정보",variant:"outline",icon:l.jsx(Oe,{className:"h-4 w-4"})},alert:{type:"info",title:"이용약관 변경 안내",description:`이용약관이 변경되었습니다. 주요 변경사항은 다음과 같습니다:
  
        1. 개인정보 보호정책 강화
        2. 서비스 이용규칙 개선
        3. 결제 정책 변경
        
        자세한 내용은 공지사항을 참고해주세요.`,confirmText:"확인했습니다"},onConfirm:()=>console.log("long content confirmed")}};var ze,Ve,Ge;Y.parameters={...Y.parameters,docs:{...(ze=Y.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  args: {
    trigger: {
      text: '알럿 열기',
      variant: 'default'
    },
    alert: {
      title: '기본 알럿',
      description: '기본적인 알럿 메시지입니다.',
      type: 'info'
    },
    onConfirm: () => console.log('확인 clicked')
  }
}`,...(Ge=(Ve=Y.parameters)==null?void 0:Ve.docs)==null?void 0:Ge.source}}};var He,Ke,Ye;X.parameters={...X.parameters,docs:{...(He=X.parameters)==null?void 0:He.docs,source:{originalSource:`{
  args: {
    trigger: {
      text: '공지사항',
      variant: 'outline',
      icon: <Info className="h-4 w-4" />
    },
    alert: {
      type: 'info',
      title: '업데이트 안내',
      description: '새로운 기능이 추가되었습니다. 지금 확인해보세요!',
      confirmText: '확인하기'
    },
    onConfirm: () => console.log('info confirmed')
  }
}`,...(Ye=(Ke=X.parameters)==null?void 0:Ke.docs)==null?void 0:Ye.source}}};var Xe,Ze,Qe;Z.parameters={...Z.parameters,docs:{...(Xe=Z.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  args: {
    trigger: {
      text: '다운로드',
      variant: 'default',
      icon: <Download className="h-4 w-4" />
    },
    alert: {
      type: 'success',
      title: '다운로드 완료',
      description: '파일이 성공적으로 다운로드되었습니다.',
      confirmText: '확인'
    },
    onConfirm: () => console.log('success confirmed')
  }
}`,...(Qe=(Ze=Z.parameters)==null?void 0:Ze.docs)==null?void 0:Qe.source}}};var Je,et,tt;Q.parameters={...Q.parameters,docs:{...(Je=Q.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    trigger: {
      text: '나가기',
      variant: 'outline',
      icon: <LogOut className="h-4 w-4" />
    },
    alert: {
      type: 'warning',
      title: '변경사항이 있습니다',
      description: '저장하지 않고 나가시겠습니까?',
      confirmText: '나가기',
      cancelText: '취소'
    },
    onConfirm: () => console.log('warning confirmed'),
    onCancel: () => console.log('warning cancelled')
  }
}`,...(tt=(et=Q.parameters)==null?void 0:et.docs)==null?void 0:tt.source}}};var nt,rt,ot;J.parameters={...J.parameters,docs:{...(nt=J.parameters)==null?void 0:nt.docs,source:{originalSource:`{
  args: {
    trigger: {
      text: '삭제',
      variant: 'destructive',
      icon: <Trash2 className="h-4 w-4" />
    },
    alert: {
      type: 'error',
      title: '삭제 확인',
      description: '이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소'
    },
    onConfirm: () => console.log('error confirmed'),
    onCancel: () => console.log('error cancelled')
  }
}`,...(ot=(rt=J.parameters)==null?void 0:rt.docs)==null?void 0:ot.source}}};var at,it,st;ee.parameters={...ee.parameters,docs:{...(at=ee.parameters)==null?void 0:at.docs,source:{originalSource:`{
  args: {
    trigger: {
      text: '실행 불가',
      variant: 'default',
      disabled: true,
      icon: <AlertCircle className="h-4 w-4" />
    },
    alert: {
      type: 'info',
      title: '실행할 수 없음',
      description: '현재 이 작업을 실행할 수 없습니다.'
    },
    onConfirm: () => console.log('disabled confirmed')
  }
}`,...(st=(it=ee.parameters)==null?void 0:it.docs)==null?void 0:st.source}}};var ct,lt,ut;te.parameters={...te.parameters,docs:{...(ct=te.parameters)==null?void 0:ct.docs,source:{originalSource:`{
  args: {
    trigger: {
      text: '상세 정보',
      variant: 'outline',
      icon: <Info className="h-4 w-4" />
    },
    alert: {
      type: 'info',
      title: '이용약관 변경 안내',
      description: \`이용약관이 변경되었습니다. 주요 변경사항은 다음과 같습니다:
  
        1. 개인정보 보호정책 강화
        2. 서비스 이용규칙 개선
        3. 결제 정책 변경
        
        자세한 내용은 공지사항을 참고해주세요.\`,
      confirmText: '확인했습니다'
    },
    onConfirm: () => console.log('long content confirmed')
  }
}`,...(ut=(lt=te.parameters)==null?void 0:lt.docs)==null?void 0:ut.source}}};const Ao=["Default","InfoType","Success","Warning","Error","DisabledTrigger","LongContent"];export{Y as Default,ee as DisabledTrigger,J as Error,X as InfoType,te as LongContent,Z as Success,Q as Warning,Ao as __namedExportsOrder,No as default};
