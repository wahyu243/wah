/*!
 * Simple-Jekyll-Search v1.6.3 (https://github.com/christian-fei/Simple-Jekyll-Search)
 * Copyright 2015-2018, Christian Fei
 * Licensed under the MIT License.
 */
! function() {
    "use strict";
    var s = {
        load: function(e, t) {
            var n = window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
            n.open("GET", e, !0), n.onreadystatechange = (r = n, i = t, function() {
                if (4 === r.readyState && 200 === r.status) try {
                    i(null, JSON.parse(r.responseText))
                } catch (e) {
                    i(e, null)
                }
            }), n.send();
            var r, i
        }
    };
    var n = function(e, t) {
            var n = t.length,
                r = e.length;
            if (n < r) return !1;
            if (r === n) return e === t;
            e: for (var i = 0, o = 0; i < r; i++) {
                for (var a = e.charCodeAt(i); o < n;)
                    if (t.charCodeAt(o++) === a) continue e;
                return !1
            }
            return !0
        },
        t = new function() {
            this.matches = function(e, t) {
                return n(t.toLowerCase(), e.toLowerCase())
            }
        };
    var r = new function() {
        this.matches = function(e, t) {
            return "string" == typeof e && 0 <= (e = e.trim()).toLowerCase().indexOf(t.toLowerCase())
        }
    };
    var f = {
        put: function(e) {
            if (l(e)) return c(e);
            if (t = e, Boolean(t) && "[object Array]" === Object.prototype.toString.call(t)) return function(e) {
                var t = [];
                u();
                for (var n = 0, r = e.length; n < r; n++) l(e[n]) && t.push(c(e[n]));
                return t
            }(e);
            var t;
            return undefined
        },
        clear: u,
        search: function(e) {
            if (!e) return [];
            return function(e, t, n, r) {
                for (var i = [], o = 0; o < e.length && i.length < r.limit; o++) {
                    var a = p(e[o], t, n, r);
                    a && i.push(a)
                }
                return i
            }(o, e, a.searchStrategy, a).sort(a.sort)
        },
        setOptions: function(e) {
            (a = e || {}).fuzzy = e.fuzzy || !1, a.limit = e.limit || 10, a.searchStrategy = e.fuzzy ? t : r, a.sort = e.sort || i
        }
    };

    function i() {
        return 0
    }
    var o = [],
        a = {};

    function u() {
        return o.length = 0, o
    }

    function l(e) {
        return Boolean(e) && "[object Object]" === Object.prototype.toString.call(e)
    }

    function c(e) {
        return o.push(e), o
    }

    function p(e, t, n, r) {
        for (var i in e)
            if (!d(e[i], r.exclude) && n.matches(e[i], t)) return e
    }

    function d(e, t) {
        for (var n = !1, r = 0, i = (t = t || []).length; r < i; r++) {
            var o = t[r];
            !n && new RegExp(e).test(o) && (n = !0)
        }
        return n
    }
    a.fuzzy = !1, a.limit = 10, a.searchStrategy = a.fuzzy ? t : r, a.sort = i;
    var h = {
            compile: function(r) {
                return m.template.replace(m.pattern, function(e, t) {
                    var n = m.middleware(t, r[t], m.template);
                    return void 0 !== n ? n : r[t] || e
                })
            },
            setOptions: function(e) {
                m.pattern = e.pattern || m.pattern, m.template = e.template || m.template, "function" == typeof e.middleware && (m.middleware = e.middleware)
            }
        },
        m = {};
    m.pattern = /\{(.*?)\}/g, m.template = "", m.middleware = function() {};
    var y = {
        merge: function(e, t) {
            var n = {};
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r], "undefined" != typeof t[r] && (n[r] = t[r]));
            return n
        },
        isJSON: function(e) {
            try {
                return !!(e instanceof Object && JSON.parse(JSON.stringify(e)))
            } catch (t) {
                return !1
            }
        }
    };
    ! function(t) {
        var r = {
                searchInput: null,
                resultsContainer: null,
                json: [],
                success: Function.prototype,
                searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
                templateMiddleware: Function.prototype,
                sortMiddleware: function() {
                    return 0
                },
                noResultsText: "No results found",
                limit: 10,
                fuzzy: !1,
                exclude: []
            },
            i = ["searchInput", "resultsContainer", "json"],
            o = function e(t) {
                if (n = t, !(n && "undefined" != typeof n.required && n.required instanceof Array)) throw new Error("-- OptionsValidator: required options missing");
                var n;
                if (!(this instanceof e)) return new e(t);
                var r = t.required;
                this.getRequiredOptions = function() {
                    return r
                }, this.validate = function(t) {
                    var n = [];
                    return r.forEach(function(e) {
                        "undefined" == typeof t[e] && n.push(e)
                    }), n
                }
            }({
                required: i
            });

        function a(e) {
            r.success(e), f.put(e), r.searchInput.addEventListener("keyup", function(e) {
                var t;
                t = e.which, -1 === [13, 16, 20, 37, 38, 39, 40, 91].indexOf(t) && (n(), l(e.target.value))
            })
        }

        function n() {
            r.resultsContainer.innerHTML = ""
        }

        function u(e) {
            r.resultsContainer.innerHTML += e
        }

        function l(e) {
            var t;
            (t = e) && 0 < t.length && (n(), function(e) {
                var t = e.length;
                if (0 === t) return u(r.noResultsText);
                for (var n = 0; n < t; n++) u(h.compile(e[n]))
            }(f.search(e)))
        }

        function c(e) {
            throw new Error("SimpleJekyllSearch --- " + e)
        }
        t.SimpleJekyllSearch = function(e) {
            var n;
            return 0 < o.validate(e).length && c("You must specify the following required options: " + i), r = y.merge(r, e), h.setOptions({
                template: r.searchResultTemplate,
                middleware: r.templateMiddleware
            }), f.setOptions({
                fuzzy: r.fuzzy,
                limit: r.limit,
                sort: r.sortMiddleware
            }), y.isJSON(r.json) ? a(r.json) : (n = r.json, s.load(n, function(e, t) {
                e && c("failed to get JSON (" + n + ")"), a(t)
            })), {
                search: l
            }
        }, t.SimpleJekyllSearch.init = t.SimpleJekyllSearch, "function" == typeof t.SimpleJekyllSearchInit && t.SimpleJekyllSearchInit.call(this, t.SimpleJekyllSearch)
    }(window)
}();

SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results'),
    searchResultTemplate: '<div class="col-xs-12 col-sm-5 col-md-3 mt-4"><div class="card-home"><a href="{url}" title="{title}"><img alt="{title}" height="350" width="350" src="/img/product/{image}"></a><div class="card-home-body mt-4">    <h3 class="card-home-title"><a href="{url}">{title}</a><span class="card-price">${price}</span></h3><p class="card-text mt-2">{description}</p></div></div></div>',
    json: '/search.json'
});
