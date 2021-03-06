// Caching the dom
const board = document.getElementById("board")
const redScore = document.getElementById("redScore")
const blackScore = document.getElementById("blackScore")
const playerTurn = document.getElementById("player")
const startButton = document.getElementById("start")


// fix for different screen size
const size = parseInt((window.innerHeight * 0.8) / 8)



const configRed = {
        "Player (Red)": "",
        "Time limit(ms)": 100,
        "maxDepth": 0,
        "player": 1,
    },
    configBlack = {
        "Player (Black)": "",
        "Time limit(ms)": 100,
        "maxDepth": 0,
        "player": -1,
    },
    firstTurn = {
        "First Turn": "Red"
    },
    iterations = {
        "Iterations": 0
    }



class Game {
    constructor(playerNum, score) {
        // keeps sequence of moves made till now
        this.from=""

        // the controller
        this.dgui = new dat.GUI();
        this.toggleInterval = false;
        //
        // Players
        this.playerRed = null;
        this.playerBlack = null;

        // automatic switch for ai vs ai
        this.redInterval = null;
        this.blackInterval = null;

        // state board
        this.boardState = new BoardState()
        // gui board, only contains the  circles
        this.guiState = this.twoDArray(8)

        // contains all the rectangles
        this.checkersBoard = [];
        this.two = new Two({
            width: window.innerHeight * 0.9,
            height: window.innerHeight * 0.9,
        }).appendTo(board);

        this.setUpSvgElements();
        this.setUpController()

        if (parseInt(localStorage.getItem("Iterations")) > parseInt(localStorage.getItem("thisIteration"))) {
            this.start()
            this.toggleAI()
        } else if(parseInt(localStorage.getItem("Iterations")) == parseInt(localStorage.getItem("thisIteration"))){
            console.log("Iteration Results","\nPlayers ",localStorage.getItem("Player info:  "),"\nIterations: ",parseInt(localStorage.getItem("thisIteration")),
            "\nRed: ",localStorage.getItem("Red"),"\nBlack: ",localStorage.getItem("Black"))
            this.clearLocalVariable()
        }
    }

