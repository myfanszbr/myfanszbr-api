"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPosixPath = exports.toObjectId = exports.isObjectId = exports.updateQueryStringParameter = exports.removeScriptTag = exports.stripTags = exports.truncate = exports.createAlias = exports.replaceSpecialChars = exports.isUrl = exports.randomString = exports.getFilePath = exports.getFileName = exports.generateUuid = exports.isEmail = exports.getContentType = exports.getExt = void 0;
const mongoose = require("mongoose");
const path_1 = require("path");
const extTypes = {
    '3gp': 'video/3gpp',
    a: 'application/octet-stream',
    ai: 'application/postscript',
    aif: 'audio/x-aiff',
    aiff: 'audio/x-aiff',
    asc: 'application/pgp-signature',
    asf: 'video/x-ms-asf',
    asm: 'text/x-asm',
    asx: 'video/x-ms-asf',
    atom: 'application/atom+xml',
    au: 'audio/basic',
    avi: 'video/x-msvideo',
    bat: 'application/x-msdownload',
    bin: 'application/octet-stream',
    bmp: 'image/bmp',
    bz2: 'application/x-bzip2',
    c: 'text/x-c',
    cab: 'application/vnd.ms-cab-compressed',
    cc: 'text/x-c',
    chm: 'application/vnd.ms-htmlhelp',
    class: 'application/octet-stream',
    com: 'application/x-msdownload',
    conf: 'text/plain',
    cpp: 'text/x-c',
    crt: 'application/x-x509-ca-cert',
    css: 'text/css',
    csv: 'text/csv',
    cxx: 'text/x-c',
    deb: 'application/x-debian-package',
    der: 'application/x-x509-ca-cert',
    diff: 'text/x-diff',
    djv: 'image/vnd.djvu',
    djvu: 'image/vnd.djvu',
    dll: 'application/x-msdownload',
    dmg: 'application/octet-stream',
    doc: 'application/msword',
    dot: 'application/msword',
    dtd: 'application/xml-dtd',
    dvi: 'application/x-dvi',
    ear: 'application/java-archive',
    eml: 'message/rfc822',
    eps: 'application/postscript',
    exe: 'application/x-msdownload',
    f: 'text/x-fortran',
    f77: 'text/x-fortran',
    f90: 'text/x-fortran',
    flv: 'video/x-flv',
    for: 'text/x-fortran',
    gem: 'application/octet-stream',
    gemspec: 'text/x-script.ruby',
    gif: 'image/gif',
    gz: 'application/x-gzip',
    h: 'text/x-c',
    hh: 'text/x-c',
    htm: 'text/html',
    html: 'text/html',
    ico: 'image/vnd.microsoft.icon',
    ics: 'text/calendar',
    ifb: 'text/calendar',
    iso: 'application/octet-stream',
    jar: 'application/java-archive',
    java: 'text/x-java-source',
    jnlp: 'application/x-java-jnlp-file',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'application/javascript',
    json: 'application/json',
    log: 'text/plain',
    m3u: 'audio/x-mpegurl',
    m4v: 'video/mp4',
    man: 'text/troff',
    mathml: 'application/mathml+xml',
    mbox: 'application/mbox',
    mdoc: 'text/troff',
    me: 'text/troff',
    mid: 'audio/midi',
    midi: 'audio/midi',
    mime: 'message/rfc822',
    mml: 'application/mathml+xml',
    mng: 'video/x-mng',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    mp4v: 'video/mp4',
    mpeg: 'video/mpeg',
    mpg: 'video/mpeg',
    ms: 'text/troff',
    msi: 'application/x-msdownload',
    odp: 'application/vnd.oasis.opendocument.presentation',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odt: 'application/vnd.oasis.opendocument.text',
    ogg: 'application/ogg',
    p: 'text/x-pascal',
    pas: 'text/x-pascal',
    pbm: 'image/x-portable-bitmap',
    pdf: 'application/pdf',
    pem: 'application/x-x509-ca-cert',
    pgm: 'image/x-portable-graymap',
    pgp: 'application/pgp-encrypted',
    pkg: 'application/octet-stream',
    pl: 'text/x-script.perl',
    pm: 'text/x-script.perl-module',
    png: 'image/png',
    pnm: 'image/x-portable-anymap',
    ppm: 'image/x-portable-pixmap',
    pps: 'application/vnd.ms-powerpoint',
    ppt: 'application/vnd.ms-powerpoint',
    ps: 'application/postscript',
    psd: 'image/vnd.adobe.photoshop',
    py: 'text/x-script.python',
    qt: 'video/quicktime',
    ra: 'audio/x-pn-realaudio',
    rake: 'text/x-script.ruby',
    ram: 'audio/x-pn-realaudio',
    rar: 'application/x-rar-compressed',
    rb: 'text/x-script.ruby',
    rdf: 'application/rdf+xml',
    roff: 'text/troff',
    rpm: 'application/x-redhat-package-manager',
    rss: 'application/rss+xml',
    rtf: 'application/rtf',
    ru: 'text/x-script.ruby',
    s: 'text/x-asm',
    sgm: 'text/sgml',
    sgml: 'text/sgml',
    sh: 'application/x-sh',
    sig: 'application/pgp-signature',
    snd: 'audio/basic',
    so: 'application/octet-stream',
    svg: 'image/svg+xml',
    svgz: 'image/svg+xml',
    swf: 'application/x-shockwave-flash',
    t: 'text/troff',
    tar: 'application/x-tar',
    tbz: 'application/x-bzip-compressed-tar',
    tcl: 'application/x-tcl',
    tex: 'application/x-tex',
    texi: 'application/x-texinfo',
    texinfo: 'application/x-texinfo',
    text: 'text/plain',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    torrent: 'application/x-bittorrent',
    tr: 'text/troff',
    txt: 'text/plain',
    vcf: 'text/x-vcard',
    vcs: 'text/x-vcalendar',
    vrml: 'model/vrml',
    war: 'application/java-archive',
    wav: 'audio/x-wav',
    wma: 'audio/x-ms-wma',
    wmv: 'video/x-ms-wmv',
    wmx: 'video/x-ms-wmx',
    wrl: 'model/vrml',
    wsdl: 'application/wsdl+xml',
    xbm: 'image/x-xbitmap',
    xhtml: 'application/xhtml+xml',
    xls: 'application/vnd.ms-excel',
    xml: 'application/xml',
    xpm: 'image/x-xpixmap',
    xsl: 'application/xml',
    xslt: 'application/xslt+xml',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    zip: 'application/zip'
};
const getExt = (path) => {
    const i = path.lastIndexOf('.');
    return i < 0 ? '' : path.substr(i);
};
exports.getExt = getExt;
const getContentType = (ext) => {
    if (extTypes[ext.toLowerCase()]) {
        return extTypes[ext.toLowerCase()];
    }
    return 'application/octet-stream';
};
exports.getContentType = getContentType;
const isEmail = (text) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(text);
};
exports.isEmail = isEmail;
const generateUuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
});
exports.generateUuid = generateUuid;
const getFileName = (fullPath, removeExtension) => {
    const name = fullPath.replace(/^.*[\\\/]/, '');
    return removeExtension ? name.replace(/\.[^/.]+$/, '') : name;
};
exports.getFileName = getFileName;
const getFilePath = (fullPath) => fullPath.substring(0, fullPath.lastIndexOf('/'));
exports.getFilePath = getFilePath;
const randomString = (len, charSetInput) => {
    const charSet = charSetInput
        || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomStr = '';
    for (let i = 0; i < len; i += 1) {
        const randomPoz = Math.floor(Math.random() * charSet.length);
        randomStr += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomStr;
};
exports.randomString = randomString;
const isUrl = (str) => {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return regex.test(str);
};
exports.isUrl = isUrl;
const replaceSpecialChars = (str, char = '_') => {
    if (!str || typeof str !== 'string') {
        return '';
    }
    return str.replace(/[^a-zA-Z0-9 ]/g, char);
};
exports.replaceSpecialChars = replaceSpecialChars;
const createAlias = (str) => {
    if (!str || typeof str !== 'string') {
        return '';
    }
    return str.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}\s]/g, '-');
};
exports.createAlias = createAlias;
const truncate = (str, length = 100) => (str.length > length ? `${str.substring(0, length - 3)}...` : str);
exports.truncate = truncate;
const stripTags = (input, allowed) => {
    if (!input || typeof input !== 'string') {
        return '';
    }
    const allowedTmp = (`${allowed || ''}`.toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input
        .replace(commentsAndPhpTags, '')
        .replace(tags, ($0, $1) => (allowedTmp.indexOf(`<${$1.toLowerCase()}>`) > -1 ? $0 : ''));
};
exports.stripTags = stripTags;
const removeScriptTag = (input) => {
    if (!input || typeof input !== 'string') {
        return '';
    }
    return input.replace(/<script[^>]*>.*?<\/script>/gi, '');
};
exports.removeScriptTag = removeScriptTag;
const updateQueryStringParameter = (uri, key, value) => {
    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
        return uri.replace(re, `$1${key}=${value}$2`);
    }
    return `${uri + separator + key}=${value}`;
};
exports.updateQueryStringParameter = updateQueryStringParameter;
const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(`${id}`);
exports.isObjectId = isObjectId;
const toObjectId = (id) => new mongoose.Types.ObjectId(id);
exports.toObjectId = toObjectId;
const toPosixPath = (str) => {
    if (!str)
        return '';
    return str.split(path_1.sep).join(path_1.posix.sep);
};
exports.toPosixPath = toPosixPath;
//# sourceMappingURL=string.helper.js.map