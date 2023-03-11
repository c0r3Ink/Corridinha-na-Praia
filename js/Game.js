class Game {
  constructor() {
    this.resetTittle = createElement("h2");
    this.reset = createButton("");

    this.leaderText = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.isMoving = false;
    this.leftKey = false;
    this.boom = false;
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car", car1Img);
    car1.addImage("boom", boom);
    car1.scale = 0.07;
    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car", car2Img);
    car2.addImage("boom", boom);
    car2.scale = 0.07;
    cars = [car1, car2];

    coins = new Group();
    this.createSprites(20, coinImg, 0.09, coins);

    fuels = new Group();
    this.createSprites(10, fuelImg, 0.02, fuels);

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image },
    ];
    obstacles = new Group();
    this.createSprites(
      obstaclesPositions.length,
      obstacle1Image,
      0.04,
      obstacles,
      obstaclesPositions
    );
  }

  play() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.showElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(pista, 0, -height * 5, width, height * 6);
      this.showLeaderboard();
      this.showLife();
      this.showFuel();
      var index = 0;
      for (var p in allPlayers) {
        index = index + 1;
        var x = allPlayers[p].positionX;
        var y = height - allPlayers[p].positionY;
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        var life = allPlayers[p].life;
        if (life <= 0) {
          cars[index - 1].changeImage("boom");
          cars[index - 1].scale = 0.3;
        }

        //camera pra seguir os carrinho
        if (index === player.index) {
          if (player.life <= 0) {
            this.boom = true;
            this.isMoving = false;
          }
          console.log(cars[index - 1].positionY);

          if (cars[index - 1].position.y >= 400) {
            camera.position.y = windowHeight / 2;
          } else {
            camera.position.y = cars[index - 1].position.y;
          }

          this.handleFuel(index);
          this.handleCoins(index);
          this.Collision(index);
          this.carCollision(index);
        }
      }
      this.Controles();

      if (this.isMoving) {
        player.positionY += 5;
        player.update();
      }

      if (player.positionY > height * 6 - 100) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  getState() {
    database.ref("gameState").on("value", (data) => {
      gameState = data.val();
    });
  }

  updateState(value) {
    database.ref("/").update({
      gameState: value,
    });
  }

  Controles() {
    if (!this.boom) {
      if (keyIsDown(RIGHT_ARROW)) {
        player.positionX += 5;
        player.update();
        this.leftKey = false;
      }

      if (keyIsDown(LEFT_ARROW)) {
        player.positionX -= 5;
        player.update();
        this.leftKey = true;
      }

      if (keyIsDown(UP_ARROW)) {
        player.positionY += 5;
        player.update();

        this.isMoving = true;
      }
    }
  }

  showElements() {
    this.resetTittle.html("reset");
    this.resetTittle.class("resetText");
    this.resetTittle.position(width / 2 + 200, 50);
    this.reset.class("resetButton");
    this.reset.position(width / 2 + 230, 100);

    this.leaderText.html("score");
    this.leaderText.class("resetText");
    this.leaderText.position(width / 3 - 60, 50);
    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 60, 80);
    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 60, 130);
  }
  //resetar o jogoooooooooo
  handleResetButton() {
    this.reset.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
      });
      window.location.reload();
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }
    //se o player 2 ganharrrrrr
    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  createSprites(num, image, scale, group, positions = []) {
    for (var i = 0; i < num; i++) {
      var x, y;

      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        image = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 50);
        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", image);
      sprite.scale = scale;
      group.add(sprite);
    }
  }

  showLife() {
    push();
    image(life, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 200, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 350, player.life, 20);
    noStroke();
    pop();
  }

  showFuel() {
    push();
    image(fuelImg, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 200, 20);
    fill("yellow");
    rect(width / 2 - 100, height - player.positionY - 300, player.fuel, 20);
    noStroke();
    pop();
  }

  showRank() {
    swal({
      //title: Incrível!${"\n"}Rank${"\n"}${player.rank},
      title: `Incrível!${"\n"}${player.rank}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
  }

  gameOver() {
    swal({
      title: "Fim de Jogo",
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar",
    });
  }

  handleFuel(index) {
    //adicionando combustível
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 200;
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });

    // reduzindo o combustível do carro
    if (player.fuel > 0 && this.isMoving) {
      player.fuel -= 0.5;
    }

    if (player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  handleCoins(index) {
    cars[index - 1].overlap(coins, function (collector, collected) {
      player.score += 20;
      player.update();
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
  }

  Collision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftKey) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      if (player.life > 0) {
        player.life -= 200 / 5;
      }
      player.update();
    }
  }

  carCollision(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKey) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        if (player.life > 0) {
          player.life -= 200 / 5;
        }
        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKey) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        if (player.life > 0) {
          player.life -= 200 / 5;
        }
        player.update();
      }
    }
  }
}
