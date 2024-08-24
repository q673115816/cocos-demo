import { _decorator, Component, Node, input, Input, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export class BirdControl extends Component {

    speed: number = 0;

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    update(deltaTime: number) {
        this.speed -= 0.05;
        const y = this.node.getPosition().y
        const position = new Vec3(0, y + this.speed, 0)
        const rotation = this.node.getRotation()
        this.node.setPosition(position);
        let angle = Math.min(-(this.speed / 2) * 30, 30);
        console.log(angle)
        // this.node.setRotation(new Quat(rotation.x + 1, rotation.y, rotation.z, rotation.w - 1));
    }

    onMouseUp() {
        this.speed = 2;
    }
}


