"use client";
import AddPost from "./components/AddPost";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Post from "./components/Post";
import { PostType } from "./types/Post";
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPost ");
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery<PostType[]>({
    queryFn: allPosts,
    queryKey: ["posts"],
  });
  if (error) return error;
  if (isLoading) return "Loading....";
  return (
    <main>
      <AddPost />
      {data?.map((post, id) => (
        <Post
          key={id}
          postTitle={post.title}
          comments={post.Comment}
          id={post.id}
          name={post.user.name}
          avatar={post.user.image}
        />
      ))}
    </main>
  );
}
