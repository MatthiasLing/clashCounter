# Clash Counter
Clash Royale companion web application deceloped using React.  Uses voice recognition from user to track opponent's elixir and card cycle based on saying troop names out loud.  Uses JS SpeechRecognition web api and Clash Royale api.

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

## To Do:
    • Store user data - player ID and improve recognition based on pronounciation aliases
    • Node JS
    • Host on AWS


