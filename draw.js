const Drawing = {
  DrawRect(coordinates, context, color = "black") {
    const { topX, topY, botX, botY } = coordinates;
    context.fillStyle = color;
    context.fillRect(topX, topY, botX - topX, botY - topY);
    context.fill();
  }
}