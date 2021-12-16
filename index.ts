import {API_KEY} from "./api-key";
import {Game, MoveDirection} from "@gathertown/gather-game-client";
import {SpriteDirectionEnum_ENUM} from "@gathertown/gather-game-common";
import astar, {Graph} from "./astartAlgo";

global.WebSocket = require("isomorphic-ws");

const SPACE_ID = "xSfl6Admq5wHVIgS\\my-space";

// types
type Cord = {
    x: number,
    y: number,
}

// setup

const game = new Game(() => Promise.resolve({apiKey: API_KEY}));
game.connect(SPACE_ID); // replace with your spaceId of choice
game.subscribeToConnection((connected) => console.log("connected?", connected));

// shortest path
const getShortestPath = (grid: any, botCords: Cord, targetCords: Cord, targetDirection: SpriteDirectionEnum_ENUM) => {
    let goalCords: Cord = {
        x: targetCords.x,
        y: targetCords.y,
    };

    // set target space behind target user
    switch (targetDirection) {
        case 1:
            goalCords.y = goalCords.y - 1;
            break;
        case 3:
            goalCords.y = goalCords.y + 1;
            break;
        case 5:
            goalCords.x = goalCords.x + 1;
            break;
        case 7:
            goalCords.x = goalCords.x - 1;
            break;
        default:
            break;
    };

    // transform the grid
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            grid[x][y] = grid[x][y] === false ? 0 : 1;
        }
    }

    // set user as collision
    grid[targetCords.x][targetCords.y] = 1;

    const graph = new Graph(grid, {diagonal: false});

    //TODO: invert x and y in graph definition
    const start = graph.grid[botCords.y][botCords.x];
    const end = graph.grid[goalCords.y][goalCords.x];

    const result = astar.search(graph, start, end);

    let botLastX = botCords.x;
    let botLastY = botCords.y;

    console.log(goalCords);

    const newArr = result.map((el) => ({x: el.y, y: el.x}));

    newArr.forEach((node: any, index) => {
        setTimeout(() => {
            // no need to evaluate y since diagonal is not possible
            if (node.x > botLastX) {
                game.move(MoveDirection.Right);
            } else if (node.x < botLastX) {
                game.move(MoveDirection.Left);
            }

            // no need to evaluate y since diagonal is not possible
            if (node.y > botLastY) {
                game.move(MoveDirection.Down);
            } else if (node.y < botLastY) {
                game.move(MoveDirection.Up);
            }

            botLastX = node.x;
            botLastY = node.y;
        }, 200 * index);
    });
};

// listen for chats and move
game.subscribeToEvent("playerChats", (data, _context) => {
        // console.log(data);
        const message = data.playerChats;
        if (message.messageType === "DM") {
            // do something
            switch (message.contents.toLowerCase()) {
                case "hello":
                    const target = game.getPlayer(message.senderId);
                    const map = game.partialMaps;
                    const bot = game.getPlayer('K0ZKgQN6tfMk9Kd5fqJPjtux6oR2'); // fixed bot id, TODO: add global variable

                    getShortestPath(map.room.collisions, {x: bot.x, y: bot.y}, {x: target.x, y: target.y}, target.direction);
                    break;
                case "up":
                    game.move(MoveDirection.Up);
                    break;
                case "down":
                    game.move(MoveDirection.Down);
                    break;
                case "left":
                    game.move(MoveDirection.Left);
                    break;
                case "right":
                    game.move(MoveDirection.Right);
                    break;
                case "dance":
                    game.move(MoveDirection.Dance);
                    break;
                default:
                    let reply = "what? try sending up/down/left/right";
                    if (message.contents.substring(0, 3).toLowerCase() === "how") {
                        reply = "https://github.com/gathertown/twitch-plays-gather";
                    }
                    game.chat(message.senderId, [], "", reply);
            }
        }
    }
);