    setUpController() {
        let iterationsController;
        let redFolder = this.dgui.addFolder("Player Red")
        let blackFolder = this.dgui.addFolder("Player Black")
        redFolder.open();
        blackFolder.open();
        let redController = redFolder.add(configRed, "Player (Red)", ['Human', 'AI', 'AI Random', 'AI Greedy'])
        let blackController = blackFolder.add(configBlack, "Player (Black)", ['Human', 'AI', 'AI Random', 'AI Greedy'])

        if (localStorage.getItem("Iterations") > 1 && parseInt(localStorage.getItem("Iterations")) >= parseInt(localStorage.getItem("thisIteration"))) {
            redController.setValue(localStorage.getItem("r_Player (Red)"))
            redFolder.add(configRed, "Time limit(ms)", 0).setValue(parseInt(localStorage.getItem("r_Time limit(ms)")))
            redFolder.add(configRed, "maxDepth", 0).setValue(parseInt(localStorage.getItem("r_maxDepth")))


            blackController.setValue(localStorage.getItem("b_Player (Black)"))
            blackFolder.add(configBlack, "Time limit(ms)", 0).setValue(parseInt(localStorage.getItem("b_Time limit(ms)")))
            blackFolder.add(configBlack, "maxDepth", 0).setValue(parseInt(localStorage.getItem("b_maxDepth")))
            this.dgui.add(firstTurn, "First Turn", ["Red", "Black"]).setValue(localStorage.getItem("First Turn"))
            iterationsController = this.dgui.add(iterations, "Iterations", 1, 100).setValue(localStorage.getItem("Iterations"))
            let x = localStorage.getItem("thisIteration")
            if (x == null)
                x = 1
            // console.log(x)
            localStorage.setItem("thisIteration", ++x)
        } else {
            // redController.setValue(localStorage.getItem("r_Player (Red)"))
            // redFolder.add(configRed, "Time limit(ms)", 0).setValue(localStorage.getItem("r_Time limit(ms)"))
            // redFolder.add(configRed, "maxDepth", 0).setValue(localStorage.getItem("r_maxDepth"))


            // blackController.setValue(localStorage.getItem("b_Player (Black)"))
            // blackFolder.add(configBlack, "Time limit(ms)", 0).setValue(localStorage.getItem("b_Time limit(ms)"))
            // blackFolder.add(configBlack, "maxDepth", 0).setValue(localStorage.getItem("b_maxDepth"))
            // this.dgui.add(firstTurn, "First Turn", ["Red", "Black"]).setValue(localStorage.getItem("First Turn"))
            // iterationsController=this.dgui.add(iterations, "Iterations", 1, 100).setValue(localStorage.getItem("Iterations"))
            // let x = localStorage.getItem("thisIteration")
            // if (x == null)
            //     x = 1
            // console.log(x)
            // localStorage.setItem("thisIteration", ++x)




            redController.setValue("AI")
            redFolder.add(configRed, "Time limit(ms)", 0)
            redFolder.add(configRed, "maxDepth", 0)


            blackController.setValue("AI")
            blackFolder.add(configBlack, "Time limit(ms)", 0)
            blackFolder.add(configBlack, "maxDepth", 0)

            this.dgui.add(firstTurn, "First Turn", ["Red", "Black"])
            iterationsController = this.dgui.add(iterations, "Iterations", 1, 100).setValue(1)
        }


        redController.__onChange = () => {
            if (configRed["Player (Red)"] == "Human") {
                while (redFolder.__controllers.length > 1) {
                    redFolder.remove(redFolder.__controllers[1])
                    redFolder.remove(redFolder.__controllers[1])
                }
            } else if (configRed["Player (Red)"] == "AI") {
                redFolder.add(configRed, "Time limit(ms)", 0),
                    redFolder.add(configRed, "maxDepth", 0)
            } else if (configRed["Player (Red)"] == "AI Random") {
                while (redFolder.__controllers.length > 1) {
                    redFolder.remove(redFolder.__controllers[1])
                    redFolder.remove(redFolder.__controllers[1])
                }
            } else if (configRed["Player (Red)"] == "AI Greedy") {
                while (redFolder.__controllers.length > 1) {
                    redFolder.remove(redFolder.__controllers[1])
                    redFolder.remove(redFolder.__controllers[1])
                }
            }
        }
        blackController.__onChange = () => {
            if (configBlack["Player (Black)"] == "AI") {
                blackFolder.add(configBlack, "Time limit(ms)", 0)
                blackFolder.add(configBlack, "maxDepth", 0)
            }
            if (configBlack["Player (Black)"] == "Human") {
                while (blackFolder.__controllers.length > 1) {
                    blackFolder.remove(blackFolder.__controllers[1])
                    blackFolder.remove(blackFolder.__controllers[1])
                }
            }
            if (configBlack["Player (Black)"] == "AI Random") {
                while (blackFolder.__controllers.length > 1) {
                    blackFolder.remove(blackFolder.__controllers[1])
                    blackFolder.remove(blackFolder.__controllers[1])
                }
            }
            if (configBlack["Player (Black)"] == "AI Greedy") {
                while (blackFolder.__controllers.length > 1) {
                    blackFolder.remove(blackFolder.__controllers[1])
                    blackFolder.remove(blackFolder.__controllers[1])
                }
            }
        }
        iterationsController.__onChange = () => {
            localStorage.setItem("Iterations", parseInt(iterations["Iterations"]))
        }



    }

    // setValuesFromLocalStorage() {
    //     let keys = Object.keys(configRed)
    //     keys.forEach((x) => {
    //         configRed[x] = localStorage.getItem(`r_${x}`)
    //         console.log(configRed[x])
    //     })
    //     keys = Object.keys(configBlack)
    //     keys.forEach((x) => {
    //         configBlack[x] = localStorage.getItem(`b_${x}`)
    //         console.log(configBlack[x])
    //     })
    //     firstTurn["First Turn"] = localStorage.getItem("First Turn")
    //     console.log(firstTurn["First Turn"])
    //     iterations["Iterations"] = localStorage.getItem("Iterations")
    //     console.log(iterations["Iterations"])
    // }



    twoDArray(x) {
        let k = []
        for (let i = 0; i < x; i++) {
            k.push([])
            for (let j = 0; j < x; j++) {
                k[i].push(0)
            }
        }
        return k
    }

