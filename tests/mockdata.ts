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

export { 
    serverURL, 
    posts, 
    PostConcrete 
};