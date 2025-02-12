Vue.component('firstColumn', {
    props: ['cards'],
    template: `
    <div class="firstColumn">
        <h2>Колонка 1</h2>
        <div v-for="(card, index) in cards" :key="card.id" class="card">
            <h3>{{ card.title }}</h3>
            <ul>
                <li v-for="(item, i) in card.items" :key="i">
                    <input type="checkbox" @change="checkCompletion(card)" v-model="item.checked"> {{ item.text }}
                </li>
            </ul>
        </div>
        <form class="cardAddForm" @submit.prevent="addCard">
            <input class="titleCardAddForm" v-model="newCardTitle" placeholder="Заголовок карточки" required>
            <textarea class="textCardAddForm" v-model="newCardItems" placeholder="Пункты через запятую" required></textarea>
            <button type="submit">Добавить карточку</button>
        </form>
    </div>`,
    data() {
        return {
            newCardTitle: '',
            newCardItems: ''
        }
    },
    methods: {
        addCard() {
            const itemArray = this.newCardItems.split(',').map(item => item.trim()).filter(item => item !== '');
            if (itemArray.length >=3 && itemArray.length <= 5) {
                const newCard = {
                    title: this.newCardTitle,
                    items: itemArray.map(text => ({ text, checked: false })),
                    completedItems: 0,
                };
                this.$emit('card-added', newCard);
                this.newCardTitle = '';
                this.newCardItems = '';
            }
            else {
                alert('Количество пунктов должно быть от 3 до 5');
            }
        },
        checkCompletion(card) {
            const completedCount = card.items.filter(item => item.checked).length;
            card.completedItems = completedCount;
            const completionPercentage = (completedCount / card.items.length) * 100;


            if (completionPercentage >= 50) {
                this.$emit('move-to-second', card);
            }
        }
    }
})

Vue.component('secondColumn', {
    props: ['cards'],
    template: `
    <div class="secondColumn">
        <h2>Колонка 2</h2>
        <div v-for="(card, index) in cards" :key="index" class="card">
            <h3>{{ card.title }}</h3>
            <ul>
                <li v-for="(item, i) in card.items" :key="i">
                    <input type="checkbox" @change="checkCompletion(card)" v-model="item.checked"> {{ item.text }}    
                </li>
            </ul>
        </div>
    </div>`,
    methods: {
        checkCompletion(card) {
            const completedCount = card.items.filter(item => item.checked).length;
            card.completedItems = completedCount;
            const completionPercentage = (completedCount / card.items.length) * 100;


            if (completionPercentage < 55) {
                this.moveBackToFirstColumn(card);
            } else if (completionPercentage === 100) {

                this.$emit('move-to-third', card);
            }
        },
        moveBackToFirstColumn(card) {
            this.$emit('move-back-to-first', card);
        }
    }
})

Vue.component('thirdColumn', {
    props: ['cards'],
    template: `
    <div class="thirdColumn">
        <h2>Колонка 3</h2>
        <div v-for="(card, index) in cards" :key="index" class="card">
            <h3>{{ card.title }} (Завершено: {{ card.completedAt || 'Не завершено' }})</h3>
            <ul>
                <li v-for="(item, i) in card.items" :key="i">
                    <input type="checkbox" disabled :checked="item.checked"> {{ item.text }}
                </li>
            </ul>
        </div>
    </div>`
})

new Vue({
    el: '#app',
    data() {
        return {
            firstColumnCards: JSON.parse(localStorage.getItem('firstColumn') || '[]'),
            secondColumnCards: JSON.parse(localStorage.getItem('secondColumn') || '[]'),
            thirdColumnCards: JSON.parse(localStorage.getItem('thirdColumn') || '[]'),
            isFirstColumnBlocked: false
        };
    },
    methods: {
        addCardToFirstColumn(card) {
            if (this.firstColumnCards.length < 3) {
                this.firstColumnCards.push(card);
                this.saveToLocalStorage();
            } else {
                alert("В первой колонке нельзя больше 3 карточек!");
            }
        },
        moveToSecondColumn(card) {
            if (this.secondColumnCards.length < 5) {
                this.firstColumnCards = this.firstColumnCards.filter(c => c !== card);
                this.secondColumnCards.push(card);
                this.saveToLocalStorage();
            } else {
                alert("Вторая колонка заполнена! Первая колонка заблокирована.");
                this.isFirstColumnBlocked = true;
            }
        },
        moveToFirstColumnFromSecond(card) {
            this.secondColumnCards = this.secondColumnCards.filter(c => c !== card);

            if (this.firstColumnCards.length < 3) {
                this.firstColumnCards.push(card);
                this.saveToLocalStorage();
            } else {
                alert("Первая колонка заполнена! Карточка не может быть перемещена.");
            }
        },
        moveToThirdColumn(card) {
            this.secondColumnCards = this.secondColumnCards.filter(c => c !== card);
            card.completedAt = new Date().toLocaleString();
            this.thirdColumnCards.push(card);
            this.saveToLocalStorage();
            this.isFirstColumnBlocked = false;
        },
        clearData() {
            localStorage.clear();
            this.firstColumnCards = [];
            this.secondColumnCards = [];
            this.thirdColumnCards = [];
            this.isFirstColumnBlocked = false;
        },
        saveToLocalStorage() {
            localStorage.setItem('firstColumn', JSON.stringify(this.firstColumnCards));
            localStorage.setItem('secondColumn', JSON.stringify(this.secondColumnCards));
            localStorage.setItem('thirdColumn', JSON.stringify(this.thirdColumnCards));
        }
    },
    watch: {
        firstColumnCards: { handler: function () { this.saveToLocalStorage(); }, deep: true },
        secondColumnCards: { handler: function () { this.saveToLocalStorage(); }, deep: true },
        thirdColumnCards: { handler: function () { this.saveToLocalStorage(); }, deep: true }
    }
});