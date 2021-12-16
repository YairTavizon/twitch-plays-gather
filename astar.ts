//
//
//
// // shortest path
// const removeFromArray = (arr: any[], el: any) => {
//     for (let i = arr.length - 1; i >= 0; i--) {
//         if (arr[i] == el) {
//             arr.splice(i, 1);
//         }
//     }
// }
//
// const getShortestPath = (map: any, botCords: Cord, targetCords: Cord, targetDirection: SpriteDirectionEnum_ENUM) => {
//     if (!map) return [];
//
//     let goalCords: Cord = {
//         x: targetCords.x,
//         y: targetCords.y,
//     };
//
//     // set target space behind target user
//     switch (targetDirection) {
//         case 1:
//             goalCords.y = goalCords.y - 1;
//             break;
//         case 3:
//             goalCords.y = goalCords.y + 1;
//             break;
//         case 5:
//             goalCords.x = goalCords.x + 1;
//             break;
//         case 7:
//             goalCords.x = goalCords.x - 1;
//             break;
//         default:
//             break;
//     }
//     ;
//
//     // transform the grid
//     for (let y = 0; y < map.length; y++) {
//         for (let x = 0; x < map[y].length; x++) {
//             map[x][y] = {
//                 f: 0,
//                 g: 0,
//                 h: 0,
//                 x,
//                 y,
//                 neighbors: [],
//                 addNeighbors: (grid: any[][]) => {
//
//                 }
//             }
//         }
//     }
//
//     const openSet = [];
//     const closedSet = [];
//
//     const start = map[botCords.x][botCords.y];
//     const end = map[targetCords.x, targetCords.y]
//
//     openSet.push(start);
//
//     while (openSet.length > 0) {
//
//         let lowIdx = 0;
//         for (let i = 0; i < openSet.length; i++) {
//             if (openSet[i].f < openSet[lowIdx].f) {
//                 lowIdx = i;
//             }
//         }
//
//         let current = openSet[lowIdx];
//
//         if (current === end) {
//             return
//         }
//
//         removeFromArray(openSet, current);
//         closedSet.push(current);
//     }
//
//     return [];
// };
//
// export default getShortestPath;
//
