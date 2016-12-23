
var ShapesFinder = paper.Base.extend({
    _class: "ShapesFinder",

    _SIDE_RIGHT: 0,
    _SIDE_LEFT:  1,

    shapes: null,

    findShapes: function(links)
    {
        this.shapes = [];

        var i = links.length;
        while(--i >= 0)
        {
            if (links[i])
                this._processLink(links[i]);
        }

        return this.shapes;
    },

    _processLink: function(link)
    {
        this._processLinkSide(link, null, this._SIDE_RIGHT);
        this._processLinkSide(link, null, this._SIDE_LEFT);
    },

    _processLinkSide: function(link, linkStart, side, forks, nodes)
    {
        if (null == side)
        {
            side = this._SIDE_RIGHT;
        }

        if (!nodes)
        {
            nodes = new Array();
        }

        if (!forks)
        {
            forks = new Array();
        }
        var fork = {
            maxNode: null,
            maxNodeFrom: null,
            maxNodeTo: null,
            firstNodeIndex: nodes.length,
            dead: false,
        };
        forks.push(fork);

        if (!linkStart)
            linkStart = link.node1;
        var linkEnd, linkSide, forkIndex, nextLink, deadFork;

        //console.log("_processLinkSide(" + link.index + ", " + linkStart.index + ", " + side + ", " + forks.length + ")");

        while (link)
        {
            if (linkStart == link.node1)
            {
                linkEnd = link.node2;
                linkSide = side;
            }
            else
            {
                linkEnd = link.node1;
                linkSide = Number(!side);
            }
            //console.log("...processing... link: " + link.index + ", linkEnd: " + linkEnd.index);

            if (!deadFork)
            {
                // The link hasn't been discovered yet. So it is not part of a loop.
                // Then we should just traverse the link.
                if (   !link.forks && (link.forks = new Array(2))
                    || !link.forks[linkSide])
                {
                    link.forks[linkSide] = fork;
                    nodes.push(linkStart);
                }
                // The link has been traversed before and was included in a previously discovered loop.
                // Then we should not traverse the link again.
                else if (-1 == (forkIndex = forks.lastIndexOf(link.forks[linkSide])))
                {
                    return false;
                }
                // The link has been traversed before and is part of the current loop discovery process.
                // Therefore we will construct the loop.
                else
                {
                    this._closeLoop(forks, nodes, forkIndex, side);
                    return false;
                }
            }

            nextLink = this._getNextLink(link, linkEnd, side);

            if (!nextLink)
            {
                nodes.splice(fork.firstNodeIndex);
                //console.log("Dead fork!!! " + nodes.map(function(_node) { return _node.index; } ));
                fork.dead = true;
                forks.pop();
                return true;
            }

            if (!fork.maxNode || linkEnd.point.x > fork.maxNode.point.x)
            {
                fork.maxNode     = linkEnd;
                fork.maxNodeFrom = link;
                fork.maxNodeTo   = nextLink;
            }

            if (linkEnd.links.length > 2)
            {
                // If _processLinkSide returns true, it was a dead fork. Then we carry
                // on in the loop (from the same link: _getNextLink will ignore the dead
                // fork and return the next one). Otherwise, if _processLinkSide returns
                // false, we stop here.
                if (this._processLinkSide(nextLink, linkEnd, side, forks, nodes))
                {
                    deadFork = true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                link = nextLink;
                linkStart = linkEnd;
            }
        }
        return false;
    },

    _closeLoop: function(forks, nodes, forkIndex, side)
    {
        var j = forks.length;
        var fork;
        var maxNode, maxNodeFrom, maxNodeTo;

        // First get the max node of all forks that are part of the loop.
        while(--j >= forkIndex)
        {
            fork = forks[j];
            if (!maxNode || maxNode.point.x < fork.maxNode.point.x)
            {
                maxNode = fork.maxNode;
                maxNodeFrom = fork.maxNodeFrom;
                maxNodeTo = fork.maxNodeTo;
            }
        }

        //console.log("_checkForLoopInForks; side: " + side + " angle: " + angle + ", maxNodeFrom: " + maxNodeFrom.index + ", maxNodeTo: " + maxNodeTo.index);
        
        // We compute the angles between the two segments at the max node.
        // From this angle, we can know if we discovered the inside or
        // the outside of the shape.
        var angle = this._getAngleBetweenLinks(maxNodeFrom, maxNodeTo);
        var shapeSide = angle > 0 ? this._SIDE_RIGHT : this._SIDE_LEFT;

        // We can close the shape if we discovered it on the inside.
        if (side == shapeSide)
        {
            //console.log("Shape!!!" + nodes.map(function(_node) { return _node.index; } ));
            this.shapes.push(nodes);
        }
    },

    _getAngleBetweenLinks: function(linkA, linkB)
    {
        var node = linkA.node1 == linkB.node1 || linkA.node1 == linkB.node2 ? linkA.node1 :
                   linkA.node2 == linkB.node1 || linkA.node2 == linkB.node2 ? linkA.node2 : null;
        if (!node)
            return;
        var v1 = (node == linkA.node1 ? linkA.node2 : linkA.node1).point.subtract(node.point);
        var v2 = (node == linkB.node1 ? linkB.node2 : linkB.node1).point.subtract(node.point);
        return v2.getDirectedAngle(v1);
    },

    _getNextLink: function(fromLink, node, side)
    {
        var links = node.links;
        var l = links.length;

        // There is only one link connected to the node (and we assert it is <fromLink>)
        // or no link at all. So there is no next link to return.
        if (fromLink && l <= 1 || !l)
        {
            return;
        }

        var nextLink, nextLinkSide;
        var i, dir, start, end;

        // If <fromLink> is not provided we pick up the first link.
        var pickNext = fromLink == null ? true : false;

        if (side == this._SIDE_LEFT)
        {
            start = 0;
            end = l;
            dir = 1;
        }
        else
        {
            start = l - 1;
            end = -1;
            dir = -1;
        }
        i = start;
        
        while (nextLink = links[i].link)
        {
            nextLinkSide = nextLink.node1 == node ? side : Number(!side);

            // We select the link if it is not on a dead fork.
            if (   pickNext
                && (!nextLink.forks || !nextLink.forks[nextLinkSide] || !nextLink.forks[nextLinkSide].dead))
            {
                break;
            }

            if (null == fromLink)
            {
                // We initialize fromLink so we will know when the loop will come 
                // back to it (which can happen if there are only dead forks
                // connected to the node).
                fromLink = nextLink;
            }
            else if (nextLink == fromLink)
            {
                // We are back to <fromLink>, after looping through all the links.
                // It means there are only dead forks.
                if (pickNext)
                {
                    return;
                }
                pickNext = true;
            }

            if ((i += dir) == end)
            {
                // We looped through all the links, but none was <fromLink>.
                if (!pickNext)
                {
                    return;
                }

                i = start;
            }
        }

        return nextLink;
    },
});
