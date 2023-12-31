import { useState, useEffect } from "react";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { postsRef } from "../firebase-config";
import PostCard from "../components/PostCard";

export default function HomePage({ showLoader }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(postsRef, orderBy("createdAt", "desc")); // order by: lastest post first
        const unsubscribe = onSnapshot(q, data => {
            showLoader(true);
            // map through all docs (object) from post collection
            // changing the data structure so it's all gathered in one object
            const postsData = data.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
            showLoader(false);
        });
        return () => unsubscribe(); // tell the post component to unsubscribe from listen on changes from firestore
    }, [showLoader]);

    return (
        <section className="page">
            <section className="grid-container">
                {posts.map(post => (
                    <PostCard post={post} key={post.id} />
                ))}
            </section>
        </section>
    );
}
