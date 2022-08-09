import _ from 'lodash'
import assert from 'assert'
import $ from './util/preconditions'
import Base58 from './encoding/base58'
import Base58Check from './encoding/base58check'
import BN from './crypto/bn'
import BufferUtil from './util/buffer'
import errors from './errors'
import Hash from './crypto/hash'
import HDPublicKey from './hdpublickey'
import JSUtil from './util/js'
import Network from './networks'
import Point from './crypto/point'
import PrivateKey from './privatekey'
import Random from './crypto/random'

const hdErrors = errors.HDPrivateKey

const MINIMUM_ENTROPY_BITS = 128
const BITS_TO_BYTES = 1 / 8
const MAXIMUM_ENTROPY_BITS = 512

/**
 * Represents an instance of an hierarchically derived private key.
 *
 * More info on https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 *
 * @constructor
 * @param {string|Buffer|Object} arg
 */
function HDPrivateKey(arg) {
  if (arg instanceof HDPrivateKey) {
    return arg
  }
  if (!(this instanceof HDPrivateKey)) {
    return new HDPrivateKey(arg)
  }
  if (!arg) {
    return this._generateRandomly()
  }

  if (Network.get(arg)) {
    return this._generateRandomly(arg)
  }
  if (_.isString(arg) || BufferUtil.isBuffer(arg)) {
    if (HDPrivateKey.isValidSerialized(arg)) {
      this._buildFromSerialized(arg)
    } else if (JSUtil.isValidJSON(arg)) {
      this._buildFromJSON(arg)
    } else if (BufferUtil.isBuffer(arg) && HDPrivateKey.isValidSerialized(arg.toString())) {
      this._buildFromSerialized(arg.toString())
    } else {
      throw HDPrivateKey.getSerializedError(arg)
    }
  } else if (_.isObject(arg)) {
    this._buildFromObject(arg)
  } else {
    throw new hdErrors.UnrecognizedArgument(arg)
  }
}

/**
 * Verifies that a given path is valid.
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 * @return {boolean}
 */
HDPrivateKey.isValidPath = function (arg, hardened) {
  if (_.isString(arg)) {
    const indexes = HDPrivateKey._getDerivationIndexes(arg)
    return indexes !== null && _.every(indexes, HDPrivateKey.isValidPath)
  }

  if (_.isNumber(arg)) {
    if (arg < HDPrivateKey.Hardened && hardened === true) {
      arg += HDPrivateKey.Hardened
    }
    return arg >= 0 && arg < HDPrivateKey.MaxIndex
  }

  return false
}

/**
 * Internal function that splits a string path into a derivation index array.
 * It will return null if the string path is malformed.
 * It does not validate if indexes are in bounds.
 *
 * @param {string} path
 * @return {Array}
 */
HDPrivateKey._getDerivationIndexes = function (path) {
  const steps = path.split('/')

  // Special cases:
  if (_.includes(HDPrivateKey.RootElementAlias, path)) {
    return []
  }

  if (!_.includes(HDPrivateKey.RootElementAlias, steps[0])) {
    return null
  }

  const indexes = steps.slice(1).map((step) => {
    const isHardened = step.slice(-1) === "'"
    if (isHardened) {
      step = step.slice(0, -1)
    }
    if (!step || step[0] === '-') {
      return NaN
    }
    let index = +step // cast to number
    if (isHardened) {
      index += HDPrivateKey.Hardened
    }

    return index
  })

  return _.some(indexes, Number.isNaN) ? null : indexes
}

