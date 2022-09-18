// картинки і стилі 
// компоненти
// хуки 
import { useHttp } from '../../hooks/http.hook';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { addHero } from '../heroesList/heroesSlice';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store/index';
// import { selectAll, fetchedFilters } from '../heroesFilters/filtersSlice';

const HeroesAddForm = () => {

    const { request } = useHttp();
    const dispatch = useDispatch(store.getState());

    // тут не вийшло використати через const filters = selectAll(store.getState()). Просто не перерендерювався стейт, коли приходили фільтри в іншому компоненті. Тому було зроблено просто через useSelector, але потім довелося перевести цей об'єкт з об'єктами (бо так працює createEntityAdapter) в масив за допомогою команди Object.values(filters). 
    const filters = useSelector(state => state.filters.entities)
    const filtersArr = Object.values(filters)

    const postChanges = (newHero) => {
        const id = uuidv4();
        const w = { ...newHero, id: id }
        dispatch(addHero(w));
        request(`http://localhost:3001/heroes/`, 'POST', JSON.stringify(w))
    }

    const filtersName = filtersArr.map(({ name, label }) => {
        if (name == 'all') {
            return
        }
        return (
            <option value={name}>{label}</option>
        )
    })

    return (
        <>
            <Formik
                initialValues={{
                    name: '',
                    description: '',
                    element: '',
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('This field is required'),
                    description: Yup.string().required('This field is required'),
                })}
                onSubmit={(values, { resetForm }) => {
                    postChanges(values);
                    resetForm({ values: '' })
                }}>

                <Form className="border p-4 shadow-lg rounded">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                        <Field
                            type="text"
                            name="name"
                            className="form-control"
                            id="name"
                            placeholder="Как меня зовут?" />
                        <ErrorMessage style={{ 'color': 'red' }} name='name' component='div' />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="text" className="form-label fs-4">Описание</label>
                        <Field
                            name="description"
                            className="form-control"
                            id="text"
                            placeholder="Что я умею?"
                            style={{ "height": '130px' }} />
                        <ErrorMessage style={{ 'color': 'red' }} name='description' component='div' />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                        <Field as='select'
                            required
                            className="form-select"
                            id="element"
                            name="element">
                            <option >Я владею элементом...</option>
                            {filtersName}
                        </Field >
                    </div>

                    <button type="submit" className="btn btn-primary">Создать</button>
                </Form>
            </Formik>
        </>
    )
}

export default HeroesAddForm;