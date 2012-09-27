
(function() {

if ('undefined' === typeof Ember) {
  Ember = {};

  if ('undefined' !== typeof window) {
    window.Em = window.Ember = Em = Ember;
  }
}

Ember.ENV = 'undefined' === typeof ENV ? {} : ENV;

if (!('MANDATORY_SETTER' in Ember.ENV)) {
  Ember.ENV.MANDATORY_SETTER = true; // default to true for debug dist
}

Ember.assert = function(desc, test) {
  if (!test) throw new Error("assertion failed: "+desc);
};

Ember.warn = function(message, test) {
  if (!test) {
    Ember.Logger.warn("WARNING: "+message);
    if ('trace' in Ember.Logger) Ember.Logger.trace();
  }
};

Ember.deprecate = function(message, test) {
  if (Ember && Ember.TESTING_DEPRECATION) { return; }

  if (arguments.length === 1) { test = false; }
  if (test) { return; }

  if (Ember && Ember.ENV.RAISE_ON_DEPRECATION) { throw new Error(message); }

  var error;

  // When using new Error, we can't do the arguments check for Chrome. Alternatives are welcome
  try { __fail__.fail(); } catch (e) { error = e; }

  if (Ember.LOG_STACKTRACE_ON_DEPRECATION && error.stack) {
    var stack, stackStr = '';
    if (error['arguments']) {
      // Chrome
      stack = error.stack.replace(/^\s+at\s+/gm, '').
                          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').
                          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
      stack.shift();
    } else {
      // Firefox
      stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').
                          replace(/^\(/gm, '{anonymous}(').split('\n');
    }

    stackStr = "\n    " + stack.slice(2).join("\n    ");
    message = message + stackStr;
  }

  Ember.Logger.warn("DEPRECATION: "+message);
};

Ember.deprecateFunc = function(message, func) {
  return function() {
    Ember.deprecate(message);
    return func.apply(this, arguments);
  };
};


window.ember_assert         = Ember.deprecateFunc("ember_assert is deprecated. Please use Ember.assert instead.",               Ember.assert);
window.ember_warn           = Ember.deprecateFunc("ember_warn is deprecated. Please use Ember.warn instead.",                   Ember.warn);
window.ember_deprecate      = Ember.deprecateFunc("ember_deprecate is deprecated. Please use Ember.deprecate instead.",         Ember.deprecate);
window.ember_deprecateFunc  = Ember.deprecateFunc("ember_deprecateFunc is deprecated. Please use Ember.deprecateFunc instead.", Ember.deprecateFunc);

})();

// Version: v1.0.pre
// Last commit: 7955b85 (2012-08-03 14:50:17 -0700)


(function() {

if ('undefined' === typeof Ember) {
  // Create core object. Make it act like an instance of Ember.Namespace so that
  // objects assigned to it are given a sane string representation.
  Ember = {};
}


// aliases needed to keep minifiers from removing the global context
if ('undefined' !== typeof window) {
  window.Em = window.Ember = Em = Ember;
}

// Make sure these are set whether Ember was already defined or not

Ember.isNamespace = true;

Ember.toString = function() { return "Ember"; };

Ember.VERSION = '1.0.pre';

Ember.ENV = Ember.ENV || ('undefined' === typeof ENV ? {} : ENV);

Ember.config = Ember.config || {};

Ember.EXTEND_PROTOTYPES = (Ember.ENV.EXTEND_PROTOTYPES !== false);

Ember.LOG_STACKTRACE_ON_DEPRECATION = (Ember.ENV.LOG_STACKTRACE_ON_DEPRECATION !== false);

Ember.SHIM_ES5 = (Ember.ENV.SHIM_ES5 === false) ? false : Ember.EXTEND_PROTOTYPES;

Ember.CP_DEFAULT_CACHEABLE = (Ember.ENV.CP_DEFAULT_CACHEABLE !== false);

Ember.VIEW_PRESERVES_CONTEXT = (Ember.ENV.VIEW_PRESERVES_CONTEXT !== false);


Ember.K = function() { return this; };



// Stub out the methods defined by the ember-debug package in case it's not loaded

if ('undefined' === typeof Ember.assert) { Ember.assert = Ember.K; }
if ('undefined' === typeof Ember.warn) { Ember.warn = Ember.K; }
if ('undefined' === typeof Ember.deprecate) { Ember.deprecate = Ember.K; }
if ('undefined' === typeof Ember.deprecateFunc) {
  Ember.deprecateFunc = function(_, func) { return func; };
}

// These are deprecated but still supported

if ('undefined' === typeof ember_assert) { window.ember_assert = Ember.K; }
if ('undefined' === typeof ember_warn) { window.ember_warn = Ember.K; }
if ('undefined' === typeof ember_deprecate) { window.ember_deprecate = Ember.K; }
if ('undefined' === typeof ember_deprecateFunc) {
  /** @private */
  window.ember_deprecateFunc = function(_, func) { return func; };
}


Ember.Logger = window.console || { log: Ember.K, warn: Ember.K, error: Ember.K, info: Ember.K, debug: Ember.K };

})();



(function() {

var isNativeFunc = function(func) {
  // This should probably work in all browsers likely to have ES5 array methods
  return func && Function.prototype.toString.call(func).indexOf('[native code]') > -1;
};


var arrayMap = isNativeFunc(Array.prototype.map) ? Array.prototype.map : function(fun /*, thisp */) {
  //"use strict";

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;
  if (typeof fun !== "function") {
    throw new TypeError();
  }

  var res = new Array(len);
  var thisp = arguments[1];
  for (var i = 0; i < len; i++) {
    if (i in t) {
      res[i] = fun.call(thisp, t[i], i, t);
    }
  }

  return res;
};


var arrayForEach = isNativeFunc(Array.prototype.forEach) ? Array.prototype.forEach : function(fun /*, thisp */) {
  //"use strict";

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;
  if (typeof fun !== "function") {
    throw new TypeError();
  }

  var thisp = arguments[1];
  for (var i = 0; i < len; i++) {
    if (i in t) {
      fun.call(thisp, t[i], i, t);
    }
  }
};

var arrayIndexOf = isNativeFunc(Array.prototype.indexOf) ? Array.prototype.indexOf : function (obj, fromIndex) {
  if (fromIndex === null || fromIndex === undefined) { fromIndex = 0; }
  else if (fromIndex < 0) { fromIndex = Math.max(0, this.length + fromIndex); }
  for (var i = fromIndex, j = this.length; i < j; i++) {
    if (this[i] === obj) { return i; }
  }
  return -1;
};

Ember.ArrayPolyfills = {
  map: arrayMap,
  forEach: arrayForEach,
  indexOf: arrayIndexOf
};

var utils = Ember.EnumerableUtils = {
  map: function(obj, callback, thisArg) {
    return obj.map ? obj.map.call(obj, callback, thisArg) : arrayMap.call(obj, callback, thisArg);
  },

  forEach: function(obj, callback, thisArg) {
    return obj.forEach ? obj.forEach.call(obj, callback, thisArg) : arrayForEach.call(obj, callback, thisArg);
  },

  indexOf: function(obj, element, index) {
    return obj.indexOf ? obj.indexOf.call(obj, element, index) : arrayIndexOf.call(obj, element, index);
  },

  indexesOf: function(obj, elements) {
    return elements === undefined ? [] : utils.map(elements, function(item) {
      return utils.indexOf(obj, item);
    });
  },

  removeObject: function(array, item) {
    var index = utils.indexOf(array, item);
    if (index !== -1) { array.splice(index, 1); }
  }
};


if (Ember.SHIM_ES5) {
  if (!Array.prototype.map) {

    Array.prototype.map = arrayMap;
  }

  if (!Array.prototype.forEach) {

    Array.prototype.forEach = arrayForEach;
  }

  if (!Array.prototype.indexOf) {

    Array.prototype.indexOf = arrayIndexOf;
  }
}

})();



(function() {
var platform = Ember.platform = {};


Ember.create = Object.create;

if (!Ember.create) {

  var K = function() {};

  Ember.create = function(obj, props) {
    K.prototype = obj;
    obj = new K();
    if (props) {
      K.prototype = obj;
      for (var prop in props) {
        K.prototype[prop] = props[prop].value;
      }
      obj = new K();
    }
    K.prototype = null;

    return obj;
  };

  Ember.create.isSimulated = true;
}


var defineProperty = Object.defineProperty;
var canRedefineProperties, canDefinePropertyOnDOM;

// Catch IE8 where Object.defineProperty exists but only works on DOM elements
if (defineProperty) {
  try {
    defineProperty({}, 'a',{get:function(){}});
  } catch (e) {

    defineProperty = null;
  }
}

if (defineProperty) {

  canRedefineProperties = (function() {
    var obj = {};

    defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get: function() { },
      set: function() { }
    });

    defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: true
    });

    return obj.a === true;
  })();

  canDefinePropertyOnDOM = (function(){
    try {
      defineProperty(document.createElement('div'), 'definePropertyOnDOM', {});
      return true;
    } catch(e) { }

    return false;
  })();

  if (!canRedefineProperties) {

    defineProperty = null;
  } else if (!canDefinePropertyOnDOM) {

    defineProperty = function(obj, keyName, desc){
      var isNode;

      if (typeof Node === "object") {
        isNode = obj instanceof Node;
      } else {
        isNode = typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string";
      }

      if (isNode) {
        // TODO: Should we have a warning here?
        return (obj[keyName] = desc.value);
      } else {
        return Object.defineProperty(obj, keyName, desc);
      }
    };
  }
}

platform.defineProperty = defineProperty;

platform.hasPropertyAccessors = true;

if (!platform.defineProperty) {
  platform.hasPropertyAccessors = false;

  platform.defineProperty = function(obj, keyName, desc) {
    if (!desc.get) { obj[keyName] = desc.value; }
  };

  platform.defineProperty.isSimulated = true;
}

if (Ember.ENV.MANDATORY_SETTER && !platform.hasPropertyAccessors) {
  Ember.ENV.MANDATORY_SETTER = false;
}

})();



(function() {

var o_defineProperty = Ember.platform.defineProperty,
    o_create = Ember.create,
    // Used for guid generation...
    GUID_KEY = '__ember'+ (+ new Date()),
    uuid         = 0,
    numberCache  = [],
    stringCache  = {};

var MANDATORY_SETTER = Ember.ENV.MANDATORY_SETTER;

Ember.GUID_KEY = GUID_KEY;

var GUID_DESC = {
  writable:    false,
  configurable: false,
  enumerable:  false,
  value: null
};

Ember.generateGuid = function generateGuid(obj, prefix) {
  if (!prefix) prefix = 'ember';
  var ret = (prefix + (uuid++));
  if (obj) {
    GUID_DESC.value = ret;
    o_defineProperty(obj, GUID_KEY, GUID_DESC);
  }
  return ret ;
};

Ember.guidFor = function guidFor(obj) {

  // special cases where we don't want to add a key to object
  if (obj === undefined) return "(undefined)";
  if (obj === null) return "(null)";

  var cache, ret;
  var type = typeof obj;

  // Don't allow prototype changes to String etc. to change the guidFor
  switch(type) {
    case 'number':
      ret = numberCache[obj];
      if (!ret) ret = numberCache[obj] = 'nu'+obj;
      return ret;

    case 'string':
      ret = stringCache[obj];
      if (!ret) ret = stringCache[obj] = 'st'+(uuid++);
      return ret;

    case 'boolean':
      return obj ? '(true)' : '(false)';

    default:
      if (obj[GUID_KEY]) return obj[GUID_KEY];
      if (obj === Object) return '(Object)';
      if (obj === Array)  return '(Array)';
      ret = 'ember'+(uuid++);
      GUID_DESC.value = ret;
      o_defineProperty(obj, GUID_KEY, GUID_DESC);
      return ret;
  }
};

var META_DESC = {
  writable:    true,
  configurable: false,
  enumerable:  false,
  value: null
};

var META_KEY = Ember.GUID_KEY+'_meta';

Ember.META_KEY = META_KEY;

// Placeholder for non-writable metas.
var EMPTY_META = {
  descs: {},
  watching: {}
};

if (MANDATORY_SETTER) { EMPTY_META.values = {}; }

Ember.EMPTY_META = EMPTY_META;

if (Object.freeze) Object.freeze(EMPTY_META);

var isDefinePropertySimulated = Ember.platform.defineProperty.isSimulated;

function Meta(obj) {
  this.descs = {};
  this.watching = {};
  this.cache = {};
  this.source = obj;
}

if (isDefinePropertySimulated) {
  // on platforms that don't support enumerable false
  // make meta fail jQuery.isPlainObject() to hide from
  // jQuery.extend() by having a property that fails
  // hasOwnProperty check.
  Meta.prototype.__preventPlainObject__ = true;
}

Ember.meta = function meta(obj, writable) {

  var ret = obj[META_KEY];
  if (writable===false) return ret || EMPTY_META;

  if (!ret) {
    if (!isDefinePropertySimulated) o_defineProperty(obj, META_KEY, META_DESC);

    ret = new Meta(obj);

    if (MANDATORY_SETTER) { ret.values = {}; }

    obj[META_KEY] = ret;

    // make sure we don't accidentally try to create constructor like desc
    ret.descs.constructor = null;

  } else if (ret.source !== obj) {
    if (!isDefinePropertySimulated) o_defineProperty(obj, META_KEY, META_DESC);

    ret = o_create(ret);
    ret.descs    = o_create(ret.descs);
    ret.watching = o_create(ret.watching);
    ret.cache    = {};
    ret.source   = obj;

    if (MANDATORY_SETTER) { ret.values = o_create(ret.values); }

    obj[META_KEY] = ret;
  }
  return ret;
};

Ember.getMeta = function getMeta(obj, property) {
  var meta = Ember.meta(obj, false);
  return meta[property];
};

Ember.setMeta = function setMeta(obj, property, value) {
  var meta = Ember.meta(obj, true);
  meta[property] = value;
  return value;
};

Ember.metaPath = function metaPath(obj, path, writable) {
  var meta = Ember.meta(obj, writable), keyName, value;

  for (var i=0, l=path.length; i<l; i++) {
    keyName = path[i];
    value = meta[keyName];

    if (!value) {
      if (!writable) { return undefined; }
      value = meta[keyName] = { __ember_source__: obj };
    } else if (value.__ember_source__ !== obj) {
      if (!writable) { return undefined; }
      value = meta[keyName] = o_create(value);
      value.__ember_source__ = obj;
    }

    meta = value;
  }

  return value;
};

Ember.wrap = function(func, superFunc) {

  function K() {}

  var newFunc = function() {
    var ret, sup = this._super;
    this._super = superFunc || K;
    ret = func.apply(this, arguments);
    this._super = sup;
    return ret;
  };

  newFunc.base = func;
  return newFunc;
};

Ember.isArray = function(obj) {
  if (!obj || obj.setInterval) { return false; }
  if (Array.isArray && Array.isArray(obj)) { return true; }
  if (Ember.Array && Ember.Array.detect(obj)) { return true; }
  if ((obj.length !== undefined) && 'object'===typeof obj) { return true; }
  return false;
};

Ember.makeArray = function(obj) {
  if (obj === null || obj === undefined) { return []; }
  return Ember.isArray(obj) ? obj : [obj];
};

function canInvoke(obj, methodName) {
  return !!(obj && typeof obj[methodName] === 'function');
}


Ember.canInvoke = canInvoke;


Ember.tryInvoke = function(obj, methodName, args) {
  if (canInvoke(obj, methodName)) {
    return obj[methodName].apply(obj, args);
  }
};

})();



(function() {

var guidFor = Ember.guidFor,
    indexOf = Ember.ArrayPolyfills.indexOf;

var copy = function(obj) {
  var output = {};

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) { output[prop] = obj[prop]; }
  }

  return output;
};

var copyMap = function(original, newObject) {
  var keys = original.keys.copy(),
      values = copy(original.values);

  newObject.keys = keys;
  newObject.values = values;

  return newObject;
};

// This class is used internally by Ember.js and Ember Data.
// Please do not use it at this time. We plan to clean it up
// and add many tests soon.
var OrderedSet = Ember.OrderedSet = function() {
  this.clear();
};

OrderedSet.create = function() {
  return new OrderedSet();
};

OrderedSet.prototype = {
  clear: function() {
    this.presenceSet = {};
    this.list = [];
  },

  add: function(obj) {
    var guid = guidFor(obj),
        presenceSet = this.presenceSet,
        list = this.list;

    if (guid in presenceSet) { return; }

    presenceSet[guid] = true;
    list.push(obj);
  },

  remove: function(obj) {
    var guid = guidFor(obj),
        presenceSet = this.presenceSet,
        list = this.list;

    delete presenceSet[guid];

    var index = indexOf.call(list, obj);
    if (index > -1) {
      list.splice(index, 1);
    }
  },

  isEmpty: function() {
    return this.list.length === 0;
  },

  forEach: function(fn, self) {
    // allow mutation during iteration
    var list = this.list.slice();

    for (var i = 0, j = list.length; i < j; i++) {
      fn.call(self, list[i]);
    }
  },

  toArray: function() {
    return this.list.slice();
  },

  copy: function() {
    var set = new OrderedSet();

    set.presenceSet = copy(this.presenceSet);
    set.list = this.list.slice();

    return set;
  }
};


var Map = Ember.Map = function() {
  this.keys = Ember.OrderedSet.create();
  this.values = {};
};

Map.create = function() {
  return new Map();
};

Map.prototype = {

  get: function(key) {
    var values = this.values,
        guid = guidFor(key);

    return values[guid];
  },

  set: function(key, value) {
    var keys = this.keys,
        values = this.values,
        guid = guidFor(key);

    keys.add(key);
    values[guid] = value;
  },

  remove: function(key) {
    // don't use ES6 "delete" because it will be annoying
    // to use in browsers that are not ES6 friendly;
    var keys = this.keys,
        values = this.values,
        guid = guidFor(key),
        value;

    if (values.hasOwnProperty(guid)) {
      keys.remove(key);
      value = values[guid];
      delete values[guid];
      return true;
    } else {
      return false;
    }
  },

  has: function(key) {
    var values = this.values,
        guid = guidFor(key);

    return values.hasOwnProperty(guid);
  },

  forEach: function(callback, self) {
    var keys = this.keys,
        values = this.values;

    keys.forEach(function(key) {
      var guid = guidFor(key);
      callback.call(self, key, values[guid]);
    });
  },

  copy: function() {
    return copyMap(this, new Map());
  }
};

var MapWithDefault = Ember.MapWithDefault = function(options) {
  Map.call(this);
  this.defaultValue = options.defaultValue;
};

MapWithDefault.create = function(options) {
  if (options) {
    return new MapWithDefault(options);
  } else {
    return new Map();
  }
};

MapWithDefault.prototype = Ember.create(Map.prototype);

MapWithDefault.prototype.get = function(key) {
  var hasValue = this.has(key);

  if (hasValue) {
    return Map.prototype.get.call(this, key);
  } else {
    var defaultValue = this.defaultValue(key);
    this.set(key, defaultValue);
    return defaultValue;
  }
};

MapWithDefault.prototype.copy = function() {
  return copyMap(this, new MapWithDefault({
    defaultValue: this.defaultValue
  }));
};

})();



(function() {

var META_KEY = Ember.META_KEY, get, set;

var MANDATORY_SETTER = Ember.ENV.MANDATORY_SETTER;


var IS_GLOBAL = /^([A-Z$]|([0-9][A-Z$]))/;
var IS_GLOBAL_PATH = /^([A-Z$]|([0-9][A-Z$])).*[\.\*]/;
var HAS_THIS  = /^this[\.\*]/;
var FIRST_KEY = /^([^\.\*]+)/;


get = function get(obj, keyName) {
  // Helpers that operate with 'this' within an #each
  if (keyName === '') {
    return obj;
  }

  if (!keyName && 'string'===typeof obj) {
    keyName = obj;
    obj = null;
  }

  if (!obj || keyName.indexOf('.') !== -1) {
    return getPath(obj, keyName);
  }

  Ember.assert("You need to provide an object and key to `get`.", !!obj && keyName);

  var meta = obj[META_KEY], desc = meta && meta.descs[keyName], ret;
  if (desc) {
    return desc.get(obj, keyName);
  } else {
    if (MANDATORY_SETTER && meta && meta.watching[keyName] > 0) {
      ret = meta.values[keyName];
    } else {
      ret = obj[keyName];
    }

    if (ret === undefined &&
        'object' === typeof obj && !(keyName in obj) && 'function' === typeof obj.unknownProperty) {
      return obj.unknownProperty(keyName);
    }

    return ret;
  }
};


set = function set(obj, keyName, value, tolerant) {
  if (typeof obj === 'string') {
    Ember.assert("Path '" + obj + "' must be global if no obj is given.", IS_GLOBAL.test(obj));
    value = keyName;
    keyName = obj;
    obj = null;
  }

  if (!obj || keyName.indexOf('.') !== -1) {
    return setPath(obj, keyName, value, tolerant);
  }

  Ember.assert("You need to provide an object and key to `set`.", !!obj && keyName !== undefined);
  Ember.assert('calling set on destroyed object', !obj.isDestroyed);

  var meta = obj[META_KEY], desc = meta && meta.descs[keyName],
      isUnknown, currentValue;
  if (desc) {
    desc.set(obj, keyName, value);
  }
  else {
    isUnknown = 'object' === typeof obj && !(keyName in obj);

    // setUnknownProperty is called if `obj` is an object,
    // the property does not already exist, and the
    // `setUnknownProperty` method exists on the object
    if (isUnknown && 'function' === typeof obj.setUnknownProperty) {
      obj.setUnknownProperty(keyName, value);
    } else if (meta && meta.watching[keyName] > 0) {
      if (MANDATORY_SETTER) {
        currentValue = meta.values[keyName];
      } else {
        currentValue = obj[keyName];
      }
      // only trigger a change if the value has changed
      if (value !== currentValue) {
        Ember.propertyWillChange(obj, keyName);
        if (MANDATORY_SETTER) {
          if (currentValue === undefined && !(keyName in obj)) {
            Ember.defineProperty(obj, keyName, null, value); // setup mandatory setter
          } else {
            meta.values[keyName] = value;
          }
        } else {
          obj[keyName] = value;
        }
        Ember.propertyDidChange(obj, keyName);
      }
    } else {
      obj[keyName] = value;
    }
  }
  return value;
};


function firstKey(path) {
  return path.match(FIRST_KEY)[0];
}

function normalizeTuple(target, path) {
  var hasThis  = HAS_THIS.test(path),
      isGlobal = !hasThis && IS_GLOBAL_PATH.test(path),
      key;

  if (!target || isGlobal) target = window;
  if (hasThis) path = path.slice(5);

  if (target === window) {
    key = firstKey(path);
    target = get(target, key);
    path   = path.slice(key.length+1);
  }

  // must return some kind of path to be valid else other things will break.
  if (!path || path.length===0) throw new Error('Invalid Path');

  return [ target, path ];
}

function getPath(root, path) {
  var hasThis, parts, tuple, idx, len;

  // If there is no root and path is a key name, return that
  // property from the global object.
  // E.g. get('Ember') -> Ember
  if (root === null && path.indexOf('.') === -1) { return get(window, path); }

  // detect complicated paths and normalize them
  hasThis  = HAS_THIS.test(path);

  if (!root || hasThis) {
    tuple = normalizeTuple(root, path);
    root = tuple[0];
    path = tuple[1];
    tuple.length = 0;
  }

  parts = path.split(".");
  len = parts.length;
  for (idx=0; root && idx<len; idx++) {
    root = get(root, parts[idx], true);
    if (root && root.isDestroyed) { return undefined; }
  }
  return root;
}

function setPath(root, path, value, tolerant) {
  var keyName;

  // get the last part of the path
  keyName = path.slice(path.lastIndexOf('.') + 1);

  // get the first part of the part
  path    = path.slice(0, path.length-(keyName.length+1));

  // unless the path is this, look up the first part to
  // get the root
  if (path !== 'this') {
    root = getPath(root, path);
  }

  if (!keyName || keyName.length === 0) {
    throw new Error('You passed an empty path');
  }

  if (!root) {
    if (tolerant) { return; }
    else { throw new Error('Object in path '+path+' could not be found or was destroyed.'); }
  }

  return set(root, keyName, value);
}

Ember.normalizeTuple = function(target, path) {
  return normalizeTuple(target, path);
};

Ember.getWithDefault = function(root, key, defaultValue) {
  var value = get(root, key);

  if (value === undefined) { return defaultValue; }
  return value;
};

Ember.get = get;
Ember.getPath = Ember.deprecateFunc('getPath is deprecated since get now supports paths', Ember.get);

Ember.set = set;
Ember.setPath = Ember.deprecateFunc('setPath is deprecated since set now supports paths', Ember.set);

Ember.trySet = function(root, path, value) {
  return set(root, path, value, true);
};
Ember.trySetPath = Ember.deprecateFunc('trySetPath has been renamed to trySet', Ember.trySet);


Ember.isGlobalPath = function(path) {
  return IS_GLOBAL.test(path);
};



if (Ember.config.overrideAccessors) {
  Ember.config.overrideAccessors();
  get = Ember.get;
  set = Ember.set;
}

})();



(function() {

var GUID_KEY = Ember.GUID_KEY,
    META_KEY = Ember.META_KEY,
    EMPTY_META = Ember.EMPTY_META,
    metaFor = Ember.meta,
    o_create = Ember.create,
    objectDefineProperty = Ember.platform.defineProperty;

var MANDATORY_SETTER = Ember.ENV.MANDATORY_SETTER;

var Descriptor = Ember.Descriptor = function() {};

Ember.defineProperty = function(obj, keyName, desc, data, meta) {

  var descs, existingDesc, watching, value;

  if (!meta) meta = metaFor(obj);
  descs = meta.descs;
  existingDesc = meta.descs[keyName];
  watching = meta.watching[keyName] > 0;

  if (existingDesc instanceof Ember.Descriptor) {
    existingDesc.teardown(obj, keyName);
  }

  if (desc instanceof Ember.Descriptor) {
    value = desc;

    descs[keyName] = desc;
    if (MANDATORY_SETTER && watching) {
      objectDefineProperty(obj, keyName, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: undefined // make enumerable
      });
    } else {
      obj[keyName] = undefined; // make enumerable
    }
    desc.setup(obj, keyName);
  } else {
    descs[keyName] = undefined; // shadow descriptor in proto
    if (desc == null) {
      value = data;

      if (MANDATORY_SETTER && watching) {
        meta.values[keyName] = data;
        objectDefineProperty(obj, keyName, {
          configurable: true,
          enumerable: true,
          set: function() {
            Ember.assert('Must use Ember.set() to access this property', false);
          },
          get: function() {
            var meta = this[META_KEY];
            return meta && meta.values[keyName];
          }
        });
      } else {
        obj[keyName] = data;
      }
    } else {
      value = desc;

      // compatibility with ES5
      objectDefineProperty(obj, keyName, desc);
    }
  }

  // if key is being watched, override chains that
  // were initialized with the prototype
  if (watching) { Ember.overrideChains(obj, keyName, meta); }

  // The `value` passed to the `didDefineProperty` hook is
  // either the descriptor or data, whichever was passed.
  if (obj.didDefineProperty) { obj.didDefineProperty(obj, keyName, value); }

  return this;
};


})();



(function() {

var AFTER_OBSERVERS = ':change';
var BEFORE_OBSERVERS = ':before';
var guidFor = Ember.guidFor;

var deferred = 0;
var array_Slice = [].slice;

var ObserverSet = function () {
  this.targetSet = {};
};
ObserverSet.prototype.add = function (target, path) {
  var targetSet = this.targetSet,
    targetGuid = Ember.guidFor(target),
    pathSet = targetSet[targetGuid];
  if (!pathSet) {
    targetSet[targetGuid] = pathSet = {};
  }
  if (pathSet[path]) {
    return false;
  } else {
    return pathSet[path] = true;
  }
};
ObserverSet.prototype.clear = function () {
  this.targetSet = {};
};

var DeferredEventQueue = function() {
  this.targetSet = {};
  this.queue = [];
};

DeferredEventQueue.prototype.push = function(target, eventName, keyName) {
  var targetSet = this.targetSet,
    queue = this.queue,
    targetGuid = Ember.guidFor(target),
    eventNameSet = targetSet[targetGuid],
    index;

  if (!eventNameSet) {
    targetSet[targetGuid] = eventNameSet = {};
  }
  index = eventNameSet[eventName];
  if (index === undefined) {
    eventNameSet[eventName] = queue.push(Ember.deferEvent(target, eventName, [target, keyName])) - 1;
  } else {
    queue[index] = Ember.deferEvent(target, eventName, [target, keyName]);
  }
};

DeferredEventQueue.prototype.flush = function() {
  var queue = this.queue;
  this.queue = [];
  this.targetSet = {};
  for (var i=0, len=queue.length; i < len; ++i) {
    queue[i]();
  }
};

var queue = new DeferredEventQueue(), beforeObserverSet = new ObserverSet();

function notifyObservers(obj, eventName, keyName, forceNotification) {
  if (deferred && !forceNotification) {
    queue.push(obj, eventName, keyName);
  } else {
    Ember.sendEvent(obj, eventName, [obj, keyName]);
  }
}

function flushObserverQueue() {
  beforeObserverSet.clear();

  queue.flush();
}

Ember.beginPropertyChanges = function() {
  deferred++;
  return this;
};

Ember.endPropertyChanges = function() {
  deferred--;
  if (deferred<=0) flushObserverQueue();
};

Ember.changeProperties = function(cb, binding){
  Ember.beginPropertyChanges();
  try {
    cb.call(binding);
  } finally {
    Ember.endPropertyChanges();
  }
};

Ember.setProperties = function(self, hash) {
  Ember.changeProperties(function(){
    for(var prop in hash) {
      if (hash.hasOwnProperty(prop)) Ember.set(self, prop, hash[prop]);
    }
  });
  return self;
};

function changeEvent(keyName) {
  return keyName+AFTER_OBSERVERS;
}

function beforeEvent(keyName) {
  return keyName+BEFORE_OBSERVERS;
}

Ember.addObserver = function(obj, path, target, method) {
  Ember.addListener(obj, changeEvent(path), target, method);
  Ember.watch(obj, path);
  return this;
};

Ember.observersFor = function(obj, path) {
  return Ember.listenersFor(obj, changeEvent(path));
};

Ember.removeObserver = function(obj, path, target, method) {
  Ember.unwatch(obj, path);
  Ember.removeListener(obj, changeEvent(path), target, method);
  return this;
};

Ember.addBeforeObserver = function(obj, path, target, method) {
  Ember.addListener(obj, beforeEvent(path), target, method);
  Ember.watch(obj, path);
  return this;
};

Ember._suspendBeforeObserver = function(obj, path, target, method, callback) {
  return Ember._suspendListener(obj, beforeEvent(path), target, method, callback);
};

Ember._suspendObserver = function(obj, path, target, method, callback) {
  return Ember._suspendListener(obj, changeEvent(path), target, method, callback);
};


Ember.beforeObserversFor = function(obj, path) {
  return Ember.listenersFor(obj, beforeEvent(path));
};

Ember.removeBeforeObserver = function(obj, path, target, method) {
  Ember.unwatch(obj, path);
  Ember.removeListener(obj, beforeEvent(path), target, method);
  return this;
};


Ember.notifyObservers = function(obj, keyName) {
  if (obj.isDestroying) { return; }

  notifyObservers(obj, changeEvent(keyName), keyName);
};


Ember.notifyBeforeObservers = function(obj, keyName) {
  if (obj.isDestroying) { return; }

  var guid, set, forceNotification = false;

  if (deferred) {
    if (beforeObserverSet.add(obj, keyName)) {
      forceNotification = true;
    } else {
      return;
    }
  }

  notifyObservers(obj, beforeEvent(keyName), keyName, forceNotification);
};


})();



