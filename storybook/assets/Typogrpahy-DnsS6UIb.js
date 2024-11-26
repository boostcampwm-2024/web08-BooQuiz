import{j as x}from"./jsx-runtime-DR9Q75dM.js";const o=({text:a,size:t,color:r,bold:s=!1})=>{const e={xs:"text-xs",sm:"text-sm",base:"text-base",lg:"text-lg",xl:"text-xl","2xl":"text-2xl","3xl":"text-3xl","4xl":"text-4xl","5xl":"text-5xl","6xl":"text-6xl"},l={gray:"text-gray-400",red:"text-red-600",blue:"text-blue-600",black:"text-black"},n=`break-all ${e[t]||e.base} ${l[r]||l.black} ${s?"font-bold":""}`;return x.jsx("p",{className:n,children:a})};o.__docgenInfo={description:`@description
\`Typography\` 컴포넌트는 Tailwind CSS를 사용하여 텍스트의 크기와 색상을 조절할 수 있도록 합니다.

@component
@example
\`\`\`tsx
<Typography text="Hello World" size="lg" color="red" />
\`\`\`

@param {TypographyProps} props - 컴포넌트에 전달되는 props
@param {string} props.text - 표시할 텍스트
@param {'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'} props.size - 텍스트의 크기
@param {'gray' | 'red' | 'black'} props.color - 텍스트의 색상

@returns {JSX.Element} Tailwind CSS 클래스를 적용한 텍스트를 포함하는 \`<p>\` 요소`,methods:[],displayName:"Typography",props:{text:{required:!0,tsType:{name:"string"},description:""},size:{required:!0,tsType:{name:"union",raw:"'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'",elements:[{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'base'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"},{name:"literal",value:"'2xl'"},{name:"literal",value:"'3xl'"},{name:"literal",value:"'4xl'"},{name:"literal",value:"'5xl'"},{name:"literal",value:"'6xl'"}]},description:""},color:{required:!0,tsType:{name:"union",raw:"'gray' | 'red' | 'black' | 'blue'",elements:[{name:"literal",value:"'gray'"},{name:"literal",value:"'red'"},{name:"literal",value:"'black'"},{name:"literal",value:"'blue'"}]},description:""},bold:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};export{o as T};