/**
 * WARNING: This method is deprecated. Use deriveChild or deriveNonCompliantChild instead.
 * This is not BIP32 compliant.
 *
 *
 * Get a derived child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same private key), "m/0/1/40/2'/1000", where the ' quote means a hardened
 * derivation.
 *
 * If the first argument is a number, the child with that index will be
 * derived. If the second argument is truthy, the hardened version will be
 * derived. See the example usage for clarification.
 *
 * @example
 * ```javascript
 * var parent = new HDPrivateKey('xprv...');
 * var child_0_1_2h = parent.derive(0).derive(1).derive(2, true);
 * var copy_of_child_0_1_2h = parent.derive("m/0/1/2'");
 * assert(child_0_1_2h.xprivkey === copy_of_child_0_1_2h);
 * ```
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */
HDPrivateKey.prototype.derive = function (arg, hardened) {
  return this.deriveNonCompliantChild(arg, hardened)
}

/**
 * WARNING: This method will not be officially supported until v1.0.0.
 *
 *
 * Get a derived child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same private key), "m/0/1/40/2'/1000", where the ' quote means a hardened
 * derivation.
 *
 * If the first argument is a number, the child with that index will be
 * derived. If the second argument is truthy, the hardened version will be
 * derived. See the example usage for clarification.
 *
 * WARNING: The `nonCompliant` option should NOT be used, except for older implementation
 * that used a derivation strategy that used a non-zero padded private key.
 *
 * @example
 * ```javascript
 * var parent = new HDPrivateKey('xprv...');
 * var child_0_1_2h = parent.deriveChild(0).deriveChild(1).deriveChild(2, true);
 * var copy_of_child_0_1_2h = parent.deriveChild("m/0/1/2'");
 * assert(child_0_1_2h.xprivkey === copy_of_child_0_1_2h);
 * ```
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */
HDPrivateKey.prototype.deriveChild = function (arg, hardened) {
  if (_.isNumber(arg)) {
    return this._deriveWithNumber(arg, hardened)
  }
  if (_.isString(arg)) {
    return this._deriveFromString(arg)
  }
  throw new hdErrors.InvalidDerivationArgument(arg)
}

/**
 * WARNING: This method will not be officially supported until v1.0.0
 *
 *
 * WARNING: If this is a new implementation you should NOT use this method, you should be using
 * `derive` instead.
 *
 * This method is explicitly for use and compatibility with an implementation that
 * was not compliant with BIP32 regarding the derivation algorithm. The private key
 * must be 32 bytes hashing, and this implementation will use the non-zero padded
 * serialization of a private key, such that it's still possible to derive the privateKey
 * to recover those funds.
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */
HDPrivateKey.prototype.deriveNonCompliantChild = function (arg, hardened) {
  if (_.isNumber(arg)) {
    return this._deriveWithNumber(arg, hardened, true)
  }
  if (_.isString(arg)) {
    return this._deriveFromString(arg, true)
  }
  throw new hdErrors.InvalidDerivationArgument(arg)
}

HDPrivateKey.prototype._deriveWithNumber = function (index, hardened, nonCompliant) {
  if (!HDPrivateKey.isValidPath(index, hardened)) {
    throw new hdErrors.InvalidPath(index)
  }

  hardened = index >= HDPrivateKey.Hardened ? true : hardened
  if (index < HDPrivateKey.Hardened && hardened === true) {
    index += HDPrivateKey.Hardened
  }

  const indexBuffer = BufferUtil.integerAsBuffer(index)
  let data
  if (hardened && nonCompliant) {
    // The private key serialization in this case will not be exactly 32 bytes and can be
    // any value less, and the value is not zero-padded.
    const nonZeroPadded = this.privateKey.bn.toBuffer()
    data = BufferUtil.concat([Buffer.from([0]), nonZeroPadded, indexBuffer])
  } else if (hardened) {
    // This will use a 32 byte zero padded serialization of the private key
    const privateKeyBuffer = this.privateKey.bn.toBuffer({ size: 32 })
    assert(privateKeyBuffer.length === 32, 'private key buffer is expected to be 32 bytes')
    data = BufferUtil.concat([Buffer.from([0]), privateKeyBuffer, indexBuffer])
  } else {
    data = BufferUtil.concat([this.publicKey.toBuffer(), indexBuffer])
  }
  const hash = Hash.sha512hmac(data, this._buffers.chainCode)
  const leftPart = BN.fromBuffer(hash.slice(0, 32), {
    size: 32,
  })
  const chainCode = hash.slice(32, 64)

  const privateKey = leftPart.add(this.privateKey.toBigNumber()).umod(Point.getN()).toBuffer({
    size: 32,
  })

  if (!PrivateKey.isValid(privateKey)) {
    // Index at this point is already hardened, we can pass null as the hardened arg
    return this._deriveWithNumber(index + 1, null, nonCompliant)
  }

  const derived = new HDPrivateKey({
    network: this.network,
    depth: this.depth + 1,
    parentFingerPrint: this.fingerPrint,
    childIndex: index,
    chainCode,
    privateKey,
  })

  return derived
}

