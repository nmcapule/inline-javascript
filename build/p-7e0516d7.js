(()=>{const t=(t,s)=>{const i=globalThis[s];return null!=i&&t instanceof i},s=i=>{if(null!=i){if(t(i,"ArrayBuffer")||t(i,"MessagePort")||t(i,"ImageBitmap")||t(i,"OffscreenCanvas"))return[i];if("object"==typeof i)return i.constructor===Object&&(i=Object.values(i)),Array.isArray(i)?i.flatMap(s):s(i.buffer)}return[]},i={},r="stencil.executor.worker",e=r+".cb";function n(t){return"function"==typeof t}addEventListener("message",(async({data:t})=>{if(t&&t[0]===r){let n,o,h=t[1],c=t[2],u=t[3],l=0,f=u.length;try{for(;l<f;l++)if(Array.isArray(u[l])&&u[l][0]===e){const t=u[l][1];u[l]=(...s)=>{postMessage([e,t,s])}}n=await i[c](...u)}catch(t){n=null,o=t instanceof Error?{isError:!0,value:{message:t.message,name:t.name,stack:t.stack}}:{isError:!1,value:t},n=void 0}const a=s(n);postMessage([r,h,n,o],a)}}));let o=!1;const h={Promise:void 0,set useDeprecatedSynchronousErrorHandling(t){if(t){const t=new Error;console.warn("DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n"+t.stack)}else o&&console.log("RxJS: Back to a better error behavior. Thank you. <3");o=t},get useDeprecatedSynchronousErrorHandling(){return o}};function c(t){setTimeout((()=>{throw t}),0)}const u={closed:!0,next(t){},error(t){if(h.useDeprecatedSynchronousErrorHandling)throw t;c(t)},complete(){}},l=Array.isArray||(t=>t&&"number"==typeof t.length);function f(t){return null!==t&&"object"==typeof t}const a=(()=>{function t(t){return Error.call(this),this.message=t?`${t.length} errors occurred during unsubscription:\n${t.map(((t,s)=>`${s+1}) ${t.toString()}`)).join("\n  ")}`:"",this.name="UnsubscriptionError",this.errors=t,this}return t.prototype=Object.create(Error.prototype),t})();class p{constructor(t){this.closed=!1,this._parentOrParents=null,this._subscriptions=null,t&&(this._ctorUnsubscribe=!0,this._unsubscribe=t)}unsubscribe(){let t;if(this.closed)return;let{_parentOrParents:s,_ctorUnsubscribe:i,_unsubscribe:r,_subscriptions:e}=this;if(this.closed=!0,this._parentOrParents=null,this._subscriptions=null,s instanceof p)s.remove(this);else if(null!==s)for(let t=0;t<s.length;++t)s[t].remove(this);if(n(r)){i&&(this._unsubscribe=void 0);try{r.call(this)}catch(s){t=s instanceof a?d(s.errors):[s]}}if(l(e)){let s=-1,i=e.length;for(;++s<i;){const i=e[s];if(f(i))try{i.unsubscribe()}catch(s){t=t||[],s instanceof a?t=t.concat(d(s.errors)):t.push(s)}}}if(t)throw new a(t)}add(t){let s=t;if(!t)return p.EMPTY;switch(typeof t){case"function":s=new p(t);case"object":if(s===this||s.closed||"function"!=typeof s.unsubscribe)return s;if(this.closed)return s.unsubscribe(),s;if(!(s instanceof p)){const t=s;s=new p,s._subscriptions=[t]}break;default:throw new Error("unrecognized teardown "+t+" added to Subscription.")}let{_parentOrParents:i}=s;if(null===i)s._parentOrParents=this;else if(i instanceof p){if(i===this)return s;s._parentOrParents=[i,this]}else{if(-1!==i.indexOf(this))return s;i.push(this)}const r=this._subscriptions;return null===r?this._subscriptions=[s]:r.push(s),s}remove(t){const s=this._subscriptions;if(s){const i=s.indexOf(t);-1!==i&&s.splice(i,1)}}}function d(t){return t.reduce(((t,s)=>t.concat(s instanceof a?s.errors:s)),[])}p.EMPTY=function(t){return t.closed=!0,t}(new p);const b="function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random();class w extends p{constructor(t,s,i){switch(super(),this.syncErrorValue=null,this.syncErrorThrown=!1,this.syncErrorThrowable=!1,this.isStopped=!1,arguments.length){case 0:this.destination=u;break;case 1:if(!t){this.destination=u;break}if("object"==typeof t){t instanceof w?(this.syncErrorThrowable=t.syncErrorThrowable,this.destination=t,t.add(this)):(this.syncErrorThrowable=!0,this.destination=new y(this,t));break}default:this.syncErrorThrowable=!0,this.destination=new y(this,t,s,i)}}[b](){return this}static create(t,s,i){const r=new w(t,s,i);return r.syncErrorThrowable=!1,r}next(t){this.isStopped||this._next(t)}error(t){this.isStopped||(this.isStopped=!0,this._error(t))}complete(){this.isStopped||(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe())}_next(t){this.destination.next(t)}_error(t){this.destination.error(t),this.unsubscribe()}_complete(){this.destination.complete(),this.unsubscribe()}_unsubscribeAndRecycle(){const{_parentOrParents:t}=this;return this._parentOrParents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parentOrParents=t,this}}class y extends w{constructor(t,s,i,r){let e;super(),this._parentSubscriber=t;let o=this;n(s)?e=s:s&&(e=s.next,i=s.error,r=s.complete,s!==u&&(o=Object.create(s),n(o.unsubscribe)&&this.add(o.unsubscribe.bind(o)),o.unsubscribe=this.unsubscribe.bind(this))),this._context=o,this._next=e,this._error=i,this._complete=r}next(t){if(!this.isStopped&&this._next){const{_parentSubscriber:s}=this;h.useDeprecatedSynchronousErrorHandling&&s.syncErrorThrowable?this.__tryOrSetError(s,this._next,t)&&this.unsubscribe():this.__tryOrUnsub(this._next,t)}}error(t){if(!this.isStopped){const{_parentSubscriber:s}=this,{useDeprecatedSynchronousErrorHandling:i}=h;if(this._error)i&&s.syncErrorThrowable?(this.__tryOrSetError(s,this._error,t),this.unsubscribe()):(this.__tryOrUnsub(this._error,t),this.unsubscribe());else if(s.syncErrorThrowable)i?(s.syncErrorValue=t,s.syncErrorThrown=!0):c(t),this.unsubscribe();else{if(this.unsubscribe(),i)throw t;c(t)}}}complete(){if(!this.isStopped){const{_parentSubscriber:t}=this;if(this._complete){const s=()=>this._complete.call(this._context);h.useDeprecatedSynchronousErrorHandling&&t.syncErrorThrowable?(this.__tryOrSetError(t,s),this.unsubscribe()):(this.__tryOrUnsub(s),this.unsubscribe())}else this.unsubscribe()}}__tryOrUnsub(t,s){try{t.call(this._context,s)}catch(t){if(this.unsubscribe(),h.useDeprecatedSynchronousErrorHandling)throw t;c(t)}}__tryOrSetError(t,s,i){if(!h.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{s.call(this._context,i)}catch(s){return h.useDeprecatedSynchronousErrorHandling?(t.syncErrorValue=s,t.syncErrorThrown=!0,!0):(c(s),!0)}return!1}_unsubscribe(){const{_parentSubscriber:t}=this;this._context=null,this._parentSubscriber=null,t.unsubscribe()}}const m="function"==typeof Symbol&&Symbol.observable||"@@observable";function v(t){return t}class x{constructor(t){this._isScalar=!1,t&&(this._subscribe=t)}lift(t){const s=new x;return s.source=this,s.operator=t,s}subscribe(t,s,i){const{operator:r}=this,e=function(t,s,i){if(t){if(t instanceof w)return t;if(t[b])return t[b]()}return t||s||i?new w(t,s,i):new w(u)}(t,s,i);if(e.add(r?r.call(e,this.source):this.source||h.useDeprecatedSynchronousErrorHandling&&!e.syncErrorThrowable?this._subscribe(e):this._trySubscribe(e)),h.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable&&(e.syncErrorThrowable=!1,e.syncErrorThrown))throw e.syncErrorValue;return e}_trySubscribe(t){try{return this._subscribe(t)}catch(s){h.useDeprecatedSynchronousErrorHandling&&(t.syncErrorThrown=!0,t.syncErrorValue=s),function(t){for(;t;){const{closed:s,destination:i,isStopped:r}=t;if(s||r)return!1;t=i&&i instanceof w?i:null}return!0}(t)?t.error(s):console.warn(s)}}forEach(t,s){return new(s=_(s))(((s,i)=>{let r;r=this.subscribe((s=>{try{t(s)}catch(t){i(t),r&&r.unsubscribe()}}),i,s)}))}_subscribe(t){const{source:s}=this;return s&&s.subscribe(t)}[m](){return this}pipe(...t){return 0===t.length?this:(0===(s=t).length?v:1===s.length?s[0]:function(t){return s.reduce(((t,s)=>s(t)),t)})(this);var s}toPromise(t){return new(t=_(t))(((t,s)=>{let i;this.subscribe((t=>i=t),(t=>s(t)),(()=>t(i)))}))}}function _(t){if(t||(t=Promise),!t)throw new Error("no Promise impl found");return t}x.create=t=>new x(t);const E=(()=>{function t(){return Error.call(this),this.message="object unsubscribed",this.name="ObjectUnsubscribedError",this}return t.prototype=Object.create(Error.prototype),t})();class S extends p{constructor(t,s){super(),this.subject=t,this.subscriber=s,this.closed=!1}unsubscribe(){if(this.closed)return;this.closed=!0;const t=this.subject,s=t.observers;if(this.subject=null,!s||0===s.length||t.isStopped||t.closed)return;const i=s.indexOf(this.subscriber);-1!==i&&s.splice(i,1)}}class g extends w{constructor(t){super(t),this.destination=t}}class O extends x{constructor(){super(),this.observers=[],this.closed=!1,this.isStopped=!1,this.hasError=!1,this.thrownError=null}[b](){return new g(this)}lift(t){const s=new j(this,this);return s.operator=t,s}next(t){if(this.closed)throw new E;if(!this.isStopped){const{observers:s}=this,i=s.length,r=s.slice();for(let s=0;s<i;s++)r[s].next(t)}}error(t){if(this.closed)throw new E;this.hasError=!0,this.thrownError=t,this.isStopped=!0;const{observers:s}=this,i=s.length,r=s.slice();for(let s=0;s<i;s++)r[s].error(t);this.observers.length=0}complete(){if(this.closed)throw new E;this.isStopped=!0;const{observers:t}=this,s=t.length,i=t.slice();for(let t=0;t<s;t++)i[t].complete();this.observers.length=0}unsubscribe(){this.isStopped=!0,this.closed=!0,this.observers=null}_trySubscribe(t){if(this.closed)throw new E;return super._trySubscribe(t)}_subscribe(t){if(this.closed)throw new E;return this.hasError?(t.error(this.thrownError),p.EMPTY):this.isStopped?(t.complete(),p.EMPTY):(this.observers.push(t),new S(this,t))}asObservable(){const t=new x;return t.source=this,t}}O.create=(t,s)=>new j(t,s);class j extends O{constructor(t,s){super(),this.destination=t,this.source=s}next(t){const{destination:s}=this;s&&s.next&&s.next(t)}error(t){const{destination:s}=this;s&&s.error&&this.destination.error(t)}complete(){const{destination:t}=this;t&&t.complete&&this.destination.complete()}_subscribe(t){const{source:s}=this;return s?this.source.subscribe(t):p.EMPTY}}class k extends p{constructor(t,s){super()}schedule(t,s=0){return this}}class A{constructor(t,s=A.now){this.SchedulerAction=t,this.now=s}schedule(t,s=0,i){return new this.SchedulerAction(this,t).schedule(i,s)}}A.now=()=>Date.now();class P extends A{constructor(t,s=A.now){super(t,(()=>P.delegate&&P.delegate!==this?P.delegate.now():s())),this.actions=[],this.active=!1,this.scheduled=void 0}schedule(t,s=0,i){return P.delegate&&P.delegate!==this?P.delegate.schedule(t,s,i):super.schedule(t,s,i)}flush(t){const{actions:s}=this;if(this.active)return void s.push(t);let i;this.active=!0;do{if(i=t.execute(t.state,t.delay))break}while(t=s.shift());if(this.active=!1,i){for(;t=s.shift();)t.unsubscribe();throw i}}}const C=new x((t=>t.complete()));function D(t){return t&&"function"==typeof t.schedule}const $=t=>s=>{for(let i=0,r=t.length;i<r&&!s.closed;i++)s.next(t[i]);s.complete()};const I=new P(class extends k{constructor(t,s){super(t,s),this.scheduler=t,this.work=s,this.pending=!1}schedule(t,s=0){if(this.closed)return this;this.state=t;const i=this.id,r=this.scheduler;return null!=i&&(this.id=this.recycleAsyncId(r,i,s)),this.pending=!0,this.delay=s,this.id=this.id||this.requestAsyncId(r,this.id,s),this}requestAsyncId(t,s,i=0){return setInterval(t.flush.bind(t,this),i)}recycleAsyncId(t,s,i=0){if(null!==i&&this.delay===i&&!1===this.pending)return s;clearInterval(s)}execute(t,s){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;const i=this._execute(t,s);if(i)return i;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(t,s){let i,r=!1;try{this.work(t)}catch(t){r=!0,i=!!t&&t||new Error(t)}if(r)return this.unsubscribe(),i}_unsubscribe(){const t=this.id,s=this.scheduler,i=s.actions,r=i.indexOf(this);this.work=null,this.state=null,this.pending=!1,this.scheduler=null,-1!==r&&i.splice(r,1),null!=t&&(this.id=this.recycleAsyncId(s,t,null)),this.delay=null}});function N(){}const T=(()=>{function t(){return Error.call(this),this.message="argument out of range",this.name="ArgumentOutOfRangeError",this}return t.prototype=Object.create(Error.prototype),t})(),U=(()=>{function t(){return Error.call(this),this.message="no elements in sequence",this.name="EmptyError",this}return t.prototype=Object.create(Error.prototype),t})();class R{constructor(t,s){this.project=t,this.thisArg=s}call(t,s){return s.subscribe(new M(t,this.project,this.thisArg))}}class M extends w{constructor(t,s,i){super(t),this.project=s,this.count=0,this.thisArg=i||this}_next(t){let s;try{s=this.project.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}this.destination.next(s)}}class B extends w{notifyNext(t,s,i,r,e){this.destination.next(s)}notifyError(t,s){this.destination.error(t)}notifyComplete(t){this.destination.complete()}}class H extends w{constructor(t,s,i){super(),this.parent=t,this.outerValue=s,this.outerIndex=i,this.index=0}_next(t){this.parent.notifyNext(this.outerValue,t,this.outerIndex,this.index++,this)}_error(t){this.parent.notifyError(t,this),this.unsubscribe()}_complete(){this.parent.notifyComplete(this),this.unsubscribe()}}const q="function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator",J=t=>{if(t&&"function"==typeof t[m])return n=t,t=>{const s=n[m]();if("function"!=typeof s.subscribe)throw new TypeError("Provided object does not correctly implement Symbol.observable");return s.subscribe(t)};if((e=t)&&"number"==typeof e.length&&"function"!=typeof e)return $(t);if((r=t)&&"function"!=typeof r.subscribe&&"function"==typeof r.then)return i=t,t=>(i.then((s=>{t.closed||(t.next(s),t.complete())}),(s=>t.error(s))).then(null,c),t);if(t&&"function"==typeof t[q])return s=t,t=>{const i=s[q]();for(;;){let s;try{s=i.next()}catch(s){return t.error(s),t}if(s.done){t.complete();break}if(t.next(s.value),t.closed)break}return"function"==typeof i.return&&t.add((()=>{i.return&&i.return()})),t};{const s=f(t)?"an invalid object":`'${t}'`;throw new TypeError(`You provided ${s} where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.`)}var s,i,r,e,n};function V(t,s,i,r,e=new H(t,i,r)){if(!e.closed)return s instanceof x?s.subscribe(e):J(s)(e)}class Y extends w{constructor(t){super(),this.parent=t}_next(t){this.parent.notifyNext(t)}_error(t){this.parent.notifyError(t),this.unsubscribe()}_complete(){this.parent.notifyComplete(),this.unsubscribe()}}class z extends w{notifyNext(t){this.destination.next(t)}notifyError(t){this.destination.error(t)}notifyComplete(){this.destination.complete()}}function F(t){return!l(t)&&t-parseFloat(t)+1>=0}function L(t,s){return function(i){return i.lift(new G(t,s))}}class G{constructor(t,s){this.predicate=t,this.thisArg=s}call(t,s){return s.subscribe(new K(t,this.predicate,this.thisArg))}}class K extends w{constructor(t,s,i){super(t),this.predicate=s,this.thisArg=i,this.count=0}_next(t){let s;try{s=this.predicate.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}s&&this.destination.next(t)}}class Q{call(t,s){return s.subscribe(new W(t))}}class W extends B{constructor(t){super(t),this.hasFirst=!1,this.observables=[],this.subscriptions=[]}_next(t){this.observables.push(t)}_complete(){const t=this.observables,s=t.length;if(0===s)this.destination.complete();else{for(let i=0;i<s&&!this.hasFirst;i++){const s=V(this,t[i],void 0,i);this.subscriptions&&this.subscriptions.push(s),this.add(s)}this.observables=null}}notifyNext(t,s,i){if(!this.hasFirst){this.hasFirst=!0;for(let t=0;t<this.subscriptions.length;t++)if(t!==i){let s=this.subscriptions[t];s.unsubscribe(),this.remove(s)}this.subscriptions=null}this.destination.next(s)}}function X(t){const{index:s,period:i,subscriber:r}=t;if(r.next(s),!r.closed){if(-1===i)return r.complete();t.index=s+1,this.schedule(t,i)}}function Z(t=null){return s=>s.lift(new tt(t))}class tt{constructor(t){this.defaultValue=t}call(t,s){return s.subscribe(new st(t,this.defaultValue))}}class st extends w{constructor(t,s){super(t),this.defaultValue=s,this.isEmpty=!0}_next(t){this.isEmpty=!1,this.destination.next(t)}_complete(){this.isEmpty&&this.destination.next(this.defaultValue),this.destination.complete()}}function it(t=nt){return s=>s.lift(new rt(t))}class rt{constructor(t){this.errorFactory=t}call(t,s){return s.subscribe(new et(t,this.errorFactory))}}class et extends w{constructor(t,s){super(t),this.errorFactory=s,this.hasValue=!1}_next(t){this.hasValue=!0,this.destination.next(t)}_complete(){if(this.hasValue)return this.destination.complete();{let t;try{t=this.errorFactory()}catch(s){t=s}this.destination.error(t)}}}function nt(){return new U}function ot(t){return s=>{return 0===t?i?function(t){return new x((s=>t.schedule((()=>s.complete()))))}(i):C:s.lift(new ht(t));var i}}class ht{constructor(t){if(this.total=t,this.total<0)throw new T}call(t,s){return s.subscribe(new ct(t,this.total))}}class ct extends w{constructor(t,s){super(t),this.total=s,this.count=0}_next(t){const s=this.total,i=++this.count;i<=s&&(this.destination.next(t),i===s&&(this.destination.complete(),this.unsubscribe()))}}function ut(t,s){const i=arguments.length>=2;return r=>r.pipe(t?L(((s,i)=>t(s,i,r))):v,ot(1),i?Z(s):it((()=>new U)))}class lt{constructor(t){this.notifier=t}call(t,s){const i=new ft(t),r=function(t,s){if(s.closed)return;if(t instanceof x)return t.subscribe(s);let i;try{i=J(t)(s)}catch(t){s.error(t)}return i}(this.notifier,new Y(i));return r&&!i.seenValue?(i.add(r),s.subscribe(i)):i}}class ft extends z{constructor(t){super(t),this.seenValue=!1}notifyNext(){this.seenValue=!0,this.complete()}notifyComplete(){}}class at{constructor(t,s,i){this.nextOrObserver=t,this.error=s,this.complete=i}call(t,s){return s.subscribe(new pt(t,this.nextOrObserver,this.error,this.complete))}}class pt extends w{constructor(t,s,i,r){super(t),this._tapNext=N,this._tapError=N,this._tapComplete=N,this._tapError=i||N,this._tapComplete=r||N,n(s)?(this._context=this,this._tapNext=s):s&&(this._context=s,this._tapNext=s.next||N,this._tapError=s.error||N,this._tapComplete=s.complete||N)}_next(t){try{this._tapNext.call(this._context,t)}catch(t){return void this.destination.error(t)}this.destination.next(t)}_error(t){try{this._tapError.call(this._context,t)}catch(t){return void this.destination.error(t)}this.destination.error(t)}_complete(){try{this._tapComplete.call(this._context)}catch(t){return void this.destination.error(t)}return this.destination.complete()}}var dt,bt=new Uint8Array(16);function wt(){if(!dt&&!(dt="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return dt(bt)}const yt=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function mt(t){return"string"==typeof t&&yt.test(t)}for(var vt=[],xt=0;xt<256;++xt)vt.push((xt+256).toString(16).substr(1));function _t(t,s,i){var r=(t=t||{}).random||(t.rng||wt)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,s){i=i||0;for(var e=0;e<16;++e)s[i+e]=r[e];return s}return function(t){var s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=(vt[t[s+0]]+vt[t[s+1]]+vt[t[s+2]]+vt[t[s+3]]+"-"+vt[t[s+4]]+vt[t[s+5]]+"-"+vt[t[s+6]]+vt[t[s+7]]+"-"+vt[t[s+8]]+vt[t[s+9]]+"-"+vt[t[s+10]]+vt[t[s+11]]+vt[t[s+12]]+vt[t[s+13]]+vt[t[s+14]]+vt[t[s+15]]).toLowerCase();if(!mt(i))throw TypeError("Stringified UUID is invalid");return i}(r)}class Et{constructor(){this.breaker=new O,this.panicker=new O,this.enabled=!0,this.lastThrottle=new Date}async alive(t=250){const s=new Date;s.getTime()-this.lastThrottle.getTime()<t||(this.lastThrottle=s,await this.wait(0))}async wait(t){if(!this.enabled)return;"number"==typeof t?t={ms:t}:"function"==typeof t?t={preamble:t}:void 0===t&&(t={}),"function"==typeof t.preamble&&t.preamble();const s=[this.breaker,this.panicker.pipe((i=()=>{throw new Error("VM panicked!")},function(t){return t.lift(new at(i,undefined,undefined))}))];var i;Number.isNaN(t.ms)||null==t.ms||s.push(function(t=0,s,i){let r=-1;return F(s)?r=Number(s)<1?1:Number(s):D(s)&&(i=s),D(i)||(i=I),new x((s=>{const e=F(t)?t:+t-i.now();return i.schedule(X,e,{index:0,period:r,subscriber:s})}))}(t.ms)),await function(...t){if(1===t.length){if(!l(t[0]))return t[0];t=t[0]}return(s=t,i=void 0,i?function(t,s){return new x((i=>{const r=new p;let e=0;return r.add(s.schedule((function(){e!==t.length?(i.next(t[e++]),i.closed||r.add(this.schedule())):i.complete()}))),r}))}(s,i):new x($(s))).lift(new Q);var s,i}(s).pipe(ut()).toPromise(),"function"==typeof t.callback&&t.callback()}resume(){var t;null===(t=this.breaker)||void 0===t||t.next()}panic(){var t;null===(t=this.panicker)||void 0===t||t.next(),this.destroy()}destroy(){var t,s;null===(t=this.breaker)||void 0===t||t.complete(),null===(s=this.panicker)||void 0===s||s.complete()}}self.signal=new O;let St=new O;i.cleanup=async function(){St.next(),St.complete()},i.execute=async function(t,s){self.defui=t=>async(...i)=>{const r=_t();return await self.debug.wait(0),s(r,t.toString(),i),await self.signal.pipe(L((([t,s])=>t===r)),(n=([t,s])=>s,function(t){return t.lift(new R(n,undefined))}),ut(),(e=St,t=>t.lift(new lt(e)))).toPromise();var e,n},self.debug=new Et;const i=self.Function(`return (async () => {\n    ${t};\n  })();`);return await i()},i.init=async function(){self.signal=new O,St=new O},i.panic=async function(){self.debug.panic()},i.resume=async function(){self.debug.resume()},i.signal=async function(t,s){self.signal.next([t,s])}})();