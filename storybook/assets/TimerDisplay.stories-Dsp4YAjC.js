import{j as n}from"./jsx-runtime-CkxqCPlQ.js";import{r as a}from"./index-DJO9vBfz.js";import{T as y}from"./Typogrpahy-D-8__Tzc.js";const p=({time:m=3,isFulfill:t=!0,onTimeEnd:s})=>{const u=t?"bg-gray300":"bg-white",d="black",c=1e3,f=t?"hover:bg-gray500":"hover:bg-[#f5f5f5]",[e,g]=a.useState(m);return a.useEffect(()=>{e===0&&s();const T=setInterval(()=>{g(e-1)},c);return()=>clearInterval(T)},[e,s]),n.jsx("div",{className:`w-[557px] h-[47px] ${u}${f} flex items-center justify-center`,children:n.jsx(y,{text:e.toString(),color:d,size:"xl"})})};p.__docgenInfo={description:`@description
이 컴포넌트는 주어진 시간에서 시작하여 매 초마다 감소하는 카운트다운 타이머를 표시합니다.
타이머가 0에 도달하면 \`onTimeEnd\` 콜백 함수를 호출합니다.
타이머의 배경색과 호버 효과는 \`isFulfill\` 속성에 따라 사용자 정의할 수 있습니다.

@example
\`\`\`tsx
<TimerDisplay time={10} isFulfill={true} onTimeEnd={() => console.log('시간 종료!')} />
\`\`\`

@param {TimerDisplayProps} props - TimerDisplay 컴포넌트의 속성.
@param {number} [props.time=3] - 카운트다운 타이머의 초기 시간 값.
@param {boolean} props.isFulfill - 타이머의 배경색과 호버 효과를 결정합니다.
@param {string} [props.width] - 타이머 디스플레이의 너비.
@param {string} [props.height] - 타이머 디스플레이의 높이.
@param {() => void} props.onTimeEnd - 타이머가 0에 도달했을 때 호출되는 콜백 함수.

@returns {JSX.Element} TimerDisplay 컴포넌트.`,methods:[],displayName:"TimerDisplay",props:{time:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"3",computed:!1}},isFulfill:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},width:{required:!1,tsType:{name:"string"},description:""},height:{required:!1,tsType:{name:"string"},description:""},onTimeEnd:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const E={title:"Components/TimerDisplay",component:p,tags:["autodocs"]},r={args:{time:10,isFulfill:!1,onTimeEnd:()=>{alert("time end")}}};var i,o,l;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    time: 10,
    isFulfill: false,
    onTimeEnd: () => {
      alert('time end');
    }
  }
}`,...(l=(o=r.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};const b=["Default"];export{r as Default,b as __namedExportsOrder,E as default};
