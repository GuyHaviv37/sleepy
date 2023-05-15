// @ts-ignore
export const fetcher = (...args) => {
    try {
        const singleFetcher = (url: string) => fetch(url).then(res => res.json());
        if (args.length > 1) {
            return Promise.all(args.map(singleFetcher));
        }
        return singleFetcher(args as unknown as string);
    } catch (error) {
        console.log('fetcher error:', JSON.stringify(error, null, 2));
        throw error;
    }
}