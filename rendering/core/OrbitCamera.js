const {mat2, mat2d, mat3, mat4, vec2, vec3, vec4} = glMatrix;

export class OrbitCamera{
    constructor(at, yaw, pitch, distance, turnspeed){
        this.yaw = yaw; this.pitch = pitch;
        this.distance = distance;
        this.turnspeed = turnspeed;

        this.eye = vec3.create();
        this.at = at;
        this.worldUp = [0.0, 1.0, 0.0];
        this.worldAt = at;

        this.front = [0.0, 0.0, -1.0];
        this.right = vec3.create();
        this.up = vec3.create();

        this.Update();
    }

    GetViewMatrix(){
        let cameramat = mat4.create();
        let at = vec3.create();
        vec3.add(at, this.eye, this.front);
        mat4.lookAt(cameramat, this.eye, at, this.up);
        return cameramat;
    }

    Update(){
        this.front[0] = Math.cos(this.yaw*Math.PI/180.0) * Math.cos(this.pitch*Math.PI/180.0);
        this.front[1] = Math.sin(this.pitch*Math.PI/180.0);
        this.front[2] = Math.sin(this.yaw*Math.PI/180.0) * Math.cos(this.pitch*Math.PI/180.0);
        vec3.normalize(this.front, this.front);

        let back = vec3.create();
        vec3.scale(back, this.front, -this.distance);

        vec3.add(this.eye, this.worldAt, back);

        vec3.cross(this.right, this.front, this.worldUp);
        vec3.normalize(this.right, this.right);

        vec3.cross(this.up, this.right, this.front);
        vec3.normalize(this.up, this.up);
    }
}