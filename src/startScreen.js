"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartScreen = void 0;
const public_api_1 = require("@devvit/public-api");
const StartScreen = ({ setPage }) => (public_api_1.Devvit.createElement("vstack", { width: "100%", height: "100%", alignment: "middle center", gap: "large", backgroundColor: "lightblue" },
    public_api_1.Devvit.createElement("text", { size: "xxlarge" }, "Start Screen"),
    public_api_1.Devvit.createElement("button", { onPress: () => setPage('drawScreen') }, "Go to Draw")));
exports.StartScreen = StartScreen;
//# sourceMappingURL=startScreen.js.map