/*game.subscribeToEvent("playerMoves", (data, context) => {
    if (context.playerId === message.senderId) {
        console.log(data.playerMoves.direction);
        if (!initialized) {
            // @ts-ignore
            game.teleport('empty-room-medium-brick', data.playerMoves.x + 1, data.playerMoves.y + 1);
        }

        initialized = true;

        userStack.push(data.playerMoves.direction);

        if (userStack.length > 2) {
            switch (userStack[userStack.length - 2]) {
                case 2:
                    game.move(MoveDirection.Down);
                    break;
                case 4:
                    game.move(MoveDirection.Up);
                    break;
                case 6:
                    game.move(MoveDirection.Left);
                    break;
                case 8:
                    game.move(MoveDirection.Right);
                    break;
                default:
                    // @ts-ignore
                    // game.teleport('empty-room-medium-brick', data.playerMoves.x + 1, data.playerMoves.y + 1);
                    break;
            }
        }
    }


    /!* if (!initialized && context.playerId === message.senderId) {
         if (data.playerMoves.x && data.playerMoves.y) {
             //@ts-ignore
             console.log('teleporting')
             game.teleport('empty-room-medium-brick', data.playerMoves.x + 1, data.playerMoves.y + 1)
         }
     } else {
         switch (data.playerMoves.direction) {
             case 1:
                 game.move(MoveDirection.Down);
                 break;
             case 3:
                 game.move(MoveDirection.Up);
                 break;
             case 5:
                 game.move(MoveDirection.Left);
                 break;
             case 7:
                 game.move(MoveDirection.Right);
                 break;
             default:
                 // @ts-ignore
                 game.teleport('empty-room-medium-brick', data.playerMoves.x + 1, data.playerMoves.y + 1);
                 break;
         }
     }

     initialized = true;*!/
})


/!* let userStack: any[] = [];
 let initialized = false;

 game.subscribeToEvent("playerMoves", (data, context) => {
     if (context.playerId === message.senderId){
         console.log(data.playerMoves.direction);
         if (!initialized) {
             // @ts-ignore
             game.teleport('empty-room-medium-brick', data.playerMoves.x + 1, data.playerMoves.y + 1);
         }

         initialized = true;

         userStack.push(data.playerMoves.direction);

         if (userStack.length > 2) {
             switch (userStack[userStack.length - 2]) {
                 case 2:
                     game.move(MoveDirection.Down);
                     break;
                 case 4:
                     game.move(MoveDirection.Up);
                     break;
                 case 6:
                     game.move(MoveDirection.Left);
                     break;
                 case 8:
                     game.move(MoveDirection.Right);
                     break;
                 default:
                     // @ts-ignore
                     // game.teleport('empty-room-medium-brick', data.playerMoves.x + 1, data.playerMoves.y + 1);
                     break;
             }
         }
     }


    /!* if (!initialized && context.playerId === message.senderId) {
         if (data.playerMoves.x && data.playerMoves.y) {
             //@ts-ignore
             console.log('teleporting')
             game.teleport('empty-room-medium-brick', data.playerMoves.x + 1, data.playerMoves.y + 1)
         }
     } else {
         switch (data.playerMoves.direction) {
             case 1:
                 game.move(MoveDirection.Down);
                 break;
             case 3:
                 game.move(MoveDirection.Up);
                 break;
             case 5:
                 game.move(MoveDirection.Left);
                 break;
             case 7:
                 game.move(MoveDirection.Right);
                 break;
             default:
                 // @ts-ignore
                 game.teleport('empty-room-medium-brick', data.playerMoves.x + 1, data.playerMoves.y + 1);
                 break;
         }
     }

     initialized = true;*!/
 })*!/*/


// name and status setup
setTimeout(() => {
    // console.log("setting name and status");
    // console.log(game.partialMaps);
    //
    // fs.writeFileSync('test3.json', util.inspect(game.partialMaps, {showHidden: true, depth: null}));


    //game.engine.sendAction({
    //	$case: "setName",
    //	setName: {
    //		name: "Twitchy",
    //	},
    //});
    //game.engine.sendAction({
    //	$case: "setTextStatus",
    //	setTextStatus: {
    //		textStatus: "DM me to move!",
    //	},
    //});
    // game.engine.sendAction({
    // 	$case: "setOutfitString",
    // 	setOutfitString: {
    // 		outfitString:
    // 			'{"skin":{"id":"KPK1RNe5O32vJ8IhOicy","type":"skin","isDefault":true,"color":"3","name":"typical","parts":[{"spritesheet Id":"dQCYs4n7O99ksXuBIe33","layerId":"skin front"}],"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/BbNpZNRQylqIUmzc2QveW"},"hair":{"id":"oVHqqja061UDjdFbMaXY","type":"hair","color":"purple","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/_bMY9TZosM6aO3j5uaEDt","parts":[{"layerId":"hair front","spritesheetId":"nxznoKKe5eI2XLkrhU8T"}],"isDefault":true,"name":"messy"},"facial_hair":{},"top":{"id":"1iczssuelMf8BcOMkWjr","parts":[{"layerId":"top front","spritesheetId":"5YkEGqYP4tm6C9J3HBtX"}],"color":"red","name":"shirt (half untucked)","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/cYsgnqhSKY6JbdRIkX52D","isDefault":true,"type":"top"},"bottom":{"id":"Xx1p8Kjv0qEg6WPV6niD","name":"pants","type":"bottom","isDefault":true,"color":"white","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/WeY5PGdf8025J8o2VE8kp","parts":[{"spritesheetId":"TChgCSU6xSHuNmR2PI7H","layerId":"bottom front"}]},"shoes":{"id":"jWRxPyatM2P0bdzSnf50","parts":[{"spritesheetId":"yFpcQh7UcvdChVN8WvIW","layerId":"shoes front"}],"isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/kgDMGDXcC-ChLVRhOr7TZ","name":"generic","color":"black","type":"shoes"},"hat":{},"glasses":{"id":"KdFp1XwJet15FjqdQa38","isDefault":false,"parts":[{"layerId":"glasses front","spritesheetId":"py34w1ylAbJPYocLYKkq"}],"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/_hDx5L7uo8UOmsyFeSrZz","type":"glasses","color":"black","name":"sunglasses"},"other":{},"costume":{}}',
    // 	},
    // });
}, 2000); // wait two seconds before setting these just to give the game a chance to init



