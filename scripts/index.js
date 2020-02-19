import "../styles/bootstrap.scss";
import kanva from "./kanva";

const container = document.createElement("div");
container.id = "konva";
document.body.appendChild(container);

kanva();
