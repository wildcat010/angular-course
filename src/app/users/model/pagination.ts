interface IPagination {
  per_page: number;
  length: number;
  page_index: number;
}

export class Pagination implements IPagination {
  per_page: number;
  length: number;
  page_index: number;
}
