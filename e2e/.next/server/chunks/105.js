"use strict";
exports.id = 105;
exports.ids = [105];
exports.modules = {

/***/ 7:
/***/ ((module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = initHeadManager;
exports.isEqualNode = isEqualNode;
exports.DOMAttributeNames = void 0;
function initHeadManager() {
    return {
        mountedInstances: new Set(),
        updateHead: (head)=>{
            const tags = {};
            head.forEach((h)=>{
                if (// it won't be inlined. In this case revert to the original behavior
                h.type === "link" && h.props["data-optimized-fonts"]) {
                    if (document.querySelector(`style[data-href="${h.props["data-href"]}"]`)) {
                        return;
                    } else {
                        h.props.href = h.props["data-href"];
                        h.props["data-href"] = undefined;
                    }
                }
                const components = tags[h.type] || [];
                components.push(h);
                tags[h.type] = components;
            });
            const titleComponent = tags.title ? tags.title[0] : null;
            let title = "";
            if (titleComponent) {
                const { children  } = titleComponent.props;
                title = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
            }
            if (title !== document.title) document.title = title;
            [
                "meta",
                "base",
                "link",
                "style",
                "script"
            ].forEach((type)=>{
                updateElements(type, tags[type] || []);
            });
        }
    };
}
const DOMAttributeNames = {
    acceptCharset: "accept-charset",
    className: "class",
    htmlFor: "for",
    httpEquiv: "http-equiv",
    noModule: "noModule"
};
exports.DOMAttributeNames = DOMAttributeNames;
function reactElementToDOM({ type , props  }) {
    const el = document.createElement(type);
    for(const p in props){
        if (!props.hasOwnProperty(p)) continue;
        if (p === "children" || p === "dangerouslySetInnerHTML") continue;
        // we don't render undefined props to the DOM
        if (props[p] === undefined) continue;
        const attr = DOMAttributeNames[p] || p.toLowerCase();
        if (type === "script" && (attr === "async" || attr === "defer" || attr === "noModule")) {
            el[attr] = !!props[p];
        } else {
            el.setAttribute(attr, props[p]);
        }
    }
    const { children , dangerouslySetInnerHTML  } = props;
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || "";
    } else if (children) {
        el.textContent = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
    }
    return el;
}
function isEqualNode(oldTag, newTag) {
    if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
        const nonce = newTag.getAttribute("nonce");
        // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
        // be stripped if there is no content security policy response header that includes a nonce.
        if (nonce && !oldTag.getAttribute("nonce")) {
            const cloneTag = newTag.cloneNode(true);
            cloneTag.setAttribute("nonce", "");
            cloneTag.nonce = nonce;
            return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
        }
    }
    return oldTag.isEqualNode(newTag);
}
function updateElements(type, components) {
    const headEl = document.getElementsByTagName("head")[0];
    const headCountEl = headEl.querySelector("meta[name=next-head-count]");
    if (false) {}
    const headCount = Number(headCountEl.content);
    const oldTags = [];
    for(let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null){
        var ref;
        if ((j == null ? void 0 : (ref = j.tagName) == null ? void 0 : ref.toLowerCase()) === type) {
            oldTags.push(j);
        }
    }
    const newTags = components.map(reactElementToDOM).filter((newTag)=>{
        for(let k = 0, len = oldTags.length; k < len; k++){
            const oldTag = oldTags[k];
            if (isEqualNode(oldTag, newTag)) {
                oldTags.splice(k, 1);
                return false;
            }
        }
        return true;
    });
    oldTags.forEach((t)=>{
        var ref;
        return (ref = t.parentNode) == null ? void 0 : ref.removeChild(t);
    });
    newTags.forEach((t)=>headEl.insertBefore(t, headCountEl));
    headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head-manager.js.map


/***/ }),

/***/ 311:
/***/ ((module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;
const requestIdleCallback = typeof self !== "undefined" && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    let start = Date.now();
    return setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
exports.requestIdleCallback = requestIdleCallback;
const cancelIdleCallback = typeof self !== "undefined" && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
exports.cancelIdleCallback = cancelIdleCallback;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=request-idle-callback.js.map


/***/ }),