(function() {

var guidFor = Ember.guidFor, // utils.js
    metaFor = Ember.meta, // utils.js
    get = Ember.get, // accessors.js
    set = Ember.set, // accessors.js
    normalizeTuple = Ember.normalizeTuple, // accessors.js
    GUID_KEY = Ember.GUID_KEY, // utils.js
    META_KEY = Ember.META_KEY, // utils.js
    // circular reference observer depends on Ember.watch
    // we should move change events to this file or its own property_events.js
    notifyObservers = Ember.notifyObservers, // observer.js
    forEach = Ember.ArrayPolyfills.forEach, // array.js
    FIRST_KEY = /^([^\.\*]+)/,
    IS_PATH = /[\.\*]/;

var MANDATORY_SETTER = Ember.ENV.MANDATORY_SETTER,
o_defineProperty = Ember.platform.defineProperty;

function firstKey(path) {
  return path.match(FIRST_KEY)[0];
}

function isKeyName(path) {
  return path==='*' || !IS_PATH.test(path);
}

// ..........................................................
// DEPENDENT KEYS
//

var DEP_SKIP = { __emberproto__: true }; // skip some keys and toString

function iterDeps(method, obj, depKey, seen, meta) {

  var guid = guidFor(obj);
  if (!seen[guid]) seen[guid] = {};
  if (seen[guid][depKey]) return;
  seen[guid][depKey] = true;

  var deps = meta.deps;
  deps = deps && deps[depKey];
  if (deps) {
    for(var key in deps) {
      if (DEP_SKIP[key]) continue;
      method(obj, key);
    }
  }
}


var WILL_SEEN, DID_SEEN;

function dependentKeysWillChange(obj, depKey, meta) {
  if (obj.isDestroying) { return; }

  var seen = WILL_SEEN, top = !seen;
  if (top) { seen = WILL_SEEN = {}; }
  iterDeps(propertyWillChange, obj, depKey, seen, meta);
  if (top) { WILL_SEEN = null; }
}

function dependentKeysDidChange(obj, depKey, meta) {
  if (obj.isDestroying) { return; }

  var seen = DID_SEEN, top = !seen;
  if (top) { seen = DID_SEEN = {}; }
  iterDeps(propertyDidChange, obj, depKey, seen, meta);
  if (top) { DID_SEEN = null; }
}

function addChainWatcher(obj, keyName, node) {
  if (!obj || ('object' !== typeof obj)) return; // nothing to do
  var m = metaFor(obj);
  var nodes = m.chainWatchers;
  if (!nodes || nodes.__emberproto__ !== obj) {
    nodes = m.chainWatchers = { __emberproto__: obj };
  }

  if (!nodes[keyName]) { nodes[keyName] = {}; }
  nodes[keyName][guidFor(node)] = node;
  Ember.watch(obj, keyName);
}

function removeChainWatcher(obj, keyName, node) {
  if (!obj || 'object' !== typeof obj) { return; } // nothing to do
  var m = metaFor(obj, false),
      nodes = m.chainWatchers;
  if (!nodes || nodes.__emberproto__ !== obj) { return; } //nothing to do
  if (nodes[keyName]) { delete nodes[keyName][guidFor(node)]; }
  Ember.unwatch(obj, keyName);
}

var pendingQueue = [];

function flushPendingChains() {
  if (pendingQueue.length === 0) { return; } // nothing to do

  var queue = pendingQueue;
  pendingQueue = [];

  forEach.call(queue, function(q) { q[0].add(q[1]); });

  Ember.warn('Watching an undefined global, Ember expects watched globals to be setup by the time the run loop is flushed, check for typos', pendingQueue.length === 0);
}


function isProto(pvalue) {
  return metaFor(pvalue, false).proto === pvalue;
}


var ChainNode = function(parent, key, value, separator) {
  var obj;
  this._parent = parent;
  this._key    = key;

  // _watching is true when calling get(this._parent, this._key) will
  // return the value of this node.
  //
  // It is false for the root of a chain (because we have no parent)
  // and for global paths (because the parent node is the object with
  // the observer on it)
  this._watching = value===undefined;

  this._value  = value;
  this._separator = separator || '.';
  this._paths = {};
  if (this._watching) {
    this._object = parent.value();
    if (this._object) { addChainWatcher(this._object, this._key, this); }
  }

  // Special-case: the EachProxy relies on immediate evaluation to
  // establish its observers.
  //
  // TODO: Replace this with an efficient callback that the EachProxy
  // can implement.
  if (this._parent && this._parent._key === '@each') {
    this.value();
  }
};

var ChainNodePrototype = ChainNode.prototype;

ChainNodePrototype.value = function() {
  if (this._value === undefined && this._watching) {
    var obj = this._parent.value();
    this._value = (obj && !isProto(obj)) ? get(obj, this._key) : undefined;
  }
  return this._value;
};

ChainNodePrototype.destroy = function() {
  if (this._watching) {
    var obj = this._object;
    if (obj) { removeChainWatcher(obj, this._key, this); }
    this._watching = false; // so future calls do nothing
  }
};

// copies a top level object only
ChainNodePrototype.copy = function(obj) {
  var ret = new ChainNode(null, null, obj, this._separator),
      paths = this._paths, path;
  for (path in paths) {
    if (paths[path] <= 0) { continue; } // this check will also catch non-number vals.
    ret.add(path);
  }
  return ret;
};

// called on the root node of a chain to setup watchers on the specified
// path.
ChainNodePrototype.add = function(path) {
  var obj, tuple, key, src, separator, paths;

  paths = this._paths;
  paths[path] = (paths[path] || 0) + 1;

  obj = this.value();
  tuple = normalizeTuple(obj, path);

  // the path was a local path
  if (tuple[0] && tuple[0] === obj) {
    path = tuple[1];
    key  = firstKey(path);
    path = path.slice(key.length+1);

  // global path, but object does not exist yet.
  // put into a queue and try to connect later.
  } else if (!tuple[0]) {
    pendingQueue.push([this, path]);
    tuple.length = 0;
    return;

  // global path, and object already exists
  } else {
    src  = tuple[0];
    key  = path.slice(0, 0-(tuple[1].length+1));
    separator = path.slice(key.length, key.length+1);
    path = tuple[1];
  }

  tuple.length = 0;
  this.chain(key, path, src, separator);
};

// called on the root node of a chain to teardown watcher on the specified
// path
ChainNodePrototype.remove = function(path) {
  var obj, tuple, key, src, paths;

  paths = this._paths;
  if (paths[path] > 0) { paths[path]--; }

  obj = this.value();
  tuple = normalizeTuple(obj, path);
  if (tuple[0] === obj) {
    path = tuple[1];
    key  = firstKey(path);
    path = path.slice(key.length+1);
  } else {
    src  = tuple[0];
    key  = path.slice(0, 0-(tuple[1].length+1));
    path = tuple[1];
  }

  tuple.length = 0;
  this.unchain(key, path);
};

ChainNodePrototype.count = 0;

ChainNodePrototype.chain = function(key, path, src, separator) {
  var chains = this._chains, node;
  if (!chains) { chains = this._chains = {}; }

  node = chains[key];
  if (!node) { node = chains[key] = new ChainNode(this, key, src, separator); }
  node.count++; // count chains...

  // chain rest of path if there is one
  if (path && path.length>0) {
    key = firstKey(path);
    path = path.slice(key.length+1);
    node.chain(key, path); // NOTE: no src means it will observe changes...
  }
};

ChainNodePrototype.unchain = function(key, path) {
  var chains = this._chains, node = chains[key];

  // unchain rest of path first...
  if (path && path.length>1) {
    key  = firstKey(path);
    path = path.slice(key.length+1);
    node.unchain(key, path);
  }

  // delete node if needed.
  node.count--;
  if (node.count<=0) {
    delete chains[node._key];
    node.destroy();
  }

};

ChainNodePrototype.willChange = function() {
  var chains = this._chains;
  if (chains) {
    for(var key in chains) {
      if (!chains.hasOwnProperty(key)) { continue; }
      chains[key].willChange();
    }
  }

  if (this._parent) { this._parent.chainWillChange(this, this._key, 1); }
};

ChainNodePrototype.chainWillChange = function(chain, path, depth) {
  if (this._key) { path = this._key + this._separator + path; }

  if (this._parent) {
    this._parent.chainWillChange(this, path, depth+1);
  } else {
    if (depth > 1) { Ember.propertyWillChange(this.value(), path); }
    path = 'this.' + path;
    if (this._paths[path] > 0) { Ember.propertyWillChange(this.value(), path); }
  }
};

ChainNodePrototype.chainDidChange = function(chain, path, depth) {
  if (this._key) { path = this._key + this._separator + path; }
  if (this._parent) {
    this._parent.chainDidChange(this, path, depth+1);
  } else {
    if (depth > 1) { Ember.propertyDidChange(this.value(), path); }
    path = 'this.' + path;
    if (this._paths[path] > 0) { Ember.propertyDidChange(this.value(), path); }
  }
};

ChainNodePrototype.didChange = function(suppressEvent) {
  // invalidate my own value first.
  if (this._watching) {
    var obj = this._parent.value();
    if (obj !== this._object) {
      removeChainWatcher(this._object, this._key, this);
      this._object = obj;
      addChainWatcher(obj, this._key, this);
    }
    this._value  = undefined;

    // Special-case: the EachProxy relies on immediate evaluation to
    // establish its observers.
    if (this._parent && this._parent._key === '@each')
      this.value();
  }

  // then notify chains...
  var chains = this._chains;
  if (chains) {
    for(var key in chains) {
      if (!chains.hasOwnProperty(key)) { continue; }
      chains[key].didChange(suppressEvent);
    }
  }

  if (suppressEvent) { return; }

  // and finally tell parent about my path changing...
  if (this._parent) { this._parent.chainDidChange(this, this._key, 1); }
};

function chainsFor(obj) {
  var m = metaFor(obj), ret = m.chains;
  if (!ret) {
    ret = m.chains = new ChainNode(null, null, obj);
  } else if (ret.value() !== obj) {
    ret = m.chains = ret.copy(obj);
  }
  return ret;
}

function notifyChains(obj, m, keyName, methodName, arg) {
  var nodes = m.chainWatchers;

  if (!nodes || nodes.__emberproto__ !== obj) { return; } // nothing to do

  nodes = nodes[keyName];
  if (!nodes) { return; }

  for(var key in nodes) {
    if (!nodes.hasOwnProperty(key)) { continue; }
    nodes[key][methodName](arg);
  }
}

Ember.overrideChains = function(obj, keyName, m) {
  notifyChains(obj, m, keyName, 'didChange', true);
};

function chainsWillChange(obj, keyName, m) {
  notifyChains(obj, m, keyName, 'willChange');
}

function chainsDidChange(obj, keyName, m) {
  notifyChains(obj, m, keyName, 'didChange');
}

Ember.watch = function(obj, keyName) {
  // can't watch length on Array - it is special...
  if (keyName === 'length' && Ember.typeOf(obj) === 'array') { return this; }

  var m = metaFor(obj), watching = m.watching, desc;

  // activate watching first time
  if (!watching[keyName]) {
    watching[keyName] = 1;
    if (isKeyName(keyName)) {
      desc = m.descs[keyName];
      if (desc && desc.willWatch) { desc.willWatch(obj, keyName); }

      if ('function' === typeof obj.willWatchProperty) {
        obj.willWatchProperty(keyName);
      }

      if (MANDATORY_SETTER && keyName in obj) {
        m.values[keyName] = obj[keyName];
        o_defineProperty(obj, keyName, {
          configurable: true,
          enumerable: true,
          set: function() {
            Ember.assert('Must use Ember.set() to access this property', false);
          },
          get: function() {
            var meta = this[META_KEY];
            return meta && meta.values[keyName];
          }
        });
      }
    } else {
      chainsFor(obj).add(keyName);
    }

  }  else {
    watching[keyName] = (watching[keyName] || 0) + 1;
  }
  return this;
};

Ember.isWatching = function isWatching(obj, key) {
  var meta = obj[META_KEY];
  return (meta && meta.watching[key]) > 0;
};

Ember.watch.flushPending = flushPendingChains;

Ember.unwatch = function(obj, keyName) {
  // can't watch length on Array - it is special...
  if (keyName === 'length' && Ember.typeOf(obj) === 'array') { return this; }

  var m = metaFor(obj), watching = m.watching, desc;

  if (watching[keyName] === 1) {
    watching[keyName] = 0;

    if (isKeyName(keyName)) {
      desc = m.descs[keyName];
      if (desc && desc.didUnwatch) { desc.didUnwatch(obj, keyName); }

      if ('function' === typeof obj.didUnwatchProperty) {
        obj.didUnwatchProperty(keyName);
      }

      if (MANDATORY_SETTER && keyName in obj) {
        o_defineProperty(obj, keyName, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: m.values[keyName]
        });
        delete m.values[keyName];
      }
    } else {
      chainsFor(obj).remove(keyName);
    }

  } else if (watching[keyName]>1) {
    watching[keyName]--;
  }

  return this;
};

Ember.rewatch = function(obj) {
  var m = metaFor(obj, false), chains = m.chains;

  // make sure the object has its own guid.
  if (GUID_KEY in obj && !obj.hasOwnProperty(GUID_KEY)) {
    Ember.generateGuid(obj, 'ember');
  }

  // make sure any chained watchers update.
  if (chains && chains.value() !== obj) {
    m.chains = chains.copy(obj);
  }

  return this;
};

Ember.finishChains = function(obj) {
  var m = metaFor(obj, false), chains = m.chains;
  if (chains) {
    if (chains.value() !== obj) {
      m.chains = chains = chains.copy(obj);
    }
    chains.didChange(true);
  }
};

function propertyWillChange(obj, keyName, value) {
  var m = metaFor(obj, false),
      watching = m.watching[keyName] > 0 || keyName === 'length',
      proto = m.proto,
      desc = m.descs[keyName];

  if (!watching) { return; }
  if (proto === obj) { return; }
  if (desc && desc.willChange) { desc.willChange(obj, keyName); }
  dependentKeysWillChange(obj, keyName, m);
  chainsWillChange(obj, keyName, m);
  Ember.notifyBeforeObservers(obj, keyName);
}

Ember.propertyWillChange = propertyWillChange;

function propertyDidChange(obj, keyName) {
  var m = metaFor(obj, false),
      watching = m.watching[keyName] > 0 || keyName === 'length',
      proto = m.proto,
      desc = m.descs[keyName];

  if (proto === obj) { return; }

  // shouldn't this mean that we're watching this key?
  if (desc && desc.didChange) { desc.didChange(obj, keyName); }
  if (!watching && keyName !== 'length') { return; }

  dependentKeysDidChange(obj, keyName, m);
  chainsDidChange(obj, keyName, m);
  Ember.notifyObservers(obj, keyName);
}

Ember.propertyDidChange = propertyDidChange;

var NODE_STACK = [];

Ember.destroy = function (obj) {
  var meta = obj[META_KEY], node, nodes, key, nodeObject;
  if (meta) {
    obj[META_KEY] = null;
    // remove chainWatchers to remove circular references that would prevent GC
    node = meta.chains;
    if (node) {
      NODE_STACK.push(node);
      // process tree
      while (NODE_STACK.length > 0) {
        node = NODE_STACK.pop();
        // push children
        nodes = node._chains;
        if (nodes) {
          for (key in nodes) {
            if (nodes.hasOwnProperty(key)) {
              NODE_STACK.push(nodes[key]);
            }
          }
        }
        // remove chainWatcher in node object
        if (node._watching) {
          nodeObject = node._object;
          if (nodeObject) {
            removeChainWatcher(nodeObject, node._key, node);
          }
        }
      }
    }
  }
};

})();



(function() {

Ember.warn("Computed properties will soon be cacheable by default. To enable this in your app, set `ENV.CP_DEFAULT_CACHEABLE = true`.", Ember.CP_DEFAULT_CACHEABLE);


var get = Ember.get,
    metaFor = Ember.meta,
    guidFor = Ember.guidFor,
    a_slice = [].slice,
    o_create = Ember.create,
    META_KEY = Ember.META_KEY,
    watch = Ember.watch,
    unwatch = Ember.unwatch;

function keysForDep(obj, depsMeta, depKey) {
  var keys = depsMeta[depKey];
  if (!keys) {
    // if there are no dependencies yet for a the given key
    // create a new empty list of dependencies for the key
    keys = depsMeta[depKey] = { __emberproto__: obj };
  } else if (keys.__emberproto__ !== obj) {
    // otherwise if the dependency list is inherited from
    // a superclass, clone the hash
    keys = depsMeta[depKey] = o_create(keys);
    keys.__emberproto__ = obj;
  }
  return keys;
}

function metaForDeps(obj, meta) {
  var deps = meta.deps;
  // If the current object has no dependencies...
  if (!deps) {
    // initialize the dependencies with a pointer back to
    // the current object
    deps = meta.deps = { __emberproto__: obj };
  } else if (deps.__emberproto__ !== obj) {
    // otherwise if the dependencies are inherited from the
    // object's superclass, clone the deps
    deps = meta.deps = o_create(deps);
    deps.__emberproto__ = obj;
  }
  return deps;
}

function addDependentKeys(desc, obj, keyName, meta) {
  // the descriptor has a list of dependent keys, so
  // add all of its dependent keys.
  var depKeys = desc._dependentKeys, depsMeta, idx, len, depKey, keys;
  if (!depKeys) return;

  depsMeta = metaForDeps(obj, meta);

  for(idx = 0, len = depKeys.length; idx < len; idx++) {
    depKey = depKeys[idx];
    // Lookup keys meta for depKey
    keys = keysForDep(obj, depsMeta, depKey);
    // Increment the number of times depKey depends on keyName.
    keys[keyName] = (keys[keyName] || 0) + 1;
    // Watch the depKey
    watch(obj, depKey);
  }
}

function removeDependentKeys(desc, obj, keyName, meta) {
  // the descriptor has a list of dependent keys, so
  // add all of its dependent keys.
  var depKeys = desc._dependentKeys, depsMeta, idx, len, depKey, keys;
  if (!depKeys) return;

  depsMeta = metaForDeps(obj, meta);

  for(idx = 0, len = depKeys.length; idx < len; idx++) {
    depKey = depKeys[idx];
    // Lookup keys meta for depKey
    keys = keysForDep(obj, depsMeta, depKey);
    // Increment the number of times depKey depends on keyName.
    keys[keyName] = (keys[keyName] || 0) - 1;
    // Watch the depKey
    unwatch(obj, depKey);
  }
}

function ComputedProperty(func, opts) {
  this.func = func;
  this._cacheable = (opts && opts.cacheable !== undefined) ? opts.cacheable : Ember.CP_DEFAULT_CACHEABLE;
  this._dependentKeys = opts && opts.dependentKeys;
}

Ember.ComputedProperty = ComputedProperty;
ComputedProperty.prototype = new Ember.Descriptor();

var ComputedPropertyPrototype = ComputedProperty.prototype;

ComputedPropertyPrototype.cacheable = function(aFlag) {
  this._cacheable = aFlag !== false;
  return this;
};

ComputedPropertyPrototype.volatile = function() {
  return this.cacheable(false);
};

ComputedPropertyPrototype.property = function() {
  var args = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    args.push(arguments[i]);
  }
  this._dependentKeys = args;
  return this;
};


ComputedPropertyPrototype.meta = function(meta) {
  if (arguments.length === 0) {
    return this._meta || {};
  } else {
    this._meta = meta;
    return this;
  }
};

ComputedPropertyPrototype.willWatch = function(obj, keyName) {
  // watch already creates meta for this instance
  var meta = obj[META_KEY];
  Ember.assert('watch should have setup meta to be writable', meta.source === obj);
  if (!(keyName in meta.cache)) {
    addDependentKeys(this, obj, keyName, meta);
  }
};

ComputedPropertyPrototype.didUnwatch = function(obj, keyName) {
  var meta = obj[META_KEY];
  Ember.assert('unwatch should have setup meta to be writable', meta.source === obj);
  if (!(keyName in meta.cache)) {
    // unwatch already creates meta for this instance
    removeDependentKeys(this, obj, keyName, meta);
  }
};

ComputedPropertyPrototype.didChange = function(obj, keyName) {
  // _suspended is set via a CP.set to ensure we don't clear
  // the cached value set by the setter
  if (this._cacheable && this._suspended !== obj) {
    var meta = metaFor(obj);
    if (keyName in meta.cache) {
      delete meta.cache[keyName];
      if (!meta.watching[keyName]) {
        removeDependentKeys(this, obj, keyName, meta);
      }
    }
  }
};

ComputedPropertyPrototype.get = function(obj, keyName) {
  var ret, cache, meta;
  if (this._cacheable) {
    meta = metaFor(obj);
    cache = meta.cache;
    if (keyName in cache) { return cache[keyName]; }
    ret = cache[keyName] = this.func.call(obj, keyName);
    if (!meta.watching[keyName]) {
      addDependentKeys(this, obj, keyName, meta);
    }
  } else {
    ret = this.func.call(obj, keyName);
  }
  return ret;
};

ComputedPropertyPrototype.set = function(obj, keyName, value) {
  var cacheable = this._cacheable,
      meta = metaFor(obj, cacheable),
      watched = meta.watching[keyName],
      oldSuspended = this._suspended,
      hadCachedValue,
      ret;

  this._suspended = obj;

  if (watched) { Ember.propertyWillChange(obj, keyName); }
  if (cacheable) {
    if (keyName in meta.cache) {
      delete meta.cache[keyName];
      hadCachedValue = true;
    }
  }
  ret = this.func.call(obj, keyName, value);
  if (cacheable) {
    if (!watched && !hadCachedValue) {
      addDependentKeys(this, obj, keyName, meta);
    }
    meta.cache[keyName] = ret;
  }
  if (watched) { Ember.propertyDidChange(obj, keyName); }
  this._suspended = oldSuspended;
  return ret;
};

ComputedPropertyPrototype.setup = function(obj, keyName) {
  var meta = obj[META_KEY];
  if (meta && meta.watching[keyName]) {
    addDependentKeys(this, obj, keyName, metaFor(obj));
  }
};

ComputedPropertyPrototype.teardown = function(obj, keyName) {
  var meta = metaFor(obj);

  if (meta.watching[keyName] || keyName in meta.cache) {
    removeDependentKeys(this, obj, keyName, meta);
  }

  if (this._cacheable) { delete meta.cache[keyName]; }

  return null; // no value to restore
};

Ember.computed = function(func) {
  var args;

  if (arguments.length > 1) {
    args = a_slice.call(arguments, 0, -1);
    func = a_slice.call(arguments, -1)[0];
  }

  var cp = new ComputedProperty(func);

  if (args) {
    cp.property.apply(cp, args);
  }

  return cp;
};

Ember.cacheFor = function cacheFor(obj, key) {
  var cache = metaFor(obj, false).cache;

  if (cache && key in cache) {
    return cache[key];
  }
};

Ember.computed.not = function(dependentKey) {
  return Ember.computed(dependentKey, function(key) {
    return !get(this, dependentKey);
  }).cacheable();
};

Ember.computed.empty = function(dependentKey) {
  return Ember.computed(dependentKey, function(key) {
    var val = get(this, dependentKey);
    return val === undefined || val === null || val === '' || (Ember.isArray(val) && get(val, 'length') === 0);
  }).cacheable();
};

Ember.computed.bool = function(dependentKey) {
  return Ember.computed(dependentKey, function(key) {
    return !!get(this, dependentKey);
  }).cacheable();
};

})();



