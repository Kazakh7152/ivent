document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-game");
    const gameArea = document.getElementById("game-area");
    const checkButton = document.getElementById("check-wiring");
    const resultText = document.getElementById("result");
    const canvas = document.getElementById("hack-canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = 500;
    canvas.height = 300;
    
    let wires = [
        { start: { x: 100, y: 50 }, end: null, dragging: false },
        { start: { x: 100, y: 150 }, end: null, dragging: false },
        { start: { x: 100, y: 250 }, end: null, dragging: false }
    ];
    
    let endpoints = [
        { x: 400, y: 50 },
        { x: 400, y: 150 },
        { x: 400, y: 250 }
    ];
    
    function drawWires() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#ff0000";
        wires.forEach(wire => {
            ctx.beginPath();
            ctx.arc(wire.start.x, wire.start.y, 15, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.fillStyle = "#00ff00";
        endpoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 4;
        
        wires.forEach(wire => {
            ctx.beginPath();
            ctx.moveTo(wire.start.x, wire.start.y);
            if (wire.end) {
                ctx.lineTo(wire.end.x, wire.end.y);
            }
            ctx.stroke();
        });
    }
    
    let selectedWire = null;
    
    canvas.addEventListener("mousedown", (event) => {
        const { offsetX, offsetY } = event;
        selectedWire = wires.find(wire =>
            Math.abs(wire.start.x - offsetX) < 15 && Math.abs(wire.start.y - offsetY) < 15
        );
        if (selectedWire) {
            selectedWire.dragging = true;
        }
    });
    
    canvas.addEventListener("mousemove", (event) => {
        if (selectedWire && selectedWire.dragging) {
            selectedWire.end = { x: event.offsetX, y: event.offsetY };
            drawWires();
        }
    });
    
    canvas.addEventListener("mouseup", (event) => {
        if (selectedWire) {
            let endpoint = endpoints.find(point =>
                Math.abs(point.x - event.offsetX) < 10 && Math.abs(point.y - event.offsetY) < 10
            );
            if (endpoint) {
                selectedWire.end = { x: endpoint.x, y: endpoint.y };
            } else {
                selectedWire.end = null;
            }
            selectedWire.dragging = false;
            selectedWire = null;
            drawWires();
        }
    });
    
    checkButton.addEventListener("click", (event) => {
        event.preventDefault();
        const correct = wires.every((wire, index) => 
            wire.end && wire.end.x === endpoints[index].x && wire.end.y === endpoints[index].y
        );
        resultText.textContent = correct ? "Дверь открыта! Код: 4592" : "Ошибка соединений!";
    });
    
    startButton.addEventListener("click", (event) => {
        event.preventDefault();
        gameArea.classList.remove("hidden");
        startButton.style.display = "none";
        drawWires();
    });
});