/***/ 699:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.handleClientScriptLoad = handleClientScriptLoad;
exports.initScriptLoader = initScriptLoader;
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(689));
var _headManagerContext = __webpack_require__(796);
var _headManager = __webpack_require__(7);
var _requestIdleCallback = __webpack_require__(311);
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
const ScriptCache = new Map();
const LoadCache = new Set();
const ignoreProps = [
    "onLoad",
    "dangerouslySetInnerHTML",
    "children",
    "onError",
    "strategy", 
];
const loadScript = (props)=>{
    const { src , id , onLoad =()=>{} , dangerouslySetInnerHTML , children ="" , strategy ="afterInteractive" , onError ,  } = props;
    const cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // Execute onLoad since the script loading has begun
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    const el = document.createElement("script");
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener("load", function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
        });
        el.addEventListener("error", function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (src) {
        ScriptCache.set(src, loadPromise);
    }
    LoadCache.add(cacheKey);
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || "";
    } else if (children) {
        el.textContent = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
    } else if (src) {
        el.src = src;
    }
    for (const [k, value] of Object.entries(props)){
        if (value === undefined || ignoreProps.includes(k)) {
            continue;
        }
        const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
        el.setAttribute(attr, value);
    }
    if (strategy === "worker") {
        el.setAttribute("type", "text/partytown");
    }
    el.setAttribute("data-nscript", strategy);
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy ="afterInteractive"  } = props;
    if (strategy === "lazyOnload") {
        window.addEventListener("load", ()=>{
            (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === "complete") {
        (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
    } else {
        window.addEventListener("load", ()=>{
            (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]'), 
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute("src");
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
function Script(props) {
    const { src ="" , onLoad =()=>{} , strategy ="afterInteractive" , onError  } = props, restProps = _objectWithoutPropertiesLoose(props, [
        "src",
        "onLoad",
        "strategy",
        "onError"
    ]);
    // Context is available only during SSR
    const { updateScripts , scripts , getIsSsr  } = (0, _react).useContext(_headManagerContext.HeadManagerContext);
    (0, _react).useEffect(()=>{
        if (strategy === "afterInteractive") {
            loadScript(props);
        } else if (strategy === "lazyOnload") {
            loadLazyScript(props);
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === "beforeInteractive" || strategy === "worker") {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                _extends({
                    src,
                    onLoad,
                    onError
                }, restProps), 
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(restProps.id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript(props);
        }
    }
    return null;
}
var _default = Script;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=script.js.map


/***/ }),

/***/ 105:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.Html = Html;
exports.Main = Main;
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(689));
var _constants = __webpack_require__(724);
var _getPageFiles = __webpack_require__(140);
var _utils = __webpack_require__(368);
var _htmlescape = __webpack_require__(716);
var _script = _interopRequireDefault(__webpack_require__(699));
var _isError = _interopRequireDefault(__webpack_require__(676));
var _htmlContext = __webpack_require__(743);
class Document extends _react.Component {
    /**
   * `getInitialProps` hook returns the context object with the addition of `renderPage`.
   * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
   */ static getInitialProps(ctx) {
        return ctx.defaultGetInitialProps(ctx);
    }
    render() {
        return /*#__PURE__*/ _react.default.createElement(Html, null, /*#__PURE__*/ _react.default.createElement(Head, null), /*#__PURE__*/ _react.default.createElement("body", null, /*#__PURE__*/ _react.default.createElement(Main, null), /*#__PURE__*/ _react.default.createElement(NextScript, null)));
    }
}
exports["default"] = Document;
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function getDocumentFiles(buildManifest, pathname, inAmpMode) {
    const sharedFiles = (0, _getPageFiles).getPageFiles(buildManifest, "/_app");
    const pageFiles = inAmpMode ? [] : (0, _getPageFiles).getPageFiles(buildManifest, pathname);
    return {
        sharedFiles,
        pageFiles,
        allFiles: [
            ...new Set([
                ...sharedFiles,
                ...pageFiles
            ])
        ]
    };
}
function getPolyfillScripts(context, props) {
    // polyfills.js has to be rendered as nomodule without async
    // It also has to be the first script to load
    const { assetPrefix , buildManifest , devOnlyCacheBusterQueryString , disableOptimizedLoading , crossOrigin ,  } = context;
    return buildManifest.polyfillFiles.filter((polyfill)=>polyfill.endsWith(".js") && !polyfill.endsWith(".module.js")).map((polyfill)=>/*#__PURE__*/ _react.default.createElement("script", {
            key: polyfill,
            defer: !disableOptimizedLoading,
            nonce: props.nonce,
            crossOrigin: props.crossOrigin || crossOrigin,
            noModule: true,
            src: `${assetPrefix}/_next/${polyfill}${devOnlyCacheBusterQueryString}`
        }));
}
function hasComponentProps(child) {
    return !!child && !!child.props;
}
function handleDocumentScriptLoaderItems(scriptLoader, __NEXT_DATA__, props) {
    var ref, ref1, ref2, ref3;
    if (!props.children) return;
    const scriptLoaderItems = [];
    const children = Array.isArray(props.children) ? props.children : [
        props.children
    ];
    const headChildren = (ref = children.find((child)=>child.type === Head)) == null ? void 0 : (ref1 = ref.props) == null ? void 0 : ref1.children;
    const bodyChildren = (ref2 = children.find((child)=>child.type === "body")) == null ? void 0 : (ref3 = ref2.props) == null ? void 0 : ref3.children;
    // Scripts with beforeInteractive can be placed inside Head or <body> so children of both needs to be traversed
    const combinedChildren = [
        ...Array.isArray(headChildren) ? headChildren : [
            headChildren
        ],
        ...Array.isArray(bodyChildren) ? bodyChildren : [
            bodyChildren
        ], 
    ];
    _react.default.Children.forEach(combinedChildren, (child)=>{
        if (!child) return;
        if (child.type === _script.default) {
            if (child.props.strategy === "beforeInteractive") {
                scriptLoader.beforeInteractive = (scriptLoader.beforeInteractive || []).concat([
                    {
                        ...child.props
                    }, 
                ]);
                return;
            } else if ([
                "lazyOnload",
                "afterInteractive",
                "worker"
            ].includes(child.props.strategy)) {
                scriptLoaderItems.push(child.props);
                return;
            }
        }
    });
    __NEXT_DATA__.scriptLoader = scriptLoaderItems;
}
function getPreNextWorkerScripts(context, props) {
    const { assetPrefix , scriptLoader , crossOrigin , nextScriptWorkers  } = context;
    // disable `nextScriptWorkers` in edge runtime
    if (!nextScriptWorkers || "nodejs" === "edge") return null;
    try {
        let { partytownSnippet  } = require("@builder.io/partytown/integration");
        const children = Array.isArray(props.children) ? props.children : [
            props.children
        ];
        // Check to see if the user has defined their own Partytown configuration
        const userDefinedConfig = children.find((child)=>{
            var ref, ref4;
            return hasComponentProps(child) && (child == null ? void 0 : (ref = child.props) == null ? void 0 : (ref4 = ref.dangerouslySetInnerHTML) == null ? void 0 : ref4.__html.length) && "data-partytown-config" in child.props;
        });
        return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, !userDefinedConfig && /*#__PURE__*/ _react.default.createElement("script", {
            "data-partytown-config": "",
            dangerouslySetInnerHTML: {
                __html: `
            partytown = {
              lib: "${assetPrefix}/_next/static/~partytown/"
            };
          `
            }
        }), /*#__PURE__*/ _react.default.createElement("script", {
            "data-partytown": "",
            dangerouslySetInnerHTML: {
                __html: partytownSnippet()
            }
        }), (scriptLoader.worker || []).map((file, index)=>{
            const { strategy , src , children: scriptChildren , dangerouslySetInnerHTML , ...scriptProps } = file;
            let srcProps = {};
            if (src) {
                // Use external src if provided
                srcProps.src = src;
            } else if (dangerouslySetInnerHTML && dangerouslySetInnerHTML.__html) {
                // Embed inline script if provided with dangerouslySetInnerHTML
                srcProps.dangerouslySetInnerHTML = {
                    __html: dangerouslySetInnerHTML.__html
                };
            } else if (scriptChildren) {
                // Embed inline script if provided with children
                srcProps.dangerouslySetInnerHTML = {
                    __html: typeof scriptChildren === "string" ? scriptChildren : Array.isArray(scriptChildren) ? scriptChildren.join("") : ""
                };
            } else {
                throw new Error("Invalid usage of next/script. Did you forget to include a src attribute or an inline script? https://nextjs.org/docs/messages/invalid-script");
            }
            return /*#__PURE__*/ _react.default.createElement("script", Object.assign({}, srcProps, scriptProps, {
                type: "text/partytown",
                key: src || index,
                nonce: props.nonce,
                "data-nscript": "worker",
                crossOrigin: props.crossOrigin || crossOrigin
            }));
        }));
    } catch (err) {
        if ((0, _isError).default(err) && err.code !== "MODULE_NOT_FOUND") {
            console.warn(`Warning: ${err.message}`);
        }
        return null;
    }
}
function getPreNextScripts(context, props) {
    const { scriptLoader , disableOptimizedLoading , crossOrigin  } = context;
    const webWorkerScripts = getPreNextWorkerScripts(context, props);
    const beforeInteractiveScripts = (scriptLoader.beforeInteractive || []).filter((script)=>script.src).map((file, index)=>{
        const { strategy , ...scriptProps } = file;
        var _defer;
        return /*#__PURE__*/ _react.default.createElement("script", Object.assign({}, scriptProps, {
            key: scriptProps.src || index,
            defer: (_defer = scriptProps.defer) != null ? _defer : !disableOptimizedLoading,
            nonce: props.nonce,
            "data-nscript": "beforeInteractive",
            crossOrigin: props.crossOrigin || crossOrigin
        }));
    });
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, webWorkerScripts, beforeInteractiveScripts);
}
function getDynamicChunks(context, props, files) {
    const { dynamicImports , assetPrefix , isDevelopment , devOnlyCacheBusterQueryString , disableOptimizedLoading , crossOrigin ,  } = context;
    return dynamicImports.map((file)=>{
        if (!file.endsWith(".js") || files.allFiles.includes(file)) return null;
        return /*#__PURE__*/ _react.default.createElement("script", {
            async: !isDevelopment && disableOptimizedLoading,
            defer: !disableOptimizedLoading,
            key: file,
            src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
            nonce: props.nonce,
            crossOrigin: props.crossOrigin || crossOrigin
        });
    });
}
function getScripts(context, props, files) {
    var ref;
    const { assetPrefix , buildManifest , isDevelopment , devOnlyCacheBusterQueryString , disableOptimizedLoading , crossOrigin ,  } = context;
    const normalScripts = files.allFiles.filter((file)=>file.endsWith(".js"));
    const lowPriorityScripts = (ref = buildManifest.lowPriorityFiles) == null ? void 0 : ref.filter((file)=>file.endsWith(".js"));
    return [
        ...normalScripts,
        ...lowPriorityScripts
    ].map((file)=>{
        return /*#__PURE__*/ _react.default.createElement("script", {
            key: file,
            src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
            nonce: props.nonce,
            async: !isDevelopment && disableOptimizedLoading,
            defer: !disableOptimizedLoading,
            crossOrigin: props.crossOrigin || crossOrigin
        });
    });
}
// Add a special property to the built-in `Document` component so later we can
// identify if a user customized `Document` is used or not.
const InternalFunctionDocument = function InternalFunctionDocument() {
    return /*#__PURE__*/ _react.default.createElement(Html, null, /*#__PURE__*/ _react.default.createElement(Head, null), /*#__PURE__*/ _react.default.createElement("body", null, /*#__PURE__*/ _react.default.createElement(Main, null), /*#__PURE__*/ _react.default.createElement(NextScript, null)));
};
Document[_constants.NEXT_BUILTIN_DOCUMENT] = InternalFunctionDocument;
function Html(props) {
    const { inAmpMode , docComponentsRendered , locale , scriptLoader , __NEXT_DATA__ ,  } = (0, _react).useContext(_htmlContext.HtmlContext);
    docComponentsRendered.Html = true;
    handleDocumentScriptLoaderItems(scriptLoader, __NEXT_DATA__, props);
    return /*#__PURE__*/ _react.default.createElement("html", Object.assign({}, props, {
        lang: props.lang || locale || undefined,
        amp: inAmpMode ? "" : undefined,
        "data-ampdevmode": inAmpMode && "production" !== "production" ? 0 : undefined
    }));
}
function AmpStyles({ styles  }) {
    if (!styles) return null;
    // try to parse styles from fragment for backwards compat
    const curStyles = Array.isArray(styles) ? styles : [];
    if (styles.props && Array.isArray(styles.props.children)) {
        const hasStyles = (el)=>{
            var ref, ref5;
            return el == null ? void 0 : (ref = el.props) == null ? void 0 : (ref5 = ref.dangerouslySetInnerHTML) == null ? void 0 : ref5.__html;
        };
        // @ts-ignore Property 'props' does not exist on type ReactElement
        styles.props.children.forEach((child)=>{
            if (Array.isArray(child)) {
                child.forEach((el)=>hasStyles(el) && curStyles.push(el));
            } else if (hasStyles(child)) {
                curStyles.push(child);
            }
        });
    }
    /* Add custom styles before AMP styles to prevent accidental overrides */ return /*#__PURE__*/ _react.default.createElement("style", {
        "amp-custom": "",
        dangerouslySetInnerHTML: {
            __html: curStyles.map((style)=>style.props.dangerouslySetInnerHTML.__html).join("").replace(/\/\*# sourceMappingURL=.*\*\//g, "").replace(/\/\*@ sourceURL=.*?\*\//g, "")
        }
    });
}
class Head extends _react.Component {
    static contextType = _htmlContext.HtmlContext;
    getCssLinks(files) {
        const { assetPrefix , devOnlyCacheBusterQueryString , dynamicImports , crossOrigin , optimizeCss , optimizeFonts ,  } = this.context;
        const cssFiles = files.allFiles.filter((f)=>f.endsWith(".css"));
        const sharedFiles = new Set(files.sharedFiles);
        // Unmanaged files are CSS files that will be handled directly by the
        // webpack runtime (`mini-css-extract-plugin`).
        let unmangedFiles = new Set([]);
        let dynamicCssFiles = Array.from(new Set(dynamicImports.filter((file)=>file.endsWith(".css"))));
        if (dynamicCssFiles.length) {
            const existing = new Set(cssFiles);
            dynamicCssFiles = dynamicCssFiles.filter((f)=>!(existing.has(f) || sharedFiles.has(f)));
            unmangedFiles = new Set(dynamicCssFiles);
            cssFiles.push(...dynamicCssFiles);
        }
        let cssLinkElements = [];
        cssFiles.forEach((file)=>{
            const isSharedFile = sharedFiles.has(file);
            if (!optimizeCss) {
                cssLinkElements.push(/*#__PURE__*/ _react.default.createElement("link", {
                    key: `${file}-preload`,
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                    as: "style",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                }));
            }
            const isUnmanagedFile = unmangedFiles.has(file);
            cssLinkElements.push(/*#__PURE__*/ _react.default.createElement("link", {
                key: file,
                nonce: this.props.nonce,
                rel: "stylesheet",
                href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                crossOrigin: this.props.crossOrigin || crossOrigin,
                "data-n-g": isUnmanagedFile ? undefined : isSharedFile ? "" : undefined,
                "data-n-p": isUnmanagedFile ? undefined : isSharedFile ? undefined : ""
            }));
        });
        if ( true && optimizeFonts) {
            cssLinkElements = this.makeStylesheetInert(cssLinkElements);
        }
        return cssLinkElements.length === 0 ? null : cssLinkElements;
    }
    getPreloadDynamicChunks() {
        const { dynamicImports , assetPrefix , devOnlyCacheBusterQueryString , crossOrigin ,  } = this.context;
        return dynamicImports.map((file)=>{
            if (!file.endsWith(".js")) {
                return null;
            }
            return /*#__PURE__*/ _react.default.createElement("link", {
                rel: "preload",
                key: file,
                href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                as: "script",
                nonce: this.props.nonce,
                crossOrigin: this.props.crossOrigin || crossOrigin
            });
        }) // Filter out nulled scripts
        .filter(Boolean);
    }
    getPreloadMainLinks(files) {
        const { assetPrefix , devOnlyCacheBusterQueryString , scriptLoader , crossOrigin ,  } = this.context;
        const preloadFiles = files.allFiles.filter((file)=>{
            return file.endsWith(".js");
        });
        return [
            ...(scriptLoader.beforeInteractive || []).map((file)=>/*#__PURE__*/ _react.default.createElement("link", {
                    key: file.src,
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: file.src,
                    as: "script",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                })),
            ...preloadFiles.map((file)=>/*#__PURE__*/ _react.default.createElement("link", {
                    key: file,
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                    as: "script",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                })), 
        ];
    }
    getBeforeInteractiveInlineScripts() {
        const { scriptLoader  } = this.context;
        const { nonce , crossOrigin  } = this.props;
        return (scriptLoader.beforeInteractive || []).filter((script)=>!script.src && (script.dangerouslySetInnerHTML || script.children)).map((file, index)=>{
            const { strategy , children , dangerouslySetInnerHTML , src , ...scriptProps } = file;
            let html = "";
            if (dangerouslySetInnerHTML && dangerouslySetInnerHTML.__html) {
                html = dangerouslySetInnerHTML.__html;
            } else if (children) {
                html = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
            }
            return /*#__PURE__*/ _react.default.createElement("script", Object.assign({}, scriptProps, {
                dangerouslySetInnerHTML: {
                    __html: html
                },
                key: scriptProps.id || index,
                nonce: nonce,
                "data-nscript": "beforeInteractive",
                crossOrigin: crossOrigin || undefined
            }));
        });
    }
    getDynamicChunks(files) {
        return getDynamicChunks(this.context, this.props, files);
    }
    getPreNextScripts() {
        return getPreNextScripts(this.context, this.props);
    }
    getScripts(files) {
        return getScripts(this.context, this.props, files);
    }
    getPolyfillScripts() {
        return getPolyfillScripts(this.context, this.props);
    }
    makeStylesheetInert(node) {
        return _react.default.Children.map(node, (c)=>{
            var ref8, ref6;
            if ((c == null ? void 0 : c.type) === "link" && (c == null ? void 0 : (ref8 = c.props) == null ? void 0 : ref8.href) && _constants.OPTIMIZED_FONT_PROVIDERS.some(({ url  })=>{
                var ref, ref7;
                return c == null ? void 0 : (ref = c.props) == null ? void 0 : (ref7 = ref.href) == null ? void 0 : ref7.startsWith(url);
            })) {
                const newProps = {
                    ...c.props || {},
                    "data-href": c.props.href,
                    href: undefined
                };
                return /*#__PURE__*/ _react.default.cloneElement(c, newProps);
            } else if (c == null ? void 0 : (ref6 = c.props) == null ? void 0 : ref6.children) {
                const newProps1 = {
                    ...c.props || {},
                    children: this.makeStylesheetInert(c.props.children)
                };
                return /*#__PURE__*/ _react.default.cloneElement(c, newProps1);
            }
            return c;
        }).filter(Boolean);
    }
    render() {
        const { styles , ampPath , inAmpMode , hybridAmp , canonicalBase , __NEXT_DATA__ , dangerousAsPath , headTags , unstable_runtimeJS , unstable_JsPreload , disableOptimizedLoading , optimizeCss , optimizeFonts ,  } = this.context;
        const disableRuntimeJS = unstable_runtimeJS === false;
        const disableJsPreload = unstable_JsPreload === false || !disableOptimizedLoading;
        this.context.docComponentsRendered.Head = true;
        let { head  } = this.context;
        let cssPreloads = [];
        let otherHeadElements = [];
        if (head) {
            head.forEach((c)=>{
                if (c && c.type === "link" && c.props["rel"] === "preload" && c.props["as"] === "style") {
                    cssPreloads.push(c);
                } else {
                    c && otherHeadElements.push(c);
                }
            });
            head = cssPreloads.concat(otherHeadElements);
        }
        let children = _react.default.Children.toArray(this.props.children).filter(Boolean);
        // show a warning if Head contains <title> (only in development)
        if (false) {}
        if ( true && optimizeFonts && !inAmpMode) {
            children = this.makeStylesheetInert(children);
        }
        let hasAmphtmlRel = false;
        let hasCanonicalRel = false;
        // show warning and remove conflicting amp head tags
        head = _react.default.Children.map(head || [], (child)=>{
            if (!child) return child;
            const { type , props  } = child;
            if (inAmpMode) {
                let badProp = "";
                if (type === "meta" && props.name === "viewport") {
                    badProp = 'name="viewport"';
                } else if (type === "link" && props.rel === "canonical") {
                    hasCanonicalRel = true;
                } else if (type === "script") {
                    // only block if
                    // 1. it has a src and isn't pointing to ampproject's CDN
                    // 2. it is using dangerouslySetInnerHTML without a type or
                    // a type of text/javascript
                    if (props.src && props.src.indexOf("ampproject") < -1 || props.dangerouslySetInnerHTML && (!props.type || props.type === "text/javascript")) {
                        badProp = "<script";
                        Object.keys(props).forEach((prop)=>{
                            badProp += ` ${prop}="${props[prop]}"`;
                        });
                        badProp += "/>";
                    }
                }
                if (badProp) {
                    console.warn(`Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://nextjs.org/docs/messages/conflicting-amp-tag`);
                    return null;
                }
            } else {
                // non-amp mode
                if (type === "link" && props.rel === "amphtml") {
                    hasAmphtmlRel = true;
                }
            }
            return child;
        });
        const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);
        var _nonce, _nonce1;
        return /*#__PURE__*/ _react.default.createElement("head", Object.assign({}, getHeadHTMLProps(this.props)), this.context.isDevelopment && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("style", {
            "data-next-hide-fouc": true,
            "data-ampdevmode": inAmpMode ? "true" : undefined,
            dangerouslySetInnerHTML: {
                __html: `body{display:none}`
            }
        }), /*#__PURE__*/ _react.default.createElement("noscript", {
            "data-next-hide-fouc": true,
            "data-ampdevmode": inAmpMode ? "true" : undefined
        }, /*#__PURE__*/ _react.default.createElement("style", {
            dangerouslySetInnerHTML: {
                __html: `body{display:block}`
            }
        }))), head, /*#__PURE__*/ _react.default.createElement("meta", {
            name: "next-head-count",
            content: _react.default.Children.count(head || []).toString()
        }), children, optimizeFonts && /*#__PURE__*/ _react.default.createElement("meta", {
            name: "next-font-preconnect"
        }), inAmpMode && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("meta", {
            name: "viewport",
            content: "width=device-width,minimum-scale=1,initial-scale=1"
        }), !hasCanonicalRel && /*#__PURE__*/ _react.default.createElement("link", {
            rel: "canonical",
            href: canonicalBase + (0, _utils).cleanAmpPath(dangerousAsPath)
        }), /*#__PURE__*/ _react.default.createElement("link", {
            rel: "preload",
            as: "script",
            href: "https://cdn.ampproject.org/v0.js"
        }), /*#__PURE__*/ _react.default.createElement(AmpStyles, {
            styles: styles
        }), /*#__PURE__*/ _react.default.createElement("style", {
            "amp-boilerplate": "",
            dangerouslySetInnerHTML: {
                __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`
            }
        }), /*#__PURE__*/ _react.default.createElement("noscript", null, /*#__PURE__*/ _react.default.createElement("style", {
            "amp-boilerplate": "",
            dangerouslySetInnerHTML: {
                __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`
            }
        })), /*#__PURE__*/ _react.default.createElement("script", {
            async: true,
            src: "https://cdn.ampproject.org/v0.js"
        })), !inAmpMode && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, !hasAmphtmlRel && hybridAmp && /*#__PURE__*/ _react.default.createElement("link", {
            rel: "amphtml",
            href: canonicalBase + getAmpPath(ampPath, dangerousAsPath)
        }), this.getBeforeInteractiveInlineScripts(), !optimizeCss && this.getCssLinks(files), !optimizeCss && /*#__PURE__*/ _react.default.createElement("noscript", {
            "data-n-css": (_nonce = this.props.nonce) != null ? _nonce : ""
        }), !disableRuntimeJS && !disableJsPreload && this.getPreloadDynamicChunks(), !disableRuntimeJS && !disableJsPreload && this.getPreloadMainLinks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files), optimizeCss && this.getCssLinks(files), optimizeCss && /*#__PURE__*/ _react.default.createElement("noscript", {
            "data-n-css": (_nonce1 = this.props.nonce) != null ? _nonce1 : ""
        }), this.context.isDevelopment && // ordering matches production
        // (by default, style-loader injects at the bottom of <head />)
        /*#__PURE__*/ _react.default.createElement("noscript", {
            id: "__next_css__DO_NOT_USE__"
        }), styles || null), /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, {}, ...headTags || []));
    }
}
exports.Head = Head;
function Main() {
    const { docComponentsRendered  } = (0, _react).useContext(_htmlContext.HtmlContext);
    docComponentsRendered.Main = true;
    // @ts-ignore
    return /*#__PURE__*/ _react.default.createElement("next-js-internal-body-render-target", null);
}
class NextScript extends _react.Component {
    static contextType = _htmlContext.HtmlContext;
    getDynamicChunks(files) {
        return getDynamicChunks(this.context, this.props, files);
    }
    getPreNextScripts() {
        return getPreNextScripts(this.context, this.props);
    }
    getScripts(files) {
        return getScripts(this.context, this.props, files);
    }
    getPolyfillScripts() {
        return getPolyfillScripts(this.context, this.props);
    }
    static getInlineScriptSource(context) {
        const { __NEXT_DATA__ , largePageDataBytes  } = context;
        try {
            const data = JSON.stringify(__NEXT_DATA__);
            const bytes = Buffer.from(data).byteLength;
            const prettyBytes = (__webpack_require__(955)/* ["default"] */ .Z);
            if (largePageDataBytes && bytes > largePageDataBytes) {
                console.warn(`Warning: data for page "${__NEXT_DATA__.page}" is ${prettyBytes(bytes)} which exceeds the threshold of ${prettyBytes(largePageDataBytes)}, this amount of data can reduce performance.\nSee more info here: https://nextjs.org/docs/messages/large-page-data`);
            }
            return (0, _htmlescape).htmlEscapeJsonString(data);
        } catch (err) {
            if ((0, _isError).default(err) && err.message.indexOf("circular structure") !== -1) {
                throw new Error(`Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://nextjs.org/docs/messages/circular-structure`);
            }
            throw err;
        }
    }
    render() {
        const { assetPrefix , inAmpMode , buildManifest , unstable_runtimeJS , docComponentsRendered , devOnlyCacheBusterQueryString , disableOptimizedLoading , crossOrigin ,  } = this.context;
        const disableRuntimeJS = unstable_runtimeJS === false;
        docComponentsRendered.NextScript = true;
        if (inAmpMode) {
            if (true) {
                return null;
            }
            const ampDevFiles = [
                ...buildManifest.devFiles,
                ...buildManifest.polyfillFiles,
                ...buildManifest.ampDevFiles, 
            ];
            return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, disableRuntimeJS ? null : /*#__PURE__*/ _react.default.createElement("script", {
                id: "__NEXT_DATA__",
                type: "application/json",
                nonce: this.props.nonce,
                crossOrigin: this.props.crossOrigin || crossOrigin,
                dangerouslySetInnerHTML: {
                    __html: NextScript.getInlineScriptSource(this.context)
                },
                "data-ampdevmode": true
            }), ampDevFiles.map((file)=>/*#__PURE__*/ _react.default.createElement("script", {
                    key: file,
                    src: `${assetPrefix}/_next/${file}${devOnlyCacheBusterQueryString}`,
                    nonce: this.props.nonce,
                    crossOrigin: this.props.crossOrigin || crossOrigin,
                    "data-ampdevmode": true
                })));
        }
        if (false) {}
        const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);
        return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, !disableRuntimeJS && buildManifest.devFiles ? buildManifest.devFiles.map((file)=>/*#__PURE__*/ _react.default.createElement("script", {
                key: file,
                src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                nonce: this.props.nonce,
                crossOrigin: this.props.crossOrigin || crossOrigin
            })) : null, disableRuntimeJS ? null : /*#__PURE__*/ _react.default.createElement("script", {
            id: "__NEXT_DATA__",
            type: "application/json",
            nonce: this.props.nonce,
            crossOrigin: this.props.crossOrigin || crossOrigin,
            dangerouslySetInnerHTML: {
                __html: NextScript.getInlineScriptSource(this.context)
            }
        }), disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files));
    }
}
exports.NextScript = NextScript;
function getAmpPath(ampPath, asPath) {
    return ampPath || `${asPath}${asPath.includes("?") ? "&" : "?"}amp=1`;
}
function getHeadHTMLProps(props) {
    const { crossOrigin , nonce , ...restProps } = props;
    // This assignment is necessary for additional type checking to avoid unsupported attributes in <head>
    const headProps = restProps;
    return headProps;
} //# sourceMappingURL=_document.js.map