    setUpSvgElements() {
        let state = this.boardState.getBoard()
        let guiState = this.guiState
        let t = this.two;
        for (let i = 0; i < state.length; i++) {
            let checkersBoardRow = []
            for (let j = 0; j < state[i].length; j++) {
                // the board rectangles
                let rec = t.makeRectangle(i * size + size / 1.5, j * size + size / 1.5, size, size);
                if ((i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0))
                    rec.fill = "rgba(0,0,0,1)"
                else if (!(i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)) {
                    rec.fill = "rgba(255,255,255,1)"
                }

                checkersBoardRow.push(rec);

                // player circles
                // red =1
                if (state[j][i] == 1) {
                    let c = t.makeCircle(i * size + size / 1.5, j * size + size / 1.5, size / 2.1);
                    c.fill = "#FF0000"
                    c.noStroke();
                    guiState[j][i] = c;
                }
                // black =-1 
                else if (state[j][i] == -1) {
                    let c = t.makeCircle(i * size + size / 1.5, j * size + size / 1.5, size / 2.1);
                    c.fill = "#000000"
                    c.noStroke();
                    guiState[j][i] = c;
                }
            }
            this.checkersBoard.push(checkersBoardRow)
        }
        t.update();
    }

    addOnClickToElements() {
        let guiState = this.guiState,
            board = this.boardState.getBoard();
        if (configBlack["Player (Black)"] == "Human" || configRed["Player (Red)"] == "Human")
            for (let i = 0; i < guiState.length; i++) {
                for (let j = 0; j < guiState[i].length; j++) {

                    // onclick event for player red and black
                    if (configRed["Player (Red)"] == "Human" && board[i][j] == configRed.player) {
                        guiState[i][j]._renderer.elem.setAttribute("pos", `${i}_${j}`);
                        guiState[i][j]._renderer.elem.onclick = (e) => {
                            if (this.selected != null && this.guiState[this.selected[0]][this.selected[1]] != null)
                                this.guiState[this.selected[0]][this.selected[1]].noStroke();
                            let x = e.target.getAttribute("pos")[0],
                                y = e.target.getAttribute("pos")[2]
                            this.guiState[x][y].stroke = "#0F0"
                            this.selected = [x, y]
                            this.guiState[x][y].linewidth = 5;
                            this.two.update()

                        }
                    } else if (configBlack["Player (Black)"] == "Human" && board[i][j] == configBlack.player) {
                        guiState[i][j]._renderer.elem.setAttribute("pos", `${i}_${j}`);
                        guiState[i][j]._renderer.elem.onclick = (e) => {

                            if (this.selected != null && this.guiState[this.selected[0]][this.selected[1]] != null)
                                this.guiState[this.selected[0]][this.selected[1]].noStroke();
                            let x = e.target.getAttribute("pos")[0],
                                y = e.target.getAttribute("pos")[2]
                            this.guiState[x][y].stroke = "#0F0"
                            this.selected = [x, y]
                            this.guiState[x][y].linewidth = 5;
                            this.two.update()

                        }
                    }

                    // // onclick event for player circle
                    // if (guiState[i][j] != 0) {
                    //     guiState[i][j]._renderer.elem.setAttribute("pos", `${i}_${j}`);
                    //     guiState[i][j]._renderer.elem.onclick = (e) => {

                    //         if (this.selected[0] != null && this.guiState[this.selected[0]][this.selected[1]] != null)
                    //             this.guiState[this.selected[0]][this.selected[1]].noStroke();
                    //         let x = e.target.getAttribute("pos")[0],
                    //             y = e.target.getAttribute("pos")[2]
                    //         if ((configRed["Player (Red)"] == "Human") || (configRed["Player (Red)"] != "AI" ^ this.boardState.getBoard()[x][y] != configRed.player)) {
                    //             this.guiState[x][y].stroke = "#0F0"
                    //             this.selected = [x, y]
                    //             this.guiState[x][y].linewidth = 5;
                    //             this.two.update()
                    //         }
                    //     }
                    // }

                    // onclick event for the board rectangles

                    this.checkersBoard[i][j]._renderer.elem.setAttribute("pos", `${i}_${j}`);
                    this.checkersBoard[i][j]._renderer.elem.onclick = (e) => {
                        let x = e.target.getAttribute("pos")[0],
                            y = e.target.getAttribute("pos")[2]

                        // Human move start
                        if (this.selected != null && BoardState.isMoveLegal({
                                x: this.selected[0],
                                y: this.selected[1]
                            }, {
                                x: y,
                                y: x
                            }, this, this.boardState.getBoard())) {
                            let t = this.two;
                            let boardState = this.boardState.getBoard();
                            // let _elem=document.getElementById(this.guiState[this.selected[0]][this.selected[1]].id)
                            // _elem   .attributes[0].textContent=`matrix(1 0 0 1 ${parseInt(x * size + size / 1.5)} ${y * size + size / 1.5})`
                            this.guiState[this.selected[0]][this.selected[1]].translation.set(x * size + size / 1.5, y * size + size / 1.5)
                            this.guiState[this.selected[0]][this.selected[1]].noStroke()
                            this.guiState[y][x] = Object.assign(t.makeCircle(), this.guiState[this.selected[0]][this.selected[1]])
                            // this.guiState[y][x]=this.guiState[this.selected[0]][this.selected[1]]
                            boardState[y][x] = boardState[this.selected[0]][this.selected[1]]
                            boardState[this.selected[0]][this.selected[1]] = 0
                            // console.log("human  move: ", y, x, x * size + size / 1.5, y * size + size / 1.5)
                            this.guiState[y][x]._renderer.elem.setAttribute("pos", `${y}_${x}`)
                            this.guiState[this.selected[0]][this.selected[1]] = 0
                            if (y == 0 || y == 7) {
                                this.setKing([y, x], boardState[y][x])
                            }
                            this.selected = null
                            //Human move complete

                            // if playing with AI and human's turn is first
                            this.makeComputerMoveForHuman()

                            if (configRed["Player (Red)"] == "Human" || configBlack["Player (Black)"] == "Human")
                                this.updateScore()
                        }
                        this.two.update()
                    }

                }
            } else {

            }
        this.two.update();
    }

