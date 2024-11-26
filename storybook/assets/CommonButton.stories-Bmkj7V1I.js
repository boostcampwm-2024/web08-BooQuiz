import{j as T}from"./jsx-runtime-DR9Q75dM.js";import{r as B}from"./index-DRjF_FHU.js";const n=B.forwardRef(({text:v,isFilled:y=!1,clickEvent:E,disabled:e=!1,className:k="",type:C="button",...a},F)=>{const w=["rounded-lg","border-2","px-4","py-2","font-medium","transition-all","duration-200","focus:outline-none","focus:ring-2","focus:ring-blue-600","focus:ring-offset-2"],q=y?["border-blue-600","bg-blue-600","text-white","hover:bg-blue-700","hover:border-blue-700",e&&"opacity-50 hover:bg-blue-600 hover:border-blue-600"]:["border-blue-600","bg-white","text-blue-600","hover:bg-blue-50",e&&"opacity-50 hover:bg-white"],S=[...w,...q,e&&"cursor-not-allowed",k].filter(Boolean).join(" ");return T.jsxs("button",{ref:F,type:C,className:S,onClick:E,disabled:e,...a,children:[v,a.children]})});n.displayName="CommonButton";n.__docgenInfo={description:"",methods:[],displayName:"CommonButton",props:{text:{required:!1,tsType:{name:"string"},description:""},isFilled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},clickEvent:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},width:{required:!1,tsType:{name:"string"},description:""},height:{required:!1,tsType:{name:"string"},description:""},disabled:{defaultValue:{value:"false",computed:!1},required:!1},className:{defaultValue:{value:"''",computed:!1},required:!1},type:{defaultValue:{value:"'button'",computed:!1},required:!1}},composes:["ButtonHTMLAttributes"]};const V={title:"Components/Common/CommonButton",component:n,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{text:{control:"text",description:"버튼에 표시될 텍스트"},isFilled:{control:"boolean",description:"버튼의 스타일을 결정하는 플래그"},clickEvent:{action:"clicked",description:"버튼 클릭 시 실행될 이벤트 핸들러"},width:{control:"text",description:"버튼의 너비"},height:{control:"text",description:"버튼의 높이"}}},t={args:{text:"기본 버튼",isFilled:!1,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},r={args:{text:"활성화 버튼",isFilled:!0,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},o={args:{text:"커스텀 크기 버튼",isFilled:!0,width:"300px",height:"40px",clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},s={args:{text:"클릭해보세요",isFilled:!0,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}};var i,l,c;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    text: '기본 버튼',
    isFilled: false,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(c=(l=t.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var u,d,m;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    text: '활성화 버튼',
    isFilled: true,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(m=(d=r.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var p,f,g;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    text: '커스텀 크기 버튼',
    isFilled: true,
    width: '300px',
    height: '40px',
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(g=(f=o.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var b,x,h;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    text: '클릭해보세요',
    isFilled: true,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(h=(x=s.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};const _=["Default","Fulfilled","CustomSize","ClickEvent"];export{s as ClickEvent,o as CustomSize,t as Default,r as Fulfilled,_ as __namedExportsOrder,V as default};
