//#!/bin/env node
/* Copyright 2017 Leading Edge Forum

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/
/*jshint esversion: 6 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
// var modelLogger = require('./../../log').getLogger('NodeSchema');
var q = require('q');

var node = {};
/**
 * see capability-category-schema for explanations.
 */


module.exports = function(conn){
    if(node[conn]){
        return node[conn];
    }

    var NodeSchema = new Schema({
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace'
        },
        parentMap: {
            type: Schema.Types.ObjectId,
            ref: 'WardleyMap'
        },
        name: Schema.Types.String,
        x: Schema.Types.Number,
        y: Schema.Types.Number,
        type: Schema.Types.String,
        inboundDependencies: [{
            type: Schema.Types.ObjectId,
            ref: 'Node'
        }],
        outboundDependencies: [{
            type: Schema.Types.ObjectId,
            ref: 'Node'
        }],
        action: [{
            x : Schema.Types.Number,
            y : Schema.Types.Number,
            shortSummary : Schema.Types.String,
            description : Schema.Types.String
        }],
        submapID: {
            type: Schema.Types.ObjectId,
            ref: 'WardleyMap'
        },
        responsiblePerson : Schema.Types.String,
        inertia : Schema.Types.Number,
        description : Schema.Types.String,
        /**holds a reference to a submap if there is one (type must be set to SUBMAP)*/
        processedForDuplication: {
            default: false,
            type: Schema.Types.Boolean
        }
    });

    node[conn] = conn.model('Node', NodeSchema);

    return node[conn];

};
