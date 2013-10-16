"use strict";
var path = require('path');

// boilerplate CoffeeScript for class inheritance
var __extends = function(child, parent) {
    for (var key in parent) {
        if (Object.hasOwnProperty.call(parent, key)) {
            child[key] = parent[key];
        }
    }
    
    function Ctor() {
        this.constructor = child;
    }
    
    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    
    return child;
};

// our stuff starts here
var Adapter = require('../adapter');
var _       = require("lodash");

function MockAdapter() {
    var self = this;
    self.eventItems = {};
    
    function genericEmitter(event) {
        return function(envelope) {
            var args = _.collect(arguments);
            var strings = _.rest(args);
            self.eventItems[event] = self.eventItems[event] || [];
            self.eventItems[event].push({env: envelope, args: args, strings: strings});
            
            self.emit(event, envelope, strings);
        };
    }
    
    self.send  = genericEmitter("send");
    self.reply = genericEmitter("reply");
    self.topic = genericEmitter("topic");
    self.play  = genericEmitter("play");
    
    self.run = function() {
        self.emit("connected");
    };
    
    self.close = function() {
        self.emit("closed");
    };

    self.sendItems = function() {
        return self.eventItems['send'] || []
    };

    self.reset = function() {
        self.eventItems = {};
    };
    
    return MockAdapter.__super__.constructor.apply(this, arguments);
}

__extends(MockAdapter, Adapter);

module.exports.use = function(robot) {
    return new MockAdapter(robot);
};
