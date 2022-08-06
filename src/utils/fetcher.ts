// @ts-ignore
export const fetcher = (...args) => {
    const singleFetcher = (url: string) => fetch(url).then(res => res.json());
    if (args.length > 1) {
        return Promise.all(args.map(singleFetcher));
    }
    return singleFetcher(args as unknown as string);
}