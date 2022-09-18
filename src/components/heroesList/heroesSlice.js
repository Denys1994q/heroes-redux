import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

// createAsyncThunk - дозволяє комбінувати різні actions в межах одного action

// createEntityAdapter цікавий тим, що має вписані команди, які часто використовуються. Наприклад, команда по додаванню одного елементу чи багатьох, по видаленню одного чи кількох. Тому можна просто писати ці команди і не розписувати самостійно. 

// при цьому структура даних createEntityAdapter специфічна. Є id та enteties. Але enteties - це не масив з об'єктами як завжди, а об'єкт з об'єктами, тому методи масивів типу map з ним не працюватимуть. Але загалом в createEntityAdapter є методи, як можна перевести дані так як ми хочемо. Наприклад, щоб це був масив з об'єктами. Метод getSelectors.

// створюємо екземпляр createEntityAdapter з усіма методами 
// ми тут нічого не міняємо, бо в нас в джсон файлі в кожного героя написано так: heroes.id. Але якби було інакше, наприклад heroes.heroId, то це треба було б прописати. Є спеціальні методи в createEntityAdapter
const heroesAdapter = createEntityAdapter();

// формуємо initialState. Але не в ручну, а беремо відразу з адаптера, так як в ньому записано структуру
// при цьому можна додавати власні стейти. Ми додаємо heroesLoadingStatus
const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle',
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const { request } = useHttp(); 
        return request("http://localhost:3001/heroes");
    }
)

const heroesSlice = createSlice({
    name: 'heroes', // простір імен 
    initialState,
    reducers: { // reducer
        // actions
        addHero: (state, action) => {
            heroesAdapter.addOne(state, action.payload)
        },
        deleteHero: (state, action) => {
            heroesAdapter.removeOne(state, action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle'
                heroesAdapter.setAll(state, action.payload) // беремо наш стейт з героями і додаємо до нього все, що прийшло від сервера
            })
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error'
            })
            .addDefaultCase(() => {})
    } 
});

const {actions, reducer} = heroesSlice;

// повертає нам state.heroes у форматі масива з об'єктами
const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)

export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (filter, heroes) => {
        if (filter == 'all') {
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter);
        }
    }
)

export default reducer;
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    addHero,
    deleteHero
} = actions;



// без createEntityAdapter

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { useHttp } from '../../hooks/http.hook';

// const initialState = {
//     heroes: [], // герої з сервера - для сортування 
//     heroesLoadingStatus: 'idle',
// }

// export const fetchHeroes = createAsyncThunk(
//     'heroes/fetchHeroes',
//     () => {
//         const { request } = useHttp(); 
//         return request("http://localhost:3001/heroes");
//     }
// )

// const heroesSlice = createSlice({
//     name: 'heroes', // простір імен 
//     initialState,
//     reducers: { // reducer
//         // actions
//         addHero: (state, action) => {
//             state.heroes.push(action.payload)
//         },
//         deleteHero: (state, action) => {
//             state.heroes = state.heroes.filter(item => item.id !== action.payload)
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
//             .addCase(fetchHeroes.fulfilled, (state, action) => {
//                 state.heroesLoadingStatus = 'idle'
//                 state.heroes = action.payload
//             })
//             .addCase(fetchHeroes.rejected, state => {
//                 state.heroesLoadingStatus = 'error'
//             })
//             .addDefaultCase(() => {})
//     } 
// });

// const {actions, reducer} = heroesSlice;

// export default reducer;
// export const {
//     heroesFetching,
//     heroesFetched,
//     heroesFetchingError,
//     addHero,
//     deleteHero
// } = actions;