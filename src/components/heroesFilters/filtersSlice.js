import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    activeFilter: 'all',
    filtersLoadingStatus: 'idle',
});

export const fetchedFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const { request } = useHttp(); 
        return request("http://localhost:3001/filters")
    }
)

const filtersSlice = createSlice({
    name: 'filters',  
    initialState,
    reducers: { // reducer
        // actions
        // filtersFetching: state => {state.filtersLoadingStatus = 'loading'},
        // getFilters: (state, action) => {
        //     state.filtersLoadingStatus = 'idle'
        //     state.filters = action.payload
        // },
        // filtersFetchingError: state => {
        //     state.filtersLoadingStatus = 'error'
        // },
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder 
            .addCase(fetchedFilters.pending,  state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchedFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle'
                filtersAdapter.setAll(state, action.payload)
            })
            .addCase(fetchedFilters.rejected, state => {
                state.filtersLoadingStatus = 'error'
            })
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = filtersSlice;

export default reducer;

// повертає нам state.filters у форматі масива з об'єктами
export const {selectAll} = filtersAdapter.getSelectors(state => state.filters)

export const {activeFilterChanged} = actions;




// без createEntityAdapter

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { useHttp } from '../../hooks/http.hook';

// const initialState = {
//     filters: [], 
//     activeFilter: 'all',
//     filtersLoadingStatus: 'idle',
// }

// export const fetchedFilters = createAsyncThunk(
//     'filters/fetchFilters',
//     () => {
//         const { request } = useHttp(); 
//         return request("http://localhost:3001/filters")
//     }
// )

// const filtersSlice = createSlice({
//     name: 'filters',  
//     initialState,
//     reducers: { // reducer
//         // actions
//         filtersFetching: state => {state.filtersLoadingStatus = 'loading'},
//         getFilters: (state, action) => {
//             state.filtersLoadingStatus = 'idle'
//             state.filters = action.payload
//         },
//         filtersFetchingError: state => {
//             state.filtersLoadingStatus = 'error'
//         },
//         activeFilterChanged: (state, action) => {
//             state.activeFilter = action.payload
//         }
//     },
//     extraReducers: (builder) => {
//         builder 
//             .addCase(fetchedFilters.pending,  state => {state.filtersLoadingStatus = 'loading'})
//             .addCase(fetchedFilters.fulfilled, (state, action) => {
//                 state.filtersLoadingStatus = 'idle'
//                 state.filters = action.payload
//             })
//             .addCase(fetchedFilters.rejected, state => {
//                 state.filtersLoadingStatus = 'error'
//             })
//             .addDefaultCase(() => {})
//     }
// });

// const {actions, reducer} = filtersSlice;

// export default reducer;
// export const {
//     filtersFetching,
//     getFilters,
//     filtersFetchingError,
//     activeFilterChanged
// } = actions;