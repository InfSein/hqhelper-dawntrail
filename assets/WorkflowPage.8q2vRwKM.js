import{L as ee,N as te,O as T,T as U,C as We,D as de,aL as ft,U as A,J as De,K as pt,ag as _t,a5 as vt,aM as wt,W as ht,aN as gt,ao as bt,aO as kt,aP as xt,aq as Ue,i as Ie,au as Ce,av as yt,aQ as Le,at as Pe,as as St,aR as It,g as Fe,B as Oe,f as Be,aB as Ct,aS as Pt,aT as oe,aU as je,h as Bt,u as Mt,aV as Ne,aW as $t,s as zt,t as Rt,_ as Ut,y as Nt,aX as Tt,j as At,e as ge,aY as Et,aZ as Wt,n as Dt,a_ as Lt,a as Ft,d as Ot,a$ as jt,b0 as qt,b1 as Ht,b2 as Vt,z as Gt,A as Xt,b3 as Kt}from"./index.DIpgTaJR.js";import{d as ae,s as D,e as C,p as Qt,t as qe,r as w,k as L,f as He,h as Ve,P as N,o as $,R as r,a as i,U as n,Q as e,V as p,Z as K,n as q,v as Jt,W as Yt,X as Te,w as Ae,c as Ee,N as be,F as Zt,Y as eo,q as ke,y as xe,aa as to,x as oo,S as ye}from"./vendor.DOOPojup.js";import{A as ao,z as so,S as Se,o as no,a1 as ro,p as lo,az as io,k as co,as as uo,aA as mo,aB as fo,l as po}from"./icons._F9tMcs6.js";import{C as _o}from"./CraftStatistics.CxK9Etq4.js";import{D as vo}from"./DraggableTable.Ca7lhsYR.js";const wo=ee("float-button-group",[ee("float-button",`
 position: relative;
 `),te("square-shape",`
 background-color: var(--n-color);
 cursor: pointer;
 display: flex;
 width: fit-content;
 align-items: center;
 justify-content: center;
 border-radius: var(--n-border-radius-square);
 flex-direction: column;
 box-shadow: var(--n-box-shadow);
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[ee("float-button",`
 background-color: unset;
 border-radius: 0;
 box-shadow: none;
 box-sizing: content-box;
 `,[T("&:not(:last-child)",`
 border-bottom: 1px solid var(--n-button-border-color); 
 `),T("&:first-child",`
 border-top-left-radius: 4px;
 border-top-right-radius: 4px;
 `),T("&:last-child",`
 border-bottom-left-radius: 4px;
 border-bottom-right-radius: 4px;
 `),U("fill",`
 top: 4px;
 right: 4px;
 bottom: 4px;
 left: 4px;
 border-radius: var(--n-border-radius-square); 
 `)])]),te("circle-shape",[T(">:not(:last-child)",`
 margin-bottom: 16px;
 `)])]),ho=Object.assign(Object.assign({},de.props),{left:[Number,String],right:[Number,String],top:[Number,String],bottom:[Number,String],shape:{type:String,default:"circle"},position:{type:String,default:"fixed"}}),Ge=pt("n-float-button-group"),go=ae({name:"FloatButtonGroup",props:ho,setup(l){const{mergedClsPrefixRef:t,inlineThemeDisabled:d}=We(l),m=de("FloatButtonGroup","-float-button-group",wo,ft,l,t),h=C(()=>{const{self:{color:P,boxShadow:v,buttonBorderColor:S,borderRadiusSquare:I},common:{cubicBezierEaseInOut:g}}=m.value;return{"--n-bezier":g,"--n-box-shadow":v,"--n-color":P,"--n-button-border-color":S,"--n-border-radius-square":I,position:l.position,left:A(l.left)||"",right:A(l.right)||"",top:A(l.top)||"",bottom:A(l.bottom)||""}});Qt(Ge,{shapeRef:qe(l,"shape")});const _=d?De("float-button",void 0,h,l):void 0;return{cssVars:d?void 0:h,mergedClsPrefix:t,themeClass:_?.themeClass,onRender:_?.onRender}},render(){const{mergedClsPrefix:l,cssVars:t,shape:d}=this;return D("div",{class:[`${l}-float-button-group`,`${l}-float-button-group--${d}-shape`],style:t,role:"group"},this.$slots)}}),bo=ee("float-button",`
 user-select: none;
 cursor: pointer;
 color: var(--n-text-color);
 background-color: var(--n-color);
 font-size: 18px;
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 box-shadow: var(--n-box-shadow);
 display: flex;
 align-items: stretch;
 box-sizing: border-box;
`,[te("circle-shape",`
 border-radius: 4096px;
 `),te("square-shape",`
 border-radius: var(--n-border-radius-square);
 `),U("fill",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0
 left: 0;
 transition: background-color .3s var(--n-bezier);
 border-radius: inherit;
 `),U("body",`
 position: relative;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: transform .3s var(--n-bezier), opacity .3s var(--n-bezier);
 border-radius: inherit;
 flex-direction: column;
 box-sizing: border-box;
 padding: 2px 4px;
 gap: 2px;
 transform: scale(1);
 `,[U("description",`
 font-size: 12px;
 text-align: center;
 line-height: 14px;
 `)]),T("&:hover","box-shadow: var(--n-box-shadow-hover);",[T(">",[U("fill",`
 background-color: var(--n-color-hover);
 `)])]),T("&:active","box-shadow: var(--n-box-shadow-pressed);",[T(">",[U("fill",`
 background-color: var(--n-color-pressed);
 `)])]),te("show-menu",[T(">",[U("menu",`
 pointer-events: all;
 bottom: 100%;
 opacity: 1;
 `),U("close",`
 transform: scale(1);
 opacity: 1;
 `),U("body",`
 transform: scale(0.75);
 opacity: 0;
 `)])]),U("close",`
 opacity: 0;
 transform: scale(0.75);
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: transform .3s var(--n-bezier), opacity .3s var(--n-bezier);
 `),U("menu",`
 position: absolute;
 bottom: calc(100% - 8px);
 display: flex;
 flex-direction: column;
 opacity: 0;
 pointer-events: none;
 transition:
 opacity .3s var(--n-bezier),
 bottom .3s var(--n-bezier); 
 `,[T("> *",`
 margin-bottom: 16px;
 `),ee("float-button",`
 position: relative !important;
 `)])]),ko=Object.assign(Object.assign({},de.props),{width:{type:[Number,String],default:40},height:{type:[Number,String],default:40},left:[Number,String],right:[Number,String],top:[Number,String],bottom:[Number,String],shape:{type:String,default:"circle"},position:{type:String,default:"fixed"},type:{type:String,default:"default"},menuTrigger:String,showMenu:{type:Boolean,default:void 0},onUpdateShowMenu:{type:[Function,Array],default:void 0},"onUpdate:showMenu":{type:[Function,Array],default:void 0}}),xo=ae({name:"FloatButton",props:ko,slots:Object,setup(l){const{mergedClsPrefixRef:t,inlineThemeDisabled:d}=We(l),m=w(null),h=de("FloatButton","-float-button",bo,gt,l,t),_=L(Ge,null),P=w(!1),v=qe(l,"showMenu"),S=bt(v,P);function I(f){const{onUpdateShowMenu:R,"onUpdate:showMenu":B}=l;P.value=f,R&&Ue(R,f),B&&Ue(B,f)}const g=C(()=>{const{self:{color:f,textColor:R,boxShadow:B,boxShadowHover:Q,boxShadowPressed:se,colorHover:ne,colorPrimary:F,colorPrimaryHover:J,textColorPrimary:W,borderRadiusSquare:re,colorPressed:Y,colorPrimaryPressed:H},common:{cubicBezierEaseInOut:me}}=h.value,{type:V}=l;return{"--n-bezier":me,"--n-box-shadow":B,"--n-box-shadow-hover":Q,"--n-box-shadow-pressed":se,"--n-color":V==="primary"?F:f,"--n-text-color":V==="primary"?W:R,"--n-color-hover":V==="primary"?J:ne,"--n-color-pressed":V==="primary"?H:Y,"--n-border-radius-square":re}}),b=C(()=>{const{width:f,height:R}=l;return Object.assign({position:_?void 0:l.position,width:A(f),minHeight:A(R)},_?null:{left:A(l.left),right:A(l.right),top:A(l.top),bottom:A(l.bottom)})}),z=C(()=>_?_.shapeRef.value:l.shape),E=()=>{l.menuTrigger==="hover"&&I(!0)},k=()=>{l.menuTrigger==="hover"&&S.value&&I(!1)},c=()=>{l.menuTrigger==="click"&&I(!S.value)},o=d?De("float-button",C(()=>l.type[0]),g,l):void 0;return He(()=>{const f=m.value;f&&kt("mousemoveoutside",f,k)}),Ve(()=>{const f=m.value;f&&xt("mousemoveoutside",f,k)}),{inlineStyle:b,selfElRef:m,cssVars:d?void 0:g,mergedClsPrefix:t,mergedShape:z,mergedShowMenu:S,themeClass:o?.themeClass,onRender:o?.onRender,Mouseenter:E,handleMouseleave:k,handleClick:c}},render(){var l;const{mergedClsPrefix:t,cssVars:d,mergedShape:m,type:h,menuTrigger:_,mergedShowMenu:P,themeClass:v,$slots:S,inlineStyle:I,onRender:g}=this;return g?.(),D("div",{ref:"selfElRef",class:[`${t}-float-button`,`${t}-float-button--${m}-shape`,`${t}-float-button--${h}-type`,P&&`${t}-float-button--show-menu`,v],style:[d,I],onMouseenter:this.Mouseenter,onMouseleave:this.handleMouseleave,onClick:this.handleClick,role:"button"},D("div",{class:`${t}-float-button__fill`,"aria-hidden":!0}),D("div",{class:`${t}-float-button__body`},(l=S.default)===null||l===void 0?void 0:l.call(S),ht(S.description,b=>b?D("div",{class:`${t}-float-button__description`},b):null)),_?D("div",{class:`${t}-float-button__close`},D(vt,{clsPrefix:t},{default:()=>D(wt,null)})):null,_?D("div",{onClick:b=>{b.stopPropagation()},"data-float-button-menu":!0,class:`${t}-float-button__menu`},_t(S.menu,()=>[])):null)}}),yo={class:"wrapper",ref:"listPopContainer"},So={class:"pop-title font-big"},Io={class:"input-container"},Co={class:"actions-container"},Po=`仪仗长刀 x 1\r
セレモニアル・シャムシールx2\r
5x Ceremonial Shamshir`,Bo=ae({__name:"ImportItemListPop",setup(l){const t=Ie(),d=L("t"),m=L("isMobile")??w(!1),h=L("joinItemsToWorkflow"),{alertError:_}=Oe(d),P=w(!1),v=w(""),S=()=>{const I=v.value.split(`
`).map(k=>k.trim()).filter(k=>!!k);if(!I.length){t.info(d("macro_manage.text.please_input_content_to_import"));return}const g=It(),b=[],z={};if(I.forEach((k,c)=>{const o=E(k);if(!o){b.push(d("workflow.import.itemlist.message.error_format_invalid",[c+1,k]));return}const{name:f,count:R}=o;if(R<=0){b.push(d("workflow.import.itemlist.message.error_count_invalid",[c+1,R]));return}const B=g.get(f);if(!B){b.push(d("workflow.import.itemlist.message.error_item_not_found",[c+1,f]));return}if(z[B]){b.push(d("workflow.import.itemlist.message.error_item_duplicated",[c+1,f]));return}if(!Fe(B).craftInfo?.recipeId){b.push(d("workflow.import.itemlist.message.error_item_not_craftable",[c+1,f]));return}z[B]=R}),b.length){_(d("workflow.import.itemlist.message.error_content_invalid_prev")+`\r
`+b.map(k=>` ${k}`).join(`\r
`)+`\r
`+d("workflow.import.itemlist.message.error_content_invalid_after"));return}h(z),P.value=!1;function E(k){const c=k.trim(),o=c.match(/^(.+?)\s*[xX]\s*(\d+)$/);if(o)return{name:o[1].trim(),count:Number(o[2])};const f=c.match(/^(\d+)\s*[xX]\s*(.+)$/);return f?{name:f[2].trim(),count:Number(f[1])}:null}};return(I,g)=>{const b=Ce,z=yt,E=Le,k=Pe,c=St;return $(),N(c,{show:e(P),"onUpdate:show":g[1]||(g[1]=o=>K(P)?P.value=o:null),trigger:"click",placement:e(m)?"bottom":"right-start",width:300},{trigger:r(()=>[Jt(I.$slots,"default",{},void 0,!0)]),default:r(()=>[i("div",yo,[i("div",So,[n(b,{size:16},{default:r(()=>[n(e(ao))]),_:1}),i("span",null,p(e(d)("common.import")),1)]),n(z,{style:{margin:"0 0 3px"}}),i("div",null,p(e(d)("workflow.import.itemlist.tip_1"))+" "+p(e(d)("workflow.import.itemlist.tip_2")),1),i("div",Io,[n(E,{type:"textarea",value:e(v),"onUpdate:value":g[0]||(g[0]=o=>K(v)?v.value=o:null),placeholder:Po,rows:10},null,8,["value"])]),i("div",Co,[n(k,{type:"primary",onClick:S},{icon:r(()=>[n(b,null,{default:r(()=>[n(e(so))]),_:1})]),default:r(()=>[q(" "+p(e(d)("common.confirm")),1)]),_:1})])],512)]),_:3},8,["show","placement"])}}}),Mo=Be(Bo,[["__scopeId","data-v-d405ba43"]]),$o={class:"wrapper"},zo={class:"flex-vac"},Ro={class:"bold"},Uo={class:"modal-submit-container"},No=ae({__name:"ModalWorkflowsManage",props:{show:{type:Boolean,required:!0},showModifiers:{},workflows:{required:!0},workflowsModifiers:{}},emits:Yt(["afterSave"],["update:show","update:workflows"]),setup(l,{emit:t}){const d=Ie(),m=L("t"),h=Te(l,"show"),_=Te(l,"workflows"),P=t,v=w(),S=()=>{if(!v.value?.handleSave){d.error("Unexpected error: workflowsTable not defined");return}v.value.handleSave()&&(h.value=!1,d.success(m("common.save_succeed")),P("afterSave"))};return(I,g)=>{const b=Le,z=Ce,E=Pe,k=Ct;return $(),N(k,{show:h.value,"onUpdate:show":g[1]||(g[1]=c=>h.value=c),icon:e(Se),title:e(m)("workflow.text.manage_workflows"),"max-width":"600px"},{action:r(()=>[i("div",Uo,[n(E,{type:"primary",size:"large",onClick:S},{icon:r(()=>[n(z,null,{default:r(()=>[n(e(no))]),_:1})]),default:r(()=>[q(" "+p(e(m)("common.save")),1)]),_:1})])]),default:r(()=>[i("div",$o,[i("p",null,p(e(m)("workflow.text.manage_workflows_desc")),1),n(vo,{data:_.value,"onUpdate:data":g[0]||(g[0]=c=>_.value=c),ref_key:"workflowsTable",ref:v,"can-add":"",min:1,"min-tip":e(m)("workflow.text.min_len"),max:e(oe),"max-tip":e(m)("workflow.message.max_len",e(oe)),"get-default-data-row":e(je)},{tableTitle:r(()=>[i("div",zo,[i("div",Ro,p(e(m)("workflow.text.workflow_name")),1),i("div",null,[n(Pt,{icon:"question",descriptions:[e(m)("workflow.text.workflow_name_default_info",e(oe)),e(m)("workflow.text.workflow_name_reorder_on_deleted")]},null,8,["descriptions"])])])]),default:r(({row:c,rowIndex:o})=>[n(b,{value:c.name,"onUpdate:value":f=>c.name=f,type:"text",placeholder:e(m)("workflow.text.workflow_with_index",o+1)},null,8,["value","onUpdate:value","placeholder"])]),_:1},8,["data","min-tip","max","max-tip","get-default-data-row"]),i("p",null,p(e(m)("common.all_changes_effects_after_save")),1)])]),_:1},8,["show","icon","title"])}}}),To=Be(No,[["__scopeId","data-v-7370671e"]]),Ao={id:"main-container",class:"wrapper"},Eo={class:"card-title-text"},Wo={class:"action"},Do={class:"flex-wrap",style:{gap:"5px"}},Lo={class:"card-title-text"},Fo={class:"block items-block"},Oo={class:"top-actions"},jo={class:"content-table"},qo={class:"bottom-actions"},Ho={class:"card-title-text"},Vo=["disabled"],Go=["title"],Xo=["title"],Ko={class:"block"},Qo={class:"tab-title"},Jo={class:"tab-title"},Yo={class:"tab-title"},Zo=ae({__name:"WorkflowPage",setup(l){const t=L("t"),d=L("isMobile")??w(!1),m=L("userConfig"),h=L("funcConfig"),_=Bt(),{alertError:P}=Oe(t),v=Ie(),{emitSync:S,onSync:I}=$t(),{calItems:g}=Mt(),{getStatementData:b,getProStatementData:z,calRecommProcessData:E,calRecommProcessGroups:k}=zt(m,h,t),c=w(Ne()),o=C(()=>c.value.workflows[c.value.currentWorkflow]),f=w(!1);if(!(m.value.disable_workstate_cache??!1)){const s=m.value.workflow_cache_work_state;s&&JSON.stringify(s).length>2&&(c.value=Ne(s)),Ae(c,async()=>{if(c.value&&m)try{if(await Promise.resolve(),f.value){f.value=!1;return}m.value.workflow_cache_work_state=c.value,_.setUserConfig(m.value),S("workflowStateChanged",Kt(m.value))}catch(a){console.error("Error handling workState change:",a)}else console.warn("workState or userConfig is not defined")},{deep:!0})}I("workflowStateChanged",s=>{f.value=!0,c.value=s.workflow_cache_work_state});const B=w(!1),Q=w(void 0),se=w(!1),ne=w(!1),F=w("statistics"),J=w(),W=w(),re=w(window.innerHeight),Y=w(0),H=()=>{re.value=window.innerHeight,J.value?.offsetHeight?Y.value=J.value.offsetHeight+20:Y.value=0},me=()=>{setTimeout(H,10)};He(()=>{H(),window.addEventListener("resize",H)}),Ve(()=>{window.removeEventListener("resize",H)});const V=()=>{if(c.value.workflows.length>=oe){v.warning(t("workflow.message.max_len",oe));return}c.value.workflows.push(je())},le=w(!1),Xe=()=>{le.value=!0},Ke=()=>{c.value.currentWorkflow>=c.value.workflows.length&&(c.value.currentWorkflow=c.value.workflows.length-1)},Z=C(()=>{const a=re.value-320-Y.value;return d.value?{itemSelectTable:"auto",statisticsBlock:void 0,statementsBlock:"auto",recommProcess:"auto",recommProcessContainer:"60px"}:{itemSelectTable:a-65+"px",statisticsBlock:a/2-45,statementsBlock:a-50+"px",recommProcess:a+"px",recommProcessContainer:a+12+"px"}}),Qe=s=>{s&&(o.value.targetItems[s]?v.info(t("common.message.item_already_have")):(o.value.targetItems[s]=1,o.value.preparedItems.craftTarget[s]=0))},Je=()=>{o.value.targetItems={},o.value.preparedItems={craftTarget:{},materialsLv1:{},materialsLvBase:{}},v.success(t("common.cleared"))},Me=w(!1),fe=w("450px"),Ye=s=>{Me.value=s,s?fe.value="200px":fe.value="450px",setTimeout(()=>{W?.value?.updateSize&&W.value.updateSize()},10)},$e=C(()=>{const s=[];for(const a in o.value.targetItems){const M=Number(a),u=o.value.targetItems[M];if(u>0){const y=Fe(M);y.amount=u,s.push(y)}}return s}),Ze=C(()=>g(o.value.targetItems)),O=C(()=>b(Ze.value)),ie=C(()=>z($e.value,o.value.preparedItems)),et=C(()=>E(ie.value.targetItemsForCal,ie.value.lv1ItemsForCal,ie.value.baseItemsForCal)),j=C(()=>{const{craftTargets:s,lv1Items:a,lv2Items:M,lv3Items:u,lvBaseItems:y}=et.value;return k(s,a,M,u,y,h.value.processes_craftable_item_sortby,h.value.processes_merge_gatherings,m.value.language_ui,t)}),ze=()=>{const{craftTargets:s,materialsLv1:a,materialsLvBase:M}=O.value;s.forEach(u=>{const y=o.value.preparedItems.craftTarget[u.id];y?y>u.amount&&(o.value.preparedItems.craftTarget[u.id]=u.amount):o.value.preparedItems.craftTarget[u.id]=0}),a.forEach(u=>{const y=o.value.preparedItems.materialsLv1[u.id];y?y>u.amount&&(o.value.preparedItems.materialsLv1[u.id]=u.amount):o.value.preparedItems.materialsLv1[u.id]=0}),M.forEach(u=>{const y=o.value.preparedItems.materialsLvBase[u.id];y?y>u.amount&&(o.value.preparedItems.materialsLvBase[u.id]=u.amount):o.value.preparedItems.materialsLvBase[u.id]=0})},Re=()=>{for(let s=0;s<j.value.length;s++)o.value.recommData.expandedBlocks[s]||(o.value.recommData.expandedBlocks[s]=["1"]),o.value.recommData.completedItems[s]||(o.value.recommData.completedItems[s]={}),j.value[s].items.forEach(a=>{o.value.recommData.completedItems[s][a.id]||(o.value.recommData.completedItems[s][a.id]=!1)})};Ae(j,async()=>{Re(),ze()}),Re(),ze();const pe=C(()=>{let s=!0;for(let a=0;a<j.value.length;a++)o.value.recommData.expandedBlocks[a]&&o.value.recommData.expandedBlocks[a].length>0&&(s=!1);return s}),tt=C(()=>!!window.electronAPI&&!!window.$syncStore),ot=()=>{const s=t("workflow.recomm_process"),a=document.location.origin+document.location.pathname+"#/workflow_process?mode=overlay",M=400,u=350;window.electronAPI?.createNewWindow?window.electronAPI.createNewWindow("workflow-process",a,M,u,s):window.open(a,s,`height=${u}, width=${M}, top=200, left=200`)},at=()=>{const s=pe.value;for(let a=0;a<j.value.length;a++)o.value.recommData.expandedBlocks[a]=s?["1"]:[]},st=()=>{se.value=!1,ne.value=!0,Q.value="recomm_process",B.value=!0},ce=w(!1),_e=C(()=>Rt(h.value,O.value)),G=w(!1),nt=async()=>{if(_e.value.updateRequired){G.value=!0;try{const s=[];O.value.craftTargets.forEach(u=>{s.push(u.id)}),O.value.materialsLvBase.forEach(u=>{s.push(u.id)});const a=await Gt([...new Set(s)],h.value.universalis_server),M=h.value;Object.keys(a).forEach(u=>{const y=Number(u);M.cache_item_prices[y]=a[y]}),await _.setFuncConfig(Xt(M,_.userConfig))}catch(s){console.error(s),await P(t("common.message.get_price_failed")+`
`+(s?.message??s))}G.value=!1}},rt=async()=>{if(G.value){v.info(t("common.loading"));return}await nt(),ce.value=!0},lt=()=>{W?.value?.setPreparedItemsByInventory?(W.value.setPreparedItemsByInventory(),v.success(t("common.message.sync_succeed"))):v.error("proStatementInstace Ref Notfound")},it=()=>{W?.value?.setInventoryByPreparedItems?(W.value.setInventoryByPreparedItems(),v.success(t("common.message.sync_succeed"))):v.error("proStatementInstace Ref Notfound")};return(s,a)=>{const M=Pe,u=Ut,y=Wt,ct=Et,X=Ce,ve=Ot,we=xo,he=Vt,ut=go,dt=Ft,mt=At;return $(),Ee("div",Ao,[n(u,{"card-key":"workflow-header",class:"header-block",onOnCardFoldStatusChanged:me},{header:r(()=>[a[9]||(a[9]=i("i",{class:"xiv sync-invert"},null,-1)),i("span",Eo,p(e(t)("workflow.text.set_workflows")),1)]),default:r(()=>[i("div",{class:"block",ref_key:"headerBlock",ref:J},[i("div",Wo,[i("p",null,p(e(t)("workflow.text.switch_workflows")),1),i("div",Do,[($(!0),Ee(Zt,null,eo(e(c).workflows,(x,ue)=>($(),N(M,{key:ue,size:"tiny",type:ue===e(c).currentWorkflow?"primary":"default",onClick:ea=>e(c).currentWorkflow=ue},{default:r(()=>[q(p(x.name||e(t)("workflow.text.workflow_with_index",ue+1)),1)]),_:2},1032,["type","onClick"]))),128)),n(ge,{size:"tiny",square:"",icon:e(ro),"icon-size":16,tip:e(t)("workflow.text.add_a_workflow"),onClick:V},null,8,["icon","tip"]),n(ge,{size:"tiny",square:"",icon:e(Se),"icon-size":14,tip:e(t)("workflow.text.manage_existed_workflows"),onClick:Xe},null,8,["icon","tip"])])])],512)]),_:1}),i("div",{class:"content-block",style:be({"--select-card-width":e(fe)})},[n(u,{"card-key":"workflow-content-items",class:"items-wrapper","fold-direction":e(d)?"vertical":"horizontal",onOnCardFoldStatusChanged:Ye},{header:r(()=>[a[10]||(a[10]=i("i",{class:"xiv square-1"},null,-1)),i("span",Lo,p(e(t)("common.select_item2")),1),n(Mo,null,{default:r(()=>[ke(i("a",{class:"card-title-extra",href:"javascript:void(0);"}," ["+p(e(t)("common.import"))+"] ",513),[[xe,!e(Me)]])]),_:1})]),default:r(()=>[i("div",Fo,[i("div",Oo,[n(ct,null,{default:r(()=>[n(y,null,{default:r(()=>[q(p(e(t)("common.add_item")),1)]),_:1}),n(Dt,{onOnItemSelected:Qe})]),_:1})]),i("div",jo,[n(Lt,{items:e(o).targetItems,"onUpdate:items":a[0]||(a[0]=x=>e(o).targetItems=x),"show-item-details":"","item-span-max-width":"230px","content-height":e(Z).itemSelectTable},null,8,["items","content-height"])]),i("div",qo,[n(ge,{icon:e(lo),text:e(t)("common.clear"),tip:e(t)("workflow.text.clear_current_workflow"),onClick:Je},null,8,["icon","text","tip"])])])]),_:1},8,["fold-direction"]),n(u,{unfoldable:!e(d),"card-key":"workflow-content-statistics",class:"statistics-wrapper"},{header:r(()=>[a[11]||(a[11]=i("i",{class:"xiv square-2"},null,-1)),i("span",Ho,p(e(t)("common.view_analysis")),1),i("a",{class:"card-title-extra",href:"javascript:void(0);",disabled:e(G),style:be(e(G)?"cursor: not-allowed; color: gray;":"cursor: pointer;"),onClick:rt}," ["+p(e(G)?e(t)("common.loading"):e(t)("statistics.group.cost_and_benefit.title"))+"] ",13,Vo),ke(i("a",{class:"card-title-extra",href:"javascript:void(0);",style:{cursor:"pointer"},title:e(t)("workflow.tooltip.set_prepared_by_inventory"),onClick:lt}," ["+p(e(t)("workflow.text.sync_from_inventory"))+"] ",9,Go),[[xe,e(h).inventory_workflow_enable_sync&&e(F)==="statements"]]),ke(i("a",{class:"card-title-extra",href:"javascript:void(0);",style:{cursor:"pointer"},title:e(t)("workflow.tooltip.set_inventory_by_prepared"),onClick:it}," ["+p(e(t)("workflow.text.sync_to_inventory"))+"] ",9,Xo),[[xe,e(h).inventory_workflow_enable_sync_reverse&&e(F)==="statements"]])]),default:r(()=>[i("div",Ko,[n(dt,{value:e(F),"onUpdate:value":a[4]||(a[4]=x=>K(F)?F.value=x:null),type:"segment",animated:"",class:"h-full"},{default:r(()=>[n(ve,{name:"statistics"},{tab:r(()=>[i("div",Qo,[n(X,{size:16},{default:r(()=>[n(e(io))]),_:1}),i("div",null,p(e(t)("common.statistics")),1)])]),default:r(()=>[n(_o,{"item-selected":e(o).targetItems,"list-height":e(Z).statisticsBlock},null,8,["item-selected","list-height"])]),_:1}),n(ve,{name:"statements"},{tab:r(()=>[i("div",Jo,[n(X,{size:16},{default:r(()=>[n(e(co))]),_:1}),i("div",null,p(e(t)("common.statement")),1)])]),default:r(()=>[e(h).use_traditional_statement?($(),N(jt,to(oo({key:0},e(O))),null,16)):($(),N(qt,{key:1,ref_key:"proStatementInstace",ref:W,"items-prepared":e(o).preparedItems,"onUpdate:itemsPrepared":a[1]||(a[1]=x=>e(o).preparedItems=x),"craft-targets":e($e),"statement-blocks":e(ie).statementBlocks,"content-height":e(Z).statementsBlock},null,8,["items-prepared","craft-targets","statement-blocks","content-height"]))]),_:1}),n(ve,{name:"processes",style:be({transform:"translate(0)",minHeight:e(Z).recommProcessContainer})},{tab:r(()=>[i("div",Yo,[n(X,{size:16},{default:r(()=>[n(e(po))]),_:1}),i("div",null,p(e(t)("common.process")),1)])]),default:r(()=>[n(Ht,{"expanded-blocks":e(o).recommData.expandedBlocks,"onUpdate:expandedBlocks":a[2]||(a[2]=x=>e(o).recommData.expandedBlocks=x),"completed-items":e(o).recommData.completedItems,"onUpdate:completedItems":a[3]||(a[3]=x=>e(o).recommData.completedItems=x),"item-groups":e(j),"content-max-height":e(Z).recommProcess,"content-max-width":"1080px"},null,8,["expanded-blocks","completed-items","item-groups","content-max-height"]),e(d)?ye("",!0):($(),N(ut,{key:0,right:"20px",bottom:"5px"},{default:r(()=>[e(tt)?($(),N(he,{key:0,trigger:e(d)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(we,{onClick:ot},{default:r(()=>[n(X,null,{default:r(()=>[n(e(uo))]),_:1})]),_:1})]),default:r(()=>[q(" "+p(e(t)("common.open_in_new_window")),1)]),_:1},8,["trigger"])):ye("",!0),e(j).length?($(),N(he,{key:1,trigger:e(d)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(we,{onClick:at},{default:r(()=>[n(X,null,{default:r(()=>[e(pe)?($(),N(e(mo),{key:0})):($(),N(e(fo),{key:1}))]),_:1})]),_:1})]),default:r(()=>[q(" "+p(e(pe)?e(t)("common.expand_all"):e(t)("common.fold_all")),1)]),_:1},8,["trigger"])):ye("",!0),n(he,{trigger:e(d)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(we,{onClick:st},{default:r(()=>[n(X,null,{default:r(()=>[n(e(Se))]),_:1})]),_:1})]),default:r(()=>[q(" "+p(e(t)("common.setting")),1)]),_:1},8,["trigger"])]),_:1}))]),_:1},8,["style"])]),_:1},8,["value"])])]),_:1},8,["unfoldable"])],4),n(To,{show:e(le),"onUpdate:show":a[5]||(a[5]=x=>K(le)?le.value=x:null),workflows:e(c).workflows,"onUpdate:workflows":a[6]||(a[6]=x=>e(c).workflows=x),onAfterSave:Ke},null,8,["show","workflows"]),n(Nt,{show:e(ce),"onUpdate:show":a[7]||(a[7]=x=>K(ce)?ce.value=x:null),"cost-items":e(O).materialsLvBase,"benefit-items":e(O).craftTargets,"cost-info":e(_e).costInfo,"benefit-info":e(_e).benefitInfo},null,8,["show","cost-items","benefit-items","cost-info","benefit-info"]),n(Tt,{show:e(B),"onUpdate:show":a[8]||(a[8]=x=>K(B)?B.value=x:null),"setting-group":e(Q),"app-show-up":e(se),"app-show-fp":e(ne)},null,8,["show","setting-group","app-show-up","app-show-fp"]),n(mt)])}}}),ra=Be(Zo,[["__scopeId","data-v-0475776d"]]);export{ra as default};
