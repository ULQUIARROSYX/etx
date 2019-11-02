/*
export function someMutation (state) {
}
*/

export const setOpId = (state, val) => {
    state.opId = val
}
export const setMenu = (state, val) => {
    state.menuList = val
}
export const resetInfo = (state) => {
    state.opId = 0
    state.menuList = []
}
