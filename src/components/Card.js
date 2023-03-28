import React from "react";
import chip from '../res/chip.png'

const Card = ({ card, handleActivate, isOpponent }) => {
  if (card)
    return (
      <div
        className={
          (card.target === "self" ? "target-self" : "target-opponent") + " card"
        }
      >
        <div className="card-content">
          <div className="card-wrapper">
            <h3>{card.name}</h3>
            <div className="card-body">
              <div className="card-effects">
                <p>Target - {card.target === "self" ? "YOU" : "OPPONENT"}</p>
                {card.cure !== 0 && <p>Restore {card.cure} energy</p>}
                <p>
                  ATK:&nbsp; 
                  {card.isAMultiplier ? card.atk * 100 + "%" : (card.target === 'self'? '+' : '-') + card.atk}
                </p>
                <p>
                  DEF:&nbsp; 
                  {card.isAMultiplier ? card.def * 100 + "%" : (card.target === 'self'? '+' : '-') + card.def}
                </p>
              </div>
              <div className="card-action">
                {!isOpponent && 'HACK!'}
                {!isOpponent? <button
                  onClick={() => {
                    handleActivate(card);
                  }}
                >
                  <img src={chip}/>
                </button> : <img src={chip}/>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Card;
