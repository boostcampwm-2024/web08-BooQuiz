import{j as F}from"./jsx-runtime-DR9Q75dM.js";import{B as w}from"./button-DC7OJGv3.js";import"./index-DRjF_FHU.js";import"./utils-DcIm4c_J.js";const h=({text:v,isFulfill:n=!1,clickEvent:k,disabled:C=!1})=>{const b=n?"bg-blue-600":"bg-white",E=n?"text-white":"text-[#3565e3]",y=n?"hover:bg-blue-800":"hover:bg-[#f5f5f5]";return F.jsx(w,{className:`${C?"disabled":""} w-[557px] h-[47px] rounded-[10px] border-2 border-[#3565e3] ${b} ${E} ${y}`,onClick:()=>k(),children:v})};h.__docgenInfo={description:"",methods:[],displayName:"CommonButton",props:{text:{required:!1,tsType:{name:"string"},description:""},isFulfill:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},clickEvent:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},width:{required:!1,tsType:{name:"string"},description:""},height:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const _={title:"Components/Common/CommonButton",component:h,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{text:{control:"text",description:"버튼에 표시될 텍스트"},isFulfill:{control:"boolean",description:"버튼의 스타일을 결정하는 플래그"},clickEvent:{action:"clicked",description:"버튼 클릭 시 실행될 이벤트 핸들러"},width:{control:"text",description:"버튼의 너비"},height:{control:"text",description:"버튼의 높이"}}},e={args:{text:"기본 버튼",isFulfill:!1,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},t={args:{text:"활성화 버튼",isFulfill:!0,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},r={args:{text:"커스텀 크기 버튼",isFulfill:!0,width:"300px",height:"40px",clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}},s={args:{text:"클릭해보세요",isFulfill:!0,clickEvent:()=>{alert("버튼이 클릭되었습니다!")}}};var o,a,i;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    text: '기본 버튼',
    isFulfill: false,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(i=(a=e.parameters)==null?void 0:a.docs)==null?void 0:i.source}}};var l,c,u;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    text: '활성화 버튼',
    isFulfill: true,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(u=(c=t.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var d,p,m;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    text: '커스텀 크기 버튼',
    isFulfill: true,
    width: '300px',
    height: '40px',
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var f,g,x;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    text: '클릭해보세요',
    isFulfill: true,
    clickEvent: () => {
      alert('버튼이 클릭되었습니다!');
    }
  }
}`,...(x=(g=s.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const $=["Default","Fulfilled","CustomSize","ClickEvent"];export{s as ClickEvent,r as CustomSize,e as Default,t as Fulfilled,$ as __namedExportsOrder,_ as default};
