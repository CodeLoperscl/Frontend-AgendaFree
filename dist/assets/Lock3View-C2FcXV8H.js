import{r as f,e as _,ai as A,H as B,f as P,k as N,w as T,I as M,S as R,l as v,n as g,q as t,E as d,t as l,u as a,ab as w,s as U,v as q,x as D,y as z,B as y,d as F,K as G,h as H,m as K,aj as J}from"./index-BA34nXVB.js";import{a as h}from"./axios-CdtiCRuU.js";const O={class:"bg-danger"},Q={class:"row g-0 bg-primary"},W={class:"hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"},X={class:"p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"},Y={class:"fw-medium text-white-50 mb-0"},Z={class:"hero-static col-lg-8 d-flex flex-column align-items-center bg-body-light"},ss={class:"p-4 w-100 flex-grow-1 d-flex align-items-center"},ts={class:"w-100"},es={class:"text-center mb-5"},as={class:"fw-semibold text-center my-2"},os={class:"row g-0 justify-content-center"},is={class:"col-sm-8 col-xl-4"},rs={class:"mb-4"},ls={key:0,class:"invalid-feedback animated fadeIn"},ns={key:1,class:"clave-invalida"},cs={class:"px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"},ds={class:"fw-medium text-black-50 py-2 mb-0"},fs={__name:"Lock3View",setup(us){const x=f(),k=_({username:"visita",password:"2843bc16"}),i=A(),E=B(),n=F(),j=G(),u="https://apirest.agendafree.cl/api/",c=f(""),b=j.params.uid;console.log(b);const I=async()=>{try{const e=await h.post(`${u}auth/login`,k);e?(x.value={headers:{"x-token":e.data.token}},S(),console.log("Usuario autenticado:",e.data.token)):console.error("Error al autenticar al usuario:",e.data)}catch(e){console.error("Error al autenticar al usuario:",e),n.push({path:"/error"})}},S=async()=>{try{const e=await h.get(`${u}users/uid/${b}`,x.value);if(!e||!e.data.personas||!e.data.personas[0])throw new Error("Respuesta inválida");const s=e.data.personas[0].profesionales[0];if(!s||!s.habilitado||!s.ruta_api)throw new Error("Profesional no habilitado o sin ruta API");E.setUrl(s.ruta_api),c.value=e.data.personas[0],o.username=c.value.rut,console.log(c.value)}catch(e){console.error("Error al obtener datos del especialista:",e),n.push({path:"/error"})}},o=_({username:null,password:null}),$=()=>!o.isCorrect,L=P(()=>({password:{required:H,minLength:K(5),customError:$}})),r=N(L,o),p=f(!1);async function V(){if(!await r.value.$validate()){console.log("incorrecto");return}h.post(u+"auth/login",o).then(s=>{s&&(console.log(s.status),s.status===200&&(sessionStorage.setItem("especialista-token",s.data.token),n.push({name:"confirmar-hora"})))}).catch(s=>{s.response.status===400&&(console.log("Error de clave"),p.value=!0)})}const C=()=>{sessionStorage.getItem("especialista-token")&&n.push({name:"confirmar-hora"})};return T(()=>o.password,e=>{e&&e.length<5&&(p.value=!1)}),M(async()=>{await I(),await C()}),R(()=>{}),(e,s)=>(v(),g("div",O,[t("div",Q,[t("div",W,[s[3]||(s[3]=t("div",{class:"p-4 p-xl-5 flex-grow-1 d-flex align-items-center"},[t("div",{class:"w-100"},[d(" Agenda"),t("span",{class:"fw-normal"},"Free"),t("p",{class:"text-white-75 me-xl-8 mt-2"})])],-1)),t("div",X,[t("p",Y,[t("strong",null,l(a(i).app.name+" "+a(i).app.version),1),d(" © "+l(a(i).app.copyright),1)]),s[2]||(s[2]=w('<ul class="list list-inline mb-0 py-2"><li class="list-inline-item"><a class="text-white-75 fw-medium" href="javascript:void(0)">Legal</a></li><li class="list-inline-item"><a class="text-white-75 fw-medium" href="javascript:void(0)">Contact</a></li><li class="list-inline-item"><a class="text-white-75 fw-medium" href="javascript:void(0)">Terms</a></li></ul>',1))])]),t("div",Z,[s[7]||(s[7]=t("div",{class:"p-3 w-100 d-lg-none text-center"},null,-1)),t("div",ss,[t("div",ts,[t("div",es,[s[4]||(s[4]=w('<p class="mb-3"><i class="fa fa-2x fa-circle-notch text-primary-light"></i></p><h1 class="fw-bold mb-2">Iniciar sesion</h1><p class="fw-medium text-muted mb-5"> Por favor, ingrese su contraseña para ingresar a su cuenta </p><img class="img-avatar img-avatar96" src="'+J+'" alt="">',4)),t("p",as,l(c.value.email),1)]),t("div",os,[t("div",is,[t("form",{onSubmit:U(V,["prevent"])},[t("div",rs,[q(t("input",{type:"password",class:z(["form-control form-control-lg form-control-alt py-3",{"is-invalid":a(r).password.$errors.length}]),id:"lock-password",name:"lock-password",placeholder:"Contraseña..","onUpdate:modelValue":s[0]||(s[0]=m=>o.password=m),onBlur:s[1]||(s[1]=(...m)=>a(r).password.$touch&&a(r).password.$touch(...m))},null,34),[[D,o.password]]),a(r).password.$errors.length?(v(),g("div",ls," Por favor, ingresa tu contraseña ")):y("",!0),p.value?(v(),g("div",ns," La contraseña ingresada es incorrecta. ")):y("",!0)]),s[5]||(s[5]=t("div",{class:"text-center"},[t("button",{type:"submit",class:"btn btn-lg btn-alt-success"},[t("i",{class:"fa fa-fw fa-lock-open me-1 opacity-50"}),d(" Ingresar ")])],-1))],32)])])])]),t("div",cs,[t("p",ds,[t("strong",null,l(a(i).app.name+" "+a(i).app.version),1),d(" © "+l(a(i).app.copyright),1)]),s[6]||(s[6]=w('<ul class="list list-inline py-2 mb-0"><li class="list-inline-item"><a class="text-muted fw-medium" href="javascript:void(0)">Legal</a></li><li class="list-inline-item"><a class="text-muted fw-medium" href="javascript:void(0)">Contact</a></li><li class="list-inline-item"><a class="text-muted fw-medium" href="javascript:void(0)">Terms</a></li></ul>',1))])])])]))}};export{fs as default};