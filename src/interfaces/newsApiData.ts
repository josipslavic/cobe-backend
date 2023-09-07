export interface INewsAPIData {
  data: {
    status: string;
    articles: {
      source: {
        id: string | null;
        name: string;
      };
      author: string;
      title: string;
      description: string;
      url: string;
      urlToImage: string;
      publishedAt: string;
      content: string;
    }[];
  };
}
