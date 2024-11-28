import{j as e}from"./jsx-runtime-DR9Q75dM.js";import{r as O}from"./index-DRjF_FHU.js";const r=O.forwardRef(({type:a="text",label:n,value:t,onChange:m,name:s,placeholder:v,disabled:M=!1,error:h=!1,isUnderline:R=!1,onKeyDown:H,isAutoFocus:U=!1,...W},K)=>e.jsxs("div",{className:"input-wrapper",children:[e.jsx("label",{htmlFor:s,children:n}),e.jsx("input",{ref:K,autoFocus:U,type:a,id:s,name:s,value:t,onChange:m,placeholder:v,disabled:M,className:`${h?"error":""} focus:outline-none w-full`,onKeyDown:H,...W}),h&&e.jsx("span",{className:"error-message",children:h}),R&&e.jsx("div",{className:"underline h-[2px] w-full bg-blue-600"})]}));r.displayName="Input";r.__docgenInfo={description:"",methods:[],displayName:"Input",props:{type:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'text'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},value:{required:!0,tsType:{name:"string"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(e: ChangeEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ChangeEvent",elements:[{name:"HTMLInputElement"}],raw:"ChangeEvent<HTMLInputElement>"},name:"e"}],return:{name:"void"}}},description:""},name:{required:!0,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},error:{required:!1,tsType:{name:"union",raw:"string | false",elements:[{name:"string"},{name:"literal",value:"false"}]},description:"",defaultValue:{value:"false",computed:!1}},isUnderline:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onKeyDown:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.KeyboardEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactKeyboardEvent",raw:"React.KeyboardEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"e"}],return:{name:"void"}}},description:""},isAutoFocus:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const{useState:l}=__STORYBOOK_MODULE_PREVIEW_API__,P={title:"Components/Input",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","password","email","number"],description:"입력 필드의 타입"},label:{control:"text",description:"입력 필드의 라벨"},value:{control:"text",description:"입력 필드의 값"},name:{control:"text",description:"입력 필드의 이름"},placeholder:{control:"text",description:"입력 필드의 플레이스홀더"},disabled:{control:"boolean",description:"입력 필드의 비활성화 여부"},error:{control:"text",description:"입력 필드의 에러 메시지"},isUnderline:{control:"boolean",description:"밑줄 표시 여부"}}},o={render:()=>{const[a,n]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(r,{name:"default",value:a,onChange:t=>n(t.target.value),placeholder:"기본 입력 필드입니다"})})}},u={render:()=>{const[a,n]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(r,{label:"이름",name:"name",value:a,onChange:t=>n(t.target.value),placeholder:"이름을 입력하세요"})})}},d={render:()=>{const[a,n]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(r,{label:"이메일",name:"email",type:"email",value:a,onChange:t=>n(t.target.value),placeholder:"이메일을 입력하세요",error:"올바른 이메일 형식이 아닙니다"})})}},i={render:()=>{const[a,n]=l("");return e.jsx("div",{className:"w-[300px]",children:e.jsx(r,{label:"제목",name:"title",value:a,onChange:t=>n(t.target.value),placeholder:"제목을 입력하세요",isUnderline:!0})})}},p={render:()=>e.jsx("div",{className:"w-[300px]",children:e.jsx(r,{label:"비활성화",name:"disabled",value:"수정할 수 없는 필드입니다",onChange:()=>{},disabled:!0})})},c={render:()=>{const[a,n]=l({text:"",password:"",email:"",number:""}),t=m=>s=>{n(v=>({...v,[m]:s.target.value}))};return e.jsxs("div",{className:"w-[300px] space-y-4",children:[e.jsx(r,{type:"text",label:"텍스트",name:"text",value:a.text,onChange:t("text"),placeholder:"텍스트를 입력하세요"}),e.jsx(r,{type:"password",label:"비밀번호",name:"password",value:a.password,onChange:t("password"),placeholder:"비밀번호를 입력하세요"}),e.jsx(r,{type:"email",label:"이메일",name:"email",value:a.email,onChange:t("email"),placeholder:"이메일을 입력하세요"}),e.jsx(r,{type:"number",label:"숫자",name:"number",value:a.number,onChange:t("number"),placeholder:"숫자를 입력하세요"})]})}};var g,x,f;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input name="default" value={value} onChange={e => setValue(e.target.value)} placeholder="기본 입력 필드입니다" />
            </div>;
  }
}`,...(f=(x=o.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var b,y,w;u.parameters={...u.parameters,docs:{...(b=u.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="이름" name="name" value={value} onChange={e => setValue(e.target.value)} placeholder="이름을 입력하세요" />
            </div>;
  }
}`,...(w=(y=u.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};var C,I,j;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="이메일" name="email" type="email" value={value} onChange={e => setValue(e.target.value)} placeholder="이메일을 입력하세요" error="올바른 이메일 형식이 아닙니다" />
            </div>;
  }
}`,...(j=(I=d.parameters)==null?void 0:I.docs)==null?void 0:j.source}}};var E,T,V;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-[300px]">
                <Input label="제목" name="title" value={value} onChange={e => setValue(e.target.value)} placeholder="제목을 입력하세요" isUnderline />
            </div>;
  }
}`,...(V=(T=i.parameters)==null?void 0:T.docs)==null?void 0:V.source}}};var N,S,q;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    return <div className="w-[300px]">
                <Input label="비활성화" name="disabled" value="수정할 수 없는 필드입니다" onChange={() => {}} disabled />
            </div>;
  }
}`,...(q=(S=p.parameters)==null?void 0:S.docs)==null?void 0:q.source}}};var _,L,D;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(D=(L=c.parameters)==null?void 0:L.docs)==null?void 0:D.source}}};const k=["Default","WithLabel","WithError","WithUnderline","Disabled","DifferentTypes"];export{o as Default,c as DifferentTypes,p as Disabled,d as WithError,u as WithLabel,i as WithUnderline,k as __namedExportsOrder,P as default};
