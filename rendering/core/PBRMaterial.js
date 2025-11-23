export class PBRMaterial {
    albedo;
    metallic;
    roughness;
    ao;

    constructor(albedo, metallic, roughness, ao) {
        this.albedo = albedo;
        this.metallic = metallic;
        this.roughness = roughness;
        this.ao = ao;
    }
}