var Graph = require("./graph.js");
var db = require('../database/db.js');

exports.populateGraph = function(exchangeName, callback) {
    var pairsGraph = new Graph();
    db.getPairsByExchange(exchangeName).then(function(rows, errors){
        var dbRows = [];
        rows.forEach(row => {
            pairsGraph.addNode(row.coin_short);
            pairsGraph.addNode(row.market_short);
            pairsGraph.addEdge(row.market_short, row.coin_short, row.price);
            pairsGraph.addEdge(row.coin_short, row.market_short, (1 / row.price));

        });
        callback(null, pairsGraph);
    }); 
}



exports.arbitrageDFS = function(exchangeName, mainCoinShort, callback) {
    var percentage = 10;
    var depth = 5;
    this.populateGraph(exchangeName, function(err, graph){
        if(err){
            console.log(err);
        }
        else {
            graph.findAllPaths(mainCoinShort, mainCoinShort, function(err, paths) {
                if(err) {
                    console.log(err);
                } else {
                    
                    var arbitragePaths = [];

                    for(let j in paths) {
                        var path = paths[j];
                        var totWeight = 1;
                    
                        for(var i = 0; i < path.length; i ++) {
                            //If it is not the first node in path, get the weight of the edge between node and prev node, also update totWeigth
                            if(i != 0) {
                                nodeWeight = graph._nodes[path[i -1]].outEdges[path[i]];
                                totWeight = totWeight * nodeWeight;
                            } 
                        }

                        if(totWeight > 1 + (percentage * 0.01)&& path.length < depth) {
                            var element = {};
                            element.path = path;
                            element.totWeight = totWeight;
                            arbitragePaths.push(element);
                        }
                    }
                    callback(null, arbitragePaths);
                }
            });
            
        }
    });
}