HDPrivateKey.prototype._deriveFromString = function (path, nonCompliant) {
  if (!HDPrivateKey.isValidPath(path)) {
    throw new hdErrors.InvalidPath(path)
  }

  const indexes = HDPrivateKey._getDerivationIndexes(path)
  const derived = indexes.reduce(
    (prev, index) => prev._deriveWithNumber(index, null, nonCompliant),
    this
  )

  return derived
}

/**
 * Verifies that a given serialized private key in base58 with checksum format
 * is valid.
 *
 * @param {string|Buffer} data - the serialized private key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {boolean}
 */
HDPrivateKey.isValidSerialized = function (data, network) {
  return !HDPrivateKey.getSerializedError(data, network)
}

/**
 * Checks what's the error that causes the validation of a serialized private key
 * in base58 with checksum to fail.
 *
 * @param {string|Buffer} data - the serialized private key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {errors.InvalidArgument|null}
 */
HDPrivateKey.getSerializedError = function (data, network) {
  if (!(_.isString(data) || BufferUtil.isBuffer(data))) {
    return new hdErrors.UnrecognizedArgument('Expected string or buffer')
  }
  if (!Base58.validCharacters(data)) {
    return new errors.InvalidB58Char('(unknown)', data)
  }
  try {
    data = Base58Check.decode(data)
  } catch (e) {
    return new errors.InvalidB58Checksum(data)
  }
  if (data.length !== HDPrivateKey.DataLength) {
    return new hdErrors.InvalidLength(data)
  }
  if (!_.isUndefined(network)) {
    const error = HDPrivateKey._validateNetwork(data, network)
    if (error) {
      return error
    }
  }
  return null
}

HDPrivateKey._validateNetwork = function (data, networkArg) {
  const network = Network.get(networkArg)
  if (!network) {
    return new errors.InvalidNetworkArgument(networkArg)
  }
  const version = data.slice(0, 4)
  if (BufferUtil.integerFromBuffer(version) !== network.xprivkey) {
    return new errors.InvalidNetwork(version)
  }
  return null
}

HDPrivateKey.fromString = function (arg) {
  $.checkArgument(_.isString(arg), 'No valid string was provided')
  return new HDPrivateKey(arg)
}

HDPrivateKey.fromObject = function (arg) {
  $.checkArgument(_.isObject(arg), 'No valid argument was provided')
  return new HDPrivateKey(arg)
}

HDPrivateKey.prototype._buildFromJSON = function (arg) {
  return this._buildFromObject(JSON.parse(arg))
}

HDPrivateKey.prototype._buildFromObject = function (arg) {
  // TODO: Type validation
  let checksum
  if (arg.checksum) {
    if (arg.checksum.length) {
      ;({ checksum } = arg)
    } else {
      checksum = BufferUtil.integerAsBuffer(arg.checksum)
    }
  }

  const buffers = {
    version: arg.network
      ? BufferUtil.integerAsBuffer(Network.get(arg.network).xprivkey)
      : arg.version,
    depth: _.isNumber(arg.depth) ? BufferUtil.integerAsSingleByteBuffer(arg.depth) : arg.depth,
    parentFingerPrint: _.isNumber(arg.parentFingerPrint)
      ? BufferUtil.integerAsBuffer(arg.parentFingerPrint)
      : arg.parentFingerPrint,
    childIndex: _.isNumber(arg.childIndex)
      ? BufferUtil.integerAsBuffer(arg.childIndex)
      : arg.childIndex,
    chainCode: _.isString(arg.chainCode) ? BufferUtil.hexToBuffer(arg.chainCode) : arg.chainCode,
    privateKey:
      _.isString(arg.privateKey) && JSUtil.isHexa(arg.privateKey)
        ? BufferUtil.hexToBuffer(arg.privateKey)
        : arg.privateKey,
    checksum,
  }
  return this._buildFromBuffers(buffers)
}

