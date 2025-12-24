import React, { useEffect, useRef } from 'react';

export const GridWarpEffect = () => {
    const canvasRef = useRef(null);
    const mousePos = useRef({ x: -1000, y: -1000 });
    const animationFrameId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;

        const resizeCanvas = () => {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const handleMouseMove = (e) => {
            const rect = parent.getBoundingClientRect();
            mousePos.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseLeave = () => {
            mousePos.current = { x: -1000, y: -1000 };
        };

        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseleave', handleMouseLeave);

        const gridSize = 40;
        const warpRadius = 200;
        const warpStrength = 25;

        const drawWarpedGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { x: mx, y: my } = mousePos.current;
            const isMouseInside = mx >= 0 && my >= 0 && mx <= canvas.width && my <= canvas.height;

            if (!isMouseInside) {
                animationFrameId.current = requestAnimationFrame(drawWarpedGrid);
                return;
            }

            ctx.lineWidth = 1;

            // Draw vertical lines with warping and smooth opacity
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                let lastAlpha = 0;

                for (let y = 0; y <= canvas.height; y += 1) {
                    const dx = x - mx;
                    const dy = y - my;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    let offsetX = x;
                    let offsetY = y;
                    let alpha = 0;

                    if (distance < warpRadius && distance > 0) {
                        // Create gravitational lensing effect
                        const normalizedDist = distance / warpRadius;
                        const warpFactor = Math.pow(1 - normalizedDist, 2) * warpStrength;
                        const angle = Math.atan2(dy, dx);

                        // Push lines away from center
                        offsetX += Math.cos(angle) * warpFactor;
                        offsetY += Math.sin(angle) * warpFactor;

                        // Smooth opacity falloff - stronger near center, fades at edges
                        alpha = Math.pow(1 - normalizedDist, 1.2) * 1.2; // Boosted for more visibility

                        // Add glowing shadow for melting effect
                        ctx.shadowBlur = 8 * (1 - normalizedDist);
                        ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.6})`;
                        ctx.lineWidth = 1.5;

                        // Update stroke style when alpha changes significantly
                        if (Math.abs(alpha - lastAlpha) > 0.05) {
                            if (lastAlpha > 0) ctx.stroke();
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                            ctx.moveTo(offsetX, offsetY);
                            lastAlpha = alpha;
                        } else {
                            ctx.lineTo(offsetX, offsetY);
                        }
                    }
                }
                if (lastAlpha > 0) ctx.stroke();
            }

            // Draw horizontal lines with warping and smooth opacity
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                let lastAlpha = 0;

                for (let x = 0; x <= canvas.width; x += 1) {
                    const dx = x - mx;
                    const dy = y - my;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    let offsetX = x;
                    let offsetY = y;
                    let alpha = 0;

                    if (distance < warpRadius && distance > 0) {
                        const normalizedDist = distance / warpRadius;
                        const warpFactor = Math.pow(1 - normalizedDist, 2) * warpStrength;
                        const angle = Math.atan2(dy, dx);

                        offsetX += Math.cos(angle) * warpFactor;
                        offsetY += Math.sin(angle) * warpFactor;

                        // Smooth opacity falloff
                        alpha = Math.pow(1 - normalizedDist, 1.2) * 1.2; // Boosted for more visibility

                        // Add glowing shadow for melting effect
                        ctx.shadowBlur = 8 * (1 - normalizedDist);
                        ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.6})`;
                        ctx.lineWidth = 1.5;

                        // Update stroke style when alpha changes significantly
                        if (Math.abs(alpha - lastAlpha) > 0.05) {
                            if (lastAlpha > 0) ctx.stroke();
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                            ctx.moveTo(offsetX, offsetY);
                            lastAlpha = alpha;
                        } else {
                            ctx.lineTo(offsetX, offsetY);
                        }
                    }
                }
                if (lastAlpha > 0) ctx.stroke();
            }

            animationFrameId.current = requestAnimationFrame(drawWarpedGrid);
        };

        drawWarpedGrid();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            parent.removeEventListener('mousemove', handleMouseMove);
            parent.removeEventListener('mouseleave', handleMouseLeave);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
};
