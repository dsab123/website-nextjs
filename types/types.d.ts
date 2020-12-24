
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
    isReady: boolean,
    date: string,
    tags: Array<string>
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
    payoff: number
};

type BookSummaryContents = {
    data: string;
};

// -----
type Quotable = {
    quotableId: number,
    title: string,
    author: string,
    imageUri: string,
    teaser: string,
    slug: string,
    tags: Array<string>,
    quote: string,
    content: string
};

// -----
type FrontPageInfo = {
    postInfo: BlogPostInfo[],
    quotable: Quotable[],
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