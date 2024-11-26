import{j as r}from"./jsx-runtime-DR9Q75dM.js";import{T as l}from"./Typogrpahy-DnsS6UIb.js";import{c as d}from"./createLucideIcon-B4XAxcv3.js";import"./index-DRjF_FHU.js";/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=d("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]),p=({text:t,size:n="4xl",bold:i=!1})=>{const c=()=>{navigator.clipboard.writeText(t)};return r.jsxs("div",{className:"flex flex-row gap-2 items-center",children:[r.jsx(l,{text:t,color:"black",size:n,bold:i}),r.jsx(m,{onClick:c,className:"active:scale-105 trasition-all cursor-pointer h-1/2 hover:scale-125"})]})};p.__docgenInfo={description:`@description
주어진 텍스트를 복사할 수 있는 컴포넌트입니다.

@example
\`\`\`tsx
<TextCopy text="복사할 텍스트" size="2xl" />
\`\`\`

@param text - 복사할 텍스트입니다.
@param size - 텍스트의 크기를 지정합니다. 기본값은 '4xl'입니다.
@returns 주어진 텍스트와 복사 아이콘을 포함하는 컴포넌트를 반환합니다.`,methods:[],displayName:"TextCopy",props:{text:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"TypographyProps['size']",raw:"TypographyProps['size']"},description:"",defaultValue:{value:"'4xl'",computed:!1}},bold:{required:!1,tsType:{name:"TypographyProps['bold']",raw:"TypographyProps['bold']"},description:"",defaultValue:{value:"false",computed:!1}}}};const g={title:"Components/TextCopy",component:p,tags:["autodocs"],args:{text:"이것은 복사할 텍스트입니다."}},e={args:{text:"이것은 복사할 텍스트입니다."}};var a,o,s;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    text: '이것은 복사할 텍스트입니다.'
  }
}`,...(s=(o=e.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};const h=["Default"];export{e as Default,h as __namedExportsOrder,g as default};
