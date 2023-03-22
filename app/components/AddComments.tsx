"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { PostType } from "../../app/types/Posts";

type Comment = {
  postId?: string;
  title: string;
};
type PostProps = {
  id?: string;
};
export default function AddComment({ id }: PostProps) {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (data: Comment) =>
      await axios.post("/api/posts/addComments", { data }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message);
        }
        console.log(error);
        setIsDisabled(false);
        setTitle("");
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["detail-post"]);
        setTitle("");
        setIsDisabled(false);
        toast.success("Added your comment");
      },
    }
  );

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, postId: id });
    setIsDisabled(true);
    mutate({ title, postId: id });
  };
  return (
    <form onSubmit={submitComment} className='my-8'>
      <h3 className='text-xl'>Add a comment</h3>

      <div className='flex flex-col my-2'>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type='text'
          name='title'
          className='p-4 text-lg rounded-md my-2'
        />
      </div>
      <div className='flex items-center gap-2'>
        <button
          disabled={isDisabled}
          className=' text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25'
          type='submit'
        >
          Add Comment 🚀
        </button>
        <p
          className={`font-bold  ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          } `}
        >{`${title.length}/300`}</p>
      </div>
    </form>
  );
}
