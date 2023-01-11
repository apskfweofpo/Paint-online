import {makeAutoObservable} from "mobx";

class canvasState{

    canvas = null
    socket = null
    sessionid = null
    undoList = []
    redoList = []
    username = ""
    constructor() {
        makeAutoObservable(this)
    }

    setCanvas(canvas) {
        this.canvas = canvas
    }

    setSessionId(session) {
        this.sessionid = session
    }


    setSocket(socket) {
        this.socket = socket
    }
    setUsername(username) {
        this.username = username
    }

    pushToUndo (data){
        this.undoList.push(data)
    }
    pushToRedo (data){
        this.redoList.push(data)
    }

    undo(){
        let ctx = this.canvas.getContext('2d')
        if(this.undoList.length > 0){
            let dataUrl = this.undoList.pop()
            this.redoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl
            img.onload = () => {
                ctx.clearRect(0,0, this.canvas.width, this.canvas.height )
                ctx.drawImage(img,0,0, this.canvas.width, this.canvas.height )
            }
        } else {
            ctx.clearRect(0,0, this.canvas.width, this.canvas.height )

        }
    }
    redo() {
        let ctx = this.canvas.getContext('2d')
        if(this.undoList.length > 0){
            let dataUrl = this.redoList.pop()
            this.undoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl
            img.onload = () => {
                ctx.clearRect(0,0, this.canvas.width, this.canvas.height )
                ctx.drawImage(img,0,0, this.canvas.width, this.canvas.height )
            }
        } else {
            ctx.clearRect(0,0, this.canvas.width, this.canvas.height )

        }

    }
}


export default new canvasState()