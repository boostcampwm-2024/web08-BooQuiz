import{j as V}from"./jsx-runtime-DR9Q75dM.js";import{r as N}from"./index-DRjF_FHU.js";import{c as j,S as w}from"./utils-DcIm4c_J.js";function g(t){var n,e,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t))for(n=0;n<t.length;n++)t[n]&&(e=g(t[n]))&&(r&&(r+=" "),r+=e);else for(n in t)t[n]&&(r&&(r+=" "),r+=n);return r}function C(){for(var t,n,e=0,r="";e<arguments.length;)(t=arguments[e++])&&(n=g(t))&&(r&&(r+=" "),r+=n);return r}const m=t=>typeof t=="boolean"?"".concat(t):t===0?"0":t,y=C,k=(t,n)=>e=>{var r;if((n==null?void 0:n.variants)==null)return y(t,e==null?void 0:e.class,e==null?void 0:e.className);const{variants:l,defaultVariants:s}=n,u=Object.keys(l).map(o=>{const a=e==null?void 0:e[o],d=s==null?void 0:s[o];if(a===null)return null;const i=m(a)||m(d);return l[o][i]}),v=e&&Object.entries(e).reduce((o,a)=>{let[d,i]=a;return i===void 0||(o[d]=i),o},{}),h=n==null||(r=n.compoundVariants)===null||r===void 0?void 0:r.reduce((o,a)=>{let{class:d,className:i,...x}=a;return Object.entries(x).every(p=>{let[f,c]=p;return Array.isArray(c)?c.includes({...s,...v}[f]):{...s,...v}[f]===c})?[...o,d,i]:o},[]);return y(t,u,h,e==null?void 0:e.class,e==null?void 0:e.className)},_=k("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),b=N.forwardRef(({className:t,variant:n,size:e,asChild:r=!1,...l},s)=>{const u=r?w:"button";return V.jsx(u,{className:j(_({variant:n,size:e,className:t})),ref:s,...l})});b.displayName="Button";b.__docgenInfo={description:"",methods:[],displayName:"Button",props:{asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}},composes:["VariantProps"]};export{b as B,_ as b};