HDPrivateKey.prototype._buildFromSerialized = function (arg) {
  const decoded = Base58Check.decode(arg)
  const buffers = {
    version: decoded.slice(HDPrivateKey.VersionStart, HDPrivateKey.VersionEnd),
    depth: decoded.slice(HDPrivateKey.DepthStart, HDPrivateKey.DepthEnd),
    parentFingerPrint: decoded.slice(
      HDPrivateKey.ParentFingerPrintStart,
      HDPrivateKey.ParentFingerPrintEnd
    ),
    childIndex: decoded.slice(HDPrivateKey.ChildIndexStart, HDPrivateKey.ChildIndexEnd),
    chainCode: decoded.slice(HDPrivateKey.ChainCodeStart, HDPrivateKey.ChainCodeEnd),
    privateKey: decoded.slice(HDPrivateKey.PrivateKeyStart, HDPrivateKey.PrivateKeyEnd),
    checksum: decoded.slice(HDPrivateKey.ChecksumStart, HDPrivateKey.ChecksumEnd),
    xprivkey: arg,
  }
  return this._buildFromBuffers(buffers)
}

HDPrivateKey.prototype._generateRandomly = function (network) {
  return HDPrivateKey.fromSeed(Random.getRandomBuffer(64), network)
}

/**
 * Generate a private key from a seed, as described in BIP32
 *
 * @param {string|Buffer} hexa
 * @param {*} network
 * @return HDPrivateKey
 */
HDPrivateKey.fromSeed = function (hexa, network) {
  if (JSUtil.isHexaString(hexa)) {
    hexa = BufferUtil.hexToBuffer(hexa)
  }
  if (!Buffer.isBuffer(hexa)) {
    throw new hdErrors.InvalidEntropyArgument(hexa)
  }
  if (hexa.length < MINIMUM_ENTROPY_BITS * BITS_TO_BYTES) {
    throw new hdErrors.InvalidEntropyArgument.NotEnoughEntropy(hexa)
  }
  if (hexa.length > MAXIMUM_ENTROPY_BITS * BITS_TO_BYTES) {
    throw new hdErrors.InvalidEntropyArgument.TooMuchEntropy(hexa)
  }
  const hash = Hash.sha512hmac(hexa, Buffer.from('Bitcoin seed'))

  return new HDPrivateKey({
    network: Network.get(network) || Network.defaultNetwork,
    depth: 0,
    parentFingerPrint: 0,
    childIndex: 0,
    privateKey: hash.slice(0, 32),
    chainCode: hash.slice(32, 64),
  })
}

HDPrivateKey.prototype._calcHDPublicKey = function () {
  if (!this._hdPublicKey) {
    this._hdPublicKey = new HDPublicKey(this)
  }
}

/**
 * Receives a object with buffers in all the properties and populates the
 * internal structure
 *
 * @param {Object} arg
 * @param {Buffer} arg.version
 * @param {Buffer} arg.depth
 * @param {Buffer} arg.parentFingerPrint
 * @param {Buffer} arg.childIndex
 * @param {Buffer} arg.chainCode
 * @param {Buffer} arg.privateKey
 * @param {Buffer} arg.checksum
 * @param {string=} arg.xprivkey - if set, don't recalculate the base58
 *      representation
 * @return {HDPrivateKey} this
 */
