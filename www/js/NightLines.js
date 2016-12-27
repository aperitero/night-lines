var NightLines = paper.Base.extend({
    _class: "NighLines",

    path: null,
    paths: null,
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

        this.paths = [];

        this.canvas = document.getElementById("myCanvas");
        this.canvas.width = this.sceneWidth;
        this.canvas.height = this.sceneHeight;

        paper.setup("myCanvas");

        this._initFrame();
        
        this.path = new paper.Path();
        this.path.strokeColor = 'black';
        
        this.paths.push(this.path);
        
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

    _generatePaths: function()
    {
        // Remove all paths except the frame.
        this.paths.splice(1);

        var nMinSources = 5;
        var nMaxSources = 8;

        var nMinSegmentsPerSource = 5;
        var nMaxSegmentsPerSource = 10;

        var nSources = this.randomIntBetween(nMinSources, nMaxSources);
        //console.log("nSources: " + nSources);

        var sourceCounter = nSources;
        while (--sourceCounter >= 0)
        {
            var point = this.randomPointOnFrame(0, 0, this.sceneWidth, this.sceneHeight);

		    var path = new paper.Path();
		    path.strokeColor = 'black';
            path.visible = false;
            path.moveTo(point);

            var nSegments = this.randomIntBetween(nMinSegmentsPerSource, nMaxSegmentsPerSource);
            
            var segmentCounter = nSegments;
            while (--segmentCounter >= 1)
            {
                point.x = this.randomIntBetween(this.frameMargin * 2, this.sceneWidth - this.frameMargin * 2);
                point.y = this.randomIntBetween(this.frameMargin * 2, this.sceneHeight - this.frameMargin * 2);
                path.lineTo(point);
            }
            path.lineTo(this.randomPointOnFrame(0, 0, this.sceneWidth, this.sceneHeight));
            this.paths.push(path);
        }
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
        this.paths.push(path);
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
        this.paths.push(path);
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
        this.paths.push(path);
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
        this.paths.push(path);
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
        this.paths.push(path);
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
        this.paths.push(path);
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
        this.paths.push(path);
        
        path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(130, 130));
        path.add(new paper.Point(160, 140));
        path.closed = false;
        this.paths.push(path);
    },

    _testPath8: function()
    {
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(220, 230));
        path.add(new paper.Point(240, 240));
        path.closed = false;
        this.paths.push(path);
        
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(100, 100));
        path.add(new paper.Point(200, 100));
        path.add(new paper.Point(200, 200));
        path.add(new paper.Point(100, 200));
        path.closed = true;
        this.paths.push(path);
        
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(240, 240));
        path.add(new paper.Point(300, 240));
        path.add(new paper.Point(300, 300));
        path.add(new paper.Point(240, 300));
        path.closed = true;
        this.paths.push(path);
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
        this.paths.push(path);
        
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.add(new paper.Point(130, 100));
        path.add(new paper.Point(130, 170));
        path.add(new paper.Point(170, 170));
        path.add(new paper.Point(170, 100));
        path.closed = false;
        this.paths.push(path);
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
        var links = this.nodesBuilder.buildNodes(this.paths)
        var shapes = this.shapesFinder.findShapes(links);
        this._drawShapes(shapes);
        //this._drawLinksLabels(links);
        console.log("Number of shapes: " + shapes.length);
    },


    _initFrame: function()
    {
        this.frame = new paper.Path.Rectangle(
            this.frameTL = new paper.Point(this.frameMargin, this.frameMargin),
            this.frameBR = new paper.Point(this.sceneWidth - this.frameMargin,
                                           this.sceneHeight - this.frameMargin)
        );
        this.paths.push(this.frame);
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

        var i = shapes.length;
        var shape;
        while(--i >= 0)
        {
            shape = shapes[i];
            var nodes = shape.nodes;
            var path = new paper.Path();

            path.closed = true;
            var j = nodes.length;
            while(--j >= 0)
            {
                path.add(nodes[j].point);
            }

            this._fillShapeCircles(shape, path);
        }
    },

    _fillShapeColored: function(shape, path)
    {
        var colors = this._getShapeColors();
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
    },

    _getShapeColors: function()
    {
        if (!this._shapeColors)
        {
            this._shapeColors = new Array();
            for (var j = 0; j < 5; j++)
            {
                this._shapeColors[j] = new paper.Color(j % 5 / 5, (j + 1) % 5 / 5, (j + 3) % 5 / 5);
            }
        }
        return this._shapeColors;
    },

    _fillShapeCircles: function(shape, path)
    {
        var darkColor = '#440618';
        var liteColor = '#11968d';

        var bounds = path.bounds;
        var radius;

        var size = bounds.width + bounds.height;

        var sizeFactor = 1;

        var maxSize = 500 * sizeFactor;
        var minSize = 80 * sizeFactor;
        
        var color = null;
        if (size < minSize && shape.nodes.length == 3)
        {
            color = liteColor;
        }
        else if (size > maxSize)
        {
            color = darkColor;
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
        }
        else
        {

            var center = bounds.center.add(
                 bounds.topLeft.subtract(bounds.center)
                .rotate(Math.random() * 360)
                .multiply(1 + Math.random() * 0.25)
            );

            var radius = 0;
            var pos = [bounds.topLeft, bounds.topRight, bounds.bottomLeft, bounds.bottomRight];
            for (var i in pos)
            {
                radius = Math.max(radius, center.getDistance(pos[i]));
            }

            // bigger areas are darker (get bigger black strips and smaller
            // white strips).
            var darknessFactor = Math.min(size / maxSize, 1);
            var blackStripsWidth = (5 + Math.random() * 25 * darknessFactor) * sizeFactor;
            var whiteStripsWidth = (1 + Math.random() * 10 * (1 - darknessFactor)) * sizeFactor;

            var circles = new paper.Group(); 

            var color1 = darkColor; //new paper.Color(Math.random(), Math.random(), Math.random());
            var color2 = liteColor; //new paper.Color(Math.random(), Math.random(), Math.random());

            var i = 0;
            var j = 0;
            var stripWidth;
            do {
                i += (stripWidth = (++j % 2 ? blackStripsWidth : whiteStripsWidth));
                new paper.Path.Circle({
                    center: center,
                    radius: i,
                    fillColor: j % 2 ? color1 : color2,
                    parent: circles,
                }).sendToBack();
            } while (i < radius);

            (new paper.Group(path, circles)).clipped = true;
        }
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
