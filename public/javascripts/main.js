var DOMCanvas
var canvas;
var elements = new Set();

var redraw = function() {
    canvas.clearRect(0, 0, DOMCanvas.width, DOMCanvas.height);
    for (var el of elements) {
        el.draw();
    }
};

var generateLatex = function() {
    var latex = $("#Latex");
    if (latex[0].lastChild){
        latex[0].removeChild(latex[0].lastChild);
    }
    
    console.log("Generating------ ");
    var gen = "";
    gen += "<p>"
    gen += "\\documentclass[12pt]{article}<br>";
    gen += "\\usepackage{tikz}<br>";
    gen += "\\begin{document}<br>";
    gen += "\\begin{center}<br>";
    gen += "\\begin{tikzpicture}[scale=0.4])<br><br>";
    for (var el of elements) {
        gen += el.toLatex() + "<br>";
    }
    gen += "<br>\\end{tikzpicture}\n<br>";
    gen += "\\end{center}\n<br>";
    gen += "\\end{document}<br>";
    latex.append($(gen));
}; 

var Drawable = function(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
};

Drawable.prototype.draw = function() {
    console.log("Drawing an abstract drawable-- Not Great!")
};

Drawable.prototype.toLatex = function() {
    console.log("Latexing an abstract drawable");
};

Drawable.prototype.erase = function() {
    canvas.strokeStyle = "#e8e8e8";
    this.draw();
    canvas.strokeStyle = "#232323";
};

Drawable.prototype.move = function (x, y) {
    this.x = x;
    this.y = y;
    this.draw();
};

Drawable.prototype.contains =  function(x, y){
    console.log("Abstract object!");
};

var childOf = function(child, parent) {
    child.prototype = new parent();
};

var Circle = function(id, x, y, radius) {
    Drawable.call(this, id);
    this.x = x;
    this.y = y;
    this.radius = radius;
};

childOf(Circle, Drawable);

Circle.prototype.draw = function() {
    canvas.beginPath();
    canvas.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    canvas.stroke();
};

Circle.prototype.contains = function(x, y) {
    var diff_x = this.x - x;
    var diff_y = this.y - y;
    return Math.sqrt(Math.pow(diff_x, 2) + Math.pow(diff_y, 2)) < this.radius;
};

Circle.prototype.erase = function() {
    var r = this.radius + 5;
    canvas.clearRect(this.x - r, this.y - r, 2*r, 2*r);
    redraw();
};

Circle.prototype.toLatex = function() {
    return "\\draw [black] (" + this.x/20 + ", -" + this.y/20 + ") circle (1.5);";
};

function canvasPosition(event) {
    var x = event.pageX - canvas.canvas.offsetLeft;
    var y = event.pageY - canvas.canvas.offsetTop;
    return [x, y];
}

(function($){
    $(function() {
        DOMCanvas = document.getElementById("mainCanvas");
        canvas = DOMCanvas.getContext("2d");
        $("#mainCanvas").click(function (e) {
            var coord = canvasPosition(e);
            for (var el of elements) {
               if (el.contains(coord[0], coord[1])){
                   elements.delete(el);
                   redraw();
                   return;
               }
            }
            var c = new Circle((new Date).getTime(), coord[0], coord[1], 30);
            c.draw();
            elements.add(c);
        });

        $("#GenLatexButton").click(function(e) {
            generateLatex();
        });
    });
})(jQuery);

