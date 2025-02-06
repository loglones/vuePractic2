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
            const itemArray = this.newCardItems.split(',').map(item => ({text: item.trim(), checked: false}));
            if (itemArray.length >=3 && itemArray.length <= 5) {
                const newCard = {
                    title: this.newCardTitle,
                    items: itemArray,
                    complitedItems: 0,
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
            if (completionPercentage > 50) {
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
    </div>`,
    methods: {
        checkCompletion(card) {
            const completedCount = card.items.filter(item => item.checked).length;
            card.completedItems = completedCount;
            const completionPercentage = (completedCount / card.items.length) * 100;

            // Если карточка достигла 100% выполнения
            if (completionPercentage === 100) {
                this.$emit('move-to-third', card);
            }
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
            else {
                alert("В первой колонке нельзя больше 3 карточек!");
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