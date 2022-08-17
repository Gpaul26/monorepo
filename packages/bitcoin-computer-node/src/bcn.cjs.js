"use strict";
var t = require("body-parser");
var e = require("cors");
var r = require("express");
var s = require("http");
var a = require("zeromq");
var n = require("express-rate-limit");
var o = require("dotenv");
var i = require("is-primitive");
var c = require("is-plain-object");
var l = require("fs");
var d = require("os");
var u = require("winston");
var p = require("bitcoin-computer-bitcore");
var f = require("pg-promise");
var y = require("pg-monitor");
var h = require("exponential-backoff");
var g = require("bitcoind-rpc");
var m = require("util");
var S = require("elliptic");
var v = require("hash.js");
var w = require("path");
function E(t) {
  return t && "object" == typeof t && "default" in t ? t : { default: t };
}
function T(t) {
  if (t && t.__esModule) return t;
  var e = Object.create(null);
  return (
    t &&
      Object.keys(t).forEach(function (r) {
        if ("default" !== r) {
          var s = Object.getOwnPropertyDescriptor(t, r);
          Object.defineProperty(
            e,
            r,
            s.get
              ? s
              : {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }
          );
        }
      }),
    (e.default = t),
    Object.freeze(e)
  );
}
var R = E(t);
var O = E(e);
var b = E(r);
var $ = E(s);
var _ = T(a);
var P = E(n);
var N = E(o);
var x = E(i);
var C = E(c);
var A = E(l);
var I = E(d);
var j = E(f);
var H = E(y);
var M = E(g);
var L = E(m);
var B = E(v);
var D = E(w);
const { deleteProperty: k } = Reflect;
const U = x.default;
const F = C.default;
const G = (t) => ("object" == typeof t && null !== t) || "function" == typeof t;
const W = (t) => {
  if (!U(t)) throw new TypeError("Object keys must be strings or symbols");
  if (((t) => "__proto__" === t || "constructor" === t || "prototype" === t)(t))
    throw new Error(`Cannot set unsafe key: "${t}"`);
};
const q = (t, e) =>
  e && "function" == typeof e.split
    ? e.split(t)
    : "symbol" == typeof t
    ? [t]
    : Array.isArray(t)
    ? t
    : ((t, e, r) => {
        const s = ((t) =>
          Array.isArray(t) ? t.flat().map(String).join(",") : t)(
          e
            ? ((t, e) => {
                if ("string" != typeof t || !e) return t;
                let r = t + ";";
                return (
                  void 0 !== e.arrays && (r += `arrays=${e.arrays};`),
                  void 0 !== e.separator && (r += `separator=${e.separator};`),
                  void 0 !== e.split && (r += `split=${e.split};`),
                  void 0 !== e.merge && (r += `merge=${e.merge};`),
                  void 0 !== e.preservePaths &&
                    (r += `preservePaths=${e.preservePaths};`),
                  r
                );
              })(t, e)
            : t
        );
        W(s);
        const a = V.cache.get(s) || r();
        return V.cache.set(s, a), a;
      })(t, e, () =>
        ((t, e = {}) => {
          const r = e.separator || ".";
          const s = "/" !== r && e.preservePaths;
          if ("string" == typeof t && !1 !== s && /\//.test(t)) return [t];
          const a = [];
          let n = "";
          const o = (t) => {
            let e;
            "" !== t.trim() && Number.isInteger((e = Number(t)))
              ? a.push(e)
              : a.push(t);
          };
          for (let e = 0; e < t.length; e++) {
            const s = t[e];
            "\\" !== s
              ? s !== r
                ? (n += s)
                : (o(n), (n = ""))
              : (n += t[++e]);
          }
          return n && o(n), a;
        })(t, e)
      );
const K = (t, e, r, s) => {
  if ((W(e), void 0 === r)) k(t, e);
  else if (s && s.merge) {
    const a = "function" === s.merge ? s.merge : Object.assign;
    a && F(t[e]) && F(r) ? (t[e] = a(t[e], r)) : (t[e] = r);
  } else t[e] = r;
  return t;
};
const V = (t, e, r, s) => {
  if (!e || !G(t)) return t;
  const a = q(e, s);
  let n = t;
  for (let t = 0; t < a.length; t++) {
    const e = a[t];
    const o = a[t + 1];
    if ((W(e), void 0 === o)) {
      K(n, e, r, s);
      break;
    }
    "number" != typeof o || Array.isArray(n[e])
      ? (G(n[e]) || (n[e] = {}), (n = n[e]))
      : (n = n[e] = []);
  }
  return t;
};
(V.split = q),
  (V.cache = new Map()),
  (V.clear = () => {
    V.cache = new Map();
  });
var Y = V;
var z = A.default;
var J =
  "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
    ? function (t) {
        return typeof t;
      }
    : function (t) {
        return t &&
          "function" == typeof Symbol &&
          t.constructor === Symbol &&
          t !== Symbol.prototype
          ? "symbol"
          : typeof t;
      };
var Z =
  "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
    ? function (t) {
        return typeof t;
      }
    : function (t) {
        return t &&
          "function" == typeof Symbol &&
          t.constructor === Symbol &&
          t !== Symbol.prototype
          ? "symbol"
          : typeof t;
      };
var Q = (function () {
  function t(t, e) {
    for (var r = 0; r < e.length; r++) {
      var s = e[r];
      (s.enumerable = s.enumerable || !1),
        (s.configurable = !0),
        "value" in s && (s.writable = !0),
        Object.defineProperty(t, s.key, s);
    }
  }
  return function (e, r, s) {
    return r && t(e.prototype, r), s && t(e, s), e;
  };
})();
var X = function t(e, r) {
    var s = r.indexOf(".");
    if (!~s) {
      if (null == e) return;
      return e[r];
    }
    var a = r.substring(0, s),
      n = r.substring(s + 1);
    if (null != e) return (e = e[a]), n ? t(e, n) : e;
  },
  tt = Y,
  et = function (t, e) {
    if ("function" != typeof e) return JSON.parse(z.readFileSync(t));
    z.readFile(t, "utf-8", function (t, r) {
      try {
        r = JSON.parse(r);
      } catch (e) {
        t = t || e;
      }
      e(t, r);
    });
  },
  rt = A.default,
  st = I.default;
var at = (function () {
  function t(e, r) {
    !(function (t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    })(this, t),
      (this.options = r = r || {}),
      (r.stringify_width = r.stringify_width || 2),
      (r.stringify_fn = r.stringify_fn || null),
      (r.stringify_eol = r.stringify_eol || !1),
      (r.ignore_dots = r.ignore_dots || !1),
      (this.path = e),
      (this.data = this.read());
  }
  return (
    Q(t, [
      {
        key: "set",
        value: function (t, e, r) {
          var s = this;
          return (
            "object" === (void 0 === t ? "undefined" : Z(t))
              ? (function (t, e) {
                  var r = 0,
                    s = [];
                  if (Array.isArray(t))
                    for (; r < t.length && !1 !== e(t[r], r); ++r);
                  else if (
                    "object" === (void 0 === t ? "undefined" : J(t)) &&
                    null !== t
                  )
                    for (
                      s = Object.keys(t);
                      r < s.length && !1 !== e(t[s[r]], s[r]);
                      ++r
                    );
                })(t, function (t, e) {
                  tt(s.data, e, t, r);
                })
              : this.options.ignore_dots
              ? (this.data[t] = e)
              : tt(this.data, t, e, r),
            this.options.autosave && this.save(),
            this
          );
        },
      },
      {
        key: "get",
        value: function (t) {
          return t
            ? this.options.ignore_dots
              ? this.data[t]
              : X(this.data, t)
            : this.toObject();
        },
      },
      {
        key: "unset",
        value: function (t) {
          return this.set(t, void 0);
        },
      },
      {
        key: "append",
        value: function (t, e) {
          var r = this.get(t);
          if (((r = void 0 === r ? [] : r), !Array.isArray(r)))
            throw new Error("The data is not an array!");
          return r.push(e), this.set(t, r), this;
        },
      },
      {
        key: "pop",
        value: function (t) {
          var e = this.get(t);
          if (!Array.isArray(e)) throw new Error("The data is not an array!");
          return e.pop(), this.set(t, e), this;
        },
      },
      {
        key: "read",
        value: function (t) {
          if (!t)
            try {
              return et(this.path);
            } catch (t) {
              return {};
            }
          et(this.path, function (e, r) {
            t(null, (r = e ? {} : r));
          });
        },
      },
      {
        key: "write",
        value: function (t, e) {
          return (
            e ? rt.writeFile(this.path, t, e) : rt.writeFileSync(this.path, t),
            this
          );
        },
      },
      {
        key: "empty",
        value: function (t) {
          return this.write("{}", t);
        },
      },
      {
        key: "save",
        value: function (t) {
          var e = JSON.stringify(
            this.data,
            this.options.stringify_fn,
            this.options.stringify_width,
            this.options.stringify_eol
          );
          return (
            this.write(this.options.stringify_eol ? e + st.EOL : e, t), this
          );
        },
      },
      {
        key: "toObject",
        value: function () {
          return this.data;
        },
      },
    ]),
    t
  );
})();
N.default.config();
const nt = (function (t, e) {
  return new at(t, { stringify_eol: !0 });
})(`${__dirname}/../../package.json`);
const {
  PORT: ot = "3000",
  ZMQ_URL: it = "tcp://litecoind:28332",
  CHAIN: ct = "LTC",
  NETWORK: lt = "regtest",
  BCN_ENV: dt = "dev",
  BCN_URL: ut = "http://127.0.0.1:3000",
  DEBUG_MODE: pt = "1",
  POSTGRES_USER: ft = "bcn",
  POSTGRES_PASSWORD: yt = "bcn",
  POSTGRES_DB: ht = "bcn",
  POSTGRES_HOST: gt = "127.0.0.1",
  POSTGRES_PORT: mt = "5432",
  RPC_PROTOCOL: St = "http",
  RPC_USER: vt = "bcn-admin",
  RPC_PASSWORD: wt = "kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=",
  RPC_HOST: Et = "litecoind",
  RPC_PORT: Tt = "19332",
  TESTING: Rt = !1,
  DEFAULT_WALLET: Ot = "defaultwallet",
} = process.env;
const bt = process.env.ALLOWED_RPC_METHODS
  ? process.env.ALLOWED_RPC_METHODS.split(",").map((t) => new RegExp(t))
  : [];
const $t = nt.get("version");
var _t = {
  PORT: parseInt(ot, 10),
  ZMQ_URL: it,
  CHAIN: ct,
  NETWORK: lt,
  BCN_ENV: dt,
  BCN_URL: ut,
  DEBUG_MODE: parseInt(pt, 10),
  POSTGRES_USER: ft,
  POSTGRES_PASSWORD: yt,
  POSTGRES_DB: ht,
  POSTGRES_HOST: gt,
  POSTGRES_PORT: parseInt(mt, 10),
  POSTGRES_MAX_PARAM_NUM: 1e4,
  RPC_PROTOCOL: St,
  RPC_USER: vt,
  RPC_PASSWORD: wt,
  RPC_HOST: Et,
  RPC_PORT: parseInt(Tt, 10),
  SYNC_HEIGHT: 1,
  SYNC_INTERVAL_CHECK: 3e3,
  SERVER_VERSION: $t,
  TESTING: JSON.parse(Rt.toString()),
  DB_CONNECTION_RETRY_TIME: 500,
  SIGNATURE_FRESHNESS_MINUTES: 3,
  DEFAULT_WALLET: Ot,
  ALLOWED_RPC_METHODS: bt,
};
const { DEBUG_MODE: Pt } = _t;
const Nt = u.createLogger({
  level: ["error", "warn", "info", "http", "verbose", "debug", "silly"][Pt],
  format: u.format.json(),
  transports: [
    new u.transports.Console({
      format: u.format.combine(
        u.format.colorize(),
        u.format.timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
        u.format.printf((t) => `[2m${t.timestamp}[0m ${t.level} ${t.message}`)
      ),
    }),
  ],
  exceptionHandlers: [
    new u.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new u.transports.File({ filename: "logs/rejections.log" }),
  ],
});
const xt = { maxFiles: 1, maxSize: 1e5 };
Pt >= 0 &&
  Nt.add(new u.transports.File({ filename: "error.log", level: "error" })),
  Pt >= 1 &&
    Nt.add(
      new u.transports.File({ filename: "logs/warn.log", level: "warn", ...xt })
    ),
  Pt >= 2 &&
    Nt.add(
      new u.transports.File({ filename: "logs/info.log", level: "info", ...xt })
    ),
  Pt >= 3 &&
    Nt.add(
      new u.transports.File({ filename: "logs/http.log", level: "http", ...xt })
    ),
  Pt >= 4 &&
    Nt.add(
      new u.transports.File({
        filename: "logs/verbose.log",
        level: "verbose",
        ...xt,
      })
    ),
  Pt >= 5 &&
    Nt.add(
      new u.transports.File({
        filename: "logs/debug.log",
        level: "debug",
        ...xt,
      })
    );
const Ct = () => "dev" === _t.BCN_ENV;
const At = () => _t.DEBUG_MODE >= 6;
const It = (t, e) => {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    const a = Object.keys(s);
    let n = !1;
    for (let t = 0; t < e.length; t++) {
      const r = e[t];
      const o = Object.keys(r);
      if (
        a.length === o.length &&
        a.every((t) => o.includes(t)) &&
        a.every((t) => s[t] === r[t])
      ) {
        n = !0;
        break;
      }
    }
    if (!n) return !1;
  }
  return !0;
};
const jt = (t) =>
  new Promise((e) => {
    setTimeout(e, t);
  });
