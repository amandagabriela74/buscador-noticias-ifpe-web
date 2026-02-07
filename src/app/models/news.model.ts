interface NewsItem {
  id: string;
  titulo: string;
  conteudo: string;
  campus: string;
  url: string;
}

interface SearchResponse {
  termo: string;
  total: number;
  resultados: NewsItem[];
}

export { NewsItem, SearchResponse };