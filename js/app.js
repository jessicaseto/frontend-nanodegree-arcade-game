// Global counter for points
const points = document.querySelector('.points');
points.innerHTML = 0;

// Function to set up game
function gameSetUp (sprite) {
    // Hide the start modal
    document.querySelector('.start-modal').style.display = 'none';

    // Save the avatar choice
    player = new Player(sprite);

    // Start the resources
    resources();

    // Start the game engine
    Engine(window);

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });
}

// Function to start the game
(function start() {
    // Bring up start modal
    document.querySelector('.start-modal').style.display = 'block';

    // Check if an avatar was clicked
    document.addEventListener('click', function(event) {
        if(event.target.classList.contains('char-boy')) {
            gameSetUp('images/char-boy.png');
        } else if (event.target.classList.contains('char-cat-girl')) {
            gameSetUp('images/char-cat-girl.png');
        }
    });
})();

// Enemies our player must avoid
class Enemy {
    constructor(sprite) {
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';

        // Location information
        this.x = getRndInteger(1, 3) * -101;
        this.y = getRndInteger(1, 3) * 83 - 20;

        // Speed
        this.speed = getRndInteger(3,5) * 40;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += (this.speed * dt);

        // Handle collision with a player
        if ((Math.abs(this.x - player.x) < 75) && (this.y - player.y === 10)) {
            player.reset();
            player.points = 0;
            points.innerHTML = player.points;
        }
    };

    // Method to check if the enemy has cleared the screen.
    // If so, remove from array
    // Parameter: index, the index of the enemy in the allEnemies array
    checkIfCleared(index) {
        if (this.x > 505) {
            allEnemies.splice(index, 1);
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

};

// Random integer function
// From: https://www.w3schools.com/js/js_random.asp
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(sprite) {
        // The image/sprite for our player, this uses
        // a helper we've provided to easily load images
        this.sprite = sprite;

        // Location information
        // Start in the middle column, first row
        this.x = 2 * 101;
        this.y = 385;

        // Movement information
        this.dx = 0;
        this.dy = 0;

        // Point count
        this.points = 0;
    }

    update() {
        // Update the player's x and y location
        this.x += (this.dx * 101);
        this.y += (this.dy * 83);

        // If player has reached the water, call reset
        if (this.y < 0) {
            this.points ++;
            points.innerHTML = this.points;
            this.reset();
        }

        // Reset dx and dy
        this.dx = 0;
        this.dy = 0;
    }

    handleInput(key) {
        // Check for left, up, right, or down
        if (key === 'left' && this.x > 0) {
            this.dx = -1;
        } else if (key === 'up' && this.y > 0) {
            this.dy = -1;
        } else if (key === 'right' && this.x < 404) {
            this.dx = 1;
        } else if (key === 'down' && this.y < 374) {
            this.dy = 1;
        }
    }

    // Reset function to reset the location of the player
    reset() {
        this.x = 2 * 101;
        this.y = 385;
    }

    // Draw the player on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


// Now instantiate your objects.

// Place player in variable called player
// Avatar to be assigned when clicked on start modal
let player;

// Place all enemy objects in an array called allEnemies
const allEnemies = [];
const enemy1 = new Enemy;
const enemy2 = new Enemy;
const enemy3 = new Enemy;
allEnemies.push(enemy1, enemy2, enemy3);

// Create a new enemy every ~1.5 seconds
setInterval(function() {
    // Code in setInterval only runs if the page has focus
    if( document.hasFocus() ) {
        const enemy = new Enemy;
        allEnemies.push(enemy);
    }
}, 1500);