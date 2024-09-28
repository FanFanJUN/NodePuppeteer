// Type "Hello World" then press enter.
import robot from "robotjs";
import {
  Button,
  down,
  Key,
  keyboard,
  mouse,
  straightTo,
} from "@nut-tree/nut-js";
// robot.moveMouse(1000, npm nut-tree/nut.jsnpm nut-tree/nut.jsnpm nut-tree/nut.jsnpm nut-tree/nut.jsnpm nut-tree/nut.jsnpm nut-tree/nut.jsnpm nut-tree/nut.js100);
// robot.mouseClick();
// var mouse = robot.getMousePos();
// console.log(mouse);
// // robot.keyTap("enter");";
await mouse.move(straightTo({ x: 500, y: 200 }));
await mouse.click(Button.LEFT);
await keyboard.type("npm nut-tree/nut.js");
await keyboard.pressKey(Key.Enter);
// await mouse.move(straightTo({ x: 500, y: 200 }));
// await mouse.move(down(50));
// await mouse.click(Button.LEFT);
// Type "Hello World".
// robot.moveMouse(1000, 100);
// robot.mouseClick();
// var mouse = robot.getMousePos();
// console.log(mouse);
// // robot.keyTap("enter");
//

// robot.typeString("112233");

// robot.moveMouse(1020, 100);
// robot.mouseClick();

// robot.keyTap("enter");
// Get mouse position.
// var mouse = robot.getMousePos();

// // Get pixel color in hex format.
// var hex = robot.getPixelColor(mouse.x, mouse.y);
// console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);
// / 按下 Ctrl（模拟 Command）键
// robot.keyToggle("coHello World
// // 释放 Ctrl（模拟 Command）键
// robot.keyToggle("command", "up");