(function() {

var o_create = Ember.create,
    meta = Ember.meta,
    metaPath = Ember.metaPath,
    guidFor = Ember.guidFor,
    a_slice = [].slice;

function actionSetFor(obj, eventName, target, writable) {
  return metaPath(obj, ['listeners', eventName, guidFor(target)], writable);
}

function targetSetFor(obj, eventName) {
  var listenerSet = meta(obj, false).listeners;
  if (!listenerSet) { return false; }

  return listenerSet[eventName] || false;
}

var SKIP_PROPERTIES = { __ember_source__: true };


function iterateSet(obj, eventName, callback, params) {
  var targetSet = targetSetFor(obj, eventName);
  if (!targetSet) { return false; }
  // Iterate through all elements of the target set
  for(var targetGuid in targetSet) {
    if (SKIP_PROPERTIES[targetGuid]) { continue; }

    var actionSet = targetSet[targetGuid];
    if (actionSet) {
      // Iterate through the elements of the action set
      for(var methodGuid in actionSet) {
        if (SKIP_PROPERTIES[methodGuid]) { continue; }

        var action = actionSet[methodGuid];
        if (action) {
          if (callback(action, params, obj) === true) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function invokeAction(action, params, sender) {
  var method = action.method, target = action.target;
  // If there is no target, the target is the object
  // on which the event was fired.
  if (!target) { target = sender; }
  if ('string' === typeof method) { method = target[method]; }
  if (params) {
    method.apply(target, params);
  } else {
    method.apply(target);
  }
}

function addListener(obj, eventName, target, method) {
  Ember.assert("You must pass at least an object and event name to Ember.addListener", !!obj && !!eventName);

  if (!method && 'function' === typeof target) {
    method = target;
    target = null;
  }

  var actionSet = actionSetFor(obj, eventName, target, true),
      methodGuid = guidFor(method);

  if (!actionSet[methodGuid]) {
    actionSet[methodGuid] = { target: target, method: method };
  }

  if ('function' === typeof obj.didAddListener) {
    obj.didAddListener(eventName, target, method);
  }
}


function removeListener(obj, eventName, target, method) {
  Ember.assert("You must pass at least an object and event name to Ember.removeListener", !!obj && !!eventName);

  if (!method && 'function' === typeof target) {
    method = target;
    target = null;
  }

  var actionSet = actionSetFor(obj, eventName, target, true),
      methodGuid = guidFor(method);

  // we can't simply delete this parameter, because if we do, we might
  // re-expose the property from the prototype chain.
  if (actionSet && actionSet[methodGuid]) { actionSet[methodGuid] = null; }

  if ('function' === typeof obj.didRemoveListener) {
    obj.didRemoveListener(eventName, target, method);
  }
}

function suspendListener(obj, eventName, target, method, callback) {
  if (!method && 'function' === typeof target) {
    method = target;
    target = null;
  }

  var actionSet = actionSetFor(obj, eventName, target, true),
      methodGuid = guidFor(method),
      action = actionSet && actionSet[methodGuid];

  actionSet[methodGuid] = null;
  try {
    return callback.call(target);
  } finally {
    actionSet[methodGuid] = action;
  }
}

function watchedEvents(obj) {
  var listeners = meta(obj, false).listeners, ret = [];

  if (listeners) {
    for(var eventName in listeners) {
      if (!SKIP_PROPERTIES[eventName] && listeners[eventName]) {
        ret.push(eventName);
      }
    }
  }
  return ret;
}


function sendEvent(obj, eventName, params) {
  // first give object a chance to handle it
  if (obj !== Ember && 'function' === typeof obj.sendEvent) {
    obj.sendEvent(eventName, params);
  }

  iterateSet(obj, eventName, invokeAction, params);
  return true;
}


function deferEvent(obj, eventName, params) {
  var actions = [];
  iterateSet(obj, eventName, function (action) {
    actions.push(action);
  });

  return function() {
    if (obj.isDestroyed) { return; }

    if (obj !== Ember && 'function' === typeof obj.sendEvent) {
      obj.sendEvent(eventName, params);
    }

    for (var i=0, len=actions.length; i < len; ++i) {
      invokeAction(actions[i], params, obj);
    }
  };
}

function hasListeners(obj, eventName) {
  if (iterateSet(obj, eventName, function() { return true; })) {
    return true;
  }

  // no listeners!  might as well clean this up so it is faster later.
  var set = metaPath(obj, ['listeners'], true);
  set[eventName] = null;

  return false;
}

function listenersFor(obj, eventName) {
  var ret = [];
  iterateSet(obj, eventName, function (action) {
    ret.push([action.target, action.method]);
  });
  return ret;
}

Ember.addListener = addListener;
Ember.removeListener = removeListener;
Ember._suspendListener = suspendListener;
Ember.sendEvent = sendEvent;
Ember.hasListeners = hasListeners;
Ember.watchedEvents = watchedEvents;
Ember.listenersFor = listenersFor;
Ember.deferEvent = deferEvent;

})();



(function() {

var slice = [].slice,
    forEach = Ember.ArrayPolyfills.forEach;


function invoke(target, method, args, ignore) {

  if (method === undefined) {
    method = target;
    target = undefined;
  }

  if ('string' === typeof method) { method = target[method]; }
  if (args && ignore > 0) {
    args = args.length > ignore ? slice.call(args, ignore) : null;
  }

  // Unfortunately in some browsers we lose the backtrace if we rethrow the existing error,
  // so in the event that we don't have an `onerror` handler we don't wrap in a try/catch
  if ('function' === typeof Ember.onerror) {
    try {
      // IE8's Function.prototype.apply doesn't accept undefined/null arguments.
      return method.apply(target || this, args || []);
    } catch (error) {
      Ember.onerror(error);
    }
  } else {
    // IE8's Function.prototype.apply doesn't accept undefined/null arguments.
    return method.apply(target || this, args || []);
  }
}


var timerMark; // used by timers...


var RunLoop = function(prev) {
  this._prev = prev || null;
  this.onceTimers = {};
};

RunLoop.prototype = {
  end: function() {
    this.flush();
  },

  prev: function() {
    return this._prev;
  },
  schedule: function(queueName, target, method) {
    var queues = this._queues, queue;
    if (!queues) { queues = this._queues = {}; }
    queue = queues[queueName];
    if (!queue) { queue = queues[queueName] = []; }

    var args = arguments.length > 3 ? slice.call(arguments, 3) : null;
    queue.push({ target: target, method: method, args: args });
    return this;
  },

  flush: function(queueName) {
    var queueNames, idx, len, queue, log;

    if (!this._queues) { return this; } // nothing to do

    function iter(item) {
      invoke(item.target, item.method, item.args);
    }

    Ember.watch.flushPending(); // make sure all chained watchers are setup

    if (queueName) {
      while (this._queues && (queue = this._queues[queueName])) {
        this._queues[queueName] = null;

        // the sync phase is to allow property changes to propagate.  don't
        // invoke observers until that is finished.
        if (queueName === 'sync') {
          log = Ember.LOG_BINDINGS;
          if (log) { Ember.Logger.log('Begin: Flush Sync Queue'); }

          Ember.beginPropertyChanges();
          try {
            forEach.call(queue, iter);
          } finally {
            Ember.endPropertyChanges();
          }

          if (log) { Ember.Logger.log('End: Flush Sync Queue'); }

        } else {
          forEach.call(queue, iter);
        }
      }

    } else {
      queueNames = Ember.run.queues;
      len = queueNames.length;
      idx = 0;

      outerloop:
      while (idx < len) {
        queueName = queueNames[idx];
        queue = this._queues && this._queues[queueName];
        delete this._queues[queueName];

        if (queue) {
          // the sync phase is to allow property changes to propagate.  don't
          // invoke observers until that is finished.
          if (queueName === 'sync') {
            log = Ember.LOG_BINDINGS;
            if (log) { Ember.Logger.log('Begin: Flush Sync Queue'); }

            Ember.beginPropertyChanges();
            try {
              forEach.call(queue, iter);
            } finally {
              Ember.endPropertyChanges();
            }

            if (log) { Ember.Logger.log('End: Flush Sync Queue'); }
          } else {
            forEach.call(queue, iter);
          }
        }

        // Loop through prior queues
        for (var i = 0; i <= idx; i++) {
          if (this._queues && this._queues[queueNames[i]]) {
            // Start over at the first queue with contents
            idx = i;
            continue outerloop;
          }
        }

        idx++;
      }
    }

    timerMark = null;

    return this;
  }

};

Ember.RunLoop = RunLoop;

Ember.run = function(target, method) {
  var ret, loop;
  run.begin();
  try {
    if (target || method) { ret = invoke(target, method, arguments, 2); }
  } finally {
    run.end();
  }
  return ret;
};

var run = Ember.run;


Ember.run.begin = function() {
  run.currentRunLoop = new RunLoop(run.currentRunLoop);
};


Ember.run.end = function() {
  Ember.assert('must have a current run loop', run.currentRunLoop);
  try {
    run.currentRunLoop.end();
  }
  finally {
    run.currentRunLoop = run.currentRunLoop.prev();
  }
};


Ember.run.queues = ['sync', 'actions', 'destroy', 'timers'];


Ember.run.schedule = function(queue, target, method) {
  var loop = run.autorun();
  loop.schedule.apply(loop, arguments);
};

var scheduledAutorun;

function autorun() {
  scheduledAutorun = null;
  if (run.currentRunLoop) { run.end(); }
}


Ember.run.hasScheduledTimers = function() {
  return !!(scheduledAutorun || scheduledLater || scheduledNext);
};

Ember.run.cancelTimers = function () {
  if (scheduledAutorun) {
    clearTimeout(scheduledAutorun);
    scheduledAutorun = null;
  }
  if (scheduledLater) {
    clearTimeout(scheduledLater);
    scheduledLater = null;
  }
  if (scheduledNext) {
    clearTimeout(scheduledNext);
    scheduledNext = null;
  }
  timers = {};
};

Ember.run.autorun = function() {
  if (!run.currentRunLoop) {
    Ember.assert("You have turned on testing mode, which disabled the run-loop's autorun. You will need to wrap any code with asynchronous side-effects in an Ember.run", !Ember.testing);

    run.begin();

    if (!scheduledAutorun) {
      scheduledAutorun = setTimeout(autorun, 1);
    }
  }

  return run.currentRunLoop;
};
Ember.run.sync = function() {
  run.autorun();
  run.currentRunLoop.flush('sync');
};

var timers = {}; // active timers...

var scheduledLater;

function invokeLaterTimers() {
  scheduledLater = null;
  var now = (+ new Date()), earliest = -1;
  for (var key in timers) {
    if (!timers.hasOwnProperty(key)) { continue; }
    var timer = timers[key];
    if (timer && timer.expires) {
      if (now >= timer.expires) {
        delete timers[key];
        invoke(timer.target, timer.method, timer.args, 2);
      } else {
        if (earliest<0 || (timer.expires < earliest)) earliest=timer.expires;
      }
    }
  }

  // schedule next timeout to fire...
  if (earliest > 0) { scheduledLater = setTimeout(invokeLaterTimers, earliest-(+ new Date())); }
}

Ember.run.later = function(target, method) {
  var args, expires, timer, guid, wait;

  // setTimeout compatibility...
  if (arguments.length===2 && 'function' === typeof target) {
    wait   = method;
    method = target;
    target = undefined;
    args   = [target, method];
  } else {
    args = slice.call(arguments);
    wait = args.pop();
  }

  expires = (+ new Date()) + wait;
  timer   = { target: target, method: method, expires: expires, args: args };
  guid    = Ember.guidFor(timer);
  timers[guid] = timer;
  run.once(timers, invokeLaterTimers);
  return guid;
};

function invokeOnceTimer(guid, onceTimers) {
  if (onceTimers[this.tguid]) { delete onceTimers[this.tguid][this.mguid]; }
  if (timers[guid]) { invoke(this.target, this.method, this.args, 2); }
  delete timers[guid];
}

Ember.run.once = function(target, method) {
  var tguid = Ember.guidFor(target),
      mguid = Ember.guidFor(method),
      onceTimers = run.autorun().onceTimers,
      guid = onceTimers[tguid] && onceTimers[tguid][mguid],
      timer;

  if (guid && timers[guid]) {
    timers[guid].args = slice.call(arguments); // replace args
  } else {
    timer = {
      target: target,
      method: method,
      args:   slice.call(arguments),
      tguid:  tguid,
      mguid:  mguid
    };

    guid  = Ember.guidFor(timer);
    timers[guid] = timer;
    if (!onceTimers[tguid]) { onceTimers[tguid] = {}; }
    onceTimers[tguid][mguid] = guid; // so it isn't scheduled more than once

    run.schedule('actions', timer, invokeOnceTimer, guid, onceTimers);
  }

  return guid;
};

var scheduledNext;

function invokeNextTimers() {
  scheduledNext = null;
  for(var key in timers) {
    if (!timers.hasOwnProperty(key)) { continue; }
    var timer = timers[key];
    if (timer.next) {
      delete timers[key];
      invoke(timer.target, timer.method, timer.args, 2);
    }
  }
}

Ember.run.next = function(target, method) {
  var guid,
      timer = {
        target: target,
        method: method,
        args: slice.call(arguments),
        next: true
      };

  guid = Ember.guidFor(timer);
  timers[guid] = timer;

  if (!scheduledNext) { scheduledNext = setTimeout(invokeNextTimers, 1); }
  return guid;
};

Ember.run.cancel = function(timer) {
  delete timers[timer];
};

})();



(function() {

Ember.LOG_BINDINGS = false || !!Ember.ENV.LOG_BINDINGS;

var get     = Ember.get,
    set     = Ember.set,
    guidFor = Ember.guidFor,
    isGlobalPath = Ember.isGlobalPath;



function getWithGlobals(obj, path) {
  return get(isGlobalPath(path) ? window : obj, path);
}

var Binding = function(toPath, fromPath) {
  this._direction = 'fwd';
  this._from = fromPath;
  this._to   = toPath;
  this._directionMap = Ember.Map.create();
};

Binding.prototype = {
  
  copy: function () {
    var copy = new Binding(this._to, this._from);
    if (this._oneWay) { copy._oneWay = true; }
    return copy;
  },

  from: function(path) {
    this._from = path;
    return this;
  },

  to: function(path) {
    this._to = path;
    return this;
  },

 
  oneWay: function() {
    this._oneWay = true;
    return this;
  },


  toString: function() {
    var oneWay = this._oneWay ? '[oneWay]' : '';
    return "Ember.Binding<" + guidFor(this) + ">(" + this._from + " -> " + this._to + ")" + oneWay;
  },

  connect: function(obj) {
    Ember.assert('Must pass a valid object to Ember.Binding.connect()', !!obj);

    var fromPath = this._from, toPath = this._to;
    Ember.trySet(obj, toPath, getWithGlobals(obj, fromPath));

    // add an observer on the object to be notified when the binding should be updated
    Ember.addObserver(obj, fromPath, this, this.fromDidChange);

    // if the binding is a two-way binding, also set up an observer on the target
    if (!this._oneWay) { Ember.addObserver(obj, toPath, this, this.toDidChange); }

    this._readyToSync = true;

    return this;
  },

  disconnect: function(obj) {
    Ember.assert('Must pass a valid object to Ember.Binding.disconnect()', !!obj);

    var twoWay = !this._oneWay;

    // remove an observer on the object so we're no longer notified of
    // changes that should update bindings.
    Ember.removeObserver(obj, this._from, this, this.fromDidChange);

    // if the binding is two-way, remove the observer from the target as well
    if (twoWay) { Ember.removeObserver(obj, this._to, this, this.toDidChange); }

    this._readyToSync = false; // disable scheduled syncs...
    return this;
  },

  fromDidChange: function(target) {
    this._scheduleSync(target, 'fwd');
  },

 
  toDidChange: function(target) {
    this._scheduleSync(target, 'back');
  },


  _scheduleSync: function(obj, dir) {
    var directionMap = this._directionMap;
    var existingDir = directionMap.get(obj);

    // if we haven't scheduled the binding yet, schedule it
    if (!existingDir) {
      Ember.run.schedule('sync', this, this._sync, obj);
      directionMap.set(obj, dir);
    }

    // If both a 'back' and 'fwd' sync have been scheduled on the same object,
    // default to a 'fwd' sync so that it remains deterministic.
    if (existingDir === 'back' && dir === 'fwd') {
      directionMap.set(obj, 'fwd');
    }
  },


  _sync: function(obj) {
    var log = Ember.LOG_BINDINGS;

    // don't synchronize destroyed objects or disconnected bindings
    if (obj.isDestroyed || !this._readyToSync) { return; }

    // get the direction of the binding for the object we are
    // synchronizing from
    var directionMap = this._directionMap;
    var direction = directionMap.get(obj);

    var fromPath = this._from, toPath = this._to;

    directionMap.remove(obj);

    // if we're synchronizing from the remote object...
    if (direction === 'fwd') {
      var fromValue = getWithGlobals(obj, this._from);
      if (log) {
        Ember.Logger.log(' ', this.toString(), '->', fromValue, obj);
      }
      if (this._oneWay) {
        Ember.trySet(obj, toPath, fromValue);
      } else {
        Ember._suspendObserver(obj, toPath, this, this.toDidChange, function () {
          Ember.trySet(obj, toPath, fromValue);
        });
      }
    // if we're synchronizing *to* the remote object
    } else if (direction === 'back') {
      var toValue = get(obj, this._to);
      if (log) {
        Ember.Logger.log(' ', this.toString(), '<-', toValue, obj);
      }
      Ember._suspendObserver(obj, fromPath, this, this.fromDidChange, function () {
        Ember.trySet(Ember.isGlobalPath(fromPath) ? window : obj, fromPath, toValue);
      });
    }
  }

};


function mixinProperties(to, from) {
  for (var key in from) {
    if (from.hasOwnProperty(key)) {
      to[key] = from[key];
    }
  }
}

mixinProperties(Binding,
 {

  
  from: function() {
    var C = this, binding = new C();
    return binding.from.apply(binding, arguments);
  },

  to: function() {
    var C = this, binding = new C();
    return binding.to.apply(binding, arguments);
  },

  oneWay: function(from, flag) {
    var C = this, binding = new C(null, from);
    return binding.oneWay(flag);
  }

});

Ember.Binding = Binding;

Ember.bind = function(obj, to, from) {
  return new Ember.Binding(to, from).connect(obj);
};

Ember.oneWay = function(obj, to, from) {
  return new Ember.Binding(to, from).oneWay().connect(obj);
};

})();



(function() {

var Mixin, REQUIRED, Alias,
    classToString, superClassString,
    a_map = Ember.ArrayPolyfills.map,
    a_indexOf = Ember.ArrayPolyfills.indexOf,
    a_forEach = Ember.ArrayPolyfills.forEach,
    a_slice = [].slice,
    EMPTY_META = {}, // dummy for non-writable meta
    META_SKIP = { __emberproto__: true, __ember_count__: true },
    o_create = Ember.create,
    defineProperty = Ember.defineProperty,
    guidFor = Ember.guidFor;


function mixinsMeta(obj) {
  var m = Ember.meta(obj, true), ret = m.mixins;
  if (!ret) {
    ret = m.mixins = { __emberproto__: obj };
  } else if (ret.__emberproto__ !== obj) {
    ret = m.mixins = o_create(ret);
    ret.__emberproto__ = obj;
  }
  return ret;
}


function initMixin(mixin, args) {
  if (args && args.length > 0) {
    mixin.mixins = a_map.call(args, function(x) {
      if (x instanceof Mixin) { return x; }

      // Note: Manually setup a primitive mixin here.  This is the only
      // way to actually get a primitive mixin.  This way normal creation
      // of mixins will give you combined mixins...
      var mixin = new Mixin();
      mixin.properties = x;
      return mixin;
    });
  }
  return mixin;
}


function isMethod(obj) {
  return 'function' === typeof obj &&
         obj.isMethod !== false &&
         obj !== Boolean && obj !== Object && obj !== Number && obj !== Array && obj !== Date && obj !== String;
}


function mergeMixins(mixins, m, descs, values, base) {
  var len = mixins.length, idx, mixin, guid, props, value, key, ovalue, concats;


  function removeKeys(keyName) {
    delete descs[keyName];
    delete values[keyName];
  }

  for(idx=0; idx < len; idx++) {
    mixin = mixins[idx];
    Ember.assert('Expected hash or Mixin instance, got ' + Object.prototype.toString.call(mixin), typeof mixin === 'object' && mixin !== null && Object.prototype.toString.call(mixin) !== '[object Array]');

    if (mixin instanceof Mixin) {
      guid = guidFor(mixin);
      if (m[guid]) { continue; }
      m[guid] = mixin;
      props = mixin.properties;
    } else {
      props = mixin; // apply anonymous mixin properties
    }

    if (props) {
      // reset before adding each new mixin to pickup concats from previous
      concats = values.concatenatedProperties || base.concatenatedProperties;
      if (props.concatenatedProperties) {
        concats = concats ? concats.concat(props.concatenatedProperties) : props.concatenatedProperties;
      }

      for (key in props) {
        if (!props.hasOwnProperty(key)) { continue; }
        value = props[key];
        if (value instanceof Ember.Descriptor) {
          if (value === REQUIRED && descs[key]) { continue; }

          descs[key]  = value;
          values[key] = undefined;
        } else {
          // impl super if needed...
          if (isMethod(value)) {
            ovalue = descs[key] === undefined && values[key];
            if (!ovalue) { ovalue = base[key]; }
            if ('function' !== typeof ovalue) { ovalue = null; }
            if (ovalue) {
              var o = value.__ember_observes__, ob = value.__ember_observesBefore__;
              value = Ember.wrap(value, ovalue);
              value.__ember_observes__ = o;
              value.__ember_observesBefore__ = ob;
            }
          } else if ((concats && a_indexOf.call(concats, key) >= 0) || key === 'concatenatedProperties') {
            var baseValue = values[key] || base[key];
            value = baseValue ? baseValue.concat(value) : Ember.makeArray(value);
          }

          descs[key] = undefined;
          values[key] = value;
        }
      }

      // manually copy toString() because some JS engines do not enumerate it
      if (props.hasOwnProperty('toString')) {
        base.toString = props.toString;
      }

    } else if (mixin.mixins) {
      mergeMixins(mixin.mixins, m, descs, values, base);
      if (mixin._without) { a_forEach.call(mixin._without, removeKeys); }
    }
  }
}


function writableReq(obj) {
  var m = Ember.meta(obj), req = m.required;
  if (!req || req.__emberproto__ !== obj) {
    req = m.required = req ? o_create(req) : { __ember_count__: 0 };
    req.__emberproto__ = obj;
  }
  return req;
}

var IS_BINDING = Ember.IS_BINDING = /^.+Binding$/;

function detectBinding(obj, key, value, m) {
  if (IS_BINDING.test(key)) {
    var bindings = m.bindings;
    if (!bindings) {
      bindings = m.bindings = { __emberproto__: obj };
    } else if (bindings.__emberproto__ !== obj) {
      bindings = m.bindings = o_create(m.bindings);
      bindings.__emberproto__ = obj;
    }
    bindings[key] = value;
  }
}

function connectBindings(obj, m) {
  // TODO Mixin.apply(instance) should disconnect binding if exists
  var bindings = m.bindings, key, binding, to;
  if (bindings) {
    for (key in bindings) {
      binding = key !== '__emberproto__' && bindings[key];
      if (binding) {
        to = key.slice(0, -7); // strip Binding off end
        if (binding instanceof Ember.Binding) {
          binding = binding.copy(); // copy prototypes' instance
          binding.to(to);
        } else { // binding is string path
          binding = new Ember.Binding(to, binding);
        }
        binding.connect(obj);
        obj[key] = binding;
      }
    }
    // mark as applied
    m.bindings = { __emberproto__: obj };
  }
}

function finishPartial(obj, m) {
  connectBindings(obj, m || Ember.meta(obj));
  return obj;
}

function applyMixin(obj, mixins, partial) {
  var descs = {}, values = {}, m = Ember.meta(obj), req = m.required,
      key, value, desc, prevValue, paths, len, idx;

  mergeMixins(mixins, mixinsMeta(obj), descs, values, obj);

  for(key in values) {
    if (key === 'contructor') { continue; }
    if (!values.hasOwnProperty(key)) { continue; }

    desc = descs[key];
    value = values[key];

    if (desc === REQUIRED) {
      if (!(key in obj)) {
        Ember.assert('Required property not defined: '+key, !!partial);

        // for partial applies add to hash of required keys
        req = writableReq(obj);
        req.__ember_count__++;
        req[key] = true;
      }
    } else {
      while (desc && desc instanceof Alias) {
        var altKey = desc.methodName;
        if (descs[altKey] || values[altKey]) {
          value = values[altKey];
          desc  = descs[altKey];
        } else if (m.descs[altKey]) {
          desc  = m.descs[altKey];
          value = undefined;
        } else {
          desc = undefined;
          value = obj[altKey];
        }
      }

      if (desc === undefined && value === undefined) { continue; }

      prevValue = obj[key];

      if ('function' === typeof prevValue) {
        if ((paths = prevValue.__ember_observesBefore__)) {
          len = paths.length;
          for (idx=0; idx < len; idx++) {
            Ember.removeBeforeObserver(obj, paths[idx], null, key);
          }
        } else if ((paths = prevValue.__ember_observes__)) {
          len = paths.length;
          for (idx=0; idx < len; idx++) {
            Ember.removeObserver(obj, paths[idx], null, key);
          }
        }
      }

      detectBinding(obj, key, value, m);

      defineProperty(obj, key, desc, value, m);

      if ('function' === typeof value) {
        if (paths = value.__ember_observesBefore__) {
          len = paths.length;
          for (idx=0; idx < len; idx++) {
            Ember.addBeforeObserver(obj, paths[idx], null, key);
          }
        } else if (paths = value.__ember_observes__) {
          len = paths.length;
          for (idx=0; idx < len; idx++) {
            Ember.addObserver(obj, paths[idx], null, key);
          }
        }
      }

      if (req && req[key]) {
        req = writableReq(obj);
        req.__ember_count__--;
        req[key] = false;
      }
    }
  }

  if (!partial) { // don't apply to prototype
    finishPartial(obj, m);
  }

  // Make sure no required attrs remain
  if (!partial && req && req.__ember_count__>0) {
    var keys = [];
    for (key in req) {
      if (META_SKIP[key]) { continue; }
      keys.push(key);
    }
    // TODO: Remove surrounding if clause from production build
    Ember.assert('Required properties not defined: '+keys.join(','));
  }
  return obj;
}

Ember.mixin = function(obj) {
  var args = a_slice.call(arguments, 1);
  applyMixin(obj, args, false);
  return obj;
};

Ember.Mixin = function() { return initMixin(this, arguments); };


Mixin = Ember.Mixin;

Mixin._apply = applyMixin;

Mixin.applyPartial = function(obj) {
  var args = a_slice.call(arguments, 1);
  return applyMixin(obj, args, true);
};

Mixin.finishPartial = finishPartial;

Mixin.create = function() {
  classToString.processed = false;
  var M = this;
  return initMixin(new M(), arguments);
};

var MixinPrototype = Mixin.prototype;

MixinPrototype.reopen = function() {
  var mixin, tmp;

  if (this.properties) {
    mixin = Mixin.create();
    mixin.properties = this.properties;
    delete this.properties;
    this.mixins = [mixin];
  } else if (!this.mixins) {
    this.mixins = [];
  }

  var len = arguments.length, mixins = this.mixins, idx;

  for(idx=0; idx < len; idx++) {
    mixin = arguments[idx];
    Ember.assert('Expected hash or Mixin instance, got ' + Object.prototype.toString.call(mixin), typeof mixin === 'object' && mixin !== null && Object.prototype.toString.call(mixin) !== '[object Array]');

    if (mixin instanceof Mixin) {
      mixins.push(mixin);
    } else {
      tmp = Mixin.create();
      tmp.properties = mixin;
      mixins.push(tmp);
    }
  }

  return this;
};

MixinPrototype.apply = function(obj) {
  return applyMixin(obj, [this], false);
};

MixinPrototype.applyPartial = function(obj) {
  return applyMixin(obj, [this], true);
};


function _detect(curMixin, targetMixin, seen) {
  var guid = guidFor(curMixin);

  if (seen[guid]) { return false; }
  seen[guid] = true;

  if (curMixin === targetMixin) { return true; }
  var mixins = curMixin.mixins, loc = mixins ? mixins.length : 0;
  while (--loc >= 0) {
    if (_detect(mixins[loc], targetMixin, seen)) { return true; }
  }
  return false;
}

MixinPrototype.detect = function(obj) {
  if (!obj) { return false; }
  if (obj instanceof Mixin) { return _detect(obj, this, {}); }
  var mixins = Ember.meta(obj, false).mixins;
  if (mixins) {
    return !!mixins[guidFor(this)];
  }
  return false;
};

MixinPrototype.without = function() {
  var ret = new Mixin(this);
  ret._without = a_slice.call(arguments);
  return ret;
};


function _keys(ret, mixin, seen) {
  if (seen[guidFor(mixin)]) { return; }
  seen[guidFor(mixin)] = true;

  if (mixin.properties) {
    var props = mixin.properties;
    for (var key in props) {
      if (props.hasOwnProperty(key)) { ret[key] = true; }
    }
  } else if (mixin.mixins) {
    a_forEach.call(mixin.mixins, function(x) { _keys(ret, x, seen); });
  }
}

MixinPrototype.keys = function() {
  var keys = {}, seen = {}, ret = [];
  _keys(keys, this, seen);
  for(var key in keys) {
    if (keys.hasOwnProperty(key)) { ret.push(key); }
  }
  return ret;
};



var NAME_KEY = Ember.GUID_KEY+'_name';
var get = Ember.get;


function processNames(paths, root, seen) {
  var idx = paths.length;
  for(var key in root) {
    if (!root.hasOwnProperty || !root.hasOwnProperty(key)) { continue; }
    var obj = root[key];
    paths[idx] = key;

    if (obj && obj.toString === classToString) {
      obj[NAME_KEY] = paths.join('.');
    } else if (obj && get(obj, 'isNamespace')) {
      if (seen[guidFor(obj)]) { continue; }
      seen[guidFor(obj)] = true;
      processNames(paths, obj, seen);
    }
  }
  paths.length = idx; // cut out last item
}


function findNamespaces() {
  var Namespace = Ember.Namespace, obj, isNamespace;

  if (Namespace.PROCESSED) { return; }

  for (var prop in window) {
    //  get(window.globalStorage, 'isNamespace') would try to read the storage for domain isNamespace and cause exception in Firefox.
    // globalStorage is a storage obsoleted by the WhatWG storage specification. See https://developer.mozilla.org/en/DOM/Storage#globalStorage
    if (prop === "globalStorage" && window.StorageList && window.globalStorage instanceof window.StorageList) { continue; }
    // Unfortunately, some versions of IE don't support window.hasOwnProperty
    if (window.hasOwnProperty && !window.hasOwnProperty(prop)) { continue; }

    // At times we are not allowed to access certain properties for security reasons.
    // There are also times where even if we can access them, we are not allowed to access their properties.
    try {
      obj = window[prop];
      isNamespace = obj && get(obj, 'isNamespace');
    } catch (e) {
      continue;
    }

    if (isNamespace) {
      Ember.deprecate("Namespaces should not begin with lowercase.", /^[A-Z]/.test(prop));
      obj[NAME_KEY] = prop;
    }
  }
}

Ember.identifyNamespaces = findNamespaces;


superClassString = function(mixin) {
  var superclass = mixin.superclass;
  if (superclass) {
    if (superclass[NAME_KEY]) { return superclass[NAME_KEY]; }
    else { return superClassString(superclass); }
  } else {
    return;
  }
};


classToString = function() {
  var Namespace = Ember.Namespace, namespace;

  // TODO: Namespace should really be in Metal
  if (Namespace) {
    if (!this[NAME_KEY] && !classToString.processed) {
      if (!Namespace.PROCESSED) {
        findNamespaces();
        Namespace.PROCESSED = true;
      }

      classToString.processed = true;

      var namespaces = Namespace.NAMESPACES;
      for (var i=0, l=namespaces.length; i<l; i++) {
        namespace = namespaces[i];
        processNames([namespace.toString()], namespace, {});
      }
    }
  }

  if (this[NAME_KEY]) {
    return this[NAME_KEY];
  } else {
    var str = superClassString(this);
    if (str) {
      return "(subclass of " + str + ")";
    } else {
      return "(unknown mixin)";
    }
  }
};

MixinPrototype.toString = classToString;

// returns the mixins currently applied to the specified object
// TODO: Make Ember.mixin
Mixin.mixins = function(obj) {
  var ret = [], mixins = Ember.meta(obj, false).mixins, key, mixin;
  if (mixins) {
    for(key in mixins) {
      if (META_SKIP[key]) { continue; }
      mixin = mixins[key];

      // skip primitive mixins since these are always anonymous
      if (!mixin.properties) { ret.push(mixins[key]); }
    }
  }
  return ret;
};

REQUIRED = new Ember.Descriptor();
REQUIRED.toString = function() { return '(Required Property)'; };

Ember.required = function() {
  return REQUIRED;
};

Alias = function(methodName) {
  this.methodName = methodName;
};
Alias.prototype = new Ember.Descriptor();

Ember.alias = function(methodName) {
  return new Alias(methodName);
};

Ember.observer = function(func) {
  var paths = a_slice.call(arguments, 1);
  func.__ember_observes__ = paths;
  return func;
};

// If observers ever become asynchronous, Ember.immediateObserver
// must remain synchronous.
Ember.immediateObserver = function() {
  for (var i=0, l=arguments.length; i<l; i++) {
    var arg = arguments[i];
    Ember.assert("Immediate observers must observe internal properties only, not properties on other objects.", typeof arg !== "string" || arg.indexOf('.') === -1);
  }

  return Ember.observer.apply(this, arguments);
};

Ember.beforeObserver = function(func) {
  var paths = a_slice.call(arguments, 1);
  func.__ember_observesBefore__ = paths;
  return func;
};

})();



(function() {

})();

(function() {

})();



(function() {

var indexOf = Ember.EnumerableUtils.indexOf;


var TYPE_MAP = {};
var t = "Boolean Number String Function Array Date RegExp Object".split(" ");
Ember.ArrayPolyfills.forEach.call(t, function(name) {
  TYPE_MAP[ "[object " + name + "]" ] = name.toLowerCase();
});

var toString = Object.prototype.toString;

Ember.typeOf = function(item) {
  var ret;

  ret = (item === null || item === undefined) ? String(item) : TYPE_MAP[toString.call(item)] || 'object';

  if (ret === 'function') {
    if (Ember.Object && Ember.Object.detect(item)) ret = 'class';
  } else if (ret === 'object') {
    if (item instanceof Error) ret = 'error';
    else if (Ember.Object && item instanceof Ember.Object) ret = 'instance';
    else ret = 'object';
  }

  return ret;
};

Ember.none = function(obj) {
  return obj === null || obj === undefined;
};

Ember.empty = function(obj) {
  return obj === null || obj === undefined || (obj.length === 0 && typeof obj !== 'function');
};

Ember.compare = function compare(v, w) {
  if (v === w) { return 0; }

  var type1 = Ember.typeOf(v);
  var type2 = Ember.typeOf(w);

  var Comparable = Ember.Comparable;
  if (Comparable) {
    if (type1==='instance' && Comparable.detect(v.constructor)) {
      return v.constructor.compare(v, w);
    }

    if (type2 === 'instance' && Comparable.detect(w.constructor)) {
      return 1-w.constructor.compare(w, v);
    }
  }

  // If we haven't yet generated a reverse-mapping of Ember.ORDER_DEFINITION,
  // do so now.
  var mapping = Ember.ORDER_DEFINITION_MAPPING;
  if (!mapping) {
    var order = Ember.ORDER_DEFINITION;
    mapping = Ember.ORDER_DEFINITION_MAPPING = {};
    var idx, len;
    for (idx = 0, len = order.length; idx < len;  ++idx) {
      mapping[order[idx]] = idx;
    }

    // We no longer need Ember.ORDER_DEFINITION.
    delete Ember.ORDER_DEFINITION;
  }

  var type1Index = mapping[type1];
  var type2Index = mapping[type2];

  if (type1Index < type2Index) { return -1; }
  if (type1Index > type2Index) { return 1; }

  // types are equal - so we have to check values now
  switch (type1) {
    case 'boolean':
    case 'number':
      if (v < w) { return -1; }
      if (v > w) { return 1; }
      return 0;

    case 'string':
      var comp = v.localeCompare(w);
      if (comp < 0) { return -1; }
      if (comp > 0) { return 1; }
      return 0;

    case 'array':
      var vLen = v.length;
      var wLen = w.length;
      var l = Math.min(vLen, wLen);
      var r = 0;
      var i = 0;
      while (r === 0 && i < l) {
        r = compare(v[i],w[i]);
        i++;
      }
      if (r !== 0) { return r; }

      // all elements are equal now
      // shorter array should be ordered first
      if (vLen < wLen) { return -1; }
      if (vLen > wLen) { return 1; }
      // arrays are equal now
      return 0;

    case 'instance':
      if (Ember.Comparable && Ember.Comparable.detect(v)) {
        return v.compare(v, w);
      }
      return 0;

    case 'date':
      var vNum = v.getTime();
      var wNum = w.getTime();
      if (vNum < wNum) { return -1; }
      if (vNum > wNum) { return 1; }
      return 0;

    default:
      return 0;
  }
};

function _copy(obj, deep, seen, copies) {
  var ret, loc, key;

  // primitive data types are immutable, just return them.
  if ('object' !== typeof obj || obj===null) return obj;

  // avoid cyclical loops
  if (deep && (loc=indexOf(seen, obj))>=0) return copies[loc];

  Ember.assert('Cannot clone an Ember.Object that does not implement Ember.Copyable', !(obj instanceof Ember.Object) || (Ember.Copyable && Ember.Copyable.detect(obj)));

  // IMPORTANT: this specific test will detect a native array only.  Any other
  // object will need to implement Copyable.
  if (Ember.typeOf(obj) === 'array') {
    ret = obj.slice();
    if (deep) {
      loc = ret.length;
      while(--loc>=0) ret[loc] = _copy(ret[loc], deep, seen, copies);
    }
  } else if (Ember.Copyable && Ember.Copyable.detect(obj)) {
    ret = obj.copy(deep, seen, copies);
  } else {
    ret = {};
    for(key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      ret[key] = deep ? _copy(obj[key], deep, seen, copies) : obj[key];
    }
  }

  if (deep) {
    seen.push(obj);
    copies.push(ret);
  }

  return ret;
}

Ember.copy = function(obj, deep) {
  // fast paths
  if ('object' !== typeof obj || obj===null) return obj; // can't copy primitives
  if (Ember.Copyable && Ember.Copyable.detect(obj)) return obj.copy(deep);
  return _copy(obj, deep, deep ? [] : null, deep ? [] : null);
};


Ember.inspect = function(obj) {
  var v, ret = [];
  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      v = obj[key];
      if (v === 'toString') { continue; } // ignore useless items
      if (Ember.typeOf(v) === 'function') { v = "function() { ... }"; }
      ret.push(key + ": " + v);
    }
  }
  return "{" + ret.join(" , ") + "}";
};


Ember.isEqual = function(a, b) {
  if (a && 'function'===typeof a.isEqual) return a.isEqual(b);
  return a === b;
};


Ember.ORDER_DEFINITION = Ember.ENV.ORDER_DEFINITION || [
  'undefined',
  'null',
  'boolean',
  'number',
  'string',
  'array',
  'object',
  'instance',
  'function',
  'class',
  'date'
];


Ember.keys = Object.keys;

if (!Ember.keys) {
  Ember.keys = function(obj) {
    var ret = [];
    for(var key in obj) {
      if (obj.hasOwnProperty(key)) { ret.push(key); }
    }
    return ret;
  };
}


Ember.Error = function() {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }
  this.message = tmp.message;
};

Ember.Error.prototype = Ember.create(Error.prototype);

})();



(function() {

var STRING_DASHERIZE_REGEXP = (/[ _]/g);
var STRING_DASHERIZE_CACHE = {};
var STRING_DECAMELIZE_REGEXP = (/([a-z])([A-Z])/g);
var STRING_CAMELIZE_REGEXP = (/(\-|_|\s)+(.)?/g);
var STRING_UNDERSCORE_REGEXP_1 = (/([a-z\d])([A-Z]+)/g);
var STRING_UNDERSCORE_REGEXP_2 = (/\-|\s+/g);

Ember.STRINGS = {};


Ember.String = {

 
  fmt: function(str, formats) {
    // first, replace any ORDERED replacements.
    var idx  = 0; // the current index for non-numerical replacements
    return str.replace(/%@([0-9]+)?/g, function(s, argIndex) {
      argIndex = (argIndex) ? parseInt(argIndex,0) - 1 : idx++ ;
      s = formats[argIndex];
      return ((s === null) ? '(null)' : (s === undefined) ? '' : s).toString();
    }) ;
  },

  loc: function(str, formats) {
    str = Ember.STRINGS[str] || str;
    return Ember.String.fmt(str, formats) ;
  },

  w: function(str) { return str.split(/\s+/); },

  decamelize: function(str) {
    return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
  },

  dasherize: function(str) {
    var cache = STRING_DASHERIZE_CACHE,
        ret   = cache[str];

    if (ret) {
      return ret;
    } else {
      ret = Ember.String.decamelize(str).replace(STRING_DASHERIZE_REGEXP,'-');
      cache[str] = ret;
    }

    return ret;
  },

  
  camelize: function(str) {
    return str.replace(STRING_CAMELIZE_REGEXP, function(match, separator, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },

  
  classify: function(str) {
    var camelized = Ember.String.camelize(str);
    return camelized.charAt(0).toUpperCase() + camelized.substr(1);
  },

  
  underscore: function(str) {
    return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').
      replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
  }
};

})();



(function() {

var fmt = Ember.String.fmt,
    w   = Ember.String.w,
    loc = Ember.String.loc,
    camelize = Ember.String.camelize,
    decamelize = Ember.String.decamelize,
    dasherize = Ember.String.dasherize,
    underscore = Ember.String.underscore;

if (Ember.EXTEND_PROTOTYPES) {

  
  String.prototype.fmt = function() {
    return fmt(this, arguments);
  };

  
  String.prototype.w = function() {
    return w(this);
  };

  
  String.prototype.loc = function() {
    return loc(this, arguments);
  };

  
  String.prototype.camelize = function() {
    return camelize(this);
  };

  
  String.prototype.decamelize = function() {
    return decamelize(this);
  };

  
  String.prototype.dasherize = function() {
    return dasherize(this);
  };

  
  String.prototype.underscore = function() {
    return underscore(this);
  };

}


})();



(function() {

var a_slice = Array.prototype.slice;

if (Ember.EXTEND_PROTOTYPES) {

  Function.prototype.property = function() {
    var ret = Ember.computed(this);
    return ret.property.apply(ret, arguments);
  };

  Function.prototype.observes = function() {
    this.__ember_observes__ = a_slice.call(arguments);
    return this;
  };

  
  Function.prototype.observesBefore = function() {
    this.__ember_observesBefore__ = a_slice.call(arguments);
    return this;
  };

}


})();



(function() {

})();



(function() {


var get = Ember.get, set = Ember.set;
var a_slice = Array.prototype.slice;
var a_indexOf = Ember.EnumerableUtils.indexOf;

var contexts = [];

function popCtx() {
  return contexts.length===0 ? {} : contexts.pop();
}


function pushCtx(ctx) {
  contexts.push(ctx);
  return null;
}


function iter(key, value) {
  var valueProvided = arguments.length === 2;

  function i(item) {
    var cur = get(item, key);
    return valueProvided ? value===cur : !!cur;
  }
  return i ;
}

Ember.Enumerable = Ember.Mixin.create(
   {

  isEnumerable: true,

  nextObject: Ember.required(Function),

  firstObject: Ember.computed(function() {
    if (get(this, 'length')===0) return undefined ;

    // handle generic enumerables
    var context = popCtx(), ret;
    ret = this.nextObject(0, null, context);
    pushCtx(context);
    return ret ;
  }).property('[]').cacheable(),


  lastObject: Ember.computed(function() {
    var len = get(this, 'length');
    if (len===0) return undefined ;
    var context = popCtx(), idx=0, cur, last = null;
    do {
      last = cur;
      cur = this.nextObject(idx++, last, context);
    } while (cur !== undefined);
    pushCtx(context);
    return last;
  }).property('[]').cacheable(),

  contains: function(obj) {
    return this.find(function(item) { return item===obj; }) !== undefined;
  },

  forEach: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = get(this, 'length'), last = null, context = popCtx();

    if (target === undefined) target = null;

    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      callback.call(target, next, idx, this);
      last = next ;
    }
    last = null ;
    context = pushCtx(context);
    return this ;
  },

  getEach: function(key) {
    return this.mapProperty(key);
  },


  setEach: function(key, value) {
    return this.forEach(function(item) {
      set(item, key, value);
    });
  },

  map: function(callback, target) {
    var ret = [];
    this.forEach(function(x, idx, i) {
      ret[idx] = callback.call(target, x, idx,i);
    });
    return ret ;
  },

  
  mapProperty: function(key) {
    return this.map(function(next) {
      return get(next, key);
    });
  },

  filter: function(callback, target) {
    var ret = [];
    this.forEach(function(x, idx, i) {
      if (callback.call(target, x, idx, i)) ret.push(x);
    });
    return ret ;
  },

  filterProperty: function(key, value) {
    return this.filter(iter.apply(this, arguments));
  },

  find: function(callback, target) {
    var len = get(this, 'length') ;
    if (target === undefined) target = null;

    var last = null, next, found = false, ret ;
    var context = popCtx();
    for(var idx=0;idx<len && !found;idx++) {
      next = this.nextObject(idx, last, context) ;
      if (found = callback.call(target, next, idx, this)) ret = next ;
      last = next ;
    }
    next = last = null ;
    context = pushCtx(context);
    return ret ;
  },

  findProperty: function(key, value) {
    return this.find(iter.apply(this, arguments));
  },

  every: function(callback, target) {
    return !this.find(function(x, idx, i) {
      return !callback.call(target, x, idx, i);
    });
  },

  everyProperty: function(key, value) {
    return this.every(iter.apply(this, arguments));
  },

  some: function(callback, target) {
    return !!this.find(function(x, idx, i) {
      return !!callback.call(target, x, idx, i);
    });
  },

 
  someProperty: function(key, value) {
    return this.some(iter.apply(this, arguments));
  },

  reduce: function(callback, initialValue, reducerProperty) {
    if (typeof callback !== "function") { throw new TypeError(); }

    var ret = initialValue;

    this.forEach(function(item, i) {
      ret = callback.call(null, ret, item, i, this, reducerProperty);
    }, this);

    return ret;
  },

  invoke: function(methodName) {
    var args, ret = [];
    if (arguments.length>1) args = a_slice.call(arguments, 1);

    this.forEach(function(x, idx) {
      var method = x && x[methodName];
      if ('function' === typeof method) {
        ret[idx] = args ? method.apply(x, args) : method.call(x);
      }
    }, this);

    return ret;
  },

  toArray: function() {
    var ret = [];
    this.forEach(function(o, idx) { ret[idx] = o; });
    return ret ;
  },

  compact: function() { return this.without(null); },

  without: function(value) {
    if (!this.contains(value)) return this; // nothing to do
    var ret = [] ;
    this.forEach(function(k) {
      if (k !== value) ret[ret.length] = k;
    }) ;
    return ret ;
  },

  uniq: function() {
    var ret = [];
    this.forEach(function(k){
      if (a_indexOf(ret, k)<0) ret.push(k);
    });
    return ret;
  },

  '[]': Ember.computed(function(key, value) {
    return this;
  }).property().cacheable(),

  addEnumerableObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'enumerableWillChange',
        didChange  = (opts && opts.didChange) || 'enumerableDidChange';

    var hasObservers = get(this, 'hasEnumerableObservers');
    if (!hasObservers) Ember.propertyWillChange(this, 'hasEnumerableObservers');
    Ember.addListener(this, '@enumerable:before', target, willChange);
    Ember.addListener(this, '@enumerable:change', target, didChange);
    if (!hasObservers) Ember.propertyDidChange(this, 'hasEnumerableObservers');
    return this;
  },

  removeEnumerableObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'enumerableWillChange',
        didChange  = (opts && opts.didChange) || 'enumerableDidChange';

    var hasObservers = get(this, 'hasEnumerableObservers');
    if (hasObservers) Ember.propertyWillChange(this, 'hasEnumerableObservers');
    Ember.removeListener(this, '@enumerable:before', target, willChange);
    Ember.removeListener(this, '@enumerable:change', target, didChange);
    if (hasObservers) Ember.propertyDidChange(this, 'hasEnumerableObservers');
    return this;
  },

  hasEnumerableObservers: Ember.computed(function() {
    return Ember.hasListeners(this, '@enumerable:change') || Ember.hasListeners(this, '@enumerable:before');
  }).property().cacheable(),

  enumerableContentWillChange: function(removing, adding) {

    var removeCnt, addCnt, hasDelta;

    if ('number' === typeof removing) removeCnt = removing;
    else if (removing) removeCnt = get(removing, 'length');
    else removeCnt = removing = -1;

    if ('number' === typeof adding) addCnt = adding;
    else if (adding) addCnt = get(adding,'length');
    else addCnt = adding = -1;

    hasDelta = addCnt<0 || removeCnt<0 || addCnt-removeCnt!==0;

    if (removing === -1) removing = null;
    if (adding   === -1) adding   = null;

    Ember.propertyWillChange(this, '[]');
    if (hasDelta) Ember.propertyWillChange(this, 'length');
    Ember.sendEvent(this, '@enumerable:before', [this, removing, adding]);

    return this;
  },

  enumerableContentDidChange: function(removing, adding) {
    var notify = this.propertyDidChange, removeCnt, addCnt, hasDelta;

    if ('number' === typeof removing) removeCnt = removing;
    else if (removing) removeCnt = get(removing, 'length');
    else removeCnt = removing = -1;

    if ('number' === typeof adding) addCnt = adding;
    else if (adding) addCnt = get(adding, 'length');
    else addCnt = adding = -1;

    hasDelta = addCnt<0 || removeCnt<0 || addCnt-removeCnt!==0;

    if (removing === -1) removing = null;
    if (adding   === -1) adding   = null;

    Ember.sendEvent(this, '@enumerable:change', [this, removing, adding]);
    if (hasDelta) Ember.propertyDidChange(this, 'length');
    Ember.propertyDidChange(this, '[]');

    return this ;
  }

}) ;




})();



