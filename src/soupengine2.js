import readline from "readline";
import { Pixel, Screen } from "./screen.js";
import { Triangle, Vector2, Vector3, Matrix44, Mesh, degrees_to_radians } from "./geometry.js";
import { World } from "./world.js";


let myWorld
let myScreen

let tris = [
    new Triangle(
        new Vector3(10, 10, 10),
        new Vector3(-10, -10, 10),
        new Vector3(-10, 10, -10),
        'Yellow'
    ),
    new Triangle(
        new Vector3(10, 10, 10),
        new Vector3(-10, -10, 10),
        new Vector3(10, -10, -10),
        'Red'
    ),
    new Triangle(
        new Vector3(-10, 10, -10),
        new Vector3(10, -10, -10),
        new Vector3(10, 10, 10),
        'Green'
    ),
    new Triangle(
        new Vector3(-10, 10, -10),
        new Vector3(10, -10, -10),
        new Vector3(-10, -10, 10),
        'Blue'
    )
]

let tris2 = [
    new Triangle(
        new Vector3(-10, 10, -10),
        new Vector3(10, -10, -10),
        new Vector3(-10, -10, 10),
        "Blue"
    ),
    new Triangle(
        new Vector3(10, 10, 10),
        new Vector3(-10, -10, 10),
        new Vector3(10, -10, -10),
        "Red"
    ),new Triangle(
        new Vector3(10, 10, 10),
        new Vector3(-10, -10, 10),
        new Vector3(-10, 10, -10),
        "yellow"
    ),
    new Triangle(
        new Vector3(-10, 10, -10),
        new Vector3(10, -10, -10),
        new Vector3(10, 10, 10),
        "Green"
    )
]

let tetrahedron = new Mesh("tetrahedron", tris2)

function SoupEngine2() {
    console.clear()
    process.stdin.setRawMode(true)
    Main()
}

function Main() {
    myWorld = new World("My World")
    myScreen = new Screen("Main")
    myWorld.addObjectToWorld(tetrahedron);

    process.stdin.resume()
    process.stdin.on('data', HandleKeyPress)
    process.on('SIGWINCH', HandleResize)
    console.log('\u001B[?25l')
    myScreen.draw(myWorld)
}

function HandleKeyPress(key) {
    // Handle keypress event
    if (key == '0') {
        console.log('\u001B[?25h')
        console.clear()
        process.exit()
    }
    else if(key == 'd') {
        tetrahedron.rotatePitch(-10);
        myScreen.update()
        myScreen.draw(myWorld)
    }
    else if(key == 'a') {
        tetrahedron.rotatePitch(10)
        myScreen.update()
        myScreen.draw(myWorld)
    }
    else if(key == 'w') {
        tetrahedron.rotateRoll(-10)
        myScreen.update()
        myScreen.draw(myWorld)
    }
    else if(key == 's') {
        tetrahedron.rotateRoll(10)
        myScreen.update()
        myScreen.draw(myWorld)
    }
    else if(key == 'e') {
        tetrahedron.rotateYaw(-10)
        myScreen.update()
        myScreen.draw(myWorld)
    }
    else if(key == 'q') {
        tetrahedron.rotateYaw(10)
        myScreen.update()
        myScreen.draw(myWorld)
    }
}   

function HandleResize() {
    myScreen.update()
}

export {SoupEngine2}