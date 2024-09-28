/**
 *
 * @param canvas > canvas element
 * @returns > 2d context of canvas element
 */

export function setBgColor(context) {
  if (context) {
    context.canvas.style = "background-color: white";
  }
}

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
 * @description > uses the context from canvas element to create a rectangle
 * filled with user color placed at the current cursor location relative
 * to the canvas scale and position on screen. Rectangle size is 5x5.
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
