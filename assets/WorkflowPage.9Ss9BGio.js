import{d as ae,s as D,e as C,p as ft,t as De,r as h,k as F,f as Fe,h as Le,P as N,o as z,R as r,a as i,U as n,Q as e,V as _,Z as K,n as q,v as pt,W as _t,X as Ne,w as Te,c as Ae,N as ge,F as vt,Y as wt,q as be,y as ke,a9 as ht,x as gt,S as xe}from"./vendor.DaGD8wRy.js";import{L as ee,N as te,O as T,T as U,B as Oe,C as de,aL as bt,U as A,J as je,K as kt,ag as xt,a5 as yt,aM as St,W as It,aN as Ct,ao as Pt,aO as Bt,aP as Mt,aq as Ee,h as Ce,au as Pe,av as zt,aQ as qe,at as Be,as as $t,aR as Rt,g as He,A as Ve,e as Me,aB as Ut,aS as Nt,aT as oe,aU as Ge,f as Tt,u as At,aV as We,aW as Et,r as Wt,s as Dt,F as ye,x as Ft,aX as Lt,i as Ot,d as Se,aY as jt,aZ as qt,m as Ht,a_ as Vt,_ as Gt,c as Xt,a$ as Kt,b0 as Qt,b1 as Jt,b2 as Yt,y as Zt,z as eo,b3 as to}from"./index.CG8fR3B8.js";import{A as oo,z as ao,S as Ie,o as so,a1 as no,p as ro,az as lo,k as io,as as co,aA as uo,aB as mo,l as fo}from"./icons.BN6_TYLH.js";import{C as po}from"./CraftStatistics.V_MVglOb.js";import{D as _o}from"./DraggableTable.gpJyNAgZ.js";const vo=ee("float-button-group",[ee("float-button",`
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
 `)])]),wo=Object.assign(Object.assign({},de.props),{left:[Number,String],right:[Number,String],top:[Number,String],bottom:[Number,String],shape:{type:String,default:"circle"},position:{type:String,default:"fixed"}}),Xe=kt("n-float-button-group"),ho=ae({name:"FloatButtonGroup",props:wo,setup(l){const{mergedClsPrefixRef:t,inlineThemeDisabled:c}=Oe(l),m=de("FloatButtonGroup","-float-button-group",vo,bt,l,t),g=C(()=>{const{self:{color:P,boxShadow:w,buttonBorderColor:S,borderRadiusSquare:I},common:{cubicBezierEaseInOut:b}}=m.value;return{"--n-bezier":b,"--n-box-shadow":w,"--n-color":P,"--n-button-border-color":S,"--n-border-radius-square":I,position:l.position,left:A(l.left)||"",right:A(l.right)||"",top:A(l.top)||"",bottom:A(l.bottom)||""}});ft(Xe,{shapeRef:De(l,"shape")});const v=c?je("float-button",void 0,g,l):void 0;return{cssVars:c?void 0:g,mergedClsPrefix:t,themeClass:v?.themeClass,onRender:v?.onRender}},render(){const{mergedClsPrefix:l,cssVars:t,shape:c}=this;return D("div",{class:[`${l}-float-button-group`,`${l}-float-button-group--${c}-shape`],style:t,role:"group"},this.$slots)}}),go=ee("float-button",`
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
 `)])]),bo=Object.assign(Object.assign({},de.props),{width:{type:[Number,String],default:40},height:{type:[Number,String],default:40},left:[Number,String],right:[Number,String],top:[Number,String],bottom:[Number,String],shape:{type:String,default:"circle"},position:{type:String,default:"fixed"},type:{type:String,default:"default"},menuTrigger:String,showMenu:{type:Boolean,default:void 0},onUpdateShowMenu:{type:[Function,Array],default:void 0},"onUpdate:showMenu":{type:[Function,Array],default:void 0}}),ko=ae({name:"FloatButton",props:bo,slots:Object,setup(l){const{mergedClsPrefixRef:t,inlineThemeDisabled:c}=Oe(l),m=h(null),g=de("FloatButton","-float-button",go,Ct,l,t),v=F(Xe,null),P=h(!1),w=De(l,"showMenu"),S=Pt(w,P);function I(f){const{onUpdateShowMenu:R,"onUpdate:showMenu":B}=l;P.value=f,R&&Ee(R,f),B&&Ee(B,f)}const b=C(()=>{const{self:{color:f,textColor:R,boxShadow:B,boxShadowHover:Q,boxShadowPressed:se,colorHover:ne,colorPrimary:L,colorPrimaryHover:J,textColorPrimary:W,borderRadiusSquare:re,colorPressed:Y,colorPrimaryPressed:H},common:{cubicBezierEaseInOut:me}}=g.value,{type:V}=l;return{"--n-bezier":me,"--n-box-shadow":B,"--n-box-shadow-hover":Q,"--n-box-shadow-pressed":se,"--n-color":V==="primary"?L:f,"--n-text-color":V==="primary"?W:R,"--n-color-hover":V==="primary"?J:ne,"--n-color-pressed":V==="primary"?H:Y,"--n-border-radius-square":re}}),k=C(()=>{const{width:f,height:R}=l;return Object.assign({position:v?void 0:l.position,width:A(f),minHeight:A(R)},v?null:{left:A(l.left),right:A(l.right),top:A(l.top),bottom:A(l.bottom)})}),$=C(()=>v?v.shapeRef.value:l.shape),E=()=>{l.menuTrigger==="hover"&&I(!0)},p=()=>{l.menuTrigger==="hover"&&S.value&&I(!1)},u=()=>{l.menuTrigger==="click"&&I(!S.value)},o=c?je("float-button",C(()=>l.type[0]),b,l):void 0;return Fe(()=>{const f=m.value;f&&Bt("mousemoveoutside",f,p)}),Le(()=>{const f=m.value;f&&Mt("mousemoveoutside",f,p)}),{inlineStyle:k,selfElRef:m,cssVars:c?void 0:b,mergedClsPrefix:t,mergedShape:$,mergedShowMenu:S,themeClass:o?.themeClass,onRender:o?.onRender,Mouseenter:E,handleMouseleave:p,handleClick:u}},render(){var l;const{mergedClsPrefix:t,cssVars:c,mergedShape:m,type:g,menuTrigger:v,mergedShowMenu:P,themeClass:w,$slots:S,inlineStyle:I,onRender:b}=this;return b?.(),D("div",{ref:"selfElRef",class:[`${t}-float-button`,`${t}-float-button--${m}-shape`,`${t}-float-button--${g}-type`,P&&`${t}-float-button--show-menu`,w],style:[c,I],onMouseenter:this.Mouseenter,onMouseleave:this.handleMouseleave,onClick:this.handleClick,role:"button"},D("div",{class:`${t}-float-button__fill`,"aria-hidden":!0}),D("div",{class:`${t}-float-button__body`},(l=S.default)===null||l===void 0?void 0:l.call(S),It(S.description,k=>k?D("div",{class:`${t}-float-button__description`},k):null)),v?D("div",{class:`${t}-float-button__close`},D(yt,{clsPrefix:t},{default:()=>D(St,null)})):null,v?D("div",{onClick:k=>{k.stopPropagation()},"data-float-button-menu":!0,class:`${t}-float-button__menu`},xt(S.menu,()=>[])):null)}}),xo={class:"wrapper",ref:"listPopContainer"},yo={class:"pop-title font-big"},So={class:"input-container"},Io={class:"actions-container"},Co=`仪仗长刀 x 1\r
セレモニアル・シャムシールx2\r
5x Ceremonial Shamshir`,Po=ae({__name:"ImportItemListPop",setup(l){const t=Ce(),c=F("t"),m=F("isMobile")??h(!1),g=F("joinItemsToWorkflow"),{alertError:v}=Ve(c),P=h(!1),w=h(""),S=()=>{const I=w.value.split(`
`).map(p=>p.trim()).filter(p=>!!p);if(!I.length){t.info(c("macro_manage.text.please_input_content_to_import"));return}const b=Rt(),k=[],$={};if(I.forEach((p,u)=>{const o=E(p);if(!o){k.push(c("workflow.import.itemlist.message.error_format_invalid",[u+1,p]));return}const{name:f,count:R}=o;if(R<=0){k.push(c("workflow.import.itemlist.message.error_count_invalid",[u+1,R]));return}const B=b.get(f);if(!B){k.push(c("workflow.import.itemlist.message.error_item_not_found",[u+1,f]));return}if($[B]){k.push(c("workflow.import.itemlist.message.error_item_duplicated",[u+1,f]));return}if(!He(B).craftInfo?.recipeId){k.push(c("workflow.import.itemlist.message.error_item_not_craftable",[u+1,f]));return}$[B]=R}),k.length){v(c("workflow.import.itemlist.message.error_content_invalid_prev")+`\r
`+k.map(p=>` ${p}`).join(`\r
`)+`\r
`+c("workflow.import.itemlist.message.error_content_invalid_after"));return}g($),P.value=!1;function E(p){const u=p.trim(),o=u.match(/^(.+?)\s*[xX]\s*(\d+)$/);if(o)return{name:o[1].trim(),count:Number(o[2])};const f=u.match(/^(\d+)\s*[xX]\s*(.+)$/);return f?{name:f[2].trim(),count:Number(f[1])}:null}};return(I,b)=>{const k=Pe,$=zt,E=qe,p=Be,u=$t;return z(),N(u,{show:e(P),"onUpdate:show":b[1]||(b[1]=o=>K(P)?P.value=o:null),trigger:"click",placement:e(m)?"bottom":"right-start",width:300},{trigger:r(()=>[pt(I.$slots,"default",{},void 0,!0)]),default:r(()=>[i("div",xo,[i("div",yo,[n(k,{size:16},{default:r(()=>[n(e(oo))]),_:1}),i("span",null,_(e(c)("common.import")),1)]),n($,{style:{margin:"0 0 3px"}}),i("div",null,_(e(c)("workflow.import.itemlist.tip_1"))+" "+_(e(c)("workflow.import.itemlist.tip_2")),1),i("div",So,[n(E,{type:"textarea",value:e(w),"onUpdate:value":b[0]||(b[0]=o=>K(w)?w.value=o:null),placeholder:Co,rows:10},null,8,["value"])]),i("div",Io,[n(p,{type:"primary",onClick:S},{icon:r(()=>[n(k,null,{default:r(()=>[n(e(ao))]),_:1})]),default:r(()=>[q(" "+_(e(c)("common.confirm")),1)]),_:1})])],512)]),_:3},8,["show","placement"])}}}),Bo=Me(Po,[["__scopeId","data-v-d405ba43"]]),Mo={class:"wrapper"},zo={class:"flex-vac"},$o={class:"bold"},Ro={class:"modal-submit-container"},Uo=ae({__name:"ModalWorkflowsManage",props:{show:{type:Boolean,required:!0},showModifiers:{},workflows:{required:!0},workflowsModifiers:{}},emits:_t(["afterSave"],["update:show","update:workflows"]),setup(l,{emit:t}){const c=Ce(),m=F("t"),g=Ne(l,"show"),v=Ne(l,"workflows"),P=t,w=h(),S=()=>{if(!w.value?.handleSave){c.error("Unexpected error: workflowsTable not defined");return}w.value.handleSave()&&(g.value=!1,c.success(m("common.save_succeed")),P("afterSave"))};return(I,b)=>{const k=qe,$=Pe,E=Be;return z(),N(Ut,{show:g.value,"onUpdate:show":b[1]||(b[1]=p=>g.value=p),icon:e(Ie),title:e(m)("workflow.text.manage_workflows"),"max-width":"600px"},{action:r(()=>[i("div",Ro,[n(E,{type:"primary",size:"large",onClick:S},{icon:r(()=>[n($,null,{default:r(()=>[n(e(so))]),_:1})]),default:r(()=>[q(" "+_(e(m)("common.save")),1)]),_:1})])]),default:r(()=>[i("div",Mo,[i("p",null,_(e(m)("workflow.text.manage_workflows_desc")),1),n(_o,{data:v.value,"onUpdate:data":b[0]||(b[0]=p=>v.value=p),ref_key:"workflowsTable",ref:w,"can-add":"",min:1,"min-tip":e(m)("workflow.text.min_len"),max:e(oe),"max-tip":e(m)("workflow.message.max_len",e(oe)),"get-default-data-row":e(Ge)},{tableTitle:r(()=>[i("div",zo,[i("div",$o,_(e(m)("workflow.text.workflow_name")),1),i("div",null,[n(Nt,{icon:"question",descriptions:[e(m)("workflow.text.workflow_name_default_info",e(oe)),e(m)("workflow.text.workflow_name_reorder_on_deleted")]},null,8,["descriptions"])])])]),default:r(({row:p,rowIndex:u})=>[n(k,{value:p.name,"onUpdate:value":o=>p.name=o,type:"text",placeholder:e(m)("workflow.text.workflow_with_index",u+1)},null,8,["value","onUpdate:value","placeholder"])]),_:1},8,["data","min-tip","max","max-tip","get-default-data-row"]),i("p",null,_(e(m)("common.all_changes_effects_after_save")),1)])]),_:1},8,["show","icon","title"])}}}),No=Me(Uo,[["__scopeId","data-v-ec95853e"]]),To={id:"main-container",class:"wrapper"},Ao={class:"card-title-text"},Eo={class:"action"},Wo={class:"flex-wrap",style:{gap:"5px"}},Do={class:"card-title-text"},Fo={class:"block items-block"},Lo={class:"top-actions"},Oo={class:"content-table"},jo={class:"bottom-actions"},qo={class:"card-title-text"},Ho=["disabled"],Vo=["title"],Go=["title"],Xo={class:"block"},Ko={class:"tab-title"},Qo={class:"tab-title"},Jo={class:"tab-title"},Yo=ae({__name:"WorkflowPage",setup(l){const t=F("t"),c=F("isMobile")??h(!1),m=F("userConfig"),g=F("funcConfig"),v=Tt(),{alertError:P}=Ve(t),w=Ce(),{emitSync:S,onSync:I}=Et(),{calItems:b}=At(),{getStatementData:k,getProStatementData:$,calRecommProcessData:E,calRecommProcessGroups:p}=Wt(m,g,t),u=h(We()),o=C(()=>u.value.workflows[u.value.currentWorkflow]),f=h(!1);if(!(m.value.disable_workstate_cache??!1)){const s=m.value.workflow_cache_work_state;s&&JSON.stringify(s).length>2&&(u.value=We(s)),Te(u,async()=>{if(u.value&&m)try{if(await Promise.resolve(),f.value){f.value=!1;return}m.value.workflow_cache_work_state=u.value,v.setUserConfig(m.value),S("workflowStateChanged",to(m.value))}catch(a){console.error("Error handling workState change:",a)}else console.warn("workState or userConfig is not defined")},{deep:!0})}I("workflowStateChanged",s=>{f.value=!0,u.value=s.workflow_cache_work_state});const B=h(!1),Q=h(void 0),se=h(!1),ne=h(!1),L=h("statistics"),J=h(),W=h(),re=h(window.innerHeight),Y=h(0),H=()=>{re.value=window.innerHeight,J.value?.offsetHeight?Y.value=J.value.offsetHeight+20:Y.value=0},me=()=>{setTimeout(H,10)};Fe(()=>{H(),window.addEventListener("resize",H)}),Le(()=>{window.removeEventListener("resize",H)});const V=()=>{if(u.value.workflows.length>=oe){w.warning(t("workflow.message.max_len",oe));return}u.value.workflows.push(Ge())},le=h(!1),Ke=()=>{le.value=!0},Qe=()=>{u.value.currentWorkflow>=u.value.workflows.length&&(u.value.currentWorkflow=u.value.workflows.length-1)},Z=C(()=>{const a=re.value-320-Y.value;return c.value?{itemSelectTable:"auto",statisticsBlock:void 0,statementsBlock:"auto",recommProcess:"auto",recommProcessContainer:"60px"}:{itemSelectTable:a-65+"px",statisticsBlock:a/2-45,statementsBlock:a-50+"px",recommProcess:a+"px",recommProcessContainer:a+12+"px"}}),Je=s=>{s&&(o.value.targetItems[s]?w.info(t("common.message.item_already_have")):(o.value.targetItems[s]=1,o.value.preparedItems.craftTarget[s]=0))},Ye=()=>{o.value.targetItems={},o.value.preparedItems={craftTarget:{},materialsLv1:{},materialsLvBase:{}},w.success(t("common.cleared"))},ze=h(!1),fe=h("450px"),Ze=s=>{ze.value=s,s?fe.value="200px":fe.value="450px",setTimeout(()=>{W?.value?.updateSize&&W.value.updateSize()},10)},$e=C(()=>{const s=[];for(const a in o.value.targetItems){const M=Number(a),d=o.value.targetItems[M];if(d>0){const y=He(M);y.amount=d,s.push(y)}}return s}),et=C(()=>b(o.value.targetItems)),O=C(()=>k(et.value)),ie=C(()=>$($e.value,o.value.preparedItems)),tt=C(()=>E(ie.value.targetItemsForCal,ie.value.lv1ItemsForCal,ie.value.baseItemsForCal)),j=C(()=>{const{craftTargets:s,lv1Items:a,lv2Items:M,lv3Items:d,lvBaseItems:y}=tt.value;return p(s,a,M,d,y,g.value.processes_craftable_item_sortby,g.value.processes_merge_gatherings,m.value.language_ui,t)}),Re=()=>{const{craftTargets:s,materialsLv1:a,materialsLvBase:M}=O.value;s.forEach(d=>{const y=o.value.preparedItems.craftTarget[d.id];y?y>d.amount&&(o.value.preparedItems.craftTarget[d.id]=d.amount):o.value.preparedItems.craftTarget[d.id]=0}),a.forEach(d=>{const y=o.value.preparedItems.materialsLv1[d.id];y?y>d.amount&&(o.value.preparedItems.materialsLv1[d.id]=d.amount):o.value.preparedItems.materialsLv1[d.id]=0}),M.forEach(d=>{const y=o.value.preparedItems.materialsLvBase[d.id];y?y>d.amount&&(o.value.preparedItems.materialsLvBase[d.id]=d.amount):o.value.preparedItems.materialsLvBase[d.id]=0})},Ue=()=>{for(let s=0;s<j.value.length;s++)o.value.recommData.expandedBlocks[s]||(o.value.recommData.expandedBlocks[s]=["1"]),o.value.recommData.completedItems[s]||(o.value.recommData.completedItems[s]={}),j.value[s].items.forEach(a=>{o.value.recommData.completedItems[s][a.id]||(o.value.recommData.completedItems[s][a.id]=!1)})};Te(j,async()=>{Ue(),Re()}),Ue(),Re();const pe=C(()=>{let s=!0;for(let a=0;a<j.value.length;a++)o.value.recommData.expandedBlocks[a]&&o.value.recommData.expandedBlocks[a].length>0&&(s=!1);return s}),ot=C(()=>!!window.electronAPI&&!!window.$syncStore),at=()=>{const s=t("workflow.recomm_process"),a=document.location.origin+document.location.pathname+"#/workflow_process?mode=overlay",M=400,d=350;window.electronAPI?.createNewWindow?window.electronAPI.createNewWindow("workflow-process",a,M,d,s):window.open(a,s,`height=${d}, width=${M}, top=200, left=200`)},st=()=>{const s=pe.value;for(let a=0;a<j.value.length;a++)o.value.recommData.expandedBlocks[a]=s?["1"]:[]},nt=()=>{se.value=!1,ne.value=!0,Q.value="recomm_process",B.value=!0},ce=h(!1),_e=C(()=>Dt(g.value,O.value)),G=h(!1),rt=async()=>{if(_e.value.updateRequired){G.value=!0;try{const s=[];O.value.craftTargets.forEach(d=>{s.push(d.id)}),O.value.materialsLvBase.forEach(d=>{s.push(d.id)});const a=await Zt([...new Set(s)],g.value.universalis_server),M=g.value;Object.keys(a).forEach(d=>{const y=Number(d);M.cache_item_prices[y]=a[y]}),await v.setFuncConfig(eo(M,v.userConfig))}catch(s){console.error(s),await P(t("common.message.get_price_failed")+`
`+(s?.message??s))}G.value=!1}},lt=async()=>{if(G.value){w.info(t("common.loading"));return}await rt(),ce.value=!0},it=()=>{W?.value?.setPreparedItemsByInventory?(W.value.setPreparedItemsByInventory(),w.success(t("common.message.sync_succeed"))):w.error("proStatementInstace Ref Notfound")},ct=()=>{W?.value?.setInventoryByPreparedItems?(W.value.setInventoryByPreparedItems(),w.success(t("common.message.sync_succeed"))):w.error("proStatementInstace Ref Notfound")};return(s,a)=>{const M=Be,d=qt,y=jt,X=Pe,ve=Xt,we=ko,he=Yt,ut=ho,dt=Gt,mt=Ot;return z(),Ae("div",To,[n(ye,{"card-key":"workflow-header",class:"header-block",onOnCardFoldStatusChanged:me},{header:r(()=>[a[9]||(a[9]=i("i",{class:"xiv sync-invert"},null,-1)),i("span",Ao,_(e(t)("workflow.text.set_workflows")),1)]),default:r(()=>[i("div",{class:"block",ref_key:"headerBlock",ref:J},[i("div",Eo,[i("p",null,_(e(t)("workflow.text.switch_workflows")),1),i("div",Wo,[(z(!0),Ae(vt,null,wt(e(u).workflows,(x,ue)=>(z(),N(M,{key:ue,size:"tiny",type:ue===e(u).currentWorkflow?"primary":"default",onClick:Zo=>e(u).currentWorkflow=ue},{default:r(()=>[q(_(x.name||e(t)("workflow.text.workflow_with_index",ue+1)),1)]),_:2},1032,["type","onClick"]))),128)),n(Se,{size:"tiny",square:"",icon:e(no),"icon-size":16,tip:e(t)("workflow.text.add_a_workflow"),onClick:V},null,8,["icon","tip"]),n(Se,{size:"tiny",square:"",icon:e(Ie),"icon-size":14,tip:e(t)("workflow.text.manage_existed_workflows"),onClick:Ke},null,8,["icon","tip"])])])],512)]),_:1}),i("div",{class:"content-block",style:ge({"--select-card-width":e(fe)})},[n(ye,{"card-key":"workflow-content-items",class:"items-wrapper","fold-direction":e(c)?"vertical":"horizontal",onOnCardFoldStatusChanged:Ze},{header:r(()=>[a[10]||(a[10]=i("i",{class:"xiv square-1"},null,-1)),i("span",Do,_(e(t)("common.select_item2")),1),n(Bo,null,{default:r(()=>[be(i("a",{class:"card-title-extra",href:"javascript:void(0);"}," ["+_(e(t)("common.import"))+"] ",513),[[ke,!e(ze)]])]),_:1})]),default:r(()=>[i("div",Fo,[i("div",Lo,[n(y,null,{default:r(()=>[n(d,null,{default:r(()=>[q(_(e(t)("common.add_item")),1)]),_:1}),n(Ht,{onOnItemSelected:Je})]),_:1})]),i("div",Oo,[n(Vt,{items:e(o).targetItems,"onUpdate:items":a[0]||(a[0]=x=>e(o).targetItems=x),"show-item-details":"","item-span-max-width":"230px","content-height":e(Z).itemSelectTable},null,8,["items","content-height"])]),i("div",jo,[n(Se,{icon:e(ro),text:e(t)("common.clear"),tip:e(t)("workflow.text.clear_current_workflow"),onClick:Ye},null,8,["icon","text","tip"])])])]),_:1},8,["fold-direction"]),n(ye,{unfoldable:!e(c),"card-key":"workflow-content-statistics",class:"statistics-wrapper"},{header:r(()=>[a[11]||(a[11]=i("i",{class:"xiv square-2"},null,-1)),i("span",qo,_(e(t)("common.view_analysis")),1),i("a",{class:"card-title-extra",href:"javascript:void(0);",disabled:e(G),style:ge(e(G)?"cursor: not-allowed; color: gray;":"cursor: pointer;"),onClick:lt}," ["+_(e(G)?e(t)("common.loading"):e(t)("statistics.group.cost_and_benefit.title"))+"] ",13,Ho),be(i("a",{class:"card-title-extra",href:"javascript:void(0);",style:{cursor:"pointer"},title:e(t)("workflow.tooltip.set_prepared_by_inventory"),onClick:it}," ["+_(e(t)("workflow.text.sync_from_inventory"))+"] ",9,Vo),[[ke,e(g).inventory_workflow_enable_sync&&e(L)==="statements"]]),be(i("a",{class:"card-title-extra",href:"javascript:void(0);",style:{cursor:"pointer"},title:e(t)("workflow.tooltip.set_inventory_by_prepared"),onClick:ct}," ["+_(e(t)("workflow.text.sync_to_inventory"))+"] ",9,Go),[[ke,e(g).inventory_workflow_enable_sync_reverse&&e(L)==="statements"]])]),default:r(()=>[i("div",Xo,[n(dt,{value:e(L),"onUpdate:value":a[4]||(a[4]=x=>K(L)?L.value=x:null),type:"segment",animated:"",class:"h-full"},{default:r(()=>[n(ve,{name:"statistics"},{tab:r(()=>[i("div",Ko,[n(X,{size:16},{default:r(()=>[n(e(lo))]),_:1}),i("div",null,_(e(t)("common.statistics")),1)])]),default:r(()=>[n(po,{"item-selected":e(o).targetItems,"list-height":e(Z).statisticsBlock},null,8,["item-selected","list-height"])]),_:1}),n(ve,{name:"statements"},{tab:r(()=>[i("div",Qo,[n(X,{size:16},{default:r(()=>[n(e(io))]),_:1}),i("div",null,_(e(t)("common.statement")),1)])]),default:r(()=>[e(g).use_traditional_statement?(z(),N(Kt,ht(gt({key:0},e(O))),null,16)):(z(),N(Qt,{key:1,ref_key:"proStatementInstace",ref:W,"items-prepared":e(o).preparedItems,"onUpdate:itemsPrepared":a[1]||(a[1]=x=>e(o).preparedItems=x),"craft-targets":e($e),"statement-blocks":e(ie).statementBlocks,"content-height":e(Z).statementsBlock},null,8,["items-prepared","craft-targets","statement-blocks","content-height"]))]),_:1}),n(ve,{name:"processes",style:ge({transform:"translate(0)",minHeight:e(Z).recommProcessContainer})},{tab:r(()=>[i("div",Jo,[n(X,{size:16},{default:r(()=>[n(e(fo))]),_:1}),i("div",null,_(e(t)("common.process")),1)])]),default:r(()=>[n(Jt,{"expanded-blocks":e(o).recommData.expandedBlocks,"onUpdate:expandedBlocks":a[2]||(a[2]=x=>e(o).recommData.expandedBlocks=x),"completed-items":e(o).recommData.completedItems,"onUpdate:completedItems":a[3]||(a[3]=x=>e(o).recommData.completedItems=x),"item-groups":e(j),"content-max-height":e(Z).recommProcess,"content-max-width":"1080px","hide-chs-offline-items":e(o).recommData.hideChsOfflineItems},null,8,["expanded-blocks","completed-items","item-groups","content-max-height","hide-chs-offline-items"]),e(c)?xe("",!0):(z(),N(ut,{key:0,right:"20px",bottom:"5px"},{default:r(()=>[e(ot)?(z(),N(he,{key:0,trigger:e(c)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(we,{onClick:at},{default:r(()=>[n(X,null,{default:r(()=>[n(e(co))]),_:1})]),_:1})]),default:r(()=>[q(" "+_(e(t)("common.open_in_new_window")),1)]),_:1},8,["trigger"])):xe("",!0),e(j).length?(z(),N(he,{key:1,trigger:e(c)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(we,{onClick:st},{default:r(()=>[n(X,null,{default:r(()=>[e(pe)?(z(),N(e(uo),{key:0})):(z(),N(e(mo),{key:1}))]),_:1})]),_:1})]),default:r(()=>[q(" "+_(e(pe)?e(t)("common.expand_all"):e(t)("common.fold_all")),1)]),_:1},8,["trigger"])):xe("",!0),n(he,{trigger:e(c)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(we,{onClick:nt},{default:r(()=>[n(X,null,{default:r(()=>[n(e(Ie))]),_:1})]),_:1})]),default:r(()=>[q(" "+_(e(t)("common.setting")),1)]),_:1},8,["trigger"])]),_:1}))]),_:1},8,["style"])]),_:1},8,["value"])])]),_:1},8,["unfoldable"])],4),n(No,{show:e(le),"onUpdate:show":a[5]||(a[5]=x=>K(le)?le.value=x:null),workflows:e(u).workflows,"onUpdate:workflows":a[6]||(a[6]=x=>e(u).workflows=x),onAfterSave:Qe},null,8,["show","workflows"]),n(Ft,{show:e(ce),"onUpdate:show":a[7]||(a[7]=x=>K(ce)?ce.value=x:null),"cost-items":e(O).materialsLvBase,"benefit-items":e(O).craftTargets,"cost-info":e(_e).costInfo,"benefit-info":e(_e).benefitInfo},null,8,["show","cost-items","benefit-items","cost-info","benefit-info"]),n(Lt,{show:e(B),"onUpdate:show":a[8]||(a[8]=x=>K(B)?B.value=x:null),"setting-group":e(Q),"app-show-up":e(se),"app-show-fp":e(ne)},null,8,["show","setting-group","app-show-up","app-show-fp"]),n(mt)])}}}),na=Me(Yo,[["__scopeId","data-v-2bcaaf12"]]);export{na as default};
