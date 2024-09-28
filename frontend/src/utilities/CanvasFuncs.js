/**
 *
 * @param context > used context from canvas
 * @description > set background color of canvas
 */
export function setBgColor(context) {
  if (context) {
    context.canvas.style = "background-color: white";
  }
}

/**
 *
 * @param context > used context from canvas
 * @param event > eventHandler
 * @param scale > current scale
 * @returns > calculated X and Y cursor position based on canvas size relative to viewport
 */
export function getCursorPosition(context, event, scale) {
  if (context) {
    const rect = context.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left - scale / 2;
    let y = event.clientY - rect.top - scale / 2;
    return { X: x, Y: y };
  }
}

/**
 *
 * @param context > used context from canvas
 * @param event > eventHandler
 * @param scale > current scale
 * @description > uses the context from canvas element to create a rectangle
 * filled with user color placed at the current cursor location relative
 * to the canvas scale and position on screen. .
 */
export function drawRectangle(context, event, scale, color, pixelSize) {
  if (context) {
    context.fillStyle = color;
    context.fillRect(
      parseInt(getCursorPosition(context, event, scale).X),
      parseInt(getCursorPosition(context, event, scale).Y),
      pixelSize * scale,
      pixelSize * scale
    ); // x, y, w, h
    savePixel(
      parseInt(getCursorPosition(context, event, scale).X),
      parseInt(getCursorPosition(context, event, scale).Y),
      color,
      pixelSize
    );
  }
}

/**
 *
 * @param posX > position X of rectangle (pixel)
 * @param posY > position Y of pixel
 * @param color > color of pixel
 * @param size > size of pixel
 */
export function savePixel(posX, posY, color, size) {
  {
    console.log({
      posX: posX,
      posY: posY,
      color: color,
      size: size,
    });
  }
}

/**
 *
 * @param context > used context from canvas
 * @param event > eventHandler
 * @param scale > current scale
 * @returns > new scale
 */
export function zoomCanvas(context, event, scale) {
  if (context) {
    scale += event.deltaY * -0.002;
    scale = Math.min(Math.max(1, scale), 10);
    return scale;
  }
}
