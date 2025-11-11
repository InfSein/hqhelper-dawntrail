import{K as m,N as i,R as u,L as N,B as j,C as y,aJ as w,G as E,J as O,a5 as V,af as H,c as K,at as q,e as A}from"./index.Bh4IZ4cI.js";import{d as R,s as v,p as D,t as J,e as k,r as M,f as U,K as F,k as z,P as G,R as b,o as Q,a as x,S as p,Q as h,n as B,U as C}from"./vendor.Bn-7_sVg.js";import{ac as X}from"./icons.BPYJy1hK.js";const Y=m("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[i("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),i("a",`
 color: inherit;
 text-decoration: inherit;
 `),m("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[m("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),i("&:not(:last-child)",[N("clickable",[u("link",`
 cursor: pointer;
 `,[i("&:hover",`
 background-color: var(--n-item-color-hover);
 `),i("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),u("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[i("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[m("icon",`
 color: var(--n-item-text-color-hover);
 `)]),i("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[m("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),u("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),i("&:last-child",[u("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[m("icon",`
 color: var(--n-item-text-color-active);
 `)]),u("separator",`
 display: none;
 `)])])]),L=O("n-breadcrumb"),Z=Object.assign(Object.assign({},y.props),{separator:{type:String,default:"/"}}),W=R({name:"Breadcrumb",props:Z,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:n}=j(e),o=y("Breadcrumb","-breadcrumb",Y,w,e,r);D(L,{separatorRef:J(e,"separator"),mergedClsPrefixRef:r});const a=k(()=>{const{common:{cubicBezierEaseInOut:c},self:{separatorColor:l,itemTextColor:s,itemTextColorHover:d,itemTextColorPressed:f,itemTextColorActive:_,fontSize:g,fontWeightActive:P,itemBorderRadius:I,itemColorHover:S,itemColorPressed:T,itemLineHeight:$}}=o.value;return{"--n-font-size":g,"--n-bezier":c,"--n-item-text-color":s,"--n-item-text-color-hover":d,"--n-item-text-color-pressed":f,"--n-item-text-color-active":_,"--n-separator-color":l,"--n-item-color-hover":S,"--n-item-color-pressed":T,"--n-item-border-radius":I,"--n-font-weight-active":P,"--n-item-line-height":$}}),t=n?E("breadcrumb",void 0,a,e):void 0;return{mergedClsPrefix:r,cssVars:n?void 0:a,themeClass:t?.themeClass,onRender:t?.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),v("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},v("ul",null,this.$slots))}});function ee(e=V?window:null){const r=()=>{const{hash:a,host:t,hostname:c,href:l,origin:s,pathname:d,port:f,protocol:_,search:g}=e?.location||{};return{hash:a,host:t,hostname:c,href:l,origin:s,pathname:d,port:f,protocol:_,search:g}},n=M(r()),o=()=>{n.value=r()};return U(()=>{e&&(e.addEventListener("popstate",o),e.addEventListener("hashchange",o))}),F(()=>{e&&(e.removeEventListener("popstate",o),e.removeEventListener("hashchange",o))}),n}const re={separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},te=R({name:"BreadcrumbItem",props:re,slots:Object,setup(e,{slots:r}){const n=z(L,null);if(!n)return()=>null;const{separatorRef:o,mergedClsPrefixRef:a}=n,t=ee(),c=k(()=>e.href?"a":"span"),l=k(()=>t.value.href===e.href?"location":null);return()=>{const{value:s}=a;return v("li",{class:[`${s}-breadcrumb-item`,e.clickable&&`${s}-breadcrumb-item--clickable`]},v(c.value,{class:`${s}-breadcrumb-item__link`,"aria-current":l.value,href:e.href,onClick:e.onClick},r),v("span",{class:`${s}-breadcrumb-item__separator`,"aria-hidden":"true"},H(r.separator,()=>{var d;return[(d=e.separator)!==null&&d!==void 0?d:o.value]})))}}}),oe={class:"wrapper"},ne={class:"tip-container"},ae=R({__name:"RouterCard",props:{pageName:{type:String,required:!0},pageIcon:{type:Object,required:!0}},setup(e){const r=z("t");return(n,o)=>{const a=q,t=te,c=W,l=K;return Q(),G(l,{id:"router-card",embedded:"",bordered:!1},{default:b(()=>[x("div",oe,[p(c,{separator:">"},{default:b(()=>[p(t,{onClick:o[0]||(o[0]=s=>n.$router.push("/")),title:h(r)("common.back_to_index")},{default:b(()=>[p(a,{component:h(X)},null,8,["component"]),B(" "+C(h(r)("common.index")),1)]),_:1},8,["title"]),p(t,null,{default:b(()=>[p(a,{component:e.pageIcon},null,8,["component"]),B(" "+C(e.pageName),1)]),_:1})]),_:1}),x("div",ne,[x("p",null,C(h(r)("common.route_card_desc")),1)])])]),_:1})}}}),le=A(ae,[["__scopeId","data-v-019f278a"]]);export{le as R};
