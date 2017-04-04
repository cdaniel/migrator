/* Copyright 2017  Krzysztof Daniel.
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
// var modelLogger = require('./../../log').getLogger('MapSchema');
var _ = require('underscore');
var q = require('q');


var wardleyMap = {};


module.exports = function(conn) {

    if (wardleyMap[conn]) {
        return wardleyMap[conn];
    }
    /**
     * see capability-category-schema for explanations.
     */

    var _MapSchema = new Schema({
        user: Schema.Types.String,
        purpose: Schema.Types.String,
        name: Schema.Types.String,
        isSubmap: Schema.Types.Boolean,
        archived: Schema.Types.Boolean,
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace'
        },
        nodes: [{
            type: Schema.Types.ObjectId,
            ref: 'Node'
        }],
        comments: [{
            x: Schema.Types.Number,
            y: Schema.Types.Number,
            text: Schema.Types.String
        }],
        responsiblePerson: Schema.Types.String
    });


    wardleyMap[conn] = conn.model('WardleyMap', _MapSchema);
    return wardleyMap[conn];
};
