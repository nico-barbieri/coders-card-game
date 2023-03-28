# CODERS CARD GAME
This project contains the turn based battle included in [CODERS](https://github.com/nico-barbieri/CODERS).

## THE CONTEXT:
The user has two collections:
- the collection of playable CODERS, each with their own fixed ATK, DEF, and ENERGY values.
- the collection of CHIPz, which are cards that have the power to modify those values. They can either change the values of the player's CODER or his opponent's CODER, or restore the player's CODER's energy.

## RULES

- ### PICK A CARD
The player picks a random card from their deck. They can pick only one card each turn, and only if they have fewer than three activable cards.

- ### ACTIVATE A CARD
The player can activate one or more cards from their hand. They can use multiple cards to combine their effects.

- ### ATTACK
The player must attack and end their turn.

- ### CALCULATION OF THE DAMAGE
The result of the player's attack value minus the opponent's defense value is the damage dealt. If the opponent's defense value is higher than the player's attack value, the attacking player loses 2 energy points.

- ### HOW TO WIN
The game ends when one of the players loses all of their energy points. The surviving player wins.

