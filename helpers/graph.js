// cretae a graph class
class Graph {

    constructor()
    {
       this._nodes = {};
       this._edges = [];
    }

    addNode(nodeId) {
        if(this.hasNode(nodeId)) {
            return;
        }
        this._nodes[nodeId] = {
            inEdges : {},
            outEdges : {}
        };
    }
 
    removeNode(nodeId){
        //Remove all connections related to this node
        for(let connectedNode in this._nodes[nodeId].inEdges) {
            this.removeEdge(connectedNode, nodeId); 
        }
        for(let connectedNode in this._nodes[nodeId].outEdges) {
            this.removeEdge(nodeId, connectedNode);
        }
        delete this._nodes[nodeId];
    }

    hasNode(nodeId) {
        if(this._nodes[nodeId]){
            return true;
        } else {
            return false;
        }
    }

    addEdge(nodeFrom, nodeTo, weight){
        if(this.hasNode(nodeFrom) && this.hasNode(nodeTo)){
            var newEdge = {};
            newEdge.nodeFrom = nodeFrom;
            newEdge.nodeTo = nodeTo;
            newEdge.weight = weight;

            this._edges.push(newEdge);

            this._nodes[nodeFrom].outEdges[nodeTo] = weight;
            this._nodes[nodeTo].inEdges[nodeFrom] = weight;
        }
    }
    removeEdge(nodeFrom, nodeTo) {
        if(this.hasNode(nodeFrom) && this.hasNode(nodeTo)) {
            for(var i = 0; i < this._edges.length; i ++) {
                if(this._edges[i].nodeFrom === nodeFrom && this._edges[i].nodeTo === nodeTo) {
                    this._edges.splice(i, 1);
                }
            }
            delete this._nodes[nodeFrom].outEdges[nodeTo];
            delete this._nodes[nodeTo].inEdges[nodeFrom];
        }
    }
    dfsUtil(nodeId, visited) {
        console.log("dfsUtil");
        console.log(nodeId);
        visited[nodeId] = true;
        //console.log(visited[nodeId]);
        for(let nextNode in this._nodes[nodeId].outEdges) {
            //console.log(nextNode);
            if(!visited[nextNode]) {
                this.dfsUtil(nextNode, visited);
            }
        }
    }

    dfs(nodeId) {
        var visited = {};
        for(let node in this._nodes) {
            //console.log(node);
            visited[node] = false;
        }
        this.dfsUtil(nodeId, visited);
    }
    findAllPathsUtil(u, d, visited, path, pathIndex, paths) {
        //console.log(visited);
        if(pathIndex != 0) {            
            visited[u] = true;
        }

        path[pathIndex] = u;
        pathIndex ++;

        if(u === d && pathIndex != 1) {
            var pathTemp = [];
            for(var i = 0; i < pathIndex; i ++) {
                //console.log(path[i]);
                pathTemp.push(path[i]);
                
            }
            paths.push(pathTemp);
        } else {
            for(let nextNode in this._nodes[u].outEdges) {
                //console.log("NextNode: " +  nextNode);
                if(!visited[nextNode]){
                    this.findAllPathsUtil(nextNode, d, visited, path, pathIndex, paths);
                }
            }
        }
        //console.log("here1");
        pathIndex --;
        visited[u] = false;
    }
    findAllPaths(s, d, callback){
        var visited = {};

        var path = [];
        var paths = [];
        var pathIndex = 0;

        for(let node in this._nodes) {
            visited[node] = false;
        }

        this.findAllPathsUtil(s, d, visited, path, pathIndex, paths);
        callback(null, paths);
    }
    bellmanFord(source) {
        var distance = {};
        var predecessor = {};

        //Step 1: Initialize graph
        for(let node in this._nodes) {
            distance[node] = Infinity;  //All nodes have distance infinity
            predecessor[node] = null;   //All nodes have null predecessor
        }
        distance[source] = 0;           //weigth is 0 at the source

        //Step 2: relax edges repeatedly

        var nodesLength = Object.keys(this._nodes).length;
        console.log(nodesLength);
        for(var i = 0; i < nodesLength -1; i ++) {
            for(let j in this._edges) {
                console.log(j);
                
                if(distance[this._edges[j].nodeFrom] + this._edges[j].weight < distance[this._edges[j].nodeTo]){
                    distance[this._edges[j].nodeTo] = distance[this._edges[j].nodeFrom] + this._edges[j].weight;
                    predecessor[this._edges[j].nodeTo] = this._edges[j].nodeFrom;
                    console.log(distance);
                    console.log(predecessor);
                }
                console.log("here");
            }
            console.log("i: " + i);
            console.log("here2");
        }
        console.log("here33333333---------------");
        //Step 3: check for negative-weight cycles

        for(let edge in this._edges){
            if(distance[edge.nodeFrom] + edge.weight < distance[edge.nodeTo]){
            //"Graph contains a negative-weight cycle";

                return -1;
            }
        }
        console.log(distance);
        console.log(predecessor);
        return;
    }
    
    bfs(source) {

        //Mark all the nodes as not visited
        var visited = {};
        for(node in this._nodes) {
            visited[node] = false;
        }

        //Create queue
        var queue = [];

        //Mark the current node as visited and enqueue it
        visited[source] = true;
        queue.push(source);


        while(queue.length != 0) {
            //Dequeue node from queue
            var node = queue.shift();
            var predecessor;
            for(let adjNode in this._nodes[node].outEdges){
                console.log("Node: " + node);
                console.log("AdjNode: " + adjNode);
                
                console.log("Predecessor: " + predecessor);
                
                if(adjNode === predecessor) {
                    //console.log("here1");
                    //console.log(adjNode);
                }
                if(adjNode === source) {
                    //console.log("here2");

                    //console.log(adjNode);
                }
                if(!visited[adjNode]) {
                    visited[adjNode] = true;
                    queue.push(adjNode);
                }
                
                console.log();
            }
            predecessor = node;
        }

    }
    getPath(source) {
        for(let coin2 in this._nodes[source].outEdges){
            if(coin2 != "ETH") {
                getPath(coin2);
            }
        }
    }
    // functions to be implemented
 
    // addVertex(v)
    // addEdge(v, w)
    // printGraph()
 
    // bfs(v)
    // dfs(v)
}
module.exports = Graph;