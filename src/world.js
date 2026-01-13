import {Mesh} from './geometry.js'

class World {
    constructor(name) {
        this.name = name;
        this.objects = [];
    }

    addObjectToWorld(object) {
        if(!object instanceof Mesh) {
            console.log("Cant add object to \"" + this.name + "\"")
            return;
        }

        this.objects.push(object);
        console.log("Added mesh: " + object.toString())
    }
    
}

export {World}