export class Pixel {
    color: number;
    id: number;
    x: number;
    y: number;
    // goofy looking constructor. This is necessary to specify typing and have all params optional 
    // the = {} is the default lol 
    constructor({color = 0xFFFFFF, id = 0, x = 0, y = 0}: {color?: number, id?: number, x?: number, y?: number} = {}) {
        this.color = color;
        this.id = id;
        this.x = x;
        this.y = y;
    }
}