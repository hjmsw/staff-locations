import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { PrismaClient } from "@prisma/client";
import { useLoaderData } from "react-router";

const prisma = new PrismaClient();

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const getUsers = async () => {
  return await prisma.user.findMany();
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  return { dehydratedState: dehydrate(queryClient) };
}

const UsersList = () => {
  const { data, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const queryClient = useQueryClient();

  if (isFetching) {
    return <p>Fetching...</p>;
  }

  return (
    <>
      <button type="button" onClick={() => {
        console.log('invalidating...');
        queryClient.invalidateQueries({queryKey: ['users']})
      }}>invalidate</button>
      <ul>
        {data?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  )
}

export default function Home() {
  const { dehydratedState } = useLoaderData<typeof loader>()

  return (
    <HydrationBoundary state={dehydratedState}>
      <UsersList />
    </HydrationBoundary>
  )
}