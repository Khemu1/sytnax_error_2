#image base
FROM oven/bun AS build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

RUN bunx prisma generate

FROM oven/bun:slim

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

CMD ["bun" , "dev"]
