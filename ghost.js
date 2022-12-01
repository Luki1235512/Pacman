class Ghost {
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
        this.speed = speed;

        this.direction = DIRECTION_RIGHT;

        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;

        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * randomTargetsForGhosts.length);

        setInterval(() => {
           this.changeRandomDirection()
        }, 10000);
    }

    changeRandomDirection() {
        this.randomTargetIndex += parseInt(Math.random() * 4);
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    moveProcess() {
        if (this.isInRangeOfPacman()) {
            this.target = pacman
        }
        else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex]
        }
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollision()) {
            this.moveBackwards();
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.y += this.speed;
                break;
            case DIRECTION_LEFT:
                this.x += this.speed;
                break;
            case DIRECTION_DOWN:
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION_UP:
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION_DOWN:
                this.y += this.speed;
                break;
        }
    }

    checkCollision() {
        let isCollided = false;
        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
                ] === 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
                ] === 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
                ] === 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
                ] === 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }

    checkGhostCollision() {

    }

    isInRangeOfPacman() {
        const xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        const yDistance = Math.abs(pacman.getMapY() - this.getMapY());

        return Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range;
    }

    changeDirectionIfPossible() {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        )

        if (typeof this.direction === "undefined") {
            this.direction = tempDirection;
            return;
        }

        this.moveForwards();
        if (this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        }
        else {
            this.moveBackwards();
        }
    }

    calculateNewDirection(map, destX, destY) {
        let mp = [];

        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            moves: []
        }]

        while (queue.length > 0) {
            const popped = queue.shift();
            if (popped.x === destX && popped.y === destY) {
                return popped.moves[0];
            }
            else {
                mp[popped.y][popped.x] = 1;
                const neighborList = this.addNeighbor(popped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return DIRECTION_UP; // DEFAULT
    }

    addNeighbor(popped, mp) {
        let queue = [];
        const numOfRows = mp.length;

        if (
            popped.x - 1 >= 0
            && popped.x - 1 < numOfRows
            && mp[popped.y][popped.x - 1] !== 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({x: popped.x - 1, y: popped.y, moves: tempMoves});
        }

        if (
            popped.x + 1 >= 0
            && popped.x + 1 < numOfRows
            && mp[popped.y][popped.x + 1] !== 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({x: popped.x + 1, y: popped.y, moves: tempMoves});
        }

        if (
            popped.y - 1 >= 0
            && popped.y - 1 < numOfRows
            && mp[popped.y - 1][popped.x] !== 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({x: popped.x, y: popped.y - 1, moves: tempMoves});
        }

        if (
            popped.y + 1 >= 0
            && popped.y + 1 < numOfRows
            && mp[popped.y + 1][popped.x] !== 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_DOWN);
            queue.push({x: popped.x, y: popped.y + 1, moves: tempMoves});
        }

        return queue;
    }

    draw() {
        canvasContext.save();

        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );

        canvasContext.restore();

        if (DEBUG) {
            canvasContext.beginPath();
            canvasContext.strokeStyle = "red";
            canvasContext.arc(
                this.x + oneBlockSize / 2,
                this.y + oneBlockSize / 2,
                this.range * oneBlockSize,
                0,
                2 * Math.PI
            );
            canvasContext.stroke();
        }
    }

    getMapX() {
        return parseInt(this.x / oneBlockSize);
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize);
    }
}
