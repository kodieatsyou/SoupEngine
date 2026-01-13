import {Vector3, getPointsBetweenVector3, getPointsInsideTriangle} from './geometry.js';
import {World} from './world.js';

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

//A Pixel contains an x and y coordinate char and a color
class Pixel {
    constructor(x, y, character = ' ', color = "black") {
        this.x = x;
        this.y = y;
        this.character = character;
        color = color.toLowerCase();
        color = color.trim();
        if(color != "black" && color != "white" && color != "red" && 
        color != "yellow" && color != "green" && color != "blue" && 
        color != "magenta" && color != "cyan" && color != "gray") {
            color = "black"
        }
        this.color = color;
    }


    setPixelColor(color) {
        color = color.toLowerCase();
        color = color.trim();
        if(
            color != "black" && color != "red" && color != "green" && 
            color != "brown" && color != "blue" && color != "purple" &&  
            color != "cyan" && color != "lgray" && color != "dgray" && 
            color != "lred" && color != "lgreen" && color != "yellow" && 
            color != "lblue" && color != "lpurple" && color != "lcyan" && 
            color != "white"
        ) {
            color = "black"
        }
        this.color = color;
    }

    setPixelChar(newChar) {
        this.character = newChar;
    }

    clearPixel() {
        this.color = "black"
        this.character = '.'
    }

    toLiteralString() {
        //return "(" + this.x + "," + this.y + "): " + this.character + "(" + this.color + ")";
        return "(" + this.x + "," + this.y + ")";
    }

    toString() {
        switch(this.color) {
            case "black":
                return '\x1B[30m' + this.character
            case "red":
                return '\x1B[31m' + this.character
            case "green":
                return '\x1B[32m' + this.character
            case "brown":
                return '\x1B[33m' + this.character
            case "blue":
                return '\x1B[34m' + this.character
            case "purple":
                return '\x1B[35m' + this.character
            case "cyan":
                return '\x1B[36m' + this.character
            case "lgray":
                return '\x1B[37m' + this.character
            case "dgray":
                return '\x1B[1;30m' + this.character
            case "lred":
                return '\x1B[1;31m' + this.character
            case "lgreen":
                return '\x1B[1;32m' + this.character
            case "yellow":
                return '\x1B[1;33m' + this.character
            case "lblue":
                return '\x1B[1;34m' + this.character
            case "lpurple":
                return '\x1B[1;35m' + this.character
            case "lcyan":
                return '\x1B[1;36m' + this.character
            case "white":
                return '\x1B[1;37m' + this.character
            default:
                return '\x1B[30m' + this.character
        }
    }
}

class Screen {

    constructor(name) {
        this.name = name;
        this.width = process.stdout.columns
        this.height = process.stdout.rows - 4
        this.windowHeight = process.stdout.rows
        this.windowWidth = process.stdout.columns
        this.pixels = []
        this.makePixels();
    }

    update() {
        if(this.windowHeight != process.stdout.rows) {
            this.windowHeight = process.stdout.rows;
            this.height = process.stdout.rows - 4;
            this.pixels = [];
            this.makePixels();
        }
        if(this.windowWidth != process.stdout.columns) {
            this.windowWidth = process.stdout.columns;
            this.width = process.stdout.columns;
            this.pixels = [];
            this.makePixels();
        }
        this.needToRedraw = true;
    }

    finishUpdate() {
        this.needToRedraw = false;
    }

    makePixels() {
        for (let i = 0; i < this.height; i++) {
            this.pixels[i] = [];
            for (let j = 0; j < this.width; j++) {
              this.pixels[i][j] = new Pixel(j, i, '.', 'black');
            }
        }
    }

    wipeScreen() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
              this.pixels[i][j].clearPixel();
            }
        }
    }

    toString() {
        let frame = ""
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                frame += this.pixels[y][x].toString()
            }
            frame += '\n'
        }
        frame += '\n'
        return frame
    }

    draw(world) {
        console.clear()
        this.wipeScreen();
        world.objects.forEach(object => {
            this.drawMesh(object, 'X', false);
        });
        console.log(this.toString());
    }

    printLiteralPixel() {
        console.log("SCREEN SIZE:" + this.width + "x" + this.height)
        let frame = ""
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                frame += this.pixels[y][x].toLiteralString()
            }
        }
        frame += '\n'
        return frame
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setPixel(x, y, color, char = ' ') {
        x = Math.round(this.width / 2) + Math.round(x);
        y = Math.round(this.height / 2) + Math.round(y);
        if(x > this.width - 1 || x < 0) {
            return;
        }
        if(y > this.height - 1 || y < 0) {
            return;
        }
        this.pixels[y][x].setPixelColor(color);
        this.pixels[y][x].setPixelChar(char);
        this.update();
    }

    drawLine(start, end, color, char) {
        let points = getPointsBetweenVector3(start, end);
        points.forEach(point => {
            this.setPixel(point.x, point.y, color, char);
        });
    }

    drawTriangle(triangle, color, char, isFilled) {
        if(isFilled) {
            let points = getPointsInsideTriangle(triangle.v1, triangle.v2, triangle.v3);
            points.forEach(point => {
                this.setPixel(point.x, point.y, color, char);
            });
        } else {
            this.drawLine(triangle.v1, triangle.v2, color, char);
            this.drawLine(triangle.v2, triangle.v3, color, char);
            this.drawLine(triangle.v3, triangle.v1, color, char);
        }
    }

    drawMesh(mesh, char, fill) {
        mesh.triangles.forEach(t => {
            this.drawTriangle(t, t.color, char, fill);
        });
    }
    
}

export {Pixel, Screen}
