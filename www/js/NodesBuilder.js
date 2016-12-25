var NodesBuilder = paper.Base.extend({
    _class: "NodesBuilder",

    paths: null,

    nodes: null,
    nodesPC: null,
    links: null,

    buildNodes: function(paths)
    {
        this.nodes = [];
        this.nodesPC = [];
        this.links = [];
        this._initPathsAsNodes(paths);
        this._checkIntersectionsForAllPaths(paths);
        return this.links;
    },

    _checkIntersectionsForAllPaths: function(paths)
    {
        //console.log("_checkIntersectionsForAllPaths()");
        var i = paths.length,
            j;
        while(--i >= 0)
        {
            this._checkIntersections(paths[i], null);
            j = i;
            while(--j >= 0)
            {
                this._checkIntersections(paths[i], paths[j]);
            }
        }
    },

    _checkIntersections: function(path1, path2)
    {
        var builder = this;
        path1.getIntersections(path2, function(curveLocation) {
            builder._addIntersection(curveLocation); 

            // We are not interested in the resulting intersections array.
            return false;
        });
    },

    _addIntersection: function(curveLocation)
    {
        var intersection = curveLocation.intersection;

        var nodesForCurves = this._initIntersection(curveLocation.path.index, curveLocation.curve.index, curveLocation.time,
                                                    intersection.path.index,  intersection.curve.index,  intersection.time,
                                                    curveLocation.point);

        var node = this.nodes[nodesForCurves[0].nodeIndex];

        this._insertNodeOnCurve(node, curveLocation, nodesForCurves[0]);
        this._insertNodeOnCurve(node, intersection,  nodesForCurves[1]);
    },

    _initIntersection: function(pathIndex1, curveIndex1, time1,
                                pathIndex2, curveIndex2, time2,
                                point)
    {
        var nodeForCurve1 = this._initNodeForCurve(pathIndex1, curveIndex1, time1, true);
        var nodeForCurve2 = this._initNodeForCurve(pathIndex2, curveIndex2, time2, true);

        // The intersection point matches two different nodes (because e.g. two
        // different paths used the same point). Then we merge these nodes.
        if (   null != nodeForCurve1.nodeIndex && null != nodeForCurve2.nodeIndex
            && nodeForCurve1.nodeIndex != nodeForCurve2.nodeIndex)
        {
            this._mergeNodes(nodeForCurve1, nodeForCurve2);
        }
        else if (null != nodeForCurve1.nodeIndex)
        {
            nodeForCurve2.nodeIndex = nodeForCurve1.nodeIndex;
        }
        else if (null != nodeForCurve2.nodeIndex)
        {
            nodeForCurve1.nodeIndex = nodeForCurve2.nodeIndex;
        }
        else
        {
            node = this._createNode(point);
            nodeForCurve1.nodeIndex = nodeForCurve2.nodeIndex = node.index;
        };
        //console.log("_initIntersection: node: " + nodeForCurve1.nodeIndex);
        return [nodeForCurve1, nodeForCurve2];
    },

    _mergeNodes: function(nodeForCurve1, nodeForCurve2)
    {
        var oldNode = this.nodes[nodeForCurve2.nodeIndex];
        var newNode = this.nodes[nodeForCurve1.nodeIndex];
        //console.log("_mergeNodes: ", nodeForCurve1, newNode, nodeForCurve2, oldNode);
        var links = oldNode.links,
            i = links.length,
            nodeLink, link;
        while (--i >= 0)
        {
           nodeLink = links[i];
           link = nodeLink.link;
           if (link.node1.index == oldNode.index)
           {
               link.node1 = newNode;
               nodeLink = this._addLinkToNode(newNode, link.node2);
           }
           else if (link.node2.index == oldNode.index)
           {
               link.node2 = newNode;
               nodeLink = this._addLinkToNode(newNode, link.node1);
           }
           if (nodeLink)
           {
               nodeLink.link = link;
           }
        }
        this.nodes[nodeForCurve2.nodeIndex] = null;

        nodeForCurve2.nodeIndex = nodeForCurve1.nodeIndex;
    },

    _createNode: function(point)
    {
        var node = {
            index: this.nodes.length,
            point: point,
            links: [],
        };
        this.nodes.push(node);
        return node;
    },

    _insertNodeOnCurve: function(node, curveLocation, nodeForCurve)
    {
        var node1 = this._connectNodes(node, curveLocation, curveLocation.curve.point1, 0, nodeForCurve);
        var node2 = this._connectNodes(node, curveLocation, curveLocation.curve.point2, 1, nodeForCurve);

        //console.log("_insertNodeOnCurve: node: " + node.index + ", node1: " + (node1 ? node1.index : -1) + ", node2: " + (node2 ? node2.index : -1));

        if (node1 && node2)
        {
            this._removeLinkBetweenNodes(node1, node2);
        }
        if (node1)
        {
            this._addLinkBetweenNodes(node1, node);
        }
        if (node2)
        {
            this._addLinkBetweenNodes(node, node2);
        }
    },

    _addLinkBetweenNodes: function(node1, node2)
    {
        var node1Link = this._addLinkToNode(node1, node2);
        if (node1Link != null)
        {
            var node2Link = this._addLinkToNode(node2, node1);

            if (node2Link != null)
            {
                var link = {
                    node1: node1,
                    node2: node2,
                    index: this.links.length
                };
                this.links.push(link);
                node1Link.link = link;
                node2Link.link = link;
            }
            else
            {
                // node2 was already connected to node1, but not
                // node1 to node2?!
                console.log("Error?!");
            }
        }
    },

    _addLinkToNode: function(fromNode, toNode, returnExisting)
    {
        //console.log(fromNode.point.x + "/" + fromNode.point.y + " -> " + toNode.point.x + "/" + toNode.point.y);
        var angle = (toNode.point.subtract(fromNode.point).angleInRadians + 2 * Math.PI) % (2 * Math.PI);
        var links = fromNode.links;
        var nodeLink;
        for (var i = 0; i < links.length; i++)
        {
            nodeLink = links[i];
            if (   nodeLink.link.node1.index == toNode.index
                || nodeLink.link.node2.index == toNode.index)
            {
                return returnExisting ? nodeLink : null;
            }
            else if (angle < nodeLink.angle)
            {
                break;
            }
        }
        links.splice(i, 0, nodeLink = {
            link: null,
            angle: angle
        });
        return nodeLink;
    },

    _removeLinkBetweenNodes: function(node1, node2)
    {
        var link1 = this._removeLinkFromNode(node1, node2);
        var link2 = this._removeLinkFromNode(node2, node1);
        var link = link1 || link2;
        if (link != null)
        {
            this.links[link.index] = null;
        }
    },

    _removeLinkFromNode: function(node1, node2)
    {
        var links = node1.links;
        var link;
        for (var i = 0; i < links.length; i++)
        {
            if (    null != (link = links[i].link)
                &&  (   link.node1.index == node1.index && link.node2.index == node2.index
                     || link.node1.index == node2.index && link.node2.index == node1.index))
            {
                links.splice(i, 1);
                return link;
            }
        }
    },

    _connectNodes: function(node, fromCurveLocation, toPoint, toTime, curveNode)
    {
        if (fromCurveLocation.time == toTime)
        {
            return;
        }

        var dir = toTime > fromCurveLocation.time ? 1 : -1;
        var otherCurveNode = dir == 1 ? curveNode.next : curveNode.previous;
        var otherNodeIndex, otherNode;

        if (!otherCurveNode)
        {
            otherCurveNode = this._initNodeForCurveLocation(fromCurveLocation, toTime, true, toPoint);
        }
        return this.nodes[otherCurveNode.nodeIndex];
    },
    
    _getNodesForCurve: function(pathIndex, curveIndex, create)
    {
        var pathNodes,
            curveNodes;

        if (   (   null != (pathNodes = this.nodesPC[pathIndex])
                || create && (pathNodes = this.nodesPC[pathIndex] = []))
            && (   null != (curveNodes = pathNodes[curveIndex])
                || create && (curveNodes = pathNodes[curveIndex] = [])))
        {
            return curveNodes;
        }
    },

    _initNodeForCurveLocation: function(curveLocation, time, create, point)
    {
        return this._initNodeForCurve(curveLocation.path.index,
                                      curveLocation.curve.index, 
                                      time == null ? curveLocation.time : time,
                                      create,
                                      point);
    },

    _initNodeForCurve: function(pathIndex, curveIndex, time, create, point)
    {
        var curveNodes;

        if (null == (curveNodes = this._getNodesForCurve(pathIndex, curveIndex, create)))
        {
            return;
        }

        if (time == null)
            time = curveLocation.time;
        
        for (var i = 0; i < curveNodes.length; i++)
        {
            if (curveNodes[i].time == time)
            {
                //console.log("_initNodeForCurve 1: node: " + curveNodes[i].nodeIndex);
                return curveNodes[i];
            }
            else if (time < curveNodes[i].time)
            {
                break;
            }
        }
        if (create)
        {
            var curveNode = {
                time: time,
                nodeIndex: null,
                next: curveNodes[i],
                previous: curveNodes[i-1]
            };
            curveNodes.splice(i, 0, curveNode);

            if (curveNode.next)
                curveNode.next.previous = curveNode;
            if (curveNode.previous)
                curveNode.previous.next = curveNode;

            if (point)
            {
                var node = this._createNode(point);
                curveNode.nodeIndex = node.index;
            }

            //console.log("_initNodeForCurve 2: node: " + curveNode.nodeIndex);
            
            return curveNode;
        }
    },

    _initPathsAsNodes: function(paths)
    {
        for (var i = 0; i < paths.length; i++)
        {
            this._initPathAsNodes(paths[i]);
        }
    },

    _initPathAsNodes: function(path)
    {
        //console.log("_initPathAsNodes(" + path.index + ")");
        var curves = path.curves;
        var l = curves.length;

        if (l == 0)
        {
            return;
        }

        var pathIndex = path.index,
            curve,
            nodeForCurve,
            node,
            firstNode,
            previousNode;
        
        nodeForCurve = this._initNodeForCurve(pathIndex, 0, 0, true, curves[0].point1);
        firstNode = previousNode = this.nodes[nodeForCurve.nodeIndex];

        for (var i = 0; i < l; i++)
        {
            curve = curves[i];

            if (    i < l - 1
                ||  path.closed)
            {
                nodeForCurve = this._initIntersection(pathIndex, i    , 1,
                                                      pathIndex, (i < l - 1 ? i + 1 : 0), 0,
                                                      curve.point2)[0];
            }
            else
            {
                // For the last point on the path, if it is not closed (otherwise we use the
                // first node, corresponding to the first point of the path - see above).
                nodeForCurve = this._initNodeForCurve(pathIndex, i, 1, true, curve.point2);
            }
            node = this.nodes[nodeForCurve.nodeIndex];
            this._addLinkBetweenNodes(previousNode, node);
            previousNode = node;
        }
    },
});
