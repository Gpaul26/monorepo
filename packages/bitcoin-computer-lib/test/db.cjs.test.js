"use strict";var t=require("bitcoin-computer-bitcore");var e=require("chai");var n=require("axios");require("child_process");var r=require("crypto");var o=require("crypto-js");var s=require("eciesjs");require("exponential-backoff"),require("ses"),require("@endo/static-module-record");var i=require("http");var a=require("https");var c=require("url");var u=require("util");function d(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}function f(t){if(t&&t.__esModule)return t;var e=Object.create(null);return t&&Object.keys(t).forEach((function(n){if("default"!==n){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}})),e.default=t,Object.freeze(e)}var l=d(n);var p=d(r);var h=d(o);var g=f(s);var v=d(i);var b=d(a);var m=d(c);var y=d(u);function w(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(t);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(t,r[o])&&(n[r[o]]=t[r[o]])}return n}function x(t,e,n,r){return new(n||(n=Promise))((function(o,s){function i(t){try{c(r.next(t))}catch(t){s(t)}}function a(t){try{c(r.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,a)}c((r=r.apply(t,e||[])).next())}))}const{crypto:S}=t.Bitcoin;const O=(t,e)=>{const n=Date.now();const r=S.Hash.sha256(Buffer.from(e+n));const o=[S.ECDSA.sign(r,t,"big").toString("hex"),t.publicKey.toString(),n];return`Bearer ${Buffer.from(o.join(":")).toString("base64")}`};class T{constructor(t,e,n={}){this.baseUrl=t,this.headers=n,this.privateKey=e}get(t){return x(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:O(this.privateKey,this.baseUrl)}:{};return(yield l.default.get(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}post(t,e){return x(this,void 0,void 0,(function*(){const n=this.privateKey?{Authentication:O(this.privateKey,this.baseUrl)}:{};return(yield l.default.post(`${this.baseUrl}${t}`,e,{headers:Object.assign(Object.assign({},this.headers),n)})).data}))}delete(t){return x(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:O(this.privateKey,this.baseUrl)}:{};return(yield l.default.delete(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}}const C=process.env.CHAIN||"LTC";const B=process.env.NETWORK||"testnet";const _=process.env.BCN_URL||"https://node.bitcoincomputer.io";process.env.RPC_USER,process.env.RPC_PASSWORD;const P=parseInt(process.env.BC_DUST_LIMIT||"",10)||1546;parseInt(process.env.BC_DEFAULT_FEE||"",10),parseInt(process.env.BC_SCRIPT_CHUNK_SIZE||"",10);const I="";const{PublicKey:k,Mnemonic:A,crypto:$}=t.Bitcoin;const{Point:R}=$;function j(t){return Buffer.from(t,"hex").toString().replace(/\0/g,"")}function K(t,e){return t.slice(e)+t.slice(0,e)}function E(t,e,n){if(t.length*Math.log2(e)>53)throw new Error(`Input too large ${t.length} ${Math.log2(e)}`);if(![2,10,16].includes(e)||![2,10,16].includes(n))throw new Error("ToBase or FromBase invalid in covertNumber.");if(2===e&&t.length%8!=0)throw new Error("Binary strings must be byte aligned.");if(16===e&&t.length%2!=0)throw new Error("Hex strings must be of even length.");const r=parseInt(t,e).toString(n);return 2===n?r.padStart(8*Math.ceil(r.length/8),"0"):16===n?r.padStart(2*Math.ceil(r.length/2),"0"):r}function U(t,e){const n=new RegExp(`.{1,${e}}`,"g");return t.match(n)||[]}function D(t){return U(t,2).map((t=>E(t,16,2))).join("")}function q(t){return U(t,8).map((t=>E(t,2,16))).join("")}function H(t){return t.toString(16).padStart(3,"0")}function M(t){return parseInt(t,16)}function N(t){if(62!==t.length)throw new Error("Input to hexToPublicKey must be of length 62");let e=!1;let n=0;let r;for(;!e;){if(n>=256)throw new Error("Something went wrong storing data");const o=n.toString(16).padStart(2,"0")+q(K(D(t).padStart(64,"0"),n));try{r=R.fromX(!1,o),e=!0}catch(t){n+=1}}if(!r)throw new Error("Something went wrong storing data");return new k(r)}function F(t){const e=t.point.getX().toString("hex").padStart(64,"0");const n=E(e.slice(0,2),16,10);return q((o=parseInt(n,10),(r=D(e.slice(2))).slice(-o)+r.slice(0,-o)));var r,o}function L(t=C,e=B){if("testnet"===e||"regtest"===e)return 1;if("BTC"===t)return 0;if("LTC"===t)return 2;if("DOGE"===t)return 3;if("BCH"===t)return 145;if("BSV"===t)return 236;throw new Error(`Unsupported chain ${t}`)}function W({purpose:t=44,coinType:e=2,account:n=0}={}){return`m/${t.toString()}'/${e.toString()}'/${n.toString()}'`}function J(t=C,e=B){return W({coinType:L(t,e)})}function z(){return Math.round(Math.random()*Math.pow(2,31))}function G(t,e){const n=function(t,e){return((t,e,n={})=>{const{path:r="m/44'/0'/0'/0",passphrase:o=""}=n;let s=t.toHDPrivateKey(o,e);return r&&(s=s.derive(r)),s.privateKey})(new A("replace this seed"),e,{path:J(t,e),passphrase:""})}(t,e);return k.fromPrivateKey(n)}function Y({mnemonic:t=new A,path:e=J(),passphrase:n=I,network:r=B}){if(void 0!==t&&void 0!==e&&void 0!==n&&void 0!==r)return t.toHDPrivateKey(n,r).deriveChild(e);throw new Error(`Missing required parameters${JSON.stringify({mnemonic:t,path:e,passphrase:n,network:r})}`)}const{Transaction:V,Mnemonic:X}=t.Bitcoin;const{UnspentOutput:Q}=V;function Z(t){if(!/^[0-9A-Fa-f]{64}$/.test(t))throw new Error(`Invalid txId: ${t}`)}function tt(t){if(!/^[0-9A-Fa-f]{64}\/\d+$/.test(t))throw new Error(`Invalid outId: ${t}`)}function et(t){tt(t);const[e,n]=t.split("/");return{txId:e,outputIndex:parseInt(n,10)}}class nt{constructor(t={}){const{chain:e=C,network:n=B,mnemonic:r="",path:o=J(t.chain,t.network),passphrase:s=I,url:i=_}=t;this.chain=e.toUpperCase(),this.network=n.toLowerCase(),this.mnemonic=new X(r.toString()),this.path=o,this.passphrase=s,this.bcn=new T(i,this.privateKey)}get privateKey(){return Y(this).privateKey}getBalance(t){return x(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return yield this.bcn.get(`/v1/${e}/${n}/address/${t}/balance`)}))}getTransactions(t){return x(this,void 0,void 0,(function*(){return(yield this.getRawTxs(t)).map((t=>new V(t)))}))}getRawTxs(t){return x(this,void 0,void 0,(function*(){t.map(Z);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/tx/bulk/`,{txIds:t})}))}sendTransaction(t){return x(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/tx/send`,{rawTx:t})}))}getUtxosByAddress(t){return x(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return(yield this.bcn.get(`/v1/${e}/${n}/wallet/${t.toString()}/utxos`)).map((({rev:t,scriptPubKey:e,satoshis:n})=>{const[r,o]=t.split("/");return new Q({txId:r,outputIndex:parseInt(o,10),satoshis:n,script:e})}))}))}query({publicKey:t,classHash:e}){return x(this,void 0,void 0,(function*(){if(void 0===t&&void 0===e)throw new Error("Query parameters cannot be empty.");let n="";t&&(n+=`?publicKey=${t}`),e&&(n+=0===n.length?"?":"&",n+=`classHash=${e}`);const{chain:r,network:o}=this;return this.bcn.get(`/v1/${r}/${o}/non-standard-utxos${n}`)}))}idsToRevs(t){return x(this,void 0,void 0,(function*(){t.map(tt);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/revs`,{ids:t})}))}rpc(t,e){return x(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/rpc`,{method:t,params:e})}))}static getSecretOutput({_url:t,privateKey:e}){return x(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const o=n.slice(0,-2).join("/");const s=new T(o,e);return{host:o,data:yield s.get(`/v1/store/${r}`)}}))}static setSecretOutput({secretOutput:t,host:e,privateKey:n}){return x(this,void 0,void 0,(function*(){return new T(e,n).post("/v1/store/",t)}))}static deleteSecretOutput({_url:t,privateKey:e}){return x(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const o=n.slice(0,-2).join("/");const s=new T(o,e);yield s.delete(`/v1/store/${r}`)}))}get url(){return this.bcn.baseUrl}}const{PublicKey:rt,Script:ot}=t.Bitcoin;function st(t,e,n,r){if(t.length>3)throw new Error("Too many owners");return function(t,e,n,r){const o=r?[...t,G(e,n).toBuffer()]:t;const s=new ot;return s.add("OP_1"),o.forEach((t=>{s.add(t)})),s.add(`OP_${o.length}`),s.add("OP_CHECKMULTISIG"),s}(t.map((t=>t.toBuffer())),e,n,r)}function at(t,e){return function(t,e){const n=t.chunks.filter((t=>t.buf));return(e?n.slice(0,-1):n).map((t=>t.buf))}(t,e).map((t=>rt.fromBuffer(t)))}function ct(t){return Buffer.from(h.default.SHA256(t).toString(),"hex").toString("hex").substr(0,4)}function ut(t){return`${ct(t)};${t}`}function dt(t){const e=t.substr(0,4);const n=t.substr(5);if(!function(t,e){return ct(t)===e}(n,e))throw new Error("Decryption failure");return n}function ft(t){if(void 0!==t._readers){const{_readers:e,_url:n,_owners:r,_amount:o}=t,s=w(t,["_readers","_url","_owners","_amount"]);const i=function(t,e){const n=p.default.randomBytes(32).toString("hex");const r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");const r=ut(t);return h.default.AES.encrypt(r,n).toString()}(t,n);const o=e.map((t=>function(t,e){if(!/^0[2-3][0-9a-f]{64}|04[0-9a-f]{128}$/.test(e))throw new Error("Invalid publicKey");const n=ut(t);return g.encrypt(e,Buffer.from(n,"utf8")).toString("base64")}(n,t)));return{__cypher:r,__secrets:o}}(JSON.stringify(s),e);return void 0!==n&&(i._url=n),void 0!==r&&(i._owners=r),void 0!==o&&(i._amount=o),i}return t}const{Transaction:lt}=t.Bitcoin;const{Output:pt,UnspentOutput:ht}=lt;class gt{constructor({restClient:t=new nt}={}){this.tx=new lt,this.tx.feePerKb(2e4),this.outData=[],this.restClient=t}get txId(){return this.tx.id}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get inputs(){return this.tx.inputs.map((t=>`${t.prevTxId.toString("hex")}/${t.outputIndex}`))}get inRevs(){const{enc:t}=this;let[e]=t;return e=Number.isFinite(e)?e:0,this.tx.inputs.slice(0,e).map((({prevTxId:t,outputIndex:e})=>`${t.toString("hex")}/${e}`))}get outRevs(){const{enc:t}=this;let[,e]=t;return e=Number.isFinite(e)?e:0,Array.from(Array(e).keys()).map((t=>`${this.tx.id}/${t}`))}get opReturns(){try{const{outputs:t}=this.tx;return t.filter((({script:t})=>t.isDataOut())).map((({script:t})=>t.getData())).map((t=>t.toString())).join()}catch(t){return""}}get enc(){return U(this.opReturns.slice(0,9),3).map(M)}get dataPrefix(){return this.opReturns.slice(9)}isFullyFunded(){return this.tx._getInputAmount()-this.tx._getOutputAmount()>=this.tx.getFee()}getOwnerOutputs(){const{enc:t}=this;const[,e=0]=t;return this.tx.outputs.slice(0,e)}getDataOutputs(){const{enc:t}=this;const[,e,n]=t;return this.tx.outputs.slice(e,n)}getOutData(){return x(this,void 0,void 0,(function*(){try{const t=this.getDataOutputs().map((t=>t.script)).map((t=>at(t,!0))).flat().map(F).map(j).join("");const{dataPrefix:e}=this;const n=JSON.parse(e+t);const r=this.restClient.privateKey.toBuffer().toString("hex");const o=this.getOwnerOutputs();if(o.length!==n.length)throw new Error("Inconsistent state");const s=o.map(((t,e)=>Object.assign(Object.assign({},n[e]),{_owners:at(t.script,!1).map((t=>t.toString())),_amount:t.satoshis})));return Promise.all(s.map((t=>x(this,void 0,void 0,(function*(){try{const e=yield function(t){return e=>x(this,void 0,void 0,(function*(){if(function(t){return void 0!==t._url}(e)){const{_url:n}=e,r=w(e,["_url"]);const{host:o,data:s}=yield nt.getSecretOutput({_url:n,privateKey:t});return Object.assign(Object.assign(Object.assign({},r),JSON.parse(s)),{_url:o})}return e}))}(this.restClient.privateKey)(t);return function(t,e){if(function(t){return void 0!==t.__cypher&&void 0!==t.__secrets}(t)){const{__cypher:n,__secrets:r}=t,o=w(t,["__cypher","__secrets"]);return Object.assign(Object.assign(Object.assign({},o),JSON.parse(function({__cypher:t,__secrets:e},n){let r="";if(n.forEach((n=>{e.forEach((e=>{try{const o=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid privateKey");return dt(g.decrypt(e,Buffer.from(t,"base64")).toString("utf8"))}(e,n);r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");return dt(h.default.AES.decrypt(t,n).toString(h.default.enc.Utf8))}(t,o)}catch(t){const e=["Decryption failure","Unsupported state or unable to authenticate data"];if(t instanceof Error&&!e.includes(t.message))throw t}}))})),r)return r;throw new Error("Decryption failure")}({__cypher:n,__secrets:r},e))),{_readers:[]})}return t}(e,[r])}catch(t){return null}})))))}catch(t){return[]}}))}getOwners(){return this.getOwnerOutputs().map((t=>at(t.script,!1).map((t=>t.toString()))))}getAmounts(){return this.getOwnerOutputs().map((t=>t.satoshis))}spendFromData(e){return x(this,void 0,void 0,(function*(){if(!e.length)return;const n=e.map(et);const r=n.map((t=>t.txId));const o=yield this.restClient.getTransactions(r);for(let e=0;e<n.length;e+=1){const{txId:r,outputIndex:s}=n[e];const{outputs:i}=o[e];const a=i[s];const c=Math.round(a.satoshis);const u=new t.Bitcoin.Script(a.script);const d=new ht({txId:r,outputIndex:s,satoshis:c,script:u});const f=at(u,!1).map((t=>t.toString()));this.tx.from([d],f,1)}}))}createDataOuts(e){e.forEach((({_amount:e,_owners:n=[]})=>{if(Array.isArray(n)&&n.length>3)throw new Error("Too many owners.");const r=n.map((e=>t.Bitcoin.PublicKey.fromString(e)));const o=e||P;const s=st(r,this.chain,this.network,!1);this.tx.addOutput(new pt({script:s,satoshis:o}))}));const n=e.map((t=>w(t,["_amount","_owners"])));const r=P;const o=JSON.stringify(n);const s=o.slice(0,71);const i=function(t,e,n,r){var o;return function(t,e){const n=[];for(let e=0;e<t.length;e+=2)n.push(t.slice(e,e+2));return n}(U((o=t,Buffer.from(o).toString("hex")),62).map((t=>t.padStart(62,"0"))).map(N)).map((t=>st(t,e,n,!0)))}(o.slice(71),this.chain,this.network);const a=H(this.tx.inputs.length)+H(this.tx.outputs.length)+H(this.tx.outputs.length+i.length);i.forEach((t=>{this.tx.addOutput(new pt({script:t,satoshis:r}))})),this.tx.addData(a+s)}static fromTxHex({hex:t="",restClient:e=new nt}){return x(this,void 0,void 0,(function*(){let n=[];let r=[];let o=[];const s=new this({restClient:e});s.tx.fromString(t);try{n=yield s.getOutData()}catch(t){}try{r=s.getOwners()}catch(t){}try{o=s.getAmounts()}catch(t){}return s.outData=n.map(((t,e)=>Object.assign(Object.assign({},t),{_owners:r[e],_amount:o[e]}))),s}))}static fromTxId({txId:t="",restClient:e=new nt}){return x(this,void 0,void 0,(function*(){const[n]=yield e.getRawTxs([t]);return this.fromTxHex({hex:n,restClient:e})}))}}class vt{constructor(t={}){this.restClient=new nt(t)}derive(t="0"){const e=`${this.path}${this.path.length>0?"/":""}${t}`;const{chain:n,network:r,url:o,mnemonic:s,passphrase:i}=this.restClient;return new vt({chain:n,network:r,url:o,mnemonic:s.toString(),path:e,passphrase:i})}getBalance(){return x(this,void 0,void 0,(function*(){return this.restClient.getBalance(this.address)}))}getUtxosByAmount(t){return x(this,void 0,void 0,(function*(){const e=yield this.restClient.getUtxosByAddress(this.address);let n=0;const r=[];!function(t){const e=t;for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}(e);for(const o of e)if(n+=o.satoshis,r.push(o),n>=t)return r;const{network:o,chain:s}=this.restClient;const i=this.address.toString();throw new Error(`Insufficient balance in address ${i} on ${o} ${s}. Found ${n}, required ${t}.`)}))}fundAndSendTx(e){return x(this,void 0,void 0,(function*(){e.tx.feePerKb(4e4);const n=e.tx.outputs.length;const{chain:r,network:o}=this.restClient;e.tx.to(function(t,e){const n={"any-testnet":"uTKUDCkpo12vstJBsMWmrTPz9wFE6DuzGH","BTC-mainnet":"igpnnoLziUyxtQuWYCP13gHYVhUru6iLaY","LTC-mainnet":"t77o829ngHnuUorwDkf129fL6ERLFNqKG8","DOGE-mainnet":"XfNRUdvrv6uCDbCF5xJ18UYwVkkefkXvEd","BCH-mainnet":"CSAkkS8Mro9mYRqhksS1FyYrsnSE5MVQ5m"};return K("testnet"===e||"regtest"===e?n["any-testnet"]:n[`${t}-${e}`],19)}(r,o),0);const s=yield this.restClient.getUtxosByAddress(this.address);if(e.tx.change(this.address),0===s.length)throw new Error(`Insufficient balance in address ${this.address}.`);let i=0;let a=0;let c=0;do{const[n]=s.splice(0,1);e.tx.from([new t.Bitcoin.Transaction.UnspentOutput(n)]),e.tx.sign(this.privateKey,1),a=e.tx.toString().length,e.tx.fee(2e4*a*2),e.tx._updateChangeOutput(),c=e.tx._getInputAmount()-e.tx._getOutputAmount(),i=c/a*1e3}while(0!==s.length&&i<4e4);if(i<4e4&&0===s.length)throw new Error(`Insufficient balance in address ${this.address}. Current fee_per_kb ${i}. Fee ${c}. Utxo set size ${s.length}. CTransaction size ${a} Inputs ${JSON.stringify(e.tx.inputs,null,2)} Outpus ${JSON.stringify(e.tx.outputs,null,2)}`);if(a=e.tx.toString().length,c=Math.ceil(a/1e3*2e4),e.tx.fee(c),e.tx.outputs[n].satoshis=c,e.tx._outputAmount=void 0,e.tx.feePerKb(2e4),e.tx._outputAmount=void 0,e.tx._updateChangeOutput(),!1===e.isFullyFunded()||!1===e.tx.verify())throw new Error(`Something went wrong. Address ${this.address}. Transaction: ${JSON.stringify(e.tx,null,2)}`);return e.tx.sign(this.privateKey,1),this.restClient.sendTransaction(e.tx.toString())}))}send(t,e){return x(this,void 0,void 0,(function*(){const{restClient:n}=this;const r=new gt({restClient:n});return r.tx.to(e,t),this.fundAndSendTx(r)}))}get hdPrivateKey(){return Y(this.restClient)}get privateKey(){return this.hdPrivateKey.privateKey}get publicKey(){return this.hdPrivateKey.publicKey}get passphrase(){return this.restClient.passphrase}get path(){return this.restClient.path}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get url(){return this.restClient.url}get mnemonic(){return this.restClient.mnemonic}get address(){return this.publicKey.toAddress(this.restClient.network)}}class bt{constructor(t={}){this.wallet=new vt(t)}fromTxHex(t){return x(this,void 0,void 0,(function*(){const{restClient:e}=this.wallet;return gt.fromTxHex({hex:t,restClient:e})}))}fromTxId(t){return x(this,void 0,void 0,(function*(){const[e]=yield this.wallet.restClient.getRawTxs([t]);return this.fromTxHex(e)}))}get(t){return x(this,void 0,void 0,(function*(){const e=t.map(et);return Promise.all(e.map((({txId:t,outputIndex:e})=>x(this,void 0,void 0,(function*(){const{outData:n}=yield this.fromTxId(t);if(e>n.length)throw new Error("Index out of bounds");return n[e]})))))}))}put(t){return this.update([],t)}createTx(t,e){return x(this,void 0,void 0,(function*(){const{wallet:n}=this;const{restClient:r}=n;const o=new gt({restClient:r});const{privateKey:s,publicKey:i}=n;const a=e.map((t=>{var{_owners:e}=t,n=w(t,["_owners"]);return Object.assign({_owners:e||[i.toString()]},n)})).map(ft);const c=yield Promise.all(a.map(function(t){return e=>x(this,void 0,void 0,(function*(){if(void 0!==e._url){const{_url:n,_owners:r,_amount:o}=e,s=w(e,["_url","_owners","_amount"]);const i=yield nt.setSecretOutput({host:n,secretOutput:{data:JSON.stringify(s)},privateKey:t});return void 0!==r&&(i._owners=r),void 0!==o&&(i._amount=o),i}return e}))}(s)));return yield o.spendFromData(t),yield o.createDataOuts(c),o}))}update(t,e){return x(this,void 0,void 0,(function*(){const n=yield this.createTx(t,e);return yield this.wallet.fundAndSendTx(n),n.outRevs}))}}var mt=v.default;var yt=b.default;var wt=m.default;function xt(t){"string"==typeof t&&(t=function(t){var e=wt.parse(t);var n=e.hostname;var r=parseInt(e.port,10);var o=e.protocol;o=o.substring(0,o.length-1);var s=e.auth.split(":");return{host:n,port:r,protocol:o,user:s[0]?decodeURIComponent(s[0]):null,pass:s[1]?decodeURIComponent(s[1]):null}}(t)),t=t||{},this.host=t.host||"127.0.0.1",this.port=t.port||8332,this.user=t.user||"user",this.pass=t.pass||"pass",this.protocol="http"===t.protocol?mt:yt,this.batchedCalls=null,this.disableAgent=t.disableAgent||!1;var e=void 0!==t.rejectUnauthorized;this.rejectUnauthorized=!e||t.rejectUnauthorized,xt.config.log?this.log=xt.config.log:this.log=xt.loggers[xt.config.logger||"normal"]}var St=console.log.bind(console);var Ot=function(){};function Tt(t,e){var n=this;t=JSON.stringify(t);var r=this.user+":"+this.pass;var o=Buffer.from&&Buffer.from!==Uint8Array.from?Buffer.from(r):new Buffer(r);this.auth=o.toString("base64");var s={host:n.host,path:"/",method:"POST",port:n.port,rejectUnauthorized:n.rejectUnauthorized,agent:!n.disableAgent&&void 0};if(n.httpOptions)for(var i in n.httpOptions)s[i]=n.httpOptions[i];var a=!1;var c="Bitcoin JSON-RPC: ";var u=this.protocol.request(s,(function(t){var r="";t.on("data",(function(t){r+=t})),t.on("end",(function(){if(!a)if(a=!0,401!==t.statusCode)if(403!==t.statusCode){if(500===t.statusCode&&"Work queue depth exceeded"===r.toString("utf8")){var o=new Error("Bitcoin JSON-RPC: "+r.toString("utf8"));return o.code=429,void e(o)}var s;try{s=JSON.parse(r)}catch(o){n.log.err(o.stack),n.log.err(r),n.log.err("HTTP Status code:"+t.statusCode);var i=new Error(c+"Error Parsing JSON: "+o.message);return void e(i)}e(s.error,s)}else e(new Error(c+"Connection Rejected: 403 Forbidden"));else e(new Error(c+"Connection Rejected: 401 Unnauthorized"))}))}));u.on("error",(function(t){var n=new Error(c+"Request Error: "+t.message);a||(a=!0,e(n))})),u.setHeader("Content-Length",t.length),u.setHeader("Content-Type","application/json"),u.setHeader("Authorization","Basic "+n.auth),u.write(t),u.end()}xt.loggers={none:{info:Ot,warn:Ot,err:Ot,debug:Ot},normal:{info:St,warn:St,err:St,debug:Ot},debug:{info:St,warn:St,err:St,debug:St}},xt.config={logger:"normal"},xt.prototype.batch=function(t,e){this.batchedCalls=[],t(),Tt.call(this,this.batchedCalls,e),this.batchedCalls=null},xt.callspec={abandonTransaction:"str",abortRescan:"",addMultiSigAddress:"",addNode:"",analyzePSBT:"str",backupWallet:"",bumpFee:"str",clearBanned:"",combinePSBT:"obj",combineRawTransaction:"obj",convertToPSBT:"str",createMultiSig:"",createPSBT:"obj",createRawTransaction:"obj obj",createWallet:"str",decodePSBT:"str",decodeScript:"str",decodeRawTransaction:"",deriveAddresses:"str",disconnectNode:"",dumpPrivKey:"",dumpWallet:"str",encryptWallet:"",enumerateSigners:"",estimateFee:"",estimateSmartFee:"int str",estimatePriority:"int",generate:"int",generateBlock:"str obj",generateToAddress:"int str",generateToDescriptor:"int str",getAccount:"",getAccountAddress:"str",getAddedNodeInfo:"",getAddressMempool:"obj",getAddressUtxos:"obj",getAddressBalance:"obj",getAddressDeltas:"obj",getAddressesByLabel:"str",getAddressInfo:"str",getAddressTxids:"obj",getAddressesByAccount:"",getBalance:"str int",getBalances:"",getBestBlockHash:"",getBlockDeltas:"str",getBlock:"str int",getBlockchainInfo:"",getBlockCount:"",getBlockFilter:"str",getBlockHashes:"int int obj",getBlockHash:"int",getBlockHeader:"str",getBlockNumber:"",getBlockStats:"str",getBlockTemplate:"",getConnectionCount:"",getChainTips:"",getChainTxStats:"",getDescriptorInfo:"str",getDifficulty:"",getGenerate:"",getHashesPerSec:"",getIndexInfo:"",getInfo:"",getMemoryInfo:"",getMemoryPool:"",getMemPoolAncestors:"str",getMemPoolDescendants:"str",getMemPoolEntry:"str",getMemPoolInfo:"",getMiningInfo:"",getNetTotals:"",getNetworkHashPS:"",getNetworkInfo:"",getNewAddress:"str str",getNodeAddresses:"",getPeerInfo:"",getRawChangeAddress:"",getRawMemPool:"bool",getRawTransaction:"str int",getReceivedByAccount:"str int",getReceivedByAddress:"str int",getReceivedByLabel:"str",getRpcInfo:"",getSpentInfo:"obj",getTransaction:"",getTxOut:"str int bool",getTxOutProof:"",getTxOutSetInfo:"",getUnconfirmedBalance:"",getWalletInfo:"",getWork:"",getZmqNotifications:"",finalizePSBT:"str",fundRawTransaction:"str",help:"",importAddress:"str str bool",importDescriptors:"str",importMulti:"obj obj",importPrivKey:"str str bool",importPrunedFunds:"str, str",importPubKey:"str",importWallet:"str",invalidateBlock:"str",joinPSBTs:"obj",keyPoolRefill:"",listAccounts:"int",listAddressGroupings:"",listBanned:"",listDescriptors:"",listLabels:"",listLockUnspent:"bool",listReceivedByAccount:"int bool",listReceivedByAddress:"int bool",listReceivedByLabel:"",listSinceBlock:"str int",listTransactions:"str int int",listUnspent:"int int",listWalletDir:"",listWallets:"",loadWallet:"str",lockUnspent:"",logging:"",move:"str str float int str",ping:"",preciousBlock:"str",prioritiseTransaction:"str float int",pruneBlockChain:"int",psbtBumpFee:"str",removePrunedFunds:"str",reScanBlockChain:"",saveMemPool:"",send:"obj",setHDSeed:"",setLabel:"str str",setWalletFlag:"str",scanTxOutSet:"str",sendFrom:"str str float int str str",sendMany:"str obj int str",sendRawTransaction:"str",sendToAddress:"str float str str",setAccount:"",setBan:"str str",setNetworkActive:"bool",setGenerate:"bool int",setTxFee:"float",signMessage:"",signMessageWithPrivKey:"str str",signRawTransaction:"",signRawTransactionWithKey:"str obj",signRawTransactionWithWallet:"str",stop:"",submitBlock:"str",submitHeader:"str",testMemPoolAccept:"obj",unloadWallet:"",upgradeWallet:"",uptime:"",utxoUpdatePSBT:"str",validateAddress:"",verifyChain:"",verifyMessage:"",verifyTxOutProof:"str",walletCreateFundedPSBT:"",walletDisplayAddress:"str",walletLock:"",walletPassPhrase:"string int",walletPassphraseChange:"",walletProcessPSBT:"str"};var Ct=function(t,e,n){return Array.prototype.slice.call(t,e,n)};function Bt(){return parseInt(1e5*Math.random())}!function(t,e,n){function r(t,e){return function(){var r=arguments.length-1;this.batchedCalls&&(r=arguments.length);for(var o=0;o<r;o++)e[o]&&(arguments[o]=e[o](arguments[o]));this.batchedCalls?this.batchedCalls.push({jsonrpc:"2.0",method:t,params:Ct(arguments),id:Bt()}):n.call(this,{method:t,params:Ct(arguments,0,arguments.length-1),id:Bt()},arguments[arguments.length-1])}}var o={str:function(t){return t.toString()},int:function(t){return parseFloat(t)},float:function(t){return parseFloat(t)},bool:function(t){return!0===t||"1"==t||"true"==t||"true"==t.toString().toLowerCase()},obj:function(t){return"string"==typeof t?JSON.parse(t):t}};for(var s in e){var i=[];if(e[s].length){i=e[s].split(" ");for(var a=0;a<i.length;a++)o[i[a]]?i[a]=o[i[a]]:i[a]=o.str}var c=s.toLowerCase();t.prototype[s]=r(c,i),t.prototype[c]=t.prototype[s]}}(xt,xt.callspec,Tt);var _t=xt;const Pt=new _t({protocol:process.env.RPC_PROTOCOL,user:process.env.RPC_USER,pass:process.env.RPC_PASSWORD,host:process.env.RPC_HOST,port:process.env.RPC_PORT});y.default.promisify(_t.prototype.createwallet.bind(Pt)),y.default.promisify(_t.prototype.getaddressinfo.bind(Pt)),y.default.promisify(_t.prototype.getBlock.bind(Pt)),y.default.promisify(_t.prototype.getBlockchainInfo.bind(Pt)),y.default.promisify(_t.prototype.getBlockHash.bind(Pt)),y.default.promisify(_t.prototype.generateToAddress.bind(Pt)),y.default.promisify(_t.prototype.getRawTransaction.bind(Pt)),y.default.promisify(_t.prototype.importaddress.bind(Pt)),y.default.promisify(_t.prototype.listunspent.bind(Pt)),y.default.promisify(_t.prototype.sendRawTransaction.bind(Pt));const{Opcode:It,Script:kt,Mnemonic:At,crypto:$t,Transaction:Rt,encoding:jt}=t.Bitcoin;function Kt(t=0){return function(t=0){return function(t=0){return new At(function(t=0){return"travel upgrade inside soda birth essence junk merit never twenty system opinion;toddler hockey salute wheel harvest video narrow riot guitar lake sea call;cannon hour begin test replace fury motion squirrel envelope announce neck culture".split(";")[t]}(t))}().toHDPrivateKey("",B).derive(function({chain:t=C,network:e=B,account:n=z()}={}){return W({account:n,coinType:L(t,e)})}({account:t}))}(t).privateKey}function Et(t=0){return function(t=0){return Kt(t).toPublicKey()}(t).toAddress()}function Ut(e=1e5,n=0){const r=kt.buildPublicKeyHashOut(Et(n));return{address:Et(n),txId:"a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458",outputIndex:n,script:r,vout:0,amount:e/1e8,satoshis:e,scriptPubKey:"",inspect:()=>"",toObject:()=>new t.Bitcoin.Transaction.UnspentOutput({})}}const{PrivateKey:Dt,PublicKey:qt,Transaction:Ht}=t.Bitcoin;const Mt=new Dt;describe("Db",(()=>{describe("to",(()=>{it("should add a p2sh output",(()=>{const t=new gt;t.tx.to(Et(),P),e.expect(t.chain).eq(C),e.expect(t.network).eq(B),e.expect(t.tx).to.not.be.undefined,e.expect(t.inputs).to.deep.eq([]),e.expect(t.outData).to.deep.eq([]),e.expect(t.opReturns).to.deep.eq("")}))})),describe("fromTxHex",(()=>{const t=new bt;it("should return an empty array if opReturn is not set",(()=>x(void 0,void 0,void 0,(function*(){const n=new gt;n.tx.from([new Ht.UnspentOutput(Ut())]),n.tx.to(Et(),P),n.tx.sign(Kt(),1);const r=yield t.fromTxHex(n.tx.toString());e.expect(r.opReturns).to.deep.eq("")})))),it("should work for a transaction with a data output",(()=>x(void 0,void 0,void 0,(function*(){const t={a:1,_owners:[qt.fromPrivateKey(Mt).toString()],_amount:P};const n=new bt;const r=new gt;r.createDataOuts([t]),r.tx.from([new Ht.UnspentOutput(Ut())]),r.tx.sign(Kt(),1);const o=r.tx.toString();const{inputs:s,inRevs:i,outRevs:a,opReturns:c,outData:u,txId:d,tx:f}=yield n.fromTxHex(o);e.expect(f).to.not.be.undefined,e.expect(f.inputs).to.not.be.undefined,e.expect(f.outputs).to.not.be.undefined,e.expect(f.outputs[0].satoshis).to.not.be.undefined,e.expect(f.outputs[0].script).to.not.be.undefined,e.expect(f.version).to.not.be.undefined,e.expect(f.nLockTime).to.not.be.undefined,e.expect(s).to.deep.eq(["a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458/0"]),e.expect(i).to.deep.eq([]),e.expect(a).to.deep.eq([`${r.tx.id}/0`]),e.expect(c).to.deep.eq('000001001[{"a":1}]'),e.expect(u).to.deep.eq([t]),e.expect(d).eq(r.tx.id)})))),it("should work for a transaction with another invalid output script",(()=>x(void 0,void 0,void 0,(function*(){const{inputs:n,inRevs:r,outRevs:o,opReturns:s,outData:i,txId:a}=yield t.fromTxHex("0100000001cbf75e37f8f57f338dd435d564c7302a02d9c6d03e26c8f0f24fa46052c0c0d1010000008b48304502210095cf913f96c52242b3a88dc59a9aed2a568dc80446541348c89c5430727d548402206adbe00b00db7d71458b990ab69090a038244a6b94faca98652656fd0b9be4e4014104dac5c4da1fd483b8655ab6a5d8e5dd2226ef20d1023d7ff38df29bfa8fcfdf73fb99a07efa0c66112c1fa438a8ed8571364bc04f21eaadf54c4918d43aba8ed3ffffffff02804f1200000000001976a914d40f073684cfac11be0366dc6a56a8d3cc87ece488ac1027000000000000044e6f6e6500000000");e.expect(n).to.deep.eq(["d1c0c05260a44ff2f0c8263ed0c6d9022a30c764d535d48d337ff5f8375ef7cb/1"]),e.expect(r).to.deep.eq([]),e.expect(o).to.deep.eq([]),e.expect(i).to.deep.eq([]),e.expect(s).to.deep.eq(""),e.expect(a).to.deep.eq("ad0a426817666f56d5b4fba97177f455bbfba3b80faca32a58ae9f947896ec68")})))),it("should work for a coinbase transactions",(()=>x(void 0,void 0,void 0,(function*(){const n=yield Promise.all(["01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0b03c58c01062f503253482fffffffff0386600f27010000001976a914dde4906f870df11cf316b15adb628a3c3cc9883988ac8ab8f60200000000434104ffd03de44a6e11b9917f3a29f9443283d9871c9d743ef30d5eddcd37094b64d1b3d8090496b53256786bf5c82932ec23c3b74d9f05a6f95a8b5529352656664bac00000000000000002a6a28e73cd21eb4ac1eb1ba3767f4bf12be98935656451df3d6dee34c125662bcd599000000000000010000000000","020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff03530101ffffffff0200f2052a010000001976a9141eb941d36faa46404c7fbf6e22364e39cb66641f88ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000","020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff04016b0101ffffffff0200f2052a010000001976a9147c012a0d8fefc443441b169d9a82edc3221e647a88ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000"].map((e=>t.fromTxHex(e))));for(let t=0;t<n.length;t+=1){const{inputs:r,inRevs:o,outRevs:s,opReturns:i,outData:a,txId:c}=n[t];e.expect(r).to.be.an("array").that.has.length(1),e.expect(o).to.deep.eq([]),e.expect(s).to.deep.eq([]),e.expect(a).to.deep.eq([]),e.expect(i).to.be.string,e.expect(c).to.be.string}}))))}))}));
