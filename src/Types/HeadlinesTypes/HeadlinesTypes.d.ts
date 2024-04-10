interface HeadlinesTypes {
  status: string;
  totalResults: number;
  articles: Article[];
}

interface Article {
  source: Source;
  author: null | string;
  title: string;
  description: string;
  url: string;
  urlToImage: null | string;
  publishedAt: string;
  content: null | string;
}

interface Source {
  id: null | string;
  name: string;
}
