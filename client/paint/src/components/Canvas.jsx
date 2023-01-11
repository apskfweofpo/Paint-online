import React, {useEffect, useRef, useState} from 'react';
import "../styles/canvas.scss"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";

const Canvas = observer(() => {

    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        toolState.setTool(new Brush(canvasRef.current))
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://localhost:5000/`)
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                console.log(msg)
            }
        }

    }, [canvasState.username])


    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {
            }}>
                <Modal.Header>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectionHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => {
                mouseDownHandler()
            }} ref={canvasRef} width={600} height={400}>

            </canvas>

        </div>
    );
});

export default Canvas;