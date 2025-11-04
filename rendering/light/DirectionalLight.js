import { Light } from "./Light.js";

export class DirectionalLight extends Light{
    direction;

    constructor(lightColor, ambientIntensity, diffuseIntensity, direction){
        super(lightColor, ambientIntensity, diffuseIntensity);
        this.direction = direction;
    }
}