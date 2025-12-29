
type BlogPostContents = {
  data: string;
};

type BlogPostInfo = {
  blogpostId: number,
  slug: string,
  title: string,
  teaser: string,
  isReady: boolean,
  imageUri: string,
  date: string,
  tags: Array<string>,
  likes?: number
};

type BlogPostInfoByTag = {
  blogpostId: number,
  slug: string,
  title: string,
  tags: string[],
  teaser: string
};

// -----
type BookSummaryInfo = {
  summaryId: number,
  title: string,
  author: string,
  link: string,
  teaser: string,
  imageUri: string,
  ogImageUri: string,
  isReady: boolean,
  slug: string,
  quality: number,
  seller: string,
  payoff: number
};

type BookSummaryContents = {
  data: string;
};

// -----
type FrontPageInfo = {
  postInfo: BlogPostInfo[],
  summaries: BookSummaryInfo[]
};

// -----
type EmailItem = {
  email: string,
  pageUri: string
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

type LikesItem = {
  id: number;
  likes: number;
  slug?: string;
}

type FaunaResponse = {
  statusCode: number;
  body: string;
}