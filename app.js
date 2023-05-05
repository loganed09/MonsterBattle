const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
// const jsdom = require('jsdom');

const app = express();
// const dom = new jsdom.JSDOM("");
// const jquery = require('jquery')(dom.window);



app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('jquery', express.static(__dirname + '/node_modules/jquery/dist/'))


class Fighter {
    constructor(name, type) {
        this._name = name;
        this._type = type;
        this._HP = 100;
        this._photo = '';
        this._isKnockedOut = false;
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get HP() {
        return this._HP;
    }
    
    set HP(newHP) {
        this._HP = newHP
    }

    get isKnockedOut() {
        return this._isKnockedOut;
    }

    get photo() {
        return this._photo;
    }


    attack(target){
        let dmgDone = Math.floor(Math.random() * 100);
        let newHealth = target.HP - dmgDone;
        console.log(`${this._name} has hit ${target.name} for ${dmgDone} damage!`)
        if(newHealth <= 0) {
            target.HP = 0;
            target.toggleKnockOut();
            console.log(`${this.name} hit ${target.name} for ${dmgDone}. ${target.name} has ${target.HP} HP left.`);
            console.log(`${target.name} is knocked out!`)
        }else {
            target.HP = newHealth;
            console.log(`${this.name} hit ${target.name} for ${dmgDone}. ${target.name} has ${newHealth} HP left.`);
        }
    }

    toggleKnockOut() {
        if(!this._isKnockedOut){
            this._isKnockedOut = true;
        }else {
            this._isKnockedOut = false;0
        }
    }

    heal(healingAmt) {
        let healed = Math.floor(healingAmt)
        let totalHealth = this.HP + healed;

        if(this.HP <=0) {
            this.HP = 0;
        }else if(totalHealth > 100) {
            this.HP = 100
            console.log(`You healed for ${healed}. Giving ${this.name} ${this.HP} HP. You overhealed ${totalHealth - 100}.`)
        }else {
            this.HP = totalHealth
            console.log(`You healed for ${healed}.  Giving ${this.name} ${this.HP} HP.`)
        }            
    }

    revive() {
        if(this._isKnockedOut){
            this._HP = 30;
            this.toggleKnockOut();
            console.log(`${this.name} is revived with ${this.HP} HP.`)
        }else {
            console.log(`You are already alive!`)
        }
    }
};

let enemies = ['Smarlaz', 'Geadurd', 'Riamsnu']
let selectedTarget = '';
let character = {
    name: 'YOUR CHOICE!'
};
let newTarget = {
    name: 'THE TARGET!'
}

let testing = 'testing';
let attack;

// document.getElementById('attack-button').onclick = character.attack(newTarget);


const getRandomItem = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
}


app.get('/', (req, res) => {
    
    res.render('fighterMain', {character: character, newTarget: newTarget});
})

app.get('/fightScreen', (req, res) => {
    res.render('fightScreen', {character: character, newTarget: newTarget})
})



app.post('/', (req, res) => {
    character = new Fighter(req.body.characterSelect);
    selectedTarget = getRandomItem(enemies);
    newTarget = new Fighter(selectedTarget);
    // character.attack(newTarget);
    // newTarget.heal(20);
    //attack = character.attack(newTarget);
    // if (character.name === 'Blockman') {
    //     character._photo = '/images/Blockman.png';
    // }
    
    switch(character.name) {
        case 'Blockman':
            character._photo = '/images/blockMan.png'
            break;
        case 'Bugz':
            character._photo = '/images/bugz.png'
            break;
        case 'Butterfly':
            character._photo = '/images/butterfly.png'
            break;
        case 'Flowerz':
            character._photo = '/images/flower.png'
            break;
        case 'Multihead':
            character._photo = '/images/multiHead.png'
            break;
        case 'Squidman':
            character._photo = '/images/squidMan.png'
            break;
        default:
            character._photo = ''
    }

    console.log(req.body.characterSelect)
    console.log(character);
    console.log(newTarget);
    res.redirect('/');
})

app.post('/attack', (req, res) => {
    character.attack(newTarget);
    res.redirect('/');
})

app.post('/heal', (req, res) =>{
    character.heal();
    res.redirect('/');
})

// app.post('/fightScreen', (req, res) => {
//     character.heal(20);
//     res.redirect('fightScreen');
// })










app.listen(3000, () => {
console.log('Server started on port 3000');
});