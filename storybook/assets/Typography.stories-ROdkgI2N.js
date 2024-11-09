import{j as p}from"./jsx-runtime-CkxqCPlQ.js";import{T as i}from"./Typogrpahy-D-8__Tzc.js";import"./index-DJO9vBfz.js";const ee={title:"Components/Typography",component:i,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:`Typography 컴포넌트는 일관된 텍스트 스타일링을 위한 기본 컴포넌트입니다.
다양한 크기와 색상 옵션을 제공합니다.`}}},argTypes:{text:{description:"표시할 텍스트 내용",control:{type:"text"}},size:{description:"텍스트의 크기",control:{type:"select"},options:["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl"]},color:{description:"텍스트의 색상",control:{type:"select"},options:["gray","red","black"]}}},r={args:{text:"Hello World",size:"base",color:"black"}},s={args:{text:"Extra Small Text",size:"xs",color:"black"}},o={args:{text:"Small Text",size:"sm",color:"black"}},a={args:{text:"Large Text",size:"lg",color:"black"}},t={args:{text:"Gray Colored Text",size:"base",color:"gray"}},c={args:{text:"Red Colored Text",size:"base",color:"red"}},l={render:()=>p.jsx("div",{className:"space-y-4",children:["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl"].map(e=>p.jsx(i,{text:`${e} size text`,size:e,color:"black"},e))})},n={render:()=>p.jsx("div",{className:"space-y-4",children:["black","gray","red"].map(e=>p.jsx(i,{text:`${e} colored text`,size:"xl",color:e},e))})};var d,m,x,g,y;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    text: 'Hello World',
    size: 'base',
    color: 'black'
  }
}`,...(x=(m=r.parameters)==null?void 0:m.docs)==null?void 0:x.source},description:{story:"기본 Typography 스타일입니다.",...(y=(g=r.parameters)==null?void 0:g.docs)==null?void 0:y.description}}};var u,b,z,T,S;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    text: 'Extra Small Text',
    size: 'xs',
    color: 'black'
  }
}`,...(z=(b=s.parameters)==null?void 0:b.docs)==null?void 0:z.source},description:{story:"가장 작은 크기의 텍스트입니다.",...(S=(T=s.parameters)==null?void 0:T.docs)==null?void 0:S.description}}};var k,h,C,j,v;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    text: 'Small Text',
    size: 'sm',
    color: 'black'
  }
}`,...(C=(h=o.parameters)==null?void 0:h.docs)==null?void 0:C.source},description:{story:"작은 크기의 텍스트입니다.",...(v=(j=o.parameters)==null?void 0:j.docs)==null?void 0:v.description}}};var E,f,R,A,G;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    text: 'Large Text',
    size: 'lg',
    color: 'black'
  }
}`,...(R=(f=a.parameters)==null?void 0:f.docs)==null?void 0:R.source},description:{story:"큰 크기의 텍스트입니다.",...(G=(A=a.parameters)==null?void 0:A.docs)==null?void 0:G.description}}};var L,N,$,D,H;t.parameters={...t.parameters,docs:{...(L=t.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    text: 'Gray Colored Text',
    size: 'base',
    color: 'gray'
  }
}`,...($=(N=t.parameters)==null?void 0:N.docs)==null?void 0:$.source},description:{story:"회색 텍스트 스타일입니다.",...(H=(D=t.parameters)==null?void 0:D.docs)==null?void 0:H.description}}};var W,_,O,q,w;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    text: 'Red Colored Text',
    size: 'base',
    color: 'red'
  }
}`,...(O=(_=c.parameters)==null?void 0:_.docs)==null?void 0:O.source},description:{story:"빨간색 텍스트 스타일입니다.",...(w=(q=c.parameters)==null?void 0:q.docs)==null?void 0:w.description}}};var B,F,I,J,K;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            {(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const).map(size => <Typography key={size} text={\`\${size} size text\`} size={size} color="black" />)}
        </div>
}`,...(I=(F=l.parameters)==null?void 0:F.docs)==null?void 0:I.source},description:{story:"모든 크기를 한번에 보여주는 예시입니다.",...(K=(J=l.parameters)==null?void 0:J.docs)==null?void 0:K.description}}};var M,P,Q,U,V;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
            {(['black', 'gray', 'red'] as const).map(color => <Typography key={color} text={\`\${color} colored text\`} size="xl" color={color} />)}
        </div>
}`,...(Q=(P=n.parameters)==null?void 0:P.docs)==null?void 0:Q.source},description:{story:"모든 색상을 한번에 보여주는 예시입니다.",...(V=(U=n.parameters)==null?void 0:U.docs)==null?void 0:V.description}}};const re=["Default","ExtraSmall","Small","Large","GrayText","RedText","AllSizes","AllColors"];export{n as AllColors,l as AllSizes,r as Default,s as ExtraSmall,t as GrayText,a as Large,c as RedText,o as Small,re as __namedExportsOrder,ee as default};
