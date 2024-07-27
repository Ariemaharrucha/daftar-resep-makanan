export async function getData<T>(url: string) {
    try {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error("fetching error");
        }
        const data = res.json() as T;
        return data;
    } catch (error) {
        console.log(error);
    }
}