(function() {


var get = Ember.get, set = Ember.set, meta = Ember.meta, map = Ember.EnumerableUtils.map, cacheFor = Ember.cacheFor;


function none(obj) { return obj===null || obj===undefined; }

Ember.Array = Ember.Mixin.create(Ember.Enumerable,  {

  isSCArray: true,

  
  length: Ember.required(),


  objectAt: function(idx) {
    if ((idx < 0) || (idx>=get(this, 'length'))) return undefined ;
    return get(this, idx);
  },

  objectsAt: function(indexes) {
    var self = this;
    return map(indexes, function(idx){ return self.objectAt(idx); });
  },

  
  nextObject: function(idx) {
    return this.objectAt(idx);
  },

  
  '[]': Ember.computed(function(key, value) {
    if (value !== undefined) this.replace(0, get(this, 'length'), value) ;
    return this ;
  }).property().cacheable(),

  firstObject: Ember.computed(function() {
    return this.objectAt(0);
  }).property().cacheable(),

  lastObject: Ember.computed(function() {
    return this.objectAt(get(this, 'length')-1);
  }).property().cacheable(),

  
  contains: function(obj){
    return this.indexOf(obj) >= 0;
  },

  
  slice: function(beginIndex, endIndex) {
    var ret = [];
    var length = get(this, 'length') ;
    if (none(beginIndex)) beginIndex = 0 ;
    if (none(endIndex) || (endIndex > length)) endIndex = length ;
    while(beginIndex < endIndex) {
      ret[ret.length] = this.objectAt(beginIndex++) ;
    }
    return ret ;
  },

  indexOf: function(object, startAt) {
    var idx, len = get(this, 'length');

    if (startAt === undefined) startAt = 0;
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this.objectAt(idx, true) === object) return idx ;
    }
    return -1;
  },
  lastIndexOf: function(object, startAt) {
    var idx, len = get(this, 'length');

    if (startAt === undefined || startAt >= len) startAt = len-1;
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this.objectAt(idx) === object) return idx ;
    }
    return -1;
  },

  addArrayObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'arrayWillChange',
        didChange  = (opts && opts.didChange) || 'arrayDidChange';

    var hasObservers = get(this, 'hasArrayObservers');
    if (!hasObservers) Ember.propertyWillChange(this, 'hasArrayObservers');
    Ember.addListener(this, '@array:before', target, willChange);
    Ember.addListener(this, '@array:change', target, didChange);
    if (!hasObservers) Ember.propertyDidChange(this, 'hasArrayObservers');
    return this;
  },

  removeArrayObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'arrayWillChange',
        didChange  = (opts && opts.didChange) || 'arrayDidChange';

    var hasObservers = get(this, 'hasArrayObservers');
    if (hasObservers) Ember.propertyWillChange(this, 'hasArrayObservers');
    Ember.removeListener(this, '@array:before', target, willChange);
    Ember.removeListener(this, '@array:change', target, didChange);
    if (hasObservers) Ember.propertyDidChange(this, 'hasArrayObservers');
    return this;
  },

  
  hasArrayObservers: Ember.computed(function() {
    return Ember.hasListeners(this, '@array:change') || Ember.hasListeners(this, '@array:before');
  }).property().cacheable(),

  
  arrayContentWillChange: function(startIdx, removeAmt, addAmt) {

    // if no args are passed assume everything changes
    if (startIdx===undefined) {
      startIdx = 0;
      removeAmt = addAmt = -1;
    } else {
      if (removeAmt === undefined) removeAmt=-1;
      if (addAmt    === undefined) addAmt=-1;
    }

    // Make sure the @each proxy is set up if anyone is observing @each
    if (Ember.isWatching(this, '@each')) { get(this, '@each'); }

    Ember.sendEvent(this, '@array:before', [this, startIdx, removeAmt, addAmt]);

    var removing, lim;
    if (startIdx>=0 && removeAmt>=0 && get(this, 'hasEnumerableObservers')) {
      removing = [];
      lim = startIdx+removeAmt;
      for(var idx=startIdx;idx<lim;idx++) removing.push(this.objectAt(idx));
    } else {
      removing = removeAmt;
    }

    this.enumerableContentWillChange(removing, addAmt);

    return this;
  },

  arrayContentDidChange: function(startIdx, removeAmt, addAmt) {

    // if no args are passed assume everything changes
    if (startIdx===undefined) {
      startIdx = 0;
      removeAmt = addAmt = -1;
    } else {
      if (removeAmt === undefined) removeAmt=-1;
      if (addAmt    === undefined) addAmt=-1;
    }

    var adding, lim;
    if (startIdx>=0 && addAmt>=0 && get(this, 'hasEnumerableObservers')) {
      adding = [];
      lim = startIdx+addAmt;
      for(var idx=startIdx;idx<lim;idx++) adding.push(this.objectAt(idx));
    } else {
      adding = addAmt;
    }

    this.enumerableContentDidChange(removeAmt, adding);
    Ember.sendEvent(this, '@array:change', [this, startIdx, removeAmt, addAmt]);

    var length      = get(this, 'length'),
        cachedFirst = cacheFor(this, 'firstObject'),
        cachedLast  = cacheFor(this, 'lastObject');
    if (this.objectAt(0) !== cachedFirst) {
      Ember.propertyWillChange(this, 'firstObject');
      Ember.propertyDidChange(this, 'firstObject');
    }
    if (this.objectAt(length-1) !== cachedLast) {
      Ember.propertyWillChange(this, 'lastObject');
      Ember.propertyDidChange(this, 'lastObject');
    }

    return this;
  },

  
  '@each': Ember.computed(function() {
    if (!this.__each) this.__each = new Ember.EachProxy(this);
    return this.__each;
  }).property().cacheable()

}) ;

})();



(function() {

Ember.Comparable = Ember.Mixin.create( {

  
  isComparable: true,

  
  compare: Ember.required(Function)

});


})();



(function() {

var get = Ember.get, set = Ember.set;

Ember.Copyable = Ember.Mixin.create(
 {

  copy: Ember.required(Function),

  frozenCopy: function() {
    if (Ember.Freezable && Ember.Freezable.detect(this)) {
      return get(this, 'isFrozen') ? this : this.copy().freeze();
    } else {
      throw new Error(Ember.String.fmt("%@ does not support freezing", [this]));
    }
  }
});




})();



(function() {

var get = Ember.get, set = Ember.set;

Ember.Freezable = Ember.Mixin.create(
{

  isFrozen: false,
  freeze: function() {
    if (get(this, 'isFrozen')) return this;
    set(this, 'isFrozen', true);
    return this;
  }

});

Ember.FROZEN_ERROR = "Frozen object cannot be modified.";




})();



(function() {

var forEach = Ember.EnumerableUtils.forEach;

Ember.MutableEnumerable = Ember.Mixin.create(Ember.Enumerable,
  {

  addObject: Ember.required(Function),

  addObjects: function(objects) {
    Ember.beginPropertyChanges(this);
    forEach(objects, function(obj) { this.addObject(obj); }, this);
    Ember.endPropertyChanges(this);
    return this;
  },

  removeObject: Ember.required(Function),


  removeObjects: function(objects) {
    Ember.beginPropertyChanges(this);
    forEach(objects, function(obj) { this.removeObject(obj); }, this);
    Ember.endPropertyChanges(this);
    return this;
  }

});

})();



(function() {

var OUT_OF_RANGE_EXCEPTION = "Index out of range" ;
var EMPTY = [];


var get = Ember.get, set = Ember.set, forEach = Ember.EnumerableUtils.forEach;

Ember.MutableArray = Ember.Mixin.create(Ember.Array, Ember.MutableEnumerable,
 {

  replace: Ember.required(),

  clear: function () {
    var len = get(this, 'length');
    if (len === 0) return this;
    this.replace(0, len, EMPTY);
    return this;
  },

  insertAt: function(idx, object) {
    if (idx > get(this, 'length')) throw new Error(OUT_OF_RANGE_EXCEPTION) ;
    this.replace(idx, 0, [object]) ;
    return this ;
  },

  removeAt: function(start, len) {

    var delta = 0;

    if ('number' === typeof start) {

      if ((start < 0) || (start >= get(this, 'length'))) {
        throw new Error(OUT_OF_RANGE_EXCEPTION);
      }

      // fast case
      if (len === undefined) len = 1;
      this.replace(start, len, EMPTY);
    }

    return this ;
  },

  pushObject: function(obj) {
    this.insertAt(get(this, 'length'), obj) ;
    return obj ;
  },

  pushObjects: function(objects) {
    this.replace(get(this, 'length'), 0, objects);
    return this;
  },

  popObject: function() {
    var len = get(this, 'length') ;
    if (len === 0) return null ;

    var ret = this.objectAt(len-1) ;
    this.removeAt(len-1, 1) ;
    return ret ;
  },

  shiftObject: function() {
    if (get(this, 'length') === 0) return null ;
    var ret = this.objectAt(0) ;
    this.removeAt(0) ;
    return ret ;
  },

 
  unshiftObject: function(obj) {
    this.insertAt(0, obj) ;
    return obj ;
  },

 
  unshiftObjects: function(objects) {
    this.replace(0, 0, objects);
    return this;
  },

 
  reverseObjects: function() {
    var len = get(this, 'length');
    if (len === 0) return this;
    var objects = this.toArray().reverse();
    this.replace(0, len, objects);
    return this;
  },


  removeObject: function(obj) {
    var loc = get(this, 'length') || 0;
    while(--loc >= 0) {
      var curObject = this.objectAt(loc) ;
      if (curObject === obj) this.removeAt(loc) ;
    }
    return this ;
  },


  addObject: function(obj) {
    if (!this.contains(obj)) this.pushObject(obj);
    return this ;
  }

});


})();



(function() {

var get = Ember.get, set = Ember.set, defineProperty = Ember.defineProperty;

Ember.Observable = Ember.Mixin.create( {

  
  isObserverable: true,

  get: function(keyName) {
    return get(this, keyName);
  },

  getProperties: function() {
    var ret = {};
    var propertyNames = arguments;
    if (arguments.length === 1 && Ember.typeOf(arguments[0]) === 'array') {
      propertyNames = arguments[0];
    }
    for(var i = 0; i < propertyNames.length; i++) {
      ret[propertyNames[i]] = get(this, propertyNames[i]);
    }
    return ret;
  },

  set: function(keyName, value) {
    set(this, keyName, value);
    return this;
  },

  setProperties: function(hash) {
    return Ember.setProperties(this, hash);
  },

  beginPropertyChanges: function() {
    Ember.beginPropertyChanges();
    return this;
  },

  endPropertyChanges: function() {
    Ember.endPropertyChanges();
    return this;
  },


  propertyWillChange: function(keyName){
    Ember.propertyWillChange(this, keyName);
    return this;
  },

 
  propertyDidChange: function(keyName) {
    Ember.propertyDidChange(this, keyName);
    return this;
  },
  
  
  notifyPropertyChange: function(keyName) {
    this.propertyWillChange(keyName);
    this.propertyDidChange(keyName);
    return this;
  },

  addBeforeObserver: function(key, target, method) {
    Ember.addBeforeObserver(this, key, target, method);
  },

  addObserver: function(key, target, method) {
    Ember.addObserver(this, key, target, method);
  },

  
  removeObserver: function(key, target, method) {
    Ember.removeObserver(this, key, target, method);
  },

  
  hasObserverFor: function(key) {
    return Ember.hasListeners(this, key+':change');
  },

  
  unknownProperty: function(key) {
    return undefined;
  },

  
  setUnknownProperty: function(key, value) {
    defineProperty(this, key);
    set(this, key, value);
  },

  
  getPath: function(path) {
    Ember.deprecate("getPath is deprecated since get now supports paths");
    return this.get(path);
  },

  
  setPath: function(path, value) {
    Ember.deprecate("setPath is deprecated since set now supports paths");
    return this.set(path, value);
  },

 
  getWithDefault: function(keyName, defaultValue) {
    return Ember.getWithDefault(this, keyName, defaultValue);
  },

  
  incrementProperty: function(keyName, increment) {
    if (!increment) { increment = 1; }
    set(this, keyName, (get(this, keyName) || 0)+increment);
    return get(this, keyName);
  },
  
  
  decrementProperty: function(keyName, increment) {
    if (!increment) { increment = 1; }
    set(this, keyName, (get(this, keyName) || 0)-increment);
    return get(this, keyName);
  },

  
  toggleProperty: function(keyName) {
    set(this, keyName, !get(this, keyName));
    return get(this, keyName);
  },

 
  cacheFor: function(keyName) {
    return Ember.cacheFor(this, keyName);
  },

  observersForKey: function(keyName) {
    return Ember.observersFor(this, keyName);
  }
});




})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.TargetActionSupport = Ember.Mixin.create({
  target: null,
  action: null,

  targetObject: Ember.computed(function() {
    var target = get(this, 'target');

    if (Ember.typeOf(target) === "string") {
      var value = get(this, target);
      if (value === undefined) { value = get(window, target); }
      return value;
    } else {
      return target;
    }
  }).property('target').cacheable(),

  triggerAction: function() {
    var action = get(this, 'action'),
        target = get(this, 'targetObject');

    if (target && action) {
      var ret;

      if (typeof target.send === 'function') {
        ret = target.send(action, this);
      } else {
        if (typeof action === 'string') {
          action = target[action];
        }
        ret = action.call(target, this);
      }
      if (ret !== false) ret = true;

      return ret;
    } else {
      return false;
    }
  }
});

})();



(function() {

Ember.Evented = Ember.Mixin.create(
   {
  on: function(name, target, method) {
    Ember.addListener(this, name, target, method);
  },

  one: function(name, target, method) {
    if (!method) {
      method = target;
      target = null;
    }

    var self = this;
    var wrapped = function() {
      Ember.removeListener(self, name, target, wrapped);

      if ('string' === typeof method) { method = this[method]; }

     
      method.apply(this, arguments);
    };

    this.on(name, target, wrapped);
  },

  trigger: function(name) {
    var args = [], i, l;
    for (i = 1, l = arguments.length; i < l; i++) {
      args.push(arguments[i]);
    }
    Ember.sendEvent(this, name, args);
  },

  fire: function(name) {
    Ember.deprecate("Ember.Evented#fire() has been deprecated in favor of trigger() for compatibility with jQuery. It will be removed in 1.0. Please update your code to call trigger() instead.");
    this.trigger.apply(this, arguments);
  },

  off: function(name, target, method) {
    Ember.removeListener(this, name, target, method);
  },

  has: function(name) {
    return Ember.hasListeners(this, name);
  }
});

})();



(function() {

})();



(function() {

var classToString = Ember.Mixin.prototype.toString;
var set = Ember.set, get = Ember.get;
var o_create = Ember.create,
    o_defineProperty = Ember.platform.defineProperty,
    a_slice = Array.prototype.slice,
    meta = Ember.meta,
    rewatch = Ember.rewatch,
    finishChains = Ember.finishChains,
    finishPartial = Ember.Mixin.finishPartial,
    reopen = Ember.Mixin.prototype.reopen;

var undefinedDescriptor = {
  configurable: true,
  writable: true,
  enumerable: false,
  value: undefined
};


function makeCtor() {

  var wasApplied = false, initMixins;

  var Class = function() {
    if (!wasApplied) {
      Class.proto(); // prepare prototype...
    }
    var m = Ember.meta(this);
    m.proto = this;
    if (initMixins) {
      this.reopen.apply(this, initMixins);
      initMixins = null;
    }
    o_defineProperty(this, Ember.GUID_KEY, undefinedDescriptor);
    o_defineProperty(this, '_super', undefinedDescriptor);
    finishPartial(this, m);
    delete m.proto;
    finishChains(this);
    this.init.apply(this, arguments);
  };

  Class.toString = classToString;
  Class.willReopen = function() {
    if (wasApplied) {
      Class.PrototypeMixin = Ember.Mixin.create(Class.PrototypeMixin);
    }

    wasApplied = false;
  };
  Class._initMixins = function(args) { initMixins = args; };

  Class.proto = function() {
    var superclass = Class.superclass;
    if (superclass) { superclass.proto(); }

    if (!wasApplied) {
      wasApplied = true;
      Class.PrototypeMixin.applyPartial(Class.prototype);
      rewatch(Class.prototype);
    }

    return this.prototype;
  };

  return Class;

}

var CoreObject = makeCtor();

CoreObject.PrototypeMixin = Ember.Mixin.create(
 {

  reopen: function() {
    Ember.Mixin._apply(this, arguments, true);
    return this;
  },

  isInstance: true,

  init: function() {},

  isDestroyed: false,

  isDestroying: false,

  destroy: function() {
    if (this.isDestroying) { return; }

    this.isDestroying = true;

    if (this.willDestroy) { this.willDestroy(); }

    set(this, 'isDestroyed', true);
    Ember.run.schedule('destroy', this, this._scheduledDestroy);
    return this;
  },

  _scheduledDestroy: function() {
    Ember.destroy(this);
    if (this.didDestroy) { this.didDestroy(); }
  },

  bind: function(to, from) {
    if (!(from instanceof Ember.Binding)) { from = Ember.Binding.from(from); }
    from.to(to).connect(this);
    return from;
  },

  toString: function() {
    return '<'+this.constructor.toString()+':'+Ember.guidFor(this)+'>';
  }
});

if (Ember.config.overridePrototypeMixin) {
  Ember.config.overridePrototypeMixin(CoreObject.PrototypeMixin);
}

CoreObject.__super__ = null;

var ClassMixin = Ember.Mixin.create(
/** @scope Ember.ClassMixin.prototype */ {

  ClassMixin: Ember.required(),

  PrototypeMixin: Ember.required(),

  isClass: true,

  isMethod: false,

  extend: function() {
    var Class = makeCtor(), proto;
    Class.ClassMixin = Ember.Mixin.create(this.ClassMixin);
    Class.PrototypeMixin = Ember.Mixin.create(this.PrototypeMixin);

    Class.ClassMixin.ownerConstructor = Class;
    Class.PrototypeMixin.ownerConstructor = Class;

    reopen.apply(Class.PrototypeMixin, arguments);

    Class.superclass = this;
    Class.__super__  = this.prototype;

    proto = Class.prototype = o_create(this.prototype);
    proto.constructor = Class;
    Ember.generateGuid(proto, 'ember');
    meta(proto).proto = proto; // this will disable observers on prototype

    Class.ClassMixin.apply(Class);
    return Class;
  },

  create: function() {
    var C = this;
    if (arguments.length>0) { this._initMixins(arguments); }
    return new C();
  },

  reopen: function() {
    this.willReopen();
    reopen.apply(this.PrototypeMixin, arguments);
    return this;
  },

  reopenClass: function() {
    reopen.apply(this.ClassMixin, arguments);
    Ember.Mixin._apply(this, arguments, false);
    return this;
  },

  detect: function(obj) {
    if ('function' !== typeof obj) { return false; }
    while(obj) {
      if (obj===this) { return true; }
      obj = obj.superclass;
    }
    return false;
  },

  detectInstance: function(obj) {
    return obj instanceof this;
  },

  metaForProperty: function(key) {
    var desc = meta(this.proto(), false).descs[key];

    Ember.assert("metaForProperty() could not find a computed property with key '"+key+"'.", !!desc && desc instanceof Ember.ComputedProperty);
    return desc._meta || {};
  },

  eachComputedProperty: function(callback, binding) {
    var proto = this.proto(),
        descs = meta(proto).descs,
        empty = {},
        property;

    for (var name in descs) {
      property = descs[name];

      if (property instanceof Ember.ComputedProperty) {
        callback.call(binding || this, name, property._meta || empty);
      }
    }
  }

});

if (Ember.config.overrideClassMixin) {
  Ember.config.overrideClassMixin(ClassMixin);
}

CoreObject.ClassMixin = ClassMixin;
ClassMixin.apply(CoreObject);

Ember.CoreObject = CoreObject;




})();



(function() {

var get = Ember.get, set = Ember.set, guidFor = Ember.guidFor, none = Ember.none;

Ember.Set = Ember.CoreObject.extend(Ember.MutableEnumerable, Ember.Copyable, Ember.Freezable,
   {

 
  length: 0,
  clear: function() {
    if (this.isFrozen) { throw new Error(Ember.FROZEN_ERROR); }

    var len = get(this, 'length');
    if (len === 0) { return this; }

    var guid;

    this.enumerableContentWillChange(len, 0);
    Ember.propertyWillChange(this, 'firstObject');
    Ember.propertyWillChange(this, 'lastObject');

    for (var i=0; i < len; i++){
      guid = guidFor(this[i]);
      delete this[guid];
      delete this[i];
    }

    set(this, 'length', 0);

    Ember.propertyDidChange(this, 'firstObject');
    Ember.propertyDidChange(this, 'lastObject');
    this.enumerableContentDidChange(len, 0);

    return this;
  },

  isEqual: function(obj) {
    // fail fast
    if (!Ember.Enumerable.detect(obj)) return false;

    var loc = get(this, 'length');
    if (get(obj, 'length') !== loc) return false;

    while(--loc >= 0) {
      if (!obj.contains(this[loc])) return false;
    }

    return true;
  },

  add: Ember.alias('addObject'),

 
  remove: Ember.alias('removeObject'),

  pop: function() {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    var obj = this.length > 0 ? this[this.length-1] : null;
    this.remove(obj);
    return obj;
  },
  push: Ember.alias('addObject'),

  shift: Ember.alias('pop'),

  unshift: Ember.alias('push'),

 
  addEach: Ember.alias('addObjects'),

  removeEach: Ember.alias('removeObjects'),

  
  init: function(items) {
    this._super();
    if (items) this.addObjects(items);
  },


  nextObject: function(idx) {
    return this[idx];
  },

  firstObject: Ember.computed(function() {
    return this.length > 0 ? this[0] : undefined;
  }).property().cacheable(),


  lastObject: Ember.computed(function() {
    return this.length > 0 ? this[this.length-1] : undefined;
  }).property().cacheable(),


  addObject: function(obj) {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    if (none(obj)) return this; // nothing to do

    var guid = guidFor(obj),
        idx  = this[guid],
        len  = get(this, 'length'),
        added ;

    if (idx>=0 && idx<len && (this[idx] === obj)) return this; // added

    added = [obj];

    this.enumerableContentWillChange(null, added);
    Ember.propertyWillChange(this, 'lastObject');

    len = get(this, 'length');
    this[guid] = len;
    this[len] = obj;
    set(this, 'length', len+1);

    Ember.propertyDidChange(this, 'lastObject');
    this.enumerableContentDidChange(null, added);

    return this;
  },

  removeObject: function(obj) {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    if (none(obj)) return this; // nothing to do

    var guid = guidFor(obj),
        idx  = this[guid],
        len = get(this, 'length'),
        isFirst = idx === 0,
        isLast = idx === len-1,
        last, removed;


    if (idx>=0 && idx<len && (this[idx] === obj)) {
      removed = [obj];

      this.enumerableContentWillChange(removed, null);
      if (isFirst) { Ember.propertyWillChange(this, 'firstObject'); }
      if (isLast)  { Ember.propertyWillChange(this, 'lastObject'); }

      // swap items - basically move the item to the end so it can be removed
      if (idx < len-1) {
        last = this[len-1];
        this[idx] = last;
        this[guidFor(last)] = idx;
      }

      delete this[guid];
      delete this[len-1];
      set(this, 'length', len-1);

      if (isFirst) { Ember.propertyDidChange(this, 'firstObject'); }
      if (isLast)  { Ember.propertyDidChange(this, 'lastObject'); }
      this.enumerableContentDidChange(removed, null);
    }

    return this;
  },

  contains: function(obj) {
    return this[guidFor(obj)]>=0;
  },


  copy: function() {
    var C = this.constructor, ret = new C(), loc = get(this, 'length');
    set(ret, 'length', loc);
    while(--loc>=0) {
      ret[loc] = this[loc];
      ret[guidFor(this[loc])] = loc;
    }
    return ret;
  },


  toString: function() {
    var len = this.length, idx, array = [];
    for(idx = 0; idx < len; idx++) {
      array[idx] = this[idx];
    }
    return "Ember.Set<%@>".fmt(array.join(','));
  }

});

})();



(function() {

Ember.Object = Ember.CoreObject.extend(Ember.Observable);

})();



(function() {

var indexOf = Ember.ArrayPolyfills.indexOf;


Ember.Namespace = Ember.Object.extend({
  isNamespace: true,

  init: function() {
    Ember.Namespace.NAMESPACES.push(this);
    Ember.Namespace.PROCESSED = false;
  },

  toString: function() {
    Ember.identifyNamespaces();
    return this[Ember.GUID_KEY+'_name'];
  },

  destroy: function() {
    var namespaces = Ember.Namespace.NAMESPACES;
    window[this.toString()] = undefined;
    namespaces.splice(indexOf.call(namespaces, this), 1);
    this._super();
  }
});

Ember.Namespace.NAMESPACES = [Ember];
Ember.Namespace.PROCESSED = false;

})();



(function() {

Ember.Application = Ember.Namespace.extend();


})();



(function() {

var get = Ember.get, set = Ember.set;


Ember.ArrayProxy = Ember.Object.extend(Ember.MutableArray,
 {

  
  content: null,

  
  arrangedContent: Ember.computed('content', function() {
    return get(this, 'content');
  }).cacheable(),

 
  objectAtContent: function(idx) {
    return get(this, 'arrangedContent').objectAt(idx);
  },

  
  replaceContent: function(idx, amt, objects) {
    get(this, 'arrangedContent').replace(idx, amt, objects);
  },

 
  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content');

    if (content) {
      content.removeArrayObserver(this, {
        willChange: 'contentArrayWillChange',
        didChange: 'contentArrayDidChange'
      });
    }
  }, 'content'),


  contentArrayWillChange: Ember.K,
  contentArrayDidChange: Ember.K,

 
  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content'),
        len     = content ? get(content, 'length') : 0;

    Ember.assert("Can't set ArrayProxy's content to itself", content !== this);

    if (content) {
      content.addArrayObserver(this, {
        willChange: 'contentArrayWillChange',
        didChange: 'contentArrayDidChange'
      });
    }
  }, 'content'),

  _arrangedContentWillChange: Ember.beforeObserver(function() {
    var arrangedContent = get(this, 'arrangedContent'),
        len = arrangedContent ? get(arrangedContent, 'length') : 0;

    this.arrangedContentArrayWillChange(this, 0, len, undefined);

    if (arrangedContent) {
      arrangedContent.removeArrayObserver(this, {
        willChange: 'arrangedContentArrayWillChange',
        didChange: 'arrangedContentArrayDidChange'
      });
    }
  }, 'arrangedContent'),

  _arrangedContentDidChange: Ember.observer(function() {
    var arrangedContent = get(this, 'arrangedContent'),
        len = arrangedContent ? get(arrangedContent, 'length') : 0;

    Ember.assert("Can't set ArrayProxy's content to itself", arrangedContent !== this);

    if (arrangedContent) {
      arrangedContent.addArrayObserver(this, {
        willChange: 'arrangedContentArrayWillChange',
        didChange: 'arrangedContentArrayDidChange'
      });
    }

    this.arrangedContentArrayDidChange(this, 0, undefined, len);
  }, 'arrangedContent'),


  objectAt: function(idx) {
    return get(this, 'content') && this.objectAtContent(idx);
  },


  length: Ember.computed(function() {
    var arrangedContent = get(this, 'arrangedContent');
    return arrangedContent ? get(arrangedContent, 'length') : 0;
    // No dependencies since Enumerable notifies length of change
  }).property().cacheable(),


  replace: function(idx, amt, objects) {
    if (get(this, 'content')) this.replaceContent(idx, amt, objects);
    return this;
  },


  arrangedContentArrayWillChange: function(item, idx, removedCnt, addedCnt) {
    this.arrayContentWillChange(idx, removedCnt, addedCnt);
  },


  arrangedContentArrayDidChange: function(item, idx, removedCnt, addedCnt) {
    this.arrayContentDidChange(idx, removedCnt, addedCnt);
  },


  init: function() {
    this._super();
    this._contentWillChange();
    this._contentDidChange();
    this._arrangedContentWillChange();
    this._arrangedContentDidChange();
  }

});




})();



(function() {
var get = Ember.get,
    set = Ember.set,
    fmt = Ember.String.fmt,
    addBeforeObserver = Ember.addBeforeObserver,
    addObserver = Ember.addObserver,
    removeBeforeObserver = Ember.removeBeforeObserver,
    removeObserver = Ember.removeObserver,
    propertyWillChange = Ember.propertyWillChange,
    propertyDidChange = Ember.propertyDidChange;

function contentPropertyWillChange(content, contentKey) {
  var key = contentKey.slice(8); // remove "content."
  if (key in this) { return; }  // if shadowed in proxy
  propertyWillChange(this, key);
}

function contentPropertyDidChange(content, contentKey) {
  var key = contentKey.slice(8); // remove "content."
  if (key in this) { return; } // if shadowed in proxy
  propertyDidChange(this, key);
}

Ember.ObjectProxy = Ember.Object.extend(
 {
  
  content: null,
  _contentDidChange: Ember.observer(function() {
    Ember.assert("Can't set ObjectProxy's content to itself", this.get('content') !== this);
  }, 'content'),

  willWatchProperty: function (key) {
    var contentKey = 'content.' + key;
    addBeforeObserver(this, contentKey, null, contentPropertyWillChange);
    addObserver(this, contentKey, null, contentPropertyDidChange);
  },

  didUnwatchProperty: function (key) {
    var contentKey = 'content.' + key;
    removeBeforeObserver(this, contentKey, null, contentPropertyWillChange);
    removeObserver(this, contentKey, null, contentPropertyDidChange);
  },

  unknownProperty: function (key) {
    var content = get(this, 'content');
    if (content) {
      return get(content, key);
    }
  },

  setUnknownProperty: function (key, value) {
    var content = get(this, 'content');
    Ember.assert(fmt("Cannot delegate set('%@', %@) to the 'content' property of object proxy %@: its 'content' is undefined.", [key, value, this]), content);
    return set(content, key, value);
  }
});

})();



(function() {

var set = Ember.set, get = Ember.get, guidFor = Ember.guidFor;
var forEach = Ember.EnumerableUtils.forEach;

var EachArray = Ember.Object.extend(Ember.Array, {

  init: function(content, keyName, owner) {
    this._super();
    this._keyName = keyName;
    this._owner   = owner;
    this._content = content;
  },

  objectAt: function(idx) {
    var item = this._content.objectAt(idx);
    return item && get(item, this._keyName);
  },

  length: Ember.computed(function() {
    var content = this._content;
    return content ? get(content, 'length') : 0;
  }).property().cacheable()

});

var IS_OBSERVER = /^.+:(before|change)$/;

function addObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects, guid;
  if (!objects) objects = proxy._objects = {};

  while(--loc>=idx) {
    var item = content.objectAt(loc);
    if (item) {
      Ember.addBeforeObserver(item, keyName, proxy, 'contentKeyWillChange');
      Ember.addObserver(item, keyName, proxy, 'contentKeyDidChange');

      // keep track of the indicies each item was found at so we can map
      // it back when the obj changes.
      guid = guidFor(item);
      if (!objects[guid]) objects[guid] = [];
      objects[guid].push(loc);
    }
  }
}

function removeObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects;
  if (!objects) objects = proxy._objects = {};
  var indicies, guid;

  while(--loc>=idx) {
    var item = content.objectAt(loc);
    if (item) {
      Ember.removeBeforeObserver(item, keyName, proxy, 'contentKeyWillChange');
      Ember.removeObserver(item, keyName, proxy, 'contentKeyDidChange');

      guid = guidFor(item);
      indicies = objects[guid];
      indicies[indicies.indexOf(loc)] = null;
    }
  }
}

Ember.EachProxy = Ember.Object.extend({

  init: function(content) {
    this._super();
    this._content = content;
    content.addArrayObserver(this);

    // in case someone is already observing some keys make sure they are
    // added
    forEach(Ember.watchedEvents(this), function(eventName) {
      this.didAddListener(eventName);
    }, this);
  },


  unknownProperty: function(keyName, value) {
    var ret;
    ret = new EachArray(this._content, keyName, this);
    Ember.defineProperty(this, keyName, null, ret);
    this.beginObservingContentKey(keyName);
    return ret;
  },


  arrayWillChange: function(content, idx, removedCnt, addedCnt) {
    var keys = this._keys, key, array, lim;

    lim = removedCnt>0 ? idx+removedCnt : -1;
    Ember.beginPropertyChanges(this);

    for(key in keys) {
      if (!keys.hasOwnProperty(key)) { continue; }

      if (lim>0) removeObserverForContentKey(content, key, this, idx, lim);

      Ember.propertyWillChange(this, key);
    }

    Ember.propertyWillChange(this._content, '@each');
    Ember.endPropertyChanges(this);
  },

  arrayDidChange: function(content, idx, removedCnt, addedCnt) {
    var keys = this._keys, key, array, lim;

    lim = addedCnt>0 ? idx+addedCnt : -1;
    Ember.beginPropertyChanges(this);

    for(key in keys) {
      if (!keys.hasOwnProperty(key)) { continue; }

      if (lim>0) addObserverForContentKey(content, key, this, idx, lim);

      Ember.propertyDidChange(this, key);
    }

    Ember.propertyDidChange(this._content, '@each');
    Ember.endPropertyChanges(this);
  },

  didAddListener: function(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.beginObservingContentKey(eventName.slice(0, -7));
    }
  },

  didRemoveListener: function(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.stopObservingContentKey(eventName.slice(0, -7));
    }
  },

  beginObservingContentKey: function(keyName) {
    var keys = this._keys;
    if (!keys) keys = this._keys = {};
    if (!keys[keyName]) {
      keys[keyName] = 1;
      var content = this._content,
          len = get(content, 'length');
      addObserverForContentKey(content, keyName, this, 0, len);
    } else {
      keys[keyName]++;
    }
  },

  stopObservingContentKey: function(keyName) {
    var keys = this._keys;
    if (keys && (keys[keyName]>0) && (--keys[keyName]<=0)) {
      var content = this._content,
          len     = get(content, 'length');
      removeObserverForContentKey(content, keyName, this, 0, len);
    }
  },

  contentKeyWillChange: function(obj, keyName) {
    Ember.propertyWillChange(this, keyName);
  },

  contentKeyDidChange: function(obj, keyName) {
    Ember.propertyDidChange(this, keyName);
  }

});



})();



(function() {

var get = Ember.get, set = Ember.set;

var NativeArray = Ember.Mixin.create(Ember.MutableArray, Ember.Observable, Ember.Copyable, {

  // because length is a built-in property we need to know to just get the
  // original property.
  get: function(key) {
    if (key==='length') return this.length;
    else if ('number' === typeof key) return this[key];
    else return this._super(key);
  },

  objectAt: function(idx) {
    return this[idx];
  },

  // primitive for array support.
  replace: function(idx, amt, objects) {

    if (this.isFrozen) throw Ember.FROZEN_ERROR ;

    // if we replaced exactly the same number of items, then pass only the
    // replaced range.  Otherwise, pass the full remaining array length
    // since everything has shifted
    var len = objects ? get(objects, 'length') : 0;
    this.arrayContentWillChange(idx, amt, len);

    if (!objects || objects.length === 0) {
      this.splice(idx, amt) ;
    } else {
      var args = [idx, amt].concat(objects) ;
      this.splice.apply(this,args) ;
    }

    this.arrayContentDidChange(idx, amt, len);
    return this ;
  },

  // If you ask for an unknown property, then try to collect the value
  // from member items.
  unknownProperty: function(key, value) {
    var ret;// = this.reducedProperty(key, value) ;
    if ((value !== undefined) && ret === undefined) {
      ret = this[key] = value;
    }
    return ret ;
  },

  // If browser did not implement indexOf natively, then override with
  // specialized version
  indexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = 0;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },

  lastIndexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = len-1;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },

  copy: function() {
    return this.slice();
  }
});

// Remove any methods implemented natively so we don't override them
var ignore = ['length'];
Ember.EnumerableUtils.forEach(NativeArray.keys(), function(methodName) {
  if (Array.prototype[methodName]) ignore.push(methodName);
});

if (ignore.length>0) {
  NativeArray = NativeArray.without.apply(NativeArray, ignore);
}

Ember.NativeArray = NativeArray;

Ember.A = function(arr){
  if (arr === undefined) { arr = []; }
  return Ember.NativeArray.apply(arr);
};

Ember.NativeArray.activate = function() {
  NativeArray.apply(Array.prototype);

  Ember.A = function(arr) { return arr || []; };
};

if (Ember.EXTEND_PROTOTYPES) Ember.NativeArray.activate();



})();



(function() {

var get = Ember.get, set = Ember.set;

Ember._PromiseChain = Ember.Object.extend({
  promises: null,
  failureCallback: Ember.K,
  successCallback: Ember.K,
  abortCallback: Ember.K,
  promiseSuccessCallback: Ember.K,

  runNextPromise: function() {
    if (get(this, 'isDestroyed')) { return; }

    var item = get(this, 'promises').shiftObject();
    if (item) {
      var promise = get(item, 'promise') || item;
      Ember.assert("Cannot find promise to invoke", Ember.canInvoke(promise, 'then'));

      var self = this;

      var successCallback = function() {
        self.promiseSuccessCallback.call(this, item, arguments);
        self.runNextPromise();
      };

      var failureCallback = get(self, 'failureCallback');

      promise.then(successCallback, failureCallback);
     } else {
      this.successCallback();
    }
  },

  start: function() {
    this.runNextPromise();
    return this;
  },

  abort: function() {
    this.abortCallback();
    this.destroy();
  },

  init: function() {
    set(this, 'promises', Ember.A(get(this, 'promises')));
    this._super();
  }
});


})();



(function() {
var loadHooks = {};
var loaded = {};

Ember.onLoad = function(name, callback) {
  var object;

  loadHooks[name] = loadHooks[name] || Ember.A();
  loadHooks[name].pushObject(callback);

  if (object = loaded[name]) {
    callback(object);
  }
};

Ember.runLoadHooks = function(name, object) {
  var hooks;

  loaded[name] = object;

  if (hooks = loadHooks[name]) {
    loadHooks[name].forEach(function(callback) {
      callback(object);
    });
  }
};

})();



(function() {

})();



(function() {
Ember.ControllerMixin = Ember.Mixin.create({
  target: null,
  store: null
});

Ember.Controller = Ember.Object.extend(Ember.ControllerMixin);

})();



