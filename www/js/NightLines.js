var NightLines = paper.Base.extend({
    _class: "NighLines",

    path: null,
    paths: null,
    canvas: null,
    
    shapesLayer: null,
    textsLayer:  null,

    nodesBuilder: null,
    shapesFinder: null,

    sceneWidth: 600,
    sceneHeight: 600,

    frame: null,
    frameTL: null,
    frameBR: null,
    frameMargin: 20,

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
        
        this._run();
        
        this._initMouseEvents();

        paper.view.draw();
    },

    _initMouseEvents: function()
    {
        var app = this;
        paper.view.onMouseDown = function(event) {
            app.onMouseDown(event);
        }
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

    _run: function()
    {
        //console.log(this);
        var links = this.nodesBuilder.buildNodes(this.paths)
        var shapes = this.shapesFinder.findShapes(links);
        //this._drawLinks(links);
        this._drawShapes(shapes);
    },


    _initFrame: function()
    {
        this.frame = new paper.Path.Rectangle(
            this.frameTL = new paper.Point(this.frameMargin, this.frameMargin),
            this.frameBR = new paper.Point(this.sceneWidth - this.frameMargin,
                                           this.sceneHeight - this.frameMargin)
        );
        this.frame.strokeColor = 'black';
        this.paths.push(this.frame);
    },

    _drawLinks: function(links)
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
        }
        else
        {
            this.shapesLayer.removeChildren();
        }
        this.shapesLayer.activate();

        var i = shapes.length;
        while(--i >= 0)
        {
            var nodes = shapes[i];
            var path = new paper.Path();
            path.fillColor = new paper.Color(i % 5 * 0.2, (i) % 3 * 0.3, (i + 3) % 5 * 0.2, 0.5);
            path.closed = true;
            var j = nodes.length;
            while(--j >= 0)
            {
                path.add(nodes[j].point);
            }
        }
    },

    onMouseDown: function(event)
    {
        var mousePoint = event.point.clone();
        this.constrainMousePoint(mousePoint);
        this.path.add(mousePoint);
        paper.view.draw();

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