HDPrivateKey.prototype._buildFromBuffers = function (arg) {
  HDPrivateKey._validateBufferArguments(arg)

  JSUtil.defineImmutable(this, {
    _buffers: arg,
  })

  const sequence = [
    arg.version,
    arg.depth,
    arg.parentFingerPrint,
    arg.childIndex,
    arg.chainCode,
    BufferUtil.emptyBuffer(1),
    arg.privateKey,
  ]
  const concat = Buffer.concat(sequence)
  if (!arg.checksum || !arg.checksum.length) {
    arg.checksum = Base58Check.checksum(concat)
  } else if (arg.checksum.toString() !== Base58Check.checksum(concat).toString()) {
    throw new errors.InvalidB58Checksum(concat)
  }

  const network = Network.get(BufferUtil.integerFromBuffer(arg.version))
  const xprivkey = Base58Check.encode(Buffer.concat(sequence))
  arg.xprivkey = Buffer.from(xprivkey)

  const privateKey = new PrivateKey(BN.fromBuffer(arg.privateKey), network)
  const publicKey = privateKey.toPublicKey()
  const size = HDPrivateKey.ParentFingerPrintSize
  const fingerPrint = Hash.sha256ripemd160(publicKey.toBuffer()).slice(0, size)

  JSUtil.defineImmutable(this, {
    xprivkey,
    network,
    depth: BufferUtil.integerFromSingleByteBuffer(arg.depth),
    privateKey,
    publicKey,
    fingerPrint,
  })

  this._hdPublicKey = null

  Object.defineProperty(this, 'hdPublicKey', {
    configurable: false,
    enumerable: true,
    get() {
      this._calcHDPublicKey()
      return this._hdPublicKey
    },
  })
  Object.defineProperty(this, 'xpubkey', {
    configurable: false,
    enumerable: true,
    get() {
      this._calcHDPublicKey()
      return this._hdPublicKey.xpubkey
    },
  })
  return this
}

HDPrivateKey._validateBufferArguments = function (arg) {
  const checkBuffer = function (name, size) {
    const buff = arg[name]
    assert(BufferUtil.isBuffer(buff), `${name} argument is not a buffer`)
    assert(buff.length === size, `${name} size unexpected: found ${buff.length}, expected ${size}`)
  }
  checkBuffer('version', HDPrivateKey.VersionSize)
  checkBuffer('depth', HDPrivateKey.DepthSize)
  checkBuffer('parentFingerPrint', HDPrivateKey.ParentFingerPrintSize)
  checkBuffer('childIndex', HDPrivateKey.ChildIndexSize)
  checkBuffer('chainCode', HDPrivateKey.ChainCodeSize)
  checkBuffer('privateKey', HDPrivateKey.PrivateKeySize)
  if (arg.checksum && arg.checksum.length) {
    checkBuffer('checksum', HDPrivateKey.CheckSumSize)
  }
}

/**
 * Returns the string representation of this private key (a string starting
 * with "xprv..."
 *
 * @return string
 */
HDPrivateKey.prototype.toString = function () {
  return this.xprivkey
}

/**
 * Returns a plain object with a representation of this private key.
 *
 * Fields include:<ul>
 * <li> network: either 'livenet' or 'testnet'
 * <li> depth: a number ranging from 0 to 255
 * <li> fingerPrint: a number ranging from 0 to 2^32-1, taken from the hash of the
 * <li>     associated public key
 * <li> parentFingerPrint: a number ranging from 0 to 2^32-1, taken from the hash
 * <li>     of this parent's associated public key or zero.
 * <li> childIndex: the index from which this child was derived (or zero)
 * <li> chainCode: an hexa string representing a number used in the derivation
 * <li> privateKey: the private key associated, in hexa representation
 * <li> xprivkey: the representation of this extended private key in checksum
 * <li>     base58 format
 * <li> checksum: the base58 checksum of xprivkey
 * </ul>
 *  @return {Object}
 */
