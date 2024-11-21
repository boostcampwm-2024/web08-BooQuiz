import{j as e}from"./jsx-runtime-DR9Q75dM.js";import"./index-DRjF_FHU.js";const t=({type:a="text",label:r,value:n,onChange:c,name:s,placeholder:v,disabled:D=!1,error:h=!1,isUnderline:M=!1,onKeyDown:H,isAutoFocus:O=!1,...R})=>e.jsxs("div",{className:"input-wrapper",children:[e.jsx("label",{htmlFor:s,children:r}),e.jsx("input",{autoFocus:O,type:a,id:s,name:s,value:n,onChange:c,placeholder:v,disabled:D,className:`${h?"error":""} focus:outline-none w-full`,onKeyDown:H,...R}),h&&e.jsx("span",{className:"error-message",children:h}),M&&e.jsx("div",{className:"underline h-[2px] w-full bg-blue-600"})]});t.__docgenInfo={description:`@description
Input 컴포넌트는 다양한 타입의 입력 필드를 렌더링합니다.

@component
@example
\`\`\`tsx
<Input
  type="text"
  label="Username"
  value={username}
  onChange={handleUsernameChange}
  name="username"
  placeholder="Enter your username"
  error={usernameError}
  isUnderline={true}
/>
\`\`\`

@param {Object} props - Input 컴포넌트의 props
@param {string} [props.type='text'] - 입력 필드의 타입
@param {string} [props.label] - 입력 필드의 라벨
@param {string} props.value - 입력 필드의 값
@param {function} props.onChange - 입력 필드 값이 변경될 때 호출되는 함수
@param {string} props.name - 입력 필드의 이름
@param {string} [props.placeholder] - 입력 필드의 플레이스홀더
@param {boolean} [props.disabled=false] - 입력 필드의 비활성화 여부
@param {string|false} [props.error=false] - 입력 필드의 에러 메시지
@param {boolean} [props.isUnderline=false] - 입력 필드 하단에 밑줄을 표시할지 여부
@param {Object} [props.rest] - 추가적인 props

@returns {JSX.Element} 렌더링된 Input 컴포넌트`,methods:[],displayName:"Input",props:{type:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'text'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},value:{required:!0,tsType:{name:"string"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(e: ChangeEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ChangeEvent",elements:[{name:"HTMLInputElement"}],raw:"ChangeEvent<HTMLInputElement>"},name:"e"}],return:{name:"void"}}},description:""},name:{required:!0,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},error:{required:!1,tsType:{name:"union",raw:"string | false",elements:[{name:"string"},{name:"literal",value:"false"}]},description:"",defaultValue:{value:"false",computed:!1}},isUnderline:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onKeyDown:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.KeyboardEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactKeyboardEvent",raw:"React.KeyboardEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"e"}],return:{name:"void"}}},description:""},isAutoFocus:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const{useState:l}=__STORYBOOK_MODULE_PREVIEW_API__,F={title:"Components/Input",component:t,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","password","email","number"],description:"입력 필드의 타입"},label:{control:"text",description:"입력 필드의 라벨"},value:{control:"text",description:"입력 필드의 값"},name:{control:"text",description:"입력 필드의 이름"},placeholder:{control:"text",description:"입력 필드의 플레이스홀더"},disabled:{control:"boolean",description:"입력 필드의 비활성화 여부"},error:{control:"text",description:"입력 필드의 에러 메시지"},isUnderline:{control:"boolean",description:"밑줄 표시 여부"}}},o={render:()=>{const[a,r]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{name:"default",value:a,onChange:n=>r(n.target.value),placeholder:"기본 입력 필드입니다"})})}},p={render:()=>{const[a,r]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{label:"이름",name:"name",value:a,onChange:n=>r(n.target.value),placeholder:"이름을 입력하세요"})})}},u={render:()=>{const[a,r]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{label:"이메일",name:"email",type:"email",value:a,onChange:n=>r(n.target.value),placeholder:"이메일을 입력하세요",error:"올바른 이메일 형식이 아닙니다"})})}},d={render:()=>{const[a,r]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{label:"제목",name:"title",value:a,onChange:n=>r(n.target.value),placeholder:"제목을 입력하세요",isUnderline:!0})})}},i={render:()=>e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{label:"비활성화",name:"disabled",value:"수정할 수 없는 필드입니다",onChange:()=>{},disabled:!0})})},m={render:()=>{const[a,r]=l({text:"",password:"",email:"",number:""}),n=c=>s=>{r(v=>({...v,[c]:s.target.value}))};return e.jsxs("div",{className:"w-[300px] space-y-4",children:[e.jsx(t,{type:"text",label:"텍스트",name:"text",value:a.text,onChange:n("text"),placeholder:"텍스트를 입력하세요"}),e.jsx(t,{type:"password",label:"비밀번호",name:"password",value:a.password,onChange:n("password"),placeholder:"비밀번호를 입력하세요"}),e.jsx(t,{type:"email",label:"이메일",name:"email",value:a.email,onChange:n("email"),placeholder:"이메일을 입력하세요"}),e.jsx(t,{type:"number",label:"숫자",name:"number",value:a.number,onChange:n("number"),placeholder:"숫자를 입력하세요"})]})}};var g,x,b;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input name="default" value={value} onChange={e => setValue(e.target.value)} placeholder="기본 입력 필드입니다" />
            </div>;
  }
}`,...(b=(x=o.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var f,y,C;p.parameters={...p.parameters,docs:{...(f=p.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="이름" name="name" value={value} onChange={e => setValue(e.target.value)} placeholder="이름을 입력하세요" />
            </div>;
  }
}`,...(C=(y=p.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};var w,I,j;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="이메일" name="email" type="email" value={value} onChange={e => setValue(e.target.value)} placeholder="이메일을 입력하세요" error="올바른 이메일 형식이 아닙니다" />
            </div>;
  }
}`,...(j=(I=u.parameters)==null?void 0:I.docs)==null?void 0:j.source}}};var E,T,V;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="제목" name="title" value={value} onChange={e => setValue(e.target.value)} placeholder="제목을 입력하세요" isUnderline />
            </div>;
  }
}`,...(V=(T=d.parameters)==null?void 0:T.docs)==null?void 0:V.source}}};var N,S,q;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    return <div className="w-[300px]">
                <Input label="비활성화" name="disabled" value="수정할 수 없는 필드입니다" onChange={() => {}} disabled />
            </div>;
  }
}`,...(q=(S=i.parameters)==null?void 0:S.docs)==null?void 0:q.source}}};var U,_,L;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`{
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
}`,...(L=(_=m.parameters)==null?void 0:_.docs)==null?void 0:L.source}}};const A=["Default","WithLabel","WithError","WithUnderline","Disabled","DifferentTypes"];export{o as Default,m as DifferentTypes,i as Disabled,u as WithError,p as WithLabel,d as WithUnderline,A as __namedExportsOrder,F as default};
