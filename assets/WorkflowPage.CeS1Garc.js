import{d as ue,s as $,e as k,p as ct,t as Ne,r as w,k as j,f as $e,h as Ae,W as ut,X as Be,P as A,R as r,Q as e,o as B,a as c,S as n,U as h,n as q,w as Pe,c as Me,N as ge,Z as ce,F as dt,Y as mt,a8 as ft,x as pt,V as be,q as ze,y as Re}from"./vendor.Bn-7_sVg.js";import{K as Y,L as Z,N as R,R as P,B as De,C as de,aK as vt,T,G as We,J as wt,af as ht,a4 as _t,aL as gt,V as bt,aM as kt,an as xt,aN as yt,aO as St,ap as Te,h as Ee,aA as It,aP as Ct,aQ as Bt,aR as ee,aS as Fe,at as Oe,as as Le,e as He,f as Pt,u as Mt,aT as Ue,aU as zt,g as Rt,r as Tt,s as Ut,F as ke,x as Nt,aV as $t,i as At,a as xe,aW as Dt,aX as Wt,m as Et,aY as Ft,_ as Ot,b as Lt,aZ as Ht,a_ as Vt,a$ as qt,b0 as jt,y as Gt,z as Kt,A as Qt,b1 as Xt}from"./index.Bh4IZ4cI.js";import{C as Jt}from"./CraftStatistics.BuzxVlnZ.js";import{D as Yt}from"./DraggableTable.DlXFeB1Z.js";import{S as ye,o as Zt,a0 as eo,p as to,aA as oo,k as ao,at as so,aB as no,aC as ro,l as lo}from"./icons.BPYJy1hK.js";const io=Y("float-button-group",[Y("float-button",`
 position: relative;
 `),Z("square-shape",`
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
 `,[Y("float-button",`
 background-color: unset;
 border-radius: 0;
 box-shadow: none;
 box-sizing: content-box;
 `,[R("&:not(:last-child)",`
 border-bottom: 1px solid var(--n-button-border-color); 
 `),R("&:first-child",`
 border-top-left-radius: 4px;
 border-top-right-radius: 4px;
 `),R("&:last-child",`
 border-bottom-left-radius: 4px;
 border-bottom-right-radius: 4px;
 `),P("fill",`
 top: 4px;
 right: 4px;
 bottom: 4px;
 left: 4px;
 border-radius: var(--n-border-radius-square); 
 `)])]),Z("circle-shape",[R(">:not(:last-child)",`
 margin-bottom: 16px;
 `)])]),co=Object.assign(Object.assign({},de.props),{left:[Number,String],right:[Number,String],top:[Number,String],bottom:[Number,String],shape:{type:String,default:"circle"},position:{type:String,default:"fixed"}}),Ve=wt("n-float-button-group"),uo=ue({name:"FloatButtonGroup",props:co,setup(l){const{mergedClsPrefixRef:o,inlineThemeDisabled:f}=De(l),u=de("FloatButtonGroup","-float-button-group",io,vt,l,o),p=k(()=>{const{self:{color:M,boxShadow:_,buttonBorderColor:y,borderRadiusSquare:C},common:{cubicBezierEaseInOut:x}}=u.value;return{"--n-bezier":x,"--n-box-shadow":_,"--n-color":M,"--n-button-border-color":y,"--n-border-radius-square":C,position:l.position,left:T(l.left)||"",right:T(l.right)||"",top:T(l.top)||"",bottom:T(l.bottom)||""}});ct(Ve,{shapeRef:Ne(l,"shape")});const m=f?We("float-button",void 0,p,l):void 0;return{cssVars:f?void 0:p,mergedClsPrefix:o,themeClass:m?.themeClass,onRender:m?.onRender}},render(){const{mergedClsPrefix:l,cssVars:o,shape:f}=this;return $("div",{class:[`${l}-float-button-group`,`${l}-float-button-group--${f}-shape`],style:o,role:"group"},this.$slots)}}),mo=Y("float-button",`
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
`,[Z("circle-shape",`
 border-radius: 4096px;
 `),Z("square-shape",`
 border-radius: var(--n-border-radius-square);
 `),P("fill",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0
 left: 0;
 transition: background-color .3s var(--n-bezier);
 border-radius: inherit;
 `),P("body",`
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
 `,[P("description",`
 font-size: 12px;
 text-align: center;
 line-height: 14px;
 `)]),R("&:hover","box-shadow: var(--n-box-shadow-hover);",[R(">",[P("fill",`
 background-color: var(--n-color-hover);
 `)])]),R("&:active","box-shadow: var(--n-box-shadow-pressed);",[R(">",[P("fill",`
 background-color: var(--n-color-pressed);
 `)])]),Z("show-menu",[R(">",[P("menu",`
 pointer-events: all;
 bottom: 100%;
 opacity: 1;
 `),P("close",`
 transform: scale(1);
 opacity: 1;
 `),P("body",`
 transform: scale(0.75);
 opacity: 0;
 `)])]),P("close",`
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
 `),P("menu",`
 position: absolute;
 bottom: calc(100% - 8px);
 display: flex;
 flex-direction: column;
 opacity: 0;
 pointer-events: none;
 transition:
 opacity .3s var(--n-bezier),
 bottom .3s var(--n-bezier); 
 `,[R("> *",`
 margin-bottom: 16px;
 `),Y("float-button",`
 position: relative !important;
 `)])]),fo=Object.assign(Object.assign({},de.props),{width:{type:[Number,String],default:40},height:{type:[Number,String],default:40},left:[Number,String],right:[Number,String],top:[Number,String],bottom:[Number,String],shape:{type:String,default:"circle"},position:{type:String,default:"fixed"},type:{type:String,default:"default"},menuTrigger:String,showMenu:{type:Boolean,default:void 0},onUpdateShowMenu:{type:[Function,Array],default:void 0},"onUpdate:showMenu":{type:[Function,Array],default:void 0}}),po=ue({name:"FloatButton",props:fo,slots:Object,setup(l){const{mergedClsPrefixRef:o,inlineThemeDisabled:f}=De(l),u=w(null),p=de("FloatButton","-float-button",mo,kt,l,o),m=j(Ve,null),M=w(!1),_=Ne(l,"showMenu"),y=xt(_,M);function C(b){const{onUpdateShowMenu:D,"onUpdate:showMenu":U}=l;M.value=b,D&&Te(D,b),U&&Te(U,b)}const x=k(()=>{const{self:{color:b,textColor:D,boxShadow:U,boxShadowHover:te,boxShadowPressed:oe,colorHover:ae,colorPrimary:W,colorPrimaryHover:Q,textColorPrimary:N,borderRadiusSquare:se,colorPressed:X,colorPrimaryPressed:O},common:{cubicBezierEaseInOut:me}}=p.value,{type:L}=l;return{"--n-bezier":me,"--n-box-shadow":U,"--n-box-shadow-hover":te,"--n-box-shadow-pressed":oe,"--n-color":L==="primary"?W:b,"--n-text-color":L==="primary"?N:D,"--n-color-hover":L==="primary"?Q:ae,"--n-color-pressed":L==="primary"?O:X,"--n-border-radius-square":se}}),z=k(()=>{const{width:b,height:D}=l;return Object.assign({position:m?void 0:l.position,width:T(b),minHeight:T(D)},m?null:{left:T(l.left),right:T(l.right),top:T(l.top),bottom:T(l.bottom)})}),G=k(()=>m?m.shapeRef.value:l.shape),K=()=>{l.menuTrigger==="hover"&&C(!0)},I=()=>{l.menuTrigger==="hover"&&y.value&&C(!1)},d=()=>{l.menuTrigger==="click"&&C(!y.value)},s=f?We("float-button",k(()=>l.type[0]),x,l):void 0;return $e(()=>{const b=u.value;b&&yt("mousemoveoutside",b,I)}),Ae(()=>{const b=u.value;b&&St("mousemoveoutside",b,I)}),{inlineStyle:z,selfElRef:u,cssVars:f?void 0:x,mergedClsPrefix:o,mergedShape:G,mergedShowMenu:y,themeClass:s?.themeClass,onRender:s?.onRender,Mouseenter:K,handleMouseleave:I,handleClick:d}},render(){var l;const{mergedClsPrefix:o,cssVars:f,mergedShape:u,type:p,menuTrigger:m,mergedShowMenu:M,themeClass:_,$slots:y,inlineStyle:C,onRender:x}=this;return x?.(),$("div",{ref:"selfElRef",class:[`${o}-float-button`,`${o}-float-button--${u}-shape`,`${o}-float-button--${p}-type`,M&&`${o}-float-button--show-menu`,_],style:[f,C],onMouseenter:this.Mouseenter,onMouseleave:this.handleMouseleave,onClick:this.handleClick,role:"button"},$("div",{class:`${o}-float-button__fill`,"aria-hidden":!0}),$("div",{class:`${o}-float-button__body`},(l=y.default)===null||l===void 0?void 0:l.call(y),bt(y.description,z=>z?$("div",{class:`${o}-float-button__description`},z):null)),m?$("div",{class:`${o}-float-button__close`},$(_t,{clsPrefix:o},{default:()=>$(gt,null)})):null,m?$("div",{onClick:z=>{z.stopPropagation()},"data-float-button-menu":!0,class:`${o}-float-button__menu`},ht(y.menu,()=>[])):null)}}),vo={class:"wrapper"},wo={class:"flex-vac"},ho={class:"bold"},_o={class:"modal-submit-container"},go=ue({__name:"ModalWorkflowsManage",props:{show:{type:Boolean,required:!0},showModifiers:{},workflows:{required:!0},workflowsModifiers:{}},emits:ut(["afterSave"],["update:show","update:workflows"]),setup(l,{emit:o}){const f=Ee(),u=j("t"),p=Be(l,"show"),m=Be(l,"workflows"),M=o,_=w(),y=()=>{if(!_.value?.handleSave){f.error("Unexpected error: workflowsTable not defined");return}_.value.handleSave()&&(p.value=!1,f.success(u("common.save_succeed")),M("afterSave"))};return(C,x)=>{const z=Ct,G=Oe,K=Le;return B(),A(It,{show:p.value,"onUpdate:show":x[1]||(x[1]=I=>p.value=I),icon:e(ye),title:e(u)("workflow.text.manage_workflows"),"max-width":"600px"},{action:r(()=>[c("div",_o,[n(K,{type:"primary",size:"large",onClick:y},{icon:r(()=>[n(G,null,{default:r(()=>[n(e(Zt))]),_:1})]),default:r(()=>[q(" "+h(e(u)("common.save")),1)]),_:1})])]),default:r(()=>[c("div",vo,[c("p",null,h(e(u)("workflow.text.manage_workflows_desc")),1),n(Yt,{data:m.value,"onUpdate:data":x[0]||(x[0]=I=>m.value=I),ref_key:"workflowsTable",ref:_,"can-add":"",min:1,"min-tip":e(u)("workflow.text.min_len"),max:e(ee),"max-tip":e(u)("workflow.message.max_len",e(ee)),"get-default-data-row":e(Fe)},{tableTitle:r(()=>[c("div",wo,[c("div",ho,h(e(u)("workflow.text.workflow_name")),1),c("div",null,[n(Bt,{icon:"question",descriptions:[e(u)("workflow.text.workflow_name_default_info",e(ee)),e(u)("workflow.text.workflow_name_reorder_on_deleted")]},null,8,["descriptions"])])])]),default:r(({row:I,rowIndex:d})=>[n(z,{value:I.name,"onUpdate:value":s=>I.name=s,type:"text",placeholder:e(u)("workflow.text.workflow_with_index",d+1)},null,8,["value","onUpdate:value","placeholder"])]),_:1},8,["data","min-tip","max","max-tip","get-default-data-row"]),c("p",null,h(e(u)("common.all_changes_effects_after_save")),1)])]),_:1},8,["show","icon","title"])}}}),bo=He(go,[["__scopeId","data-v-ec95853e"]]),ko={id:"main-container",class:"wrapper"},xo={class:"card-title-text"},yo={class:"action"},So={class:"flex-wrap",style:{gap:"5px"}},Io={class:"card-title-text"},Co={class:"block items-block"},Bo={class:"top-actions"},Po={class:"content-table"},Mo={class:"bottom-actions"},zo={class:"card-title-text"},Ro=["disabled"],To=["title"],Uo=["title"],No={class:"block"},$o={class:"tab-title"},Ao={class:"tab-title"},Do={class:"tab-title"},Wo=ue({__name:"WorkflowPage",setup(l){const o=j("t"),f=j("isMobile")??w(!1),u=j("userConfig"),p=j("funcConfig"),m=Pt(),{alertError:M}=Qt(o),_=Ee(),{emitSync:y,onSync:C}=zt(),{calItems:x}=Mt(),{getStatementData:z,getProStatementData:G,calRecommProcessData:K,calRecommProcessGroups:I}=Tt(u,p,o),d=w(Ue()),s=k(()=>d.value.workflows[d.value.currentWorkflow]),b=w(!1);if(!(u.value.disable_workstate_cache??!1)){const a=u.value.workflow_cache_work_state;a&&JSON.stringify(a).length>2&&(d.value=Ue(a)),Pe(d,async()=>{if(d.value&&u)try{if(await Promise.resolve(),b.value){b.value=!1;return}u.value.workflow_cache_work_state=d.value,m.setUserConfig(u.value),y("workflowStateChanged",Xt(u.value))}catch(t){console.error("Error handling workState change:",t)}else console.warn("workState or userConfig is not defined")},{deep:!0})}C("workflowStateChanged",a=>{b.value=!0,d.value=a.workflow_cache_work_state});const U=w(!1),te=w(void 0),oe=w(!1),ae=w(!1),W=w("statistics"),Q=w(),N=w(),se=w(window.innerHeight),X=w(0),O=()=>{se.value=window.innerHeight,Q.value?.offsetHeight?X.value=Q.value.offsetHeight+20:X.value=0},me=()=>{setTimeout(O,10)};$e(()=>{O(),window.addEventListener("resize",O)}),Ae(()=>{window.removeEventListener("resize",O)});const L=()=>{if(d.value.workflows.length>=ee){_.warning(o("workflow.message.max_len",ee));return}d.value.workflows.push(Fe())},ne=w(!1),qe=()=>{ne.value=!0},je=()=>{d.value.currentWorkflow>=d.value.workflows.length&&(d.value.currentWorkflow=d.value.workflows.length-1)},J=k(()=>{const t=se.value-320-X.value;return f.value?{itemSelectTable:"auto",statisticsBlock:void 0,statementsBlock:"auto",recommProcess:"auto",recommProcessContainer:"60px"}:{itemSelectTable:t-65+"px",statisticsBlock:t/2-45,statementsBlock:t-50+"px",recommProcess:t+"px",recommProcessContainer:t+12+"px"}}),Ge=a=>{a&&(s.value.targetItems[a]?_.info(o("common.message.item_already_have")):(s.value.targetItems[a]=1,s.value.preparedItems.craftTarget[a]=0))},Ke=()=>{s.value.targetItems={},s.value.preparedItems={craftTarget:{},materialsLv1:{},materialsLvBase:{}},_.success(o("common.cleared"))},fe=w("450px"),Qe=a=>{a?fe.value="200px":fe.value="450px",setTimeout(()=>{N?.value?.updateSize&&N.value.updateSize()},10)},Se=k(()=>{const a=[];for(const t in s.value.targetItems){const S=Number(t),i=s.value.targetItems[S];if(i>0){const g=Rt(S);g.amount=i,a.push(g)}}return a}),Xe=k(()=>x(s.value.targetItems)),E=k(()=>z(Xe.value)),re=k(()=>G(Se.value,s.value.preparedItems)),Je=k(()=>K(re.value.targetItemsForCal,re.value.lv1ItemsForCal,re.value.baseItemsForCal)),F=k(()=>{const{craftTargets:a,lv1Items:t,lv2Items:S,lv3Items:i,lvBaseItems:g}=Je.value;return I(a,t,S,i,g,p.value.processes_craftable_item_sortby,p.value.processes_merge_gatherings,u.value.language_ui,o)}),Ie=()=>{const{craftTargets:a,materialsLv1:t,materialsLvBase:S}=E.value;a.forEach(i=>{const g=s.value.preparedItems.craftTarget[i.id];g?g>i.amount&&(s.value.preparedItems.craftTarget[i.id]=i.amount):s.value.preparedItems.craftTarget[i.id]=0}),t.forEach(i=>{const g=s.value.preparedItems.materialsLv1[i.id];g?g>i.amount&&(s.value.preparedItems.materialsLv1[i.id]=i.amount):s.value.preparedItems.materialsLv1[i.id]=0}),S.forEach(i=>{const g=s.value.preparedItems.materialsLvBase[i.id];g?g>i.amount&&(s.value.preparedItems.materialsLvBase[i.id]=i.amount):s.value.preparedItems.materialsLvBase[i.id]=0})},Ce=()=>{for(let a=0;a<F.value.length;a++)s.value.recommData.expandedBlocks[a]||(s.value.recommData.expandedBlocks[a]=["1"]),s.value.recommData.completedItems[a]||(s.value.recommData.completedItems[a]={}),F.value[a].items.forEach(t=>{s.value.recommData.completedItems[a][t.id]||(s.value.recommData.completedItems[a][t.id]=!1)})};Pe(F,async()=>{Ce(),Ie()}),Ce(),Ie();const pe=k(()=>{let a=!0;for(let t=0;t<F.value.length;t++)s.value.recommData.expandedBlocks[t]&&s.value.recommData.expandedBlocks[t].length>0&&(a=!1);return a}),Ye=k(()=>!!window.electronAPI&&!!window.$syncStore),Ze=()=>{const a=o("workflow.recomm_process"),t=document.location.origin+document.location.pathname+"#/workflow_process?mode=overlay",S=400,i=350;window.electronAPI?.createNewWindow?window.electronAPI.createNewWindow("workflow-process",t,S,i,a):window.open(t,a,`height=${i}, width=${S}, top=200, left=200`)},et=()=>{const a=pe.value;for(let t=0;t<F.value.length;t++)s.value.recommData.expandedBlocks[t]=a?["1"]:[]},tt=()=>{oe.value=!1,ae.value=!0,te.value="recomm_process",U.value=!0},le=w(!1),ve=k(()=>Ut(p.value,E.value)),H=w(!1),ot=async()=>{if(ve.value.updateRequired){H.value=!0;try{const a=[];E.value.craftTargets.forEach(i=>{a.push(i.id)}),E.value.materialsLvBase.forEach(i=>{a.push(i.id)});const t=await Gt([...new Set(a)],p.value.universalis_server),S=p.value;Object.keys(t).forEach(i=>{const g=Number(i);S.cache_item_prices[g]=t[g]}),await m.setFuncConfig(Kt(S,m.userConfig))}catch(a){console.error(a),await M(o("common.message.get_price_failed")+`
`+(a?.message??a))}H.value=!1}},at=async()=>{if(H.value){_.info(o("common.loading"));return}await ot(),le.value=!0},st=()=>{N?.value?.setPreparedItemsByInventory?(N.value.setPreparedItemsByInventory(),_.success(o("common.message.sync_succeed"))):_.error("proStatementInstace Ref Notfound")},nt=()=>{N?.value?.setInventoryByPreparedItems?(N.value.setInventoryByPreparedItems(),_.success(o("common.message.sync_succeed"))):_.error("proStatementInstace Ref Notfound")};return(a,t)=>{const S=Le,i=Wt,g=Dt,V=Oe,we=Lt,he=po,_e=jt,rt=uo,lt=Ot,it=At;return B(),Me("div",ko,[n(ke,{"card-key":"workflow-header",class:"header-block",onOnCardFoldStatusChanged:me},{header:r(()=>[t[9]||(t[9]=c("i",{class:"xiv sync-invert"},null,-1)),c("span",xo,h(e(o)("workflow.text.set_workflows")),1)]),default:r(()=>[c("div",{class:"block",ref_key:"headerBlock",ref:Q},[c("div",yo,[c("p",null,h(e(o)("workflow.text.switch_workflows")),1),c("div",So,[(B(!0),Me(dt,null,mt(e(d).workflows,(v,ie)=>(B(),A(S,{key:ie,size:"tiny",type:ie===e(d).currentWorkflow?"primary":"default",onClick:Eo=>e(d).currentWorkflow=ie},{default:r(()=>[q(h(v.name||e(o)("workflow.text.workflow_with_index",ie+1)),1)]),_:2},1032,["type","onClick"]))),128)),n(xe,{size:"tiny",square:"",icon:e(eo),"icon-size":16,tip:e(o)("workflow.text.add_a_workflow"),onClick:L},null,8,["icon","tip"]),n(xe,{size:"tiny",square:"",icon:e(ye),"icon-size":14,tip:e(o)("workflow.text.manage_existed_workflows"),onClick:qe},null,8,["icon","tip"])])])],512)]),_:1}),c("div",{class:"content-block",style:ge({"--select-card-width":e(fe)})},[n(ke,{"card-key":"workflow-content-items",class:"items-wrapper","fold-direction":e(f)?"vertical":"horizontal",onOnCardFoldStatusChanged:Qe},{header:r(()=>[t[10]||(t[10]=c("i",{class:"xiv square-1"},null,-1)),c("span",Io,h(e(o)("common.select_item2")),1)]),default:r(()=>[c("div",Co,[c("div",Bo,[n(g,null,{default:r(()=>[n(i,null,{default:r(()=>[q(h(e(o)("common.add_item")),1)]),_:1}),n(Et,{onOnItemSelected:Ge})]),_:1})]),c("div",Po,[n(Ft,{items:e(s).targetItems,"onUpdate:items":t[0]||(t[0]=v=>e(s).targetItems=v),"show-item-details":"","item-span-max-width":"230px","content-height":e(J).itemSelectTable},null,8,["items","content-height"])]),c("div",Mo,[n(xe,{icon:e(to),text:e(o)("common.clear"),tip:e(o)("workflow.text.clear_current_workflow"),onClick:Ke},null,8,["icon","text","tip"])])])]),_:1},8,["fold-direction"]),n(ke,{unfoldable:!e(f),"card-key":"workflow-content-statistics",class:"statistics-wrapper"},{header:r(()=>[t[11]||(t[11]=c("i",{class:"xiv square-2"},null,-1)),c("span",zo,h(e(o)("common.view_analysis")),1),c("a",{class:"card-title-extra",href:"javascript:void(0);",disabled:e(H),style:ge(e(H)?"cursor: not-allowed; color: gray;":"cursor: pointer;"),onClick:at}," ["+h(e(H)?e(o)("common.loading"):e(o)("statistics.group.cost_and_benefit.title"))+"] ",13,Ro),ze(c("a",{class:"card-title-extra",href:"javascript:void(0);",style:{cursor:"pointer"},title:e(o)("workflow.tooltip.set_prepared_by_inventory"),onClick:st}," ["+h(e(o)("workflow.text.sync_from_inventory"))+"] ",9,To),[[Re,e(p).inventory_workflow_enable_sync&&e(W)==="statements"]]),ze(c("a",{class:"card-title-extra",href:"javascript:void(0);",style:{cursor:"pointer"},title:e(o)("workflow.tooltip.set_inventory_by_prepared"),onClick:nt}," ["+h(e(o)("workflow.text.sync_to_inventory"))+"] ",9,Uo),[[Re,e(p).inventory_workflow_enable_sync_reverse&&e(W)==="statements"]])]),default:r(()=>[c("div",No,[n(lt,{value:e(W),"onUpdate:value":t[4]||(t[4]=v=>ce(W)?W.value=v:null),type:"segment",animated:"",class:"h-full"},{default:r(()=>[n(we,{name:"statistics"},{tab:r(()=>[c("div",$o,[n(V,{size:16},{default:r(()=>[n(e(oo))]),_:1}),c("div",null,h(e(o)("common.statistics")),1)])]),default:r(()=>[n(Jt,{"item-selected":e(s).targetItems,"list-height":e(J).statisticsBlock},null,8,["item-selected","list-height"])]),_:1}),n(we,{name:"statements"},{tab:r(()=>[c("div",Ao,[n(V,{size:16},{default:r(()=>[n(e(ao))]),_:1}),c("div",null,h(e(o)("common.statement")),1)])]),default:r(()=>[e(p).use_traditional_statement?(B(),A(Ht,ft(pt({key:0},e(E))),null,16)):(B(),A(Vt,{key:1,ref_key:"proStatementInstace",ref:N,"items-prepared":e(s).preparedItems,"onUpdate:itemsPrepared":t[1]||(t[1]=v=>e(s).preparedItems=v),"craft-targets":e(Se),"statement-blocks":e(re).statementBlocks,"content-height":e(J).statementsBlock},null,8,["items-prepared","craft-targets","statement-blocks","content-height"]))]),_:1}),n(we,{name:"processes",style:ge({transform:"translate(0)",minHeight:e(J).recommProcessContainer})},{tab:r(()=>[c("div",Do,[n(V,{size:16},{default:r(()=>[n(e(lo))]),_:1}),c("div",null,h(e(o)("common.process")),1)])]),default:r(()=>[n(qt,{"expanded-blocks":e(s).recommData.expandedBlocks,"onUpdate:expandedBlocks":t[2]||(t[2]=v=>e(s).recommData.expandedBlocks=v),"completed-items":e(s).recommData.completedItems,"onUpdate:completedItems":t[3]||(t[3]=v=>e(s).recommData.completedItems=v),"item-groups":e(F),"content-max-height":e(J).recommProcess,"content-max-width":"1080px","hide-chs-offline-items":e(s).recommData.hideChsOfflineItems},null,8,["expanded-blocks","completed-items","item-groups","content-max-height","hide-chs-offline-items"]),e(f)?be("",!0):(B(),A(rt,{key:0,right:"20px",bottom:"5px"},{default:r(()=>[e(Ye)?(B(),A(_e,{key:0,trigger:e(f)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(he,{onClick:Ze},{default:r(()=>[n(V,null,{default:r(()=>[n(e(so))]),_:1})]),_:1})]),default:r(()=>[q(" "+h(e(o)("common.open_in_new_window")),1)]),_:1},8,["trigger"])):be("",!0),e(F).length?(B(),A(_e,{key:1,trigger:e(f)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(he,{onClick:et},{default:r(()=>[n(V,null,{default:r(()=>[e(pe)?(B(),A(e(no),{key:0})):(B(),A(e(ro),{key:1}))]),_:1})]),_:1})]),default:r(()=>[q(" "+h(e(pe)?e(o)("common.expand_all"):e(o)("common.fold_all")),1)]),_:1},8,["trigger"])):be("",!0),n(_e,{trigger:e(f)?"manual":"hover",placement:"left"},{trigger:r(()=>[n(he,{onClick:tt},{default:r(()=>[n(V,null,{default:r(()=>[n(e(ye))]),_:1})]),_:1})]),default:r(()=>[q(" "+h(e(o)("common.setting")),1)]),_:1},8,["trigger"])]),_:1}))]),_:1},8,["style"])]),_:1},8,["value"])])]),_:1},8,["unfoldable"])],4),n(bo,{show:e(ne),"onUpdate:show":t[5]||(t[5]=v=>ce(ne)?ne.value=v:null),workflows:e(d).workflows,"onUpdate:workflows":t[6]||(t[6]=v=>e(d).workflows=v),onAfterSave:je},null,8,["show","workflows"]),n(Nt,{show:e(le),"onUpdate:show":t[7]||(t[7]=v=>ce(le)?le.value=v:null),"cost-items":e(E).materialsLvBase,"benefit-items":e(E).craftTargets,"cost-info":e(ve).costInfo,"benefit-info":e(ve).benefitInfo},null,8,["show","cost-items","benefit-items","cost-info","benefit-info"]),n($t,{show:e(U),"onUpdate:show":t[8]||(t[8]=v=>ce(U)?U.value=v:null),"setting-group":e(te),"app-show-up":e(oe),"app-show-fp":e(ae)},null,8,["show","setting-group","app-show-up","app-show-fp"]),n(it)])}}}),qo=He(Wo,[["__scopeId","data-v-09d942a9"]]);export{qo as default};
