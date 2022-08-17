"use strict";
var t = require("exponential-backoff");
var e = require("dotenv");
var n = require("is-primitive");
var r = require("is-plain-object");
var s = require("fs");
var a = require("os");
var o = require("winston");
var i = require("bitcoind-rpc");
var c = require("util");
var l = require("pg-promise");
var d = require("pg-monitor");
var u = require("bitcoin-computer-bitcore");
function p(t) {
  return t && "object" == typeof t && "default" in t ? t : { default: t };
}
var f = p(e);
var y = p(n);
var h = p(r);
var S = p(s);
var g = p(a);
var m = p(i);
var v = p(c);
var E = p(l);
var b = p(d);
const { deleteProperty: R } = Reflect;
const T = y.default;
const O = h.default;
const w = (t) => ("object" == typeof t && null !== t) || "function" == typeof t;
const _ = (t) => {
  if (!T(t)) throw new TypeError("Object keys must be strings or symbols");
  if (((t) => "__proto__" === t || "constructor" === t || "prototype" === t)(t))
    throw new Error(`Cannot set unsafe key: "${t}"`);
};
const P = (t, e) =>
  e && "function" == typeof e.split
    ? e.split(t)
    : "symbol" == typeof t
    ? [t]
    : Array.isArray(t)
    ? t
    : ((t, e, n) => {
        const r = ((t) =>
          Array.isArray(t) ? t.flat().map(String).join(",") : t)(
          e
            ? ((t, e) => {
                if ("string" != typeof t || !e) return t;
                let n = t + ";";
                return (
                  void 0 !== e.arrays && (n += `arrays=${e.arrays};`),
                  void 0 !== e.separator && (n += `separator=${e.separator};`),
                  void 0 !== e.split && (n += `split=${e.split};`),
                  void 0 !== e.merge && (n += `merge=${e.merge};`),
                  void 0 !== e.preservePaths &&
                    (n += `preservePaths=${e.preservePaths};`),
                  n
                );
              })(t, e)
            : t
        );
        _(r);
        const s = $.cache.get(r) || n();
        return $.cache.set(r, s), s;
      })(t, e, () =>
        ((t, e = {}) => {
          const n = e.separator || ".";
          const r = "/" !== n && e.preservePaths;
          if ("string" == typeof t && !1 !== r && /\//.test(t)) return [t];
          const s = [];
          let a = "";
          const o = (t) => {
            let e;
            "" !== t.trim() && Number.isInteger((e = Number(t)))
              ? s.push(e)
              : s.push(t);
          };
          for (let e = 0; e < t.length; e++) {
            const r = t[e];
            "\\" !== r
              ? r !== n
                ? (a += r)
                : (o(a), (a = ""))
              : (a += t[++e]);
          }
          return a && o(a), s;
        })(t, e)
      );
const N = (t, e, n, r) => {
  if ((_(e), void 0 === n)) R(t, e);
  else if (r && r.merge) {
    const s = "function" === r.merge ? r.merge : Object.assign;
    s && O(t[e]) && O(n) ? (t[e] = s(t[e], n)) : (t[e] = n);
  } else t[e] = n;
  return t;
};
const $ = (t, e, n, r) => {
  if (!e || !w(t)) return t;
  const s = P(e, r);
  let a = t;
  for (let t = 0; t < s.length; t++) {
    const e = s[t];
    const o = s[t + 1];
    if ((_(e), void 0 === o)) {
      N(a, e, n, r);
      break;
    }
    "number" != typeof o || Array.isArray(a[e])
      ? (w(a[e]) || (a[e] = {}), (a = a[e]))
      : (a = a[e] = []);
  }
  return t;
};
($.split = P),
  ($.cache = new Map()),
  ($.clear = () => {
    $.cache = new Map();
  });
var H = $;
var A = S.default;
var C =
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
var I =
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
var B = (function () {
  function t(t, e) {
    for (var n = 0; n < e.length; n++) {
      var r = e[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(t, r.key, r);
    }
  }
  return function (e, n, r) {
    return n && t(e.prototype, n), r && t(e, r), e;
  };
})();
var M = function t(e, n) {
    var r = n.indexOf(".");
    if (!~r) {
      if (null == e) return;
      return e[n];
    }
    var s = n.substring(0, r),
      a = n.substring(r + 1);
    if (null != e) return (e = e[s]), a ? t(e, a) : e;
  },
  x = H,
  k = function (t, e) {
    if ("function" != typeof e) return JSON.parse(A.readFileSync(t));
    A.readFile(t, "utf-8", function (t, n) {
      try {
        n = JSON.parse(n);
      } catch (e) {
        t = t || e;
      }
      e(t, n);
    });
  },
  D = S.default,
  L = g.default;
var F = (function () {
  function t(e, n) {
    !(function (t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    })(this, t),
      (this.options = n = n || {}),
      (n.stringify_width = n.stringify_width || 2),
      (n.stringify_fn = n.stringify_fn || null),
      (n.stringify_eol = n.stringify_eol || !1),
      (n.ignore_dots = n.ignore_dots || !1),
      (this.path = e),
      (this.data = this.read());
  }
  return (
    B(t, [
      {
        key: "set",
        value: function (t, e, n) {
          var r = this;
          return (
            "object" === (void 0 === t ? "undefined" : I(t))
              ? (function (t, e) {
                  var n = 0,
                    r = [];
                  if (Array.isArray(t))
                    for (; n < t.length && !1 !== e(t[n], n); ++n);
                  else if (
                    "object" === (void 0 === t ? "undefined" : C(t)) &&
                    null !== t
                  )
                    for (
                      r = Object.keys(t);
                      n < r.length && !1 !== e(t[r[n]], r[n]);
                      ++n
                    );
                })(t, function (t, e) {
                  x(r.data, e, t, n);
                })
              : this.options.ignore_dots
              ? (this.data[t] = e)
              : x(this.data, t, e, n),
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
              : M(this.data, t)
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
          var n = this.get(t);
          if (((n = void 0 === n ? [] : n), !Array.isArray(n)))
            throw new Error("The data is not an array!");
          return n.push(e), this.set(t, n), this;
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
              return k(this.path);
            } catch (t) {
              return {};
            }
          k(this.path, function (e, n) {
            t(null, (n = e ? {} : n));
          });
        },
      },
      {
        key: "write",
        value: function (t, e) {
          return (
            e ? D.writeFile(this.path, t, e) : D.writeFileSync(this.path, t),
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
            this.write(this.options.stringify_eol ? e + L.EOL : e, t), this
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
f.default.config();
const U = new F(`${__dirname}/../../package.json`, { stringify_eol: !0 });
const {
  PORT: G = "3000",
  ZMQ_URL: W = "tcp://litecoind:28332",
  CHAIN: K = "LTC",
  NETWORK: j = "regtest",
  BCN_ENV: q = "dev",
  BCN_URL: Y = "http://127.0.0.1:3000",
  DEBUG_MODE: V = "1",
  POSTGRES_USER: z = "bcn",
  POSTGRES_PASSWORD: J = "bcn",
  POSTGRES_DB: Z = "bcn",
  POSTGRES_HOST: Q = "127.0.0.1",
  POSTGRES_PORT: X = "5432",
  RPC_PROTOCOL: tt = "http",
  RPC_USER: et = "bcn-admin",
  RPC_PASSWORD: nt = "kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=",
  RPC_HOST: rt = "litecoind",
  RPC_PORT: st = "19332",
  TESTING: at = !1,
  DEFAULT_WALLET: ot = "defaultwallet",
} = process.env;
const it = process.env.ALLOWED_RPC_METHODS
  ? process.env.ALLOWED_RPC_METHODS.split(",").map((t) => new RegExp(t))
  : [];
const ct = U.get("version");
var lt = {
  PORT: parseInt(G, 10),
  ZMQ_URL: W,
  CHAIN: K,
  NETWORK: j,
  BCN_ENV: q,
  BCN_URL: Y,
  DEBUG_MODE: parseInt(V, 10),
  POSTGRES_USER: z,
  POSTGRES_PASSWORD: J,
  POSTGRES_DB: Z,
  POSTGRES_HOST: Q,
  POSTGRES_PORT: parseInt(X, 10),
  POSTGRES_MAX_PARAM_NUM: 1e4,
  RPC_PROTOCOL: tt,
  RPC_USER: et,
  RPC_PASSWORD: nt,
  RPC_HOST: rt,
  RPC_PORT: parseInt(st, 10),
  SYNC_HEIGHT: 1,
  SYNC_INTERVAL_CHECK: 3e3,
  SERVER_VERSION: ct,
  TESTING: JSON.parse(at.toString()),
  DB_CONNECTION_RETRY_TIME: 500,
  SIGNATURE_FRESHNESS_MINUTES: 3,
  DEFAULT_WALLET: ot,
  ALLOWED_RPC_METHODS: it,
};
const { DEBUG_MODE: dt } = lt;
const ut = o.createLogger({
  level: ["error", "warn", "info", "http", "verbose", "debug", "silly"][dt],
  format: o.format.json(),
  transports: [
    new o.transports.Console({
      format: o.format.combine(
        o.format.colorize(),
        o.format.timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
        o.format.printf((t) => `[2m${t.timestamp}[0m ${t.level} ${t.message}`)
      ),
    }),
  ],
  exceptionHandlers: [
    new o.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new o.transports.File({ filename: "logs/rejections.log" }),
  ],
});
const pt = { maxFiles: 1, maxSize: 1e5 };
dt >= 0 &&
  ut.add(new o.transports.File({ filename: "error.log", level: "error" })),
  dt >= 1 &&
    ut.add(
      new o.transports.File({ filename: "logs/warn.log", level: "warn", ...pt })
    ),
  dt >= 2 &&
    ut.add(
      new o.transports.File({ filename: "logs/info.log", level: "info", ...pt })
    ),
  dt >= 3 &&
    ut.add(
      new o.transports.File({ filename: "logs/http.log", level: "http", ...pt })
    ),
  dt >= 4 &&
    ut.add(
      new o.transports.File({
        filename: "logs/verbose.log",
        level: "verbose",
        ...pt,
      })
    ),
  dt >= 5 &&
    ut.add(
      new o.transports.File({
        filename: "logs/debug.log",
        level: "debug",
        ...pt,
      })
    );
const ft = {
  protocol: lt.RPC_PROTOCOL,
  user: lt.RPC_USER,
  pass: lt.RPC_PASSWORD,
  host: lt.RPC_HOST,
  port: lt.RPC_PORT,
};
const yt = new m.default(ft);
const ht = {
  createwallet: v.default.promisify(m.default.prototype.createwallet.bind(yt)),
  generateToAddress: v.default.promisify(
    m.default.prototype.generateToAddress.bind(yt)
  ),
  getaddressinfo: v.default.promisify(
    m.default.prototype.getaddressinfo.bind(yt)
  ),
  getBlock: v.default.promisify(m.default.prototype.getBlock.bind(yt)),
  getBlockchainInfo: v.default.promisify(
    m.default.prototype.getBlockchainInfo.bind(yt)
  ),
  getBlockHash: v.default.promisify(m.default.prototype.getBlockHash.bind(yt)),
  getRawTransaction: v.default.promisify(
    m.default.prototype.getRawTransaction.bind(yt)
  ),
  getTransaction: v.default.promisify(
    m.default.prototype.getTransaction.bind(yt)
  ),
  importaddress: v.default.promisify(
    m.default.prototype.importaddress.bind(yt)
  ),
  listunspent: v.default.promisify(m.default.prototype.listunspent.bind(yt)),
  sendRawTransaction: v.default.promisify(
    m.default.prototype.sendRawTransaction.bind(yt)
  ),
};
const St = (t, e) => Object.assign(new Array(e).fill(null), t);
const {
  POSTGRES_HOST: gt,
  POSTGRES_PORT: mt,
  POSTGRES_DB: vt,
  POSTGRES_USER: Et,
  POSTGRES_PASSWORD: bt,
  DB_CONNECTION_RETRY_TIME: Rt,
} = lt;
const Tt = {
  error: (t, e) => {
    if (e.cn) {
      const { host: n, port: r, database: s, user: a, password: o } = e.cn;
      ut.debug(
        `Waiting for db to start { message:${t.message} host:${n}, port:${r}, database:${s}, user:${a}, password: ${o}`
      );
    }
  },
  noWarnings: !0,
};
"dev" === lt.BCN_ENV &&
  lt.DEBUG_MODE > 0 &&
  (b.default.isAttached()
    ? b.default.detach()
    : (b.default.attach(Tt), b.default.setTheme("matrix")));
const Ot = E.default(Tt)({
  host: gt,
  port: mt,
  database: vt,
  user: Et,
  password: bt,
  allowExitOnIdle: !0,
  idleTimeoutMillis: 100,
});
class wt {
  static async select() {
    return Ot.one(
      'SELECT "syncedHeight", "bitcoindSyncedHeight", "bitcoindSyncedProgress" FROM "Sync"'
    );
  }
  static async update({
    syncedHeight: t,
    bitcoindSyncedHeight: e,
    bitcoindSyncedProgress: n,
  }) {
    const r = new l.PreparedStatement({
      name: `Sync.update.${Math.random()}`,
      text: 'UPDATE "Sync" SET "syncedHeight" = $1, "bitcoindSyncedHeight" = $2, "bitcoindSyncedProgress" = $3',
      values: [t, e, n],
    });
    await Ot.any(r);
  }
}
class _t {
  static async select() {
    return wt.select();
  }
  static async update(t) {
    await wt.update(t);
  }
}
var Pt = async () => _t.select();
var Nt = async (t) => {
  await _t.update(t);
};
class $t {
  static async select(t) {
    const e = new l.PreparedStatement({
      name: `Standard.select.${Math.random()}`,
      text: 'SELECT "address", "satoshis", "scriptPubKey", "rev" FROM "Standard" WHERE "address" = $1 AND "spent" = FALSE',
      values: [t],
    });
    return (await Ot.any(e)).map((t) => ({
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
      const t = e.splice(0, lt.POSTGRES_MAX_PARAM_NUM);
      const n = [];
      for (let e = 1; e <= t.length; e += 5)
        n.push(`($${e}, $${e + 1}, $${e + 2}, $${e + 3}, $${e + 4})`);
      const r = n.join(",");
      const s = new l.PreparedStatement({
        name: `Standard.insert.${Math.random()}`,
        text: `INSERT INTO "Standard"("rev", "address", "satoshis", "scriptPubKey", "spent") VALUES ${r}  ON CONFLICT DO NOTHING`,
        values: t,
      });
      await Ot.none(s);
    }
  }
  static async update(t) {
    const e = t.flatMap((t) => [
      `${t.prevTxId.toString("hex")}/${t.outputIndex}`,
    ]);
    if (0 === e.length) return [];
    const n = [];
    for (let t = 1; t <= e.length; t += 1) n.push(`("rev" = $${t})`);
    const r = n.join(" OR ");
    const s = new l.PreparedStatement({
      name: `Standard.update.${Math.random()}`,
      text: `UPDATE "Standard" SET "spent" = TRUE WHERE ${r} RETURNING "rev"`,
      values: e,
    });
    return Ot.any(s);
  }
  static async getBalance(t) {
    const e = new l.PreparedStatement({
      name: `Standard.getBalance.${Math.random()}`,
      text: 'SELECT SUM("satoshis") FROM "Standard" WHERE "address" = $1 AND "spent" = FALSE',
      values: [t],
    });
    const n = await Ot.oneOrNone(e);
    return parseInt(null == n ? void 0 : n.sum, 10) || 0;
  }
}
const { Transaction: Ht } = u.Bitcoin;
const { Input: At } = Ht;
var Ct = async (t) => {
  const e = t
    .map((t) => At.fromObject({ ...t, script: t._scriptBuffer }))
    .filter((t) => !t.isNull());
  return $t.update(e);
};
const { Script: It, Transaction: Bt } = u.Bitcoin;
var Mt = async (t, e) => {
  const n = t.flatMap((t, n) => {
    const r = It.fromBuffer(t._scriptBuffer);
    const { PUBKEYHASH_OUT: s, SCRIPTHASH_OUT: a } = It.types;
    if (![s, a].includes(r.classify())) return [];
    const o = r.toAddress(lt.NETWORK).toString("legacy");
    const i = r.toHex();
    const c = t.satoshis / 1e8;
    const l = Math.round(t.satoshis);
    return [
      new Bt.UnspentOutput({
        address: o,
        txId: e,
        outputIndex: n,
        scriptPubKey: i,
        amount: c,
        satoshis: l,
      }),
    ];
  });
  await class {
    static async select(t) {
      return (await $t.select(t)).map((t) => ({
        ...t,
        amount: t.satoshis / 1e8,
      }));
    }
    static async getBalance(t) {
      return $t.getBalance(t);
    }
    static async insert(t) {
      const e = t.map((t) => ({
        rev: `${t.txId}/${t.outputIndex}`,
        address: t.address.toString("legacy"),
        satoshis: t.satoshis,
        scriptPubKey: t.script.toHex(),
        spent: !1,
      }));
      return $t.insert(e);
    }
  }.insert(n);
};
class xt {
  static async query(t) {
    const { publicKey: e, classHash: n } = t;
    if (void 0 === e && void 0 === n) return [];
    let r =
      'SELECT "rev"\n      FROM "NonStandard"\n      WHERE "spent" = FALSE';
    const s = [];
    e && (s.push(e), (r += ' AND $1 = ANY ("publicKeys")')),
      n && (s.push(n), (r += ` AND "classHash" = $${s.length}`));
    const a = new l.PreparedStatement({
      name: `NonStandard.query.${Math.random()}`,
      text: r,
      values: s,
    });
    return (await Ot.any(a)).map((t) => t.rev);
  }
  static async insert({ id: t, rev: e, publicKeys: n, classHash: r }) {
    const s = new l.PreparedStatement({
      name: `NonStandard.insert.${Math.random()}`,
      text: 'INSERT INTO "NonStandard"("id", "rev", "publicKeys", "classHash", "spent") VALUES ($1, $2, $3, $4, FALSE) ON CONFLICT DO NOTHING',
      values: [t, e, n, r],
    });
    await Ot.none(s);
  }
  static async update(t) {
    const e = new l.PreparedStatement({
      name: `NonStandard.update.${Math.random()}`,
      text: 'UPDATE "NonStandard" SET "spent" = TRUE WHERE "rev" = $1 AND "spent" = FALSE',
      values: [t],
    });
    return Ot.none(e);
  }
  static async getRevsByIds(t) {
    const e = new l.PreparedStatement({
      name: `NonStandard.getRevsByIds.${Math.random()}`,
      text: 'SELECT "rev" FROM "NonStandard" WHERE "id" LIKE ANY($1) AND "spent" = FALSE',
      values: [[t]],
    });
    return Ot.any(e);
  }
  static async select(t) {
    const e = new l.PreparedStatement({
      name: `NonStandard.select.${Math.random()}`,
      text: 'SELECT "id", "classHash" FROM "NonStandard" WHERE "rev" = $1',
      values: [t],
    });
    return Ot.oneOrNone(e);
  }
}
class kt {
  static async select(t) {
    return xt.select(t);
  }
  static async query(t) {
    return xt.query(t);
  }
  static async getRevsByIds(t) {
    return xt.getRevsByIds(t);
  }
  static async insert(t) {
    return xt.insert(t);
  }
  static async update(t) {
    return xt.update(t);
  }
}
const { crypto: Dt } = u.Bitcoin;
var Lt = async (t, e, n) => {
  const r = Math.max(t.length, e.length);
  const s = St(t, r);
  const a = St(e, r);
  const o = ((i = a), s.map((t, e) => [t, i[e]]));
  var i;
  await Promise.all(
    o.map(async ([t, e], r) => {
      const { __cls: s = "", _owners: a = [] } = n[r] || {};
      if (null === t && e)
        return (
          /^[0-9A-Fa-f]{64}\/\d+$/.test(e),
          void (await kt.insert({
            id: e,
            rev: e,
            publicKeys: a,
            classHash: Dt.Hash.sha256(Buffer.from(s)).toString("hex"),
          }))
        );
      if (e && t) {
        const { id: n = "", classHash: r = "" } = (await kt.select(t)) || {};
        await kt.insert({ id: n, classHash: r, rev: e, publicKeys: a }),
          await kt.update(t);
      }
    })
  );
};
var Ft = async (t) => {
  for (let e = 0; e < t.length; e += 1)
    try {
      const {
        tx: n,
        txId: r,
        inRevs: s = [],
        outRevs: a = [],
        outData: o = [],
      } = t[e];
      await Mt(n.outputs, n.id),
        await Ct(n.inputs),
        await Lt(s, a, o),
        ut.info(`Synced to '${r}'`);
    } catch (n) {
      n.message.includes("duplicate key value violates unique constraint") ||
        ut.error(
          `Processing tx ${t[e].tx.id} failed with error '${n.message}'`
        );
    }
};
const { Computer: Ut } = lt.TESTING
  ? require("@bitcoin-computer/lib-testing")
  : require("@bitcoin-computer/lib");
const { CHAIN: Gt, NETWORK: Wt, BCN_URL: Kt } = lt;
const jt = new Ut({ chain: Gt, network: Wt, url: Kt });
const qt = async (t, e, n) => {
  try {
    let { result: r } = await ht.getBlockHash(t);
    for (; t <= e; ) {
      const { result: s } = await ht.getBlock(r, 2);
      const { tx: a, nextblockhash: o } = s;
      const i = `Backfilling progress ${t}/${e} blocks [${(
        (t / e) *
        100
      ).toFixed(4)}% (bitcoind progress: ${(100 * n).toFixed(
        4
      )}%)] Backfilling ${a.length} transactions...`;
      ut.info(i);
      const c = await Promise.all(a.map((t) => jt.db.fromTxHex(t.hex)));
      await Ft(c),
        await Nt({
          syncedHeight: t,
          bitcoindSyncedHeight: e,
          bitcoindSyncedProgress: n,
        }),
        (r = o),
        (t += 1);
    }
  } catch (t) {
    ut.error(`Sync action failed with error '${t.message}'`);
  }
};
!(function () {
  try {
    const e = `Synchronizing { url: ${lt.BCN_URL}, chain:${lt.CHAIN} network:${lt.NETWORK} }`;
    ut.info(e),
      "regtest" !== lt.NETWORK &&
        (async () => {
          await (async () => {
            await t.backOff(() => Ot.connect(), { startingDelay: Rt });
          })(),
            await (async () => {
              try {
                let e = await t.backOff(
                  () =>
                    (async () => {
                      const t = await ht.getBlockchainInfo();
                      const e = (
                        100 * parseFloat(t.result.verificationprogress)
                      ).toFixed(4);
                      const { blocks: n } = t.result;
                      const r = `Bitcoind Synced Progress { percentage:${e}%, blocks:${n} }`;
                      if (
                        (ut.info(r),
                        parseFloat(t.result.verificationprogress) <= 1e-6)
                      )
                        throw new Error("Node not ready yet");
                      return t;
                    })(),
                  { startingDelay: 5e3, timeMultiple: 1, numOfAttempts: 720 }
                );
                let n = await Pt();
                await Nt({
                  syncedHeight: n.syncedHeight,
                  bitcoindSyncedHeight: e.result.blocks,
                  bitcoindSyncedProgress: e.result.verificationprogress,
                });
                let r = Math.max(lt.SYNC_HEIGHT, n.syncedHeight + 1);
                const s = (
                  100 * parseFloat(e.result.verificationprogress)
                ).toFixed(4);
                const a = e.result.blocks;
                const { syncedHeight: o } = n;
                const i = `Starting sync process { bitcoind.progress:${s}%, bitcoindSyncedHeight:${a}, syncedHeight:${o}, currentBlockHeight:${r} }`;
                for (
                  ut.info(i);
                  parseFloat(e.result.verificationprogress) < 0.999 ||
                  r <= n.bitcoindSyncedHeight;

                ) {
                  await qt(
                    r,
                    n.bitcoindSyncedHeight,
                    e.result.verificationprogress
                  ),
                    (e = await ht.getBlockchainInfo()),
                    (n = await Pt()),
                    (n.bitcoindSyncedHeight = e.result.blocks),
                    await Nt({
                      syncedHeight: n.syncedHeight,
                      bitcoindSyncedHeight: n.bitcoindSyncedHeight,
                      bitcoindSyncedProgress: e.result.verificationprogress,
                    });
                  const t = (
                    100 * parseFloat(e.result.verificationprogress)
                  ).toFixed(4);
                  ut.info(`Bitcoind progress: ${t}%`), (r = n.syncedHeight + 1);
                }
              } catch (t) {
                ut.error(`Sync action failed with error '${t.message}'`);
              }
            })();
        })();
  } catch (t) {
    ut.error(`Synchronizing failed with error '${t.message}'`);
  }
})();
