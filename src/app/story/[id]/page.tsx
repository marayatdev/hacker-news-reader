import { notFound } from 'next/navigation';
import axios from 'axios';

interface Story {
    id: number;
    title: string;
    by: string;
    score: number;
    url: string;
    kids?: number[];
}

interface Comment {
    id: number;
    text: string;
}


function sanitizeHtml(html: string) {
    return html
        .replace(/<script.*?>.*?<\/script>/gi, '')
        .replace(/on\w+=".*?"/gi, '')
        .replace(/javascript:/gi, '');
}

type StoryPageProps = {
    params: Promise<{ id: string }>;
};


export default async function StoryPage({ params }: StoryPageProps) {

    const realParams = await params;
    const id = realParams.id;

    const fetchStory = async (id: string): Promise<Story | null> => {
        try {
            const res = await axios.get<Story>(
                `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
                { timeout: 5000 }
            );
            return res.data;
        } catch {
            return null;
        }
    };

    const fetchComments = async (ids: number[] = []): Promise<Comment[]> => {
        const topComments = ids.slice(0, 5);
        try {
            const promises = topComments.map((id) =>
                axios
                    .get<Comment>(
                        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
                        { timeout: 5000 }
                    )
                    .then((res) => res.data)
            );
            return await Promise.all(promises);
        } catch {
            return [];
        }
    };

    const story = await fetchStory(id);
    if (!story) return notFound();

    const comments = story.kids ? await fetchComments(story.kids) : [];

    return (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold mb-4">{story.title}</h1>
            <p className="text-sm text-gray-600 mb-3">
                By <span className="font-semibold">{story.by}</span> | {story.score} points
            </p>
            <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-8 text-blue-600 hover:underline"
            >
                Visit External Link
            </a>

            {comments.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">Top Comments</h2>
                    <ul className="space-y-6">
                        {comments.map((comment) => (
                            <li
                                key={comment.id}
                                className="bg-gray-100 p-4 rounded-lg shadow-sm break-words"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(comment.text || ''),
                                }}
                            />
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}