const Ht = (t, e) => Object.assign(new Array(e).fill(null), t);
const {
  POSTGRES_HOST: Mt,
  POSTGRES_PORT: Lt,
  POSTGRES_DB: Bt,
  POSTGRES_USER: Dt,
  POSTGRES_PASSWORD: kt,
  DB_CONNECTION_RETRY_TIME: Ut,
} = _t;
const Ft = {
  error: (t, e) => {
    if (e.cn) {
      const { host: r, port: s, database: a, user: n, password: o } = e.cn;
      Nt.debug(
        `Waiting for db to start { message:${t.message} host:${r}, port:${s}, database:${a}, user:${n}, password: ${o}`
      );
    }
  },
  noWarnings: !0,
};
Ct() &&
  _t.DEBUG_MODE > 0 &&
  (H.default.isAttached()
    ? H.default.detach()
    : (H.default.attach(Ft), H.default.setTheme("matrix")));
const Gt = j.default(Ft)({
  host: Mt,
  port: Lt,
  database: Bt,
  user: Dt,
  password: kt,
  allowExitOnIdle: !0,
  idleTimeoutMillis: 100,
});
class Wt {
  static async select(t) {
    const e = new f.PreparedStatement({
      name: `OffChain.select.${Math.random()}`,
      text: 'SELECT "data" FROM "OffChain" WHERE "id" = $1',
      values: [t],
    });
    return Gt.oneOrNone(e);
  }
  static async insert({ id: t, data: e }) {
    const r = new f.PreparedStatement({
      name: `OffChain.insert.${Math.random()}`,
      text: 'INSERT INTO "OffChain" ("id", "data") VALUES ($1, $2) ON CONFLICT DO NOTHING',
      values: [t, e],
    });
    return Gt.none(r);
  }
  static async delete(t) {
    const e = new f.PreparedStatement({
      name: `OffChain.delete.${Math.random()}`,
      text: 'WITH deleted AS (DELETE FROM "OffChain" WHERE "id" = $1 RETURNING *) SELECT count(*) FROM deleted;',
      values: [t],
    });
    return (await Gt.any(e))[0].count > 0;
  }
}
class qt {
  static async select(t) {
    const e = await Wt.select(t);
    return (null == e ? void 0 : e.data) || null;
  }
  static async insert(t) {
    return Wt.insert(t);
  }
  static async delete(t) {
    return Wt.delete(t);
  }
}
const { crypto: Kt } = p.Bitcoin;
const Vt = b.default.Router();
Vt.get("/:id", async ({ params: { id: t }, url: e, method: r }, s) => {
  void 0 === s.locals.authToken &&
    (Nt.error(`Authorization failed at ${r} ${e}.`),
    s.status(403).json({ error: `Authorization failed at ${r} ${e}.` }));
  try {
    const e = await qt.select(t);
    e
      ? s.status(200).json(e)
      : s.status(403).json({ error: "No entry found." });
  } catch (t) {
    Nt.error(`GET ${e} failed with error '${t.message}'`),
      s.status(500).json({ error: t.message });
  }
}),
  Vt.post("/", async (t, e) => {
    const {
      body: { data: r },
      url: s,
    } = t;
    try {
      const s = Kt.Hash.sha256(Buffer.from(r)).toString("hex");
      await qt.insert({ id: s, data: r });
      const a = `${t.protocol}://${t.get("host")}/store/${s}`;
      e.status(201).json({ _url: a });
    } catch (t) {
      Nt.error(`POST ${s} failed with error '${t.message}'`),
        e.status(500).json({ error: t.message });
    }
  }),
  Vt.delete("/:id", async ({ params: { id: t }, url: e, method: r }, s) => {
    Ct() ||
      (Nt.error(`Authorization failed at ${r} ${e}.`),
      s.status(403).json({ error: `Authorization failed at ${r} ${e}.` }));
    try {
      (await qt.delete(t))
        ? s.status(204).send()
        : s.status(403).json({ error: "No entry found." });
    } catch (t) {
      Nt.error(`DELETE ${e} failed with error '${t.message}'`),
        s.status(500).json({ error: t.message });
    }
  });
