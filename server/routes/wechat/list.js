"use strict";

var request = require("request");
var querystring = require("querystring");

var eventproxy = require('eventproxy');
var _ = require('lodash');
var models = require('../../models');
var Article = models.Article;
module.exports = function (config, req, res, next) {

    var skip = parseInt(req.query.skip, 10) || 0;
    var tags = req.params.tag;

    var proxy = new eventproxy();
    proxy.fail(next);

    // 取主题
    var query = {};

    if (tags != "undefined" && tags) {
        query['keywords'] = new RegExp(tags, "i");//new RegExp(tags);//模糊查询参数
    }

    var limit = 10;// config.list_topic_count;
    var options = {skip: skip, limit: limit, sort: {"_id": -1}};


// 取分页数据
    //var pagesCacheKey =  "pages1"+ JSON.stringify(options);

    var fields = {
        title: "title",
        _id: "_id",
        datetime: "datetime",
        image_list: "image_list",
        abstract: "abstract",
        keywords: "keywords"
    };
    Article.find(query, fields, options, function (err, topics) {

        var query = {};

        var limit = 5;
        var options = {limit: limit, sort: {"click_num": -1}};

        var fields = {title: "title", _id: "_id"};

        Article.find(query, fields, options, function (err, other) {
            res.render('wechat/index.html', {topics: topics, tags: tags, other: other})
        })

        //  proxy.emit('other_index', topics);

    })


    proxy.all('page_index', function (topics) {
        res.render('wechat/index.html', {topics: topics, tags: tags, other: topics})
    });


};


