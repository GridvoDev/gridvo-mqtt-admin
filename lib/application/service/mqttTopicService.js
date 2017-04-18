'use strict';
const _ = require('underscore');
const {createMqttPacketDAO} = require('../../infrastructure');

class Service {
    constructor() {
        this._mqttPacketDAO = createMqttPacketDAO();
    }

    getTopicTree(callback) {
        let topicTree = {text: "root", leaf: true, children: []};
        this._mqttPacketDAO.getAllTopic((err, topics) => {
            if (err) {
                callback(err);
            }
            for (let topic of topics) {
                let parentNode = topicTree;
                let nodeTitles = topic.split("/");
                for (let nodeTitle of nodeTitles) {
                    if (nodeTitle == "") {
                        continue;
                    }
                    let currentNode = null;
                    for (let childrenNode of parentNode.children) {
                        if (childrenNode.text == nodeTitle) {
                            parentNode.leaf = false;
                            currentNode = childrenNode;
                            break;
                        }
                    }
                    if (_.isNull(currentNode)) {
                        currentNode = {text: nodeTitle, leaf: true, children: []};
                        parentNode.leaf = false;
                        parentNode.children.push(currentNode);
                    }
                    parentNode = currentNode;
                }
            }
            callback(null, topicTree);
        });
    }

    getMqttPacketsByTopic(topic, options, callback) {
        if (!topic) {
            callback(new Error("invalid input parameter"));
            return;
        }
        this._mqttPacketDAO.getPacketsByTopic(topic, options, (err, mqttPackets) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, mqttPackets);
        });
    }
}

module.exports = Service;