class Yt {
  static async select() {
    return Gt.one(
      'SELECT "syncedHeight", "bitcoindSyncedHeight", "bitcoindSyncedProgress" FROM "Sync"'
    );
  }
  static async update({
    syncedHeight: t,
    bitcoindSyncedHeight: e,
    bitcoindSyncedProgress: r,
  }) {
    const s = new f.PreparedStatement({
      name: `Sync.update.${Math.random()}`,
      text: 'UPDATE "Sync" SET "syncedHeight" = $1, "bitcoindSyncedHeight" = $2, "bitcoindSyncedProgress" = $3',
      values: [t, e, r],
    });
    await Gt.any(s);
  }
}
var zt = async () =>
  class {
    static async select() {
      return Yt.select();
    }
    static async update(t) {
      await Yt.update(t);
    }
  }.select();
const Jt = {
  protocol: _t.RPC_PROTOCOL,
  user: _t.RPC_USER,
  pass: _t.RPC_PASSWORD,
  host: _t.RPC_HOST,
  port: _t.RPC_PORT,
};
const Zt = new M.default(Jt);
const Qt = {
  createwallet: L.default.promisify(M.default.prototype.createwallet.bind(Zt)),
  generateToAddress: L.default.promisify(
    M.default.prototype.generateToAddress.bind(Zt)
  ),
  getaddressinfo: L.default.promisify(
    M.default.prototype.getaddressinfo.bind(Zt)
  ),
  getBlock: L.default.promisify(M.default.prototype.getBlock.bind(Zt)),
  getBlockchainInfo: L.default.promisify(
    M.default.prototype.getBlockchainInfo.bind(Zt)
  ),
  getBlockHash: L.default.promisify(M.default.prototype.getBlockHash.bind(Zt)),
  getRawTransaction: L.default.promisify(
    M.default.prototype.getRawTransaction.bind(Zt)
  ),
  getTransaction: L.default.promisify(
    M.default.prototype.getTransaction.bind(Zt)
  ),
  importaddress: L.default.promisify(
    M.default.prototype.importaddress.bind(Zt)
  ),
  listunspent: L.default.promisify(M.default.prototype.listunspent.bind(Zt)),
  sendRawTransaction: L.default.promisify(
    M.default.prototype.sendRawTransaction.bind(Zt)
  ),
};
class Xt {
  static async select(t) {
    const e = new f.PreparedStatement({
      name: `Standard.select.${Math.random()}`,
      text: 'SELECT "address", "satoshis", "scriptPubKey", "rev" FROM "Standard" WHERE "address" = $1 AND "spent" = FALSE',
      values: [t],
    });
    return (await Gt.any(e)).map((t) => ({
      ...t,
      satoshis: parseInt(t.satoshis, 10),
    }));
  }
  static async insert(t) {
    const e = t.flatMap((t) => [
      t.rev,
      t.address,
      t.satoshis,
      t.scriptPubKey,
      !1,
    ]);
    for (; e.length; ) {
      const t = e.splice(0, _t.POSTGRES_MAX_PARAM_NUM);
      const r = [];
      for (let e = 1; e <= t.length; e += 5)
        r.push(`($${e}, $${e + 1}, $${e + 2}, $${e + 3}, $${e + 4})`);
      const s = r.join(",");
      const a = new f.PreparedStatement({
        name: `Standard.insert.${Math.random()}`,
        text: `INSERT INTO "Standard"("rev", "address", "satoshis", "scriptPubKey", "spent") VALUES ${s}  ON CONFLICT DO NOTHING`,
        values: t,
      });
      await Gt.none(a);
    }
  }
  static async update(t) {
    const e = t.flatMap((t) => [
      `${t.prevTxId.toString("hex")}/${t.outputIndex}`,
    ]);
    if (0 === e.length) return [];
    const r = [];
    for (let t = 1; t <= e.length; t += 1) r.push(`("rev" = $${t})`);
    const s = r.join(" OR ");
    const a = new f.PreparedStatement({
      name: `Standard.update.${Math.random()}`,
      text: `UPDATE "Standard" SET "spent" = TRUE WHERE ${s} RETURNING "rev"`,
      values: e,
    });
    return Gt.any(a);
  }
  static async getBalance(t) {
    const e = new f.PreparedStatement({
      name: `Standard.getBalance.${Math.random()}`,
      text: 'SELECT SUM("satoshis") FROM "Standard" WHERE "address" = $1 AND "spent" = FALSE',
      values: [t],
    });
    const r = await Gt.oneOrNone(e);
    return parseInt(null == r ? void 0 : r.sum, 10) || 0;
  }
}
class te {
  static async select(t) {
    return (await Xt.select(t)).map((t) => ({
      ...t,
      amount: t.satoshis / 1e8,
    }));
  }
  static async getBalance(t) {
    return Xt.getBalance(t);
  }
  static async insert(t) {
    const e = t.map((t) => ({
      rev: `${t.txId}/${t.outputIndex}`,
      address: t.address.toString("legacy"),
      satoshis: t.satoshis,
      scriptPubKey: t.script.toHex(),
      spent: !1,
    }));
    return Xt.insert(e);
  }
}
const { Script: ee, Transaction: re } = p.Bitcoin;
const { Transaction: se } = p.Bitcoin;
const { Input: ae } = se;
class ne {
  static async query(t) {
    const { publicKey: e, classHash: r } = t;
    if (void 0 === e && void 0 === r) return [];
    let s =
      'SELECT "rev"\n      FROM "NonStandard"\n      WHERE "spent" = FALSE';
    const a = [];
    e && (a.push(e), (s += ' AND $1 = ANY ("publicKeys")')),
      r && (a.push(r), (s += ` AND "classHash" = $${a.length}`));
    const n = new f.PreparedStatement({
      name: `NonStandard.query.${Math.random()}`,
      text: s,
      values: a,
    });
    return (await Gt.any(n)).map((t) => t.rev);
  }
  static async insert({ id: t, rev: e, publicKeys: r, classHash: s }) {
    const a = new f.PreparedStatement({
      name: `NonStandard.insert.${Math.random()}`,
      text: 'INSERT INTO "NonStandard"("id", "rev", "publicKeys", "classHash", "spent") VALUES ($1, $2, $3, $4, FALSE) ON CONFLICT DO NOTHING',
      values: [t, e, r, s],
    });
    await Gt.none(a);
  }
  static async update(t) {
    const e = new f.PreparedStatement({
      name: `NonStandard.update.${Math.random()}`,
      text: 'UPDATE "NonStandard" SET "spent" = TRUE WHERE "rev" = $1 AND "spent" = FALSE',
      values: [t],
    });
    return Gt.none(e);
  }
  static async getRevsByIds(t) {
    const e = new f.PreparedStatement({
      name: `NonStandard.getRevsByIds.${Math.random()}`,
      text: 'SELECT "rev" FROM "NonStandard" WHERE "id" LIKE ANY($1) AND "spent" = FALSE',
      values: [[t]],
    });
    return Gt.any(e);
  }
  static async select(t) {
    const e = new f.PreparedStatement({
      name: `NonStandard.select.${Math.random()}`,
      text: 'SELECT "id", "classHash" FROM "NonStandard" WHERE "rev" = $1',
      values: [t],
    });
    return Gt.oneOrNone(e);
  }
}
class oe {
  static async select(t) {
    return ne.select(t);
  }
  static async query(t) {
    return ne.query(t);
  }
  static async getRevsByIds(t) {
    return ne.getRevsByIds(t);
  }
  static async insert(t) {
    return ne.insert(t);
  }
  static async update(t) {
    return ne.update(t);
  }
}
const { crypto: ie } = p.Bitcoin;
class ce {
  static async getTransaction(t) {
    const { result: e } = await Qt.getTransaction(t);
    return e;
  }
  static async getBulkTransactions(t) {
    return (await Promise.all(t.map((t) => Qt.getRawTransaction(t)))).map(
      (t) => t.result
    );
  }
  static async sendRawTransaction(t) {
    const { result: e, error: r } = await Qt.sendRawTransaction(t);
    if (r) throw (Nt.error(r), new Error("Error sending transaction"));
    return e;
  }
}
var le = async (t) => await ce.getBulkTransactions(t);
const { Computer: de } = _t.TESTING
  ? require("@bitcoin-computer/lib-testing")
  : require("@bitcoin-computer/lib");
