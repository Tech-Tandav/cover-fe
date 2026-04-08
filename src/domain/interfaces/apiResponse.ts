export interface IResponseApi<T> {
    count : number,
    current_page : number,
    page_size : number,
    total_pages : number,
    results : T,
}