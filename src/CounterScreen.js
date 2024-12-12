"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterScreen = void 0;
const public_api_1 = require("@devvit/public-api");
const CounterScreen = ({ setPage, counter, setCounter }) => (public_api_1.Devvit.createElement("vstack", { height: "100%", width: "100%", gap: "medium", alignment: "center middle" },
    public_api_1.Devvit.createElement("image", { url: "Trollface.png", description: "logo", imageHeight: 256, imageWidth: 256, height: "48px", width: "48px" }),
    public_api_1.Devvit.createElement("text", { size: "large" }, `Number of times a random person died: ${counter} Money: ${counter * 100000}`),
    public_api_1.Devvit.createElement("button", { appearance: "primary", onPress: () => setCounter((counter) => counter + 1) }, "kill random person and get money"),
    public_api_1.Devvit.createElement("button", { onPress: () => setPage('startScreen') }, "Go to A")));
exports.CounterScreen = CounterScreen;
//# sourceMappingURL=CounterScreen.js.map