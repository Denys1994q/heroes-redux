// стилі і картинки
import Spinner from '../spinner/Spinner';
// хуки 
import { useEffect, useCallback } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import {deleteHero, fetchHeroes, filteredHeroesSelector} from '../heroesList/heroesSlice';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// компоненти 
import HeroesListItem from "../heroesListItem/HeroesListItem";

const HeroesList = () => {
    const filteredHeroes = useSelector(filteredHeroesSelector);

    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus); //отримуємо з редусера стейт загрузки
    const dispatch = useDispatch(); // отримуємо з редусера ф-ію dispatch
    const { request } = useHttp(); // для надсилання запитів 

    useEffect(() => {
        dispatch(fetchHeroes());
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(dispatch(deleteHero(id)))
            .catch(err => console.log(err))
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    } 

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    appear={true}
                    in={true}
                    timeout={500}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }
        return arr.map(({ id, ...props }) => {
            return (
                <CSSTransition
                    appear={true}
                    in={true}
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem {...props} onDelete={() => onDelete(id)}  />
                </CSSTransition>
            )
        })
    }

    // як працює TransitionGroup

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component='ul'>
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;

// без createEntityAdapter

// // стилі і картинки
// import Spinner from '../spinner/Spinner';
// // хуки 
// import { useEffect, useCallback } from 'react';
// import { useHttp } from '../../hooks/http.hook';
// import { useDispatch, useSelector } from 'react-redux';
// import {deleteHero, fetchHeroes} from '../heroesList/heroesSlice';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { createSelector } from '@reduxjs/toolkit';
// // компоненти 
// import HeroesListItem from "../heroesListItem/HeroesListItem";


// const HeroesList = () => {

//     const filteredHeroesSelector = createSelector(
//         (state) => state.filters.activeFilter,
//         (state) => state.heroes.heroes,
//         (filter, heroes) => {
//             if (filter == 'all') {
//                 return heroes;
//             } else {
//                 return heroes.filter(item => item.element === filter);
//             }
//         }
//     )

//     const filteredHeroes = useSelector(filteredHeroesSelector);

//     const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus); //отримуємо з редусера стейт загрузки
//     const dispatch = useDispatch(); // отримуємо з редусера ф-ію dispatch
//     const { request } = useHttp(); // для надсилання запитів 

//     useEffect(() => {
//         dispatch(fetchHeroes());
//     }, []);

//     const onDelete = useCallback((id) => {
//         request(`http://localhost:3001/heroes/${id}`, 'DELETE')
//             .then(dispatch(deleteHero(id)))
//             .catch(err => console.log(err))
//     }, [request])

//     if (heroesLoadingStatus === "loading") {
//         return <Spinner />;
//     } else if (heroesLoadingStatus === "error") {
//         return <h5 className="text-center mt-5">Ошибка загрузки</h5>
//     } 

//     const renderHeroesList = (arr) => {
//         if (arr.length === 0) {
//             return (
//                 <CSSTransition
//                     appear={true}
//                     in={true}
//                     timeout={500}
//                     classNames="hero">
//                     <h5 className="text-center mt-5">Героев пока нет</h5>
//                 </CSSTransition>
//             )
//         }
//         return arr.map(({ id, ...props }) => {
//             return (
//                 <CSSTransition
//                     appear={true}
//                     in={true}
//                     key={id}
//                     timeout={500}
//                     classNames="hero">
//                     <HeroesListItem {...props} onDelete={() => onDelete(id)}  />
//                 </CSSTransition>
//             )
//         })
//     }

//     // як працює TransitionGroup

//     const elements = renderHeroesList(filteredHeroes);
//     return (
//         <TransitionGroup component='ul'>
//             {elements}
//         </TransitionGroup>
//     )
// }

// export default HeroesList;