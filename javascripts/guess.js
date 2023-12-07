document.addEventListener('DOMContentLoaded', event => {
    const message = document.querySelector("#message");
    const letters = document.querySelector("#spaces");
    const guesses = document.querySelector("#guesses");
    const apples = document.querySelector("#apples");
    const replay = document.querySelector("#replay");
  
    var randomWord = function() {
      var words = ['apple', 'banana', 'orange', 'pear'];
  
      return function() {
        var word = words[Math.floor(Math.random() * words.length)];
        words.splice(words.indexOf(word), 1);
        return word;
      };
    }();
  
    function Game() {
      this.init();
    }
  
    Game.prototype = {
      createBlanks: function() {
        let spaces = (new Array(this.word.length + 1)).join("<span></span>");
  
        let spans = letters.querySelectorAll("span");
        spans.forEach(span => {
          span.parentNode.removeChild(span);
        });
        letters.insertAdjacentHTML('beforeend', spaces);
        this.spaces = document.querySelectorAll("#spaces span");
      },
      displayMessage: function(text) {
        message.text(text);
      },

      setCorrectGuess(letter) {
        let indexes = [];
            for (let i = 0; i < this.word.length; i+= 1) {
                if (this.word[i] === letter){
                    indexes.push(i);
                    this.correctSpaces += 1;
                }
            }
            indexes.forEach(index => {
                this.spaces[index].textContent = letter;
            })
      },

      setGuess(letter) {
         let span = document.createElement("span");
         span.textContent = letter;
         guesses.appendChild(span);
      },

      guessLetter: function(event){
        if (event.keycode < 97 || event.keycode > 122) {
            return;
        }
        let letter = event.key;
        if (this.lettersGuessed.includes(letter)){
            return;
        }

        this.lettersGuessed.push(letter);
        this.setGuess(letter)
        if (this.word.includes(letter)) {
            this.setCorrectGuess(letter);
        } else {
            this.incorrect += 1;
            apples.setAttribute("class", `guess_${this.incorrect}`);
        }
        if (this.incorrect === 6) {
            message.textContent = "Sorry! You're out of guesses"
            replay.style.display = "inline";
            document.removeEventListener('keypress', this.handleKeyPress);
        }
        if (this.allMatch()){
            message.textContent = "You win!"
            replay.style.display = "inline";
            document.removeEventListener('keypress', this.handleKeyPress);
            document.body.setAttribute("class", "win");
        }
      },

      allMatch: function() {
        console.log(this.word);
        console.log(this.correctSpaces)
        console.log(this.word.length)
        return this.word.length === this.correctSpaces;
      },

      startNewGame: function(event) {
        event.preventDefault();
        new Game();
      },

      

      bindEvents: function() {
        this.handleKeyPress = this.guessLetter.bind(this)
        document.addEventListener('keypress', this.handleKeyPress);
        replay.addEventListener("click", this.startNewGame.bind(this));
      },

      init: function() {
        apples.setAttribute("class", "guess_0}");
        document.body.setAttribute("class", "");
        message.textContent = "";
        replay.style.display = "hidden";
        guesses.innerHTML = "<h2>Guesses:</h2>";
        this.incorrect = 0;
        this.lettersGuessed = [];
        this.correctSpaces = 0;
        this.word = randomWord();
        if (!this.word) {
        this.displayMessage("Sorry, I've run out of words!");
        return this;
        }
        this.word = this.word.split("");
        this.createBlanks();
        this.bindEvents();
      }
    };
  
    new Game();
  });