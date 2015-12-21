var fs = require('fs'),
    us = require('underscore'),
    path = require('path')
    /**
     * GET /attribution_data
     * attribution data
     */

exports.getAttribution = function(req, res) {
    //if (req.user) return res.redirect('/');
    /** 
     * This case is for overview data. Impressions,clicks,conversions and revenue
     */
    var filepath = path.join('__dirname', '../', 'data/MBS(8479014).csv')
        // var filepath = '../data/MBS(8479014).csv'
    fs.readFile(filepath, {
            encoding: 'utf8'
        },
        function(err, data) {
            if (err)
                console.log(err)
            data = data.split('\n')
            var date_index, cols_checked = false;
            var dict = data.reduce(function(prev, curr) {
                var a = curr.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)

                if (a.length < 3) {
                    if ('meta' in prev) {
                        prev['meta'][a[0]] = a[1]
                    } else {
                        prev['meta'] = {}
                    }
                } else {
                    /**
                     * sorting the array in terms of date to prepare of time series
                     * @type {[type]}
                     */
                    if (!cols_checked) {
                        date_index = a.indexOf('Date')
                        prev['headers'] = a

                        prev['data'] = {}

                        cols_checked = true
                    } else if (a[date_index] in prev['data']) {
                        var newrow = a.reduce(function(b, c, i) {
                            b[prev.headers[i]] = c;
                            return b
                        }, {})
                        prev['data'][a[date_index]].push(newrow)
                    } else {
                        var newrow = a.reduce(function(b, c, i) {
                            b[prev.headers[i]] = c
                            return b
                        }, {})

                        prev['data'][a[date_index]] = [newrow]

                    }
                }
                return prev

            }, {});

            res.send(dict)
        })

}
