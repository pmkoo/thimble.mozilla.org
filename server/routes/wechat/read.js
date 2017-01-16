"use strict";

var eventproxy = require('eventproxy');
var _ = require('lodash');
var models = require('../../models');
var Article = models.Article;

var extend = require('util')._extend;

module.exports = function(config, req, res, next) {


  var id= req.params.id;
  var proxy = new eventproxy();
  proxy.fail(next);

  var query={};
  if( !isNaN( id ) )
  {
    query={"oid":id};

  }else{
    query={"_id":id};
  }
  var readid = JSON.stringify(query);
  Article.find(query, function (err, topic) {
    if(err){
      return res.status(403).send('主题不存在');
    }


    var topic=topic[0];
    if(topic){

      topic.click_num += 1;
      topic.save();
      var keys=topic.keywords.split(",");
      var topic2 = extend(topic._doc,{tags:topic.keywords.split(",")});
      var other=[]
      if(keys&&keys.length>0){
        var query = {};


        query['keywords']=new RegExp(keys[0]);//模糊查询参数




        var limit = 5;
        var options = {  limit: limit,sort:{"datetime":-1}};

        var fields={title:"title",_id:"_id" };

        Article.find(query, fields, options, function (err, topics) {
          proxy.emit('other', topics);

        })
      }
      proxy.emit('readid', topic2);

    }else{
      return res.status(403).send('主题不存在');
    }
 



  })


  proxy.all('readid','other',
      function ( pages,other) {
        res.render('wechat/read.html',{topic:pages,other:other})

      });


};