const { CHAIN: ue, NETWORK: pe, BCN_URL: fe } = _t;
const ye = new de({ chain: ue, network: pe, url: fe });
const he = (t) =>
  t.tx.inputs
    .map((t) =>
      p.Bitcoin.Transaction.Input.fromObject({ ...t, script: t._scriptBuffer })
    )
    .filter((t) => !t.isNull());
const ge = async (t) => {
  const e = he(t);
  if (e.length > 0) {
    const r = await (async (t) => {
      const e = he(t);
      let r = [];
      return (
        e.length > 0 &&
          (r = await (async (t) => {
            const e = await class {
              static async areSpent(t) {
                return class {
                  static async areSpent(t) {
                    const e = t
                      .map(
                        (t) =>
                          `('${t.prevTxId.toString("hex")}/${t.outputIndex}')`
                      )
                      .join(",");
                    const r = new f.PreparedStatement({
                      name: `Utxos.areSpent.${Math.random()}`,
                      text: `SELECT "rev", "stSpent", "nstSpent" from "Utxos"  WHERE "rev" IN (${e})`,
                    });
                    return Gt.any(r);
                  }
                }.areSpent(t);
              }
            }.areSpent(t);
            return e;
          })(e)),
        r
      );
    })(t);
    const s = e.flatMap((t) => {
      const e = `${t.prevTxId.toString("hex")}/${t.outputIndex}`;
      return r.some((t) => t.rev === e) ? [] : [t];
    });
    await Promise.all(
      s.map(async (t) => {
        try {
          Nt.info(`Repairing input:${t.prevTxId.toString("hex")}`);
          const [e] = await le([t.prevTxId.toString("hex")]);
          const r = await ye.db.fromTxHex(e);
          await ge(r),
            Nt.info(
              `Repaired successfully input:${t.prevTxId.toString("hex")}`
            );
        } catch (e) {
          Nt.error(
            `Error on repair input:${t.prevTxId.toString("hex")}: ${e.message}`
          );
        }
      })
    );
  }
  await (async (t, e) => {
    const r = t.flatMap((t, r) => {
      const s = ee.fromBuffer(t._scriptBuffer);
      const { PUBKEYHASH_OUT: a, SCRIPTHASH_OUT: n } = ee.types;
      if (![a, n].includes(s.classify())) return [];
      const o = s.toAddress(_t.NETWORK).toString("legacy");
      const i = s.toHex();
      const c = t.satoshis / 1e8;
      const l = Math.round(t.satoshis);
      return [
        new re.UnspentOutput({
          address: o,
          txId: e,
          outputIndex: r,
          scriptPubKey: i,
          amount: c,
          satoshis: l,
        }),
      ];
    });
    await te.insert(r);
  })(t.tx.outputs, t.txId),
    await (async (t) => {
      const e = t
        .map((t) => ae.fromObject({ ...t, script: t._scriptBuffer }))
        .filter((t) => !t.isNull());
      return Xt.update(e);
    })(t.tx.inputs);
  const { inRevs: r = [], outRevs: s = [], outData: a = [] } = t;
  await (async (t, e, r) => {
    const s = Math.max(t.length, e.length);
    const a = Ht(t, s);
    const n = Ht(e, s);
    const o = ((i = n), a.map((t, e) => [t, i[e]]));
    var i;
    await Promise.all(
      o.map(async ([t, e], s) => {
        const { __cls: a = "", _owners: n = [] } = r[s] || {};
        if (null === t && e)
          return (
            /^[0-9A-Fa-f]{64}\/\d+$/.test(e),
            void (await oe.insert({
              id: e,
              rev: e,
              publicKeys: n,
              classHash: ie.Hash.sha256(Buffer.from(a)).toString("hex"),
            }))
          );
        if (e && t) {
          const { id: r = "", classHash: s = "" } = (await oe.select(t)) || {};
          await oe.insert({ id: r, classHash: s, rev: e, publicKeys: n }),
            await oe.update(t);
        }
      })
    );
  })(r, s, a);
};
const me = async (t) => {
  try {
    const e = t.toString("hex");
    Nt.info(`ZMQ message { rawTx:${e} }`),
      "dev" === _t.BCN_ENV &&
        A.default.appendFileSync("zmqlog.log", `${e} \r\n`);
    const r = await ye.db.fromTxHex(e);
    try {
      await ge(r);
    } catch (t) {
      Nt.error(`Error parsing transaction ${t.message} ${t.stack}`);
    }
  } catch (t) {
    Nt.error(`RawTxSubscriber failed with error '${t.message} ${t.stack}'`);
  }
};
var Se = async (t) => te.select(t);
var ve = async (t) => (
  void 0 === (await Qt.getaddressinfo(t)).result.timestamp &&
    (Nt.info(`Importing address: ${t}`), await Qt.importaddress(t, !1)),
  (await Qt.listunspent(0, 999999, [t])).result
);
const we = {
  protocol: _t.RPC_PROTOCOL,
  user: _t.RPC_USER,
  pass: _t.RPC_PASSWORD,
  host: _t.RPC_HOST,
  port: _t.RPC_PORT,
};
const Ee = new M.default(we);
const Te = {};
const Re = JSON.parse(JSON.stringify(M.default.callspec));
Object.keys(Re).forEach((t) => {
  Re[t.toLowerCase()] = Re[t];
});
const Oe = {
  str: (t) => t.toString(),
  string: (t) => t.toString(),
  int: (t) => parseFloat(t),
  float: (t) => parseFloat(t),
  bool: (t) =>
    !0 === t ||
    "1" === t ||
    1 === t ||
    "true" === t ||
    "true" === t.toString().toLowerCase(),
  obj: (t) => ("string" == typeof t ? JSON.parse(t) : t),
};
try {
  Object.keys(M.default.prototype).forEach((t) => {
    if (t && "function" == typeof M.default.prototype[t]) {
      const e = t.toLowerCase();
      (Te[t] = L.default.promisify(M.default.prototype[t].bind(Ee))),
        (Te[e] = L.default.promisify(M.default.prototype[e].bind(Ee)));
    }
  });
} catch (t) {
  Nt.error(`Error occurred while binding RPC methods: ${t.message}`);
}
const be = new S.ec("secp256k1");
const $e = b.default();
let _e;
try {
  _e = $.default.createServer($e);
} catch (t) {
  throw (Nt.error(`Starting server failed with error '${t.message}'`), t);
}
if (
  (Nt.info(`Server listening on port ${_t.PORT}`),
  $e.use(O.default()),
  "dev" !== _t.BCN_ENV)
) {
  const t = P.default({
    windowMs: 9e5,
    max: 300,
    standardHeaders: !0,
    legacyHeaders: !1,
  });
  $e.use(t);
}
$e.use(R.default.json({ limit: "100mb" })),
  $e.use(R.default.urlencoded({ limit: "100mb", extended: !0 })),
  $e.use(async (t, e, r) => {
    try {
      const s = t.get("Authentication");
      if (!s) return void r();
      const a = ((t) => {
        const e = t.split(" ");
        if (2 !== e.length || "Bearer" !== e[0])
          throw new Error("Authentication header is invalid.");
        const r = Buffer.from(e[1], "base64").toString().split(":");
        if (3 !== r.length) throw new Error();
        return {
          signature: r[0],
          publicKey: r[1],
          timestamp: parseInt(r[2], 10),
        };
      })(s);
      const { signature: n, publicKey: o, timestamp: i } = a;
      if (Date.now() - i > 1e3 * _t.SIGNATURE_FRESHNESS_MINUTES * 60)
        return void e.status(401).json({ error: "Signature is too old." });
      const c = B.default
        .sha256()
        .update(_t.BCN_URL + i)
        .digest("hex");
      if (!be.keyFromPublic(o, "hex").verify(c, n))
        return void e.status(401).json({
          error: "The origin and public key pair doesn't match the signature.",
        });
      (e.locals.authToken = a), r();
    } catch (t) {
      Nt.error(`Auth failed with error '${t.message}'`),
        e.status(401).json({ error: t.message });
    }
  }),
  $e.use(({ url: t }, e, r) => {
    if (void 0 !== e.locals.authToken)
      try {
        let t;
        try {
          const e = Ct() ? "bcn.test.config.json" : "bcn.config.json";
          t = A.default.readFileSync(D.default.join(__dirname, "..", "..", e));
        } catch (t) {
          if (t.message.includes("ENOENT: no such file or directory"))
            return void r();
          throw (Nt.error(`Access-list failed with error '${t.message}'`), t);
        }
        const { blacklist: s, whitelist: a } = JSON.parse(t.toString());
        if (s && a)
          return void e.status(403).json({
            error: "Cannot enforce blacklist and whitelist at the same time.",
          });
        const { publicKey: n } = e.locals.authToken;
        if ((a && !a.includes(n)) || (s && s.includes(n)))
          return void e
            .status(403)
            .json({ error: `Public key ${n} is not allowed.` });
        r();
      } catch (r) {
        Nt.error(`Authorization failed at ${t} with error: '${r.message}'`),
          e.status(403).json({ error: r.message });
      }
    else r();
  });
