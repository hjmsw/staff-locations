import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

async function getUsers() {
  return await prisma.user.findMany();
}

export async function loader({ params }: Route.LoaderArgs) {
  return await getUsers();
} 

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData: loaderData,
  });

  const queryClient = useQueryClient();

  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <>
      <button type="button" onClick={() => queryClient.invalidateQueries({queryKey: ['users']})}>invalidate</button>
      <ul>
        {data?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  )
}