HDPrivateKey.prototype.toJSON = function toObject() {
  return {
    network: Network.get(BufferUtil.integerFromBuffer(this._buffers.version), 'xprivkey').name,
    depth: BufferUtil.integerFromSingleByteBuffer(this._buffers.depth),
    fingerPrint: BufferUtil.integerFromBuffer(this.fingerPrint),
    parentFingerPrint: BufferUtil.integerFromBuffer(this._buffers.parentFingerPrint),
    childIndex: BufferUtil.integerFromBuffer(this._buffers.childIndex),
    chainCode: BufferUtil.bufferToHex(this._buffers.chainCode),
    privateKey: this.privateKey.toBuffer().toString('hex'),
    checksum: BufferUtil.integerFromBuffer(this._buffers.checksum),
    xprivkey: this.xprivkey,
  }
}

HDPrivateKey.prototype.toObject = HDPrivateKey.prototype.toJSON

/**
 * Build a HDPrivateKey from a buffer
 *
 * @param {Buffer} arg
 * @return {HDPrivateKey}
 */
HDPrivateKey.fromBuffer = function (arg) {
  return new HDPrivateKey(arg.toString())
}

/**
 * Returns a buffer representation of the HDPrivateKey
 *
 * @return {string}
 */
HDPrivateKey.prototype.toBuffer = function () {
  return BufferUtil.copy(this._buffers.xprivkey)
}

HDPrivateKey.DefaultDepth = 0
HDPrivateKey.DefaultFingerprint = 0
HDPrivateKey.DefaultChildIndex = 0
HDPrivateKey.Hardened = 0x80000000
HDPrivateKey.MaxIndex = 2 * HDPrivateKey.Hardened

HDPrivateKey.RootElementAlias = ['m', 'M', "m'", "M'"]

HDPrivateKey.VersionSize = 4
HDPrivateKey.DepthSize = 1
HDPrivateKey.ParentFingerPrintSize = 4
HDPrivateKey.ChildIndexSize = 4
HDPrivateKey.ChainCodeSize = 32
HDPrivateKey.PrivateKeySize = 32
HDPrivateKey.CheckSumSize = 4

HDPrivateKey.DataLength = 78
HDPrivateKey.SerializedByteSize = 82

HDPrivateKey.VersionStart = 0
HDPrivateKey.VersionEnd = HDPrivateKey.VersionStart + HDPrivateKey.VersionSize
HDPrivateKey.DepthStart = HDPrivateKey.VersionEnd
HDPrivateKey.DepthEnd = HDPrivateKey.DepthStart + HDPrivateKey.DepthSize
HDPrivateKey.ParentFingerPrintStart = HDPrivateKey.DepthEnd
HDPrivateKey.ParentFingerPrintEnd =
  HDPrivateKey.ParentFingerPrintStart + HDPrivateKey.ParentFingerPrintSize
HDPrivateKey.ChildIndexStart = HDPrivateKey.ParentFingerPrintEnd
HDPrivateKey.ChildIndexEnd = HDPrivateKey.ChildIndexStart + HDPrivateKey.ChildIndexSize
HDPrivateKey.ChainCodeStart = HDPrivateKey.ChildIndexEnd
HDPrivateKey.ChainCodeEnd = HDPrivateKey.ChainCodeStart + HDPrivateKey.ChainCodeSize
HDPrivateKey.PrivateKeyStart = HDPrivateKey.ChainCodeEnd + 1
HDPrivateKey.PrivateKeyEnd = HDPrivateKey.PrivateKeyStart + HDPrivateKey.PrivateKeySize
HDPrivateKey.ChecksumStart = HDPrivateKey.PrivateKeyEnd
HDPrivateKey.ChecksumEnd = HDPrivateKey.ChecksumStart + HDPrivateKey.CheckSumSize

assert(HDPrivateKey.ChecksumEnd === HDPrivateKey.SerializedByteSize)

export default HDPrivateKey
