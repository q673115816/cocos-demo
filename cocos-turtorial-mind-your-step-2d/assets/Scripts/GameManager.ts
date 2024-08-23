import { _decorator, CCInteger, Component, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { BLOCK_SIZE, PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
}

enum BlockType {
    BT_NONE,
    BT_STONE,
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Prefab })
    boxPrefab: Prefab | null = null;
    @property({ type: CCInteger })
    roadLength: number = 50;
    private _road: BlockType[] = [];


    @property({ type: Node })
    startMenu: Node | null = null;
    @property({ type: PlayerController })
    playerCtrl: PlayerController | null = null;
    @property({ type: Label })
    stepsLabel: Label | null = null

    start() {
        this.setCurState(GameState.GS_INIT)
        this.playerCtrl?.node.on('JumpEnd', this.onPlayerJumpEnd, this)
    }

    update(deltaTime: number) {

    }

    init() {
        if (this.startMenu) {
            this.startMenu.active = true;
        }

        this.generateRoad()

        if (this.playerCtrl) {
            this.playerCtrl.setInputActive(false)
            this.playerCtrl.node.setPosition(Vec3.ZERO)
            this.playerCtrl.reset();
        }
    }

    playing() {
        if (this.startMenu) {
            this.startMenu.active = false
        }

        if (this.stepsLabel) {
            this.stepsLabel.string = '0'
        }

        setTimeout(() => {
            if (this.playerCtrl) {
                this.playerCtrl.setInputActive(true)
            }
        }, 0.1)
    }

    spawnBlockByType(type: BlockType) {
        if (!this.boxPrefab) return null

        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE:
                block = instantiate(this.boxPrefab)
                break;

            default:
                break;
        }
        return block;
    }

    generateRoad() {
        this.node.removeAllChildren();

        this._road = []

        this._road.push(BlockType.BT_STONE);

        for (let i = 0; i < this.roadLength; i++) {
            if (this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE)
            } else {
                this._road.push(Math.floor(Math.random() * 2))
            }
        }

        for (let i = 0; i < this._road.length; i++) {
            let block: Node | null = this.spawnBlockByType(this._road[i])
            if (block) {
                this.node.addChild(block)
                block.setPosition(i * BLOCK_SIZE, 0, 0)
            }
        }
    }

    setCurState(value: GameState) {
        switch (value) {
            case GameState.GS_INIT:
                this.init()
                break;
            case GameState.GS_PLAYING:
                this.playing();
                break;
            case GameState.GS_END:
                break;
        }
    }

    onStartButtonClicked() {
        this.setCurState(GameState.GS_PLAYING)
    }

    onPlayerJumpEnd(moveIndex: number) {
        if (this.stepsLabel) {
            this.stepsLabel.string = '' + (moveIndex >= this.roadLength ? this.roadLength : moveIndex)
        }
        this.checkResult(moveIndex)
    }

    checkResult(moveIndex: number) {
        if (moveIndex < this.roadLength) {
            if (this._road[moveIndex] === BlockType.BT_NONE) {
                this.setCurState(GameState.GS_INIT)
            }
        } else {
            this.setCurState(GameState.GS_INIT)
        }
    }
}


