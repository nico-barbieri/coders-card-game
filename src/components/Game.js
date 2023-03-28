import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";

import cards from "../utilities/game/data/cards.json";
import players from "../utilities/game/data/players.json";

import { shuffle, updateHealthBar } from "../utilities/game/utilities";

const Game = () => {
  /*these information will be read from a database, since are related to the user
      for now, just for testing purposes, will be hard-coded*/
  const user = {
    id: 1,
    username: "player1",
    playable_players: [1],
    current_player: 1,
    deck: [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 35, 40, 45, 50],
  };

  /*for now, opponent will be the COMPUTER*/
  const opponent = {
    username: "COMPUTER",
    playable_players: [1, 2],
    current_player: 2,
    deck: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    ],
  };

  const [currentPlayer, setCurrentPlayer] = useState({});
  const [opponentPlayer, setOpponentPlayer] = useState({});

  const currentPlayerDefault = useRef({});
  const opponentPlayerDefault = useRef({});

  const [userDeck, setUserDeck] = useState([]);
  const [opponentDeck, setOpponentDeck] = useState([]);

  const [userPickedCards, setUserPickedCards] = useState([]);
  const [opponentPickedCards, setOpponentPickedCards] = useState([]);

  const [activeCards, setActiveCards] = useState([]);

  const [gameStatus, setGameStatus] = useState({
    userHasPlayed: false,
    opponentHasPlayed: false,
    userHasPicked: false,
    opponentHasPicked: false,
    finished: false,
    won: false,
  });

  const userBar = useRef(null);
  const opponentBar = useRef(null);

  //FUNCTION TO START THE GAME
  const init = () => {
    //set current player in the state
    setCurrentPlayer(
      players.find((player) => player.id === user.current_player)
    );
    //set opponent's player in the state
    setOpponentPlayer(
      players.find((player) => player.id === opponent.current_player)
    );

    //save informations in relative "default" state - it is necessary to reset values after cards activation
    currentPlayerDefault.current = players.find(
      (player) => player.id === user.current_player
    );
    opponentPlayerDefault.current = players.find(
      (player) => player.id === opponent.current_player
    );

    //set user's deck in the state and shuffle it
    setUserDeck(shuffle(cards.filter((card) => user.deck.includes(card.id))));
    //set opponent's deck in the state and shuffle it
    setOpponentDeck(
      shuffle(cards.filter((card) => opponent.deck.includes(card.id)))
    );
  };

  //START THE GAME AT FIRST RENDER
  useEffect(() => {
    init();
  }, []);

  //UPDATE STATUSES WHEN PLAYERS' ENERGY CHANGES
  useEffect(() => {
    if (currentPlayer.energy === 0) {
      setGameStatus((gameStatus) => ({
        ...gameStatus,
        finished: true,
        won: false,
      }));
    }

    if (opponentPlayer.energy === 0) {
      setGameStatus((gameStatus) => ({
        ...gameStatus,
        finished: true,
        won: true,
      }));
    }

    //handle energy bar

    updateHealthBar(
      currentPlayer,
      currentPlayerDefault.current.energy,
      userBar
    );

    updateHealthBar(
      opponentPlayer,
      opponentPlayerDefault.current.energy,
      opponentBar
    );
  }, [currentPlayer.energy, opponentPlayer.energy]);

  //RESET PLAYERS' ATK & DEF EVERY TURN
  useEffect(() => {
    //check if game is finished
    if (!gameStatus.finished) {
      //reset current player atk
      if (gameStatus.userHasPlayed && !gameStatus.opponentHasPlayed) {
        setCurrentPlayer((currentPlayer) => ({
          ...currentPlayer,
          atk: currentPlayerDefault.current.atk,
        }));
      }

      //reset current player def
      if (gameStatus.userHasPlayed && gameStatus.opponentHasPlayed) {
        setCurrentPlayer((currentPlayer) => ({
          ...currentPlayer,
          def: currentPlayerDefault.current.def,
        }));
      }

      //reset opponent player atk
      if (gameStatus.userHasPlayed && gameStatus.opponentHasPlayed) {
        setOpponentPlayer((opponentPlayer) => ({
          ...opponentPlayer,
          atk: opponentPlayerDefault.current.atk,
        }));
      }

      //reset opponent player def
      if (gameStatus.userHasPlayed && !gameStatus.opponentHasPlayed) {
        setOpponentPlayer((opponentPlayer) => ({
          ...opponentPlayer,
          def: opponentPlayerDefault.current.def,
        }));
      }

      //reset game status if both players have played
      if (gameStatus.userHasPlayed && gameStatus.opponentHasPlayed) {
        setGameStatus((gameStatus) => ({
          ...gameStatus,
          userHasPlayed: false,
          opponentHasPlayed: false,
          userHasPicked: false,
          opponentHasPicked: false,
        }));
      }
    }
  }, [gameStatus.userHasPlayed, gameStatus.opponentHasPlayed]);

  const handleCardPick = () => {
    //check if every card has been picked and activated - if so, "reset" the deck
    if (!userPickedCards.length && userDeck.length === 1) {
      setUserDeck(shuffle(cards.filter((card) => user.deck.includes(card.id))));
    }

    //check if player can pick a card
    if (gameStatus.userHasPicked && !gameStatus.userHasPlayed) return;

    //add picked card to activable and displayed cards
    setUserPickedCards((userPickedCards) => [
      ...userPickedCards,
      userDeck.at(-1),
    ]);

    //update user deck
    setUserDeck((userDeck) => {
      userDeck.pop();
      return userDeck;
    });

    //update game status
    setGameStatus((gameStatus) => ({ ...gameStatus, userHasPicked: true }));
  };

  const handleActivate = (card) => {
    const { id, target, atk, def, cure, isAMultiplier, turns } = card;
    if (target === "self") {
      if (!isAMultiplier) {
        setCurrentPlayer((currentPlayer) => ({
          ...currentPlayer,
          atk: currentPlayer.atk + atk,
          def: currentPlayer.def + def,
          energy: (currentPlayer.energy + cure) < currentPlayerDefault.current.energy? currentPlayer.energy + cure : currentPlayerDefault.current.energy,
        }));
      }
      if (isAMultiplier) {
        setCurrentPlayer((currentPlayer) => ({
          ...currentPlayer,
          atk: Math.round(currentPlayer.atk * atk),
          def: Math.round(currentPlayer.def * def),
        }));
      }
    }
    if (target === "opponent") {
      if (!isAMultiplier) {
        setOpponentPlayer((opponentPlayer) => ({
          ...opponentPlayer,
          atk: opponentPlayer.atk - atk,
          def: opponentPlayer.def - def,
        }));
      }
      if (isAMultiplier) {
        setOpponentPlayer((opponentPlayer) => ({
          ...opponentPlayer,
          atk: Math.round(opponentPlayer.atk * atk),
          def: Math.round(opponentPlayer.def * def),
        }));
      }
    }

    //keep track of active cards (later, multi-turns effect will be managed)
    setActiveCards((activeCards) => [...activeCards, { id: id, turns: turns }]);

    setUserPickedCards((userPickedCards) =>
      userPickedCards.filter((card) => card.id !== id)
    );
  };

  const handleAttack = () => {
    if (gameStatus.finished) return;

    const damage =
      currentPlayer.atk - opponentPlayer.def > 0
        ? currentPlayer.atk - opponentPlayer.def
        : 0;

    if (!damage) {
      setCurrentPlayer((currentPlayer) => ({
        ...currentPlayer,
        energy: currentPlayer.energy - 2 > 0 ? currentPlayer.energy - 2 : 0,
      }));
    }

    setOpponentPlayer((opponentPlayer) => ({
      ...opponentPlayer,
      energy:
        opponentPlayer.energy - damage > 0 ? opponentPlayer.energy - damage : 0,
    }));

    if (!gameStatus.finished) {
      setGameStatus((gameStatus) => ({ ...gameStatus, userHasPlayed: true }));
    }

    setTimeout(() => {
      handleComputerTurn();
    }, 1000);
  };

  const handleComputerTurn = () => {
    //check if every card has been picked and activated - if so, "reset" the deck
    if (!opponentPickedCards.length && opponentDeck.length === 1) {
      setOpponentDeck(
        shuffle(cards.filter((card) => opponent.deck.includes(card.id)))
      );
    }

    //check if opponent can pick a card
    if (gameStatus.opponentHasPicked && !gameStatus.opponentHasPlayed) return;

    if (opponentPickedCards.length < 3) {
      //add picked card to activable and displayed cards
      setOpponentPickedCards((opponentPickedCards) => [
        ...opponentPickedCards,
        opponentDeck.at(-1),
      ]);

      //update opponent deck
      setOpponentDeck((opponentDeck) => {
        opponentDeck.pop();
        return opponentDeck;
      });
    }

    //update game status
    setGameStatus((gameStatus) => ({ ...gameStatus, opponentHasPicked: true }));

    //let computer "deciding" how many card activate
    setTimeout(() => {
      while (opponentPickedCards.length && Math.random() < 0.8) {
        //pick a random card from opponent picked cards
        const pickedCard =
          opponentPickedCards[
            Math.floor(Math.random() * opponentPickedCards.length)
          ];

        const { id, target, atk, def, cure, isAMultiplier, turns } = pickedCard;
        if (target === "self") {
          if (!isAMultiplier) {
            setOpponentPlayer((opponentPlayer) => ({
              ...opponentPlayer,
              atk: opponentPlayer.atk + atk,
              def: opponentPlayer.def + def,
              energy: (opponentPlayer.energy + cure) < opponentPlayerDefault.current.energy? opponentPlayer.energy + cure : opponentPlayerDefault.current.energy,
            }));
          }
          if (isAMultiplier) {
            setOpponentPlayer((opponentPlayer) => ({
              ...opponentPlayer,
              atk: Math.round(opponentPlayer.atk * atk),
              def: Math.round(opponentPlayer.def * def),
            }));
          }
        }
        if (target === "opponent") {
          if (!isAMultiplier) {
            setCurrentPlayer((currentPlayer) => ({
              ...currentPlayer,
              atk: currentPlayer.atk - atk,
              def: currentPlayer.def - def,
            }));
          }
          if (isAMultiplier) {
            setCurrentPlayer((currentPlayer) => ({
              ...currentPlayer,
              atk: Math.round(currentPlayer.atk * atk),
              def: Math.round(currentPlayer.def * def),
            }));
          }
        }

        //keep track of active cards (later, multi-turns effect will be managed)
        setActiveCards((activeCards) => [
          ...activeCards,
          { id: `computer_${id}`, turns: turns },
        ]);

        setOpponentPickedCards((opponentPickedCards) =>
          opponentPickedCards.filter((card) => card.id !== id)
        );
      }
    }, 2000);

    //let computer attack
    setTimeout(() => {
      if (gameStatus.finished) return;

      const damage =
        opponentPlayer.atk - currentPlayer.def > 0
          ? opponentPlayer.atk - currentPlayer.def
          : 0;

      if (!damage) {
        setOpponentPlayer((opponentPlayer) => ({
          ...opponentPlayer,
          energy: opponentPlayer.energy - 2 > 0 ? opponentPlayer.energy - 2 : 0,
        }));
      }

      setCurrentPlayer((currentPlayer) => ({
        ...currentPlayer,
        energy:
          currentPlayer.energy - damage > 0 ? currentPlayer.energy - damage : 0,
      }));

      if (!gameStatus.finished) {
        setGameStatus((gameStatus) => ({
          ...gameStatus,
          opponentHasPlayed: true,
        }));
      }
    }, 2000);
  };

  const handlePlayAgain = () => {
    setGameStatus({
      userHasPlayed: false,
      opponentHasPlayed: false,
      userHasPicked: false,
      opponentHasPicked: false,
      finished: false,
      won: false,
    });

    setCurrentPlayer({ ...currentPlayerDefault.current });
    setOpponentPlayer({ ...opponentPlayerDefault.current });
    setUserPickedCards([]);
    setOpponentPickedCards([]);
    setActiveCards([]);
    init();
  };

  return (
    <>
      <div className="game">
        {gameStatus.finished && (
          <div className={(gameStatus.won ? "won" : "lost") + " end-window"}>
            <div className="end-window-wrapper">
              <h2>{gameStatus.won ? "You won!" : "You Lost"}</h2>
              <button onClick={handlePlayAgain}>Play again!</button>
            </div>
          </div>
        )}
        <div
          className={
            (gameStatus.finished ? "finished" : "playing") + " game-wrapper"
          }
        >
          <div
            className={
              (gameStatus.userHasPlayed ? "active" : "waiting") +
              " opponent-side"
            }
          >
            <div className="activable-cards">
              <div className="cards-wrapper">
                {opponentPickedCards.length !== 0 &&
                  opponentPickedCards?.map((card) => (
                    <div className="card-container" key={"opponent_" + card.id}>
                      <Card card={card} isOpponent={true} />
                    </div>
                  ))}
              </div>
            </div>
            <div className="status">
              <div className="status-wrapper">
                <div className="energy">
                  <h3>{opponentPlayer?.name}</h3>
                  <div className="energy-bar-container">
                    <div className="energy-bar" ref={opponentBar}></div>
                  </div>
                  <span className="energy-value">
                    {opponentPlayer?.energy}/
                    {opponentPlayerDefault?.current.energy}
                  </span>
                </div>
                <div className="atk-and-def">
                  <span>ATK: {opponentPlayer?.atk}</span>
                  <span>DEF: {opponentPlayer?.def}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              (gameStatus.userHasPlayed ? "waiting" : "active") + " user-side"
            }
          >
            <div className="activable-cards">
              <div className="cards-wrapper">
                {userPickedCards.length !== 0 &&
                  userPickedCards?.map((card) => (
                    <div className="card-container" key={card.id}>
                      <Card card={card} handleActivate={handleActivate} />
                    </div>
                  ))}
              </div>
            </div>
            <div className="actions">
              <div className="actions-wrapper">
                <button
                  onClick={handleCardPick}
                  disabled={
                    gameStatus.userHasPicked || userPickedCards.length >= 3
                  }
                >
                  {userPickedCards.length >= 3
                    ? "Maximum activable cards reached"
                    : "PICK A CHIPz"}
                </button>
                <button
                  onClick={handleAttack}
                  disabled={gameStatus.userHasPlayed}
                >
                  ATTACK!
                </button>
              </div>
            </div>
            <div className="status">
              <div className="status-wrapper">
                <div className="energy">
                  <h3>{currentPlayer?.name}</h3>
                  <div className="energy-bar-container">
                    <div className="energy-bar" ref={userBar}></div>
                  </div>
                  <span className="energy-value">
                    {currentPlayer?.energy}/
                    {currentPlayerDefault?.current.energy}
                  </span>
                </div>
                <div className="atk-and-def">
                  <span>ATK: {currentPlayer?.atk}</span>
                  <span>DEF: {currentPlayer?.def}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
