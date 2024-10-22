import{g as ve,o as fe,u as k,w as H,_ as oe,a as ie,r as R,b as ne,c as se,d as x,e as J,f as Q,h as T,m as F,i as me,j as X,k as ge,l as A,n as I,p as M,L as le,q as a,s as re,t as j,v as P,x as N,y as C,z as Y,F as G,A as ee,B as be,C as de,D as _e,E as he,G as Re,H as we,I as ye,J as te,K as $e}from"./index-BA34nXVB.js";import{a as O}from"./axios-CdtiCRuU.js";var Z={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.generateRut=e.validateRutList=e.validateRut=e.calculateRutVerifier=e.formatRut=e.RutFormat=e.deconstructRut=e.getRutVerifier=e.getRutDigits=e.cleanRut=e.isSuspiciousRut=e.isRutLike=void 0;const d=()=>/^(\d{0,2})\.?(\d{3})\.?(\d{3})-?(\d|k)$/gi,g=()=>/^(\d)\1?\.?(\1{3})\.?(\1{3})-?(\d|k)?$/gi,p=t=>d().test(t);e.isRutLike=p;const L=t=>g().test(t);e.isSuspiciousRut=L;const f=t=>(0,e.isRutLike)(t)?t.replace(/[^0-9k]/gi,""):"";e.cleanRut=f;const m=t=>(0,e.cleanRut)(t).slice(0,-1);e.getRutDigits=m;const $=t=>(0,e.cleanRut)(t).slice(-1);e.getRutVerifier=$;const D=t=>({digits:(0,e.getRutDigits)(t),verifier:(0,e.getRutVerifier)(t)});e.deconstructRut=D;var w;(function(t){t[t.DOTS=0]="DOTS",t[t.DASH=1]="DASH",t[t.DOTS_DASH=2]="DOTS_DASH"})(w=e.RutFormat||(e.RutFormat={}));const b=(t,v=w.DASH)=>{if(t==null)return"";if(typeof t!="string")throw new TypeError("RUT needs to be a string or undefined");if(!(0,e.isRutLike)(t))return t;switch(v){case w.DOTS:return t.replace(d(),(...s)=>`${s[1]?`${s[1]}.`:""}${s[2]}.${s[3]}${s[4]}`);case w.DASH:return t.replace(d(),"$1$2$3-$4");case w.DOTS_DASH:return t.replace(d(),(...s)=>`${s[1]?`${s[1]}.`:""}${s[2]}.${s[3]}-${s[4]}`);default:return t.replace(d(),"$1$2$3$4")}};e.formatRut=b;const _=t=>{let v=0,s=2,y=t.length;for(;y--;)v=v+parseInt(t.charAt(y))*s,s%7===0?s=2:s++;const l=v%11;return l===0?"0":l===1?"k":`${11-l}`};e.calculateRutVerifier=_;const n=(t,v=!0)=>!(0,e.isRutLike)(t)||v&&(0,e.isSuspiciousRut)(t)?!1:(0,e.getRutVerifier)(t).toLowerCase()===(0,e.calculateRutVerifier)((0,e.getRutDigits)(t));e.validateRut=n;const r=(t,v=!0)=>{const s=new Map;for(const y of t)s.set(y,(0,e.validateRut)(y,v));return s};e.validateRutList=r;const u=()=>{const t=Math.floor(10000003+Math.random()*9e7).toString(),v=(0,e.calculateRutVerifier)(t);return(0,e.formatRut)(t+v)};e.generateRut=u})(Z);function De(e){return ve()?(fe(e),!0):!1}function ue(e){return typeof e=="function"?e():k(e)}const ce=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const Ee=Object.prototype.toString,ke=e=>Ee.call(e)==="[object Object]",B=()=>{},Le=Se();function Se(){var e,d;return ce&&((e=window==null?void 0:window.navigator)==null?void 0:e.userAgent)&&(/iP(?:ad|hone|od)/.test(window.navigator.userAgent)||((d=window==null?void 0:window.navigator)==null?void 0:d.maxTouchPoints)>2&&/iPad|Macintosh/.test(window==null?void 0:window.navigator.userAgent))}function U(e){var d;const g=ue(e);return(d=g==null?void 0:g.$el)!=null?d:g}const pe=ce?window:void 0;function K(...e){let d,g,p,L;if(typeof e[0]=="string"||Array.isArray(e[0])?([g,p,L]=e,d=pe):[d,g,p,L]=e,!d)return B;Array.isArray(g)||(g=[g]),Array.isArray(p)||(p=[p]);const f=[],m=()=>{f.forEach(b=>b()),f.length=0},$=(b,_,n,r)=>(b.addEventListener(_,n,r),()=>b.removeEventListener(_,n,r)),D=H(()=>[U(d),ue(L)],([b,_])=>{if(m(),!b)return;const n=ke(_)?{..._}:_;f.push(...g.flatMap(r=>p.map(u=>$(b,r,u,n))))},{immediate:!0,flush:"post"}),w=()=>{D(),m()};return De(w),w}let ae=!1;function Pe(e,d,g={}){const{window:p=pe,ignore:L=[],capture:f=!0,detectIframe:m=!1}=g;if(!p)return B;Le&&!ae&&(ae=!0,Array.from(p.document.body.children).forEach(n=>n.addEventListener("click",B)),p.document.documentElement.addEventListener("click",B));let $=!0;const D=n=>L.some(r=>{if(typeof r=="string")return Array.from(p.document.querySelectorAll(r)).some(u=>u===n.target||n.composedPath().includes(u));{const u=U(r);return u&&(n.target===u||n.composedPath().includes(u))}}),b=[K(p,"click",n=>{const r=U(e);if(!(!r||r===n.target||n.composedPath().includes(r))){if(n.detail===0&&($=!D(n)),!$){$=!0;return}d(n)}},{passive:!0,capture:f}),K(p,"pointerdown",n=>{const r=U(e);$=!D(n)&&!!(r&&!n.composedPath().includes(r))},{passive:!0}),m&&K(p,"blur",n=>{setTimeout(()=>{var r;const u=U(e);((r=p.document.activeElement)==null?void 0:r.tagName)==="IFRAME"&&!(u!=null&&u.contains(p.document.activeElement))&&d(n)},0)})].filter(Boolean);return()=>b.forEach(n=>n())}const Ae={key:0,class:"modal-mask"},Ie={class:"modal-wrapper"},Ve={class:"modal-header"},Ce={class:"modal-body px-5"},Oe={class:"form-group"},Te=["for"],Me=["id","value"],je={class:"form-group"},Ne={class:"form-group"},Ue={class:"form-group"},He={class:"form-group"},Be={class:"form-group"},Ge=["disabled"],We=["value","disabled"],qe={class:"form-group"},ze=["disabled"],Fe=["value"],Ke={__name:"ModalDatosPacientes",props:{isOpen:Boolean,rut:String},emits:["modal-close","submit-data"],setup(e,{emit:d}){const g=ie(),p=R(),L=ne(),f=se(),m=R(!1),$=x(),D=R("RUT"),w=R(0),b=R({}),_=R({}),n="https://apirest.agendafree.cl/api/",r="https://apirestnatalymorales.agendafree.cl/api/",u=()=>({headers:{"x-token":sessionStorage.getItem("token")}}),t=R(!1),v=async()=>{if(!await S.value.$validate()){console.log("Formulario inválido");return}console.log("Formulario válido",i),V()},s=e,y=d,l=R(null);Pe(l,()=>y("modal-close"));const i=J({rut:s.rut,nombre:null,email:null,fono:null,nacionalidad:0,prevision_id:0}),W=Q(()=>f.sharedData===0?1:0);H(W,h=>{i.nacionalidad=h});const q=Q(()=>({nombre:{required:T,minLength:F(2)},apellido:{required:T,minLength:F(2)},email:{required:T,email:me},fono:{required:T,minLength:F(8)},nacionalidad:{required:T,notZero:X.withMessage("La nacionalidad no puede ser 0",h=>h!==0)},prevision_id:{required:T,notZero:X.withMessage("La nacionalidad no puede ser 0",h=>h!==0)}})),S=ge(q,i);H(()=>f.sharedData,h=>{h==1?(D.value="DNI",i.prevision_id=3,w.value=1):(D.value="RUT",i.prevision_id=0,w.value=0)}),H(()=>s.isOpen,h=>{if(console.log("El valor de isOpen ha cambiado:",h),h)console.log("El modal se ha abierto"),E(u());else{switch(console.log("El modal se ha cerrado"),f.sharedData){case 0:i.prevision_id=0,i.nacionalidad=1;break;case 1:i.prevision_id=3,i.nacionalidad=0}i.nombre="",i.apellido="",i.email="",i.fono=""}});const V=()=>{const h=R({}),o=R({});f.sharedData==0&&(h.value={nombre:i.nombre,apellido:i.apellido,rut:s.rut,email:i.email,fono:i.fono,nacionalidad_id:1,prevision_id:i.prevision_id}),f.sharedData==1&&(o.value={nombre:i.nombre,apellido:i.apellido,rut:s.rut,email:i.email,fono:i.fono,nacionalidad_id:i.nacionalidad,prevision_id:i.prevision_id},console.log("Nuevo paciente extranjero: ",o)),console.log(n+"persona",f.sharedData==0?h.value:o.value),console.log("token desde ModalDatosPacientes",u()),t.value=!0,O.post(n+"persona",f.sharedData==0?h.value:o.value,u()).then(c=>{c?(p.value=c.data,m.value=!m.value,m.value?(L.setPaciente(c.data.paciente.paciente),g.setPersona(c.data),console.log("Paciente en store: ",L.getPaciente()),t.value=!1,$.push({name:"modulo-reserva"})):$.push({name:"agenda"})):(m.value=!0,t.value=!1)})},E=async h=>{try{const o=await O.get(`${r}prevision`,h);b.value=o.data.previsiones.filter(z=>z.estado_id===3);const c=await O.get(`${n}nacionalidad`,h);_.value=c.data.nacionalidades.filter(z=>z.estado_id===1)}catch(o){console.error("Error al obtener datos de previsión o nacionalidad:",o)}};return(h,o)=>s.isOpen?(A(),I("div",Ae,[M(le,{isLoading:t.value},null,8,["isLoading"]),a("div",Ie,[a("div",{class:"modal-container",ref_key:"target",ref:l},[a("div",Ve,[o[8]||(o[8]=a("h4",{class:"modal-title"},"Bienvenid@",-1)),a("button",{type:"button",class:"close-btn",onClick:o[0]||(o[0]=c=>y("modal-close"))},o[7]||(o[7]=[a("i",{class:"fa fa-fw fa-times"},null,-1)]))]),a("div",Ce,[o[18]||(o[18]=a("p",{class:"modal-description mt-3"}," Para solicitar hora de atención por favor ingrese sus datos y presione continuar ",-1)),a("div",null,[a("form",{onSubmit:re(v,["prevent"])},[a("div",Oe,[a("label",{for:D.value,class:"rainbow-text"},j(D.value)+":",9,Te),a("input",{id:D.value,type:"text",value:s.rut,disabled:""},null,8,Me)]),a("div",je,[o[9]||(o[9]=a("label",{for:"nombre",class:"rainbow-text"},"Nombre: ",-1)),P(a("input",{"onUpdate:modelValue":o[1]||(o[1]=c=>i.nombre=c),id:"nombre",type:"text",placeholder:"Nombre",class:C({"is-invalid":k(S).nombre.$invalid&&k(S).nombre.$dirty})},null,2),[[N,i.nombre]])]),a("div",Ne,[o[10]||(o[10]=a("label",{class:"rainbow-text",for:"apellido"},"Apellido: ",-1)),P(a("input",{"onUpdate:modelValue":o[2]||(o[2]=c=>i.apellido=c),id:"apellido",type:"text",placeholder:"Apellido",class:C({"is-invalid":k(S).apellido.$invalid&&k(S).apellido.$dirty})},null,2),[[N,i.apellido]])]),a("div",Ue,[o[11]||(o[11]=a("label",{class:"rainbow-text",for:"email"},"Email: ",-1)),P(a("input",{"onUpdate:modelValue":o[3]||(o[3]=c=>i.email=c),id:"email",type:"email",placeholder:"Email",class:C({"is-invalid":k(S).email.$invalid&&k(S).email.$dirty})},null,2),[[N,i.email]])]),a("div",He,[o[12]||(o[12]=a("label",{class:"rainbow-text",for:"telefono"},"Teléfono: ",-1)),P(a("input",{"onUpdate:modelValue":o[4]||(o[4]=c=>i.fono=c),id:"telefono",type:"text",placeholder:"+56935281541",class:C({"is-invalid":k(S).fono.$invalid&&k(S).fono.$dirty})},null,2),[[N,i.fono]])]),a("div",Be,[o[14]||(o[14]=a("label",{for:"nacionalidad",class:"rainbow-text"},"Nacionalidad: ",-1)),P(a("select",{"onUpdate:modelValue":o[5]||(o[5]=c=>i.nacionalidad=c),disabled:k(f).sharedData==0,id:"nacionalidad",class:C({"is-invalid":k(S).nacionalidad.$invalid&&k(S).nacionalidad.$dirty})},[o[13]||(o[13]=a("option",{value:"0",disabled:""},"Nacionalidades...",-1)),(A(!0),I(G,null,ee(_.value,c=>(A(),I("option",{key:c.id,value:c.id,disabled:k(f).sharedData==1&&c.id==1},j(c.nombre),9,We))),128))],10,Ge),[[Y,i.nacionalidad]])]),a("div",qe,[o[16]||(o[16]=a("label",{for:"prevision",class:"rainbow-text"},"Previsión: ",-1)),P(a("select",{"onUpdate:modelValue":o[6]||(o[6]=c=>i.prevision_id=c),id:"prevision",disabled:k(f).sharedData==1,class:C({"is-invalid":k(S).prevision_id.$invalid&&k(S).prevision_id.$dirty})},[o[15]||(o[15]=a("option",{value:"0",disabled:"",selected:""},"Previsiones...",-1)),(A(!0),I(G,null,ee(b.value,c=>(A(),I("option",{value:c.id},j(c.nombre),9,Fe))),256))],10,ze),[[Y,i.prevision_id]])]),o[17]||(o[17]=a("div",{class:"text-end mb-3 mt-5"},[a("button",{type:"submit",class:"submit-btn"}," Continuar ")],-1))],32)])])],512)])])):be("",!0)}},Ze=oe(Ke,[["__scopeId","data-v-67ffba42"]]),xe={class:"row mt-3 justify-content-center"},Je={class:"col-12 col-md-10"},Qe={class:"input-rut"},Xe=["placeholder"],Ye=["disabled"],et={class:"mt-2 text-center"},tt={__name:"inputRut",setup(e){const d=R(!1),g=de(),p=ie(),L=ne(),f=se(),m="https://apirest.agendafree.cl/api/",$=()=>({headers:{"x-token":sessionStorage.getItem("token")}}),D=x(),w=R();R(!1);const b=R(!1),_=J({tipo:"Documento Extranjero",ejemplo:"Rut Ej: 17463223-K"}),n=R(""),r=R(!1),u=R(""),t=()=>{v(),l()},v=()=>{d.value=!0,console.log("data")},s=()=>{d.value=!1},y=()=>{s(),console.log("Hola desde cerrar modal")},l=()=>{b.value?f.updateData(1):f.updateData(0)},i=()=>{b.value||(r.value=Z.validateRut(n.value),u.value=Z.formatRut(n.value))},W=()=>{b.value||(n.value=u.value)},q=V=>{b.value=V,l(),n.value="",u.value="",V?(_.tipo="CI Documento Chileno",_.ejemplo="DNI",r.value=!0):(_.tipo="Documento Extranjero",_.ejemplo="Rut Ej: 17463223-K")},S=async()=>{g.setLoading(!0),b.value&&(u.value=n.value);const V=u.value;O.get(`${m}persona/rut/${V}`,$()).then(E=>{E&&(w.value=E.data.paciente,console.log(w.value),L.setPaciente(w.value),p.setPersona(E.data),D.push({name:"modulo-reserva"}))}).catch(E=>{console.log("Error: ",E),t()}).finally(()=>{g.setLoading(!1)})};return(V,E)=>{const h=_e("click-ripple");return A(),I(G,null,[M(le),a("div",xe,[a("div",Je,[a("div",Qe,[P(a("input",{type:"text",class:C(["form-control",{"text-info":!r.value}]),placeholder:_.ejemplo,onInput:i,onChange:W,"onUpdate:modelValue":E[0]||(E[0]=o=>n.value=o)},null,42,Xe),[[N,n.value]]),P((A(),I("button",{type:"button",class:"btn btn-primary",onClick:E[1]||(E[1]=o=>S(u.value)),disabled:!r.value},E[3]||(E[3]=[he(" CONTINUAR "),a("i",{class:"fa fa-fw fa-arrow-right"},null,-1)]),8,Ye)),[[h]])]),a("div",et,[a("a",{href:"#",onClick:E[2]||(E[2]=re(o=>q(!b.value),["prevent"])),class:"toggle-input fs-7"},"Ingresar con "+j(_.tipo),1)])])]),M(Ze,{isOpen:d.value,rut:u.value,onModalClose:s,onSubmitData:y},null,8,["isOpen","rut"])],64)}}},at=oe(tt,[["__scopeId","data-v-09ccd15f"]]),ot={class:"hero d-flex align-items-center justify-content-center"},it={class:"hero-content text-center","transition-style":"in:circle:hesitate"},nt={class:"content content-full text-center p-0"},st={class:"fw-bold"},lt={class:"fw-bold"},rt={class:"row justify-content-center"},dt={class:"col-12"},ut={class:"bg-card rounded shadow-lg"},ct={class:"input-container"},ft={__name:"LandingEspecialistaView",setup(e){const d=J({username:"visita",password:"2843bc16"}),g=R(null),p=Re(),L=we(),f=de(),m=R({id:"",uid:"",username:"",estado_id:"",nombre:"",apellido:"",abreviatura:""}),$="https://apirest.agendafree.cl/api/",D=$e(),w=x(),b=D.params.uid,_=async()=>{var t,v,s,y;try{const l=await O.get(`${$}users/uid/${b}`,g.value);if(!l||!l.data)throw new Error("No se recibieron datos");console.log("response profesional: ",l.data);const i=(t=l.data.personas[0])==null?void 0:t.profesionales[0];if(!i||!i.habilitado||!i.ruta_api)throw new Error("Profesional no válido o no habilitado");L.setUrl(i.ruta_api),m.value.id=l.data.personas[0].id,m.value.uid=l.data.uid,m.value.username=l.data.username,m.value.estado_id=l.data.estado_id,m.value.nombre=l.data.personas[0].nombre,m.value.apellido=l.data.personas[0].apellido,await n(i.persona_id,(v=l.data.personas[0])==null?void 0:v.nombre,(s=l.data.personas[0])==null?void 0:s.apellido,(y=l.data.personas[0])==null?void 0:y.profesionales[0].max_dias_atencion)}catch(l){console.error("Error al obtener datos del especialista:",l),w.push({path:"/error"})}},n=(t,v,s,y)=>{O.get(`${L.getURL()}api/especialista/persona/${t}`,g.value).then(l=>{l.data.max_dias_atencion=y,l.data.nombre=v,l.data.apellido=s,p.setEspecialista(l.data),console.log("store especialista 1: ",p.especialista.especialista.especialidades[0].especialidad),m.value.especialidad=p.especialista.especialista.especialidades[0].especialidad}).catch(l=>{console.error("Error al obtener datos del especialista:",l)})},r=async()=>{try{const t=await O.post(`${$}auth/login`,d);t?(sessionStorage.setItem("token",t.data.token),g.value={headers:{"x-token":t.data.token}},console.log("Usuario autenticado:",t.data.token)):console.error("Error al autenticar al usuario:",t.data)}catch(t){console.error("Error al autenticar al usuario:",t),w.push({path:"/error"})}};ye(async()=>{f.setLoading(!0),await r(),await _(),setTimeout(()=>{f.setLoading(!1)},2e3)});const u=R({background:{color:{value:"#ffffff"}},fpsLimit:120,interactivity:{events:{onClick:{enable:!0,mode:"push"},onHover:{enable:!0,mode:"repulse"}},modes:{bubble:{distance:400,duration:2,opacity:.8,size:40},push:{quantity:4},repulse:{distance:200,duration:.4}}},particles:{color:{value:"#16A085"},links:{color:"#ffff",distance:150,enable:!0,opacity:.5,width:1},move:{direction:"none",enable:!0,outModes:"bounce",random:!1,speed:6,straight:!1},number:{density:{enable:!0},value:80},opacity:{value:.5},shape:{type:"circle"},size:{value:{min:1,max:5}}},detectRetina:!0});return(t,v)=>{const s=te("LoadingSpinner"),y=te("vue-particles");return A(),I(G,null,[M(s),a("div",ot,[a("div",it,[a("div",nt,[v[1]||(v[1]=a("h4",{class:"fw-light"}," Bienvenido a sistema de reserva de citas Online de: ",-1)),a("h1",st,j(m.value.nombre+" "+m.value.apellido),1),a("h3",lt,j(m.value.especialidad),1),a("div",rt,[a("div",dt,[a("div",ut,[v[0]||(v[0]=a("p",{class:"fs-6 fw-medium text-dark mb-4"}," Para solicitar una hora de atención, ingrese su RUT y presione continuar. ",-1)),a("div",ct,[M(at)])])])])])])]),M(y,{id:"tsparticles",options:u.value},null,8,["options"])],64)}}};export{ft as default};