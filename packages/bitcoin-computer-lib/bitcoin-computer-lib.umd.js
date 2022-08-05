var t,e;t=this,e=function(t,e,n,r,s,i,o,c,u){"use strict";function a(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}function d(t){if(t&&t.__esModule)return t;var e=Object.create(null);return t&&Object.keys(t).forEach((function(n){if("default"!==n){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}})),e.default=t,Object.freeze(e)}var h=a(r);var l=a(i);var p=a(o);var f=d(c);function g(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(r=Object.getOwnPropertySymbols(t);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(t,r[s])&&(n[r[s]]=t[r[s]])}return n}function v(t,e,n,r){return new(n||(n=Promise))((function(s,i){function o(t){try{u(r.next(t))}catch(t){i(t)}}function c(t){try{u(r.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,c)}u((r=r.apply(t,e||[])).next())}))}const y=t=>new Compartment({}).evaluate(t);const b=(t,e,n)=>new Compartment({target:t,thisArgument:e,argumentsList:n}).evaluate("Reflect.apply(target, thisArgument, argumentsList)");const w=(t,e)=>new Compartment({target:t,argumentsList:e}).evaluate(`Reflect.construct(${t}, argumentsList)`);const{crypto:m}=e.Bitcoin;const _=(t,e)=>{const n=Date.now();const r=m.Hash.sha256(Buffer.from(e+n));const s=[m.ECDSA.sign(r,t,"big").toString("hex"),t.publicKey.toString(),n];return`Bearer ${Buffer.from(s.join(":")).toString("base64")}`};class O{constructor(t,e,n={}){this.baseUrl=t,this.headers=n,this.privateKey=e}get(t){return v(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:_(this.privateKey,this.baseUrl)}:{};return(yield h.default.get(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}post(t,e){return v(this,void 0,void 0,(function*(){const n=this.privateKey?{Authentication:_(this.privateKey,this.baseUrl)}:{};return(yield h.default.post(`${this.baseUrl}${t}`,e,{headers:Object.assign(Object.assign({},this.headers),n)})).data}))}delete(t){return v(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:_(this.privateKey,this.baseUrl)}:{};return(yield h.default.delete(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}}const x=process.env.CHAIN||"LTC";const j=process.env.NETWORK||"testnet";const S=process.env.BCN_URL||"https://node.bitcoincomputer.io";process.env.RPC_USER,process.env.RPC_PASSWORD;const $=parseInt(process.env.BC_DUST_LIMIT||"",10)||1546;parseInt(process.env.BC_DEFAULT_FEE||"",10),parseInt(process.env.BC_SCRIPT_CHUNK_SIZE||"",10);const C=2e4;const E="";const{PublicKey:I,Mnemonic:K,crypto:T}=e.Bitcoin;const{Point:A}=T;function B(t){return Buffer.from(t,"hex").toString().replace(/\0/g,"")}function k(t,e){return t.slice(e)+t.slice(0,e)}function P(t,e,n){if(t.length*Math.log2(e)>53)throw new Error(`Input too large ${t.length} ${Math.log2(e)}`);if(![2,10,16].includes(e)||![2,10,16].includes(n))throw new Error("ToBase or FromBase invalid in covertNumber.");if(2===e&&t.length%8!=0)throw new Error("Binary strings must be byte aligned.");if(16===e&&t.length%2!=0)throw new Error("Hex strings must be of even length.");const r=parseInt(t,e).toString(n);return 2===n?r.padStart(8*Math.ceil(r.length/8),"0"):16===n?r.padStart(2*Math.ceil(r.length/2),"0"):r}function U(t,e){const n=new RegExp(`.{1,${e}}`,"g");return t.match(n)||[]}function R(t){return U(t,2).map((t=>P(t,16,2))).join("")}function D(t){return U(t,8).map((t=>P(t,2,16))).join("")}function N(t){return t.toString(16).padStart(3,"0")}function H(t){return parseInt(t,16)}function L(t){if(62!==t.length)throw new Error("Input to hexToPublicKey must be of length 62");let e=!1;let n=0;let r;for(;!e;){if(n>=256)throw new Error("Something went wrong storing data");const s=n.toString(16).padStart(2,"0")+D(k(R(t).padStart(64,"0"),n));try{r=A.fromX(!1,s),e=!0}catch(t){n+=1}}if(!r)throw new Error("Something went wrong storing data");return new I(r)}function M(t){const e=t.point.getX().toString("hex").padStart(64,"0");const n=P(e.slice(0,2),16,10);return D((s=parseInt(n,10),(r=R(e.slice(2))).slice(-s)+r.slice(0,-s)));var r,s}function q(t=x,e=j){if("testnet"===e||"regtest"===e)return 1;if("BTC"===t)return 0;if("LTC"===t)return 2;if("DOGE"===t)return 3;if("BCH"===t)return 145;if("BSV"===t)return 236;throw new Error(`Unsupported chain ${t}`)}function F(t=x,e=j){return function({purpose:t=44,coinType:e=2,account:n=0}={}){return`m/${t.toString()}'/${e.toString()}'/${n.toString()}'`}({coinType:q(t,e)})}function J(t,e){const n=function(t,e){return((t,e,n={})=>{const{path:r="m/44'/0'/0'/0",passphrase:s=""}=n;let i=t.toHDPrivateKey(s,e);return r&&(i=i.derive(r)),i.privateKey})(new K("replace this seed"),e,{path:F(t,e),passphrase:""})}(t,e);return I.fromPrivateKey(n)}function W({mnemonic:t=new K,path:e=F(),passphrase:n=E,network:r=j}){if(void 0!==t&&void 0!==e&&void 0!==n&&void 0!==r)return t.toHDPrivateKey(n,r).deriveChild(e);throw new Error(`Missing required parameters${JSON.stringify({mnemonic:t,path:e,passphrase:n,network:r})}`)}const{Transaction:z,Mnemonic:G}=e.Bitcoin;const{UnspentOutput:Y}=z;function V(t){if(!/^[0-9A-Fa-f]{64}$/.test(t))throw new Error(`Invalid txId: ${t}`)}function X(t){if(!/^[0-9A-Fa-f]{64}\/\d+$/.test(t))throw new Error(`Invalid outId: ${t}`)}function Q(t){X(t);const[e,n]=t.split("/");return{txId:e,outputIndex:parseInt(n,10)}}class Z{constructor(t={}){const{chain:e=x,network:n=j,mnemonic:r="",path:s=F(t.chain,t.network),passphrase:i=E,url:o=S}=t;this.chain=e.toUpperCase(),this.network=n.toLowerCase(),this.mnemonic=new G(r.toString()),this.path=s,this.passphrase=i,this.bcn=new O(o,this.privateKey)}get privateKey(){return W(this).privateKey}getBalance(t){return v(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return yield this.bcn.get(`/v1/${e}/${n}/address/${t}/balance`)}))}getTransactions(t){return v(this,void 0,void 0,(function*(){return(yield this.getRawTxs(t)).map((t=>new z(t)))}))}getRawTxs(t){return v(this,void 0,void 0,(function*(){t.map(V);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/tx/bulk/`,{txIds:t})}))}sendTransaction(t){return v(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/tx/send`,{rawTx:t})}))}getUtxosByAddress(t){return v(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return(yield this.bcn.get(`/v1/${e}/${n}/wallet/${t.toString()}/utxos`)).map((({rev:t,scriptPubKey:e,satoshis:n})=>{const[r,s]=t.split("/");return new Y({txId:r,outputIndex:parseInt(s,10),satoshis:n,script:e})}))}))}query({publicKey:t,classHash:e}){return v(this,void 0,void 0,(function*(){if(void 0===t&&void 0===e)throw new Error("Query parameters cannot be empty.");let n="";t&&(n+=`?publicKey=${t}`),e&&(n+=0===n.length?"?":"&",n+=`classHash=${e}`);const{chain:r,network:s}=this;return this.bcn.get(`/v1/${r}/${s}/non-standard-utxos${n}`)}))}idsToRevs(t){return v(this,void 0,void 0,(function*(){t.map(X);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/revs`,{ids:t})}))}rpc(t,e){return v(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/rpc`,{method:t,params:e})}))}static getSecretOutput({_url:t,privateKey:e}){return v(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const s=n.slice(0,-2).join("/");const i=new O(s,e);return{host:s,data:yield i.get(`/v1/store/${r}`)}}))}static setSecretOutput({secretOutput:t,host:e,privateKey:n}){return v(this,void 0,void 0,(function*(){return new O(e,n).post("/v1/store/",t)}))}static deleteSecretOutput({_url:t,privateKey:e}){return v(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const s=n.slice(0,-2).join("/");const i=new O(s,e);yield i.delete(`/v1/store/${r}`)}))}get url(){return this.bcn.baseUrl}}const{PublicKey:tt,Script:et}=e.Bitcoin;function nt(t,e,n,r){if(t.length>3)throw new Error("Too many owners");return function(t,e,n,r){const s=r?[...t,J(e,n).toBuffer()]:t;const i=new et;return i.add("OP_1"),s.forEach((t=>{i.add(t)})),i.add(`OP_${s.length}`),i.add("OP_CHECKMULTISIG"),i}(t.map((t=>t.toBuffer())),e,n,r)}function rt(t,e){return function(t,e){const n=t.chunks.filter((t=>t.buf));return(e?n.slice(0,-1):n).map((t=>t.buf))}(t,e).map((t=>tt.fromBuffer(t)))}function st(t){return Buffer.from(p.default.SHA256(t).toString(),"hex").toString("hex").substr(0,4)}function it(t){return`${st(t)};${t}`}function ot(t){const e=t.substr(0,4);const n=t.substr(5);if(!function(t,e){return st(t)===e}(n,e))throw new Error("Decryption failure");return n}function ct(t){if(void 0!==t._readers){const{_readers:e,_url:n,_owners:r,_amount:s}=t,i=g(t,["_readers","_url","_owners","_amount"]);const o=function(t,e){const n=l.default.randomBytes(32).toString("hex");const r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");const r=it(t);return p.default.AES.encrypt(r,n).toString()}(t,n);const s=e.map((t=>function(t,e){if(!/^0[2-3][0-9a-f]{64}|04[0-9a-f]{128}$/.test(e))throw new Error("Invalid publicKey");const n=it(t);return f.encrypt(e,Buffer.from(n,"utf8")).toString("base64")}(n,t)));return{__cypher:r,__secrets:s}}(JSON.stringify(i),e);return void 0!==n&&(o._url=n),void 0!==r&&(o._owners=r),void 0!==s&&(o._amount=s),o}return t}const{Transaction:ut}=e.Bitcoin;const{Output:at,UnspentOutput:dt}=ut;class ht{constructor({restClient:t=new Z}={}){this.tx=new ut,this.tx.feePerKb(C),this.outData=[],this.restClient=t}get txId(){return this.tx.id}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get inputs(){return this.tx.inputs.map((t=>`${t.prevTxId.toString("hex")}/${t.outputIndex}`))}get inRevs(){const{enc:t}=this;let[e]=t;return e=Number.isFinite(e)?e:0,this.tx.inputs.slice(0,e).map((({prevTxId:t,outputIndex:e})=>`${t.toString("hex")}/${e}`))}get outRevs(){const{enc:t}=this;let[,e]=t;return e=Number.isFinite(e)?e:0,Array.from(Array(e).keys()).map((t=>`${this.tx.id}/${t}`))}get opReturns(){try{const{outputs:t}=this.tx;return t.filter((({script:t})=>t.isDataOut())).map((({script:t})=>t.getData())).map((t=>t.toString())).join()}catch(t){return""}}get enc(){return U(this.opReturns.slice(0,9),3).map(H)}get dataPrefix(){return this.opReturns.slice(9)}isFullyFunded(){return this.tx._getInputAmount()-this.tx._getOutputAmount()>=this.tx.getFee()}getOwnerOutputs(){const{enc:t}=this;const[,e=0]=t;return this.tx.outputs.slice(0,e)}getDataOutputs(){const{enc:t}=this;const[,e,n]=t;return this.tx.outputs.slice(e,n)}getOutData(){return v(this,void 0,void 0,(function*(){try{const t=this.getDataOutputs().map((t=>t.script)).map((t=>rt(t,!0))).flat().map(M).map(B).join("");const{dataPrefix:e}=this;const n=JSON.parse(e+t);const r=this.restClient.privateKey.toBuffer().toString("hex");const s=this.getOwnerOutputs();if(s.length!==n.length)throw new Error("Inconsistent state");const i=s.map(((t,e)=>Object.assign(Object.assign({},n[e]),{_owners:rt(t.script,!1).map((t=>t.toString())),_amount:t.satoshis})));return Promise.all(i.map((t=>v(this,void 0,void 0,(function*(){try{const e=yield function(t){return e=>v(this,void 0,void 0,(function*(){if(function(t){return void 0!==t._url}(e)){const{_url:n}=e,r=g(e,["_url"]);const{host:s,data:i}=yield Z.getSecretOutput({_url:n,privateKey:t});return Object.assign(Object.assign(Object.assign({},r),JSON.parse(i)),{_url:s})}return e}))}(this.restClient.privateKey)(t);return function(t,e){if(function(t){return void 0!==t.__cypher&&void 0!==t.__secrets}(t)){const{__cypher:n,__secrets:r}=t,s=g(t,["__cypher","__secrets"]);return Object.assign(Object.assign(Object.assign({},s),JSON.parse(function({__cypher:t,__secrets:e},n){let r="";if(n.forEach((n=>{e.forEach((e=>{try{const s=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid privateKey");return ot(f.decrypt(e,Buffer.from(t,"base64")).toString("utf8"))}(e,n);r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");return ot(p.default.AES.decrypt(t,n).toString(p.default.enc.Utf8))}(t,s)}catch(t){const e=["Decryption failure","Unsupported state or unable to authenticate data"];if(t instanceof Error&&!e.includes(t.message))throw t}}))})),r)return r;throw new Error("Decryption failure")}({__cypher:n,__secrets:r},e))),{_readers:[]})}return t}(e,[r])}catch(t){return null}})))))}catch(t){return[]}}))}getOwners(){return this.getOwnerOutputs().map((t=>rt(t.script,!1).map((t=>t.toString()))))}getAmounts(){return this.getOwnerOutputs().map((t=>t.satoshis))}spendFromData(t){return v(this,void 0,void 0,(function*(){if(!t.length)return;const n=t.map(Q);const r=n.map((t=>t.txId));const s=yield this.restClient.getTransactions(r);for(let t=0;t<n.length;t+=1){const{txId:r,outputIndex:i}=n[t];const{outputs:o}=s[t];const c=o[i];const u=Math.round(c.satoshis);const a=new e.Bitcoin.Script(c.script);const d=new dt({txId:r,outputIndex:i,satoshis:u,script:a});const h=rt(a,!1).map((t=>t.toString()));this.tx.from([d],h,1)}}))}createDataOuts(t){t.forEach((({_amount:t,_owners:n=[]})=>{if(Array.isArray(n)&&n.length>3)throw new Error("Too many owners.");const r=n.map((t=>e.Bitcoin.PublicKey.fromString(t)));const s=t||$;const i=nt(r,this.chain,this.network,!1);this.tx.addOutput(new at({script:i,satoshis:s}))}));const n=t.map((t=>g(t,["_amount","_owners"])));const r=$;const s=JSON.stringify(n);const i=s.slice(0,71);const o=function(t,e,n,r){var s;return function(t,e){const n=[];for(let e=0;e<t.length;e+=2)n.push(t.slice(e,e+2));return n}(U((s=t,Buffer.from(s).toString("hex")),62).map((t=>t.padStart(62,"0"))).map(L)).map((t=>nt(t,e,n,!0)))}(s.slice(71),this.chain,this.network);const c=N(this.tx.inputs.length)+N(this.tx.outputs.length)+N(this.tx.outputs.length+o.length);o.forEach((t=>{this.tx.addOutput(new at({script:t,satoshis:r}))})),this.tx.addData(c+i)}static fromTxHex({hex:t="",restClient:e=new Z}){return v(this,void 0,void 0,(function*(){let n=[];let r=[];let s=[];const i=new this({restClient:e});i.tx.fromString(t);try{n=yield i.getOutData()}catch(t){}try{r=i.getOwners()}catch(t){}try{s=i.getAmounts()}catch(t){}return i.outData=n.map(((t,e)=>Object.assign(Object.assign({},t),{_owners:r[e],_amount:s[e]}))),i}))}static fromTxId({txId:t="",restClient:e=new Z}){return v(this,void 0,void 0,(function*(){const[n]=yield e.getRawTxs([t]);return this.fromTxHex({hex:n,restClient:e})}))}}class lt{constructor(t={}){this.restClient=new Z(t)}derive(t="0"){const e=`${this.path}${this.path.length>0?"/":""}${t}`;const{chain:n,network:r,url:s,mnemonic:i,passphrase:o}=this.restClient;return new lt({chain:n,network:r,url:s,mnemonic:i.toString(),path:e,passphrase:o})}getBalance(){return v(this,void 0,void 0,(function*(){return this.restClient.getBalance(this.address)}))}getUtxosByAmount(t){return v(this,void 0,void 0,(function*(){const e=yield this.restClient.getUtxosByAddress(this.address);let n=0;const r=[];!function(t){const e=t;for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}(e);for(const s of e)if(n+=s.satoshis,r.push(s),n>=t)return r;const{network:s,chain:i}=this.restClient;const o=this.address.toString();throw new Error(`Insufficient balance in address ${o} on ${s} ${i}. Found ${n}, required ${t}.`)}))}fundAndSendTx(t){return v(this,void 0,void 0,(function*(){t.tx.feePerKb(4e4);const n=t.tx.outputs.length;const{chain:r,network:s}=this.restClient;t.tx.to(function(t,e){const n={"any-testnet":"uTKUDCkpo12vstJBsMWmrTPz9wFE6DuzGH","BTC-mainnet":"igpnnoLziUyxtQuWYCP13gHYVhUru6iLaY","LTC-mainnet":"t77o829ngHnuUorwDkf129fL6ERLFNqKG8","DOGE-mainnet":"XfNRUdvrv6uCDbCF5xJ18UYwVkkefkXvEd","BCH-mainnet":"CSAkkS8Mro9mYRqhksS1FyYrsnSE5MVQ5m"};return k("testnet"===e||"regtest"===e?n["any-testnet"]:n[`${t}-${e}`],19)}(r,s),0);const i=yield this.restClient.getUtxosByAddress(this.address);if(t.tx.change(this.address),0===i.length)throw new Error(`Insufficient balance in address ${this.address}.`);let o=0;let c=0;let u=0;do{const[n]=i.splice(0,1);t.tx.from([new e.Bitcoin.Transaction.UnspentOutput(n)]),t.tx.sign(this.privateKey,1),c=t.tx.toString().length,t.tx.fee(c*C*2),t.tx._updateChangeOutput(),u=t.tx._getInputAmount()-t.tx._getOutputAmount(),o=u/c*1e3}while(0!==i.length&&o<4e4);if(o<4e4&&0===i.length)throw new Error(`Insufficient balance in address ${this.address}. Current fee_per_kb ${o}. Fee ${u}. Utxo set size ${i.length}. CTransaction size ${c} Inputs ${JSON.stringify(t.tx.inputs,null,2)} Outpus ${JSON.stringify(t.tx.outputs,null,2)}`);if(c=t.tx.toString().length,u=Math.ceil(c/1e3*C),t.tx.fee(u),t.tx.outputs[n].satoshis=u,t.tx._outputAmount=void 0,t.tx.feePerKb(C),t.tx._outputAmount=void 0,t.tx._updateChangeOutput(),!1===t.isFullyFunded()||!1===t.tx.verify())throw new Error(`Something went wrong. Address ${this.address}. Transaction: ${JSON.stringify(t.tx,null,2)}`);return t.tx.sign(this.privateKey,1),this.restClient.sendTransaction(t.tx.toString())}))}send(t,e){return v(this,void 0,void 0,(function*(){const{restClient:n}=this;const r=new ht({restClient:n});return r.tx.to(e,t),this.fundAndSendTx(r)}))}get hdPrivateKey(){return W(this.restClient)}get privateKey(){return this.hdPrivateKey.privateKey}get publicKey(){return this.hdPrivateKey.publicKey}get passphrase(){return this.restClient.passphrase}get path(){return this.restClient.path}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get url(){return this.restClient.url}get mnemonic(){return this.restClient.mnemonic}get address(){return this.publicKey.toAddress(this.restClient.network)}}class pt{constructor(t={}){this.wallet=new lt(t)}fromTxHex(t){return v(this,void 0,void 0,(function*(){const{restClient:e}=this.wallet;return ht.fromTxHex({hex:t,restClient:e})}))}fromTxId(t){return v(this,void 0,void 0,(function*(){const[e]=yield this.wallet.restClient.getRawTxs([t]);return this.fromTxHex(e)}))}get(t){return v(this,void 0,void 0,(function*(){const e=t.map(Q);return Promise.all(e.map((({txId:t,outputIndex:e})=>v(this,void 0,void 0,(function*(){const{outData:n}=yield this.fromTxId(t);if(e>n.length)throw new Error("Index out of bounds");return n[e]})))))}))}put(t){return this.update([],t)}createTx(t,e){return v(this,void 0,void 0,(function*(){const{wallet:n}=this;const{restClient:r}=n;const s=new ht({restClient:r});const{privateKey:i,publicKey:o}=n;const c=e.map((t=>{var{_owners:e}=t,n=g(t,["_owners"]);return Object.assign({_owners:e||[o.toString()]},n)})).map(ct);const u=yield Promise.all(c.map(function(t){return e=>v(this,void 0,void 0,(function*(){if(void 0!==e._url){const{_url:n,_owners:r,_amount:s}=e,i=g(e,["_url","_owners","_amount"]);const o=yield Z.setSecretOutput({host:n,secretOutput:{data:JSON.stringify(i)},privateKey:t});return void 0!==r&&(o._owners=r),void 0!==s&&(o._amount=s),o}return e}))}(i)));return yield s.spendFromData(t),yield s.createDataOuts(u),s}))}update(t,e){return v(this,void 0,void 0,(function*(){const n=yield this.createTx(t,e);return yield this.wallet.fundAndSendTx(n),n.outRevs}))}}const ft=["_id","_rev","_owners","_amount","_readers","_url","__vouts","__func","__index","__args"];const gt=t=>(Object.prototype.toString.call(t).match(/\s([a-zA-Z]+)/)||[])[1];const vt=t=>"object"==typeof t?gt(t):gt(t).toLowerCase();const yt=t=>["number","string","boolean","undefined","Null"].includes(vt(t));const bt=t=>"Array"===vt(t);const wt=t=>"Object"===vt(t);const mt=t=>yt(t)||["Array","Object"].includes(vt(t));const _t=(t,e)=>{if(!mt(t)||!mt(e))throw new Error(`Unsupported data types for deep equals: ${vt(t)} & ${vt(e)}`);if(vt(t)!==vt(e))return!1;if(yt(t)&&yt(e))return t===e;const n=(t,e)=>Object.entries(t).every((([t,n])=>_t(e[t],n)));return t&&e&&n(t,e)&&n(e,t)};const Ot=t=>{if(yt(t))return t;if(bt(t))return t.map(Ot);if(wt(t)){const e=Object.keys(t).reduce(((e,n)=>(e[n]=Ot(t[n]),e)),{});const n=Object.create(Object.getPrototypeOf(t));return Object.assign(n,e)}throw new Error(`Unsupported data type for clone: ${vt(t)}`)};const xt=(t,e)=>Object.fromEntries(Object.entries(t).map((t=>e(t))));const jt=(t,e)=>xt(t,(([t,n])=>[t,e(n)]));const St=(t,e)=>Object.fromEntries(Object.entries(t).filter((t=>e(t))));const $t=(t,e,n,r)=>{if(yt(t))return t;if(bt(t))return t.map((t=>$t(t,e,n,r)));if(wt(t)){t._rev=`${r}/${n}`;const s=e[n];return Object.entries(t).forEach((([n,i])=>{"object"==typeof s&&Object.keys(s).includes(n)&&(t[n]=$t(i,e,s[n],r))})),t}throw new Error(`Unsupported type ${vt(t)} in deep.updateRev`)};const Ct=(t,e)=>{if(yt(t))return t;if(bt(t))return t.map((t=>Ct(t,e)));if(wt(t))return t._id=!t._id||t._id.startsWith("__temp__")?t._rev:t._id,t._root=t._root||e,Object.entries(t).forEach((([n,r])=>{t[n]=Ct(r,e)})),t;throw new Error(`Unsupported type ${vt(t)} in deep.addId`)};const Et=t=>{if(yt(t))return t;if(bt(t))return t.map((t=>Et(t)));if(wt(t)){const e=`__temp__/${Math.random()}`;return t._id=t._id||e,t._rev=t._rev||e,Object.values(t).map((t=>Et(t))),t}throw new Error(`Unsupported type ${vt(t)} in addRandomId`)};const It=t=>{if(yt(t))return t;if(bt(t))return t.map((t=>It(t)));if(wt(t))return xt(t,(([t,e])=>["_owners","_readers"].includes(t)?[t,JSON.stringify(e)]:yt(e)?[t,e]:[t,It(e)]));throw new Error(`Unexpected type ${vt(t)} in stringifyOwners`)};const Kt=t=>(t._owners&&(t._owners=JSON.parse(t._owners)),t._readers&&(t._readers=JSON.parse(t._readers)),t);const Tt=t=>{if(yt(t))return t;if(bt(t)||wt(t))return Object.entries(t).reduce(((t,[e,n])=>{const r=Tt(n);return(t=>"Object"===vt(t)&&Object.keys(t).every((t=>!Number.isNaN(parseInt(t,10)))))(r)?Object.entries(r).forEach((([n,r])=>{t[`${e}_${n}`]=r})):t[e]=r,t}),{});throw new Error(`Unsupported type ${vt(t)} in encodeArraysAsObjects`)};const At=t=>{const e={[t._id]:Object.entries(t).reduce(((t,[e,n])=>ft.includes(e)?Object.assign(Object.assign({},t),{[e]:n}):yt(n)?Object.assign(Object.assign({},t),{[`__basic__${e}`]:n}):Object.assign(Object.assign({},t),{[e]:n._id})),{})};return Object.values(t).filter((t=>!yt(t))).reduce(((t,e)=>Object.assign(Object.assign({},t),At(e))),e)};const Bt=t=>St(t,(([t])=>!t.startsWith("__basic__")));const kt=(t,e)=>{const n=t[e];return n.__contains=Object.entries(n).reduce(((e,[n,r])=>["__contains",...ft].includes(n)?e:"__change"===n?"new"===r||"diff"===r||e:kt(t,r)[r].__contains||e),!1),t};const Pt=(t,e)=>t.map((t=>Object.entries(t).reduce(((t,[n,r])=>{const s="string"==typeof r&&"undefined"!==vt(e[r])?e[r]:r;return Object.assign(Object.assign({},t),{[n]:s})}),{})));class Ut{constructor({db:t=new pt}={}){this.db=t}get(t){return v(this,void 0,void 0,(function*(){const{txId:e,outputIndex:n}=Q(t);const{inRevs:r,outData:s}=yield this.db.fromTxId(e);if(!Array.isArray(r)||!Array.isArray(s)||0===s.length)return;const i=s[0].__index||{};const o=s[i.obj].__cls||"";const c=s[i.obj].__func||"";const u=s[i.obj].__args||[];const a=yield Promise.all(Object.values(i).map((t=>{const e=r[t];return e?this.get(e):Promise.resolve({})})));const d=Object.keys(i).map(((t,e)=>[t,a[e]]));const h=Object.fromEntries(d);let l=h.obj;delete h.obj;const p=Object.entries(h).reduce(((t,[e,n])=>{const r=parseInt(e,10);return Number.isNaN(r)||(t[r]=n),t}),[]);const f=function(t,e){let n=0;return e.map((e=>"__"===e?t[n++]:e))}(p,u);let g;if("constructor"===c){const t=y(`(${o})`);l=w(t,f)}else g=b(l[c].bind(l),l,f);Object.entries(i).forEach((([t,n])=>{const r=parseInt(t,10);let i=p[r];"obj"===t?i=l:"res"===t&&(i=g),$t(i,s,n,e)}));const v=l._root||`${e}/${i.obj}`;return Ct([g,l,...p],v),[...p,l,g][n]}))}}class Rt{constructor({db:t=new pt}={}){this.db=t}deploy(t){return v(this,void 0,void 0,(function*(){const[e]=yield this.db.put([{__mdl:t}]);return e}))}static import(t,e){return v(this,void 0,void 0,(function*(){const n=new pt;const r=new Compartment({},{},{resolveHook:t=>t,importHook:t=>v(this,void 0,void 0,(function*(){const[e]=yield n.get([t]);return new u.StaticModuleRecord(e.__mdl,t)}))});const{namespace:s}=yield r.import(e);return s[t]}))}}function Dt(t){return{smartArgs:t.filter((t=>t._rev)),dumbArgs:t.map((t=>t._rev?"__":t))}}class Nt{constructor({db:t=new pt}={}){this.db=t,this.modules=new Rt({db:t}),Nt.proxyDepth=Nt.proxyDepth||0}static getUpdate(t){return v(this,void 0,void 0,(function*(){let e;let n;let r;let s;let i;let o;let c;if("Cls"in t){const{Cls:u,rev:a}=t;const d=t.args||[];e=a?(yield Rt.import(u,a)).toString():u,n=null;const h=y(`(${e})`);r=w(h,d),s=Ot(d),i=d,o=null,c=void 0}else{const{target:u,property:a,args:d}=t;e=null,n=Ot(u),r=u,s=Ot(d),i=d,o=a,this.proxyDepth+=1,c=b(u[a],u,i),this.proxyDepth-=1}const{smartArgs:u,dumbArgs:a}=Dt(s);const{smartArgs:d}=Dt(i);const h=Object.assign(Object.assign(Object.assign({},u),{obj:n}),{_id:"index"});const l=Object.assign(Object.assign(Object.assign({},d),{obj:r}),{_id:"index"});["Object","Array"].includes(vt(c))&&(l.res=c);const[p,f,v]=((t,e)=>{const n=Et(e);const r=n._id;const s=Ot(t);const i=Ot(n);const o=It(s);const c=It(i);const u=Tt(o);const a=Tt(c);const d=((t,e)=>xt(e,(([e,n])=>{const r=t[e];var s;return n.__change=(s=r)?_t(s,n)?"same":"diff":"new",[e,n]})))(At(u),At(a));const h=jt(d,Bt);const l=kt(h,r);const p=l[r];delete l[r];const f=jt(l,(t=>t._rev));const v=(y=t=>t.__contains||Object.values(p).includes(t._id),St(l,(([,t])=>y(t))));var y;const b=Object.values(v);const[w,m]=(_=t=>"new"===t.__change,b.reduce((([t,e],n,r)=>_(n)?[[...t,n],e]:[t,[...e,n]]),[[],[]]));var _;const O=[...m,...w];const x=(t=>t.reduce(((t,e,n)=>Object.assign(Object.assign({},t),{[e._id]:n})),{}))(O);const j=Pt(O,x);const[S]=Pt([p],x);const $=m.map((t=>t._rev));const[C,...E]=((t,e)=>[e,...t].map((t=>{const e=g(t,["_id","_rev","__change","__contains"]);return St(e,(([t,e])=>ft.includes(t)||"number"==typeof e))})))(j,S);return[$,E.map(Kt).map((t=>Object.entries(t).reduce(((t,[e,n])=>Object.assign(Object.assign({},t),{[e]:f[n]||n})),{}))),C]})(h,l);void 0!==f[0]&&(f[0].__index=v);const m=v.obj;void 0!==f[m]&&(null!==e&&(f[m].__cls=e),f[m].__func=null===o?"constructor":String(o),f[m].__args=a);const _=v.res;return void 0!==f[_]&&"function Object() { [native code] }"!==c.constructor.toString()&&(f[_].__cls=c.constructor.toString()),[p,f,r,d,c,v]}))}allocate(t,e,n){return v(this,void 0,void 0,(function*(){const r=yield Nt.getUpdate({Cls:t,args:e,rev:n});const[s,i,o,c,,u]=r;const[a]=yield this.db.update(s,i);const{txId:d}=Q(a);Object.entries(u).forEach((([t,e])=>{const n=parseInt(t,10);let r=c[n];"obj"===t&&(r=o),$t(r,i,e,d)}));const h=`${d}/${u.obj}`;return Ct([o,...c],h),o}))}update(t,e,n){return v(this,void 0,void 0,(function*(){const r=yield Nt.getUpdate({target:t,property:e,args:n});const[s,i,,o,c,u]=r;const[a]=yield this.db.update(s,i);const{txId:d}=Q(a);Object.entries(u).forEach((([e,n])=>{const r=parseInt(e,10);let s=o[r];"obj"===e?s=t:e.startsWith("res")&&(s=c),$t(s,i,n,d)}));const h="string"==typeof t._root?t._root:`${d}/${u.obj}`;return Ct([c,t,...o],h),c}))}get(t,e){return Nt.proxyDepth>0||"function"!=typeof t[e]?Reflect.get(t,e):(...n)=>this.update(t,e,n)}}class Ht{constructor(t={}){this.restClient=new Z(t)}get(t,e){return v(this,void 0,void 0,(function*(){return this.restClient.rpc(t,e)}))}}const{crypto:Lt}=e.Bitcoin;class Mt{constructor(t={}){const{chain:e=x,network:n=j,seed:r}=t;if(!["LTC","BTC","DOGE","BCH"].includes(e.toUpperCase()))throw new Error("We currently only support LTC.");if(!["mainnet","testnet","regtest"].includes(n.toLowerCase()))throw new Error("Please set 'network' to 'regtest', 'testnet', or 'mainnet'");if(void 0!==r)throw new Error('"seed" is deprecated, please use "mnemonic"');this.db=new pt(t),this.modules=new Rt({db:this.db}),this.rpc=new Ht(t)}static parseContract(t){const e=t.startsWith("export ")?t.slice(7):t;return e.startsWith("default ")?e.slice(8):e}new(t,e,n){return v(this,void 0,void 0,(function*(){const r=t.toString();const s=Mt.parseContract(r);const i=new Nt({db:this.db});const o=yield i.allocate(s,e,n);return new Proxy(o,i)}))}sync(t){return v(this,void 0,void 0,(function*(){X(t);const{db:e}=this;const n=new Ut({db:e});const r=new Nt({db:e});const s=yield n.get(t);return new Proxy(s,r)}))}query({publicKey:t,contract:n}){return v(this,void 0,void 0,(function*(){let r={};if(t&&(r=Object.assign(Object.assign({},r),{publicKey:new e.Bitcoin.PublicKey(t).toString()})),n){const t="string"==typeof n?n:n.toString();r=Object.assign(Object.assign({},r),{classHash:Lt.Hash.sha256(Buffer.from(t)).toString("hex")})}return this.db.wallet.restClient.query(r)}))}idsToRevs(t){return v(this,void 0,void 0,(function*(){return this.db.wallet.restClient.idsToRevs(t)}))}deploy(t){return v(this,void 0,void 0,(function*(){return this.modules.deploy(t)}))}import(t,e){return v(this,void 0,void 0,(function*(){return Rt.import(t,e)}))}getChain(){return this.db.wallet.restClient.chain}getNetwork(){return this.db.wallet.restClient.network}getMnemonic(){return this.db.wallet.restClient.mnemonic.toString()}getPrivateKey(){return this.db.wallet.privateKey.toString()}getPublicKey(){return this.db.wallet.publicKey.toString()}getAddress(){return this.db.wallet.address.toString()}getBalance(){return v(this,void 0,void 0,(function*(){return this.db.wallet.getBalance()}))}getUtxos(){return v(this,void 0,void 0,(function*(){const t=new e.Bitcoin.Address(this.getAddress());return this.db.wallet.restClient.getUtxosByAddress(t)}))}broadcast(t){return v(this,void 0,void 0,(function*(){return this.db.wallet.restClient.sendTransaction(t)}))}queryRevs(t){return v(this,void 0,void 0,(function*(){return this.query(t)}))}getOwnedRevs(t=this.db.wallet.publicKey){return this.query({publicKey:t.toString()})}getRevs(t=this.db.wallet.publicKey){return v(this,void 0,void 0,(function*(){return this.query({publicKey:t.toString()})}))}getLatestRevs(t){return v(this,void 0,void 0,(function*(){return this.idsToRevs(t)}))}getLatestRev(t){return v(this,void 0,void 0,(function*(){const[e]=yield this.idsToRevs([t]);return e}))}rpcCall(t,e){return v(this,void 0,void 0,(function*(){const n=yield this.rpc.get(t,e);return n.result?n.result:{}}))}}t.Computer=Mt,Object.defineProperty(t,"__esModule",{value:!0})},"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("bitcoin-computer-bitcore"),require("ses"),require("axios"),require("child_process"),require("crypto"),require("crypto-js"),require("eciesjs"),require("@endo/static-module-record")):"function"==typeof define&&define.amd?define(["exports","bitcoin-computer-bitcore","ses","axios","child_process","crypto","crypto-js","eciesjs","@endo/static-module-record"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).computer={},t.Bitcoin,0,t.axios,0,t.crypto,t.CryptoJS,t.eciesjs,t.staticModuleRecord);
