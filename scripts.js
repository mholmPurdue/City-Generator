var PRIMARY_ROADS = 3;
var PRIMARY_THICKNESS = 6;
var SECONDARY_THICKNESS = 3;
var TERTIARY_THICKNESS = 1;
var STEP_SIZE = 10;
var TLtoBR = 1;
var TtoB = 2;
var TRtoBL = 3;
var LtoR = 4;



var c = document.getElementById('citygen');
var ctx = c.getContext('2d');
var windowWidth = c.scrollWidth;
var windowHeight = c.scrollHeight + 110;
c.setAttribute('width', windowWidth);
c.setAttribute('height', windowHeight);
var chunkWidth = windowWidth / 3;
var chunkHeight = windowHeight / 3;


console.log(windowWidth + " " + windowHeight);


var primaryRoads = [];
var secondaryRoads = [];
var tertiaryRoads = [];

function getLength(a, b){
	return Math.sqrt(Math.pow(a.x - b.x, 2) - Math.pow(a.y - b.y, 2))
}

function getMidpoint(a, b){
	return new Coord((a.x + b.x)/2, (a.y + b.y)/2);
}

function getPointsAlongRoad(road, size) {
	var list = [];
	var rawSize = road.length / size;
	var size = Math.floor(rawSize);
	for(var i = 0; i < size; i++){
		var sx, sy, ex, ey, ix, iy;
		sx = road.start.x;
		sy = road.start.y;
		ex = road.end.x;
		ey = road.end.y;
		ix = (sx - ex) / rawSize;
		iy = (sy - ey) / rawSize;
		list.push(new Coord(sx - ix * i, sy - iy * i));
	}
	return list;
}

function Coord(x, y){
	this.x = x;
	this.y = y;
	this.print = "(" + this.x + ", " + this.y + ")";
}

function Road(s, e, dir) {
  this.start = s;
  this.end = e;
  this.length = getLength(this.start, this.end);
  this.middle = getMidpoint(this.start, this.end);
  this.print = this.start.print + " -- " + this.end.print;
  this.direction = dir;
}

function generatePrimaryRoads(){
	for(var i = 0; i < PRIMARY_ROADS; i++){
		//generate a random point in the quadrant 1,2,3,4
		var quad = Math.ceil(Math.random() * 2) * 2 - 1;
		var start;
		var end;

		switch(quad){
		//if 1, pick corresponding point in 9
			case TLtoBR:
				console.log("tltobr")
				start = new Coord(Math.floor(Math.random() * chunkWidth / STEP_SIZE),
								  Math.floor(Math.random() * chunkHeight));
				end = new Coord(start.x + chunkWidth * 2, start.y + chunkHeight * 2);
				break;
		//if 2, pick point in 8
			case TtoB:
				console.log("ttob")
				start = new Coord(Math.floor(Math.random() * chunkWidth + chunkWidth),
								  Math.floor(Math.random() * chunkHeight));
				end = new Coord(start.x, start.y + chunkHeight * 2);
				break;
		//if 3, pick point in 7
			case TRtoBL:
				console.log("trtobl")
				start = new Coord(Math.floor(Math.random() * chunkWidth + chunkWidth * 2),
								  Math.floor(Math.random() * chunkHeight));
				end = new Coord(start.x - chunkWidth * 2, start.y + chunkHeight * 2);
				break;
		//if 4, pick point in 6
			case LtoR:
				console.log("ltor")
				start = new Coord(Math.floor(Math.random() * chunkWidth),
								  Math.floor(Math.random() * chunkHeight + chunkHeight));
				end = new Coord(start.x + chunkWidth * 2 + chunkWidth, start.y);
				break;
		}



		primaryRoads.push(new Road(new Coord(start.x, start.y), new Coord(end.x, end.y), quad))
	}
	console.log("Primary generated")
}

function generateChildRoads(parents, childList, step) {
	$.each(parents, function(count, road){
		$.each(getPointsAlongRoad(road, step), function(num, start){
			dir = (road.direction + 2) % 4;
			var end1, end2;
			var rand = Math.random();
			switch(dir){
				case TLtoBR:
					end1 = new Coord(start.x - chunkWidth * rand, start.y - chunkHeight * rand);
					end2 = new Coord(start.x + chunkWidth * rand, start.y + chunkHeight * rand);
					break;
				// case TtoB:
				// 	end1 = new Coord(start.x, start.y - chunkHeight * rand);
				// 	end2 = new Coord(start.x, start.y + chunkHeight * rand);
				// 	break;
				case TRtoBL:
					end1 = new Coord(start.x + chunkWidth * rand, start.y - chunkHeight * rand);
					end2 = new Coord(start.x - chunkWidth * rand, start.y + chunkHeight * rand);
					break;
				// case LtoR:
				// 	end1 = new Coord(start.x - chunkWidth * rand, start.y);
				// 	end2 = new Coord(start.x + chunkWidth * rand, start.y);
				// 	break;
			}
			childList.push(new Road(start, end1 ,dir))
			childList.push(new Road(start, end2 ,dir))
		})
    })
	console.log("Child set generated")

}

function drawPrimaryRoads() {
	var path=new Path2D();
	ctx.strokeStyle = '#008DF9';
    $.each(primaryRoads, function(count, road){
    	ctx.beginPath();
    	ctx.lineWidth = 5;
    	path.moveTo(road.start.x, road.start.y);
    	path.lineTo(road.end.x, road.end.y);
    	ctx.stroke(path);
    })
}

function drawChildRoads(roadList, thickness) {
	var path=new Path2D();
	ctx.strokeStyle = '#FFFFFF';
	$.each(roadList, function(count, road){
    	ctx.beginPath();
    	ctx.lineWidth = thickness;
    	path.moveTo(road.start.x, road.start.y);
    	path.lineTo(road.end.x, road.end.y);
    	ctx.stroke(path);
    })
}





generatePrimaryRoads();
generateChildRoads(primaryRoads, secondaryRoads, STEP_SIZE * 10);
generateChildRoads(secondaryRoads, tertiaryRoads, STEP_SIZE * 2);

drawChildRoads(secondaryRoads, SECONDARY_THICKNESS);
drawChildRoads(tertiaryRoads, TERTIARY_THICKNESS);
drawPrimaryRoads();