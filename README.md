# Game Session Tracker

A browser-based game session tracker built with plain HTML, CSS, and JavaScript.

## Features

- Choose a reset target of 50 or 100 points
- Add and remove players dynamically during the session
- Track each player's current score, wins, games played, and `אאספים`
- Track the total number of games played in the session
- Highlight players in red when they pass the selected target
- Save the full session automatically in `localStorage`

## Recording `אאספים`

Use the `אאסף בסיבוב` field when a player declares Yaniv but another player catches them with an equal or lower score. Selecting that player increments their `אאספים` counter for the session.

## Project structure

- `/index.html` - Hebrew RTL interface
- `/css/style.css` - responsive styling
- `/js/main.js` - session state, tracking logic, and persistence

## Usage

Open `/index.html` directly in a browser, or serve the repository with any simple static file server.
