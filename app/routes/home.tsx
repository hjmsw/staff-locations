import type { Route } from "./+types/home";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const users = await prisma.user.findMany();

  return users;
} 

export default function Home({ loaderData }: Route.ComponentProps) {
  const users = loaderData;

  return (
    <ul>
      {users.map(user => (
        <li>{user.name}</li>
      ))}
    </ul>
  )
}
