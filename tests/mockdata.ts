const serverPort = process.env.PORT || 3000;
const serverURL = `http://localhost:${serverPort}`;

type PostConcrete = {
    _id?: string;
    title: string;
    content: string;
    sender_id?: string;
    createdAt?: string;
    updatedAt?: string;
};

const posts: PostConcrete[] = [
    {
        title: "First Post",
        content: "This is the content of the first post.",
    },
    {
        title: "Second Post",
        content: "This is the content of the second post.",
    },
    {
        title: "Third Post",
        content: "This is the content of the third post.",
    }
];

type CommentConcrete = {
    _id?: string;
    message: string;
    post_id: string;
    sender_id?: string;
    createdAt?: string;
    updatedAt?: string;
};


const comments: CommentConcrete[] = [
    {
        message: "This is a comment on the first post.",
        post_id: "507f1f77bcf86cd799439011",
    },
    {
        message: "This is another comment on the first post.",
        post_id: "507f1f77bcf86cd799439011",
    },
    {
        message: "This is a comment on the second post.",
        post_id: "507f1f77bcf86cd799439012",
    }
];

export { 
    serverURL, 
    posts, 
    PostConcrete,
    comments,
    CommentConcrete
};