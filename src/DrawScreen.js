"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawScreen = void 0;
const public_api_1 = require("@devvit/public-api");
const colors = [
    "#FFFFFF",
    "#000000",
    "#EB5757",
    "#F2994A",
    "#F2C94C",
    "#27AE60",
    "#2F80ED",
    "#9B51E0"
];
const resolution = 8;
const size = 32;
const blankCanvas = new Array(resolution * resolution).fill(0);
const defaultColor = 1;
const DrawScreen = ({ setPage }) => {
    const [activeColor, setActiveColor] = (0, public_api_1.useState)(defaultColor);
    const [data, setData] = (0, public_api_1.useState)(blankCanvas);
    const ColorSelector = () => (public_api_1.Devvit.createElement("hstack", { width: "100%", alignment: "center" },
        public_api_1.Devvit.createElement("hstack", { border: "thin", grow: false, cornerRadius: "small" }, colors.map((color, index) => (public_api_1.Devvit.createElement("hstack", { height: `${size}px`, width: `${size}px`, backgroundColor: color, onPress: () => setActiveColor(index), alignment: "middle center" }, activeColor === index && (public_api_1.Devvit.createElement("text", { color: index === 1 ? "white" : "black", weight: "bold", size: "xxlarge" }, "\u2713"))))))));
    const pixels = data.map((pixel, index) => (public_api_1.Devvit.createElement("hstack", { onPress: () => {
            const newData = data;
            newData[index] = activeColor;
            setData(newData);
        }, height: `${size}px`, width: `${size}px`, backgroundColor: colors[pixel] })));
    const gridSize = `${resolution * size}px`;
    function splitArray(array, segmentLength) {
        const result = [];
        for (let i = 0; i < array.length; i += segmentLength) {
            result.push(array.slice(i, i + segmentLength));
        }
        return result;
    }
    const Canvas = () => (public_api_1.Devvit.createElement("vstack", { cornerRadius: "small", border: "thin", height: gridSize, width: gridSize }, splitArray(pixels, resolution).map((row) => (public_api_1.Devvit.createElement("hstack", null, row)))));
    return (public_api_1.Devvit.createElement("vstack", { gap: "small", width: "100%", height: "100%", alignment: "center middle" },
        public_api_1.Devvit.createElement(Canvas, null),
        public_api_1.Devvit.createElement(ColorSelector, null),
        public_api_1.Devvit.createElement("button", { onPress: () => setPage('startScreen') }, "Go to Start")));
};
exports.DrawScreen = DrawScreen;
//# sourceMappingURL=DrawScreen.js.map