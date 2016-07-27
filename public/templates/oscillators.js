function lbRun() {
    lbSendCode(mySong);
}

function mySong() {

    lbMsg("HI","This is my song");

    function play1() {
        useCharacter('square');
        //playSound(0.2,100);
        setTimeout(function() {
            useCharacter('sawtooth');
            //playSound(0.6,100);
        },1000)
        setTimeout(function() {
            useCharacter('sine');
            //playSound(0.8,500);
        },2000)
        setTimeout(function() {
            useCharacter('triangle');
            //playSound(0.8,500);
        },3000)
    }

    function play2(time,instrument) {
        setTimeout(function() {
            useCharacter(instrument);
            var pitch = 0.2;
            var t = setInterval(function() {
                playSound(pitch);
                pitch += 0.1;
                if (pitch >= 1) {
                    clearInterval(t);
                    stopSound();
                }
            },100)
        },time)
    }

    play1();
    //play2(0,'sawtooth');
    //play2(1000,'square');

}