    makePlayerRedMove() {
        if (configRed["Player (Red)"] == "AI" || configRed["Player (Red)"] == "AI Random" || configRed["Player (Red)"] == "AI Greedy") {
            this.makeComputerMove(this.playerRed.getAction(this.boardState), this.boardState.getBoard(), this.guiState, this.two, this)
        }
    }
    makePlayerBlackMove() {
        if (configBlack["Player (Black)"] == "AI" || configBlack["Player (Black)"] == "AI Random" || configBlack["Player (Black)"] == "AI Greedy") {
            let action = this.playerBlack.getAction(this.boardState);
            this.makeComputerMove(action, this.boardState.getBoard(), this.guiState, this.two, this)
        }
    }

    makeComputerMoveForHuman() {
        this.makePlayerRedMove()
        this.makePlayerBlackMove()
    }

    restart() {
        window.location.reload()
    }

    makeComputerMove(action, board, guiState, two, thisRef) {
        // console.log(action)
        if (action === null) {
            thisRef.updateScore(true);
            return
        }
        this.from+=`${action[0].x}_${action[0].y},`
        if((this.from.match(new RegExp(`${action[0].x}_${action[0].y},`, "g")) || []).length>50 
        && configBlack["Player (Black)"]=="AI" && configRed["Player (Red)"]=="AI"){
            thisRef.updateScore("draw"); 

        }
        // console.log(board[action[0].x][action[0].y], " {", action[0].x, action[0].y, "} ---> {", action[1].x, action[1].y, "} ", board[action[1].x][action[1].y])
        // console.log(BoardState.getLegalActions(1,board))
        let pX = action[0].x,
            pY = action[0].y,
            nX = action[1].x,
            nY = action[1].y
        // console.log(action)
        BoardState.isMoveLegal({
            x: pX,
            y: pY
        }, {
            x: nX,
            y: nY
        }, thisRef, board)
        guiState[pX][pY].translation.set(parseInt(nY * size + size / 1.5), parseInt(nX * size + size / 1.5))
        guiState[nX][nY] = Object.assign(two.makeCircle(), guiState[pX][pY])
        board[nX][nY] = board[pX][pY]
        board[pX][pY] = 0
        guiState[nX][nY]._renderer.elem.setAttribute("pos", `${nX}_${nY}`)
        guiState[pX][pY] = 0
        if (nX == 0 || nX == 7) {
            thisRef.setKing([nX, nY], board[nX][nY])
        }
        two.update();
        thisRef.updateScore();
    }

    setKing(coord, player) {
        let board = this.boardState.getBoard()
        if (board[coord[0]][coord[1]] == red) {
            board[coord[0]][coord[1]] = 1.1
        } else if (board[coord[0]][coord[1]] == black) {
            board[coord[0]][coord[1]] = -1.1
        }
        // console.log(player)
        if (player == 1)
            this.guiState[coord[0]][coord[1]].fill = "#B55"
        else if (player == -1)
            this.guiState[coord[0]][coord[1]].fill = "#999"
        // this.two.update();
    }


    removeMiddlePiece(coord) {
        // console.log("remove piece", coord)
        // x.attributes[0].textContent="matrix(1 0 0 1 70.667 266.667)"
        let x = document.getElementById(this.guiState[coord[0]][coord[1]].id)
        x.remove();
        this.guiState[coord[0]][coord[1]].remove();
        this.guiState[coord[0]][coord[1]] = 0;
        this.boardState.getBoard()[coord[0]][coord[1]] = 0
        // this.selected=null
        this.two.update();
    }

    setLocalVariables() {
        // console.log('setting local storage')
        let keys = Object.keys(configRed)
        keys.forEach((x) => {
            localStorage.setItem(`r_${x}`, configRed[x])
        })
        keys = Object.keys(configBlack)
        keys.forEach((x) => {
            localStorage.setItem(`b_${x}`, configBlack[x])
        })
        localStorage.setItem("First Turn", firstTurn["First Turn"])
        localStorage.setItem("Iterations", parseInt(iterations["Iterations"]))
        localStorage.setItem("thisIteration", parseInt(0))
        localStorage.setItem("Red", parseInt(0))
        localStorage.setItem("Black", parseInt(0))
        localStorage.setItem("Player info:  ", `Red: ${configRed["Player (Red)"]}, Black: ${configBlack["Player (Black)"]}`)
    }

    start() {

        this.addOnClickToElements();
        // vs Human
        // console.log((configBlack["Player (Black)"] == "AI Random" && !(configRed["Player (Red)"] == "AI Random")))
        if (configRed["Player (Red)"] == "AI") {
            this.playerRed = new AI(configRed)
            // if (firstTurn["First Turn"] == "Red") {
            //     this.makeComputerMoveForHuman()
            // }
        } else if (configRed["Player (Red)"] == "AI Random") {
            this.playerRed = new AIRandom(configRed)
            // if (firstTurn["First Turn"] == "Black") {
            //     this.makeComputerMoveForHuman()
            // }
        } else if (configRed["Player (Red)"] == "AI Greedy") {
            this.playerRed = new AIGreedy(configRed)
            // if (firstTurn["First Turn"] == "Black") {
            //     this.makeComputerMoveForHuman()
            // }
        }

        // console.log(configBlack["Player (Black)"] == "AI" )
        // console.log((configRed["Player (Black)"] == "AI Greedy"))
        if (configBlack["Player (Black)"] == "AI") {
            this.playerBlack = new AI(configBlack)
            // if (firstTurn["First Turn"] == "Black") {
            //     this.makeComputerMoveForHuman()
            // }
        } else if (configBlack["Player (Black)"] == "AI Random") {
            this.playerBlack = new AIRandom(configBlack)
            // if (firstTurn["First Turn"] == "Black") {
            //     this.makeComputerMoveForHuman()
            // }
        } else if (configBlack["Player (Black)"] == "AI Greedy") {
            // console.log("working")
            this.playerBlack = new AIGreedy(configBlack)
            // if (firstTurn["First Turn"] == "Black") {
            //     this.makeComputerMoveForHuman()
            // }
        }
        // if (configBlack["Player (Black)"] == "AI" && configRed["Player (Red)"] == "AI") {
        //     // this.playerBlack = new AI(configBlack)
        //     // this.playerRed = new AI(configRed)
        //     document.getElementById("ai").style.display = "inline"
        // }
        startButton.remove()
        this.dgui.close();
        // console.log(this.playerRed, this.playerBlack)
    }

