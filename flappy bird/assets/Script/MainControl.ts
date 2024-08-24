import { _decorator, Component, instantiate, Node, Prefab, Sprite, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainControl')
export class MainControl extends Component {

    @property(Sprite)
    spBg: Sprite[] = [null, null];

    @property(Prefab)
    pipePrefab: Prefab = null;

    pipe: Node[] = [null, null, null];
    minY = -120;
    maxY = 120;

    randomY() {
        return Math.random() * (this.maxY - this.minY);
    }

    start() {
        for(let i = 0;i < this.pipe.length;i++) {
            this.pipe[i] = instantiate(this.pipePrefab)
            this.node.addChild(this.pipe[i])
            const x = 170 + 200 * i;
            const y = this.minY + this.randomY();
            this.pipe[i].setPosition(new Vec3(x ,y, 0))
        }
    }

    update(deltaTime: number) {
        for(let i = 0;i < this.spBg.length;i++) {
            let x = this.spBg[i].node.getPosition().x
            if (x <= -288) x = 288
            this.spBg[i].node.setPosition(new Vec3(x - 1, 0, 0))
        }
        for(let i = 0;i < this.pipe.length;i++) {
            const position = this.pipe[i].getPosition()
            let x = position.x - 1
            let y = position.y
            if (x <= -170) {
                x = 430;
                y = this.minY + this.randomY();
            }
            this.pipe[i].setPosition(new Vec3(x, y, 0))
        }
    }
}