/***/ }),

/***/ 676:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = isError;
exports.getProperError = getProperError;
var _isPlainObject = __webpack_require__(524);
function isError(err) {
    return typeof err === "object" && err !== null && "name" in err && "message" in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if (false) {}
    return new Error((0, _isPlainObject).isPlainObject(err) ? JSON.stringify(err) : err + "");
}

//# sourceMappingURL=is-error.js.map

/***/ }),

/***/ 955:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = prettyBytes;
function prettyBytes(number, options) {
    if (!Number.isFinite(number)) {
        throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
    }
    options = Object.assign({}, options);
    if (options.signed && number === 0) {
        return " 0 B";
    }
    const isNegative = number < 0;
    const prefix = isNegative ? "-" : options.signed ? "+" : "";
    if (isNegative) {
        number = -number;
    }
    if (number < 1) {
        const numberString = toLocaleString(number, options.locale);
        return prefix + numberString + " B";
    }
    const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1);
    number = Number((number / Math.pow(1000, exponent)).toPrecision(3));
    const numberString = toLocaleString(number, options.locale);
    const unit = UNITS[exponent];
    return prefix + numberString + " " + unit;
}
/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/ const UNITS = [
    "B",
    "kB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
    "ZB",
    "YB"
];
/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/ const toLocaleString = (number, locale)=>{
    let result = number;
    if (typeof locale === "string") {
        result = number.toLocaleString(locale);
    } else if (locale === true) {
        result = number.toLocaleString();
    }
    return result;
};

//# sourceMappingURL=pretty-bytes.js.map

/***/ })

};
;