const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
console.log(battlesData);

canvas.width = 1024;
canvas.height = 576;

const collisionMap = [];
for (let i = 0; i < collision.length; i += 80) {
  collisionMap.push(collision.slice(i, 80 + i));
}

const battlesMap = [];
for (let i = 0; i < battlesData.length; i += 80) {
  battlesMap.push(battlesData.slice(i, 80 + i));
}
console.log(battlesMap);

const boundaries = [];
const offset = {
  x: -1040,
  y: -500,
};

collisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 110)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const battles = [];

battlesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 174)
      battles.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

console.log(battles);

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "./img/mapapkmn.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObject.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, foreground, ...battles];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width - 20 >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + 60 >= rectangle2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battles.forEach((battles) => {
    battles.draw();
  });
  player.draw();
  foreground.draw();

  if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
    for (let i = 0; i < battles.length; i++) {
      const battle = battles[i];
      const overlappingArea =
       (Math.min(
          player.position.x + player.width,
          battle.position.x + battle.width
        ) -
        Math.max(player.position.x, battle.position.x)) *
          (Math.min(
            player.position.y + 40,
            battle.position.y + battle.height
          ) - Math.max (player.position.y, battle.position.y))
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battle,
        }) &&
        overlappingArea > (player.width * 40) / 2 && Math.random() < 0.02
      ) {
        console.log("battle zone colision");

        break;
      }
    }
  }

  let moving = true;
  player.moving = true;
  if (keys.w.pressed && lastKey === "w") {
    player.moving = false;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log("colisao");
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movables) => {
        movables.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.moving = false;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colisao");
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movables) => {
        movables.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.moving = false;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log("colisao");
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movables) => {
        movables.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.moving = false;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colisao");
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movables) => {
        movables.position.x -= 3;
      });
  }
}
animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
