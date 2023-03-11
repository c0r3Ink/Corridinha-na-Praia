class Player {
  constructor() { 
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.life = 200;
    this.fuel = 200;
  }

  getCount() {
    database.ref("playerCount").on("value", (data)=>{playerCount = data.val()})
  }

  updateCount(value) {
    database.ref("/").update({
      playerCount: value
    })
  }

  addPlayer() {
    var playerIndex = "players/player" + this.index
    if(this.index === 1){
      this.positionX = width / 2 - 100
    }else{
      this.positionX = width / 2 + 100
    }
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      score: this.score, 
      rank: this.rank,
      life: this.life,
      fuel: this.fuel
    })
  }

  static getPlayersInfo() {
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    });
  }

  update() {
    var playerIndex = "players/player" + this.index
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      score: this.score, 
      rank: this.rank,
      life: this.life,
      fuel: this.fuel
    })
  }

  getDistance() {
    var playerDistanceRef = database.ref("players/player" + this.index);
    playerDistanceRef.on("value", data => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }

  getCarsAtEnd() {
    database.ref("carsAtEnd").on("value", data => {
      this.rank = data.val();
    });
  }

  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd: rank
    });
  }
}



