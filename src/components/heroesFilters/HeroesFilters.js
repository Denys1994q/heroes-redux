// стилі і картинки
import Spinner from '../spinner/Spinner';
// хуки 
import { useEffect } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useDispatch, useSelector } from 'react-redux';
import { activeFilterChanged } from '../heroesFilters/filtersSlice';
import { fetchedFilters, selectAll } from './filtersSlice'
import classNames from 'classnames';
import store from '../../store/index'

const HeroesFilters = () => {

    const { request } = useHttp();
    
    const filters = selectAll(store.getState())

    const {activeFilter} = useSelector(state => state.filters);
    const filtersLoadingStatus = useSelector(state => state.filters.filtersLoadingStatus)
    const dispatch = useDispatch(store.getState());

    useEffect(() => {
        // діспетчим функцію, яка діспетчить різні actions 
        dispatch(fetchedFilters(request))
    }, [])

    if (filtersLoadingStatus === "loading") {
        return <Spinner />;
    }
    else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    // формування верстки на основі отриманих даних із сервера
    const toShowFilters = filters.map(({name, label, style}) => {
        // додає клас активності, якщо ім'я фільтра збігається з фільтром, по якому клікнули 
        const btnClass = classNames(style, {
            'active': name === activeFilter
        })

        return (
            <button
                key={name}
                className={btnClass}
                onClick={() => dispatch(activeFilterChanged(name))} >
                {label}
            </button>
        )
    })

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {toShowFilters}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;