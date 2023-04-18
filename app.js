const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();



app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

class Fighter {
    constructor(name, type) {
        this._name = name;
        this._type = type;
        this._HP = 100;
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


    attack(enemy){
        let dmgDone = Math.floor(Math.random() * 100);
        let newHealth = enemy.HP - dmgDone;
        console.log(`${this._name} has hit ${enemy.name} for ${dmgDone} damage!`)
        if(newHealth <= 0) {
            enemy.HP = 0;
            enemy.toggleKnockOut();
            console.log(`${this.name} hit ${enemy.name} for ${dmgDone}. ${enemy.name} has ${enemy.HP} HP left.`);
            console.log(`${enemy.name} is knocked out!`)
        }else {
            enemy.HP = newHealth;
            console.log(`${this.name} hit ${enemy.name} for ${dmgDone}. ${enemy.name} has ${newHealth} HP left.`);
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
let selectedEnemy = '';
let character = {
    name: 'YOUR CHOICE!'
};
let newEnemy = {
    name: 'THE ENEMY!'
}


const getRandomItem = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
}


app.get('/', (req, res) => {

    res.render('fighterMain', {character: character, newEnemy: newEnemy});
})

app.post('/', (req, res) => {
    character = new Fighter(req.body.characterSelect);
    selectedEnemy = getRandomItem(enemies);
    newEnemy = new Fighter(selectedEnemy);
    character.attack(newEnemy);
    newEnemy.heal(20);
    
    console.log(character);
    console.log(newEnemy);
    res.redirect('/');
})








app.listen(3000, () => {
console.log('Server started on port 3000');
});