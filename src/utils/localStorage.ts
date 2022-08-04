export const getLocalStorageData = (key: string) => {
    if (typeof window !== undefined) {
        const jsonItem = window.localStorage.getItem(key);
        if (jsonItem) {
            return JSON.parse(jsonItem);
        }
    }
}

export const setLocalStorageData = (key: string, data: any) => {
    if (typeof window !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(data));
    } else return undefined;
    return data;
}

export const updateLocalStorageData = (key: string, newData: any) => {
    const existingData = getLocalStorageData(key);
    if (!existingData) return undefined;
    setLocalStorageData(key, {...existingData, ...newData});
    return {...existingData, ...newData};
}