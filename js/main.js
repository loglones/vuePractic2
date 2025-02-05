Vue.component('firstColumn', {
    props: ['cards'],
    template: `
    <div class="firstColumn">
        <h2>Колонка 1</h2>
        <div v-for="(card, index) in cards" :key="card.id" class="card">
            <h3>{{ card.title }}</h3>
            <ul>
                <li v-for="(item, i) in card.items" :key="i">
                    <input type="checkbox" @change="checkComplection(card)"> {{ item }}
                </li>
            </ul>
        </div>
        <form @submit.prevent="addCard">
            <input v-model="newCardTitle" placeholder="Заголовок карточки" required>
        </form>
    </div>`,
    data: {
        return {
            cards: [

            ]
        }
    }
})

new Vue ({
    el: '#app',
    data() {
        return {
            firstColumnCards:JSON.parse(localStorage.getItem('firstColumn') || '[]'),
        };
    },
    methods: {
        addCardToFirstColumn(card) {
            if(this.firstColumnCards.length < 3){
                this.firstColumnCards.push(card);
                this.saveToLocalStorage();
            }
        },
        clearData() {
            localStorage.clear();
            this.firstColumnCards = [];
        },
        saveToLocalStorage() {
            localStorage.setItem('firstColumn', JSON.stringify(this.firstColumnCards));
        }
    },
    watch: {
        firstColumnCards: {
            handler() {
                this.saveToLocalStorage();
            },
            deep: true,
        }
    }
});