const Pe = (() => {
  const t = b.default.Router();
  return (
    t.get("/wallet/:address/utxos", async ({ params: t, url: e }, r) => {
      try {
        const { address: e } = t;
        const s = await Se(e);
        const a = s.map(({ satoshis: t, rev: e }) => {
          const [r, s] = e.split("/");
          return { amount: t / 1e8, txid: r, vout: parseInt(s, 10) };
        });
        if (At()) {
          let t = [];
          let r = !1;
          let s = 10;
          do {
            try {
              (t = (await ve(e)) || []), (r = !0);
            } catch (t) {
              Nt.debug(`Retrying to get utxos '${t.message}'`),
                await jt(1e3),
                (s -= 1);
            }
          } while (!r && s > 0);
          const n = t.map(({ amount: t, txid: e, vout: r }) => ({
            amount: t,
            txid: e,
            vout: r,
          }));
          It(a, n) ||
            (Nt.error(
              `Inconsistency on UTXO set calculation for address ${e}.`
            ),
            Nt.error(
              `db utxos ${JSON.stringify(
                a,
                null,
                2
              )} rpc utxos ${JSON.stringify(n, null, 2)}`
            ),
            Nt.error(
              `db utxos length ${a.length} rpc utxos length: ${n.length}`
            ));
        }
        r.status(200).json(s);
      } catch (t) {
        Nt.error(`GET ${e} failed with error '${t.message}'`),
          r.status(404).json({ error: t.message });
      }
    }),
    t.get("/non-standard-utxos", async ({ query: t, url: e }, r) => {
      try {
        const e = await (async (t) => oe.query(t))(t);
        r.status(200).json(e);
      } catch (t) {
        Nt.error(`GET ${e} failed with error '${t.messages}'`),
          r.status(404).json({ error: t.message });
      }
    }),
    t.get("/address/:address/balance", async ({ params: t, url: e }, r) => {
      try {
        const { address: s } = t;
        const a = await Se(s);
        const n = await (async (t) => te.getBalance(t))(s);
        const o = a.map(({ satoshis: t, rev: e }) => {
          const [r, s] = e.split("/");
          return { amount: t / 1e8, txid: r, vout: parseInt(s, 10) };
        });
        if (At()) {
          let t = [];
          let r = !1;
          let a = 10;
          do {
            try {
              (t = (await ve(s)) || []), (r = !0);
            } catch (t) {
              Nt.debug(`Retrying ${e} getStandardUtxosAction: ${t.message}`),
                await jt(1e3),
                (a -= 1);
            }
          } while (!r && a > 0);
          const i = 1e8 * t.reduce((t, e) => t + e.amount, 0);
          const c = t.map(({ amount: t, txid: e, vout: r }) => ({
            amount: t,
            txid: e,
            vout: r,
          }));
          (n === Math.round(i) && It(o, c)) ||
            (Nt.error(
              `Inconsistency on balance calculation for address ${s}: dbBalance ${n} rpcBalance: ${i}`
            ),
            Nt.error(`db utxos ${o}`),
            Nt.error(`rpc utxos: ${JSON.stringify(o)}`));
        }
        r.status(200).json(n);
      } catch (t) {
        Nt.error(`GET ${e} failed with error '${t.message}'`),
          r.status(404).json({ error: t.message });
      }
    }),
    t.post("/tx/bulk", async ({ body: { txIds: t }, url: e }, r) => {
      try {
        if (void 0 === t || 0 === t.length)
          return void r.status(500).json({ error: "Missing input txIds." });
        const e = await le(t);
        e ? r.status(200).json(e) : r.status(404).json({ error: "Not found" });
      } catch (t) {
        Nt.error(`POST ${e} failed with error '${t.message}'`),
          r.status(500).json({ error: t.message });
      }
    }),
    t.post("/tx/send", async ({ body: { rawTx: t }, url: e }, r) => {
      try {
        const e = await (async (t) => ce.sendRawTransaction(t))(t);
        await me(t), r.status(200).json(e);
      } catch (t) {
        Nt.error(`POST ${e} failed with error '${t.message}'`),
          r.status(500).json({ error: t.message });
      }
    }),
    t.post("/revs", async ({ body: { ids: t }, url: e }, r) => {
      try {
        if (void 0 === t || 0 === t.length)
          return void r
            .status(404)
            .json({ error: "Missing input object ids." });
        const e = await (async (t) =>
          (await oe.getRevsByIds(t)).map((t) => t.rev))(t);
        r.status(200).json(e);
      } catch (t) {
        Nt.error(`POST ${e} failed with error '${t.message}'`),
          r.status(404).json({ error: t.message });
      }
    }),
    t.post("/rpc", async ({ body: t, url: e }, r) => {
      try {
        if (!t || !t.method)
          throw new Error("Please provide appropriate RPC method name");
        if (!_t.ALLOWED_RPC_METHODS.some((e) => e.test(t.method)))
          throw new Error("Method is not allowed");
        const e = (function (t, e) {
          if (void 0 === Re[t] || null === Re[t])
            throw new Error("This RPC method does not exist, or not supported");
          const r = e.trim().split(" ");
          const s = Re[t].trim().split(" ");
          if (0 === e.trim().length && 0 !== Re[t].trim().length)
            throw new Error(
              `Too few params provided. Expected ${s.length} Provided 0`
            );
          if (0 !== e.trim().length && 0 === Re[t].trim().length)
            throw new Error(
              `Too many params provided. Expected 0 Provided ${r.length}`
            );
          if (r.length < s.length)
            throw new Error(
              `Too few params provided. Expected ${s.length} Provided ${r.length}`
            );
          if (r.length > s.length)
            throw new Error(
              `Too many params provided. Expected ${s.length} Provided ${r.length}`
            );
          return 0 === e.length ? [] : r.map((t, e) => Oe[s[e]](t));
        })(t.method, t.params);
        const s = e.length ? await Te[t.method](...e) : await Te[t.method]();
        return void r.status(200).json({ result: s });
      } catch (t) {
        Nt.error(`POST ${e} failed with error '${t.message}'`),
          r.status(404).json({ error: t.message });
      }
    }),
    t.post("/non-standard-utxo", async (t, e) => {
      e.status(500).json({
        error:
          "Please upgrade to @bitcoin-computer/lib-testing@0.7.7.0-beta or greater.",
      });
    }),
    t.get("/tx/:txId", async ({ params: t }, e) => {
      const { txId: r } = t;
      const [s] = await le([r]);
      s ? e.status(200).json(s) : e.status(404).json({ error: "Not found" });
    }),
    t
  );
})();
$e.use(`/v1/${_t.CHAIN}/${_t.NETWORK}`, Pe),
  $e.use("/v1/store", Vt),
  $e.get("/", (t, e) => e.status(200).send("OK")),
  $e.get("/health", (t, e) => e.status(200).send("healthy")),
  $e.get("/version", (t, e) => e.status(200).send(_t.SERVER_VERSION)),
  _e.listen(_t.PORT, () => {
    Nt.info(`Rev ${_t.SERVER_VERSION} Started web server on port ${_t.PORT}`);
  });
