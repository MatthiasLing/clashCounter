# Clash Counter
Clash Royale companion web application developed using React.  Uses voice recognition from user to track opponent's elixir and card cycle based on saying troop names out loud.  Uses JS SpeechRecognition web api and Clash Royale api.  Currently trying to integrate with AWS for player data storage via api calls to dynamoDB.

## Usage:
Currently the api has only been tested on Chrome.  Be sure to enable microphone access in browser settings.


## Completed:
    • Called Clash Royale API to download all cards
    • Preprocessed all card data to lower case with elixir cost field added
    • Successful voice recognition mapping to corresponding card
    • Fix cycle detection algorithm
    • Create UI with cards in hand displayed
    • Elixir bar calculation
    • Manual override and adding elixir
    • Elixir bar visualization
    • Work out edge cases - mirror
    • Store user data - Lists of aliases per key value stored successfully in dynamoDB and called as well

## Gameplay: 
![Screenshot](gameplay_images/start.png?raw=true)
![Screenshot](gameplay_images/aliases.png?raw=true)
![Screenshot](gameplay_images/in_game.png?raw=true)



