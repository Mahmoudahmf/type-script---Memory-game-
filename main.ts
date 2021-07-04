import { Icard } from './moduel/card.model';
import { Iprepare } from './moduel/prepare.model';
const prepare: Iprepare = {};
prepare.cards = [];
prepare.progress = 0;
prepare.clappingAudio = new Audio('./assets/audio/clapping.mp3');
prepare.fullTrack = new Audio('./assets/audio/track.mp3');
prepare.failAudio = new Audio('./assets/audio/fail.mp3');
prepare.gameOverAudio = new Audio('./assets/audio/game_over.mp3');
prepare.fullTrack.loop = true;

const numberOfCards = 24;
const tempNumbers = [];
let cardsHtmlContent = '';


const getRandomInt = (min, max) => {
    let result: number;
    let exists = true;
    min = Math.ceil(min);
    max = Math.floor(max);

    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;

        if (!tempNumbers.find(no => no === result.toString())) {
            exists = false;
            tempNumbers.push(result.toString())
        }

    }
    return result;
}

const toggleFlip = (index: number) => {
    prepare.fullTrack.play();

    const card = prepare.cards[index];
    if (!card.flip && card.clicKable) {
        flip(card, index);
        selectCard(card, index)
    }
}

const flip = (card: Icard, index: number) => {
    //prepare.flipAudio.play();
    if (card) {
        card.flip = card.flip === '' ? 'flip' : '';
        document.getElementById(`card-flip-${index}`).classList.value = card.flip;
    }
}

const selectCard = (card: Icard, index: number) => {
    if (!prepare.selectedCard_1) {
        prepare.selectedCard_1 = card;
        prepare.selectedIndex_1 = index;
    }
    else if (!prepare.selectedCard_2) {
        prepare.selectedCard_2 = card;
        prepare.selectedIndex_2 = index;
    }

    if (prepare.selectedCard_1 && prepare.selectedCard_2) {
        if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
            prepare.selectedCard_1.clicKable = false;
            prepare.selectedCard_2.clicKable = false;
            prepare.selectedCard_1 = null;
            prepare.selectedCard_2 = null;
            stopAudio(prepare.failAudio);
            stopAudio(prepare.clappingAudio);
            prepare.clappingAudio.play();
            changeProgress();
            checkFinish()
        }
        else {
            setTimeout(() => {
                stopAudio(prepare.failAudio);
                stopAudio(prepare.clappingAudio);
                prepare.failAudio.play();
                flip(prepare.selectedCard_1, prepare.selectedIndex_1);
                flip(prepare.selectedCard_2, prepare.selectedIndex_2);
                prepare.selectedCard_1 = null;
                prepare.selectedCard_2 = null;

            }, 1000)
        }
    }
}

const changeProgress = () => {
    const progress = prepare.cards.filter(card => !card.clicKable).length / numberOfCards *100;
    const progressElement = document.getElementById('progress');
    progressElement.style.width = `${progress}%`;
    progressElement.innerText = `${progress}%`;
}

const checkFinish = () => {
    if (prepare.cards.filter(card => !card.clicKable).length == numberOfCards) {
        stopAudio(prepare.failAudio);
        stopAudio(prepare.fullTrack);
        stopAudio(prepare.clappingAudio);
        prepare.gameOverAudio.play();
    }
}

const stopAudio = (audio: HTMLAudioElement) => {
    if (audio && audio.played) {
        audio.pause;
        audio.currentTime = 0;
    }
}


for (let index = 0; index < numberOfCards / 2; index++) {
    prepare.cards.push
        ({
            id: getRandomInt(0, numberOfCards),
            src: `./assets/img/${index}.jpg`,
            flip: '',
            clicKable: true,
            index

        });

    prepare.cards.push
        ({
            id: getRandomInt(0, numberOfCards),
            src: `./assets/img/${index}.jpg`,
            flip: '',
            clicKable: true,
            index

        });


};

prepare.cards.sort((a, b) => a.id > b.id ? 1 : -1);

prepare.cards.forEach((item, index) => {
    cardsHtmlContent +=
                               `<span class="col-sm-3 col-lg-2">
                                    <div onclick="toggleFlip(${index})" class="card-flip">
                                        <div id="card-flip-${index}">
                                            <div class="front">
                                                <div class="card">
                                                    <img class="card-img" src="./assets/brain.jpg"
                                                        alt="...loading">
                                                    <span class="card-content"></span>

                                                </div>
                                            </div>


                                            <div class="back">
                                                <div class="card">
                                                    <img src="./assets/img/${item.index}.jpg" alt="img"
                                                        style="height: 155px; width: 100%; display: block;">


                                                </div>

                                            </div>



                                        </div>

                                    </div>

                                </span>`;


});

document.getElementById('cards').innerHTML = cardsHtmlContent;