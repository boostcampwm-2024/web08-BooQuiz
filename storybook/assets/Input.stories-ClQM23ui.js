import{j as e}from"./jsx-runtime-DR9Q75dM.js";import{r as G}from"./index-DRjF_FHU.js";import{T as C}from"./Typogrpahy-DnsS6UIb.js";const t=G.forwardRef(({type:n="text",label:r,value:a,onChange:c,name:s,placeholder:h,disabled:K=!1,error:g=!1,isUnderline:$=!1,onKeyDown:O,isAutoFocus:A=!1,className:b,isBorder:B=!1,step:P,min:k,max:v,isShowCount:y,height:w="h-8",...J},X)=>{const x=()=>({"h-6":"text-xs","h-8":"text-sm","h-10":"text-base","h-12":"text-lg","h-14":"text-xl","h-16":"text-2xl"})[w]||"text-base",Y=b?`input-wrapper  ${b}`:"input-wrapper",f=x();return e.jsxs("div",{className:Y,children:[r&&e.jsx("label",{htmlFor:s,className:f,children:r}),e.jsx("input",{ref:X,autoFocus:A,type:n,id:s,name:s,value:a,onChange:c,placeholder:h,disabled:K,className:`
                        ${g?"error":""} 
                        focus:outline-none 
                        w-full 
                        ${B?"border border-gray-300":""} 
                        rounded-lg
                        p-2
                        ${w}
                        ${f}
                        leading-normal
                    `,onKeyDown:O,step:P,min:k,max:v,...J}),$&&e.jsx("div",{className:"underline h-[2px] w-full bg-blue-600"}),e.jsxs("div",{className:"w-full flex flex-row",children:[g&&e.jsx("span",{className:`error-message ${f} text-red-500 text-[10px] w-full`,children:g}),typeof a=="string"&&y&&e.jsx("div",{className:"w-20 text-right pr-1 ml-auto",children:e.jsx(C,{text:a.length.toString()+"/"+v,color:"gray",size:x().replace("text-","")})}),typeof a=="number"&&y&&e.jsx("div",{className:"w-20 text-right pr-1 ml-auto",children:e.jsx(C,{text:(isNaN(a)?"-":a)+"/"+v,color:"gray",size:x().replace("text-","")})})]})]})});t.displayName="Input";t.__docgenInfo={description:`\`Input\` 컴포넌트는 다양한 입력 필드를 렌더링합니다.

@example
\`\`\`tsx
<Input
  type="text"
  label="Username"
  value={username}
  onChange={handleUsernameChange}
  name="username"
  placeholder="Enter your username"
  isAutoFocus={true}
  isBorder={true}
/>
\`\`\`

@param {string} type - 입력 필드의 타입 (기본값: 'text').
@param {string} label - 입력 필드의 레이블.
@param {string | number} value - 입력 필드의 값.
@param {function} onChange - 값이 변경될 때 호출되는 함수.
@param {string} name - 입력 필드의 이름.
@param {string} placeholder - 입력 필드의 플레이스홀더.
@param {boolean} disabled - 입력 필드를 비활성화할지 여부 (기본값: false).
@param {boolean} error - 에러 상태인지 여부 (기본값: false).
@param {boolean} isUnderline - 밑줄을 표시할지 여부 (기본값: false).
@param {function} onKeyDown - 키가 눌릴 때 호출되는 함수.
@param {boolean} isAutoFocus - 자동 포커스를 설정할지 여부 (기본값: false).
@param {string} className - 추가적인 클래스 이름.
@param {boolean} isBorder - 테두리를 표시할지 여부 (기본값: false).
@param {number} step - 입력 필드의 step 속성.
@param {number} min - 입력 필드의 최소값.
@param {number} max - 입력 필드의 최대값.
@param {boolean} isShowCount - 입력된 글자 수를 표시할지 여부.
@param {string} height - 입력 필드의 높이 (기본값: 'h-8').
@param {object} rest - 기타 전달할 속성들.
@returns {JSX.Element} 렌더링된 입력 필드 컴포넌트.`,methods:[],displayName:"Input",props:{type:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'text'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},value:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(e: ChangeEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ChangeEvent",elements:[{name:"HTMLInputElement"}],raw:"ChangeEvent<HTMLInputElement>"},name:"e"}],return:{name:"void"}}},description:""},name:{required:!0,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},error:{required:!1,tsType:{name:"union",raw:"string | false",elements:[{name:"string"},{name:"literal",value:"false"}]},description:"",defaultValue:{value:"false",computed:!1}},isUnderline:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onKeyDown:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.KeyboardEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactKeyboardEvent",raw:"React.KeyboardEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"e"}],return:{name:"void"}}},description:""},isAutoFocus:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},isBorder:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},step:{required:!1,tsType:{name:"number"},description:""},min:{required:!1,tsType:{name:"number"},description:""},max:{required:!1,tsType:{name:"number"},description:""},isShowCount:{required:!1,tsType:{name:"boolean"},description:""},height:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'h-8'",computed:!1}}}};const{useState:l}=__STORYBOOK_MODULE_PREVIEW_API__,ne={title:"Components/Input",component:t,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","password","email","number"],description:"입력 필드의 타입"},label:{control:"text",description:"입력 필드의 라벨"},value:{control:"text",description:"입력 필드의 값"},name:{control:"text",description:"입력 필드의 이름"},placeholder:{control:"text",description:"입력 필드의 플레이스홀더"},disabled:{control:"boolean",description:"입력 필드의 비활성화 여부"},error:{control:"text",description:"입력 필드의 에러 메시지"},isUnderline:{control:"boolean",description:"밑줄 표시 여부"}}},o={render:()=>{const[n,r]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{name:"default",value:n,onChange:a=>r(a.target.value),placeholder:"기본 입력 필드입니다"})})}},u={render:()=>{const[n,r]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{label:"이름",name:"name",value:n,onChange:a=>r(a.target.value),placeholder:"이름을 입력하세요"})})}},i={render:()=>{const[n,r]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{label:"이메일",name:"email",type:"email",value:n,onChange:a=>r(a.target.value),placeholder:"이메일을 입력하세요",error:"올바른 이메일 형식이 아닙니다"})})}},p={render:()=>{const[n,r]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{label:"제목",name:"title",value:n,onChange:a=>r(a.target.value),placeholder:"제목을 입력하세요",isUnderline:!0})})}},d={render:()=>e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{label:"비활성화",name:"disabled",value:"수정할 수 없는 필드입니다",onChange:()=>{},disabled:!0})})},m={render:()=>{const[n,r]=l({text:"",password:"",email:"",number:""}),a=c=>s=>{r(h=>({...h,[c]:s.target.value}))};return e.jsxs("div",{className:"w-[300px] space-y-4",children:[e.jsx(t,{type:"text",label:"텍스트",name:"text",value:n.text,onChange:a("text"),placeholder:"텍스트를 입력하세요"}),e.jsx(t,{type:"password",label:"비밀번호",name:"password",value:n.password,onChange:a("password"),placeholder:"비밀번호를 입력하세요"}),e.jsx(t,{type:"email",label:"이메일",name:"email",value:n.email,onChange:a("email"),placeholder:"이메일을 입력하세요"}),e.jsx(t,{type:"number",label:"숫자",name:"number",value:n.number,onChange:a("number"),placeholder:"숫자를 입력하세요"})]})}};var T,j,I;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input name="default" value={value} onChange={e => setValue(e.target.value)} placeholder="기본 입력 필드입니다" />
            </div>;
  }
}`,...(I=(j=o.parameters)==null?void 0:j.docs)==null?void 0:I.source}}};var N,E,V;u.parameters={...u.parameters,docs:{...(N=u.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="이름" name="name" value={value} onChange={e => setValue(e.target.value)} placeholder="이름을 입력하세요" />
            </div>;
  }
}`,...(V=(E=u.parameters)==null?void 0:E.docs)==null?void 0:V.source}}};var S,q,_;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="이메일" name="email" type="email" value={value} onChange={e => setValue(e.target.value)} placeholder="이메일을 입력하세요" error="올바른 이메일 형식이 아닙니다" />
            </div>;
  }
}`,...(_=(q=i.parameters)==null?void 0:q.docs)==null?void 0:_.source}}};var L,U,D;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="제목" name="title" value={value} onChange={e => setValue(e.target.value)} placeholder="제목을 입력하세요" isUnderline />
            </div>;
  }
}`,...(D=(U=p.parameters)==null?void 0:U.docs)==null?void 0:D.source}}};var F,M,R;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => {
    return <div className="w-[300px]">
                <Input label="비활성화" name="disabled" value="수정할 수 없는 필드입니다" onChange={() => {}} disabled />
            </div>;
  }
}`,...(R=(M=d.parameters)==null?void 0:M.docs)==null?void 0:R.source}}};var H,W,z;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState({
      text: '',
      password: '',
      email: '',
      number: ''
    });
    const handleChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };
    return <div className="w-[300px] space-y-4">
                <Input type="text" label="텍스트" name="text" value={values.text} onChange={handleChange('text')} placeholder="텍스트를 입력하세요" />
                <Input type="password" label="비밀번호" name="password" value={values.password} onChange={handleChange('password')} placeholder="비밀번호를 입력하세요" />
                <Input type="email" label="이메일" name="email" value={values.email} onChange={handleChange('email')} placeholder="이메일을 입력하세요" />
                <Input type="number" label="숫자" name="number" value={values.number} onChange={handleChange('number')} placeholder="숫자를 입력하세요" />
            </div>;
  }
}`,...(z=(W=m.parameters)==null?void 0:W.docs)==null?void 0:z.source}}};const re=["Default","WithLabel","WithError","WithUnderline","Disabled","DifferentTypes"];export{o as Default,m as DifferentTypes,d as Disabled,i as WithError,u as WithLabel,p as WithUnderline,re as __namedExportsOrder,ne as default};
