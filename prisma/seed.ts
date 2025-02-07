import { PrismaClient } from '@prisma/client';
import { faker, fakerEN_GB } from '@faker-js/faker';

const prisma = new PrismaClient()
async function main() {

    const fakeUsers = Array.from(
        { length: 100 },
        () => {
            const name = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
            };

            return {
                name: `${name.firstName} ${name.lastName}`,
                email: faker.internet.email(name),
                location: {
                    name: fakerEN_GB.location.city(),
                    lat: fakerEN_GB.location.latitude(),
                    lon: fakerEN_GB.location.longitude(),
                }
            }
        }
    );
    
    for (const user of fakeUsers) {
        await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                location: {
                    create: {
                        ...user.location
                    }
                },
            }
        });
    }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })