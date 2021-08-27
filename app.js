

const game = (function(){
   

    //DOM
    const conteiner = document.querySelector('.conteiner');
    const gameboardArray = document.querySelectorAll('.box');
    const restartButton = document.querySelector('#restart');
    const twoPlayerButton = document.querySelector('#twoPlayer');
    const onePlayerButton = document.querySelector('#onePlayer');
    const playerOneSelectionButtons = document.querySelectorAll('.onePlayerSelectionXO');
    const playerTwoSelectionButtons = document.querySelectorAll('.twoPlayerSelectionXO');
    const playerOneLabel = document.querySelector('#playerOneLabel');
    const playerTwoLabel = document.querySelector('#playerTwoLabel');

    playerOneSelectionButtons.forEach(element => {
        element.style.display = 'none';
    });

    playerTwoSelectionButtons.forEach(element => {
        element.style.display = 'none';
    });


    conteiner.style.display = 'none';
    restartButton.style.display = 'none';
    


    const gameboard = (function(){
        publicGameboard = [];

        let optionsAvailableForComputer = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        const appendValueToGameboardArray = function(index, value){
            publicGameboard[index - 1] = value;
           
        }

        const resertOptionsAvailable = function(){
            optionsAvailableForComputer.splice(0, optionsAvailableForComputer.length);
            arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            Array.prototype.push.apply(optionsAvailableForComputer, arr);
        }

        const popOptionsAvailable = function(number){
            optionsAvailableForComputer.forEach(element => {
                if(element === parseInt(number)){
                    optionsAvailableForComputer.splice(optionsAvailableForComputer.indexOf(element) , 1);
                }
            });
        }

        const cleanGameboardArray = function(){
            publicGameboard.splice(0, publicGameboard.length);
        }

        return{
            publicGameboard,
            optionsAvailableForComputer,
            appendValueToGameboardArray, 
            cleanGameboardArray,
            resertOptionsAvailable,
            popOptionsAvailable,            
        }
    })();
    
    const Player = function(name){
        const active = false;
        const type = '';
        const boxClicked =  [];
        const yourTurn = false;
        let winCounter = 0;

        const appendValueToBox = function(position){
            boxClicked.push(position);
        }

      
        const incrementWinCounter = function(){
            winCounter++;
        }

        const getWinCounter = function(){
            return winCounter;
        }
        
        const cleanBoxClicked = function(){
            boxClicked.splice(0, boxClicked.length)
        }
        
        const firstTurn = function(){
            if(this.type === 'X'){
                this.yourTurn = true;
            }
            else{
                this.yourTurn = false;
            }
        }   

      
        return{ name, type, active, yourTurn, boxClicked, appendValueToBox, incrementWinCounter, getWinCounter, cleanBoxClicked, firstTurn}
    }


    
    const render = (function(){
        const loadGameboard = function(){
            gameboardArray.forEach(element => {
                for(i = 0; i < gameboard.publicGameboard.length; i++){
                    if(element.id == i + 1 ){
                        element.textContent = gameboard.publicGameboard[i];
                    }       
                } 
            }); 
        }

        const cleanGameboard = function(){
            gameboardArray.forEach(element => {
                element.textContent = '';
                element.className = 'box';
            });
        }
       
        const showButtons = function(query, valueDisplay){
            document.querySelector(query).style.display = valueDisplay;
        }

        const hideButtons = function(query){
            document.querySelector(query).style.display = 'none';
        }

      
        const displayWinCounter = function(player, label){
            label.textContent = player.getWinCounter();
            
        }

        const changeNameTargetButton = function(target, newName){
            target.textContent = `${newName}`;
        }

        const paintWinningCombination = function(arrWinner){
            gameboardArray.forEach(el => {
                for(let i = 0; i < arrWinner.length; i++){
                    if(el.id === arrWinner[i]){
                        el.className = 'winningCombination';
                    }
                }
            });
        }

        const disabledBoxButtons = function(){
            gameboardArray.forEach(element => {
                element.disabled = true;
            });
        }

        const abledBoxButtons = function(){
            gameboardArray.forEach(element => {
                element.disabled = false;
            });
        }

        return{
            loadGameboard,
            showButtons,
            changeNameTargetButton,
            hideButtons,
            displayWinCounter,
            cleanGameboard,
            paintWinningCombination,
            disabledBoxButtons,
            abledBoxButtons
        }

    })();

    const checkWinner = function(player){
        const winningCombination = [['1', '5', '9'], ['1', '2', '3'], ['1', '4', '7'],  ['2', '5', '8'], ['3', '6', '9'], ['3', '5', '7'], ['4', '5', '6'], ['7', '8', '9']];

        let checker = (arr, target) => target.every((v) => arr.includes(v))

        winningCombination.forEach(element => {
            if(checker(player.boxClicked, element)){
                player.incrementWinCounter();
                render.disabledBoxButtons();
                render.displayWinCounter(p1, playerOneLabel);
                if(p2.active){
                    render.displayWinCounter(p2, playerTwoLabel);
                }
                else if(c1.active){
                    render.displayWinCounter(c1, playerTwoLabel);
                }
                render.paintWinningCombination(element);
                render.changeNameTargetButton(restartButton, 'PLAY AGAIN');

            }
        });
    }

    const checkTie = function(){
        let tie = 0;
        if(p2.active){
            tie = p1.boxClicked.length + p2.boxClicked.length;
        }
        else if(c1.active){
            tie = p1.boxClicked.length + c1.boxClicked.length;
        }

        if(tie === 9){
            render.changeNameTargetButton(restartButton, 'PLAY AGAIN');
        }
    }


    const changeTurn = function(){
        if(p1.yourTurn){
            p1.yourTurn = false;
            if(p2.active){
                p2.yourTurn = true;
            } 
            else if(c1.active){
                c1.yourTurn = true;
            }
        }
        else{
            p1.yourTurn = true;
            if(p2.active){
                p2.yourTurn = false;
            }
            else if(c1.active){
                c1.yourTurn = false;
            }
        }
    }

    const restartHandler = function(){
        gameboard.cleanGameboardArray();
        gameboard.resertOptionsAvailable();
        p1.cleanBoxClicked();
        if(p2.active){
            p2.cleanBoxClicked();
        }
        else if(c1.active){
            c1.cleanBoxClicked();
            
        }
        
        render.cleanGameboard();
        render.loadGameboard();
        render.abledBoxButtons();
        render.changeNameTargetButton(restartButton, 'RESTART');
        p1.firstTurn();
        p2.firstTurn();
        c1.firstTurn();

        if(c1.active && c1.type == 'X'){
            computerMoves(generateNumberForComputer());
            render.loadGameboard();
        }
    }

    const twoPlayerButtonHandler = function(){
        render.hideButtons('#twoPlayer');
        render.hideButtons('#onePlayer');
        render.showButtons('#X', 'inline');
        render.showButtons('#O', 'inline');
        p1.active = true;
        p2.active = true;
    }
    
    const onePlayerButtonHandler = function(){
        render.hideButtons('#twoPlayer');
        render.hideButtons('#onePlayer');
        render.showButtons('#X', 'inline');
        render.showButtons('#O', 'inline');
        p1.active = true;
        c1.active = true;
    }

    const defineType = function(){
        if(p1.type === 'X'){
            p2.type = 'O'
            c1.type = 'O'
        }
        else{
            if(p2.active){
                p2.type = 'X';
            }
            else if(c1.active){
                c1.type = 'X';
            }
        }
    }

    const selectionbuttonsHandler = function(e){
        p1.type = e.target.id;
        defineType();
        
        p1.firstTurn();
        p2.firstTurn();
        c1.firstTurn();

        render.hideButtons('#twoPlayer');
        render.hideButtons('#onePlayer');
        render.hideButtons('#X');
        render.hideButtons('#O');
        render.showButtons('.conteiner', 'flex');
        render.showButtons('#restart', 'inline');
        if(c1.active && c1.type == 'X'){
            computerMoves(generateNumberForComputer());
            render.loadGameboard();
        }
    }

    const gameboardClickedHandler = function(e){
        if(p1.yourTurn && e.target.textContent ===''){
            gameboard.appendValueToGameboardArray(e.target.id, p1.type)
            gameboard.popOptionsAvailable(e.target.id);
            p1.appendValueToBox(e.target.id);
            checkWinner(p1);
            checkTie();
            changeTurn();

            if(c1.active && gameboard.optionsAvailableForComputer.length != 0){
                computerMoves(generateNumberForComputer());
            }   
        }
        else if(p2.active){
            if(p2.yourTurn &&  e.target.textContent ===''){
                gameboard.appendValueToGameboardArray(e.target.id, p2.type);
                p2.appendValueToBox(e.target.id);
                checkWinner(p2);
                checkTie();
                changeTurn();
            }
        }
       
        render.loadGameboard();
    }

    const generateNumberForComputer = function(){
        
        function random(mn, mx) { 
            return Math.random() * (mx - mn) + mn; 
        } 
        const number = gameboard.optionsAvailableForComputer[Math.floor(random(0, gameboard.optionsAvailableForComputer.length))];

        gameboard.popOptionsAvailable(number);
        return number;
    }
    
    const computerMoves = function(number){
        if(c1.yourTurn){
            gameboard.appendValueToGameboardArray(number.toString(), c1.type)
            c1.appendValueToBox(number.toString());
            checkWinner(c1);
            checkTie();
            changeTurn();
        }
    }

    const log2 = function(n)
    {
        return (n==1)? 0 : 1 + log2(n/2);
    }

    const computerBestMoves = function(){
        
        if(c1.yourTurn){
            
            let number = minimax(0, 0, true, gameboard.optionsAvailableForComputer, gameboard.optionsAvailableForComputer.length);

            gameboard.appendValueToGameboardArray(number.toString(), c1.type)
            c1.appendValueToBox(number.toString());
            checkWinner(c1);
            checkTie();
            changeTurn();
        }

    }

    const minimax = function (depth, nodeIndex, isMax, scores, h)
    {

        if (depth == h){
            return scores[nodeIndex];
        }
            
        if (isMax){
            return Math.max(minimax(depth+1, nodeIndex*2, false, scores, h), minimax(depth+1, nodeIndex*2 + 1, false, scores, h));
        }
        else{
            return Math.min(minimax(depth+1, nodeIndex*2, true, scores, h), minimax(depth+1, nodeIndex*2 + 1, true, scores, h));
        }      
    }


    const p1 = Player('PlayerOne')
    const p2 = Player('PlayerTwo')
    const c1 = Player('Computer');
    
    //events

    //click event two players game
    twoPlayerButton.addEventListener('click', twoPlayerButtonHandler);

    onePlayerButton.addEventListener('click', onePlayerButtonHandler);


    //click event which select X or O for the player one
    playerTwoSelectionButtons.forEach(element => {
        element.addEventListener('click', selectionbuttonsHandler);
    })
    playerOneSelectionButtons.forEach(element => {
        element.addEventListener('click', selectionbuttonsHandler);
    })


    gameboardArray.forEach(element => {
        element.addEventListener('click', gameboardClickedHandler)  
    });
    
   

    restartButton.addEventListener('click', restartHandler);

})();

