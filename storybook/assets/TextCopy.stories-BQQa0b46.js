import{j as t}from"./jsx-runtime-DR9Q75dM.js";import{T as i}from"./Typogrpahy-DZj-QM6w.js";import{c as l}from"./createLucideIcon-B4XAxcv3.js";import"./index-DRjF_FHU.js";/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=l("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]),n=({text:r,size:p="4xl"})=>{const c=()=>{navigator.clipboard.writeText(r)};return t.jsxs("div",{className:"flex flex-row gap-2 items-center",children:[t.jsx(i,{text:r,color:"black",size:p}),t.jsx(x,{onClick:c,className:"hover:scale-110 active:scale-105 trasition-all cursor-pointer"})]})};n.__docgenInfo={description:`@description
주어진 텍스트를 복사할 수 있는 컴포넌트입니다.

@example
\`\`\`tsx
<TextCopy text="복사할 텍스트" size="2xl" />
\`\`\`

@param text - 복사할 텍스트입니다.
@param size - 텍스트의 크기를 지정합니다. 기본값은 '4xl'입니다.
@returns 주어진 텍스트와 복사 아이콘을 포함하는 컴포넌트를 반환합니다.`,methods:[],displayName:"TextCopy",props:{text:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"TypographyProps['size']",raw:"TypographyProps['size']"},description:"",defaultValue:{value:"'4xl'",computed:!1}}}};const f={title:"Components/TextCopy",component:n,tags:["autodocs"],args:{text:"이것은 복사할 텍스트입니다."}},e={args:{text:"이것은 복사할 텍스트입니다."}};var s,o,a;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    text: '이것은 복사할 텍스트입니다.'
  }
}`,...(a=(o=e.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};const g=["Default"];export{e as Default,g as __namedExportsOrder,f as default};
