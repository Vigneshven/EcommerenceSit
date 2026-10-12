import { createSlice ,type PayloadAction } from "@reduxjs/toolkit";
import type { Inputs } from "../component/ProductFilterForm";

const initialState: Inputs={
    search:"",
    category:"all",
    company:"all",
    sortBy:"a-z",
    selling_price:4000,
    free_shipping:false
}

const filterSlice = createSlice({
    name:"filters",
    initialState,
    reducers:{
        setFilters:(_state,action:PayloadAction<Inputs>)=> action.payload,
        resetFilters:()=>initialState,
    }
})

export const {setFilters,resetFilters} = filterSlice.actions
export default filterSlice.reducer