    aiMove() {
        if (firstTurn["First Turn"] == "Black") {
            this.makePlayerBlackMove()
            firstTurn["First Turn"] = "Red"
        } else {
            this.makePlayerRedMove()
            firstTurn["First Turn"] = "Black"
        }
    }


    toggleAI() {
        this.toggleInterval = !this.toggleInterval;

        if (this.toggleInterval) {
            // console.log(firstTurn["First Turn"] == "Red", firstTurn["First Turn"] == "Black", this.blackInterval)
            this.blackInterval = setInterval(() => {
                    // console.log("working inside")
                    if (firstTurn["First Turn"] == "Black") {
                        this.makePlayerBlackMove()
                        firstTurn["First Turn"] = "Red"
                    }
                    // this.two.update()
                }, configBlack["Time limit(ms)"] + 100),
                this.redInterval = setInterval(() => {
                    if (firstTurn["First Turn"] == "Red") {
                        this.makePlayerRedMove()
                        firstTurn["First Turn"] = "Black"
                    }
                    // this.two.update()
                }, configRed["Time limit(ms)"] + 100)
        } else {
            this.clearIntervals()
        }

    }

    startIteration() {
        // && iterations.Iterations > 1 &&
        // localStorage.getItem("Iterations") >= localStorage.getItem("thisIteration")
        if (configRed["Player (Red)"] != "Human" && configBlack["Player (Black)"] != "Human" && iterations.Iterations > 1) {
            this.setLocalVariables()
            this.start()
            this.toggleAI()
        } else {
            alert("No humans allowed for iteration and number of iteration should be > 1")
        }
    }

    clearLocalVariable(){
        let keys = Object.keys(configRed)
        keys.forEach((x) => {
            localStorage.removeItem(`r_${x}`)
        })
        keys = Object.keys(configBlack)
        keys.forEach((x) => {
            localStorage.removeItem(`b_${x}`)
        })
        localStorage.removeItem("First Turn")
        localStorage.removeItem("Iterations")
        localStorage.removeItem("thisIteration")
        localStorage.removeItem("Red")
        localStorage.removeItem("Black")
        localStorage.removeItem("Player info:  ")
    }

    stopIteration(){
        this.clearLocalVariable()
        this.restart()
    }

    clearIntervals() {
        clearInterval(this.blackInterval)
        clearInterval(this.redInterval)
    }


    updateScore(noAction) {
        if (noAction) {
            playerTurn.innerHTML = "No more moves left. The player with no moves loses."
            // this.restart()
        }
        if(noAction=="draw"){
            playerTurn.innerHTML = "Draw since players are stuck in making same moves"
            this.clearIntervals()
            setTimeout(() => {
                    this.restart()
            }, 100)
        }
        let board = this.boardState.getBoard(),
            red = 0,
            black = 0;
        for (let i = 0; i < board.length; i++)
            for (let j = 0; j < board[i].length; j++) {
                if (parseInt(board[i][j]) == 1)
                    red++
                else if (parseInt(board[i][j]) == -1) black++
            }
        redScore.innerHTML = red
        blackScore.innerHTML = black
        // if (parseInt(this.boardState.getTurn()) == 1)
        //     playerTurn.innerHTML = "RED"
        // else playerTurn.innerHTML = "BLACK"
        if (red == 0) {
            playerTurn.innerHTML = "Black wins"
            this.clearIntervals()
            setTimeout(() => {
                if (parseInt(localStorage.getItem("Iterations")) > parseInt(localStorage.getItem("thisIteration"))) {
                    let x = parseInt(localStorage.getItem("Black"))
                    localStorage.setItem("Black", parseInt(++x))
                    this.restart()
                }

            }, 100)
        } else if (black == 0) {
            playerTurn.innerHTML = "Red wins"
            this.clearIntervals()
            setTimeout(() => {
                if (parseInt(localStorage.getItem("Iterations")) > parseInt(localStorage.getItem("thisIteration"))) {
                    let x = parseInt(localStorage.getItem("Red"))
                    localStorage.setItem("Red", parseInt(++x))
                    this.restart()
                }
            }, 100)
        }
    }

}