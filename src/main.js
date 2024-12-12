"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const public_api_1 = require("@devvit/public-api");
const startScreen_js_1 = require("./startScreen.js");
const DrawScreen_js_1 = require("./DrawScreen.js");
public_api_1.Devvit.configure({
    redditAPI: true,
    redis: true
});
public_api_1.Devvit.addMenuItem({
    label: 'Add my post',
    location: 'subreddit',
    forUserType: 'moderator',
    onPress: (_event, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { reddit, ui } = context;
        const subreddit = yield reddit.getCurrentSubreddit();
        const startDate = new Date('2024-12-04');
        const currentDate = new Date();
        const utcStartDate = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const utcCurrentDate = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const diffTime = utcCurrentDate - utcStartDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const postTitle = `Tetramatch ${diffDays}`;
        yield reddit.submitPost({
            title: postTitle,
            subredditName: subreddit.name,
            preview: (public_api_1.Devvit.createElement("vstack", { height: "100%", width: "100%", alignment: "middle center" },
                public_api_1.Devvit.createElement("text", { size: "large" }, "Loading ..."))),
        });
        ui.showToast({ text: 'Created post!' });
    }),
});
public_api_1.Devvit.addCustomPostType({
    name: 'Experience Post',
    height: 'tall',
    render: (_context) => {
        const [counter, setCounter] = (0, public_api_1.useState)(0);
        const [page, setPage] = (0, public_api_1.useState)('a');
        let currentPage;
        switch (page) {
            case 'startScreen':
                currentPage = public_api_1.Devvit.createElement(startScreen_js_1.StartScreen, { setPage: setPage });
                break;
            case 'drawScreen':
                currentPage = public_api_1.Devvit.createElement(DrawScreen_js_1.DrawScreen, { setPage: setPage });
                break;
            default:
                currentPage = public_api_1.Devvit.createElement(startScreen_js_1.StartScreen, { setPage: setPage });
        }
        return (public_api_1.Devvit.createElement("blocks", null, currentPage));
    },
});
exports.default = public_api_1.Devvit;
//# sourceMappingURL=main.js.map