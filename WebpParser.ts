module chaos {
    /**
     * webp图片解析
     * @author likun
     */
    export class WebpParser {
        private static _isSupport: boolean;
        private static get isSupport(): boolean {
            return this._isSupport;
        }

        static init() {
            try {
                // 检测浏览器是否支持webp
                this._isSupport = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
                this.parser();
            } catch (e) { }
        }

        private static parser() {
            let R = RES as any;
            if (!this.isSupport) return;
            R.ResourceLoader.prototype.loadResource = function (r, p) {

                if (r.url.indexOf('://') == -1) {
                    if (r.url.match('.png') || r.url.match('.jpg')) {
                        r.url = 'webp/' + r.url;
                        r.url = r.url.replace('.png', '.webp');
                        r.url = r.url.replace('.jpg', '.webp');
                    }
                }

                if (!p) {
                    // 处理重复加载
                    if (R.FEATURE_FLAG.FIX_DUPLICATE_LOAD == 1) {
                        var s = R.host.state[r.root + r.name];
                        if (s == 2) {
                            return Promise.resolve(R.host.get(r));
                        }
                        if (s == 1) {
                            return r.promise;
                        }
                    }
                    p = R.processor.isSupport(r);
                }
                if (!p) {
                    throw new R.ResourceManagerError(2001, r.name, r.type);
                }
                R.host.state[r.root + r.name] = 1;
                var promise = p.onLoadStart(R.host, r);
                r.promise = promise;
                return promise;
            }
        }
    }
}