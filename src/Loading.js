import React, { useEffect, useRef } from "react";

const Loading = ({size}) => {
    const canvasRef = useRef(null);
    let angle = 0;
    const originalPoints = [];
    for (let i = 0; i < Math.PI * 2; i += 0.05) {
        originalPoints.push({ x: (size/4) * Math.cos(i), y: (size/4) * Math.sin(i) });
    }

    const rotate = (point, angle) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: cos * point.x + sin * point.y,
            y: - sin * point.x + cos * point.y,
        };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = size;
        canvas.height = size;

        const draw = () => {
            ctx.clearRect(0, 0, size, size);
            ctx.beginPath();
            ctx.lineWidth = 2;

            for (let i = 0; i < originalPoints.length; i++) {
                ctx.beginPath();
                ctx.lineWidth = 10 - i / 12;

                const rotatedPoint = rotate(originalPoints[i], angle);

                if (originalPoints[i + 1]) {
                    const nextRotatedPoint = rotate(originalPoints[i + 1], angle);

                    ctx.moveTo(rotatedPoint.x + size / 2, rotatedPoint.y + size / 2);
                    ctx.lineTo(nextRotatedPoint.x + size / 2, nextRotatedPoint.y + size / 2);
                }

                ctx.strokeStyle = `rgb(1, 101, 132, ${1 - i / 100})`;
                ctx.stroke();

            }
            angle += Math.PI / 20;
            requestAnimationFrame(draw);
        };
        draw();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <canvas ref={canvasRef}/>
            <p className="mb-4 text-gray-700">Creating map, please wait...</p>
        </div>
    );
};

export default Loading;
