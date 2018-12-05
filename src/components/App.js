import React from "react";
import {
  Chessboard,
  COLOR,
  MOVE_INPUT_MODE,
  INPUT_EVENT_TYPE
} from "cm-chessboard";
import Chess from "chess.js";
import axios from "axios";

const boardHeight = 400;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gameOver: false, history: [] };
  }

  chess = new Chess();
  chessboard = void 0;
  moves = [];

  componentDidMount() {
    this.chessboard = new Chessboard(
      document.getElementById("chessboard-container"),
      {
        position: "start",
        orientation: COLOR.white,
        style: {
          cssClass: "default",
          showCoordinates: true,
          showBorder: true
        },
        responsive: false,
        animationDuration: 300,
        moveInputMode: MOVE_INPUT_MODE.dragMarker,
        sprite: {
          url: "./chessboard-sprite.svg",
          grid: 40
        }
      }
    );

    this.getMoves().then(moves => {
      this.moves = moves;
      this.applyMoves(moves);
    });

    setInterval(() => {
      this.getMoves().then(moves => {
        if (this.moves !== moves) {
          this.moves = moves;
          this.applyMoves(moves);
        }
      });
    }, 2000);

    this.chessboard.enableMoveInput(this.handleMoveInput);
  }

  updateGameState = () => {
    var history = document.getElementById("history");

    // Only auto-scroll to the bottom if the list is already at the bottom before adding another move
    var autoScroll = history.scrollTop === history.scrollHeight - boardHeight;

    this.setState({
      gameOver: this.chess.game_over(),
      history: this.chess.history()
    });

    if (autoScroll) {
      history.scrollTop = history.scrollHeight;
    }
  };

  getMoves = () =>
    axios.get("/api/moves").then(response => response.data.moves.split(" "));

  applyMoves = moves => {
    this.chess.reset();

    moves.forEach(move => {
      this.chess.move(move);
    });

    this.chessboard.setPosition(this.chess.fen());
    this.updateGameState();
  };

  handleMoveInput = event => {
    switch (event.type) {
      case INPUT_EVENT_TYPE.moveStart:
        if (this.chess.game_over()) {
          return false;
        }
        var possibleMoves = this.chess.moves({
          square: event.square,
          verbose: true
        });

        possibleMoves.forEach(move => {
          this.chessboard.addMarker(move.to);
        });

        return true;
      case INPUT_EVENT_TYPE.moveDone:
        this.chessboard.removeMarkers(null, null);

        var moveResult = this.chess.move({
          from: event.squareFrom,
          to: event.squareTo
        });
        if (!moveResult) {
          return false;
        }

        this.moves.push(moveResult.san);
        axios.post("/api/moves", { moves: this.moves.join(" ") });

        this.updateGameState();

        return true;
      case INPUT_EVENT_TYPE.moveCanceled:
        this.chessboard.removeMarkers(null, null);
        break;
    }
  };

  render() {
    try {
      return (
        <div className="App">
          <div
            style={{
              float: "left",
              width: "100px"
            }}
          >
            <h1>ShadFish</h1>
            <div
              id="history"
              style={{
                height: `${boardHeight}px`,
                overflow: "hidden",
                overflowY: "scroll",
                border: "ridge"
              }}
            >
              <h3 style={{ marginLeft: "5px" }}>History</h3>
              {this.state.history.map((move, index) => (
                <p style={{ marginLeft: "6px" }} key={index}>
                  {move}
                </p>
              ))}
            </div>
          </div>
          <div style={{ float: "left", marginLeft: "20px" }}>
            {this.state.gameOver && (
              <h1 style={{ color: "red", float: "right" }}>Game Over!</h1>
            )}
            <div
              id="chessboard-container"
              style={{
                height: `${boardHeight}px`,
                width: `${boardHeight}px`,
                marginTop: !this.state.gameOver ? "86px" : void 0
              }}
            />
          </div>
        </div>
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default App;
