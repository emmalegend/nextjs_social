"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
export default function AddPost() {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  //Create a post
  const { mutate } = useMutation(
    async (title: string) => await axios.post("/api/posts/addPost", { title }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          let err1 = error?.response?.data.message;
          let err2 = error?.response?.data.error;
          toast.error(err1 || err2);
        }
        setIsDisabled(false);
        setTitle("");
      },
      onSuccess: (data) => {
        toast.success("Post has been made 😊");
        queryClient.invalidateQueries(["posts"]);
        setTitle("");
        setIsDisabled(false);
      },
    }
  );
  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    mutate(title);
  };
  return (
    <form onSubmit={submitPost} className='my-8 p-8 rounded-md bg-white'>
      <div className='flex flex-col my-4'>
        <textarea
          name='title'
          value={title}
          placeholder="What's on your mind?"
          onChange={(e) => setTitle(e.target.value)}
          className='p-4 text-lg rounded-md my-2 bg-gray-200 outline-0'
        ></textarea>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${title.length}/300`}</p>
        <button
          disabled={isDisabled}
          type='submit'
          className='text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25'
        >
          Creat a Post
        </button>
      </div>
    </form>
  );
}