const Ne = new _.Subscriber();
Ne.connect(_t.ZMQ_URL),
  Ne.subscribe("rawtx"),
  Nt.info(`ZMQ Subscriber connected to ${_t.ZMQ_URL}`),
  (async () => {
    await (async () => {
      await h.backOff(() => Gt.connect(), { startingDelay: Ut });
    })(),
      await (async (t) => {
        try {
          await (async () => {
            try {
              await Qt.createwallet(_t.DEFAULT_WALLET);
            } catch (t) {
              Nt.debug(`Wallet creation failed with error '${t.message}'`);
            }
          })(),
            "regtest" !== _t.NETWORK &&
              (await (async () => {
                let t = -1;
                let e = -1;
                let r = 0;
                Nt.info("Checking sync progress...syncedHeight: -1 from -1");
                do {
                  ({
                    syncedHeight: t,
                    bitcoindSyncedHeight: e,
                    bitcoindSyncedProgress: r,
                  } = await zt()),
                    t > 0
                      ? Nt.info(
                          `Sync progress ${t}/${e} blocks [${(
                            (t / e) *
                            100
                          ).toFixed(4)}% (bitcoind progress: ${(
                            100 * r
                          ).toFixed(4)}%)]`
                        )
                      : Nt.info(
                          `Sync progress initializing... ${t}/${e} blocks `
                        ),
                    await jt(_t.SYNC_INTERVAL_CHECK);
                } while (t < e || r < 0.999);
                Nt.info(
                  `BCN reaches sync end...currentBlockHeight: ${t} from ${e} (chain progress: ${(
                    100 * r
                  ).toFixed(4)})`
                );
              })()),
            _t.TESTING
              ? Nt.info(
                  `Bitcoin Computer Node is ready on testing ${_t.SERVER_VERSION}`
                )
              : Nt.info(`Bitcoin Computer Node is ready ${_t.SERVER_VERSION}`);
          for await (const [, e] of t) await me(e);
        } catch (t) {
          Nt.error(`ZMQ subscription failed with error '${t.message}'`);
        }
      })(Ne);
  })();