(function() {
var get = Ember.get, set = Ember.set, forEach = Ember.EnumerableUtils.forEach;

Ember.SortableMixin = Ember.Mixin.create(Ember.MutableEnumerable,
   {
  sortProperties: null,
  sortAscending: true,

  addObject: function(obj) {
    var content = get(this, 'content');
    content.pushObject(obj);
  },

  removeObject: function(obj) {
    var content = get(this, 'content');
    content.removeObject(obj);
  },

  orderBy: function(item1, item2) {
    var result = 0,
        sortProperties = get(this, 'sortProperties'),
        sortAscending = get(this, 'sortAscending');

    Ember.assert("you need to define `sortProperties`", !!sortProperties);

    forEach(sortProperties, function(propertyName) {
      if (result === 0) {
        result = Ember.compare(get(item1, propertyName), get(item2, propertyName));
        if ((result !== 0) && !sortAscending) {
          result = (-1) * result;
        }
      }
    });

    return result;
  },

  destroy: function() {
    var content = get(this, 'content'),
        sortProperties = get(this, 'sortProperties');

    if (content && sortProperties) {
      forEach(content, function(item) {
        forEach(sortProperties, function(sortProperty) {
          Ember.removeObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      }, this);
    }

    return this._super();
  },

  isSorted: Ember.computed('sortProperties', function() {
    return !!get(this, 'sortProperties');
  }),

  arrangedContent: Ember.computed('content', 'sortProperties.@each', function(key, value) {
    var content = get(this, 'content'),
        isSorted = get(this, 'isSorted'),
        sortProperties = get(this, 'sortProperties'),
        self = this;

    if (content && isSorted) {
      content = content.slice();
      content.sort(function(item1, item2) {
        return self.orderBy(item1, item2);
      });
      forEach(content, function(item) {
        forEach(sortProperties, function(sortProperty) {
          Ember.addObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      }, this);
      return Ember.A(content);
    }

    return content;
  }).cacheable(),

  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content'),
        sortProperties = get(this, 'sortProperties');

    if (content && sortProperties) {
      forEach(content, function(item) {
        forEach(sortProperties, function(sortProperty) {
          Ember.removeObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      }, this);
    }

    this._super();
  }, 'content'),

  sortAscendingWillChange: Ember.beforeObserver(function() {
    this._lastSortAscending = get(this, 'sortAscending');
  }, 'sortAscending'),

  sortAscendingDidChange: Ember.observer(function() {
    if (get(this, 'sortAscending') !== this._lastSortAscending) {
      var arrangedContent = get(this, 'arrangedContent');
      arrangedContent.reverseObjects();
    }
  }, 'sortAscending'),

  contentArrayWillChange: function(array, idx, removedCount, addedCount) {
    var isSorted = get(this, 'isSorted');

    if (isSorted) {
      var arrangedContent = get(this, 'arrangedContent');
      var removedObjects = array.slice(idx, idx+removedCount);
      var sortProperties = get(this, 'sortProperties');

      forEach(removedObjects, function(item) {
        arrangedContent.removeObject(item);

        forEach(sortProperties, function(sortProperty) {
          Ember.removeObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      });
    }

    return this._super(array, idx, removedCount, addedCount);
  },

  contentArrayDidChange: function(array, idx, removedCount, addedCount) {
    var isSorted = get(this, 'isSorted'),
        sortProperties = get(this, 'sortProperties');

    if (isSorted) {
      var addedObjects = array.slice(idx, idx+addedCount);
      var arrangedContent = get(this, 'arrangedContent');

      forEach(addedObjects, function(item) {
        this.insertItemSorted(item);

        forEach(sortProperties, function(sortProperty) {
          Ember.addObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      }, this);
    }

    return this._super(array, idx, removedCount, addedCount);
  },

  insertItemSorted: function(item) {
    var arrangedContent = get(this, 'arrangedContent');
    var length = get(arrangedContent, 'length');

    var idx = this._binarySearch(item, 0, length);
    arrangedContent.insertAt(idx, item);
  },

  contentItemSortPropertyDidChange: function(item) {
    var arrangedContent = get(this, 'arrangedContent'),
        index = arrangedContent.indexOf(item);

    arrangedContent.removeObject(item);
    this.insertItemSorted(item);
  },

  _binarySearch: function(item, low, high) {
    var mid, midItem, res, arrangedContent;

    if (low === high) {
      return low;
    }

    arrangedContent = get(this, 'arrangedContent');

    mid = low + Math.floor((high - low) / 2);
    midItem = arrangedContent.objectAt(mid);

    res = this.orderBy(midItem, item);

    if (res < 0) {
      return this._binarySearch(item, mid+1, high);
    } else if (res > 0) {
      return this._binarySearch(item, low, mid);
    }

    return mid;
  }
});

})();



(function() {

var get = Ember.get, set = Ember.set;

Ember.ArrayController = Ember.ArrayProxy.extend(Ember.ControllerMixin,
  Ember.SortableMixin);

})();



(function() {
Ember.ObjectController = Ember.ObjectProxy.extend(Ember.ControllerMixin);

})();



(function() {

})();



(function() {

})();

(function() {

var get = Ember.get, set = Ember.set;

Ember.Application = Ember.Namespace.extend(
{
 
  rootElement: 'body',
  eventDispatcher: null,
  customEvents: null,

  init: function() {
    var eventDispatcher,
        rootElement = get(this, 'rootElement');
    this._super();

    eventDispatcher = Ember.EventDispatcher.create({
      rootElement: rootElement
    });

    set(this, 'eventDispatcher', eventDispatcher);

    // jQuery 1.7 doesn't call the ready callback if already ready
    if (Ember.$.isReady) {
      Ember.run.once(this, this.didBecomeReady);
    } else {
      var self = this;
      Ember.$(document).ready(function() {
        Ember.run.once(self, self.didBecomeReady);
      });
    }
  },

  initialize: function(router) {
    var properties = Ember.A(Ember.keys(this)),
        injections = get(this.constructor, 'injections'),
        namespace = this, controller, name;

    if (!router && Ember.Router.detect(namespace['Router'])) {
      router = namespace['Router'].create();
      this._createdRouter = router;
    }

    if (router) {
      set(this, 'router', router);

      set(router, 'namespace', this);
    }

    Ember.runLoadHooks('application', this);

    injections.forEach(function(injection) {
      properties.forEach(function(property) {
        injection[1](namespace, router, property);
      });
    });

    if (router && router instanceof Ember.Router) {
      this.startRouting(router);
    }
  },


  didBecomeReady: function() {
    var eventDispatcher = get(this, 'eventDispatcher'),
        customEvents    = get(this, 'customEvents');

    eventDispatcher.setup(customEvents);

    this.ready();
  },

  startRouting: function(router) {
    var location = get(router, 'location'),
        rootElement = get(this, 'rootElement'),
        applicationController = get(router, 'applicationController');

    Ember.assert("ApplicationView and ApplicationController must be defined on your application", (this.ApplicationView && applicationController) );

    var applicationView = this.ApplicationView.create({
      controller: applicationController
    });
    this._createdApplicationView = applicationView;

    applicationView.appendTo(rootElement);

    router.route(location.getURL());
    location.onUpdateURL(function(url) {
      router.route(url);
    });
  },

  ready: Ember.K,

  /** @private */
  willDestroy: function() {
    get(this, 'eventDispatcher').destroy();
    if (this._createdRouter)          { this._createdRouter.destroy(); }
    if (this._createdApplicationView) { this._createdApplicationView.destroy(); }
  },

  registerInjection: function(options) {
    this.constructor.registerInjection(options);
  }
});

Ember.Application.reopenClass({
  concatenatedProperties: ['injections'],
  injections: Ember.A(),
  registerInjection: function(options) {
    var injections = get(this, 'injections'),
        before = options.before,
        name = options.name,
        injection = options.injection,
        location;

    if (before) {
      location = injections.find(function(item) {
        if (item[0] === before) { return true; }
      });
      location = injections.indexOf(location);
    } else {
      location = get(injections, 'length');
    }

    injections.splice(location, 0, [name, injection]);
  }
});

Ember.Application.registerInjection({
  name: 'controllers',
  injection: function(app, router, property) {
    if (!/^[A-Z].*Controller$/.test(property)) { return; }

    var name = property.charAt(0).toLowerCase() + property.substr(1),
        controller = app[property].create();

    router.set(name, controller);

    controller.setProperties({
      target: router,
      controllers: router,
      namespace: app
    });
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.Location = {
  create: function(options) {
    var implementation = options && options.implementation;
    Ember.assert("Ember.Location.create: you must specify a 'implementation' option", !!implementation);

    var implementationClass = this.implementations[implementation];
    Ember.assert("Ember.Location.create: " + implementation + " is not a valid implementation", !!implementationClass);

    return implementationClass.create.apply(implementationClass, arguments);
  },

  registerImplementation: function(name, implementation) {
    this.implementations[name] = implementation;
  },

  implementations: {}
};

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.HashLocation = Ember.Object.extend(
 {

  init: function() {
    set(this, 'location', get(this, 'location') || window.location);
  },

  getURL: function() {
    return get(this, 'location').hash.substr(1);
  },

  setURL: function(path) {
    get(this, 'location').hash = path;
    set(this, 'lastSetURL', path);
  },

  onUpdateURL: function(callback) {
    var self = this;
    var guid = Ember.guidFor(this);

    Ember.$(window).bind('hashchange.ember-location-'+guid, function() {
      var path = location.hash.substr(1);
      if (get(self, 'lastSetURL') === path) { return; }

      set(self, 'lastSetURL', null);

      callback(location.hash.substr(1));
    });
  },

  formatURL: function(url) {
    return '#'+url;
  },

  
  willDestroy: function() {
    var guid = Ember.guidFor(this);

    Ember.$(window).unbind('hashchange.ember-location-'+guid);
  }
});

Ember.Location.registerImplementation('hash', Ember.HashLocation);

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.HistoryLocation = Ember.Object.extend(
 {

  
  init: function() {
    set(this, 'location', get(this, 'location') || window.location);
    set(this, '_initialURL', get(this, 'location').pathname);
  },

 
  rootURL: '/',

 
  _initialURL: null,


  getURL: function() {
    return get(this, 'location').pathname;
  },
  setURL: function(path) {
    var state = window.history.state,
        initialURL = get(this, '_initialURL');

    path = this.formatPath(path);

    if ((initialURL !== path && !state) || (state && state.path !== path)) {
      window.history.pushState({ path: path }, null, path);
    }
  },

  onUpdateURL: function(callback) {
    var guid = Ember.guidFor(this);

    Ember.$(window).bind('popstate.ember-location-'+guid, function(e) {
      callback(location.pathname);
    });
  },

  formatPath: function(path) {
    var rootURL = get(this, 'rootURL');

    if (path !== '') {
      rootURL = rootURL.replace(/\/$/, '');
    }

    return rootURL + path;
  },

  formatURL: function(url) {
    return url;
  },

  
  willDestroy: function() {
    var guid = Ember.guidFor(this);

    Ember.$(window).unbind('popstate.ember-location-'+guid);
  }
});

Ember.Location.registerImplementation('history', Ember.HistoryLocation);

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.NoneLocation = Ember.Object.extend(
 {
  path: '',

  getURL: function() {
    return get(this, 'path');
  },

  setURL: function(path) {
    set(this, 'path', path);
  },

  onUpdateURL: function(callback) {
    // We are not wired up to the browser, so we'll never trigger the callback.
  },

  formatURL: function(url) {
    // The return value is not overly meaningful, but we do not want to throw
    // errors when test code renders templates containing {{action href=true}}
    // helpers.
    return url;
  }
});

Ember.Location.registerImplementation('none', Ember.NoneLocation);

})();



(function() {

})();



(function() {

})();

(function() {

Ember.assert("Ember Views require jQuery 1.7", window.jQuery && (window.jQuery().jquery.match(/^1\.7(\.\d+)?(pre|rc\d?)?/) || Ember.ENV.FORCE_JQUERY));
Ember.$ = window.jQuery;

})();



(function() {

var dragEvents = Ember.String.w('dragstart drag dragenter dragleave dragover drop dragend');


Ember.EnumerableUtils.forEach(dragEvents, function(eventName) {
  Ember.$.event.fixHooks[eventName] = { props: ['dataTransfer'] };
});

})();



(function() {

var get = Ember.get, set = Ember.set;
var indexOf = Ember.ArrayPolyfills.indexOf;


var ClassSet = function() {
  this.seen = {};
  this.list = [];
};

ClassSet.prototype = {
  add: function(string) {
    if (string in this.seen) { return; }
    this.seen[string] = true;

    this.list.push(string);
  },

  toDOM: function() {
    return this.list.join(" ");
  }
};


Ember.RenderBuffer = function(tagName) {
  return new Ember._RenderBuffer(tagName);
};

Ember._RenderBuffer = function(tagName) {
  this.elementTag = tagName;
  this.childBuffers = [];
};

Ember._RenderBuffer.prototype =
 {

  
  elementClasses: null,
  elementId: null,
  elementAttributes: null,
  elementTag: null,
  elementStyle: null,

  parentBuffer: null,

  push: function(string) {
    this.childBuffers.push(String(string));
    return this;
  },

  addClass: function(className) {
    // lazily create elementClasses
    var elementClasses = this.elementClasses = (this.elementClasses || new ClassSet());
    this.elementClasses.add(className);

    return this;
  },

  id: function(id) {
    this.elementId = id;
    return this;
  },

  attr: function(name, value) {
    var attributes = this.elementAttributes = (this.elementAttributes || {});

    if (arguments.length === 1) {
      return attributes[name];
    } else {
      attributes[name] = value;
    }

    return this;
  },

  removeAttr: function(name) {
    var attributes = this.elementAttributes;
    if (attributes) { delete attributes[name]; }

    return this;
  },

  style: function(name, value) {
    var style = this.elementStyle = (this.elementStyle || {});

    this.elementStyle[name] = value;
    return this;
  },

  newBuffer: function(tagName, parent, fn, other) {
    var buffer = new Ember._RenderBuffer(tagName);
    buffer.parentBuffer = parent;

    if (other) { Ember.$.extend(buffer, other); }
    if (fn) { fn.call(this, buffer); }

    return buffer;
  },

  replaceWithBuffer: function(newBuffer) {
    var parent = this.parentBuffer;
    if (!parent) { return; }

    var childBuffers = parent.childBuffers;

    var index = indexOf.call(childBuffers, this);

    if (newBuffer) {
      childBuffers.splice(index, 1, newBuffer);
    } else {
      childBuffers.splice(index, 1);
    }
  },

  begin: function(tagName) {
    return this.newBuffer(tagName, this, function(buffer) {
      this.childBuffers.push(buffer);
    });
  },

  prepend: function(tagName) {
    return this.newBuffer(tagName, this, function(buffer) {
      this.childBuffers.splice(0, 0, buffer);
    });
  },

  replaceWith: function(tagName) {
    var parentBuffer = this.parentBuffer;

    return this.newBuffer(tagName, parentBuffer, function(buffer) {
      this.replaceWithBuffer(buffer);
    });
  },

  insertAfter: function(tagName) {
    var parentBuffer = get(this, 'parentBuffer');

    return this.newBuffer(tagName, parentBuffer, function(buffer) {
      var siblings = parentBuffer.childBuffers;
      var index = indexOf.call(siblings, this);
      siblings.splice(index + 1, 0, buffer);
    });
  },

  end: function() {
    var parent = this.parentBuffer;
    return parent || this;
  },

  remove: function() {
    this.replaceWithBuffer(null);
  },
  element: function() {
    return Ember.$(this.string())[0];
  },

  string: function() {
    var content = '', tag = this.elementTag, openTag;

    if (tag) {
      var id = this.elementId,
          classes = this.elementClasses,
          attrs = this.elementAttributes,
          style = this.elementStyle,
          styleBuffer = '', prop;

      openTag = ["<" + tag];

      if (id) { openTag.push('id="' + this._escapeAttribute(id) + '"'); }
      if (classes) { openTag.push('class="' + this._escapeAttribute(classes.toDOM()) + '"'); }

      if (style) {
        for (prop in style) {
          if (style.hasOwnProperty(prop)) {
            styleBuffer += (prop + ':' + this._escapeAttribute(style[prop]) + ';');
          }
        }

        openTag.push('style="' + styleBuffer + '"');
      }

      if (attrs) {
        for (prop in attrs) {
          if (attrs.hasOwnProperty(prop)) {
            openTag.push(prop + '="' + this._escapeAttribute(attrs[prop]) + '"');
          }
        }
      }

      openTag = openTag.join(" ") + '>';
    }

    var childBuffers = this.childBuffers;

    Ember.ArrayPolyfills.forEach.call(childBuffers, function(buffer) {
      var stringy = typeof buffer === 'string';
      content += (stringy ? buffer : buffer.string());
    });

    if (tag) {
      return openTag + content + "</" + tag + ">";
    } else {
      return content;
    }
  },

  _escapeAttribute: function(value) {
    // Stolen shamelessly from Handlebars

    var escape = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    };

    var badChars = /&(?!\w+;)|[<>"'`]/g;
    var possible = /[&<>"'`]/;

    var escapeChar = function(chr) {
      return escape[chr] || "&amp;";
    };

    var string = value.toString();

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

};

})();



(function() {

var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;

Ember.EventDispatcher = Ember.Object.extend(
{

  rootElement: 'body',

  setup: function(addedEvents) {
    var event, events = {
      touchstart  : 'touchStart',
      touchmove   : 'touchMove',
      touchend    : 'touchEnd',
      touchcancel : 'touchCancel',
      keydown     : 'keyDown',
      keyup       : 'keyUp',
      keypress    : 'keyPress',
      mousedown   : 'mouseDown',
      mouseup     : 'mouseUp',
      contextmenu : 'contextMenu',
      click       : 'click',
      dblclick    : 'doubleClick',
      mousemove   : 'mouseMove',
      focusin     : 'focusIn',
      focusout    : 'focusOut',
      mouseenter  : 'mouseEnter',
      mouseleave  : 'mouseLeave',
      submit      : 'submit',
      input       : 'input',
      change      : 'change',
      dragstart   : 'dragStart',
      drag        : 'drag',
      dragenter   : 'dragEnter',
      dragleave   : 'dragLeave',
      dragover    : 'dragOver',
      drop        : 'drop',
      dragend     : 'dragEnd'
    };

    Ember.$.extend(events, addedEvents || {});

    var rootElement = Ember.$(get(this, 'rootElement'));

    Ember.assert(fmt('You cannot use the same root element (%@) multiple times in an Ember.Application', [rootElement.selector || rootElement[0].tagName]), !rootElement.is('.ember-application'));
    Ember.assert('You cannot make a new Ember.Application using a root element that is a descendent of an existing Ember.Application', !rootElement.closest('.ember-application').length);
    Ember.assert('You cannot make a new Ember.Application using a root element that is an ancestor of an existing Ember.Application', !rootElement.find('.ember-application').length);

    rootElement.addClass('ember-application');

    Ember.assert('Unable to add "ember-application" class to rootElement. Make sure you set rootElement to the body or an element in the body.', rootElement.is('.ember-application'));

    for (event in events) {
      if (events.hasOwnProperty(event)) {
        this.setupHandler(rootElement, event, events[event]);
      }
    }
  },

  setupHandler: function(rootElement, event, eventName) {
    var self = this;

    rootElement.delegate('.ember-view', event + '.ember', function(evt, triggeringManager) {

      var view = Ember.View.views[this.id],
          result = true, manager = null;

      manager = self._findNearestEventManager(view,eventName);

      if (manager && manager !== triggeringManager) {
        result = self._dispatchEvent(manager, evt, eventName, view);
      } else if (view) {
        result = self._bubbleEvent(view,evt,eventName);
      } else {
        evt.stopPropagation();
      }

      return result;
    });

    rootElement.delegate('[data-ember-action]', event + '.ember', function(evt) {
      var actionId = Ember.$(evt.currentTarget).attr('data-ember-action'),
          action   = Ember.Handlebars.ActionHelper.registeredActions[actionId],
          handler  = action.handler;

      if (action.eventName === eventName) {
        return handler(evt);
      }
    });
  },

  _findNearestEventManager: function(view, eventName) {
    var manager = null;

    while (view) {
      manager = get(view, 'eventManager');
      if (manager && manager[eventName]) { break; }

      view = get(view, 'parentView');
    }

    return manager;
  },

  _dispatchEvent: function(object, evt, eventName, view) {
    var result = true;

    var handler = object[eventName];
    if (Ember.typeOf(handler) === 'function') {
      result = handler.call(object, evt, view);
      // Do not preventDefault in eventManagers.
      evt.stopPropagation();
    }
    else {
      result = this._bubbleEvent(view, evt, eventName);
    }

    return result;
  },

  _bubbleEvent: function(view, evt, eventName) {
    return Ember.run(function() {
      return view.handleEvent(eventName, evt);
    });
  },

  destroy: function() {
    var rootElement = get(this, 'rootElement');
    Ember.$(rootElement).undelegate('.ember').removeClass('ember-application');
    return this._super();
  }
});

})();



(function() {

var queues = Ember.run.queues;
queues.splice(Ember.$.inArray('actions', queues)+1, 0, 'render');

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.ControllerMixin.reopen({

  target: null,
  controllers: null,
  namespace: null,
  view: null,

  connectOutlet: function(name, context) {

    var outletName, viewClass, view, controller, options;

    if (Ember.typeOf(context) === 'string') {
      outletName = name;
      name = context;
      context = arguments[2];
    }

    if (arguments.length === 1) {
      if (Ember.typeOf(name) === 'object') {
        options = name;
        outletName = options.outletName;
        name = options.name;
        viewClass = options.viewClass;
        controller = options.controller;
        context = options.context;
      }
    } else {
      options = {};
    }

    outletName = outletName || 'view';

    Ember.assert("You must supply a name or a view class to connectOutlets, but not both", (!!name && !viewClass && !controller) || (!name && !!viewClass));

    if (name) {
      var namespace = get(this, 'namespace'),
          controllers = get(this, 'controllers');

      var viewClassName = name.charAt(0).toUpperCase() + name.substr(1) + "View";
      viewClass = get(namespace, viewClassName);
      controller = get(controllers, name + 'Controller');

      Ember.assert("The name you supplied " + name + " did not resolve to a view " + viewClassName, !!viewClass);
      Ember.assert("The name you supplied " + name + " did not resolve to a controller " + name + 'Controller', (!!controller && !!context) || !context);
    }

    if (controller && context) { controller.set('content', context); }
    view = viewClass.create();
    if (controller) { set(view, 'controller', controller); }
    set(this, outletName, view);

    return view;
  },

  connectControllers: function() {
    var controllers = get(this, 'controllers'),
        controllerNames = Array.prototype.slice.apply(arguments),
        controllerName;

    for (var i=0, l=controllerNames.length; i<l; i++) {
      controllerName = controllerNames[i] + 'Controller';
      set(this, controllerName, get(controllers, controllerName));
    }
  }
});


})();



(function() {

})();



(function() {

var get = Ember.get, set = Ember.set, addObserver = Ember.addObserver;
var meta = Ember.meta, fmt = Ember.String.fmt;
var a_slice = [].slice;
var a_forEach = Ember.EnumerableUtils.forEach;

var childViewsProperty = Ember.computed(function() {
  var childViews = this._childViews;

  var ret = Ember.A();

  a_forEach(childViews, function(view) {
    if (view.isVirtual) {
      ret.pushObjects(get(view, 'childViews'));
    } else {
      ret.push(view);
    }
  });

  return ret;
}).property().cacheable();

var VIEW_PRESERVES_CONTEXT = Ember.VIEW_PRESERVES_CONTEXT;
Ember.warn("The way that the {{view}} helper affects templates is about to change. Previously, templates inside child views would use the new view as the context. Soon, views will preserve their parent context when rendering their template. You can opt-in early to the new behavior by setting `ENV.VIEW_PRESERVES_CONTEXT = true`. For more information, see https://gist.github.com/2494968. You should update your templates as soon as possible; this default will change soon, and the option will be eliminated entirely before the 1.0 release.", VIEW_PRESERVES_CONTEXT);

Ember.TEMPLATES = {};

var invokeForState = {
  preRender: {},
  inBuffer: {},
  hasElement: {},
  inDOM: {},
  destroyed: {}
};

Ember.View = Ember.Object.extend(Ember.Evented,
 {

  concatenatedProperties: ['classNames', 'classNameBindings', 'attributeBindings'],

 
  isView: true,

  
  templateName: null,

 
  layoutName: null,

  
  templates: Ember.TEMPLATES,

  
  template: Ember.computed(function(key, value) {
    if (value !== undefined) { return value; }

    var templateName = get(this, 'templateName'),
        template = this.templateForName(templateName, 'template');

    return template || get(this, 'defaultTemplate');
  }).property('templateName').cacheable(),

  
  controller: Ember.computed(function(key, value) {
    var parentView;

    if (arguments.length === 2) {
      return value;
    } else {
      parentView = get(this, 'parentView');
      return parentView ? get(parentView, 'controller') : null;
    }
  }).property().cacheable(),


  layout: Ember.computed(function(key, value) {
    if (arguments.length === 2) { return value; }

    var layoutName = get(this, 'layoutName'),
        layout = this.templateForName(layoutName, 'layout');

    return layout || get(this, 'defaultLayout');
  }).property('layoutName').cacheable(),

  templateForName: function(name, type) {
    if (!name) { return; }

    var templates = get(this, 'templates'),
        template = get(templates, name);

    if (!template) {
     throw new Ember.Error(fmt('%@ - Unable to find %@ "%@".', [this, type, name]));
    }

    return template;
  },

  context: Ember.computed(function(key, value) {
    if (arguments.length === 2) {
      set(this, '_context', value);
      return value;
    } else {
      return get(this, '_context');
    }
  }).cacheable(),

 
  _context: Ember.computed(function(key, value) {
    var parentView, controller, context;

    if (arguments.length === 2) {
      return value;
    }

    if (VIEW_PRESERVES_CONTEXT) {
      if (controller = get(this, 'controller')) {
        return controller;
      }

      parentView = get(this, '_parentView');
      if (parentView) {
        return get(parentView, '_context');
      }
    }

    return this;
  }).cacheable(),

 
  _displayPropertyDidChange: Ember.observer(function() {
    this.rerender();
  }, 'context', 'controller'),

 
  parentView: Ember.computed(function() {
    var parent = get(this, '_parentView');

    if (parent && parent.isVirtual) {
      return get(parent, 'parentView');
    } else {
      return parent;
    }
  }).property('_parentView').volatile(),

  _parentView: null,

  // return the current view, not including virtual views
  concreteView: Ember.computed(function() {
    if (!this.isVirtual) { return this; }
    else { return get(this, 'parentView'); }
  }).property('_parentView').volatile(),


  isVisible: true,

  childViews: childViewsProperty,

  _childViews: [],

  _childViewsWillChange: Ember.beforeObserver(function() {
    if (this.isVirtual) {
      var parentView = get(this, 'parentView');
      if (parentView) { Ember.propertyWillChange(parentView, 'childViews'); }
    }
  }, 'childViews'),

  _childViewsDidChange: Ember.observer(function() {
    if (this.isVirtual) {
      var parentView = get(this, 'parentView');
      if (parentView) { Ember.propertyDidChange(parentView, 'childViews'); }
    }
  }, 'childViews'),


  nearestInstanceOf: function(klass) {
    var view = get(this, 'parentView');

    while (view) {
      if(view instanceof klass) { return view; }
      view = get(view, 'parentView');
    }
  },

 
  nearestWithProperty: function(property) {
    var view = get(this, 'parentView');

    while (view) {
      if (property in view) { return view; }
      view = get(view, 'parentView');
    }
  },

 
  nearestChildOf: function(klass) {
    var view = get(this, 'parentView');

    while (view) {
      if(get(view, 'parentView') instanceof klass) { return view; }
      view = get(view, 'parentView');
    }
  },

 
  collectionView: Ember.computed(function() {
    return this.nearestInstanceOf(Ember.CollectionView);
  }).cacheable(),

 
  itemView: Ember.computed(function() {
    return this.nearestChildOf(Ember.CollectionView);
  }).cacheable(),


  contentView: Ember.computed(function() {
    return this.nearestWithProperty('content');
  }).cacheable(),

 
  _parentViewDidChange: Ember.observer(function() {
    if (this.isDestroying) { return; }

    this.invokeRecursively(function(view) {
      view.propertyDidChange('collectionView');
      view.propertyDidChange('itemView');
      view.propertyDidChange('contentView');
    });

    if (get(this, 'parentView.controller') && !get(this, 'controller')) {
      this.notifyPropertyChange('controller');
    }
  }, '_parentView'),

  _controllerDidChange: Ember.observer(function() {
    if (this.isDestroying) { return; }

    this.forEachChildView(function(view) {
      view.propertyDidChange('controller');
    });
  }, 'controller'),

  cloneKeywords: function() {
    var templateData = get(this, 'templateData');

    var keywords = templateData ? Ember.copy(templateData.keywords) : {};
    set(keywords, 'view', get(this, 'concreteView'));
    set(keywords, 'controller', get(this, 'controller'));

    return keywords;
  },

 
  render: function(buffer) {
    // If this view has a layout, it is the responsibility of the
    // the layout to render the view's template. Otherwise, render the template
    // directly.
    var template = get(this, 'layout') || get(this, 'template');

    if (template) {
      var context = get(this, '_context');
      var keywords = this.cloneKeywords();

      var data = {
        view: this,
        buffer: buffer,
        isRenderData: true,
        keywords: keywords
      };

      // Invoke the template with the provided template context, which
      // is the view by default. A hash of data is also passed that provides
      // the template with access to the view and render buffer.

      Ember.assert('template must be a function. Did you mean to call Ember.Handlebars.compile("...") or specify templateName instead?', typeof template === 'function');
      // The template should write directly to the render buffer instead
      // of returning a string.
      var output = template(context, { data: data });

      // If the template returned a string instead of writing to the buffer,
      // push the string onto the buffer.
      if (output !== undefined) { buffer.push(output); }
    }
  },

  invokeForState: function(name) {
    var stateName = this.state, args, fn;

    // try to find the function for the state in the cache
    if (fn = invokeForState[stateName][name]) {
      args = a_slice.call(arguments);
      args[0] = this;

      return fn.apply(this, args);
    }

    // otherwise, find and cache the function for this state
    var parent = this, states = parent.states, state;

    while (states) {
      state = states[stateName];

      while (state) {
        fn = state[name];

        if (fn) {
          invokeForState[stateName][name] = fn;

          args = a_slice.call(arguments, 1);
          args.unshift(this);

          return fn.apply(this, args);
        }

        state = state.parentState;
      }

      states = states.parent;
    }
  },

 
  rerender: function() {
    return this.invokeForState('rerender');
  },

  clearRenderedChildren: function() {
    var lengthBefore = this.lengthBeforeRender,
        lengthAfter  = this.lengthAfterRender;

    // If there were child views created during the last call to render(),
    // remove them under the assumption that they will be re-created when
    // we re-render.

    // VIEW-TODO: Unit test this path.
    var childViews = this._childViews;
    for (var i=lengthAfter-1; i>=lengthBefore; i--) {
      if (childViews[i]) { childViews[i].destroy(); }
    }
  },

  
  _applyClassNameBindings: function() {
    var classBindings = get(this, 'classNameBindings'),
        classNames = get(this, 'classNames'),
        elem, newClass, dasherizedClass;

    if (!classBindings) { return; }

    // Loop through all of the configured bindings. These will be either
    // property names ('isUrgent') or property paths relative to the view
    // ('content.isUrgent')
    a_forEach(classBindings, function(binding) {

      // Variable in which the old class value is saved. The observer function
      // closes over this variable, so it knows which string to remove when
      // the property changes.
      var oldClass;

      // Set up an observer on the context. If the property changes, toggle the
      // class name.
      var observer = function() {
        // Get the current value of the property
        newClass = this._classStringForProperty(binding);
        elem = this.$();

        // If we had previously added a class to the element, remove it.
        if (oldClass) {
          elem.removeClass(oldClass);
          // Also remove from classNames so that if the view gets rerendered,
          // the class doesn't get added back to the DOM.
          classNames.removeObject(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if (newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      };

      // Get the class name for the property at its current value
      dasherizedClass = this._classStringForProperty(binding);

      if (dasherizedClass) {
        // Ensure that it gets into the classNames array
        // so it is displayed when we render.
        classNames.push(dasherizedClass);

        // Save a reference to the class name so we can remove it
        // if the observer fires. Remember that this variable has
        // been closed over by the observer.
        oldClass = dasherizedClass;
      }

      // Extract just the property name from bindings like 'foo:bar'
      var parsedPath = Ember.View._parsePropertyPath(binding);
      addObserver(this, parsedPath.path, observer);
    }, this);
  },

  
  _applyAttributeBindings: function(buffer) {
    var attributeBindings = get(this, 'attributeBindings'),
        attributeValue, elem, type;

    if (!attributeBindings) { return; }

    a_forEach(attributeBindings, function(binding) {
      var split = binding.split(':'),
          property = split[0],
          attributeName = split[1] || property;

      // Create an observer to add/remove/change the attribute if the
      // JavaScript property changes.
      var observer = function() {
        elem = this.$();
        if (!elem) { return; }

        attributeValue = get(this, property);

        Ember.View.applyAttributeBindings(elem, attributeName, attributeValue);
      };

      addObserver(this, property, observer);

      // Determine the current value and add it to the render buffer
      // if necessary.
      attributeValue = get(this, property);
      Ember.View.applyAttributeBindings(buffer, attributeName, attributeValue);
    }, this);
  },

 
  _classStringForProperty: function(property) {
    var parsedPath = Ember.View._parsePropertyPath(property);
    var path = parsedPath.path;

    var val = get(this, path);
    if (val === undefined && Ember.isGlobalPath(path)) {
      val = get(window, path);
    }

    return Ember.View._classStringForValue(path, val, parsedPath.className, parsedPath.falsyClassName);
  },

  
  element: Ember.computed(function(key, value) {
    if (value !== undefined) {
      return this.invokeForState('setElement', value);
    } else {
      return this.invokeForState('getElement');
    }
  }).property('_parentView').cacheable(),


  $: function(sel) {
    return this.invokeForState('$', sel);
  },

  
  mutateChildViews: function(callback) {
    var childViews = this._childViews,
        idx = childViews.length,
        view;

    while(--idx >= 0) {
      view = childViews[idx];
      callback.call(this, view, idx);
    }

    return this;
  },

  
  forEachChildView: function(callback) {
    var childViews = this._childViews;

    if (!childViews) { return this; }

    var len = childViews.length,
        view, idx;

    for(idx = 0; idx < len; idx++) {
      view = childViews[idx];
      callback.call(this, view);
    }

    return this;
  },

 
  appendTo: function(target) {
    // Schedule the DOM element to be created and appended to the given
    // element after bindings have synchronized.
    this._insertElementLater(function() {
      Ember.assert("You cannot append to an existing Ember.View. Consider using Ember.ContainerView instead.", !Ember.$(target).is('.ember-view') && !Ember.$(target).parents().is('.ember-view'));
      this.$().appendTo(target);
    });

    return this;
  },

 
  replaceIn: function(target) {
    Ember.assert("You cannot replace an existing Ember.View. Consider using Ember.ContainerView instead.", !Ember.$(target).is('.ember-view') && !Ember.$(target).parents().is('.ember-view'));

    this._insertElementLater(function() {
      Ember.$(target).empty();
      this.$().appendTo(target);
    });

    return this;
  },

 
  _insertElementLater: function(fn) {
    this._lastInsert = Ember.guidFor(fn);
    Ember.run.schedule('render', this, this.invokeForState, 'insertElement', fn);
  },

 
  append: function() {
    return this.appendTo(document.body);
  },

 
  remove: function() {
    // What we should really do here is wait until the end of the run loop
    // to determine if the element has been re-appended to a different
    // element.
    // In the interim, we will just re-render if that happens. It is more
    // important than elements get garbage collected.
    this.destroyElement();
    this.invokeRecursively(function(view) {
      view.clearRenderedChildren();
    });
  },

  
  elementId: Ember.computed(function(key, value) {
    return value !== undefined ? value : Ember.guidFor(this);
  }).cacheable(),

 
  _elementIdDidChange: Ember.beforeObserver(function() {
    throw "Changing a view's elementId after creation is not allowed.";
  }, 'elementId'),

 
  findElementInParentElement: function(parentElem) {
    var id = "#" + get(this, 'elementId');
    return Ember.$(id)[0] || Ember.$(id, parentElem)[0];
  },


  renderBuffer: function(tagName) {
    tagName = tagName || get(this, 'tagName');

    // Explicitly check for null or undefined, as tagName
    // may be an empty string, which would evaluate to false.
    if (tagName === null || tagName === undefined) {
      tagName = 'div';
    }

    return Ember.RenderBuffer(tagName);
  },


  createElement: function() {
    if (get(this, 'element')) { return this; }

    var buffer = this.renderToBuffer();
    set(this, 'element', buffer.element());

    return this;
  },


  willInsertElement: Ember.K,


  didInsertElement: Ember.K,

 
  willRerender: Ember.K,


  invokeRecursively: function(fn) {
    fn.call(this, this);

    this.forEachChildView(function(view) {
      view.invokeRecursively(fn);
    });
  },


  invalidateRecursively: function(key) {
    this.forEachChildView(function(view) {
      view.propertyDidChange(key);
    });
  },

 
  _notifyWillInsertElement: function() {
    this.invokeRecursively(function(view) {
      view.trigger('willInsertElement');
    });
  },

 
  _notifyDidInsertElement: function() {
    this.invokeRecursively(function(view) {
      view.trigger('didInsertElement');
    });
  },

 
  _notifyWillRerender: function() {
    this.invokeRecursively(function(view) {
      view.trigger('willRerender');
    });
  },

 
  destroyElement: function() {
    return this.invokeForState('destroyElement');
  },


  willDestroyElement: function() {},


  _notifyWillDestroyElement: function() {
    this.invokeRecursively(function(view) {
      view.trigger('willDestroyElement');
    });
  },

  
  _elementWillChange: Ember.beforeObserver(function() {
    this.forEachChildView(function(view) {
      Ember.propertyWillChange(view, 'element');
    });
  }, 'element'),

 
  _elementDidChange: Ember.observer(function() {
    this.forEachChildView(function(view) {
      Ember.propertyDidChange(view, 'element');
    });
  }, 'element'),

 
  parentViewDidChange: Ember.K,

 
  renderToBuffer: function(parentBuffer, bufferOperation) {
    var buffer;

    Ember.run.sync();

    // Determine where in the parent buffer to start the new buffer.
    // By default, a new buffer will be appended to the parent buffer.
    // The buffer operation may be changed if the child views array is
    // mutated by Ember.ContainerView.
    bufferOperation = bufferOperation || 'begin';

    // If this is the top-most view, start a new buffer. Otherwise,
    // create a new buffer relative to the original using the
    // provided buffer operation (for example, `insertAfter` will
    // insert a new buffer after the "parent buffer").
    if (parentBuffer) {
      var tagName = get(this, 'tagName');
      if (tagName === null || tagName === undefined) {
        tagName = 'div';
      }

      buffer = parentBuffer[bufferOperation](tagName);
    } else {
      buffer = this.renderBuffer();
    }

    this.buffer = buffer;
    this.transitionTo('inBuffer', false);

    this.lengthBeforeRender = this._childViews.length;

    this.beforeRender(buffer);
    this.render(buffer);
    this.afterRender(buffer);

    this.lengthAfterRender = this._childViews.length;

    return buffer;
  },

  beforeRender: function(buffer) {
    this.applyAttributesToBuffer(buffer);
  },

  afterRender: Ember.K,

 
  applyAttributesToBuffer: function(buffer) {
    // Creates observers for all registered class name and attribute bindings,
    // then adds them to the element.
    this._applyClassNameBindings();

    // Pass the render buffer so the method can apply attributes directly.
    // This isn't needed for class name bindings because they use the
    // existing classNames infrastructure.
    this._applyAttributeBindings(buffer);


    a_forEach(get(this, 'classNames'), function(name){ buffer.addClass(name); });
    buffer.id(get(this, 'elementId'));

    var role = get(this, 'ariaRole');
    if (role) {
      buffer.attr('role', role);
    }

    if (get(this, 'isVisible') === false) {
      buffer.style('display', 'none');
    }
  },

  
  tagName: null,


  ariaRole: null,

  
  classNames: ['ember-view'],

  classNameBindings: [],

  attributeBindings: [],

  state: 'preRender',

  init: function() {
    this._super();

    // Register the view for event handling. This hash is used by
    // Ember.EventDispatcher to dispatch incoming events.
    if (!this.isVirtual) Ember.View.views[get(this, 'elementId')] = this;

    // setup child views. be sure to clone the child views array first
    this._childViews = this._childViews.slice();

    Ember.assert("Only arrays are allowed for 'classNameBindings'", Ember.typeOf(this.classNameBindings) === 'array');
    this.classNameBindings = Ember.A(this.classNameBindings.slice());

    Ember.assert("Only arrays are allowed for 'classNames'", Ember.typeOf(this.classNames) === 'array');
    this.classNames = Ember.A(this.classNames.slice());

    var viewController = get(this, 'viewController');
    if (viewController) {
      viewController = get(viewController);
      if (viewController) {
        set(viewController, 'view', this);
      }
    }
  },

  appendChild: function(view, options) {
    return this.invokeForState('appendChild', view, options);
  },

  removeChild: function(view) {
    // If we're destroying, the entire subtree will be
    // freed, and the DOM will be handled separately,
    // so no need to mess with childViews.
    if (this.isDestroying) { return; }

    // update parent node
    set(view, '_parentView', null);

    // remove view from childViews array.
    var childViews = this._childViews;

    Ember.EnumerableUtils.removeObject(childViews, view);

    this.propertyDidChange('childViews'); // HUH?! what happened to will change?

    return this;
  },

  removeAllChildren: function() {
    return this.mutateChildViews(function(view) {
      this.removeChild(view);
    });
  },

  destroyAllChildren: function() {
    return this.mutateChildViews(function(view) {
      view.destroy();
    });
  },

  removeFromParent: function() {
    var parent = get(this, '_parentView');

    // Remove DOM element from parent
    this.remove();

    if (parent) { parent.removeChild(this); }
    return this;
  },

  willDestroy: function() {
    // calling this._super() will nuke computed properties and observers,
    // so collect any information we need before calling super.
    var childViews = this._childViews,
        parent     = get(this, '_parentView'),
        childLen;

    // destroy the element -- this will avoid each child view destroying
    // the element over and over again...
    if (!this.removedFromDOM) { this.destroyElement(); }

    // remove from non-virtual parent view if viewName was specified
    if (this.viewName) {
      var nonVirtualParentView = get(this, 'parentView');
      if (nonVirtualParentView) {
        set(nonVirtualParentView, this.viewName, null);
      }
    }

    // remove from parent if found. Don't call removeFromParent,
    // as removeFromParent will try to remove the element from
    // the DOM again.
    if (parent) { parent.removeChild(this); }

    this.state = 'destroyed';

    childLen = childViews.length;
    for (var i=childLen-1; i>=0; i--) {
      childViews[i].removedFromDOM = true;
      childViews[i].destroy();
    }

    // next remove view from global hash
    if (!this.isVirtual) delete Ember.View.views[get(this, 'elementId')];
  },

  createChildView: function(view, attrs) {
    if (Ember.View.detect(view)) {
      attrs = attrs || {};
      attrs._parentView = this;
      attrs.templateData = attrs.templateData || get(this, 'templateData');

      view = view.create(attrs);

      // don't set the property on a virtual view, as they are invisible to
      // consumers of the view API
      if (view.viewName) { set(get(this, 'concreteView'), view.viewName, view); }
    } else {
      Ember.assert('You must pass instance or subclass of View', view instanceof Ember.View);
      Ember.assert("You can only pass attributes when a class is provided", !attrs);

      if (!get(view, 'templateData')) {
        set(view, 'templateData', get(this, 'templateData'));
      }

      set(view, '_parentView', this);
    }

    return view;
  },

  becameVisible: Ember.K,
  becameHidden: Ember.K,

  _isVisibleDidChange: Ember.observer(function() {
    var $el = this.$();
    if (!$el) { return; }

    var isVisible = get(this, 'isVisible');

    $el.toggle(isVisible);

    if (this._isAncestorHidden()) { return; }

    if (isVisible) {
      this._notifyBecameVisible();
    } else {
      this._notifyBecameHidden();
    }
  }, 'isVisible'),

  _notifyBecameVisible: function() {
    this.trigger('becameVisible');

    this.forEachChildView(function(view) {
      var isVisible = get(view, 'isVisible');

      if (isVisible || isVisible === null) {
        view._notifyBecameVisible();
      }
    });
  },

  _notifyBecameHidden: function() {
    this.trigger('becameHidden');
    this.forEachChildView(function(view) {
      var isVisible = get(view, 'isVisible');

      if (isVisible || isVisible === null) {
        view._notifyBecameHidden();
      }
    });
  },

  _isAncestorHidden: function() {
    var parent = get(this, 'parentView');

    while (parent) {
      if (get(parent, 'isVisible') === false) { return true; }

      parent = get(parent, 'parentView');
    }

    return false;
  },

  clearBuffer: function() {
    this.invokeRecursively(function(view) {
      this.buffer = null;
    });
  },

  transitionTo: function(state, children) {
    this.state = state;

    if (children !== false) {
      this.forEachChildView(function(view) {
        view.transitionTo(state);
      });
    }
  },

  
  trigger: function(name) {
    this._super.apply(this, arguments);
    var method = this[name];
    if (method) {
      var args = [], i, l;
      for (i = 1, l = arguments.length; i < l; i++) {
        args.push(arguments[i]);
      }
      return method.apply(this, args);
    }
  },

  has: function(name) {
    return Ember.typeOf(this[name]) === 'function' || this._super(name);
  },

  handleEvent: function(eventName, evt) {
    return this.invokeForState('handleEvent', eventName, evt);
  }

});
 
var DOMManager = {
  prepend: function(view, childView) {
    childView._insertElementLater(function() {
      var element = view.$();
      element.prepend(childView.$());
    });
  },

  after: function(view, nextView) {
    nextView._insertElementLater(function() {
      var element = view.$();
      element.after(nextView.$());
    });
  },

  replace: function(view) {
    var element = get(view, 'element');

    set(view, 'element', null);

    view._insertElementLater(function() {
      Ember.$(element).replaceWith(get(view, 'element'));
    });
  },

  remove: function(view) {
    var elem = get(view, 'element');

    set(view, 'element', null);
    view._lastInsert = null;

    Ember.$(elem).remove();
  },

  empty: function(view) {
    view.$().empty();
  }
};

Ember.View.reopen({
  states: Ember.View.states,
  domManager: DOMManager
});

Ember.View.reopenClass({
  _parsePropertyPath: function(path) {
    var split = path.split(/:/),
        propertyPath = split[0],
        classNames = "",
        className,
        falsyClassName;

    // check if the property is defined as prop:class or prop:trueClass:falseClass
    if (split.length > 1) {
      className = split[1];
      if (split.length === 3) { falsyClassName = split[2]; }

      classNames = ':' + className;
      if (falsyClassName) { classNames += ":" + falsyClassName; }
    }

    return {
      path: propertyPath,
      classNames: classNames,
      className: (className === '') ? undefined : className,
      falsyClassName: falsyClassName
    };
  },

  _classStringForValue: function(path, val, className, falsyClassName) {
    // If the value is truthy and we're using the colon syntax,
    // we should return the className directly
    if (!!val && className) {
      return className;

    // If value is a Boolean and true, return the dasherized property
    // name.
    } else if (val === true) {
      // catch syntax like isEnabled::not-enabled
      if (val === true && !className && falsyClassName) { return null; }

      // Normalize property path to be suitable for use
      // as a class name. For exaple, content.foo.barBaz
      // becomes bar-baz.
      var parts = path.split('.');
      return Ember.String.dasherize(parts[parts.length-1]);

    // If the value is false and a falsyClassName is specified, return it
    } else if (val === false && falsyClassName) {
      return falsyClassName;

    // If the value is not false, undefined, or null, return the current
    // value of the property.
    } else if (val !== false && val !== undefined && val !== null) {
      return val;

    // Nothing to display. Return null so that the old class is removed
    // but no new class is added.
    } else {
      return null;
    }
  }
});

// Create a global view hash.
Ember.View.views = {};


Ember.View.childViewsProperty = childViewsProperty;

Ember.View.applyAttributeBindings = function(elem, name, value) {
  var type = Ember.typeOf(value);
  var currentValue = elem.attr(name);

  // if this changes, also change the logic in ember-handlebars/lib/helpers/binding.js
  if ((type === 'string' || (type === 'number' && !isNaN(value))) && value !== currentValue) {
    elem.attr(name, value);
  } else if (value && type === 'boolean') {
    elem.attr(name, name);
  } else if (!value) {
    elem.removeAttr(name);
  }
};

})();



(function() {

var get = Ember.get, set = Ember.set;

Ember.View.states = {
  _default: {
    // appendChild is only legal while rendering the buffer.
    appendChild: function() {
      throw "You can't use appendChild outside of the rendering process";
    },

    $: function() {
      return undefined;
    },

    getElement: function() {
      return null;
    },

    // Handle events from `Ember.EventDispatcher`
    handleEvent: function() {
      return true; // continue event propagation
    },

    destroyElement: function(view) {
      set(view, 'element', null);
      view._lastInsert = null;
      return view;
    }
  }
};

Ember.View.reopen({
  states: Ember.View.states
});

})();



(function() {

Ember.View.states.preRender = {
  parentState: Ember.View.states._default,

  // a view leaves the preRender state once its element has been
  // created (createElement).
  insertElement: function(view, fn) {
    if (view._lastInsert !== Ember.guidFor(fn)){
      return;
    }
    view.createElement();
    view._notifyWillInsertElement();
    // after createElement, the view will be in the hasElement state.
    fn.call(view);
    view.transitionTo('inDOM');
    view._notifyDidInsertElement();
  },

  empty: Ember.K,

  setElement: function(view, value) {
    if (value !== null) {
      view.transitionTo('hasElement');
    }
    return value;
  }
};

})();



(function() {

var get = Ember.get, set = Ember.set, meta = Ember.meta;

Ember.View.states.inBuffer = {
  parentState: Ember.View.states._default,

  $: function(view, sel) {
    // if we don't have an element yet, someone calling this.$() is
    // trying to update an element that isn't in the DOM. Instead,
    // rerender the view to allow the render method to reflect the
    // changes.
    view.rerender();
    return Ember.$();
  },

  // when a view is rendered in a buffer, rerendering it simply
  // replaces the existing buffer with a new one
  rerender: function(view) {
    Ember.deprecate("Something you did caused a view to re-render after it rendered but before it was inserted into the DOM. Because this is avoidable and the cause of significant performance issues in applications, this behavior is deprecated. If you want to use the debugger to find out what caused this, you can set ENV.RAISE_ON_DEPRECATION to true.");

    view._notifyWillRerender();

    view.clearRenderedChildren();
    view.renderToBuffer(view.buffer, 'replaceWith');
  },

  // when a view is rendered in a buffer, appending a child
  // view will render that view and append the resulting
  // buffer into its buffer.
  appendChild: function(view, childView, options) {
    var buffer = view.buffer;

    childView = this.createChildView(childView, options);
    view._childViews.push(childView);

    childView.renderToBuffer(buffer);

    view.propertyDidChange('childViews');

    return childView;
  },

  // when a view is rendered in a buffer, destroying the
  // element will simply destroy the buffer and put the
  // state back into the preRender state.
  destroyElement: function(view) {
    view.clearBuffer();
    view._notifyWillDestroyElement();
    view.transitionTo('preRender');

    return view;
  },

  empty: function() {
    Ember.assert("Emptying a view in the inBuffer state is not allowed and should not happen under normal circumstances. Most likely there is a bug in your application. This may be due to excessive property change notifications.");
  },

  // It should be impossible for a rendered view to be scheduled for
  // insertion.
  insertElement: function() {
    throw "You can't insert an element that has already been rendered";
  },

  setElement: function(view, value) {
    if (value === null) {
      view.transitionTo('preRender');
    } else {
      view.clearBuffer();
      view.transitionTo('hasElement');
    }

    return value;
  }
};


})();



(function() {

var get = Ember.get, set = Ember.set, meta = Ember.meta;

Ember.View.states.hasElement = {
  parentState: Ember.View.states._default,

  $: function(view, sel) {
    var elem = get(view, 'element');
    return sel ? Ember.$(sel, elem) : Ember.$(elem);
  },

  getElement: function(view) {
    var parent = get(view, 'parentView');
    if (parent) { parent = get(parent, 'element'); }
    if (parent) { return view.findElementInParentElement(parent); }
    return Ember.$("#" + get(view, 'elementId'))[0];
  },

  setElement: function(view, value) {
    if (value === null) {
      view.transitionTo('preRender');
    } else {
      throw "You cannot set an element to a non-null value when the element is already in the DOM.";
    }

    return value;
  },

  // once the view has been inserted into the DOM, rerendering is
  // deferred to allow bindings to synchronize.
  rerender: function(view) {
    view._notifyWillRerender();

    view.clearRenderedChildren();

    view.domManager.replace(view);
    return view;
  },

  // once the view is already in the DOM, destroying it removes it
  // from the DOM, nukes its element, and puts it back into the
  // preRender state if inDOM.

  destroyElement: function(view) {
    view._notifyWillDestroyElement();
    view.domManager.remove(view);
    return view;
  },

  empty: function(view) {
    var _childViews = view._childViews, len, idx;
    if (_childViews) {
      len = _childViews.length;
      for (idx = 0; idx < len; idx++) {
        _childViews[idx]._notifyWillDestroyElement();
      }
    }
    view.domManager.empty(view);
  },

  // Handle events from `Ember.EventDispatcher`
  handleEvent: function(view, eventName, evt) {
    if (view.has(eventName)) {
      // Handler should be able to re-dispatch events, so we don't
      // preventDefault or stopPropagation.
      return view.trigger(eventName, evt);
    } else {
      return true; // continue event propagation
    }
  }
};

Ember.View.states.inDOM = {
  parentState: Ember.View.states.hasElement,

  insertElement: function(view, fn) {
    if (view._lastInsert !== Ember.guidFor(fn)){
      return;
    }
    throw "You can't insert an element into the DOM that has already been inserted";
  }
};

})();



(function() {

var destroyedError = "You can't call %@ on a destroyed view", fmt = Ember.String.fmt;

Ember.View.states.destroyed = {
  parentState: Ember.View.states._default,

  appendChild: function() {
    throw fmt(destroyedError, ['appendChild']);
  },
  rerender: function() {
    throw fmt(destroyedError, ['rerender']);
  },
  destroyElement: function() {
    throw fmt(destroyedError, ['destroyElement']);
  },
  empty: function() {
    throw fmt(destroyedError, ['empty']);
  },

  setElement: function() {
    throw fmt(destroyedError, ["set('element', ...)"]);
  },

  // Since element insertion is scheduled, don't do anything if
  // the view has been destroyed between scheduling and execution
  insertElement: Ember.K
};


})();



(function() {

})();



(function() {

var get = Ember.get, set = Ember.set, meta = Ember.meta;
var forEach = Ember.EnumerableUtils.forEach;

var childViewsProperty = Ember.computed(function() {
  return get(this, '_childViews');
}).property('_childViews').cacheable();

Ember.ContainerView = Ember.View.extend({

  init: function() {
    this._super();

    var childViews = get(this, 'childViews');
    Ember.defineProperty(this, 'childViews', childViewsProperty);

    var _childViews = this._childViews;

    forEach(childViews, function(viewName, idx) {
      var view;

      if ('string' === typeof viewName) {
        view = get(this, viewName);
        view = this.createChildView(view);
        set(this, viewName, view);
      } else {
        view = this.createChildView(viewName);
      }

      _childViews[idx] = view;
    }, this);

    var currentView = get(this, 'currentView');
    if (currentView) _childViews.push(this.createChildView(currentView));

    // Make the _childViews array observable
    Ember.A(_childViews);

    // Sets up an array observer on the child views array. This
    // observer will detect when child views are added or removed
    // and update the DOM to reflect the mutation.
    get(this, 'childViews').addArrayObserver(this, {
      willChange: 'childViewsWillChange',
      didChange: 'childViewsDidChange'
    });
  },
  render: function(buffer) {
    this.forEachChildView(function(view) {
      view.renderToBuffer(buffer);
    });
  },
  willDestroy: function() {
    get(this, 'childViews').removeArrayObserver(this, {
      willChange: 'childViewsWillChange',
      didChange: 'childViewsDidChange'
    });

    this._super();
  },
  childViewsWillChange: function(views, start, removed) {
    if (removed === 0) { return; }

    var changedViews = views.slice(start, start+removed);
    this.initializeViews(changedViews, null, null);

    this.invokeForState('childViewsWillChange', views, start, removed);
  },
  childViewsDidChange: function(views, start, removed, added) {
    var len = get(views, 'length');

    // No new child views were added; bail out.
    if (added === 0) return;

    var changedViews = views.slice(start, start+added);
    this.initializeViews(changedViews, this, get(this, 'templateData'));

    // Let the current state handle the changes
    this.invokeForState('childViewsDidChange', views, start, added);
  },

  initializeViews: function(views, parentView, templateData) {
    forEach(views, function(view) {
      set(view, '_parentView', parentView);

      if (!get(view, 'templateData')) {
        set(view, 'templateData', templateData);
      }
    });
  },
  _scheduleInsertion: function(view, prev) {
    if (prev) {
      prev.domManager.after(prev, view);
    } else {
      this.domManager.prepend(this, view);
    }
  },

  currentView: null,

  _currentViewWillChange: Ember.beforeObserver(function() {
    var childViews = get(this, 'childViews'),
        currentView = get(this, 'currentView');

    if (currentView) {
      childViews.removeObject(currentView);
      currentView.destroy();
    }
  }, 'currentView'),

  _currentViewDidChange: Ember.observer(function() {
    var childViews = get(this, 'childViews'),
        currentView = get(this, 'currentView');

    if (currentView) {
      childViews.pushObject(currentView);
    }
  }, 'currentView')
});

// Ember.ContainerView extends the default view states to provide different
// behavior for childViewsWillChange and childViewsDidChange.
Ember.ContainerView.states = {
  parent: Ember.View.states,

  inBuffer: {
    childViewsDidChange: function(parentView, views, start, added) {
      var buffer = parentView.buffer,
          startWith, prev, prevBuffer, view;

      // Determine where to begin inserting the child view(s) in the
      // render buffer.
      if (start === 0) {
        // If views were inserted at the beginning, prepend the first
        // view to the render buffer, then begin inserting any
        // additional views at the beginning.
        view = views[start];
        startWith = start + 1;
        view.renderToBuffer(buffer, 'prepend');
      } else {
        // Otherwise, just insert them at the same place as the child
        // views mutation.
        view = views[start - 1];
        startWith = start;
      }

      for (var i=startWith; i<start+added; i++) {
        prev = view;
        view = views[i];
        prevBuffer = prev.buffer;
        view.renderToBuffer(prevBuffer, 'insertAfter');
      }
    }
  },

  hasElement: {
    childViewsWillChange: function(view, views, start, removed) {
      for (var i=start; i<start+removed; i++) {
        views[i].remove();
      }
    },

    childViewsDidChange: function(view, views, start, added) {
      // If the DOM element for this container view already exists,
      // schedule each child view to insert its DOM representation after
      // bindings have finished syncing.
      var prev = start === 0 ? null : views[start-1];

      for (var i=start; i<start+added; i++) {
        view = views[i];
        this._scheduleInsertion(view, prev);
        prev = view;
      }
    }
  }
};

Ember.ContainerView.states.inDOM = {
  parentState: Ember.ContainerView.states.hasElement
};

Ember.ContainerView.reopen({
  states: Ember.ContainerView.states
});

})();



(function() {

var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;

Ember.CollectionView = Ember.ContainerView.extend(
 {

  
  content: null,

  
  emptyViewClass: Ember.View,

  
  emptyView: null,

  
  itemViewClass: Ember.View,

  
  init: function() {
    var ret = this._super();
    this._contentDidChange();
    return ret;
  },

  _contentWillChange: Ember.beforeObserver(function() {
    var content = this.get('content');

    if (content) { content.removeArrayObserver(this); }
    var len = content ? get(content, 'length') : 0;
    this.arrayWillChange(content, 0, len);
  }, 'content'),

  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content');

    if (content) {
      Ember.assert(fmt("an Ember.CollectionView's content must implement Ember.Array. You passed %@", [content]), Ember.Array.detect(content));
      content.addArrayObserver(this);
    }

    var len = content ? get(content, 'length') : 0;
    this.arrayDidChange(content, 0, null, len);
  }, 'content'),

  willDestroy: function() {
    var content = get(this, 'content');
    if (content) { content.removeArrayObserver(this); }

    this._super();
  },

  arrayWillChange: function(content, start, removedCount) {
    // If the contents were empty before and this template collection has an
    // empty view remove it now.
    var emptyView = get(this, 'emptyView');
    if (emptyView && emptyView instanceof Ember.View) {
      emptyView.removeFromParent();
    }

    // Loop through child views that correspond with the removed items.
    // Note that we loop from the end of the array to the beginning because
    // we are mutating it as we go.
    var childViews = get(this, 'childViews'), childView, idx, len;

    len = get(childViews, 'length');

    var removingAll = removedCount === len;

    if (removingAll) {
      this.invokeForState('empty');
    }

    for (idx = start + removedCount - 1; idx >= start; idx--) {
      childView = childViews[idx];
      if (removingAll) { childView.removedFromDOM = true; }
      childView.destroy();
    }
  },

  arrayDidChange: function(content, start, removed, added) {
    var itemViewClass = get(this, 'itemViewClass'),
        childViews = get(this, 'childViews'),
        addedViews = [], view, item, idx, len, itemTagName;

    if ('string' === typeof itemViewClass) {
      itemViewClass = get(itemViewClass);
    }

    Ember.assert(fmt("itemViewClass must be a subclass of Ember.View, not %@", [itemViewClass]), Ember.View.detect(itemViewClass));

    len = content ? get(content, 'length') : 0;
    if (len) {
      for (idx = start; idx < start+added; idx++) {
        item = content.objectAt(idx);

        view = this.createChildView(itemViewClass, {
          content: item,
          contentIndex: idx
        });

        addedViews.push(view);
      }
    } else {
      var emptyView = get(this, 'emptyView');
      if (!emptyView) { return; }

      emptyView = this.createChildView(emptyView);
      addedViews.push(emptyView);
      set(this, 'emptyView', emptyView);
    }
    childViews.replace(start, 0, addedViews);
  },

  createChildView: function(view, attrs) {
    view = this._super(view, attrs);

    var itemTagName = get(view, 'tagName');
    var tagName = (itemTagName === null || itemTagName === undefined) ? Ember.CollectionView.CONTAINER_MAP[get(this, 'tagName')] : itemTagName;

    set(view, 'tagName', tagName);

    return view;
  }
});

Ember.CollectionView.CONTAINER_MAP = {
  ul: 'li',
  ol: 'li',
  table: 'tr',
  thead: 'tr',
  tbody: 'tr',
  tfoot: 'tr',
  tr: 'td',
  select: 'option'
};

})();



(function() {

})();



(function() {

})();

(function() {
var get = Ember.get, set = Ember.set;


Ember.State = Ember.Object.extend(Ember.Evented,
{
  isState: true,

  
  parentState: null,
  start: null,

  
  name: null,

  
  path: Ember.computed(function() {
    var parentPath = get(this, 'parentState.path'),
        path = get(this, 'name');

    if (parentPath) {
      path = parentPath + '.' + path;
    }

    return path;
  }).property().cacheable(),

  
  trigger: function(name) {
    if (this[name]) {
      this[name].apply(this, [].slice.call(arguments, 1));
    }
    this._super.apply(this, arguments);
  },


  init: function() {
    var states = get(this, 'states'), foundStates;
    set(this, 'childStates', Ember.A());
    set(this, 'eventTransitions', get(this, 'eventTransitions') || {});

    var name, value, transitionTarget;

    

    if (!states) {
      states = {};

      for (name in this) {
        if (name === "constructor") { continue; }

        if (value = this[name]) {
          if (transitionTarget = value.transitionTarget) {
            this.eventTransitions[name] = transitionTarget;
          }

          this.setupChild(states, name, value);
        }
      }

      set(this, 'states', states);
    } else {
      for (name in states) {
        this.setupChild(states, name, states[name]);
      }
    }

    set(this, 'pathsCache', {});
    set(this, 'pathsCacheNoContext', {});
  },


  setupChild: function(states, name, value) {
    if (!value) { return false; }

    if (value.isState) {
      set(value, 'name', name);
    } else if (Ember.State.detect(value)) {
      value = value.create({
        name: name
      });
    }

    if (value.isState) {
      set(value, 'parentState', this);
      get(this, 'childStates').pushObject(value);
      states[name] = value;
    }
  },

  lookupEventTransition: function(name) {
    var path, state = this;

    while(state && !path) {
      path = state.eventTransitions[name];
      state = state.get('parentState');
    }

    return path;
  },

  isLeaf: Ember.computed(function() {
    return !get(this, 'childStates').length;
  }).cacheable(),

  
  hasContext: true,

  
  setup: Ember.K,

  
  enter: Ember.K,

  
  exit: Ember.K
});

var Event = Ember.$ && Ember.$.Event;

Ember.State.reopenClass(
{

  transitionTo: function(target) {
    var event = function(stateManager, context) {
      if (Event && context instanceof Event) {
        if (context.hasOwnProperty('context')) {
          context = context.context;
        } else {
          // If we received an event and it doesn't contain
          // a context, don't pass along a superfluous
          // context to the target of the event.
          return stateManager.transitionTo(target);
        }
      }

      stateManager.transitionTo(target, context);
    };

    event.transitionTarget = target;

    return event;
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;
var arrayForEach = Ember.ArrayPolyfills.forEach;

var Transition = function(raw) {
  this.enterStates = raw.enterStates.slice();
  this.exitStates = raw.exitStates.slice();
  this.resolveState = raw.resolveState;

  this.finalState = raw.enterStates[raw.enterStates.length - 1] || raw.resolveState;
};

Transition.prototype = {

  normalize: function(manager, contexts) {
    this.matchContextsToStates(contexts);
    this.addInitialStates();
    this.removeUnchangedContexts(manager);
    return this;
  },

  matchContextsToStates: function(contexts) {
    var stateIdx = this.enterStates.length - 1,
        matchedContexts = [],
        state,
        context;

    while (contexts.length > 0) {
      if (stateIdx >= 0) {
        state = this.enterStates[stateIdx--];
      } else {
        if (this.enterStates.length) {
          state = get(this.enterStates[0], 'parentState');
          if (!state) { throw "Cannot match all contexts to states"; }
        } else {
          // If re-entering the current state with a context, the resolve
          // state will be the current state.
          state = this.resolveState;
        }

        this.enterStates.unshift(state);
        this.exitStates.unshift(state);
      }

      // in routers, only states with dynamic segments have a context
      if (get(state, 'hasContext')) {
        context = contexts.pop();
      } else {
        context = null;
      }

      matchedContexts.unshift(context);
    }

    this.contexts = matchedContexts;
  },

  addInitialStates: function() {
    var finalState = this.finalState, initialState;

    while(true) {
      initialState = get(finalState, 'initialState') || 'start';
      finalState = get(finalState, 'states.' + initialState);

      if (!finalState) { break; }

      this.finalState = finalState;
      this.enterStates.push(finalState);
      this.contexts.push(undefined);
    }
  },

  removeUnchangedContexts: function(manager) {
    // Start from the beginning of the enter states. If the state was added
    // to the list during the context matching phase, make sure the context
    // has actually changed since the last time the state was entered.
    while (this.enterStates.length > 0) {
      if (this.enterStates[0] !== this.exitStates[0]) { break; }

      if (this.enterStates.length === this.contexts.length) {
        if (manager.getStateMeta(this.enterStates[0], 'context') !== this.contexts[0]) { break; }
        this.contexts.shift();
      }

      this.resolveState = this.enterStates.shift();
      this.exitStates.shift();
    }
  }
};

Ember.StateManager = Ember.State.extend(
 {

  
  init: function() {
    this._super();

    set(this, 'stateMeta', Ember.Map.create());

    var initialState = get(this, 'initialState');

    if (!initialState && get(this, 'states.start')) {
      initialState = 'start';
    }

    if (initialState) {
      this.transitionTo(initialState);
      Ember.assert('Failed to transition to initial state "' + initialState + '"', !!get(this, 'currentState'));
    }
  },

  stateMetaFor: function(state) {
    var meta = get(this, 'stateMeta'),
        stateMeta = meta.get(state);

    if (!stateMeta) {
      stateMeta = {};
      meta.set(state, stateMeta);
    }

    return stateMeta;
  },

  setStateMeta: function(state, key, value) {
    return set(this.stateMetaFor(state), key, value);
  },

  getStateMeta: function(state, key) {
    return get(this.stateMetaFor(state), key);
  },

  currentState: null,
  transitionEvent: 'setup',
  errorOnUnhandledEvent: true,

  send: function(event, context) {
    Ember.assert('Cannot send event "' + event + '" while currentState is ' + get(this, 'currentState'), get(this, 'currentState'));
    return this.sendRecursively(event, get(this, 'currentState'), context);
  },

  sendRecursively: function(event, currentState, context) {
    var log = this.enableLogging,
        action = currentState[event];

    
    if (typeof action === 'function') {
      if (log) { Ember.Logger.log(fmt("STATEMANAGER: Sending event '%@' to state %@.", [event, get(currentState, 'path')])); }
      return action.call(currentState, this, context);
    } else {
      var parentState = get(currentState, 'parentState');
      if (parentState) {
        return this.sendRecursively(event, parentState, context);
      } else if (get(this, 'errorOnUnhandledEvent')) {
        throw new Ember.Error(this.toString() + " could not respond to event " + event + " in state " + get(this, 'currentState.path') + ".");
      }
    }
  },

  
  getStateByPath: function(root, path) {
    var parts = path.split('.'),
        state = root;

    for (var i=0, l=parts.length; i<l; i++) {
      state = get(get(state, 'states'), parts[i]);
      if (!state) { break; }
    }

    return state;
  },

  findStateByPath: function(state, path) {
    var possible;

    while (!possible && state) {
      possible = this.getStateByPath(state, path);
      state = get(state, 'parentState');
    }

    return possible;
  },

  
  findStatesByPath: function(origin, path) {
    if (!path || path === "") { return undefined; }
    var r = path.split('.'),
        ret = [];

    for (var i=0, len = r.length; i < len; i++) {
      var states = get(origin, 'states');

      if (!states) { return undefined; }

      var s = get(states, r[i]);
      if (s) { origin = s; ret.push(s); }
      else { return undefined; }
    }

    return ret;
  },

  goToState: function() {
    // not deprecating this yet so people don't constantly need to
    // make trivial changes for little reason.
    return this.transitionTo.apply(this, arguments);
  },

  transitionTo: function(path, context) {
    // XXX When is transitionTo called with no path
    if (Ember.empty(path)) { return; }

    // The ES6 signature of this function is `path, ...contexts`
    var contexts = context ? Array.prototype.slice.call(arguments, 1) : [],
        currentState = get(this, 'currentState') || this;

    // First, get the enter, exit and resolve states for the current state
    // and specified path. If possible, use an existing cache.
    var hash = this.contextFreeTransition(currentState, path);

    // Next, process the raw state information for the contexts passed in.
    var transition = new Transition(hash).normalize(this, contexts);

    this.enterState(transition);
    this.triggerSetupContext(transition);
  },

  contextFreeTransition: function(currentState, path) {
    var cache = currentState.pathsCache[path];
    if (cache) { return cache; }

    var enterStates = this.findStatesByPath(currentState, path),
        exitStates = [],
        resolveState = currentState;

    
    while (resolveState && !enterStates) {
      exitStates.unshift(resolveState);

      resolveState = get(resolveState, 'parentState');
      if (!resolveState) {
        enterStates = this.findStatesByPath(this, path);
        if (!enterStates) {
          Ember.assert('Could not find state for path: "'+path+'"');
          return;
        }
      }
      enterStates = this.findStatesByPath(resolveState, path);
    }

    
    while (enterStates.length > 0 && enterStates[0] === exitStates[0]) {
      resolveState = enterStates.shift();
      exitStates.shift();
    }

    // Cache the enterStates, exitStates, and resolveState for the
    // current state and the `path`.
    var transitions = currentState.pathsCache[path] = {
      exitStates: exitStates,
      enterStates: enterStates,
      resolveState: resolveState
    };

    return transitions;
  },

  triggerSetupContext: function(transitions) {
    var contexts = transitions.contexts,
        offset = transitions.enterStates.length - contexts.length,
        enterStates = transitions.enterStates,
        transitionEvent = get(this, 'transitionEvent');

    Ember.assert("More contexts provided than states", offset >= 0);

    arrayForEach.call(enterStates, function(state, idx) {
      state.trigger(transitionEvent, this, contexts[idx-offset]);
    }, this);
  },

  getState: function(name) {
    var state = get(this, name),
        parentState = get(this, 'parentState');

    if (state) {
      return state;
    } else if (parentState) {
      return parentState.getState(name);
    }
  },

  enterState: function(transition) {
    var log = this.enableLogging;

    var exitStates = transition.exitStates.slice(0).reverse();
    arrayForEach.call(exitStates, function(state) {
      state.trigger('exit', this);
    }, this);

    arrayForEach.call(transition.enterStates, function(state) {
      if (log) { Ember.Logger.log("STATEMANAGER: Entering " + get(state, 'path')); }
      state.trigger('enter', this);
    }, this);

    set(this, 'currentState', transition.finalState);
  }
});

})();



(function() {

})();

(function() {
var get = Ember.get;

Ember._ResolvedState = Ember.Object.extend({
  manager: null,
  state: null,
  match: null,

  object: Ember.computed(function(key, value) {
    if (arguments.length === 2) {
      this._object = value;
      return value;
    } else {
      if (this._object) {
        return this._object;
      } else {
        var state = get(this, 'state'),
            match = get(this, 'match'),
            manager = get(this, 'manager');
        return state.deserialize(manager, match.hash);
      }
    }
  }).property(),

  hasPromise: Ember.computed(function() {
    return Ember.canInvoke(get(this, 'object'), 'then');
  }).property('object'),

  promise: Ember.computed(function() {
    var object = get(this, 'object');
    if (Ember.canInvoke(object, 'then')) {
      return object;
    } else {
      return {
        then: function(success) { success(object); }
      };
    }
  }).property('object'),

  transition: function() {
    var manager = get(this, 'manager'),
        path = get(this, 'state.path'),
        object = get(this, 'object');
    manager.transitionTo(path, object);
  }
});

})();



(function() {
var get = Ember.get;

var paramForClass = function(classObject) {
  var className = classObject.toString(),
      parts = className.split("."),
      last = parts[parts.length - 1];

  return Ember.String.underscore(last) + "_id";
};

var merge = function(original, hash) {
  for (var prop in hash) {
    if (!hash.hasOwnProperty(prop)) { continue; }
    if (original.hasOwnProperty(prop)) { continue; }

    original[prop] = hash[prop];
  }
};


Ember.Routable = Ember.Mixin.create({
  init: function() {
    var redirection;
    this.on('connectOutlets', this, this.stashContext);

    if (redirection = get(this, 'redirectsTo')) {
      Ember.assert("You cannot use `redirectsTo` if you already have a `connectOutlets` method", this.connectOutlets === Ember.K);

      this.connectOutlets = function(router) {
        router.transitionTo(redirection);
      };
    }

    // normalize empty route to '/'
    var route = get(this, 'route');
    if (route === '') {
      route = '/';
    }

    this._super();

    Ember.assert("You cannot use `redirectsTo` on a state that has child states", !redirection || (!!redirection && !!get(this, 'isLeaf')));
  },

  stashContext: function(manager, context) {
    var serialized = this.serialize(manager, context);
    Ember.assert('serialize must return a hash', !serialized || typeof serialized === 'object');

    manager.setStateMeta(this, 'context', context);
    manager.setStateMeta(this, 'serialized', serialized);

    if (get(this, 'isRoutable') && !get(manager, 'isRouting')) {
      this.updateRoute(manager, get(manager, 'location'));
    }
  },

 
  updateRoute: function(manager, location) {
    if (get(this, 'isLeafRoute')) {
      var path = this.absoluteRoute(manager);
      location.setURL(path);
    }
  },

  
  absoluteRoute: function(manager, hash) {
    var parentState = get(this, 'parentState');
    var path = '', generated;

    // If the parent state is routable, use its current path
    // as this route's prefix.
    if (get(parentState, 'isRoutable')) {
      path = parentState.absoluteRoute(manager, hash);
    }

    var matcher = get(this, 'routeMatcher'),
        serialized = manager.getStateMeta(this, 'serialized');

    // merge the existing serialized object in with the passed
    // in hash.
    hash = hash || {};
    merge(hash, serialized);

    generated = matcher && matcher.generate(hash);

    if (generated) {
      path = path + '/' + generated;
    }

    return path;
  },

  
  isRoutable: Ember.computed(function() {
    return typeof get(this, 'route') === 'string';
  }).cacheable(),

  
  isLeafRoute: Ember.computed(function() {
    if (get(this, 'isLeaf')) { return true; }
    return !get(this, 'childStates').findProperty('isRoutable');
  }).cacheable(),

  routeMatcher: Ember.computed(function() {
    var route = get(this, 'route');
    if (route) {
      return Ember._RouteMatcher.create({ route: route });
    }
  }).cacheable(),

  
  hasContext: Ember.computed(function() {
    var routeMatcher = get(this, 'routeMatcher');
    if (routeMatcher) {
      return routeMatcher.identifiers.length > 0;
    }
  }).cacheable(),

  
  modelClass: Ember.computed(function() {
    var modelType = get(this, 'modelType');

    if (typeof modelType === 'string') {
      return Ember.get(window, modelType);
    } else {
      return modelType;
    }
  }).cacheable(),

  
  modelClassFor: function(namespace) {
    var modelClass, routeMatcher, identifiers, match, className;

    // if an explicit modelType was specified, use that
    if (modelClass = get(this, 'modelClass')) { return modelClass; }

    // if the router has no lookup namespace, we won't be able to guess
    // the modelType
    if (!namespace) { return; }

    // make sure this state is actually a routable state
    routeMatcher = get(this, 'routeMatcher');
    if (!routeMatcher) { return; }

    // only guess modelType for states with a single dynamic segment
    // (no more, no fewer)
    identifiers = routeMatcher.identifiers;
    if (identifiers.length !== 2) { return; }

    // extract the `_id` from the end of the dynamic segment; if the
    // dynamic segment does not end in `_id`, we can't guess the
    // modelType
    match = identifiers[1].match(/^(.*)_id$/);
    if (!match) { return; }

    // convert the underscored type into a class form and look it up
    // on the router's namespace
    className = Ember.String.classify(match[1]);
    return get(namespace, className);
  },

  
  deserialize: function(manager, params) {
    var modelClass, routeMatcher, param;

    if (modelClass = this.modelClassFor(get(manager, 'namespace'))) {
      Ember.assert("Expected "+modelClass.toString()+" to implement `find` for use in '"+this.get('path')+"' `deserialize`. Please implement the `find` method or overwrite `deserialize`.", modelClass.find);
      return modelClass.find(params[paramForClass(modelClass)]);
    }

    return params;
  },

  
  serialize: function(manager, context) {
    var modelClass, routeMatcher, namespace, param, id;

    if (Ember.empty(context)) { return ''; }

    if (modelClass = this.modelClassFor(get(manager, 'namespace'))) {
      param = paramForClass(modelClass);
      id = get(context, 'id');
      context = {};
      context[param] = id;
    }

    return context;
  },

  
  resolvePath: function(manager, path) {
    if (get(this, 'isLeafRoute')) { return Ember.A(); }

    var childStates = get(this, 'childStates'), match;

    childStates = Ember.A(childStates.filterProperty('isRoutable'));

    childStates = childStates.sort(function(a, b) {
      var aDynamicSegments = get(a, 'routeMatcher.identifiers.length'),
          bDynamicSegments = get(b, 'routeMatcher.identifiers.length'),
          aRoute = get(a, 'route'),
          bRoute = get(b, 'route');

      if (aRoute.indexOf(bRoute) === 0) {
        return -1;
      } else if (bRoute.indexOf(aRoute) === 0) {
        return 1;
      }

      if (aDynamicSegments !== bDynamicSegments) {
        return aDynamicSegments - bDynamicSegments;
      }

      return get(b, 'route.length') - get(a, 'route.length');
    });

    var state = childStates.find(function(state) {
      var matcher = get(state, 'routeMatcher');
      if (match = matcher.match(path)) { return true; }
    });

    Ember.assert("Could not find state for path " + path, !!state);

    var resolvedState = Ember._ResolvedState.create({
      manager: manager,
      state: state,
      match: match
    });

    var states = state.resolvePath(manager, match.remaining);

    return Ember.A([resolvedState]).pushObjects(states);
  },

  
  routePath: function(manager, path) {
    if (get(this, 'isLeafRoute')) { return; }

    var resolvedStates = this.resolvePath(manager, path),
        hasPromises = resolvedStates.some(function(s) { return get(s, 'hasPromise'); });

    function runTransition() {
      resolvedStates.forEach(function(rs) { rs.transition(); });
    }

    if (hasPromises) {
      manager.transitionTo('loading');

      Ember.assert('Loading state should be the child of a route', Ember.Routable.detect(get(manager, 'currentState.parentState')));
      Ember.assert('Loading state should not be a route', !Ember.Routable.detect(get(manager, 'currentState')));

      manager.handleStatePromises(resolvedStates, runTransition);
    } else {
      runTransition();
    }
  },

  
  unroutePath: function(router, path) {
    var parentState = get(this, 'parentState');

    // If we're at the root state, we're done
    if (parentState === router) {
      return;
    }

    path = path.replace(/^(?=[^\/])/, "/");
    var absolutePath = this.absoluteRoute(router);

    var route = get(this, 'route');

    // If the current path is empty, move up one state,
    // because the index ('/') state must be a leaf node.
    if (route !== '/') {
      // If the current path is a prefix of the path we're trying
      // to go to, we're done.
      var index = path.indexOf(absolutePath),
          next = path.charAt(absolutePath.length);

      if (index === 0 && (next === "/" || next === "")) {
        return;
      }
    }

    // Transition to the parent and call unroute again.
    router.enterState({
      exitStates: [this],
      enterStates: [],
      finalState: parentState
    });

    router.send('unroutePath', path);
  },

  
  connectOutlets: Ember.K,

  
  navigateAway: Ember.K
});

})();



(function() {

Ember.Route = Ember.State.extend(Ember.Routable);

})();



(function() {
var escapeForRegex = function(text) {
  return text.replace(/[\-\[\]{}()*+?.,\\\^\$|#\s]/g, "\\$&");
};

Ember._RouteMatcher = Ember.Object.extend({
  state: null,

  init: function() {
    var route = this.route,
        identifiers = [],
        count = 1,
        escaped;

    // Strip off leading slash if present
    if (route.charAt(0) === '/') {
      route = this.route = route.substr(1);
    }

    escaped = escapeForRegex(route);

    var regex = escaped.replace(/:([a-z_]+)(?=$|\/)/gi, function(match, id) {
      identifiers[count++] = id;
      return "([^/]+)";
    });

    this.identifiers = identifiers;
    this.regex = new RegExp("^/?" + regex);
  },

  match: function(path) {
    var match = path.match(this.regex);

    if (match) {
      var identifiers = this.identifiers,
          hash = {};

      for (var i=1, l=identifiers.length; i<l; i++) {
        hash[identifiers[i]] = match[i];
      }

      return {
        remaining: path.substr(match[0].length),
        hash: identifiers.length > 0 ? hash : null
      };
    }
  },

  generate: function(hash) {
    var identifiers = this.identifiers, route = this.route, id;
    for (var i=1, l=identifiers.length; i<l; i++) {
      id = identifiers[i];
      route = route.replace(new RegExp(":" + id), hash[id]);
    }
    return route;
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set;

var merge = function(original, hash) {
  for (var prop in hash) {
    if (!hash.hasOwnProperty(prop)) { continue; }
    if (original.hasOwnProperty(prop)) { continue; }

    original[prop] = hash[prop];
  }
};

Ember.Router = Ember.StateManager.extend(
 {

  
  initialState: 'root',

  
  location: 'hash',

  

  rootURL: '/',

 
  transitionEvent: 'connectOutlets',

  transitionTo: function() {
    this.abortRoutingPromises();
    this._super.apply(this, arguments);
  },

  route: function(path) {
    this.abortRoutingPromises();

    set(this, 'isRouting', true);

    var routableState;

    try {
      path = path.replace(/^(?=[^\/])/, "/");

      this.send('navigateAway');
      this.send('unroutePath', path);

      routableState = get(this, 'currentState');
      while (routableState && !routableState.get('isRoutable')) {
        routableState = get(routableState, 'parentState');
      }
      var currentURL = routableState ? routableState.absoluteRoute(this) : '';
      var rest = path.substr(currentURL.length);

      this.send('routePath', rest);
    } finally {
      set(this, 'isRouting', false);
    }

    routableState = get(this, 'currentState');
    while (routableState && !routableState.get('isRoutable')) {
      routableState = get(routableState, 'parentState');
    }

    if (routableState) {
      routableState.updateRoute(this, get(this, 'location'));
    }
  },

  urlFor: function(path, hash) {
    var currentState = get(this, 'currentState') || this,
        state = this.findStateByPath(currentState, path);

    Ember.assert(Ember.String.fmt("Could not find route with path '%@'", [path]), !!state);
    Ember.assert("To get a URL for a state, it must have a `route` property.", !!get(state, 'routeMatcher'));

    var location = get(this, 'location'),
        absoluteRoute = state.absoluteRoute(this, hash);

    return location.formatURL(absoluteRoute);
  },

  urlForEvent: function(eventName) {
    var contexts = Array.prototype.slice.call(arguments, 1);
    var currentState = get(this, 'currentState');
    var targetStateName = currentState.lookupEventTransition(eventName);

    Ember.assert(Ember.String.fmt("You must specify a target state for event '%@' in order to link to it in the current state '%@'.", [eventName, get(currentState, 'path')]), !!targetStateName);

    var targetState = this.findStateByPath(currentState, targetStateName);

    Ember.assert("Your target state name " + targetStateName + " for event " + eventName + " did not resolve to a state", !!targetState);

    var hash = this.serializeRecursively(targetState, contexts, {});

    return this.urlFor(targetStateName, hash);
  },

  
  serializeRecursively: function(state, contexts, hash) {
    var parentState,
        context = get(state, 'hasContext') ? contexts.pop() : null;
    merge(hash, state.serialize(this, context));
    parentState = state.get("parentState");
    if (parentState && parentState instanceof Ember.Route) {
      return this.serializeRecursively(parentState, contexts, hash);
    } else {
      return hash;
    }
  },

  abortRoutingPromises: function() {
    if (this._routingPromises) {
      this._routingPromises.abort();
      this._routingPromises = null;
    }
  },

  
  handleStatePromises: function(states, complete) {
    this.abortRoutingPromises();

    this.set('isLocked', true);

    var manager = this;

    this._routingPromises = Ember._PromiseChain.create({
      promises: states.slice(),

      successCallback: function() {
        manager.set('isLocked', false);
        complete();
      },

      failureCallback: function() {
        throw "Unable to load object";
      },

      promiseSuccessCallback: function(item, args) {
        set(item, 'object', args[0]);
      },

      abortCallback: function() {
        manager.set('isLocked', false);
      }
    }).start();
  },

  
  init: function() {
    this._super();

    var location = get(this, 'location'),
        rootURL = get(this, 'rootURL');

    if ('string' === typeof location) {
      set(this, 'location', Ember.Location.create({
        implementation: location,
        rootURL: rootURL
      }));
    }
  },

  
  willDestroy: function() {
    get(this, 'location').destroy();
  }
});

})();



(function() {

})();

(function() {
var get = Ember.get;

Ember.StateManager.reopen(
 {

  
  currentView: Ember.computed(function() {
    var currentState = get(this, 'currentState'),
        view;

    while (currentState) {
      // TODO: Remove this when view state is removed
      if (get(currentState, 'isViewState')) {
        view = get(currentState, 'view');
        if (view) { return view; }
      }

      currentState = get(currentState, 'parentState');
    }

    return null;
  }).property('currentState').cacheable()

});

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.ViewState = Ember.State.extend(
 {
  isViewState: true,

  init: function() {
    Ember.deprecate("Ember.ViewState is deprecated and will be removed from future releases. Consider using the outlet pattern to display nested views instead. For more information, see http://emberjs.com/guides/outlets/.");
    return this._super();
  },

  enter: function(stateManager) {
    var view = get(this, 'view'), root, childViews;

    if (view) {
      if (Ember.View.detect(view)) {
        view = view.create();
        set(this, 'view', view);
      }

      Ember.assert('view must be an Ember.View', view instanceof Ember.View);

      root = stateManager.get('rootView');

      if (root) {
        childViews = get(root, 'childViews');
        childViews.pushObject(view);
      } else {
        root = stateManager.get('rootElement') || 'body';
        view.appendTo(root);
      }
    }
  },

  exit: function(stateManager) {
    var view = get(this, 'view');

    if (view) {
      // If the view has a parent view, then it is
      // part of a view hierarchy and should be removed
      // from its parent.
      if (get(view, 'parentView')) {
        view.removeFromParent();
      } else {

        // Otherwise, the view is a "root view" and
        // was appended directly to the DOM.
        view.remove();
      }
    }
  }
});

})();



(function() {

})();

(function() {


(function(window) {

  var K = function(){},
      guid = 0,
      document = window.document,

      // Feature-detect the W3C range API, the extended check is for IE9 which only partially supports ranges
      supportsRange = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment,

      // Internet Explorer prior to 9 does not allow setting innerHTML if the first element
      // is a "zero-scope" element. This problem can be worked around by making
      // the first node an invisible text node. We, like Modernizr, use &shy;
      needsShy = (function(){
        var testEl = document.createElement('div');
        testEl.innerHTML = "<div></div>";
        testEl.firstChild.innerHTML = "<script></script>";
        return testEl.firstChild.innerHTML === '';
      })();

  // Constructor that supports either Metamorph('foo') or new
  // Metamorph('foo');
  //
  // Takes a string of HTML as the argument.

  var Metamorph = function(html) {
    var self;

    if (this instanceof Metamorph) {
      self = this;
    } else {
      self = new K();
    }

    self.innerHTML = html;
    var myGuid = 'metamorph-'+(guid++);
    self.start = myGuid + '-start';
    self.end = myGuid + '-end';

    return self;
  };

  K.prototype = Metamorph.prototype;

  var rangeFor, htmlFunc, removeFunc, outerHTMLFunc, appendToFunc, afterFunc, prependFunc, startTagFunc, endTagFunc;

  outerHTMLFunc = function() {
    return this.startTag() + this.innerHTML + this.endTag();
  };

  startTagFunc = function() {
    return "<script id='" + this.start + "' type='text/x-placeholder'></script>";
  };

  endTagFunc = function() {
    return "<script id='" + this.end + "' type='text/x-placeholder'></script>";
  };

  // If we have the W3C range API, this process is relatively straight forward.
  if (supportsRange) {

    // Get a range for the current morph. Optionally include the starting and
    // ending placeholders.
    rangeFor = function(morph, outerToo) {
      var range = document.createRange();
      var before = document.getElementById(morph.start);
      var after = document.getElementById(morph.end);

      if (outerToo) {
        range.setStartBefore(before);
        range.setEndAfter(after);
      } else {
        range.setStartAfter(before);
        range.setEndBefore(after);
      }

      return range;
    };

    htmlFunc = function(html, outerToo) {
      // get a range for the current metamorph object
      var range = rangeFor(this, outerToo);

      // delete the contents of the range, which will be the
      // nodes between the starting and ending placeholder.
      range.deleteContents();

      // create a new document fragment for the HTML
      var fragment = range.createContextualFragment(html);

      // insert the fragment into the range
      range.insertNode(fragment);
    };

    removeFunc = function() {
      // get a range for the current metamorph object including
      // the starting and ending placeholders.
      var range = rangeFor(this, true);

      // delete the entire range.
      range.deleteContents();
    };

    appendToFunc = function(node) {
      var range = document.createRange();
      range.setStart(node);
      range.collapse(false);
      var frag = range.createContextualFragment(this.outerHTML());
      node.appendChild(frag);
    };

    afterFunc = function(html) {
      var range = document.createRange();
      var after = document.getElementById(this.end);

      range.setStartAfter(after);
      range.setEndAfter(after);

      var fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
    };

    prependFunc = function(html) {
      var range = document.createRange();
      var start = document.getElementById(this.start);

      range.setStartAfter(start);
      range.setEndAfter(start);

      var fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
    };

  } else {
    
    var wrapMap = {
      select: [ 1, "<select multiple='multiple'>", "</select>" ],
      fieldset: [ 1, "<fieldset>", "</fieldset>" ],
      table: [ 1, "<table>", "</table>" ],
      tbody: [ 2, "<table><tbody>", "</tbody></table>" ],
      tr: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
      colgroup: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
      map: [ 1, "<map>", "</map>" ],
      _default: [ 0, "", "" ]
    };

   
    var firstNodeFor = function(parentNode, html) {
      var arr = wrapMap[parentNode.tagName.toLowerCase()] || wrapMap._default;
      var depth = arr[0], start = arr[1], end = arr[2];

      if (needsShy) { html = '&shy;'+html; }

      var element = document.createElement('div');
      element.innerHTML = start + html + end;

      for (var i=0; i<=depth; i++) {
        element = element.firstChild;
      }

      // Look for &shy; to remove it.
      if (needsShy) {
        var shyElement = element;

        // Sometimes we get nameless elements with the shy inside
        while (shyElement.nodeType === 1 && !shyElement.nodeName) {
          shyElement = shyElement.firstChild;
        }

        // At this point it's the actual unicode character.
        if (shyElement.nodeType === 3 && shyElement.nodeValue.charAt(0) === "\u00AD") {
          shyElement.nodeValue = shyElement.nodeValue.slice(1);
        }
      }

      return element;
    };

    
    var realNode = function(start) {
      while (start.parentNode.tagName === "") {
        start = start.parentNode;
      }

      return start;
    };

    
    var fixParentage = function(start, end) {
      if (start.parentNode !== end.parentNode) {
        end.parentNode.insertBefore(start, end.parentNode.firstChild);
      }
    };

    htmlFunc = function(html, outerToo) {
      // get the real starting node. see realNode for details.
      var start = realNode(document.getElementById(this.start));
      var end = document.getElementById(this.end);
      var parentNode = end.parentNode;
      var node, nextSibling, last;

      // make sure that the start and end nodes share the same
      // parent. If not, fix it.
      fixParentage(start, end);

      // remove all of the nodes after the starting placeholder and
      // before the ending placeholder.
      node = start.nextSibling;
      while (node) {
        nextSibling = node.nextSibling;
        last = node === end;

        // if this is the last node, and we want to remove it as well,
        // set the `end` node to the next sibling. This is because
        // for the rest of the function, we insert the new nodes
        // before the end (note that insertBefore(node, null) is
        // the same as appendChild(node)).
        //
        // if we do not want to remove it, just break.
        if (last) {
          if (outerToo) { end = node.nextSibling; } else { break; }
        }

        node.parentNode.removeChild(node);

        // if this is the last node and we didn't break before
        // (because we wanted to remove the outer nodes), break
        // now.
        if (last) { break; }

        node = nextSibling;
      }

      // get the first node for the HTML string, even in cases like
      // tables and lists where a simple innerHTML on a div would
      // swallow some of the content.
      node = firstNodeFor(start.parentNode, html);

      // copy the nodes for the HTML between the starting and ending
      // placeholder.
      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, end);
        node = nextSibling;
      }
    };

    // remove the nodes in the DOM representing this metamorph.
    //
    // this includes the starting and ending placeholders.
    removeFunc = function() {
      var start = realNode(document.getElementById(this.start));
      var end = document.getElementById(this.end);

      this.html('');
      start.parentNode.removeChild(start);
      end.parentNode.removeChild(end);
    };

    appendToFunc = function(parentNode) {
      var node = firstNodeFor(parentNode, this.outerHTML());

      while (node) {
        nextSibling = node.nextSibling;
        parentNode.appendChild(node);
        node = nextSibling;
      }
    };

    afterFunc = function(html) {
      // get the real starting node. see realNode for details.
      var end = document.getElementById(this.end);
      var insertBefore = end.nextSibling;
      var parentNode = end.parentNode;
      var nextSibling;
      var node;

      // get the first node for the HTML string, even in cases like
      // tables and lists where a simple innerHTML on a div would
      // swallow some of the content.
      node = firstNodeFor(parentNode, html);

      // copy the nodes for the HTML between the starting and ending
      // placeholder.
      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, insertBefore);
        node = nextSibling;
      }
    };

    prependFunc = function(html) {
      var start = document.getElementById(this.start);
      var parentNode = start.parentNode;
      var nextSibling;
      var node;

      node = firstNodeFor(parentNode, html);
      var insertBefore = start.nextSibling;

      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, insertBefore);
        node = nextSibling;
      }
    }
  }

  Metamorph.prototype.html = function(html) {
    this.checkRemoved();
    if (html === undefined) { return this.innerHTML; }

    htmlFunc.call(this, html);

    this.innerHTML = html;
  };

  Metamorph.prototype.replaceWith = function(html) {
    this.checkRemoved();
    htmlFunc.call(this, html, true);
  };

  Metamorph.prototype.remove = removeFunc;
  Metamorph.prototype.outerHTML = outerHTMLFunc;
  Metamorph.prototype.appendTo = appendToFunc;
  Metamorph.prototype.after = afterFunc;
  Metamorph.prototype.prepend = prependFunc;
  Metamorph.prototype.startTag = startTagFunc;
  Metamorph.prototype.endTag = endTagFunc;

  Metamorph.prototype.isRemoved = function() {
    var before = document.getElementById(this.start);
    var after = document.getElementById(this.end);

    return !before || !after;
  };

  Metamorph.prototype.checkRemoved = function() {
    if (this.isRemoved()) {
      throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.");
    }
  };

  window.Metamorph = Metamorph;
})(this);


})();

(function() {

var objectCreate = Ember.create;

Ember.assert("Ember Handlebars requires Handlebars 1.0.beta.5 or greater", window.Handlebars && window.Handlebars.VERSION.match(/^1\.0\.beta\.[56789]$|^1\.0\.rc\.[123456789]+/));

Ember.Handlebars = objectCreate(Handlebars);

Ember.Handlebars.helpers = objectCreate(Handlebars.helpers);

Ember.Handlebars.Compiler = function() {};
Ember.Handlebars.Compiler.prototype = objectCreate(Handlebars.Compiler.prototype);
Ember.Handlebars.Compiler.prototype.compiler = Ember.Handlebars.Compiler;

Ember.Handlebars.JavaScriptCompiler = function() {};
Ember.Handlebars.JavaScriptCompiler.prototype = objectCreate(Handlebars.JavaScriptCompiler.prototype);
Ember.Handlebars.JavaScriptCompiler.prototype.compiler = Ember.Handlebars.JavaScriptCompiler;
Ember.Handlebars.JavaScriptCompiler.prototype.namespace = "Ember.Handlebars";


Ember.Handlebars.JavaScriptCompiler.prototype.initializeBuffer = function() {
  return "''";
};

Ember.Handlebars.JavaScriptCompiler.prototype.appendToBuffer = function(string) {
  return "data.buffer.push("+string+");";
};

Ember.Handlebars.Compiler.prototype.mustache = function(mustache) {
  if (mustache.params.length || mustache.hash) {
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  } else {
    var id = new Handlebars.AST.IdNode(['_triageMustache']);

    // Update the mustache node to include a hash value indicating whether the original node
    // was escaped. This will allow us to properly escape values when the underlying value
    // changes and we need to re-render the value.
    if(!mustache.escaped) {
      mustache.hash = mustache.hash || new Handlebars.AST.HashNode([]);
      mustache.hash.pairs.push(["unescaped", new Handlebars.AST.StringNode("true")]);
    }
    mustache = new Handlebars.AST.MustacheNode([id].concat([mustache.id]), mustache.hash, !mustache.escaped);
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  }
};


Ember.Handlebars.precompile = function(string) {
  var ast = Handlebars.parse(string);

  var options = {
    knownHelpers: {
      action: true,
      unbound: true,
      bindAttr: true,
      template: true,
      view: true,
      _triageMustache: true
    },
    data: true,
    stringParams: true
  };

  var environment = new Ember.Handlebars.Compiler().compile(ast, options);
  return new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
};


Ember.Handlebars.compile = function(string) {
  var ast = Handlebars.parse(string);
  var options = { data: true, stringParams: true };
  var environment = new Ember.Handlebars.Compiler().compile(ast, options);
  var templateSpec = new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);

  return Handlebars.template(templateSpec);
};


var normalizePath = Ember.Handlebars.normalizePath = function(root, path, data) {
  var keywords = (data && data.keywords) || {},
      keyword, isKeyword;

  // Get the first segment of the path. For example, if the
  // path is "foo.bar.baz", returns "foo".
  keyword = path.split('.', 1)[0];

  // Test to see if the first path is a keyword that has been
  // passed along in the view's data hash. If so, we will treat
  // that object as the new root.
  if (keywords.hasOwnProperty(keyword)) {
    // Look up the value in the template's data hash.
    root = keywords[keyword];
    isKeyword = true;

    // Handle cases where the entire path is the reserved
    // word. In that case, return the object itself.
    if (path === keyword) {
      path = '';
    } else {
      // Strip the keyword from the path and look up
      // the remainder from the newly found root.
      path = path.substr(keyword.length+1);
    }
  }

  return { root: root, path: path, isKeyword: isKeyword };
};


Ember.Handlebars.getPath = function(root, path, options) {
  var data = options && options.data,
      normalizedPath = normalizePath(root, path, data),
      value;

  // In cases where the path begins with a keyword, change the
  // root to the value represented by that keyword, and ensure
  // the path is relative to it.
  root = normalizedPath.root;
  path = normalizedPath.path;

  value = Ember.get(root, path);

  if (value === undefined && root !== window && Ember.isGlobalPath(path)) {
    value = Ember.get(window, path);
  }
  return value;
};


Ember.Handlebars.registerHelper('helperMissing', function(path, options) {
  var error, view = "";

  error = "%@ Handlebars error: Could not find property '%@' on object %@.";
  if (options.data){
    view = options.data.view;
  }
  throw new Ember.Error(Ember.String.fmt(error, [view, path, this]));
});


})();



(function() {

Ember.String.htmlSafe = function(str) {
  return new Handlebars.SafeString(str);
};

var htmlSafe = Ember.String.htmlSafe;

if (Ember.EXTEND_PROTOTYPES) {

  
  String.prototype.htmlSafe = function() {
    return htmlSafe(this);
  };

}

})();



(function() {

var set = Ember.set, get = Ember.get;

var DOMManager = {
  remove: function(view) {
    var morph = view.morph;
    if (morph.isRemoved()) { return; }
    set(view, 'element', null);
    view._lastInsert = null;
    morph.remove();
  },

  prepend: function(view, childView) {
    childView._insertElementLater(function() {
      var morph = view.morph;
      morph.prepend(childView.outerHTML);
      childView.outerHTML = null;
    });
  },

  after: function(view, nextView) {
    nextView._insertElementLater(function() {
      var morph = view.morph;
      morph.after(nextView.outerHTML);
      nextView.outerHTML = null;
    });
  },

  replace: function(view) {
    var morph = view.morph;

    view.transitionTo('preRender');
    view.clearRenderedChildren();
    var buffer = view.renderToBuffer();

    Ember.run.schedule('render', this, function() {
      if (get(view, 'isDestroyed')) { return; }
      view.invalidateRecursively('element');
      view._notifyWillInsertElement();
      morph.replaceWith(buffer.string());
      view.transitionTo('inDOM');
      view._notifyDidInsertElement();
    });
  },

  empty: function(view) {
    view.morph.html("");
  }
};

// The `morph` and `outerHTML` properties are internal only
// and not observable.

Ember._Metamorph = Ember.Mixin.create({
  isVirtual: true,
  tagName: '',

  init: function() {
    this._super();
    this.morph = Metamorph();
  },

  beforeRender: function(buffer) {
    buffer.push(this.morph.startTag());
  },

  afterRender: function(buffer) {
    buffer.push(this.morph.endTag());
  },

  createElement: function() {
    var buffer = this.renderToBuffer();
    this.outerHTML = buffer.string();
    this.clearBuffer();
  },

  domManager: DOMManager
});

Ember._MetamorphView = Ember.View.extend(Ember._Metamorph);


})();



(function() {

var get = Ember.get, set = Ember.set, getPath = Ember.Handlebars.getPath;

Ember._HandlebarsBoundView = Ember._MetamorphView.extend({

  shouldDisplayFunc: null,

  preserveContext: false,

  previousContext: null,

  displayTemplate: null,

  inverseTemplate: null,


  path: null,

  pathRoot: null,

  normalizedValue: Ember.computed(function() {
    var path = get(this, 'path'),
        pathRoot  = get(this, 'pathRoot'),
        valueNormalizer = get(this, 'valueNormalizerFunc'),
        result, templateData;

    // Use the pathRoot as the result if no path is provided. This
    // happens if the path is `this`, which gets normalized into
    // a `pathRoot` of the current Handlebars context and a path
    // of `''`.
    if (path === '') {
      result = pathRoot;
    } else {
      templateData = get(this, 'templateData');
      result = getPath(pathRoot, path, { data: templateData });
    }

    return valueNormalizer ? valueNormalizer(result) : result;
  }).property('path', 'pathRoot', 'valueNormalizerFunc').volatile(),

  rerenderIfNeeded: function() {
    if (!get(this, 'isDestroyed') && get(this, 'normalizedValue') !== this._lastNormalizedValue) {
      this.rerender();
    }
  },

  render: function(buffer) {
    // If not invoked via a triple-mustache ({{{foo}}}), escape
    // the content of the template.
    var escape = get(this, 'isEscaped');

    var shouldDisplay = get(this, 'shouldDisplayFunc'),
        preserveContext = get(this, 'preserveContext'),
        context = get(this, 'previousContext');

    var inverseTemplate = get(this, 'inverseTemplate'),
        displayTemplate = get(this, 'displayTemplate');

    var result = get(this, 'normalizedValue');
    this._lastNormalizedValue = result;

    // First, test the conditional to see if we should
    // render the template or not.
    if (shouldDisplay(result)) {
      set(this, 'template', displayTemplate);

      // If we are preserving the context (for example, if this
      // is an #if block, call the template with the same object.
      if (preserveContext) {
        set(this, '_context', context);
      } else {
      // Otherwise, determine if this is a block bind or not.
      // If so, pass the specified object to the template
        if (displayTemplate) {
          set(this, '_context', result);
        } else {
        // This is not a bind block, just push the result of the
        // expression to the render context and return.
          if (result === null || result === undefined) {
            result = "";
          } else if (!(result instanceof Handlebars.SafeString)) {
            result = String(result);
          }

          if (escape) { result = Handlebars.Utils.escapeExpression(result); }
          buffer.push(result);
          return;
        }
      }
    } else if (inverseTemplate) {
      set(this, 'template', inverseTemplate);

      if (preserveContext) {
        set(this, '_context', context);
      } else {
        set(this, '_context', result);
      }
    } else {
      set(this, 'template', function() { return ''; });
    }

    return this._super(buffer);
  }
});

})();



(function() {

var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;
var getPath = Ember.Handlebars.getPath, normalizePath = Ember.Handlebars.normalizePath;
var forEach = Ember.ArrayPolyfills.forEach;

var EmberHandlebars = Ember.Handlebars, helpers = EmberHandlebars.helpers;

function bind(property, options, preserveContext, shouldDisplay, valueNormalizer) {
  var data = options.data,
      fn = options.fn,
      inverse = options.inverse,
      view = data.view,
      currentContext = this,
      pathRoot, path, normalized;

  normalized = normalizePath(currentContext, property, data);

  pathRoot = normalized.root;
  path = normalized.path;

  // Set up observers for observable objects
  if ('object' === typeof this) {
    
    var bindView = view.createChildView(Ember._HandlebarsBoundView, {
      preserveContext: preserveContext,
      shouldDisplayFunc: shouldDisplay,
      valueNormalizerFunc: valueNormalizer,
      displayTemplate: fn,
      inverseTemplate: inverse,
      path: path,
      pathRoot: pathRoot,
      previousContext: currentContext,
      isEscaped: !options.hash.unescaped,
      templateData: options.data
    });

    view.appendChild(bindView);

    var observer = function() {
      Ember.run.once(bindView, 'rerenderIfNeeded');
    };

    // Observes the given property on the context and
    // tells the Ember._HandlebarsBoundView to re-render. If property
    // is an empty string, we are printing the current context
    // object ({{this}}) so updating it is not our responsibility.
    if (path !== '') {
      Ember.addObserver(pathRoot, path, observer);
    }
  } else {
    // The object is not observable, so just render it out and
    // be done with it.
    data.buffer.push(getPath(pathRoot, path, options));
  }
}

EmberHandlebars.registerHelper('_triageMustache', function(property, fn) {
  Ember.assert("You cannot pass more than one argument to the _triageMustache helper", arguments.length <= 2);
  if (helpers[property]) {
    return helpers[property].call(this, fn);
  }
  else {
    return helpers.bind.apply(this, arguments);
  }
});

EmberHandlebars.registerHelper('bind', function(property, fn) {
  Ember.assert("You cannot pass more than one argument to the bind helper", arguments.length <= 2);

  var context = (fn.contexts && fn.contexts[0]) || this;

  return bind.call(context, property, fn, false, function(result) {
    return !Ember.none(result);
  });
});

EmberHandlebars.registerHelper('boundIf', function(property, fn) {
  var context = (fn.contexts && fn.contexts[0]) || this;
  var func = function(result) {
    if (Ember.typeOf(result) === 'array') {
      return get(result, 'length') !== 0;
    } else {
      return !!result;
    }
  };

  return bind.call(context, property, fn, true, func, func);
});

EmberHandlebars.registerHelper('with', function(context, options) {
  if (arguments.length === 4) {
    var keywordName, path, rootPath, normalized;

    Ember.assert("If you pass more than one argument to the with helper, it must be in the form #with foo as bar", arguments[1] === "as");
    options = arguments[3];
    keywordName = arguments[2];
    path = arguments[0];

    Ember.assert("You must pass a block to the with helper", options.fn && options.fn !== Handlebars.VM.noop);

    if (Ember.isGlobalPath(path)) {
      Ember.bind(options.data.keywords, keywordName, path);
    } else {
      normalized = normalizePath(this, path, options.data);
      path = normalized.path;
      rootPath = normalized.root;

      // This is a workaround for the fact that you cannot bind separate objects
      // together. When we implement that functionality, we should use it here.
      var contextKey = Ember.$.expando + Ember.guidFor(rootPath);
      options.data.keywords[contextKey] = rootPath;

      // if the path is '' ("this"), just bind directly to the current context
      var contextPath = path ? contextKey + '.' + path : contextKey;
      Ember.bind(options.data.keywords, keywordName, contextPath);
    }

    return bind.call(this, path, options.fn, true, function(result) {
      return !Ember.none(result);
    });
  } else {
    Ember.assert("You must pass exactly one argument to the with helper", arguments.length === 2);
    Ember.assert("You must pass a block to the with helper", options.fn && options.fn !== Handlebars.VM.noop);
    return helpers.bind.call(options.contexts[0], context, options);
  }
});

EmberHandlebars.registerHelper('if', function(context, options) {
  Ember.assert("You must pass exactly one argument to the if helper", arguments.length === 2);
  Ember.assert("You must pass a block to the if helper", options.fn && options.fn !== Handlebars.VM.noop);

  return helpers.boundIf.call(options.contexts[0], context, options);
});

EmberHandlebars.registerHelper('unless', function(context, options) {
  Ember.assert("You must pass exactly one argument to the unless helper", arguments.length === 2);
  Ember.assert("You must pass a block to the unless helper", options.fn && options.fn !== Handlebars.VM.noop);

  var fn = options.fn, inverse = options.inverse;

  options.fn = inverse;
  options.inverse = fn;

  return helpers.boundIf.call(options.contexts[0], context, options);
});

EmberHandlebars.registerHelper('bindAttr', function(options) {

  var attrs = options.hash;

  Ember.assert("You must specify at least one hash argument to bindAttr", !!Ember.keys(attrs).length);

  var view = options.data.view;
  var ret = [];
  var ctx = this;

  // Generate a unique id for this element. This will be added as a
  // data attribute to the element so it can be looked up when
  // the bound property changes.
  var dataId = ++Ember.$.uuid;

  // Handle classes differently, as we can bind multiple classes
  var classBindings = attrs['class'];
  if (classBindings !== null && classBindings !== undefined) {
    var classResults = EmberHandlebars.bindClasses(this, classBindings, view, dataId, options);
    ret.push('class="' + Handlebars.Utils.escapeExpression(classResults.join(' ')) + '"');
    delete attrs['class'];
  }

  var attrKeys = Ember.keys(attrs);

  // For each attribute passed, create an observer and emit the
  // current value of the property as an attribute.
  forEach.call(attrKeys, function(attr) {
    var path = attrs[attr],
        pathRoot, normalized;

    Ember.assert(fmt("You must provide a String for a bound attribute, not %@", [path]), typeof path === 'string');

    normalized = normalizePath(ctx, path, options.data);

    pathRoot = normalized.root;
    path = normalized.path;

    var value = (path === 'this') ? pathRoot : getPath(pathRoot, path, options),
        type = Ember.typeOf(value);

    Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]), value === null || value === undefined || type === 'number' || type === 'string' || type === 'boolean');

    var observer, invoker;

    
    observer = function observer() {
      var result = getPath(pathRoot, path, options);

      Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [result]), result === null || result === undefined || typeof result === 'number' || typeof result === 'string' || typeof result === 'boolean');

      var elem = view.$("[data-bindattr-" + dataId + "='" + dataId + "']");

      // If we aren't able to find the element, it means the element
      // to which we were bound has been removed from the view.
      // In that case, we can assume the template has been re-rendered
      // and we need to clean up the observer.
      if (elem.length === 0) {
        Ember.removeObserver(pathRoot, path, invoker);
        return;
      }

      Ember.View.applyAttributeBindings(elem, attr, result);
    };

    
    invoker = function() {
      Ember.run.once(observer);
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the attribute to the new value.
    if (path !== 'this') {
      Ember.addObserver(pathRoot, path, invoker);
    }

    // if this changes, also change the logic in ember-views/lib/views/view.js
    if ((type === 'string' || (type === 'number' && !isNaN(value)))) {
      ret.push(attr + '="' + Handlebars.Utils.escapeExpression(value) + '"');
    } else if (value && type === 'boolean') {
      // The developer controls the attr name, so it should always be safe
      ret.push(attr + '="' + attr + '"');
    }
  }, this);

  // Add the unique identifier
  // NOTE: We use all lower-case since Firefox has problems with mixed case in SVG
  ret.push('data-bindattr-' + dataId + '="' + dataId + '"');
  return new EmberHandlebars.SafeString(ret.join(' '));
});

EmberHandlebars.bindClasses = function(context, classBindings, view, bindAttrId, options) {
  var ret = [], newClass, value, elem;

  // Helper method to retrieve the property from the context and
  // determine which class string to return, based on whether it is
  // a Boolean or not.
  var classStringForPath = function(root, parsedPath, options) {
    var val,
        path = parsedPath.path;

    if (path === 'this') {
      val = root;
    } else if (path === '') {
      val = true;
    } else {
      val = getPath(root, path, options);
    }

    return Ember.View._classStringForValue(path, val, parsedPath.className, parsedPath.falsyClassName);
  };

  // For each property passed, loop through and setup
  // an observer.
  forEach.call(classBindings.split(' '), function(binding) {

    // Variable in which the old class value is saved. The observer function
    // closes over this variable, so it knows which string to remove when
    // the property changes.
    var oldClass;

    var observer, invoker;

    var parsedPath = Ember.View._parsePropertyPath(binding),
        path = parsedPath.path,
        pathRoot = context,
        normalized;

    if (path !== '' && path !== 'this') {
      normalized = normalizePath(context, path, options.data);

      pathRoot = normalized.root;
      path = normalized.path;
    }

    // Set up an observer on the context. If the property changes, toggle the
    // class name.
    /** @private */
    observer = function() {
      // Get the current value of the property
      newClass = classStringForPath(pathRoot, parsedPath, options);
      elem = bindAttrId ? view.$("[data-bindattr-" + bindAttrId + "='" + bindAttrId + "']") : view.$();

      // If we can't find the element anymore, a parent template has been
      // re-rendered and we've been nuked. Remove the observer.
      if (elem.length === 0) {
        Ember.removeObserver(pathRoot, path, invoker);
      } else {
        // If we had previously added a class to the element, remove it.
        if (oldClass) {
          elem.removeClass(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if (newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      }
    };

    
    invoker = function() {
      Ember.run.once(observer);
    };

    if (path !== '' && path !== 'this') {
      Ember.addObserver(pathRoot, path, invoker);
    }

    // We've already setup the observer; now we just need to figure out the
    // correct behavior right now on the first pass through.
    value = classStringForPath(pathRoot, parsedPath, options);

    if (value) {
      ret.push(value);

      // Make sure we save the current value so that it can be removed if the
      // observer fires.
      oldClass = value;
    }
  });

  return ret;
};


})();



(function() {

var get = Ember.get, set = Ember.set;
var PARENT_VIEW_PATH = /^parentView\./;
var EmberHandlebars = Ember.Handlebars;
var VIEW_PRESERVES_CONTEXT = Ember.VIEW_PRESERVES_CONTEXT;


EmberHandlebars.ViewHelper = Ember.Object.create({

  propertiesFromHTMLOptions: function(options, thisContext) {
    var hash = options.hash, data = options.data;
    var extensions = {},
        classes = hash['class'],
        dup = false;

    if (hash.id) {
      extensions.elementId = hash.id;
      dup = true;
    }

    if (classes) {
      classes = classes.split(' ');
      extensions.classNames = classes;
      dup = true;
    }

    if (hash.classBinding) {
      extensions.classNameBindings = hash.classBinding.split(' ');
      dup = true;
    }

    if (hash.classNameBindings) {
      if (extensions.classNameBindings === undefined) extensions.classNameBindings = [];
      extensions.classNameBindings = extensions.classNameBindings.concat(hash.classNameBindings.split(' '));
      dup = true;
    }

    if (hash.attributeBindings) {
      Ember.assert("Setting 'attributeBindings' via Handlebars is not allowed. Please subclass Ember.View and set it there instead.");
      extensions.attributeBindings = null;
      dup = true;
    }

    if (dup) {
      hash = Ember.$.extend({}, hash);
      delete hash.id;
      delete hash['class'];
      delete hash.classBinding;
    }

   
    var path;

    // Evaluate the context of regular attribute bindings:
    for (var prop in hash) {
      if (!hash.hasOwnProperty(prop)) { continue; }

      // Test if the property ends in "Binding"
      if (Ember.IS_BINDING.test(prop) && typeof hash[prop] === 'string') {
        path = this.contextualizeBindingPath(hash[prop], data);
        if (path) { hash[prop] = path; }
      }
    }

    // Evaluate the context of class name bindings:
    if (extensions.classNameBindings) {
      for (var b in extensions.classNameBindings) {
        var full = extensions.classNameBindings[b];
        if (typeof full === 'string') {
          
          var parsedPath = Ember.View._parsePropertyPath(full);
          path = this.contextualizeBindingPath(parsedPath.path, data);
          if (path) { extensions.classNameBindings[b] = path + parsedPath.classNames; }
        }
      }
    }

    // Make the current template context available to the view
    // for the bindings set up above.
    extensions.bindingContext = thisContext;

    return Ember.$.extend(hash, extensions);
  },

  contextualizeBindingPath: function(path, data) {
    var normalized = Ember.Handlebars.normalizePath(null, path, data);
    if (normalized.isKeyword) {
      return 'templateData.keywords.' + path;
    } else if (Ember.isGlobalPath(path)) {
      return null;
    } else if (path === 'this') {
      return 'bindingContext';
    } else {
      return 'bindingContext.' + path;
    }
  },

  helper: function(thisContext, path, options) {
    var inverse = options.inverse,
        data = options.data,
        view = data.view,
        fn = options.fn,
        hash = options.hash,
        newView;

    if ('string' === typeof path) {
      newView = EmberHandlebars.getPath(thisContext, path, options);
      Ember.assert("Unable to find view at path '" + path + "'", !!newView);
    } else {
      newView = path;
    }

    Ember.assert(Ember.String.fmt('You must pass a view class to the #view helper, not %@ (%@)', [path, newView]), Ember.View.detect(newView));

    var viewOptions = this.propertiesFromHTMLOptions(options, thisContext);
    var currentView = data.view;
    viewOptions.templateData = options.data;

    if (fn) {
      Ember.assert("You cannot provide a template block if you also specified a templateName", !get(viewOptions, 'templateName') && !get(newView.proto(), 'templateName'));
      viewOptions.template = fn;
    }

    // We only want to override the `_context` computed property if there is
    // no specified controller. See View#_context for more information.
    if (VIEW_PRESERVES_CONTEXT && !newView.proto().controller && !newView.proto().controllerBinding && !viewOptions.controller && !viewOptions.controllerBinding) {
      viewOptions._context = thisContext;
    }

    currentView.appendChild(newView, viewOptions);
  }
});

EmberHandlebars.registerHelper('view', function(path, options) {
  Ember.assert("The view helper only takes a single argument", arguments.length <= 2);

  // If no path is provided, treat path param as options.
  if (path && path.data && path.data.isRenderData) {
    options = path;
    path = "Ember.View";
  }

  return EmberHandlebars.ViewHelper.helper(this, path, options);
});


})();



(function() {

var get = Ember.get, getPath = Ember.Handlebars.getPath, fmt = Ember.String.fmt;

Ember.Handlebars.registerHelper('collection', function(path, options) {
  // If no path is provided, treat path param as options.
  if (path && path.data && path.data.isRenderData) {
    options = path;
    path = undefined;
    Ember.assert("You cannot pass more than one argument to the collection helper", arguments.length === 1);
  } else {
    Ember.assert("You cannot pass more than one argument to the collection helper", arguments.length === 2);
  }

  var fn = options.fn;
  var data = options.data;
  var inverse = options.inverse;

  // If passed a path string, convert that into an object.
  // Otherwise, just default to the standard class.
  var collectionClass;
  collectionClass = path ? getPath(this, path, options) : Ember.CollectionView;
  Ember.assert(fmt("%@ #collection: Could not find collection class %@", [data.view, path]), !!collectionClass);

  var hash = options.hash, itemHash = {}, match;

  // Extract item view class if provided else default to the standard class
  var itemViewClass, itemViewPath = hash.itemViewClass;
  var collectionPrototype = collectionClass.proto();
  delete hash.itemViewClass;
  itemViewClass = itemViewPath ? getPath(collectionPrototype, itemViewPath, options) : collectionPrototype.itemViewClass;
  Ember.assert(fmt("%@ #collection: Could not find itemViewClass %@", [data.view, itemViewPath]), !!itemViewClass);

  // Go through options passed to the {{collection}} helper and extract options
  // that configure item views instead of the collection itself.
  for (var prop in hash) {
    if (hash.hasOwnProperty(prop)) {
      match = prop.match(/^item(.)(.*)$/);

      if(match) {
        // Convert itemShouldFoo -> shouldFoo
        itemHash[match[1].toLowerCase() + match[2]] = hash[prop];
        // Delete from hash as this will end up getting passed to the
        // {{view}} helper method.
        delete hash[prop];
      }
    }
  }

  var tagName = hash.tagName || collectionPrototype.tagName;

  if (fn) {
    itemHash.template = fn;
    delete options.fn;
  }

  var emptyViewClass;
  if (inverse && inverse !== Handlebars.VM.noop) {
    emptyViewClass = get(collectionPrototype, 'emptyViewClass');
    emptyViewClass = emptyViewClass.extend({
          template: inverse,
          tagName: itemHash.tagName
    });
  } else if (hash.emptyViewClass) {
    emptyViewClass = getPath(this, hash.emptyViewClass, options);
  }
  hash.emptyView = emptyViewClass;

  if (hash.eachHelper === 'each') {
    itemHash._context = Ember.computed(function() {
      return get(this, 'content');
    }).property('content');
    delete hash.eachHelper;
  }

  var viewOptions = Ember.Handlebars.ViewHelper.propertiesFromHTMLOptions({ data: data, hash: itemHash }, this);
  hash.itemViewClass = itemViewClass.extend(viewOptions);

  return Ember.Handlebars.helpers.view.call(this, collectionClass, options);
});




})();



(function() {

var getPath = Ember.Handlebars.getPath;

Ember.Handlebars.registerHelper('unbound', function(property, fn) {
  var context = (fn.contexts && fn.contexts[0]) || this;
  return getPath(context, property, fn);
});

})();



(function() {

var getPath = Ember.Handlebars.getPath, normalizePath = Ember.Handlebars.normalizePath;

Ember.Handlebars.registerHelper('log', function(property, options) {
  var context = (options.contexts && options.contexts[0]) || this,
      normalized = normalizePath(context, property, options.data),
      pathRoot = normalized.root,
      path = normalized.path,
      value = (path === 'this') ? pathRoot : getPath(pathRoot, path, options);
  Ember.Logger.log(value);
});

Ember.Handlebars.registerHelper('debugger', function() {
  debugger;
});

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.Handlebars.EachView = Ember.CollectionView.extend(Ember._Metamorph, {
  itemViewClass: Ember._MetamorphView,
  emptyViewClass: Ember._MetamorphView,

  createChildView: function(view, attrs) {
    view = this._super(view, attrs);

    // At the moment, if a container view subclass wants
    // to insert keywords, it is responsible for cloning
    // the keywords hash. This will be fixed momentarily.
    var keyword = get(this, 'keyword');

    if (keyword) {
      var data = get(view, 'templateData');

      data = Ember.copy(data);
      data.keywords = view.cloneKeywords();
      set(view, 'templateData', data);

      var content = get(view, 'content');

      // In this case, we do not bind, because the `content` of
      // a #each item cannot change.
      data.keywords[keyword] = content;
    }

    return view;
  }
});

Ember.Handlebars.registerHelper('each', function(path, options) {
  if (arguments.length === 4) {
    Ember.assert("If you pass more than one argument to the each helper, it must be in the form #each foo in bar", arguments[1] === "in");

    var keywordName = arguments[0];

    options = arguments[3];
    path = arguments[2];
    if (path === '') { path = "this"; }

    options.hash.keyword = keywordName;
  } else {
    options.hash.eachHelper = 'each';
  }

  Ember.assert("You must pass a block to the each helper", options.fn && options.fn !== Handlebars.VM.noop);

  options.hash.contentBinding = path;
  // Set up emptyView as a metamorph with no tag
  //options.hash.emptyViewClass = Ember._MetamorphView;

  return Ember.Handlebars.helpers.collection.call(this, 'Ember.Handlebars.EachView', options);
});

})();



(function() {

Ember.Handlebars.registerHelper('template', function(name, options) {
  var template = Ember.TEMPLATES[name];

  Ember.assert("Unable to find template with name '"+name+"'.", !!template);

  Ember.TEMPLATES[name](this, { data: options.data });
});

})();



(function() {
var EmberHandlebars = Ember.Handlebars,
    getPath = EmberHandlebars.getPath,
    get = Ember.get,
    a_slice = Array.prototype.slice;

var ActionHelper = EmberHandlebars.ActionHelper = {
  registeredActions: {}
};

ActionHelper.registerAction = function(actionName, options) {
  var actionId = (++Ember.$.uuid).toString();

  ActionHelper.registeredActions[actionId] = {
    eventName: options.eventName,
    handler: function(event) {
      var modifier = event.shiftKey || event.metaKey || event.altKey || event.ctrlKey,
          secondaryClick = event.which > 1, // IE9 may return undefined
          nonStandard = modifier || secondaryClick;

      if (options.link && nonStandard) {
        // Allow the browser to handle special link clicks normally
        return;
      }

      event.preventDefault();

      event.view = options.view;

      if (options.hasOwnProperty('context')) {
        event.context = options.context;
      }

      if (options.hasOwnProperty('contexts')) {
        event.contexts = options.contexts;
      }

      var target = options.target;

      // Check for StateManager (or compatible object)
      if (target.isState && typeof target.send === 'function') {
        return target.send(actionName, event);
      } else {
        Ember.assert(Ember.String.fmt('Target %@ does not have action %@', [target, actionName]), target[actionName]);
        return target[actionName].call(target, event);
      }
    }
  };

  options.view.on('willRerender', function() {
    delete ActionHelper.registeredActions[actionId];
  });

  return actionId;
};

EmberHandlebars.registerHelper('action', function(actionName) {
  var options = arguments[arguments.length - 1],
      contexts = a_slice.call(arguments, 1, -1);

  var hash = options.hash,
      view = options.data.view,
      target, controller, link;

  // create a hash to pass along to registerAction
  var action = {
    eventName: hash.on || "click"
  };

  action.view = view = get(view, 'concreteView');

  if (hash.target) {
    target = getPath(this, hash.target, options);
  } else if (controller = options.data.keywords.controller) {
    target = get(controller, 'target');
  }

  action.target = target = target || view;

  if (contexts.length) {
    action.contexts = contexts = Ember.EnumerableUtils.map(contexts, function(context) {
      return getPath(this, context, options);
    }, this);
    action.context = contexts[0];
  }

  var output = [], url;

  if (hash.href && target.urlForEvent) {
    url = target.urlForEvent.apply(target, [actionName].concat(contexts));
    output.push('href="' + url + '"');
    action.link = true;
  }

  var actionId = ActionHelper.registerAction(actionName, action);
  output.push('data-ember-action="' + actionId + '"');

  return new EmberHandlebars.SafeString(output.join(" "));
});

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.Handlebars.registerHelper('yield', function(options) {
  var view = options.data.view, template;

  while (view && !get(view, 'layout')) {
    view = get(view, 'parentView');
  }

  Ember.assert("You called yield in a template that was not a layout", !!view);

  template = get(view, 'template');

  if (template) { template(this, options); }
});

})();



(function() {

Ember.Handlebars.registerHelper('outlet', function(property, options) {
  if (property && property.data && property.data.isRenderData) {
    options = property;
    property = 'view';
  }

  options.hash.currentViewBinding = "controller." + property;

  return Ember.Handlebars.helpers.view.call(this, Ember.ContainerView, options);
});

})();



(function() {

})();



(function() {

})();

(function() {

var set = Ember.set, get = Ember.get;

Ember.Checkbox = Ember.View.extend({
  classNames: ['ember-checkbox'],

  tagName: 'input',

  attributeBindings: ['type', 'checked', 'disabled', 'tabindex'],

  type: "checkbox",
  checked: false,
  disabled: false,

  init: function() {
    this._super();
    this.on("change", this, this._updateElementValue);
  },

  
  _updateElementValue: function() {
    set(this, 'checked', this.$().prop('checked'));
  }
});

})();



(function() {

var get = Ember.get, set = Ember.set;


Ember.TextSupport = Ember.Mixin.create(
 {

  value: "",

  attributeBindings: ['placeholder', 'disabled', 'maxlength', 'tabindex'],
  placeholder: null,
  disabled: false,
  maxlength: null,

  insertNewline: Ember.K,
  cancel: Ember.K,

  
  init: function() {
    this._super();
    this.on("focusOut", this, this._elementValueDidChange);
    this.on("change", this, this._elementValueDidChange);
    this.on("keyUp", this, this.interpretKeyEvents);
  },

  interpretKeyEvents: function(event) {
    var map = Ember.TextSupport.KEY_EVENTS;
    var method = map[event.keyCode];

    this._elementValueDidChange();
    if (method) { return this[method](event); }
  },

  _elementValueDidChange: function() {
    set(this, 'value', this.$().val());
  }

});

Ember.TextSupport.KEY_EVENTS = {
  13: 'insertNewline',
  27: 'cancel'
};

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.TextField = Ember.View.extend(Ember.TextSupport,
   {

  classNames: ['ember-text-field'],
  tagName: "input",
  attributeBindings: ['type', 'value', 'size'],

  
  value: "",

  
  type: "text",

 
  size: null
});

})();



(function() {

var get = Ember.get, set = Ember.set;

Ember.Button = Ember.View.extend(Ember.TargetActionSupport, {
  classNames: ['ember-button'],
  classNameBindings: ['isActive'],

  tagName: 'button',

  propagateEvents: false,

  attributeBindings: ['type', 'disabled', 'href', 'tabindex'],

  targetObject: Ember.computed(function() {
    var target = get(this, 'target'),
        root = get(this, 'context'),
        data = get(this, 'templateData');

    if (typeof target !== 'string') { return target; }

    return Ember.Handlebars.getPath(root, target, { data: data });
  }).property('target').cacheable(),

  // Defaults to 'button' if tagName is 'input' or 'button'
  type: Ember.computed(function(key, value) {
    var tagName = this.get('tagName');
    if (value !== undefined) { this._type = value; }
    if (this._type !== undefined) { return this._type; }
    if (tagName === 'input' || tagName === 'button') { return 'button'; }
  }).property('tagName').cacheable(),

  disabled: false,

  // Allow 'a' tags to act like buttons
  href: Ember.computed(function() {
    return this.get('tagName') === 'a' ? '#' : null;
  }).property('tagName').cacheable(),

  mouseDown: function() {
    if (!get(this, 'disabled')) {
      set(this, 'isActive', true);
      this._mouseDown = true;
      this._mouseEntered = true;
    }
    return get(this, 'propagateEvents');
  },

  mouseLeave: function() {
    if (this._mouseDown) {
      set(this, 'isActive', false);
      this._mouseEntered = false;
    }
  },

  mouseEnter: function() {
    if (this._mouseDown) {
      set(this, 'isActive', true);
      this._mouseEntered = true;
    }
  },

  mouseUp: function(event) {
    if (get(this, 'isActive')) {
      // Actually invoke the button's target and action.
      // This method comes from the Ember.TargetActionSupport mixin.
      this.triggerAction();
      set(this, 'isActive', false);
    }

    this._mouseDown = false;
    this._mouseEntered = false;
    return get(this, 'propagateEvents');
  },

  keyDown: function(event) {
    // Handle space or enter
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.mouseDown();
    }
  },

  keyUp: function(event) {
    // Handle space or enter
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.mouseUp();
    }
  },

 
  touchStart: function(touch) {
    return this.mouseDown(touch);
  },

  touchEnd: function(touch) {
    return this.mouseUp(touch);
  },

  init: function() {
    Ember.deprecate("Ember.Button is deprecated and will be removed from future releases. Consider using the `{{action}}` helper.");
    this._super();
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.TextArea = Ember.View.extend(Ember.TextSupport,
 {

  classNames: ['ember-text-area'],

  tagName: "textarea",
  attributeBindings: ['rows', 'cols'],
  rows: null,
  cols: null,

  _updateElementValue: Ember.observer(function() {
    // We do this check so cursor position doesn't get affected in IE
    var value = get(this, 'value'),
        $el = this.$();
    if ($el && value !== $el.val()) {
      $el.val(value);
    }
  }, 'value'),

  /** @private */
  init: function() {
    this._super();
    this.on("didInsertElement", this, this._updateElementValue);
  }

});

})();



(function() {
Ember.TabContainerView = Ember.View.extend({
  init: function() {
    Ember.deprecate("Ember.TabContainerView is deprecated and will be removed from future releases.");
    this._super();
  }
});

})();



(function() {
var get = Ember.get;

Ember.TabPaneView = Ember.View.extend({
  tabsContainer: Ember.computed(function() {
    return this.nearestInstanceOf(Ember.TabContainerView);
  }).property().volatile(),

  isVisible: Ember.computed(function() {
    return get(this, 'viewName') === get(this, 'tabsContainer.currentView');
  }).property('tabsContainer.currentView').volatile(),

  init: function() {
    Ember.deprecate("Ember.TabPaneView is deprecated and will be removed from future releases.");
    this._super();
  }
});

})();



(function() {
var get = Ember.get, setPath = Ember.setPath;

Ember.TabView = Ember.View.extend({
  tabsContainer: Ember.computed(function() {
    return this.nearestInstanceOf(Ember.TabContainerView);
  }).property().volatile(),

  mouseUp: function() {
    setPath(this, 'tabsContainer.currentView', get(this, 'value'));
  },

  init: function() {
    Ember.deprecate("Ember.TabView is deprecated and will be removed from future releases.");
    this._super();
  }
});

})();



(function() {

})();



(function() {

var set = Ember.set, get = Ember.get;
var indexOf = Ember.EnumerableUtils.indexOf, indexesOf = Ember.EnumerableUtils.indexesOf;


Ember.Select = Ember.View.extend(
   {

  tagName: 'select',
  classNames: ['ember-select'],
  defaultTemplate: Ember.Handlebars.compile('{{#if view.prompt}}<option value>{{view.prompt}}</option>{{/if}}{{#each view.content}}{{view Ember.SelectOption contentBinding="this"}}{{/each}}'),
  attributeBindings: ['multiple', 'tabindex'],

  
  multiple: false,
  content: null, 
  selection: null,  
  value: Ember.computed(function(key, value) {
    if (arguments.length === 2) { return value; }

    var valuePath = get(this, 'optionValuePath').replace(/^content\.?/, '');
    return valuePath ? get(this, 'selection.' + valuePath) : get(this, 'selection');
  }).property('selection').cacheable(),

  
  prompt: null,  
  optionLabelPath: 'content', 
  optionValuePath: 'content',
  _change: function() {
    if (get(this, 'multiple')) {
      this._changeMultiple();
    } else {
      this._changeSingle();
    }
  },
  selectionDidChange: Ember.observer(function() {
    var selection = get(this, 'selection'),
        isArray = Ember.isArray(selection);
    if (get(this, 'multiple')) {
      if (!isArray) {
        set(this, 'selection', Ember.A([selection]));
        return;
      }
      this._selectionDidChangeMultiple();
    } else {
      this._selectionDidChangeSingle();
    }
  }, 'selection'),

  valueDidChange: Ember.observer(function() {
    var content = get(this, 'content'),
        value = get(this, 'value'),
        valuePath = get(this, 'optionValuePath').replace(/^content\.?/, ''),
        selectedValue = (valuePath ? get(this, 'selection.' + valuePath) : get(this, 'selection')),
        selection;

    if (value !== selectedValue) {
      selection = content.find(function(obj) {
        return value === (valuePath ? get(obj, valuePath) : obj);
      });

      this.set('selection', selection);
    }
  }, 'value'),


  _triggerChange: function() {
    var selection = get(this, 'selection');

    if (selection) { this.selectionDidChange(); }

    this._change();
  },

  _changeSingle: function() {
    var selectedIndex = this.$()[0].selectedIndex,
        content = get(this, 'content'),
        prompt = get(this, 'prompt');

    if (!content) { return; }
    if (prompt && selectedIndex === 0) { set(this, 'selection', null); return; }

    if (prompt) { selectedIndex -= 1; }
    set(this, 'selection', content.objectAt(selectedIndex));
  },

  _changeMultiple: function() {
    var options = this.$('option:selected'),
        prompt = get(this, 'prompt'),
        offset = prompt ? 1 : 0,
        content = get(this, 'content');

    if (!content){ return; }
    if (options) {
      var selectedIndexes = options.map(function(){
        return this.index - offset;
      }).toArray();
      set(this, 'selection', content.objectsAt(selectedIndexes));
    }
  },

  _selectionDidChangeSingle: function() {
    var el = this.get('element');
    if (!el) { return; }

    var content = get(this, 'content'),
        selection = get(this, 'selection'),
        selectionIndex = content ? indexOf(content, selection) : -1,
        prompt = get(this, 'prompt');

    if (prompt) { selectionIndex += 1; }
    if (el) { el.selectedIndex = selectionIndex; }
  },

  _selectionDidChangeMultiple: function() {
    var content = get(this, 'content'),
        selection = get(this, 'selection'),
        selectedIndexes = content ? indexesOf(content, selection) : [-1],
        prompt = get(this, 'prompt'),
        offset = prompt ? 1 : 0,
        options = this.$('option'),
        adjusted;

    if (options) {
      options.each(function() {
        adjusted = this.index > -1 ? this.index + offset : -1;
        this.selected = indexOf(selectedIndexes, adjusted) > -1;
      });
    }
  },

  init: function() {
    this._super();
    this.on("didInsertElement", this, this._triggerChange);
    this.on("change", this, this._change);
  }
});

Ember.SelectOption = Ember.View.extend({
  tagName: 'option',
  attributeBindings: ['value', 'selected'],

  defaultTemplate: function(context, options) {
    options = { data: options.data, hash: {} };
    Ember.Handlebars.helpers.bind.call(context, "view.label", options);
  },

  init: function() {
    this.labelPathDidChange();
    this.valuePathDidChange();

    this._super();
  },

  selected: Ember.computed(function() {
    var content = get(this, 'content'),
        selection = get(this, 'parentView.selection');
    if (get(this, 'parentView.multiple')) {
      return selection && indexOf(selection, content) > -1;
    } else {
      
      return content == selection;
    }
  }).property('content', 'parentView.selection').volatile(),

  labelPathDidChange: Ember.observer(function() {
    var labelPath = get(this, 'parentView.optionLabelPath');

    if (!labelPath) { return; }

    Ember.defineProperty(this, 'label', Ember.computed(function() {
      return get(this, labelPath);
    }).property(labelPath).cacheable());
  }, 'parentView.optionLabelPath'),

  valuePathDidChange: Ember.observer(function() {
    var valuePath = get(this, 'parentView.optionValuePath');

    if (!valuePath) { return; }

    Ember.defineProperty(this, 'value', Ember.computed(function() {
      return get(this, valuePath);
    }).property(valuePath).cacheable());
  }, 'parentView.optionValuePath')
});


})();



(function() {
})();



(function() {

Ember.Handlebars.bootstrap = function(ctx) {
  var selectors = 'script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';

  Ember.$(selectors, ctx)
    .each(function() {
    // Get a reference to the script tag
    var script = Ember.$(this),
        type   = script.attr('type');

    var compile = (script.attr('type') === 'text/x-raw-handlebars') ?
                  Ember.$.proxy(Handlebars.compile, Handlebars) :
                  Ember.$.proxy(Ember.Handlebars.compile, Ember.Handlebars),
      
      templateName = script.attr('data-template-name') || script.attr('id'),
      template = compile(script.html()),
      view, viewPath, elementId, options;

    if (templateName) {
      // For templates which have a name, we save them and then remove them from the DOM
      Ember.TEMPLATES[templateName] = template;

      // Remove script tag from DOM
      script.remove();
    } else {
      if (script.parents('head').length !== 0) {
        // don't allow inline templates in the head
        throw new Ember.Error("Template found in <head> without a name specified. " +
                         "Please provide a data-template-name attribute.\n" +
                         script.html());
      }

      viewPath = script.attr('data-view');
      view = viewPath ? Ember.get(viewPath) : Ember.View;

      elementId = script.attr('data-element-id');

      options = { template: template };
      if (elementId) { options.elementId = elementId; }

      view = view.create(options);

      view._insertElementLater(function() {
        script.replaceWith(this.$());

        // Avoid memory leak in IE
        script = null;
      });
    }
  });
};

function bootstrap() {
  Ember.Handlebars.bootstrap( Ember.$(document) );
}

Ember.$(document).ready(bootstrap);
Ember.onLoad('application', bootstrap);

})();



(function() {
})();

(function() {
})();
