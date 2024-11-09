import{j as B}from"./jsx-runtime-CkxqCPlQ.js";import{r as D}from"./index-DJO9vBfz.js";import{c as I,S as R}from"./utils-D29h-Vwk.js";function z(t){var r,e,n="";if(typeof t=="string"||typeof t=="number")n+=t;else if(typeof t=="object")if(Array.isArray(t))for(r=0;r<t.length;r++)t[r]&&(e=z(t[r]))&&(n&&(n+=" "),n+=e);else for(r in t)t[r]&&(n&&(n+=" "),n+=r);return n}function K(){for(var t,r,e=0,n="";e<arguments.length;)(t=arguments[e++])&&(r=z(t))&&(n&&(n+=" "),n+=r);return n}const b=t=>typeof t=="boolean"?"".concat(t):t===0?"0":t,y=K,U=(t,r)=>e=>{var n;if((r==null?void 0:r.variants)==null)return y(t,e==null?void 0:e.class,e==null?void 0:e.className);const{variants:a,defaultVariants:o}=r,c=Object.keys(a).map(s=>{const i=e==null?void 0:e[s],d=o==null?void 0:o[s];if(i===null)return null;const l=b(i)||b(d);return a[s][l]}),x=e&&Object.entries(e).reduce((s,i)=>{let[d,l]=i;return l===void 0||(s[d]=l),s},{}),A=r==null||(n=r.compoundVariants)===null||n===void 0?void 0:n.reduce((s,i)=>{let{class:d,className:l,...$}=i;return Object.entries($).every(P=>{let[h,p]=P;return Array.isArray(p)?p.includes({...o,...x}[h]):{...o,...x}[h]===p})?[...s,d,l]:s},[]);return y(t,c,A,e==null?void 0:e.class,e==null?void 0:e.className)},W=U("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),g=D.forwardRef(({className:t,variant:r,size:e,asChild:n=!1,...a},o)=>{const c=n?R:"button";return B.jsx(c,{className:I(W({variant:r,size:e,className:t})),ref:o,...a})});g.displayName="Button";g.__docgenInfo={description:"",methods:[],displayName:"Button",props:{asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}},composes:["VariantProps"]};const O=({text:t,isFulfill:r=!1,clickEvent:e,disabled:n=!1})=>{const a=r?"bg-blue-600":"bg-white",o=r?"text-white":"text-[#3565e3]",c=r?"hover:bg-blue-800":"hover:bg-[#f5f5f5]";return B.jsx(g,{className:`${n?"disabled":""} w-[557px] h-[47px] rounded-[10px] border-2 border-[#3565e3] ${a} ${o} ${c}`,onClick:()=>e(),children:t})};O.__docgenInfo={description:"",methods:[],displayName:"CommonButton",props:{text:{required:!1,tsType:{name:"string"},description:""},isFulfill:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},clickEvent:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},width:{required:!1,tsType:{name:"string"},description:""},height:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const L={title:"Components/Common/CommonButton",component:O,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{text:{control:"text",description:"버튼에 표시될 텍스트"},isFulfill:{control:"boolean",description:"버튼의 스타일을 결정하는 플래그"},clickEvent:{action:"clicked",description:"버튼 클릭 시 실행될 이벤트 핸들러"},width:{control:"text",description:"버튼의 너비"},height:{control:"text",description:"버튼의 높이"}}},u={args:{text:"기본 버튼",isFulfill:!1,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},m={args:{text:"활성화 버튼",isFulfill:!0,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},f={args:{text:"커스텀 크기 버튼",isFulfill:!0,width:"300px",height:"40px",clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},v={args:{text:"클릭해보세요",isFulfill:!0,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}};var C,k,w;u.parameters={...u.parameters,docs:{...(C=u.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    text: '기본 버튼',
    isFulfill: false,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(w=(k=u.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var E,V,N;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    text: '활성화 버튼',
    isFulfill: true,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(N=(V=m.parameters)==null?void 0:V.docs)==null?void 0:N.source}}};var F,j,S;f.parameters={...f.parameters,docs:{...(F=f.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    text: '커스텀 크기 버튼',
    isFulfill: true,
    width: '300px',
    height: '40px',
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(S=(j=f.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var T,_,q;v.parameters={...v.parameters,docs:{...(T=v.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    text: '클릭해보세요',
    isFulfill: true,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(q=(_=v.parameters)==null?void 0:_.docs)==null?void 0:q.source}}};const M=["Default","Fulfilled","CustomSize","ClickEvent"];export{v as ClickEvent,f as CustomSize,u as Default,m as Fulfilled,M as __namedExportsOrder,L as default};
