var NightLines = paper.Base.extend({
    _class: "NighLines",

    path: null,
    canvas: null,
    
    shapesLayer: null,
    textsLayer:  null,

    nodesBuilder: null,
    shapesFinder: null,

    sceneWidth: 800,
    sceneHeight: 600,

    frame: null,
    frameTL: null,
    frameBR: null,
    frameMargin: 0,

    prevClickedPoint: null,

    initialize: function() {
        this.nodesBuilder = new NodesBuilder();
        this.shapesFinder = new ShapesFinder();

        this.canvas = document.getElementById("myCanvas");
        this.canvas.width = this.sceneWidth;
        this.canvas.height = this.sceneHeight;

        paper.setup("myCanvas");

        this._initFrame();
        
        //this._testPath1();
        //this._testPath2();
        //this._testPath3();
        //this._testPath4();
        //this._testPath5();
        //this._testPath6();
        //this._testPath7();
        //this._testPath8();
        //this._testPath9();
        
        this._initMouseEvents();
        this._run();
    },

    _initMouseEvents: function()
    {
        var app = this;
        paper.view.onMouseDown = function(event) {
            app.onMouseDown(event);
        }
    },

    _initPathsLayer: function()
    {
        if (this.pathsLayer == null)
        {
            this.pathsLayer = new paper.Layer(); 
            //this.pathsLayer.visible = false;
        }
        else
        {
            this.pathsLayer.removeChildren(1);
        }
        this.pathsLayer.activate();
    },

    _generatePaths: function()
    {
        this._initPathsLayer();

        var nMinSources = 5;
        var nMaxSources = 8;

        var nMinSegmentsPerSource = 5;
        var nMaxSegmentsPerSource = 10;

        var nSources = this.randomIntBetween(nMinSources, nMaxSources);
        //console.log("nSources: " + nSources);

        var sourceCounter = nSources;
        while (--sourceCounter >= 0)
        {
		    var path = new paper.Path();
            //path.strokeColor = "red";
            path.moveTo(this.randomPointOnFrame(0, 0, this.sceneWidth, this.sceneHeight));

            var segmentCounter = this.randomIntBetween(nMinSegmentsPerSource, nMaxSegmentsPerSource);
            while (--segmentCounter >= 1)
            {
                path.lineTo(this.randomIntBetween(this.frameMargin * 2, this.sceneWidth - this.frameMargin * 2),
                            this.randomIntBetween(this.frameMargin * 2, this.sceneHeight - this.frameMargin * 2));
            }
            path.lineTo(this.randomPointOnFrame(0, 0, this.sceneWidth, this.sceneHeight));
        }

        //console.log(paper.project.activeLayer.exportJSON({asString: true}));
    },

    randomIntBetween: function (min, max)
    {
        return min + Math.round(Math.random() * (max - min));
    },

    randomPointOnFrame: function(x, y, w, h)
    {
        var point = new paper.Point();
        // Source point on horizontal frame, top or bottom.
        if (Math.random() > 0.5)
        {
            point.x = this.randomIntBetween(x, x + w);
            point.y = Math.random() > 0.5 ? y : y + h;
        }
        // Source point on vertical frame, left or right; 
        else
        {
            point.x = Math.random() > 0.5 ? x : x + w;
            point.y = this.randomIntBetween(y, y + h);
        }
        return point;
    },
    
    _testPath1: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(160, 200));
        path.add(new paper.Point(160, 160));
        path.add(new paper.Point(240, 160));
        path.add(new paper.Point(240, 240));
        path.add(new paper.Point(100, 240));
        path.closed = true;
    },

    _testPath2: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(100, 200));
        path.closed = true;
        path.translate(new paper.Point(20, 120));
    },

    _testPath3: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(100, 200));
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(140, 100));
        path.add(new paper.Point(140, 140));
        path.add(new paper.Point(60, 140));
        path.add(new paper.Point(60, 60));
        path.add(new paper.Point(200, 60));
        path.translate(new paper.Point(0, 150));
        path.closed = true;
    },

    _testPath4: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(100, 200));
        path.closed = true;
        path.translate(new paper.Point(200, 0));
    },

    _testPath5: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(100, 200));
        path.closed = true;
        path.translate(new paper.Point(250, 50));
    },

    _testPath6: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 250));
        path.add(new paper.Point(250, 250));
        path.add(new paper.Point(250, 200));
        path.add(new paper.Point(100, 200));
        path.closed = true;
        path.translate(new paper.Point(250, 250));
    },

    _testPath7: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(100, 200));
        path.closed = true;
        
        path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(130, 130));
        path.add(new paper.Point(160, 140));
        path.closed = false;
    },

    _testPath8: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(220, 230));
        path.add(new paper.Point(240, 240));
        path.closed = false;
        
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(100, 200));
        path.closed = true;
        
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(240, 240));
        path.add(new paper.Point(300, 240));
        path.add(new paper.Point(300, 300));
        path.add(new paper.Point(240, 300));
        path.closed = true;
    },

    _testPath9: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(100, 200));
        path.closed = true;
        
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(130, 100));
        path.add(new paper.Point(130, 170));
        path.add(new paper.Point(170, 170));
        path.add(new paper.Point(170, 100));
        path.closed = false;
    },

    _run: function()
    {
        var d1 = Date.now();
        this._generatePaths();
        this._findAndDrawShapes();
        var d2 = Date.now();
        console.log("Time taken: " + (d2 - d1) + "ms");
    },

    _findAndDrawShapes: function()
    {
        //console.log(this);
        var links = this.nodesBuilder.buildNodes(this.pathsLayer.children)
        var shapes = this.shapesFinder.findShapes(links);
        this._drawShapes(shapes);
        //this._drawLinksLabels(links);
        console.log("Number of shapes: " + shapes.length);
    },


    _initFrame: function()
    {
        this._initPathsLayer();
        this.frame = new paper.Path.Rectangle(
            this.frameTL = new paper.Point(this.frameMargin, this.frameMargin),
            this.frameBR = new paper.Point(this.sceneWidth - this.frameMargin,
                                           this.sceneHeight - this.frameMargin)
        );
        //this.frame.strokeColor = "red";
    },

    _drawLinksLabels: function(links)
    {
        if (this.textsLayer == null)
        {
            this.textsLayer = new paper.Layer(); 
        }
        else
        {
            this.textsLayer.removeChildren();
        }
        this.textsLayer.activate();
        
        var link;
        var i = links.length;
        while(--i >= 0)
        {
            link = links[i];
            if (!link) continue;
            var text = new paper.PointText(link.node2.point.add(link.node1.point.subtract(link.node2.point).divide(2)));
            text.justification = 'center';
            text.fillColor = 'black';
            text.content = i;

            var text = new paper.PointText(link.node1.point);
            text.justification = 'center';
            text.fillColor = 'black';
            text.content = link.node1.index;
        }
    },

    _drawShapes: function(shapes)
    {
        if (this.shapesLayer == null)
        {
            this.shapesLayer = new paper.Layer();
            this.shapesLayer.sendToBack(); 
        }
        else
        {
            this.shapesLayer.removeChildren();
        }
        this.shapesLayer.activate();

        //var conf = this._confShapeColored();
        var conf = this._confShapeCircles()

        var i = shapes.length;
        var shape;
        while(--i >= 0)
        {
            if (this._drawShapeFirstPass(shapes[i], conf))
            {
                shapes.splice(i, 1);
            }
        }
        i = shapes.length;
        while (--i >= 0)
        {
            this._drawShapeSecondPass(shapes[i], conf);
        }
    },

    _drawShape: function(shape)
    {
        var nodes = shape.nodes;
        var path = new paper.Path();

        path.closed = true;
        var j = nodes.length;
        while(--j >= 0)
        {
            path.add(nodes[j].point);
        }
        return path;
    },

    _drawShapeFirstPass: function(shape, conf) { return true; },
    _drawShapeSecondPass: function(shape, conf) {},

    _confShapeColored: function()
    {
        this._drawShapeFirstPass = this._drawShapeColored;
        return {
            colors: this._getShapeColors(),
        };
    },

    _getShapeColors: function()
    {
        var colors = new Array();
        for (var j = 0; j < 5; j++)
        {
            colors[j] = new paper.Color(j % 5 / 7, (j + 1) % 5 / 6, (j + 3) % 5 / 9);
        }
        return colors;
    },

    _drawShapeColored: function(shape, conf)
    {
        var path = this._drawShape(shape);
        var colors = conf.colors;
        if (shape.adjacentShapes && shape.adjacentShapes.length)
        {
            colorsLoop: for (var j = 0; j < colors.length; j++)
            {
                for (var k = 0; k < shape.adjacentShapes.length; k++)
                {
                    if (shape.adjacentShapes[k].color == colors[j])
                    {
                        continue colorsLoop;
                    }
                }
                shape.color = colors[j];
            }
        }
        if (!shape.color)
        {
            shape.color = colors[Math.floor(Math.random() * colors.length)];
        }
        path.fillColor = shape.color;

        // We don't want a second pass.
        return true;
    },


    _confShapeCircles: function()
    {
        this._drawShapeFirstPass  = this._drawShapeCirclesFirstPass;
        this._drawShapeSecondPass = this._drawShapeCirclesSecondPass;
        return this._getCirclesConf();
    },

    _getCirclesConf: function()
    {
        return {
            darkColor:  '#000000',
            lightColor: '#FFFFFF',
            sizeFactor: 1,
            maxSizeForLite: 200,
            minSizeForDark: 500,
        };
    },

    _drawShapeCirclesFirstPass: function(shape, conf)
    {
        var path = this._drawShape(shape);
        var size = this._getPathSizeForCircles(path, conf);

        var color = null;
        if (size < conf.maxSizeForLite && shape.nodes.length < 4)
        {
            color = conf.lightColor;
        }
        else if (size > conf.minSizeForDark)
        {
            color = conf.darkColor;
        }

        if (color && shape.adjacentShapes && shape.adjacentShapes.length)
        {
            for (var k = 0; k < shape.adjacentShapes.length; k++)
            {
                if (shape.adjacentShapes[k].color == color)
                {
                    color = null;
                    break;
                }
            }
            shape.color = color;
        }

        if (color)
        {
            path.fillColor = color;

            // We don't want a second pass for this shape (plain color).
            return true;
        }
        else
        {
            shape.path = path;

            // We want a second pass for this shape (stripes).
            return false;
        }
    },
    
    _drawShapeCirclesSecondPass: function(shape, conf)
    {
        var path = shape.path;
        // shape.path should always have been defined from first pass.
        if (!path)
        {
            return;
        }

        var bounds = path.bounds;
        var size = this._getPathSizeForCircles(path, conf);

        var center = this._getCenterForCircles(shape, conf);
        if (!center)
        {
            center = bounds.center.add(
                 bounds.topLeft.subtract(bounds.center)
                .rotate(Math.random() * 360)
                .multiply(1 + Math.random() * 0.25)
            );
        }

        var radius = 0;
        var pos = [bounds.topLeft, bounds.topRight, bounds.bottomLeft, bounds.bottomRight];
        for (var i in pos)
        {
            radius = Math.max(radius, center.getDistance(pos[i]));
        }

        // bigger areas are darker (get bigger black strips and smaller
        // white strips).
        var darknessFactor = Math.min(size / conf.minSizeForDark, 1);
        var darkStripsWidth = (5 + Math.random() * 25 * darknessFactor) * conf.sizeFactor;
        var lightStripsWidth = (1 + Math.random() * 10 * (1 - darknessFactor * 0.75)) * conf.sizeFactor;

        var circles = new paper.Group(); 

        var i = 0;
        var j = 0;
        var stripWidth;
        do {
            i += (stripWidth = (++j % 2 ? darkStripsWidth : lightStripsWidth));
            new paper.Path.Circle({
                center: center,
                radius: i,
                fillColor: j % 2 ? conf.darkColor : conf.lightColor,
                parent: circles,
            }).sendToBack();
        } while (i < radius);

        (new paper.Group(path, circles)).clipped = true;
    },

    _getPathSizeForCircles: function(path, conf)
    {
        var bounds = path.bounds;
        return (bounds.width + bounds.height) / conf.sizeFactor;
    },

    _getCenterForCircles_bk: function(shape, conf)
    {
        var shapesA, shapeA, shapesB, shapeB;
        if ((shapesA = shape.adjacentShapes) && shapesA.length)
        {
            for (var i = 0; i < shapesA.length; i++)
            {
                if ((shapesB = (shapeA = shapesA[i]).adjacentShapes).length > 1)
                {
                    for (var j = 0; j < shapesB.length; j++)
                    {
                        if ((shapeB = shapesB[j]) != shapeA && shapeB.color == conf.lightColor)
                        {
                            return shapeB.nodes[Math.floor(Math.random() * shapeB.nodes.length)].point;
                        }
                    }
                }
            }
        }
    },

    _getCenterForCircles: function(shape, conf)
    {
        var adjacentShapes, adjacentShape, center;
        if ((adjacentShapes = shape.adjacentShapes) && adjacentShapes.length)
        {
            var nodes = shape.nodes;
            var adjacentShapeNodes;
            for (var i = 0; i < adjacentShapes.length; i++)
            {
                if ((adjacentShape = adjacentShapes[i]).color == conf.lightColor)
                {
                    adjacentShapeNodes = adjacentShape.nodes;
                    for (var j = 0; j < adjacentShapeNodes.length; j++)
                    {
                        if (-1 == nodes.indexOf(adjacentShapeNodes[j]))
                        {
                            center = adjacentShapeNodes[j].point;
                            break;
                        }
                    }
                }
            }
        }
        return center;
    },

    onMouseDown: function(event)
    {
        /*var mousePoint = event.point.clone();
        this.constrainMousePoint(mousePoint);
        this.path.add(mousePoint);
        paper.view.draw();*/

        this._run();
    },

    constrainMousePoint: function(mousePoint)
    {
       this.constrainPointToRect(mousePoint, this.frameTL, this.frameBR); 
    },

    constrainPointToRect: function(point, rectTL, rectBR)
    {
        point.x = this.constrain(point.x, rectTL.x, rectBR.x);
        point.y = this.constrain(point.y, rectTL.y, rectBR.y);
    },

    constrain: function(x, min, max)
    {
        return x < min ? min : (x > max ? max : x);
    },
});
