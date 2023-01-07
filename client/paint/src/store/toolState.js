import {makeAutoObservable} from "mobx";

class ToolState{
    constructor() {
        makeAutoObservable(this)
    }

    setTool(tool) {
        this.tool = tool
    }
}


export default new ToolState()