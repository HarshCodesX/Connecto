import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {

    }
});

export default messagesSlice.reducer;