import{L as u,O as d,T as m,N,B as S,C as y,aK as O,J as V,K as w,a6 as E,ag as H,a as K,au as q,e as A}from"./index.CG8fR3B8.js";import{d as B,s as b,p as D,t as M,e as _,r as U,f as F,K as J,k as R,P as Q,R as f,L as G,Q as p,o as X,a as C,U as v,n as z,V as k}from"./vendor.DaGD8wRy.js";import{ab as Y}from"./icons.BN6_TYLH.js";const Z=u("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[d("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),d("a",`
 color: inherit;
 text-decoration: inherit;
 `),u("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[u("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),d("&:not(:last-child)",[N("clickable",[m("link",`
 cursor: pointer;
 `,[d("&:hover",`
 background-color: var(--n-item-color-hover);
 `),d("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),m("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[d("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[u("icon",`
 color: var(--n-item-text-color-hover);
 `)]),d("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[u("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),m("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),d("&:last-child",[m("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[u("icon",`
 color: var(--n-item-text-color-active);
 `)]),m("separator",`
 display: none;
 `)])])]),L=w("n-breadcrumb"),W=Object.assign(Object.assign({},y.props),{separator:{type:String,default:"/"}}),ee=B({name:"Breadcrumb",props:W,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:o}=S(e),n=y("Breadcrumb","-breadcrumb",Z,O,e,r);D(L,{separatorRef:M(e,"separator"),mergedClsPrefixRef:r});const i=_(()=>{const{common:{cubicBezierEaseInOut:c},self:{separatorColor:l,itemTextColor:a,itemTextColorHover:s,itemTextColorPressed:h,itemTextColorActive:g,fontSize:x,fontWeightActive:P,itemBorderRadius:T,itemColorHover:I,itemColorPressed:$,itemLineHeight:j}}=n.value;return{"--n-font-size":x,"--n-bezier":c,"--n-item-text-color":a,"--n-item-text-color-hover":s,"--n-item-text-color-pressed":h,"--n-item-text-color-active":g,"--n-separator-color":l,"--n-item-color-hover":I,"--n-item-color-pressed":$,"--n-item-border-radius":T,"--n-font-weight-active":P,"--n-item-line-height":j}}),t=o?V("breadcrumb",void 0,i,e):void 0;return{mergedClsPrefix:r,cssVars:o?void 0:i,themeClass:t?.themeClass,onRender:t?.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),b("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},b("ul",null,this.$slots))}});function re(e=E?window:null){const r=()=>{const{hash:i,host:t,hostname:c,href:l,origin:a,pathname:s,port:h,protocol:g,search:x}=e?.location||{};return{hash:i,host:t,hostname:c,href:l,origin:a,pathname:s,port:h,protocol:g,search:x}},o=U(r()),n=()=>{o.value=r()};return F(()=>{e&&(e.addEventListener("popstate",n),e.addEventListener("hashchange",n))}),J(()=>{e&&(e.removeEventListener("popstate",n),e.removeEventListener("hashchange",n))}),o}const te={separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},oe=B({name:"BreadcrumbItem",props:te,slots:Object,setup(e,{slots:r}){const o=R(L,null);if(!o)return()=>null;const{separatorRef:n,mergedClsPrefixRef:i}=o,t=re(),c=_(()=>e.href?"a":"span"),l=_(()=>t.value.href===e.href?"location":null);return()=>{const{value:a}=i;return b("li",{class:[`${a}-breadcrumb-item`,e.clickable&&`${a}-breadcrumb-item--clickable`]},b(c.value,{class:`${a}-breadcrumb-item__link`,"aria-current":l.value,href:e.href,onClick:e.onClick},r),b("span",{class:`${a}-breadcrumb-item__separator`,"aria-hidden":"true"},H(r.separator,()=>{var s;return[(s=e.separator)!==null&&s!==void 0?s:n.value]})))}}}),ne={class:"wrapper"},ae={class:"tip-container"},se=B({__name:"RouterCard",props:{pageName:{type:String,required:!0},pageIcon:{type:Object,required:!0}},setup(e){const r=R("t"),o=R("userConfig"),n=_(()=>[o.value.custom_background?"glasscard":""].join(" "));return(i,t)=>{const c=q,l=oe,a=ee,s=K;return X(),Q(s,{id:"router-card",class:G(p(n)),embedded:"",bordered:!1},{default:f(()=>[C("div",ne,[v(a,{separator:">"},{default:f(()=>[v(l,{onClick:t[0]||(t[0]=h=>i.$router.push("/")),title:p(r)("common.back_to_index")},{default:f(()=>[v(c,{component:p(Y)},null,8,["component"]),z(" "+k(p(r)("common.index")),1)]),_:1},8,["title"]),v(l,null,{default:f(()=>[v(c,{component:e.pageIcon},null,8,["component"]),z(" "+k(e.pageName),1)]),_:1})]),_:1}),C("div",ae,[C("p",null,k(p(r)("common.route_card_desc")),1)])])]),_:1},8,["class"])}}}),de=A(se,[["__scopeId","data-v-df6c01d4"]]);export{de as R};
